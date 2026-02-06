"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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
      toast.success("Account created successfully!");
      router.push("/dashboard");
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
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[#00FF88]/10 border border-[#00FF88]/20 flex items-center justify-center">
              <span className="text-[#00FF88] font-mono font-bold text-lg">OI</span>
            </div>
            <span className="font-mono text-xl font-semibold text-white">Owls Insight</span>
          </Link>
        </div>

        <Card className="bg-[#111113] border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-mono text-white">Create an account</CardTitle>
            <CardDescription className="text-zinc-400">
              Get started with your API access today
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  {isLoading ? "Creating account..." : "Create account"}
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
