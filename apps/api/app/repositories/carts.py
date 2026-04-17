from datetime import UTC, datetime
from uuid import UUID

from sqlmodel import Session, select

from app.models.cart import Cart, CartItem
from app.models.product import Inventory, Product


class CartRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get_by_user_id(self, user_id: UUID) -> Cart | None:
        statement = select(Cart).where(Cart.user_id == user_id)
        return self.session.exec(statement).first()

    def get_by_session_id(self, session_id: str) -> Cart | None:
        statement = select(Cart).where(Cart.session_id == session_id)
        return self.session.exec(statement).first()

    def get_or_create(self, *, user_id: UUID | None = None, session_id: str | None = None) -> Cart:
        cart = self.get_by_user_id(user_id) if user_id else None
        if not cart and session_id:
            cart = self.get_by_session_id(session_id)
        if cart:
            if user_id and cart.user_id is None:
                cart.user_id = user_id
            if session_id and not cart.session_id:
                cart.session_id = session_id
            cart.updated_at = datetime.now(UTC)
            self.session.add(cart)
            self.session.flush()
            return cart

        cart = Cart(user_id=user_id, session_id=session_id)
        self.session.add(cart)
        self.session.flush()
        return cart

    def validate_user_cart(self, *, cart: Cart, user_id: UUID) -> bool:
        """Validate that the cart belongs to the specified user."""
        return cart.user_id == user_id

    def validate_session_cart(self, *, cart: Cart, session_id: str) -> bool:
        """Validate that the cart belongs to the specified session and is not assigned to a user."""
        return cart.session_id == session_id and cart.user_id is None

    def list_items(self, cart_id: UUID) -> list[CartItem]:
        statement = select(CartItem).where(CartItem.cart_id == cart_id)
        return list(self.session.exec(statement).all())

    def list_items_with_products(self, cart_id: UUID) -> list[tuple[CartItem, Product, Inventory | None]]:
        statement = (
            select(CartItem, Product, Inventory)
            .join(Product, Product.id == CartItem.product_id)
            .join(Inventory, Inventory.product_id == Product.id, isouter=True)
            .where(CartItem.cart_id == cart_id)
        )
        return list(self.session.exec(statement).all())

    def get_item(self, cart_id: UUID, product_id: UUID) -> CartItem | None:
        statement = select(CartItem).where(
            CartItem.cart_id == cart_id,
            CartItem.product_id == product_id,
        )
        return self.session.exec(statement).first()

    def upsert_item(self, *, cart: Cart, product_id: UUID, quantity: int, mode: str) -> CartItem:
        item = self.get_item(cart.id, product_id)
        if item:
            item.quantity = item.quantity + quantity if mode == "add" else quantity
            self.session.add(item)
        else:
            item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
            self.session.add(item)
        cart.updated_at = datetime.now(UTC)
        self.session.add(cart)
        self.session.flush()
        return item

    def remove_item(self, cart: Cart, product_id: UUID) -> None:
        item = self.get_item(cart.id, product_id)
        if item:
            self.session.delete(item)
            cart.updated_at = datetime.now(UTC)
            self.session.add(cart)
            self.session.flush()

    def clear_cart(self, cart_id: UUID) -> None:
        for item in self.list_items(cart_id):
            self.session.delete(item)
        self.session.flush()

    def delete_cart(self, cart: Cart) -> None:
        self.clear_cart(cart.id)
        self.session.delete(cart)
        self.session.flush()

    def merge_carts(self, *, source: Cart, target: Cart) -> None:
        source_items = self.list_items(source.id)
        for item in source_items:
            target_item = self.get_item(target.id, item.product_id)
            if target_item:
                target_item.quantity += item.quantity
                self.session.add(target_item)
            else:
                self.session.add(CartItem(cart_id=target.id, product_id=item.product_id, quantity=item.quantity))
        target.updated_at = datetime.now(UTC)
        self.session.add(target)
        self.delete_cart(source)

