from uuid import UUID

from fastapi import HTTPException, status
from sqlmodel import Session

from app.models.common import OrderStatus, utcnow
from app.models.order import Order, OrderItem
from app.models.user import User
from app.repositories.carts import CartRepository
from app.repositories.orders import OrderRepository
from app.repositories.products import ProductRepository
from app.schemas.order import CheckoutRequest, CheckoutResponse
from app.services.payments import PaymentService


class CheckoutService:
    def __init__(self, session: Session) -> None:
        self.session = session
        self.cart_repository = CartRepository(session)
        self.order_repository = OrderRepository(session)
        self.product_repository = ProductRepository(session)
        self.payment_service = PaymentService()

    def create_checkout(
        self,
        *,
        user: User | None,
        session_id: str | None,
        payload: CheckoutRequest,
    ) -> CheckoutResponse:
        cart = self.cart_repository.get_by_user_id(user.id) if user else None
        if not cart and session_id:
            cart = self.cart_repository.get_by_session_id(session_id)
        if not cart:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found.")

        cart_rows = self.cart_repository.list_items_with_products(cart.id)
        if not cart_rows:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart is empty.")

        product_ids = [product.id for _, product, _ in cart_rows]
        locked_inventory = self.product_repository.lock_inventory_rows(product_ids)

        subtotal = 0
        order = Order(
            user_id=user.id if user else None,
            cart_id=cart.id,
            email=payload.email,
            shipping_address=payload.shipping_address.model_dump(),
            session_id=session_id,
            notes=payload.notes,
        )
        self.order_repository.create_order(order)

        for cart_item, product, _ in cart_rows:
            inventory = locked_inventory.get(product.id)
            if not inventory or inventory.stock < cart_item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"{product.name} does not have enough stock.",
                )

            inventory.stock -= cart_item.quantity
            inventory.updated_at = utcnow()
            line_total = product.price_cents * cart_item.quantity
            subtotal += line_total
            self.order_repository.add_order_item(
                OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    product_name=product.name,
                    image_url=product.image_url,
                    quantity=cart_item.quantity,
                    unit_price_cents=product.price_cents,
                )
            )

        order.subtotal_amount_cents = subtotal
        order.total_amount_cents = subtotal
        self.order_repository.save(order)
        self.session.commit()

        order_items = self.order_repository.list_items(order.id)
        try:
            checkout_session = self.payment_service.create_checkout_session(
                order=order,
                items=order_items,
                success_url=str(payload.success_url) if payload.success_url else None,
                cancel_url=str(payload.cancel_url) if payload.cancel_url else None,
            )
        except Exception as exc:
            self._release_reserved_inventory(order.id, reason=str(exc))
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unable to create Stripe checkout session.",
            ) from exc

        order.stripe_checkout_session_id = checkout_session.id
        self.order_repository.save(order)
        self.session.commit()
        return CheckoutResponse(
            order_id=order.id,
            stripe_session_id=checkout_session.id,
            checkout_url=checkout_session.url,
        )

    def handle_webhook(self, event: dict) -> None:
        event_id = event.get("id")
        event_type = event.get("type", "")
        if not event_id or not self.order_repository.record_webhook_event(
            event_id=event_id,
            event_type=event_type,
            payload=event,
        ):
            self.session.commit()
            return

        data_object = event.get("data", {}).get("object", {})
        metadata = data_object.get("metadata", {}) or {}
        order_id = metadata.get("order_id")
        checkout_session_id = data_object.get("id")
        order = None
        if order_id:
            order = self.order_repository.get_by_id(UUID(order_id))
        if not order and checkout_session_id:
            order = self.order_repository.get_by_checkout_session(checkout_session_id)
        if not order:
            self.session.commit()
            return

        if event_type == "checkout.session.completed":
            if order.status != OrderStatus.PAID:
                order.status = OrderStatus.PAID
                order.stripe_checkout_session_id = checkout_session_id
                order.stripe_payment_intent_id = data_object.get("payment_intent")
                self.order_repository.save(order)
                if order.cart_id:
                    self.cart_repository.clear_cart(order.cart_id)
            self.session.commit()
            return

        if event_type in {"checkout.session.expired", "checkout.session.async_payment_failed", "payment_intent.payment_failed"}:
            self._release_reserved_inventory(
                order.id,
                reason=f"Stripe event: {event_type}",
                failure_status=OrderStatus.PAYMENT_FAILED,
            )
            return

        self.session.commit()

    def _release_reserved_inventory(
        self,
        order_id: UUID,
        *,
        reason: str,
        failure_status: OrderStatus = OrderStatus.CANCELED,
    ) -> None:
        order = self.order_repository.get_by_id(order_id)
        if not order or order.status != OrderStatus.AWAITING_PAYMENT:
            self.session.commit()
            return

        items = self.order_repository.list_items(order_id)
        locked_inventory = self.product_repository.lock_inventory_rows([item.product_id for item in items])
        for item in items:
            inventory = locked_inventory.get(item.product_id)
            if inventory:
                inventory.stock += item.quantity
                inventory.updated_at = utcnow()

        order.status = failure_status
        order.notes = reason
        self.order_repository.save(order)
        self.session.commit()

