"use client";

import { useEffect, useRef, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function PasswordStrength({ password }: { password: string }) {
  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const strengthText = useMemo(() => {
    if (strength <= 2) return "Weak";
    if (strength <= 4) return "Medium";
    return "Strong";
  }, [strength]);

  const strengthColor = useMemo(() => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 4) return "bg-yellow-500";
    return "bg-[#00FF88]";
  }, [strength]);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i < strength ? strengthColor : "bg-zinc-700"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-zinc-400">
        Password strength: <span className={strength > 4 ? "text-[#00FF88]" : strength > 2 ? "text-yellow-500" : "text-red-500"}>{strengthText}</span>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"ready" | "submitting" | "success" | "error">(
    token ? "ready" : "error"
  );
  const [errorMessage, setErrorMessage] = useState(
    token ? "" : "No reset token found. Please request a new password reset."
  );

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const watchedPassword = form.watch("password");
  const submittingRef = useRef(false);

  async function onSubmit(data: ResetPasswordFormData) {
    if (!token || submittingRef.current) return;
    submittingRef.current = true;
    setStatus("submitting");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to reset password");
      }

      setStatus("success");
      toast.success("Password reset successfully!");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to reset password"
      );
      toast.error(error instanceof Error ? error.message : "Failed to reset password");
    }
  }

  // Redirect to dashboard after success
  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => router.push("/dashboard"), 3000);
    return () => clearTimeout(timer);
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[#00FF88]/10 border border-[#00FF88]/20 flex items-center justify-center">
              <span className="text-[#00FF88] font-mono font-bold text-lg">OI</span>
            </div>
            <span className="font-mono text-xl font-semibold text-white">Owls Insight</span>
          </Link>
        </div>

        <Card className="bg-[#111113] border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-mono text-white">
              {status === "success" ? "Password Reset!" : "Set New Password"}
            </CardTitle>
            {status === "ready" && (
              <CardDescription className="text-zinc-400">
                Enter your new password below
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {status === "submitting" && (
              <div className="py-8 text-center">
                <div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-zinc-400 mt-4">Resetting your password...</p>
              </div>
            )}

            {status === "success" && (
              <div className="text-center py-4 space-y-6">
                <div className="w-16 h-16 mx-auto bg-[#00FF88]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#00FF88] text-3xl">&#10003;</span>
                </div>
                <p className="text-zinc-400">
                  Your password has been reset. Redirecting to dashboard...
                </p>
                <Link href="/dashboard">
                  <Button className="bg-[#00FF88] hover:bg-[#00d474] text-[#0a0a0a] font-semibold">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            )}

            {status === "error" && (
              <div className="text-center py-4 space-y-4">
                <p className="text-red-400">{errorMessage}</p>
                <Link href="/forgot-password">
                  <Button
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5"
                  >
                    Request New Reset Link
                  </Button>
                </Link>
              </div>
            )}

            {status === "ready" && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Create a strong password"
                            className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-zinc-500"
                            {...field}
                          />
                        </FormControl>
                        <PasswordStrength password={watchedPassword} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-zinc-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="text-xs text-zinc-500 space-y-1">
                    <p>Password requirements:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-zinc-600">
                      <li className={watchedPassword.length >= 8 ? "text-[#00FF88]" : ""}>
                        At least 8 characters
                      </li>
                      <li className={/[A-Z]/.test(watchedPassword) ? "text-[#00FF88]" : ""}>
                        One uppercase letter
                      </li>
                      <li className={/[a-z]/.test(watchedPassword) ? "text-[#00FF88]" : ""}>
                        One lowercase letter
                      </li>
                      <li className={/[0-9]/.test(watchedPassword) ? "text-[#00FF88]" : ""}>
                        One number
                      </li>
                      <li className={/[^A-Za-z0-9]/.test(watchedPassword) ? "text-[#00FF88]" : ""}>
                        One special character
                      </li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#00FF88] hover:bg-[#00d474] text-[#0a0a0a] font-semibold"
                  >
                    Reset Password
                  </Button>
                </form>
              </Form>
            )}

            <div className="mt-6 text-center text-sm text-zinc-400">
              <Link href="/login" className="text-[#00FF88] hover:text-[#00d474] font-medium">
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
