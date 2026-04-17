from datetime import UTC, datetime
from uuid import UUID

from sqlmodel import Session, select

from app.models.content import WebhookEvent
from app.models.order import Order, OrderItem


class OrderRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def create_order(self, order: Order) -> Order:
        self.session.add(order)
        self.session.flush()
        return order

    def add_order_item(self, item: OrderItem) -> OrderItem:
        self.session.add(item)
        self.session.flush()
        return item

    def list_by_user(self, user_id: UUID) -> list[Order]:
        statement = select(Order).where(Order.user_id == user_id).order_by(Order.created_at.desc())
        return list(self.session.exec(statement).all())

    def get_by_id(self, order_id: UUID) -> Order | None:
        statement = select(Order).where(Order.id == order_id)
        return self.session.exec(statement).first()

    def get_by_checkout_session(self, session_id: str) -> Order | None:
        statement = select(Order).where(Order.stripe_checkout_session_id == session_id)
        return self.session.exec(statement).first()

    def list_items(self, order_id: UUID) -> list[OrderItem]:
        statement = select(OrderItem).where(OrderItem.order_id == order_id)
        return list(self.session.exec(statement).all())

    def save(self, order: Order) -> Order:
        order.updated_at = datetime.now(UTC)
        self.session.add(order)
        self.session.flush()
        return order

    def record_webhook_event(self, *, event_id: str, event_type: str, payload: dict) -> bool:
        existing = self.session.exec(select(WebhookEvent).where(WebhookEvent.event_id == event_id)).first()
        if existing:
            return False
        self.session.add(WebhookEvent(event_id=event_id, type=event_type, payload=payload))
        self.session.flush()
        return True

