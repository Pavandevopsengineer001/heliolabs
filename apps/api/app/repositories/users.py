from datetime import UTC, datetime
from uuid import UUID

from sqlmodel import Session, select

from app.models.common import UserRole
from app.models.user import Address, RefreshToken, User
from app.schemas.user import AddressPayload, ProfileUpdate


class UserRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get_by_email(self, email: str) -> User | None:
        statement = select(User).where(User.email == email.lower())
        return self.session.exec(statement).first()

    def get_by_id(self, user_id: UUID) -> User | None:
        statement = select(User).where(User.id == user_id)
        return self.session.exec(statement).first()

    def create(self, *, email: str, password_hash: str, full_name: str | None) -> User:
        user = User(
            email=email.lower(),
            password_hash=password_hash,
            full_name=full_name,
            role=UserRole.CUSTOMER,
        )
        self.session.add(user)
        self.session.flush()
        return user

    def update_profile(self, user: User, payload: ProfileUpdate) -> User:
        if payload.full_name is not None:
            user.full_name = payload.full_name
        self.session.add(user)
        self.session.flush()
        return user

    def list_addresses(self, user_id: UUID) -> list[Address]:
        statement = select(Address).where(Address.user_id == user_id).order_by(Address.created_at.desc())
        return list(self.session.exec(statement).all())

    def upsert_default_address(self, user_id: UUID, payload: AddressPayload) -> Address:
        existing = self.session.exec(
            select(Address).where(Address.user_id == user_id, Address.is_default.is_(True))
        ).first()
        if existing:
            existing.label = payload.label
            existing.full_name = payload.full_name
            existing.line1 = payload.line1
            existing.line2 = payload.line2
            existing.city = payload.city
            existing.state = payload.state
            existing.postal_code = payload.postal_code
            existing.country = payload.country
            existing.phone = payload.phone
            existing.is_default = payload.is_default
            self.session.add(existing)
            self.session.flush()
            return existing

        address = Address(user_id=user_id, **payload.model_dump())
        self.session.add(address)
        self.session.flush()
        return address

    def create_refresh_token(self, user_id: UUID, token_id: str, expires_at: datetime) -> RefreshToken:
        token = RefreshToken(user_id=user_id, token_id=token_id, expires_at=expires_at)
        self.session.add(token)
        self.session.flush()
        return token

    def get_refresh_token(self, token_id: str) -> RefreshToken | None:
        statement = select(RefreshToken).where(RefreshToken.token_id == token_id)
        return self.session.exec(statement).first()

    def revoke_refresh_token(self, token: RefreshToken) -> RefreshToken:
        token.revoked_at = datetime.now(UTC)
        self.session.add(token)
        self.session.flush()
        return token

