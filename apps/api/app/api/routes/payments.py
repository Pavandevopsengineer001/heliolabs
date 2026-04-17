from fastapi import APIRouter, Depends, Header, Request, Response, status
from sqlmodel import Session

from app.db.session import get_session
from app.services.checkout import CheckoutService
from app.services.payments import PaymentService

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/webhook", status_code=status.HTTP_200_OK)
async def stripe_webhook(
    request: Request,
    stripe_signature: str | None = Header(default=None, alias="Stripe-Signature"),
    session: Session = Depends(get_session),
) -> Response:
    payload = await request.body()
    event = PaymentService().construct_event(payload, stripe_signature)
    CheckoutService(session).handle_webhook(event)
    return Response(status_code=status.HTTP_200_OK)

