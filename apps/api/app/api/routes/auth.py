from fastapi import APIRouter, Depends, Request, status
from sqlmodel import Session

from app.core.rate_limit import limiter
from app.db.session import get_session
from app.schemas.auth import AuthResponse, LoginRequest, LogoutRequest, RefreshRequest, SignupRequest
from app.schemas.common import MessageResponse
from app.services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
def signup(request: Request, payload: SignupRequest, session: Session = Depends(get_session)) -> AuthResponse:
    return AuthService(session).signup(payload)


@router.post("/login", response_model=AuthResponse)
@limiter.limit("20/minute")
def login(request: Request, payload: LoginRequest, session: Session = Depends(get_session)) -> AuthResponse:
    return AuthService(session).login(payload)


@router.post("/refresh", response_model=AuthResponse)
@limiter.limit("30/minute")
def refresh(request: Request, payload: RefreshRequest, session: Session = Depends(get_session)) -> AuthResponse:
    return AuthService(session).refresh(payload)


@router.post("/logout", response_model=MessageResponse)
def logout(payload: LogoutRequest, session: Session = Depends(get_session)) -> MessageResponse:
    AuthService(session).logout(payload.refresh_token)
    return MessageResponse(message="Logged out successfully.")

