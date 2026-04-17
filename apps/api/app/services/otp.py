import secrets
from datetime import UTC, datetime, timedelta
from uuid import UUID

from fastapi import HTTPException, status
from sqlmodel import Session

from app.models.user import VerificationCode
from app.repositories.verification_codes import VerificationCodeRepository


class OTPService:
    """Service for managing One-Time Password operations."""

    OTP_EXPIRY_MINUTES = 10
    OTP_LENGTH = 6

    def __init__(self, session: Session) -> None:
        self.session = session
        self.repo = VerificationCodeRepository(session)

    def generate_otp(self) -> str:
        """Generate a random 6-digit OTP."""
        return "".join([str(secrets.randbelow(10)) for _ in range(self.OTP_LENGTH)])

    def send_otp(self, email: str) -> dict:
        """Generate and store OTP for email. Returns expiry info."""
        # Delete any existing unused OTP for this email
        self.repo.delete_unused_otp(email)

        # Generate new OTP
        code = self.generate_otp()
        expires_at = datetime.now(UTC) + timedelta(minutes=self.OTP_EXPIRY_MINUTES)

        # Store in database
        verification_code = VerificationCode(
            email=email,
            code=code,
            expires_at=expires_at,
        )
        self.session.add(verification_code)
        self.session.commit()

        # TODO: In production, send via email service (SendGrid, AWS SES, etc.)
        # For now, in development we log it (users can check logs or test directly)
        print(f"OTP for {email}: {code}")

        return {
            "message": "OTP sent to email",
            "expires_in_minutes": self.OTP_EXPIRY_MINUTES,
        }

    def verify_otp(self, email: str, code: str) -> bool:
        """Verify OTP code for email. Returns True if valid."""
        vc = self.repo.get_unused_by_email_and_code(email, code)

        if not vc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP code.",
            )

        # Check expiry
        if vc.expires_at < datetime.now(UTC):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OTP code has expired.",
            )

        # Mark as used
        vc.is_used = True
        self.session.add(vc)
        self.session.commit()

        return True
