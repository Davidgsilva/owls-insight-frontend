"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
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
import { DiscordIcon } from "@/components/icons/DiscordIcon";

const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
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

type RegisterFormData = z.infer<typeof registerSchema>;

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

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const isMvpTrial = searchParams.get("tier") === "mvp";

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchedPassword = form.watch("password");

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true);
    try {
      await registerUser(data.email, data.password);

      if (isMvpTrial) {
        // Redirect to Stripe checkout for MVP trial
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            tier: "mvp",
            successUrl: `${window.location.origin}/dashboard?checkout=success&trial=true`,
            cancelUrl: `${window.location.origin}/pricing?checkout=canceled`,
          }),
        });
        const checkoutData = await res.json();
        if (res.ok && checkoutData.url) {
          window.location.href = checkoutData.url;
          return;
        }
        // Checkout creation failed — notify and fall through to normal flow
        toast.error("Couldn't start your free trial. You can start it from your billing page.");
      }

      toast.success("Account created! Check your email to verify.");
      router.push("/verify-email");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-8">
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
              {isMvpTrial ? "Start your free trial" : "Create an account"}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {isMvpTrial
                ? "Create an account to start your 7-day free MVP trial"
                : "Get started with your API access today"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Discord OAuth */}
            <a
              href={`/api/auth/discord${isMvpTrial ? '?tier=mvp' : ''}`}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-md
                         bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold text-sm
                         transition-colors duration-150"
            >
              <DiscordIcon className="w-5 h-5" />
              {isMvpTrial ? "Sign up with Discord & Start Trial" : "Sign up with Discord"}
            </a>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#111113] px-3 text-zinc-500">or register with email</span>
              </div>
            </div>

            {isMvpTrial && (
              <div className="mb-4 p-3 rounded-lg bg-[#00FF88]/5 border border-[#00FF88]/20">
                <p className="text-sm text-[#00FF88] font-mono font-medium">7-Day Free Trial</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Credit card required. Cancel anytime during the trial — you won&apos;t be charged. After 7 days, $49.99/mo.
                </p>
              </div>
            )}

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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Password</FormLabel>
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
                  disabled={isLoading}
                >
                  {isLoading
                    ? (isMvpTrial ? "Starting trial..." : "Creating account...")
                    : (isMvpTrial ? "Start 7-Day Free Trial" : "Create account")}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="text-[#00FF88] hover:text-[#00d474] font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-zinc-500 mt-6">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-zinc-400 hover:text-white">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-zinc-400 hover:text-white">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
