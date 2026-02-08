"use client";

import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignOut, GearSix, User } from "@phosphor-icons/react";
import Link from "next/link";

const tierColors: Record<string, string> = {
  free: "bg-zinc-800/50 text-zinc-500 border-zinc-700/30",
  bench: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  rookie: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  mvp: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export function Header() {
  const { user, subscription, logout } = useAuth();

  const displayName = user?.discordUsername || user?.email || "Unknown";
  const initials = user?.discordUsername
    ? user.discordUsername.substring(0, 2).toUpperCase()
    : user?.email
      ? user.email.substring(0, 2).toUpperCase()
      : "??";

  const tier = subscription?.tier || "free";

  return (
    <header className="h-16 border-b border-white/5 bg-[#0a0a0a] px-6 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-mono font-semibold text-white">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <Badge className={`${tierColors[tier]} border font-mono text-xs`}>
          {tier.toUpperCase()}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-colors">
              <Avatar className="w-8 h-8 border border-white/10">
                {user?.discordAvatar && (
                  <AvatarImage src={user.discordAvatar} alt={displayName} />
                )}
                <AvatarFallback className="bg-[#111113] text-zinc-400 text-xs font-mono">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-[#111113] border-white/10"
          >
            <DropdownMenuLabel className="text-zinc-400 font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-white truncate">
                  {displayName}
                </p>
                <p className="text-xs text-zinc-500">
                  {tier.charAt(0).toUpperCase() + tier.slice(1)} Plan
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-zinc-300 cursor-pointer"
              >
                <User size={16} weight="duotone" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/billing"
                className="flex items-center gap-2 text-zinc-300 cursor-pointer"
              >
                <GearSix size={16} weight="duotone" />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              onClick={logout}
              className="flex items-center gap-2 text-red-400 cursor-pointer focus:text-red-400"
            >
              <SignOut size={16} weight="duotone" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
