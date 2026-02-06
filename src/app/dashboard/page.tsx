"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Key, BarChart3, FileText, Zap, ArrowRight } from "lucide-react";

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

export default function DashboardPage() {
  const { user, subscription } = useAuth();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [keys, setKeys] = useState<KeysData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        const [usageRes, keysRes] = await Promise.all([
          fetch("/api/usage", { credentials: "include", signal: controller.signal }),
          fetch("/api/auth/keys", { credentials: "include", signal: controller.signal }),
        ]);

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
        setIsLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, []);

  // Validate tier from API to prevent runtime errors
  const validTiers = ["bench", "rookie", "mvp"] as const;
  const rawTier = subscription?.tier;
  const tier = rawTier && validTiers.includes(rawTier) ? rawTier : "bench";
  const tierLimits = {
    bench: { month: 10000, minute: 20 },
    rookie: { month: 75000, minute: 120 },
    mvp: { month: 300000, minute: 400 },
  };

  const limits = tierLimits[tier];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-mono font-bold text-white">
          Welcome back
        </h1>
        <p className="text-zinc-400 mt-1">
          Here&apos;s an overview of your API usage
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#111113] border-white/5">
          <CardHeader className="pb-2">
            <CardDescription className="text-zinc-500 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Requests Today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-bold text-white">
              {isLoading ? "..." : (usage?.totalRequests || 0).toLocaleString()}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {usage?.successfulRequests || 0} successful
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#111113] border-white/5">
          <CardHeader className="pb-2">
            <CardDescription className="text-zinc-500 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Monthly Usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-bold text-white">
              {isLoading
                ? "..."
                : `${((usage?.rateLimits?.month?.count || 0) / limits.month * 100).toFixed(1)}%`}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {(usage?.rateLimits?.month?.count || 0).toLocaleString()} / {limits.month.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#111113] border-white/5">
          <CardHeader className="pb-2">
            <CardDescription className="text-zinc-500 flex items-center gap-2">
              <Key className="w-4 h-4" />
              API Keys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-bold text-white">
              {isLoading ? "..." : keys?.count || 0}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              of {keys?.maxKeys || 5} available
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#111113] border-white/5">
          <CardHeader className="pb-2">
            <CardDescription className="text-zinc-500 flex items-center gap-2">
              Subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge
              className={`font-mono ${
                tier === "mvp"
                  ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                  : tier === "rookie"
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  : "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
              } border`}
            >
              {tier.toUpperCase()}
            </Badge>
            <p className="text-xs text-zinc-500 mt-2">
              {tier === "mvp"
                ? "Full access"
                : tier === "rookie"
                ? "Standard access"
                : "Basic access"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[#111113] border-white/5">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-[#00FF88]" />
              API Keys
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Manage your API keys for programmatic access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/keys">
              <Button className="bg-[#00FF88] hover:bg-[#00d474] text-[#0a0a0a] font-semibold">
                Manage Keys
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-[#111113] border-white/5">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#00FF88]" />
              Documentation
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Learn how to integrate the API into your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/docs">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                View Docs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Tier Upgrade Banner (if not MVP) */}
      {tier !== "mvp" && (
        <Card className="bg-gradient-to-r from-purple-500/10 to-[#00FF88]/10 border-purple-500/20">
          <CardContent className="flex items-center justify-between py-6">
            <div>
              <h3 className="text-lg font-mono font-semibold text-white">
                Upgrade to {tier === "bench" ? "Rookie or MVP" : "MVP"}
              </h3>
              <p className="text-zinc-400 text-sm mt-1">
                Get more requests, WebSocket access, and historical data
              </p>
            </div>
            <Link href="/dashboard/billing">
              <Button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold">
                Upgrade Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
