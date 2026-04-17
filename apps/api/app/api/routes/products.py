from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from app.db.session import get_session
from app.schemas.product import ProductCardRead, ProductDetailRead
from app.services.products import ProductService

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductCardRead])
def list_products(
    session: Session = Depends(get_session),
    skin_type: str | None = Query(default=None),
    concern: str | None = Query(default=None),
    sort: str = Query(default="featured"),
    featured_only: bool = Query(default=False),
) -> list[ProductCardRead]:
    return ProductService(session).list_products(
        skin_type=skin_type,
        concern=concern,
        sort=sort,
        featured_only=featured_only,
    )


@router.get("/{slug}", response_model=ProductDetailRead)
def get_product(slug: str, session: Session = Depends(get_session)) -> ProductDetailRead:
    return ProductService(session).get_product(slug)

