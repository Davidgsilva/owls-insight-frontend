"use client";

import { useState, useEffect, Suspense } from "react";
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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const DISCORD_ERROR_MESSAGES: Record<string, string> = {
  invalid_state: "Security validation failed. Please try again.",
  expired_state: "Login session expired. Please try again.",
  missing_params: "Invalid callback. Please try again.",
  service_unavailable: "Service temporarily unavailable.",
  discord_auth_failed: "Discord authentication failed.",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Validate redirect to prevent open redirect attacks
  const redirectParam = searchParams.get("redirect");
  const redirectTo = redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
    ? redirectParam
    : "/dashboard";

  // Show Discord OAuth errors from callback redirect
  const errorParam = searchParams.get("error");
  useEffect(() => {
    if (errorParam) {
      const message = DISCORD_ERROR_MESSAGES[errorParam] || "An error occurred. Please try again.";
      toast.error(message);
    }
  }, [errorParam]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      router.push(redirectTo);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
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
            <CardTitle className="text-2xl font-mono text-white">Welcome back</CardTitle>
            <CardDescription className="text-zinc-400">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Discord OAuth */}
            <a
              href="/api/auth/discord"
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-md
                         bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold text-sm
                         transition-colors duration-150"
            >
              <DiscordIcon className="w-5 h-5" />
              Sign in with Discord
            </a>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#111113] px-3 text-zinc-500">or continue with email</span>
              </div>
            </div>

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
                          placeholder="Enter your password"
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
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm text-zinc-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#00FF88] hover:text-[#00d474] font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-zinc-500 mt-6">
          By signing in, you agree to our{" "}
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
