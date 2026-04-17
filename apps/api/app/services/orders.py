from uuid import UUID

from fastapi import HTTPException, status
from sqlmodel import Session

from app.models.user import User
from app.repositories.orders import OrderRepository
from app.schemas.order import OrderItemRead, OrderRead


class OrderService:
    def __init__(self, session: Session) -> None:
        self.repository = OrderRepository(session)

    def list_orders(self, user: User) -> list[OrderRead]:
        orders = self.repository.list_by_user(user.id)
        return [self._serialize_order(order.id) for order in orders]

    def get_order(self, user: User, order_id: UUID) -> OrderRead:
        order = self.repository.get_by_id(order_id)
        if not order or order.user_id != user.id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")
        return self._serialize_order(order.id)

    def _serialize_order(self, order_id: UUID) -> OrderRead:
        order = self.repository.get_by_id(order_id)
        items = self.repository.list_items(order_id)
        return OrderRead(
            id=order.id,
            email=order.email,
            status=order.status,
            currency=order.currency,
            subtotal_amount_cents=order.subtotal_amount_cents,
            total_amount_cents=order.total_amount_cents,
            stripe_checkout_session_id=order.stripe_checkout_session_id,
            created_at=order.created_at,
            updated_at=order.updated_at,
            shipping_address=order.shipping_address,
            items=[OrderItemRead.model_validate(item) for item in items],
        )

