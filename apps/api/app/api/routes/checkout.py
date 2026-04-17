from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.core.dependencies import get_current_user_optional, get_required_session_id
from app.db.session import get_session
from app.models.user import User
from app.schemas.order import CheckoutRequest, CheckoutResponse
from app.services.checkout import CheckoutService

router = APIRouter(prefix="", tags=["checkout"])


@router.post("/checkout", response_model=CheckoutResponse)
def create_checkout(
    payload: CheckoutRequest,
    session: Session = Depends(get_session),
    user: User | None = Depends(get_current_user_optional),
    anonymous_session_id: str = Depends(get_required_session_id),
) -> CheckoutResponse:
    return CheckoutService(session).create_checkout(
        user=user,
        session_id=anonymous_session_id,
        payload=payload,
    )
