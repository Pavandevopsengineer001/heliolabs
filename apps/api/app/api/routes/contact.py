from fastapi import APIRouter, Depends, Request, status
from sqlmodel import Session

from app.core.rate_limit import limiter
from app.db.session import get_session
from app.schemas.common import MessageResponse
from app.schemas.content import ContactCreate
from app.services.content import ContentService

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
def submit_contact(request: Request, payload: ContactCreate, session: Session = Depends(get_session)) -> MessageResponse:
    ContentService(session).submit_contact(payload)
    return MessageResponse(message="Contact request received.")

