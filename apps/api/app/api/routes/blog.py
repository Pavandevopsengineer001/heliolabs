from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.db.session import get_session
from app.schemas.content import BlogPostListItem, BlogPostRead
from app.services.content import ContentService

router = APIRouter(prefix="/blog", tags=["blog"])


@router.get("", response_model=list[BlogPostListItem])
def list_blog_posts(session: Session = Depends(get_session)) -> list[BlogPostListItem]:
    return ContentService(session).list_blog_posts()


@router.get("/{slug}", response_model=BlogPostRead)
def get_blog_post(slug: str, session: Session = Depends(get_session)) -> BlogPostRead:
    post = ContentService(session).get_blog_post(slug)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")
    return post

