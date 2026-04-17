from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import Column, DateTime, Integer, JSON, String, Text
from sqlmodel import Field, SQLModel

from app.models.common import OrderStatus, utcnow


class Order(SQLModel, table=True):
    __tablename__ = "orders"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID | None = Field(default=None, foreign_key="users.id", index=True)
    cart_id: UUID | None = Field(default=None, foreign_key="carts.id", index=True)
    email: str = Field(sa_column=Column(String(255), nullable=False))
    status: OrderStatus = Field(default=OrderStatus.AWAITING_PAYMENT)
    currency: str = Field(default="inr", sa_column=Column(String(12), nullable=False))
    subtotal_amount_cents: int = Field(default=0, sa_column=Column(Integer, nullable=False))
    total_amount_cents: int = Field(default=0, sa_column=Column(Integer, nullable=False))
    stripe_checkout_session_id: str | None = Field(
        default=None,
        sa_column=Column(String(255), unique=True, nullable=True),
    )
    stripe_payment_intent_id: str | None = Field(
        default=None,
        sa_column=Column(String(255), nullable=True),
    )
    shipping_address: dict[str, Any] = Field(
        default_factory=dict,
        sa_column=Column(JSON, nullable=False),
    )
    session_id: str | None = Field(default=None, sa_column=Column(String(255), nullable=True))
    notes: str | None = Field(default=None, sa_column=Column(Text, nullable=True))
    created_at: datetime = Field(
        default_factory=utcnow,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=utcnow,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )


class OrderItem(SQLModel, table=True):
    __tablename__ = "order_items"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    order_id: UUID = Field(foreign_key="orders.id", index=True, nullable=False)
    product_id: UUID = Field(foreign_key="products.id", index=True, nullable=False)
    product_name: str = Field(sa_column=Column(String(255), nullable=False))
    image_url: str = Field(sa_column=Column(Text, nullable=False))
    quantity: int = Field(default=1, sa_column=Column(Integer, nullable=False))
    unit_price_cents: int = Field(default=0, sa_column=Column(Integer, nullable=False))

