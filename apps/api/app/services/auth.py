from datetime import UTC, datetime

from fastapi import HTTPException, status
from sqlmodel import Session

from app.core.security import create_access_token, create_refresh_token, decode_token, hash_password, verify_password
from app.repositories.users import UserRepository
from app.schemas.auth import AuthResponse, LoginRequest, RefreshRequest, SignupRequest
from app.schemas.user import UserRead
from app.services.carts import CartService


class AuthService:
    def __init__(self, session: Session) -> None:
        self.session = session
        self.user_repository = UserRepository(session)
        self.cart_service = CartService(session)

    def signup(self, payload: SignupRequest) -> AuthResponse:
        if self.user_repository.get_by_email(payload.email):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered.")

        user = self.user_repository.create(
            email=payload.email,
            password_hash=hash_password(payload.password),
            full_name=payload.full_name,
        )
        self.cart_service.merge_guest_cart_to_user(session_id=payload.session_id, user_id=user.id)
        access_token, refresh_token = self._issue_token_pair(user.id, user.role)
        self.session.commit()
        self.session.refresh(user)
        return AuthResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserRead.model_validate(user),
        )

    def login(self, payload: LoginRequest) -> AuthResponse:
        user = self.user_repository.get_by_email(payload.email)
        if not user or not verify_password(payload.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")

        self.cart_service.merge_guest_cart_to_user(session_id=payload.session_id, user_id=user.id)
        access_token, refresh_token = self._issue_token_pair(user.id, user.role)
        self.session.commit()
        return AuthResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserRead.model_validate(user),
        )

    def refresh(self, payload: RefreshRequest) -> AuthResponse:
        try:
            claims = decode_token(payload.refresh_token)
        except ValueError as exc:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token.") from exc
        if claims.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type.")

        token_record = self.user_repository.get_refresh_token(claims.get("jti", ""))
        if not token_record or token_record.revoked_at is not None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token is revoked.")
        if token_record.expires_at <= datetime.now(UTC):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired.")

        user = self.user_repository.get_by_id(token_record.user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found.")

        self.user_repository.revoke_refresh_token(token_record)
        access_token, refresh_token = self._issue_token_pair(user.id, user.role)
        self.session.commit()
        return AuthResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserRead.model_validate(user),
        )

    def logout(self, refresh_token: str) -> None:
        try:
            claims = decode_token(refresh_token)
        except ValueError:
            return
        token_record = self.user_repository.get_refresh_token(claims.get("jti", ""))
        if token_record and token_record.revoked_at is None:
            self.user_repository.revoke_refresh_token(token_record)
            self.session.commit()

    def _issue_token_pair(self, user_id, role) -> tuple[str, str]:
        access_token = create_access_token(subject=str(user_id), role=str(role))
        refresh_token, token_id, expires_at = create_refresh_token(subject=str(user_id))
        self.user_repository.create_refresh_token(user_id=user_id, token_id=token_id, expires_at=expires_at)
        return access_token, refresh_token
