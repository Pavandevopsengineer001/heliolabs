from fastapi import APIRouter, Depends, Request, status
from sqlmodel import Session

from app.core.rate_limit import limiter
from app.db.session import get_session
from app.schemas.common import MessageResponse
from app.schemas.content import NewsletterCreate
from app.services.content import ContentService

router = APIRouter(prefix="/newsletter", tags=["newsletter"])


@router.post("", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("20/minute")
def subscribe(request: Request, payload: NewsletterCreate, session: Session = Depends(get_session)) -> MessageResponse:
    ContentService(session).subscribe_newsletter(payload)
    return MessageResponse(message="Subscribed to newsletter.")

