from uuid import UUID

from pydantic import BaseModel, Field


class CartItemWrite(BaseModel):
    product_id: UUID
    quantity: int = Field(default=1, ge=1, le=10)
    mode: str = Field(default="add", pattern="^(add|set)$")


class CartItemRemove(BaseModel):
    product_id: UUID


class CartItemRead(BaseModel):
    product_id: UUID
    name: str
    slug: str
    image_url: str
    unit_price_cents: int
    quantity: int
    subtotal_cents: int
    stock_available: int


class CartRead(BaseModel):
    id: UUID | None = None
    items: list[CartItemRead] = Field(default_factory=list)
    total_items: int = 0
    subtotal_cents: int = 0

