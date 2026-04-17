"use client";

import { startTransition, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { OTPForm } from "@/components/forms/otp-form";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

const signInSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2, "Enter your full name."),
});

export function AuthPanel() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [signupStep, setSignupStep] = useState<"email" | "otp" | "complete">("email");
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const ensureSession = useCartStore((state) => state.ensureSession);
  const signIn = useAuthStore((state) => state.signIn);
  const signUp = useAuthStore((state) => state.signUp);

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const submitSignIn = signInForm.handleSubmit((values) =>
    startTransition(async () => {
      const sessionId = ensureSession();
      try {
        await signIn({ email: values.email, password: values.password, sessionId });
        setFeedback("Signed in successfully.");
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "Unable to sign in.");
      }
    })
  );

  const submitSignUp = signUpForm.handleSubmit((values) => {
    // Move to OTP step instead of directly signing up
    setSignupStep("otp");
    setVerifiedEmail(values.email);
    setFeedback(null);
  });

  const handleOtpVerified = () => {
    // User has verified their email with OTP, now proceed with account creation
    const values = signUpForm.getValues();
    startTransition(async () => {
      const sessionId = ensureSession();
      try {
        await signUp({
          email: values.email,
          password: values.password,
          fullName: values.fullName,
          sessionId,
        });
        setFeedback("Account created successfully.");
        setSignupStep("complete");
        // Reset form after successful signup
        setTimeout(() => {
          setMode("signin");
          setSignupStep("email");
          setVerifiedEmail(null);
          signUpForm.reset();
        }, 2000);
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "Unable to create account.");
        setSignupStep("email");
      }
    });
  };

  const handleBackFromOTP = () => {
    setSignupStep("email");
    setVerifiedEmail(null);
    setFeedback(null);
  };

  return (
    <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
      <div className="flex gap-3">
        <Button variant={mode === "signin" ? "primary" : "secondary"} onClick={() => setMode("signin")}>
          Sign In
        </Button>
        <Button variant={mode === "signup" ? "primary" : "secondary"} onClick={() => setMode("signup")}>
          Create Account
        </Button>
      </div>

      {mode === "signin" ? (
        <form onSubmit={submitSignIn} className="mt-8 grid gap-4">
          <input placeholder="Email" {...signInForm.register("email")} className="input" />
          <input
            type="password"
            placeholder="Password"
            {...signInForm.register("password")}
            className="input"
          />
          <Button type="submit">Sign In</Button>
        </form>
      ) : signupStep === "otp" && verifiedEmail ? (
        <div className="mt-8">
          <OTPForm
            email={verifiedEmail}
            onOtpVerified={handleOtpVerified}
            onBackClick={handleBackFromOTP}
          />
        </div>
      ) : (
        <form onSubmit={submitSignUp} className="mt-8 grid gap-4">
          <input placeholder="Full name" {...signUpForm.register("fullName")} className="input" />
          <input placeholder="Email" {...signUpForm.register("email")} className="input" />
          <input
            type="password"
            placeholder="Password"
            {...signUpForm.register("password")}
            className="input"
          />
          <Button type="submit">Continue</Button>
        </form>
      )}
      {feedback ? <p className="mt-4 text-sm text-smoke">{feedback}</p> : null}
    </div>
  );
}
