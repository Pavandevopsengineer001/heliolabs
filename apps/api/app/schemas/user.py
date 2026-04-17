from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from app.models.common import UserRole
from app.schemas.common import ORMModel


class AddressPayload(BaseModel):
    label: str = "Primary"
    full_name: str
    line1: str
    line2: str | None = None
    city: str
    state: str
    postal_code: str
    country: str = "India"
    phone: str | None = None
    is_default: bool = True


class AddressRead(ORMModel):
    id: UUID
    user_id: UUID
    label: str
    full_name: str
    line1: str
    line2: str | None
    city: str
    state: str
    postal_code: str
    country: str
    phone: str | None
    is_default: bool
    created_at: datetime


class UserRead(ORMModel):
    id: UUID
    email: EmailStr
    full_name: str | None
    role: UserRole
    created_at: datetime


class ProfileRead(UserRead):
    addresses: list[AddressRead] = Field(default_factory=list)


class ProfileUpdate(BaseModel):
    full_name: str | None = None
    default_address: AddressPayload | None = None

