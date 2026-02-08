"use client";

import { useState } from "react";
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

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to send reset email");
      }

      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast.success("Reset link sent! Check your email.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

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
              {isSubmitted ? "Check Your Email" : "Reset your password"}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {isSubmitted
                ? "We sent a password reset link to your email"
                : "Enter your email address and we'll send you a reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-4 space-y-6">
                <div className="w-16 h-16 mx-auto bg-[#00FF88]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#00FF88] text-3xl">&#9993;</span>
                </div>
                <p className="text-zinc-400 text-sm">
                  If an account exists for{" "}
                  <span className="text-white font-medium">{submittedEmail}</span>,
                  you will receive a password reset link shortly.
                </p>
                <p className="text-xs text-zinc-500">
                  Didn&apos;t receive the email? Check your spam folder or try again.
                </p>
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    form.reset();
                  }}
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5"
                >
                  Try a different email
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-zinc-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-[#00FF88] hover:bg-[#00d474] text-[#0a0a0a] font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              </Form>
            )}

            <div className="mt-6 text-center text-sm text-zinc-400">
              Remember your password?{" "}
              <Link href="/login" className="text-[#00FF88] hover:text-[#00d474] font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
