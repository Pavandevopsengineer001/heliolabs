import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";

interface OTPFormProps {
  email: string;
  onOtpVerified: () => void;
  onBackClick?: () => void;
}

export function OTPForm({ email, onOtpVerified, onBackClick }: OTPFormProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleSendOTP = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { sendOtp } = await import("@/lib/api");
      const response = await sendOtp(email);
      setIsOtpSent(true);
      setResendTimer(60);
      // Countdown timer
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (code.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { verifyOtp } = await import("@/lib/api");
      await verifyOtp(email, code);
      onOtpVerified();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOtpSent) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-4">
            We'll send a verification code to <strong>{email}</strong>
          </p>
          <button
            onClick={handleSendOTP}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Send OTP
          </button>
        </div>
        {onBackClick && (
          <button
            onClick={onBackClick}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
          >
            Back
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter 6-digit OTP
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
          placeholder="000000"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl tracking-widest font-mono"
        />
        <p className="text-xs text-gray-500 mt-1">
          Check your email for the verification code
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <button
        onClick={handleVerifyOTP}
        disabled={isLoading || code.length !== 6}
        className="w-full px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        Verify OTP
      </button>

      <button
        onClick={handleSendOTP}
        disabled={isLoading || resendTimer > 0}
        className="w-full px-4 py-2 text-sm text-gray-600 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
      </button>

      {onBackClick && (
        <button
          onClick={onBackClick}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
        >
          Back
        </button>
      )}
    </div>
  );
}
