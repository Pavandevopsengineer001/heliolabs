from fastapi import HTTPException, status
from sqlmodel import Session

from app.models.user import User
from app.repositories.users import UserRepository
from app.schemas.user import ProfileRead, ProfileUpdate


class UserService:
    def __init__(self, session: Session) -> None:
        self.session = session
        self.repository = UserRepository(session)

    def get_profile(self, user: User) -> ProfileRead:
        addresses = self.repository.list_addresses(user.id)
        return ProfileRead.model_validate(user).model_copy(update={"addresses": addresses})

    def update_profile(self, user: User, payload: ProfileUpdate) -> ProfileRead:
        db_user = self.repository.get_by_id(user.id)
        if not db_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
        self.repository.update_profile(db_user, payload)
        if payload.default_address:
            self.repository.upsert_default_address(user.id, payload.default_address)
        self.session.commit()
        self.session.refresh(db_user)
        return self.get_profile(db_user)
