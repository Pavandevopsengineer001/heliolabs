from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr


class NewsletterCreate(BaseModel):
    email: EmailStr


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class BlogPostListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    slug: str
    title: str
    excerpt: str
    seo_description: str
    hero_image: str
    tags: list[str]
    published_at: datetime


class BlogPostRead(BlogPostListItem):
    content_markdown: str

