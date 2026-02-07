"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SquaresFour,
  Key,
  ChartBar,
  CreditCard,
  FileText,
  SignOut,
} from "@phosphor-icons/react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: SquaresFour },
  { name: "API Keys", href: "/dashboard/keys", icon: Key },
  { name: "Usage", href: "/dashboard/usage", icon: ChartBar },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

const secondaryNavigation = [
  { name: "Documentation", href: "/docs", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] border-r border-white/5 w-64">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00FF88]/10 border border-[#00FF88]/20 flex items-center justify-center">
            <span className="text-[#00FF88] font-mono font-bold text-sm">OI</span>
          </div>
          <span className="font-mono text-lg font-semibold text-white">Owls Insight</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#00FF88]/10 text-[#00FF88]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={20} weight="duotone" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Secondary Navigation */}
      <div className="p-4 border-t border-white/5 space-y-1">
        {secondaryNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <item.icon size={20} weight="duotone" />
            {item.name}
          </Link>
        ))}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-colors w-full"
        >
          <SignOut size={20} weight="duotone" />
          Sign out
        </button>
      </div>
    </div>
  );
}
