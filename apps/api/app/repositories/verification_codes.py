from sqlmodel import Session, select

from app.models.user import VerificationCode


class VerificationCodeRepository:
    """Repository for managing verification codes."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def get_unused_by_email_and_code(self, email: str, code: str) -> VerificationCode | None:
        """Get unused verification code for email and code."""
        statement = select(VerificationCode).where(
            VerificationCode.email == email,
            VerificationCode.code == code,
            VerificationCode.is_used == False,
        )
        return self.session.exec(statement).first()

    def delete_unused_otp(self, email: str) -> None:
        """Delete all unused OTP codes for an email."""
        statement = select(VerificationCode).where(
            VerificationCode.email == email,
            VerificationCode.is_used == False,
        )
        verification_codes = self.session.exec(statement).all()
        for vc in verification_codes:
            self.session.delete(vc)
        self.session.commit()
