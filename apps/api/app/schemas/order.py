from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, HttpUrl

from app.models.common import OrderStatus


class ShippingAddress(BaseModel):
    full_name: str
    line1: str
    line2: str | None = None
    city: str
    state: str
    postal_code: str
    country: str = "India"
    phone: str | None = None


class CheckoutRequest(BaseModel):
    email: EmailStr
    shipping_address: ShippingAddress
    success_url: HttpUrl | None = None
    cancel_url: HttpUrl | None = None
    notes: str | None = None


class CheckoutResponse(BaseModel):
    order_id: UUID
    stripe_session_id: str
    checkout_url: str


class OrderItemRead(BaseModel):
    product_id: UUID
    product_name: str
    image_url: str
    quantity: int
    unit_price_cents: int


class OrderRead(BaseModel):
    id: UUID
    email: EmailStr
    status: OrderStatus
    currency: str
    subtotal_amount_cents: int
    total_amount_cents: int
    stripe_checkout_session_id: str | None
    created_at: datetime
    updated_at: datetime
    shipping_address: dict
    items: list[OrderItemRead]

