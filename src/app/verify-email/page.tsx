"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const { user, refreshUser } = useAuth();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">(
    token ? "verifying" : "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // If token is present, verify it
  useEffect(() => {
    if (!token) return;

    async function verify() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("success");
          await refreshUser();
          toast.success("Email verified successfully!");
        } else {
          setStatus("error");
          setErrorMessage(data.error || "Verification failed");
        }
      } catch {
        setStatus("error");
        setErrorMessage("Network error. Please try again.");
      }
    }

    verify();
  }, [token, refreshUser]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((c) => c - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResend = useCallback(async () => {
    setIsResending(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to resend");
      }
      toast.success("Verification email sent!");
      setResendCooldown(60);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to resend");
    } finally {
      setIsResending(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center">
            <span className="font-mono text-xl font-semibold text-white">Owls Insight</span>
          </Link>
        </div>

        <Card className="bg-[#111113] border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-mono text-white">
              {status === "success"
                ? "Email Verified!"
                : status === "error"
                ? "Verification Failed"
                : "Check Your Email"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {status === "verifying" && (
              <div className="py-8">
                <div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-zinc-400 mt-4">Verifying your email...</p>
              </div>
            )}

            {status === "success" && (
              <div className="py-4 space-y-6">
                <div className="w-16 h-16 mx-auto bg-[#00FF88]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#00FF88] text-3xl">&#10003;</span>
                </div>
                <p className="text-zinc-400">
                  Your email has been verified. Welcome to Owls Insight!
                </p>
                <Link href="/dashboard">
                  <Button className="bg-[#00FF88] hover:bg-[#00d474] text-[#0a0a0a] font-semibold">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            )}

            {status === "error" && (
              <div className="py-4 space-y-4">
                <p className="text-red-400">{errorMessage}</p>
                {user && !user.emailVerified && (
                  <Button
                    onClick={handleResend}
                    disabled={isResending || resendCooldown > 0}
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5"
                  >
                    {isResending
                      ? "Sending..."
                      : resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend Verification Email"}
                  </Button>
                )}
              </div>
            )}

            {status === "idle" && (
              <div className="py-4 space-y-6">
                <p className="text-zinc-400">
                  We sent a verification link to{" "}
                  <span className="text-white font-medium">
                    {user?.email || "your email"}
                  </span>
                  .<br />
                  Click the link to verify your account.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={handleResend}
                    disabled={isResending || resendCooldown > 0 || !user}
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5"
                  >
                    {isResending
                      ? "Sending..."
                      : resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend Verification Email"}
                  </Button>
                  <p className="text-xs text-zinc-500">
                    Didn&apos;t receive the email? Check your spam folder.
                  </p>
                </div>
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-zinc-400 hover:text-white"
                  >
                    Continue to Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
