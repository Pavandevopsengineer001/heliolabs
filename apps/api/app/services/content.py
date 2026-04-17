from sqlmodel import Session

from app.repositories.content import ContentRepository
from app.schemas.content import BlogPostListItem, BlogPostRead, ContactCreate, NewsletterCreate


class ContentService:
    def __init__(self, session: Session) -> None:
        self.session = session
        self.repository = ContentRepository(session)

    def subscribe_newsletter(self, payload: NewsletterCreate) -> None:
        self.repository.subscribe_newsletter(payload.email)
        self.session.commit()

    def submit_contact(self, payload: ContactCreate) -> None:
        self.repository.create_contact(
            name=payload.name,
            email=payload.email,
            subject=payload.subject,
            message=payload.message,
        )
        self.session.commit()

    def list_blog_posts(self) -> list[BlogPostListItem]:
        return [BlogPostListItem.model_validate(post) for post in self.repository.list_blog_posts()]

    def get_blog_post(self, slug: str) -> BlogPostRead | None:
        post = self.repository.get_blog_post(slug)
        return BlogPostRead.model_validate(post) if post else None

