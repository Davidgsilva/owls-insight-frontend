"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UsageData {
  totalRequests: number;
  successfulRequests: number;
  rateLimits: {
    minute: { count: number; limit: number };
    month: { count: number; limit: number };
  };
}

interface KeysData {
  count: number;
  maxKeys: number;
}

function StatCard({
  label,
  value,
  sub,
  accent,
  loading,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="group relative rounded-xl bg-[#111113] border border-white/[0.06] p-5 transition-colors duration-200 hover:border-white/[0.12]">
      <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-4">
        {label}
      </p>
      <p
        className={cn(
          "text-[32px] leading-none font-mono font-bold tracking-tight",
          accent ? "text-[#00FF88]" : "text-white"
        )}
      >
        {loading ? (
          <span className="inline-block w-16 h-8 bg-white/5 rounded animate-pulse" />
        ) : (
          value
        )}
      </p>
      <p className="text-xs text-zinc-500 mt-2 font-sans">{sub}</p>
    </div>
  );
}

function UsageBar({ used, total, loading }: { used: number; total: number; loading?: boolean }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  return (
    <div className="mt-3">
      <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
        {!loading && (
          <div
            className="h-full rounded-full bg-[#00FF88] transition-[width] duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  );
}

function DashboardContent() {
  const { user, subscription } = useAuth();
  const searchParams = useSearchParams();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [keys, setKeys] = useState<KeysData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle Discord OAuth redirect with trial intent
  useEffect(() => {
    if (searchParams.get("start_trial") === "mvp") {
      // Remove param from URL to prevent re-triggering
      window.history.replaceState({}, "", "/dashboard");
      // Redirect to Stripe checkout for MVP trial
      fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          tier: "mvp",
          successUrl: `${window.location.origin}/dashboard?checkout=success&trial=true`,
          cancelUrl: `${window.location.origin}/pricing?checkout=canceled`,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.url) window.location.href = data.url;
        })
        .catch(() => {
          // Checkout failed silently — user can start trial from billing page
        });
    }
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      const controller = new AbortController();
      try {
        const [usageRes, keysRes] = await Promise.all([
          fetch("/api/usage", { credentials: "include", signal: controller.signal }),
          fetch("/api/auth/keys", { credentials: "include", signal: controller.signal }),
        ]);

        if (cancelled) return;

        if (usageRes.ok) {
          const usageData = await usageRes.json();
          if (usageData.success && usageData.usage?.[0]) {
            setUsage({
              totalRequests: usageData.totals?.totalRequests || 0,
              successfulRequests: usageData.totals?.successfulRequests || 0,
              rateLimits: usageData.usage[0].currentRateLimits || {
                minute: { count: 0, limit: 20 },
                month: { count: 0, limit: 10000 },
              },
            });
          }
        }

        if (cancelled) return;

        if (keysRes.ok) {
          const keysData = await keysRes.json();
          if (keysData.success) {
            setKeys({
              count: keysData.count,
              maxKeys: keysData.maxKeys,
            });
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const validTiers = ["bench", "rookie", "mvp"] as const;
  const rawTier = subscription?.tier;
  const tier = rawTier && validTiers.includes(rawTier) ? rawTier : "bench";
  const tierLimits = {
    bench: { month: 10000, minute: 20 },
    rookie: { month: 75000, minute: 120 },
    mvp: { month: 300000, minute: 400 },
  };
  const limits = tierLimits[tier];

  const monthUsed = usage?.rateLimits?.month?.count || 0;
  const monthPct = ((monthUsed / limits.month) * 100).toFixed(1);

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-mono font-bold text-white tracking-tight">
          Overview
        </h1>
        <p className="text-zinc-500 text-sm mt-1 font-sans">
          API usage and account status
        </p>
      </div>

      {/* Metrics */}
      <section aria-label="Usage metrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Requests today"
            value={isLoading ? "" : (usage?.totalRequests || 0).toLocaleString()}
            sub={`${usage?.successfulRequests || 0} successful`}
            loading={isLoading}
          />

          <div className="group relative rounded-xl bg-[#111113] border border-white/[0.06] p-5 transition-colors duration-200 hover:border-white/[0.12]">
            <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-4">
              Monthly usage
            </p>
            <p className="text-[32px] leading-none font-mono font-bold tracking-tight text-white">
              {isLoading ? (
                <span className="inline-block w-16 h-8 bg-white/5 rounded animate-pulse" />
              ) : (
                <>{monthPct}<span className="text-lg text-zinc-500 ml-0.5">%</span></>
              )}
            </p>
            <p className="text-xs text-zinc-500 mt-2 font-sans">
              {monthUsed.toLocaleString()} / {limits.month.toLocaleString()}
            </p>
            <UsageBar used={monthUsed} total={limits.month} loading={isLoading} />
          </div>

          <StatCard
            label="API keys"
            value={isLoading ? "" : `${keys?.count || 0}`}
            sub={`of ${keys?.maxKeys || 5} available`}
            loading={isLoading}
          />

          <div className="group relative rounded-xl bg-[#111113] border border-white/[0.06] p-5 transition-colors duration-200 hover:border-white/[0.12]">
            <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-4">
              Plan
            </p>
            <Badge
              className={cn(
                "font-mono text-xs border mt-1",
                tier === "mvp"
                  ? "bg-purple-500/15 text-purple-400 border-purple-500/25"
                  : tier === "rookie"
                  ? "bg-[#06b6d4]/15 text-[#06b6d4] border-[#06b6d4]/25"
                  : "bg-zinc-500/15 text-zinc-400 border-zinc-500/25"
              )}
            >
              {tier.toUpperCase()}
            </Badge>
            <p className="text-xs text-zinc-500 mt-3 font-sans">
              {tier === "mvp"
                ? "Full access"
                : tier === "rookie"
                ? "Standard access"
                : "Basic access"}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section aria-label="Quick actions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link
            href="/dashboard/keys"
            className="group relative rounded-xl bg-[#111113] border border-white/[0.06] p-6 transition-colors duration-200 hover:border-[#00FF88]/20 focus-visible:ring-2 focus-visible:ring-[#00FF88]/50 focus-visible:outline-none"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-mono font-semibold text-white mb-1">
                  API Keys
                </h2>
                <p className="text-sm text-zinc-500 font-sans leading-relaxed">
                  Create and manage keys for programmatic access
                </p>
              </div>
              <span
                className="text-zinc-600 group-hover:text-[#00FF88] group-hover:translate-x-0.5 transition-all duration-200 text-lg mt-0.5"
                aria-hidden="true"
              >
                &rarr;
              </span>
            </div>
          </Link>

          <Link
            href="/docs"
            className="group relative rounded-xl bg-[#111113] border border-white/[0.06] p-6 transition-colors duration-200 hover:border-white/[0.12] focus-visible:ring-2 focus-visible:ring-[#00FF88]/50 focus-visible:outline-none"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-mono font-semibold text-white mb-1">
                  Documentation
                </h2>
                <p className="text-sm text-zinc-500 font-sans leading-relaxed">
                  Integrate the API into your application
                </p>
              </div>
              <span
                className="text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200 text-lg mt-0.5"
                aria-hidden="true"
              >
                &rarr;
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Upgrade Banner */}
      {tier !== "mvp" && (
        <section aria-label="Upgrade plan">
          <Link
            href="/dashboard/billing"
            className="group block relative rounded-xl border border-purple-500/15 overflow-hidden focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:outline-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/[0.07] via-transparent to-[#00FF88]/[0.05]" />
            <div className="relative flex items-center justify-between p-6">
              <div>
                <h2 className="text-sm font-mono font-semibold text-white">
                  Upgrade to {tier === "bench" ? "Rookie or MVP" : "MVP"}
                </h2>
                <p className="text-sm text-zinc-500 mt-1 font-sans">
                  More requests, WebSocket access, and historical data
                </p>
              </div>
              <span className="shrink-0 ml-4 text-xs font-mono font-medium text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-md px-3 py-1.5 group-hover:bg-purple-500/20 transition-colors duration-200">
                Upgrade
              </span>
            </div>
          </Link>
        </section>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
