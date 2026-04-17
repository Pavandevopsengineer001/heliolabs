from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.core.dependencies import (
    ensure_guest_cart_ownership,
    ensure_user_cart_ownership,
    get_current_user,
    get_required_session_id,
)
from app.db.session import get_session
from app.models.cart import Cart
from app.models.user import User
from app.repositories.carts import CartRepository
from app.schemas.cart import CartItemRemove, CartItemWrite, CartRead
from app.services.carts import CartService

router = APIRouter(prefix="/cart", tags=["cart"])


# ============================================================================
# GUEST CART ENDPOINTS - Requires X-Session-Id header, no authentication
# ============================================================================


@router.get("/guest", response_model=CartRead)
def get_guest_cart(
    session: Session = Depends(get_session),
    session_id: str = Depends(get_required_session_id),
) -> CartRead:
    """Get guest cart by session ID. Validates cart belongs to session."""
    cart_repo = CartRepository(session)
    cart = cart_repo.get_by_session_id(session_id)

    if not cart:
        # Create new guest cart if it doesn't exist
        cart = cart_repo.get_or_create(session_id=session_id)
    elif cart.user_id is not None:
        # Prevent access to user carts via guest endpoint
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cart is associated with an account.")

    return CartService(session)._build_cart_read(cart)


@router.post("/guest", response_model=CartRead)
def upsert_guest_cart_item(
    payload: CartItemWrite,
    session: Session = Depends(get_session),
    session_id: str = Depends(get_required_session_id),
) -> CartRead:
    """Add/update item in guest cart. Requires valid X-Session-Id."""
    cart_repo = CartRepository(session)
    cart = cart_repo.get_by_session_id(session_id)

    if not cart:
        cart = cart_repo.get_or_create(session_id=session_id)
    elif cart.user_id is not None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cart is associated with an account.")

    service = CartService(session)
    return service.upsert_item(
        user_id=None,
        session_id=session_id,
        payload=payload,
    )


@router.delete("/guest/item", response_model=CartRead)
def remove_guest_cart_item(
    payload: CartItemRemove,
    session: Session = Depends(get_session),
    session_id: str = Depends(get_required_session_id),
) -> CartRead:
    """Remove item from guest cart. Requires valid X-Session-Id."""
    cart_repo = CartRepository(session)
    cart = cart_repo.get_by_session_id(session_id)

    if not cart:
        return CartRead()
    if cart.user_id is not None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cart is associated with an account.")

    service = CartService(session)
    return service.remove_item(
        user_id=None,
        session_id=session_id,
        product_id=payload.product_id,
    )


# ============================================================================
# AUTHENTICATED CART ENDPOINTS - Requires Authorization header with JWT
# ============================================================================


@router.get("", response_model=CartRead)
def get_user_cart(
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
) -> CartRead:
    """Get authenticated user's cart. Requires valid JWT token."""
    cart_repo = CartRepository(session)
    cart = cart_repo.get_by_user_id(user.id)

    if not cart:
        # Create new cart for user
        cart = cart_repo.get_or_create(user_id=user.id)

    return CartService(session)._build_cart_read(cart)


@router.post("", response_model=CartRead)
def upsert_user_cart_item(
    payload: CartItemWrite,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
) -> CartRead:
    """Add/update item in authenticated user's cart. Requires valid JWT token."""
    service = CartService(session)
    return service.upsert_item(
        user_id=user.id,
        session_id=None,
        payload=payload,
    )


@router.delete("/item", response_model=CartRead)
def remove_user_cart_item(
    payload: CartItemRemove,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
) -> CartRead:
    """Remove item from authenticated user's cart. Requires valid JWT token."""
    service = CartService(session)
    return service.remove_item(
        user_id=user.id,
        session_id=None,
        product_id=payload.product_id,
    )

