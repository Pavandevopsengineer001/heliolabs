from uuid import UUID

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.core.dependencies import get_current_user
from app.db.session import get_session
from app.models.user import User
from app.schemas.order import OrderRead
from app.services.orders import OrderService

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("", response_model=list[OrderRead])
def list_orders(user: User = Depends(get_current_user), session: Session = Depends(get_session)) -> list[OrderRead]:
    return OrderService(session).list_orders(user)


@router.get("/{order_id}", response_model=OrderRead)
def get_order(
    order_id: UUID,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> OrderRead:
    return OrderService(session).get_order(user, order_id)

