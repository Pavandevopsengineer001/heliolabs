from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.core.dependencies import get_current_user_optional, get_optional_session_id
from app.db.session import get_session
from app.models.user import User
from app.schemas.cart import CartItemRemove, CartItemWrite, CartRead
from app.services.carts import CartService

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("", response_model=CartRead)
def get_cart(
    session: Session = Depends(get_session),
    user: User | None = Depends(get_current_user_optional),
    session_id: str | None = Depends(get_optional_session_id),
) -> CartRead:
    return CartService(session).get_cart(user_id=user.id if user else None, session_id=session_id)


@router.post("", response_model=CartRead)
def upsert_cart_item(
    payload: CartItemWrite,
    session: Session = Depends(get_session),
    user: User | None = Depends(get_current_user_optional),
    session_id: str | None = Depends(get_optional_session_id),
) -> CartRead:
    return CartService(session).upsert_item(
        user_id=user.id if user else None,
        session_id=session_id,
        payload=payload,
    )


@router.delete("/item", response_model=CartRead)
def remove_cart_item(
    payload: CartItemRemove,
    session: Session = Depends(get_session),
    user: User | None = Depends(get_current_user_optional),
    session_id: str | None = Depends(get_optional_session_id),
) -> CartRead:
    return CartService(session).remove_item(
        user_id=user.id if user else None,
        session_id=session_id,
        product_id=payload.product_id,
    )

