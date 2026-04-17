from typing import Annotated
from uuid import UUID

from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel import Session

from app.core.security import decode_token
from app.db.session import get_session
from app.models.cart import Cart
from app.models.common import UserRole
from app.models.user import User
from app.repositories.carts import CartRepository
from app.repositories.users import UserRepository

bearer_scheme = HTTPBearer(auto_error=False)


def get_optional_session_id(x_session_id: Annotated[str | None, Header()] = None) -> str | None:
    return x_session_id


def get_required_session_id(x_session_id: Annotated[str | None, Header()] = None) -> str:
    if not x_session_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="X-Session-Id header is required.")
    return x_session_id


def get_current_user_optional(
    session: Session = Depends(get_session),
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> User | None:
    if not credentials:
        return None
    try:
        claims = decode_token(credentials.credentials)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token.") from exc
    if claims.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token.")
    user = UserRepository(session).get_by_id(UUID(claims["sub"]))
    return user


def get_current_user(
    user: User | None = Depends(get_current_user_optional),
) -> User:
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required.")
    return user


def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required.")
    return user


def ensure_guest_cart_ownership(
    session_id: str = Depends(get_required_session_id),
    session: Session = Depends(get_session),
) -> Cart:
    """Ensure the session_id exists and belongs to a guest cart."""
    cart = CartRepository(session).get_by_session_id(session_id)
    if not cart or cart.user_id is not None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Guest cart not found.")
    return cart


def ensure_user_cart_ownership(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> Cart:
    """Ensure the authenticated user owns the cart being accessed."""
    cart = CartRepository(session).get_by_user_id(user.id)
    if not cart:
        # Create a new cart for the user if not exists
        from app.repositories.carts import CartRepository
        cart_repo = CartRepository(session)
        cart = cart_repo.get_or_create(user_id=user.id)
    return cart
