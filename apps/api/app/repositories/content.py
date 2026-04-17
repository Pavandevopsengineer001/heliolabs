from sqlmodel import Session, select

from app.models.content import BlogPost, ContactSubmission, NewsletterSubscriber


class ContentRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def subscribe_newsletter(self, email: str) -> NewsletterSubscriber:
        existing = self.session.exec(
            select(NewsletterSubscriber).where(NewsletterSubscriber.email == email.lower())
        ).first()
        if existing:
            return existing
        subscriber = NewsletterSubscriber(email=email.lower())
        self.session.add(subscriber)
        self.session.flush()
        return subscriber

    def create_contact(self, *, name: str, email: str, subject: str, message: str) -> ContactSubmission:
        submission = ContactSubmission(name=name, email=email.lower(), subject=subject, message=message)
        self.session.add(submission)
        self.session.flush()
        return submission

    def list_blog_posts(self) -> list[BlogPost]:
        statement = select(BlogPost).order_by(BlogPost.published_at.desc())
        return list(self.session.exec(statement).all())

    def get_blog_post(self, slug: str) -> BlogPost | None:
        statement = select(BlogPost).where(BlogPost.slug == slug)
        return self.session.exec(statement).first()

