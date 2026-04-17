from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.common import ORMModel


class ProductCardRead(ORMModel):
    id: UUID
    name: str
    slug: str
    short_description: str
    price_cents: int
    image_url: str
    skin_types: list[str]
    concerns: list[str]
    featured: bool
    rating: float
    review_count: int


class ProductDetailRead(ProductCardRead):
    description: str
    gallery: list[str]
    ingredients: list[dict[str, Any]]
    benefits: list[str]
    how_to_use: list[str]
    reviews: list[dict[str, Any]]
    created_at: datetime
    stock_available: int = Field(default=0)

