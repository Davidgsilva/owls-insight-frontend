"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, DiscordLogo, Lock, EnvelopeSimple } from "@phosphor-icons/react";

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-mono font-bold text-white">Account</h1>
        <p className="text-zinc-400 mt-1">
          Manage your account settings
        </p>
      </div>

      {/* Account Info Card */}
      <Card className="bg-[#111113] border-white/5">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-white flex items-center gap-2">
            <User size={20} weight="duotone" className="text-[#00FF88]" />
            Account Info
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Your account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <EnvelopeSimple size={18} className="text-zinc-500" />
              <span className="text-zinc-400 text-sm">Email</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">{user?.email}</span>
              {user?.emailVerified ? (
                <Badge className="bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/30 border text-xs">
                  Verified
                </Badge>
              ) : (
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 border text-xs">
                  Unverified
                </Badge>
              )}
            </div>
          </div>

          <div className="border-t border-white/5" />

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <User size={18} className="text-zinc-500" />
              <span className="text-zinc-400 text-sm">Member since</span>
            </div>
            <span className="text-white text-sm">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "-"}
            </span>
          </div>

          {user?.discordUsername && (
            <>
              <div className="border-t border-white/5" />
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <DiscordLogo size={18} className="text-zinc-500" />
                  <span className="text-zinc-400 text-sm">Discord</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">{user.discordUsername}</span>
                  <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 border text-xs">
                    Connected
                  </Badge>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Change Password Card */}
      {user?.hasPassword ? (
        <ChangePasswordForm />
      ) : (
        <Card className="bg-[#111113] border-white/5">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-white flex items-center gap-2">
              <Lock size={20} weight="duotone" className="text-[#00FF88]" />
              Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400 text-sm">
              Your account uses Discord login and doesn&apos;t have a password set.
              To add a password, use the{" "}
              <Link href="/forgot-password" className="text-[#00FF88] hover:underline">
                forgot password
              </Link>{" "}
              flow with your email address.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ChangePasswordForm() {
  const { refreshUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data.details
          ? Array.isArray(data.details)
            ? data.details.join(". ")
            : data.details
          : data.error || "Failed to change password";
        throw new Error(message);
      }

      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      await refreshUser();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="bg-[#111113] border-white/5">
      <CardHeader>
        <CardTitle className="text-lg font-mono text-white flex items-center gap-2">
          <Lock size={20} weight="duotone" className="text-[#00FF88]" />
          Change Password
        </CardTitle>
        <CardDescription className="text-zinc-500">
          Update your account password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-zinc-300">
              Current Password
            </Label>
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="bg-[#0a0a0a] border-white/10 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-zinc-300">
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="bg-[#0a0a0a] border-white/10 text-white"
            />
            <p className="text-xs text-zinc-500">
              Must be 8+ characters with uppercase, lowercase, number, and special character.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-zinc-300">
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="bg-[#0a0a0a] border-white/10 text-white"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
            className="bg-[#00FF88] hover:bg-[#00d474] text-[#0a0a0a] font-semibold"
          >
            {isLoading ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
