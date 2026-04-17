from fastapi import HTTPException, status
from sqlmodel import Session

from app.repositories.products import ProductRepository
from app.schemas.product import ProductCardRead, ProductDetailRead


class ProductService:
    def __init__(self, session: Session) -> None:
        self.repository = ProductRepository(session)

    def list_products(
        self,
        *,
        skin_type: str | None = None,
        concern: str | None = None,
        sort: str = "featured",
        featured_only: bool = False,
    ) -> list[ProductCardRead]:
        products = self.repository.list_products(
            skin_type=skin_type,
            concern=concern,
            sort=sort,
            featured_only=featured_only,
        )
        return [ProductCardRead.model_validate(product) for product in products]

    def get_product(self, slug: str) -> ProductDetailRead:
        product = self.repository.get_by_slug(slug)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")
        inventory = self.repository.get_inventory(product.id)
        return ProductDetailRead.model_validate(product).model_copy(
            update={"stock_available": inventory.stock if inventory else 0}
        )
