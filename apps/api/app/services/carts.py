from uuid import UUID

from fastapi import HTTPException, status
from sqlmodel import Session

from app.models.cart import Cart
from app.repositories.carts import CartRepository
from app.repositories.products import ProductRepository
from app.schemas.cart import CartItemRead, CartItemWrite, CartRead


class CartService:
    def __init__(self, session: Session) -> None:
        self.session = session
        self.cart_repository = CartRepository(session)
        self.product_repository = ProductRepository(session)

    def get_cart_model(self, *, user_id: UUID | None, session_id: str | None, create: bool = True) -> Cart | None:
        if user_id:
            return self.cart_repository.get_or_create(user_id=user_id, session_id=session_id) if create else (
                self.cart_repository.get_by_user_id(user_id) or (
                    self.cart_repository.get_by_session_id(session_id) if session_id else None
                )
            )

        if session_id:
            return self.cart_repository.get_or_create(session_id=session_id) if create else self.cart_repository.get_by_session_id(session_id)

        return None

    def get_cart(self, *, user_id: UUID | None, session_id: str | None) -> CartRead:
        cart = self.get_cart_model(user_id=user_id, session_id=session_id, create=True)
        if not cart:
            return CartRead()
        return self._build_cart_read(cart)

    def upsert_item(self, *, user_id: UUID | None, session_id: str | None, payload: CartItemWrite) -> CartRead:
        cart = self.get_cart_model(user_id=user_id, session_id=session_id, create=True)
        if not cart:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart context missing.")

        product = self.product_repository.get_by_id(payload.product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")

        inventory = self.product_repository.get_inventory(payload.product_id)
        if not inventory or inventory.stock <= 0:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Product is out of stock.")

        existing_item = self.cart_repository.get_item(cart.id, payload.product_id)
        requested_quantity = payload.quantity
        if existing_item and payload.mode == "add":
            requested_quantity = existing_item.quantity + payload.quantity
        if requested_quantity > inventory.stock:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Only {inventory.stock} units are available for this product.",
            )

        self.cart_repository.upsert_item(
            cart=cart,
            product_id=payload.product_id,
            quantity=payload.quantity,
            mode=payload.mode,
        )
        self.session.commit()
        return self._build_cart_read(cart)

    def remove_item(self, *, user_id: UUID | None, session_id: str | None, product_id: UUID) -> CartRead:
        cart = self.get_cart_model(user_id=user_id, session_id=session_id, create=False)
        if not cart:
            return CartRead()
        self.cart_repository.remove_item(cart, product_id)
        self.session.commit()
        return self._build_cart_read(cart)

    def clear_cart(self, cart_id: UUID) -> None:
        self.cart_repository.clear_cart(cart_id)
        self.session.commit()

    def merge_guest_cart_to_user(self, *, session_id: str | None, user_id: UUID) -> None:
        if not session_id:
            return
        guest_cart = self.cart_repository.get_by_session_id(session_id)
        if not guest_cart:
            return
        user_cart = self.cart_repository.get_or_create(user_id=user_id, session_id=session_id)
        if guest_cart.id == user_cart.id:
            user_cart.user_id = user_id
            self.session.add(user_cart)
            self.session.flush()
            return
        self.cart_repository.merge_carts(source=guest_cart, target=user_cart)
        self.session.flush()

    def _build_cart_read(self, cart: Cart) -> CartRead:
        rows = self.cart_repository.list_items_with_products(cart.id)
        items: list[CartItemRead] = []
        subtotal = 0
        total_items = 0
        for cart_item, product, inventory in rows:
            line_subtotal = product.price_cents * cart_item.quantity
            items.append(
                CartItemRead(
                    product_id=product.id,
                    name=product.name,
                    slug=product.slug,
                    image_url=product.image_url,
                    unit_price_cents=product.price_cents,
                    quantity=cart_item.quantity,
                    subtotal_cents=line_subtotal,
                    stock_available=inventory.stock if inventory else 0,
                )
            )
            subtotal += line_subtotal
            total_items += cart_item.quantity
        return CartRead(id=cart.id, items=items, total_items=total_items, subtotal_cents=subtotal)

