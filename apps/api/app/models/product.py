from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import Column, DateTime, Float, Integer, JSON, String, Text
from sqlmodel import Field, SQLModel

from app.models.common import utcnow


class Product(SQLModel, table=True):
    __tablename__ = "products"

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    name: str = Field(sa_column=Column(String(255), nullable=False))
    slug: str = Field(sa_column=Column(String(255), unique=True, index=True, nullable=False))
    short_description: str = Field(sa_column=Column(String(255), nullable=False))
    description: str = Field(sa_column=Column(Text, nullable=False))
    price_cents: int = Field(sa_column=Column(Integer, nullable=False))
    image_url: str = Field(sa_column=Column(Text, nullable=False))
    gallery: list[str] = Field(default_factory=list, sa_column=Column(JSON, nullable=False))
    ingredients: list[dict[str, Any]] = Field(
        default_factory=list,
        sa_column=Column(JSON, nullable=False),
    )
    benefits: list[str] = Field(default_factory=list, sa_column=Column(JSON, nullable=False))
    how_to_use: list[str] = Field(default_factory=list, sa_column=Column(JSON, nullable=False))
    skin_types: list[str] = Field(default_factory=list, sa_column=Column(JSON, nullable=False))
    concerns: list[str] = Field(default_factory=list, sa_column=Column(JSON, nullable=False))
    reviews: list[dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSON, nullable=False))
    featured: bool = Field(default=False, nullable=False)
    rating: float = Field(default=4.8, sa_column=Column(Float, nullable=False))
    review_count: int = Field(default=0, sa_column=Column(Integer, nullable=False))
    created_at: datetime = Field(
        default_factory=utcnow,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )


class Inventory(SQLModel, table=True):
    __tablename__ = "inventory"

    product_id: UUID = Field(foreign_key="products.id", primary_key=True)
    stock: int = Field(default=0, sa_column=Column(Integer, nullable=False))
    updated_at: datetime = Field(
        default_factory=utcnow,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

