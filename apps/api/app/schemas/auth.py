from pydantic import BaseModel, EmailStr, Field

from app.schemas.user import UserRead


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = None
    session_id: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    session_id: str | None = None


class RefreshRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: str


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserRead


class SendOTPRequest(BaseModel):
    email: EmailStr


class SendOTPResponse(BaseModel):
    message: str = "OTP sent to email"
    expires_in_minutes: int = 10


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    code: str = Field(min_length=6, max_length=6)


class VerifyOTPResponse(BaseModel):
    message: str = "OTP verified successfully"
    verified: bool = True

