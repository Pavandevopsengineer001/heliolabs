from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.core.dependencies import get_current_user
from app.db.session import get_session
from app.models.user import User
from app.schemas.user import ProfileRead, ProfileUpdate
from app.services.users import UserService

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("", response_model=ProfileRead)
def get_profile(user: User = Depends(get_current_user), session: Session = Depends(get_session)) -> ProfileRead:
    return UserService(session).get_profile(user)


@router.put("", response_model=ProfileRead)
def update_profile(
    payload: ProfileUpdate,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> ProfileRead:
    return UserService(session).update_profile(user, payload)

