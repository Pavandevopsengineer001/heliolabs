from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import Column, DateTime, JSON, String, Text
from sqlmodel import Field, SQLModel

from app.models.common import utcnow


class NewsletterSubscriber(SQLModel, table=True):
    __tablename__ = "newsletter_subscribers"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(sa_column=Column(String(255), unique=True, index=True, nullable=False))
    created_at: datetime = Field(
        default_factory=utcnow,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )


class ContactSubmission(SQLModel, table=True):
    __tablename__ = "contact_submissions"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(sa_column=Column(String(255), nullable=False))
    email: str = Field(sa_column=Column(String(255), nullable=False))
    subject: str = Field(sa_column=Column(String(255), nullable=False))
    message: str = Field(sa_column=Column(Text, nullable=False))
    created_at: datetime = Field(
        default_factory=utcnow,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )


class BlogPost(SQLModel, table=True):
    __tablename__ = "blog_posts"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    slug: str = Field(sa_column=Column(String(255), unique=True, index=True, nullable=False))
    title: str = Field(sa_column=Column(String(255), nullable=False))
    excerpt: str = Field(sa_column=Column(Text, nullable=False))
    seo_description: str = Field(sa_column=Column(Text, nullable=False))
    hero_image: str = Field(sa_column=Column(Text, nullable=False))
    tags: list[str] = Field(default_factory=list, sa_column=Column(JSON, nullable=False))
    content_markdown: str = Field(sa_column=Column(Text, nullable=False))
    published_at: datetime = Field(
        default_factory=utcnow,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )


class WebhookEvent(SQLModel, table=True):
    __tablename__ = "webhook_events"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    event_id: str = Field(sa_column=Column(String(255), unique=True, index=True, nullable=False))
    type: str = Field(sa_column=Column(String(255), nullable=False))
    payload: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON, nullable=False))
    processed_at: datetime = Field(
        default_factory=utcnow,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

