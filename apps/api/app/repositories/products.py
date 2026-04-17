from uuid import UUID

from sqlmodel import Session, select

from app.models.product import Inventory, Product


class ProductRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def list_products(
        self,
        *,
        skin_type: str | None = None,
        concern: str | None = None,
        sort: str = "featured",
        featured_only: bool = False,
    ) -> list[Product]:
        products = list(self.session.exec(select(Product)).all())

        if skin_type:
            products = [product for product in products if skin_type.lower() in product.skin_types]
        if concern:
            products = [product for product in products if concern.lower() in product.concerns]
        if featured_only:
            products = [product for product in products if product.featured]

        if sort == "price_asc":
            return sorted(products, key=lambda product: product.price_cents)
        if sort == "price_desc":
            return sorted(products, key=lambda product: product.price_cents, reverse=True)
        if sort == "rating":
            return sorted(products, key=lambda product: product.rating, reverse=True)
        if sort == "newest":
            return sorted(products, key=lambda product: product.created_at, reverse=True)

        return sorted(products, key=lambda product: (not product.featured, -product.rating))

    def get_by_slug(self, slug: str) -> Product | None:
        statement = select(Product).where(Product.slug == slug)
        return self.session.exec(statement).first()

    def get_by_id(self, product_id: UUID) -> Product | None:
        statement = select(Product).where(Product.id == product_id)
        return self.session.exec(statement).first()

    def get_inventory(self, product_id: UUID) -> Inventory | None:
        statement = select(Inventory).where(Inventory.product_id == product_id)
        return self.session.exec(statement).first()

    def get_inventory_map(self, product_ids: list[UUID]) -> dict[UUID, Inventory]:
        if not product_ids:
            return {}
        statement = select(Inventory).where(Inventory.product_id.in_(product_ids))
        rows = self.session.exec(statement).all()
        return {row.product_id: row for row in rows}

    def lock_inventory_rows(self, product_ids: list[UUID]) -> dict[UUID, Inventory]:
        if not product_ids:
            return {}
        statement = select(Inventory).where(Inventory.product_id.in_(product_ids)).with_for_update()
        rows = self.session.exec(statement).all()
        return {row.product_id: row for row in rows}
