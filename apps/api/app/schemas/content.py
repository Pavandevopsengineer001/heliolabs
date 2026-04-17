from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class NewsletterCreate(BaseModel):
    email: EmailStr


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class BlogPostListItem(BaseModel):
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

