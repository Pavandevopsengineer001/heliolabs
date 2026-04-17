from __future__ import annotations

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import Column, DateTime, String, Text
from sqlmodel import Field, SQLModel

from app.models.common import UserRole, utcnow


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    email: str = Field(sa_column=Column(String(255), unique=True, index=True, nullable=False))
    password_hash: str = Field(sa_column=Column(Text, nullable=False))
    full_name: str | None = Field(default=None, sa_column=Column(String(255), nullable=True))
    role: UserRole = Field(default=UserRole.CUSTOMER)
    created_at: datetime = Field(
        default_factory=utcnow,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )


class RefreshToken(SQLModel, table=True):
    __tablename__ = "refresh_tokens"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True, nullable=False)
    token_id: str = Field(sa_column=Column(String(255), unique=True, index=True, nullable=False))
    expires_at: datetime = Field(sa_column=Column(DateTime(timezone=True), nullable=False))
    revoked_at: datetime | None = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True),
    )
    created_at: datetime = Field(
        default_factory=utcnow,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )


class Address(SQLModel, table=True):
    __tablename__ = "addresses"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True, nullable=False)
    label: str = Field(default="Primary", sa_column=Column(String(100), nullable=False))
    full_name: str = Field(sa_column=Column(String(255), nullable=False))
    line1: str = Field(sa_column=Column(String(255), nullable=False))
    line2: str | None = Field(default=None, sa_column=Column(String(255), nullable=True))
    city: str = Field(sa_column=Column(String(120), nullable=False))
    state: str = Field(sa_column=Column(String(120), nullable=False))
    postal_code: str = Field(sa_column=Column(String(32), nullable=False))
    country: str = Field(default="India", sa_column=Column(String(120), nullable=False))
    phone: str | None = Field(default=None, sa_column=Column(String(32), nullable=True))
    is_default: bool = Field(default=True, nullable=False)
    created_at: datetime = Field(
        default_factory=utcnow,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

