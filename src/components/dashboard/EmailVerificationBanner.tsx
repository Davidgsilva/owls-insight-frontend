"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function EmailVerificationBanner() {
  const { user } = useAuth();
  const [isResending, setIsResending] = useState(false);

  if (!user || user.emailVerified) return null;

  async function handleResend() {
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
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to resend");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="mb-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-yellow-200 font-medium">Verify your email</p>
        <p className="text-xs text-yellow-200/60">
          Please verify your email to generate API keys and access all features.
        </p>
      </div>
      <Button
        onClick={handleResend}
        disabled={isResending}
        size="sm"
        variant="outline"
        className="border-yellow-500/30 text-yellow-200 hover:bg-yellow-500/10 shrink-0"
      >
        {isResending ? "Sending..." : "Resend Email"}
      </Button>
    </div>
  );
}
