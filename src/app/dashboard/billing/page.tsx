"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Lightning, ArrowSquareOut } from "@phosphor-icons/react";

const tiers = {
  bench: {
    name: "Bench",
    price: "$9.99",
    description: "Perfect for getting started",
    features: [
      "10,000 requests/month",
      "20 requests/minute",
      "REST API access",
      "6 sportsbooks",
      "45-second data delay",
    ],
    color: "zinc",
  },
  rookie: {
    name: "Rookie",
    price: "$24.99",
    description: "For growing applications",
    features: [
      "75,000 requests/month",
      "120 requests/minute",
      "REST + WebSocket (2 connections)",
      "Player props access",
      "Historical odds & props",
      "Real-time updates",
    ],
    color: "blue",
  },
  mvp: {
    name: "MVP",
    price: "$49.99",
    description: "Maximum power for professionals",
    features: [
      "300,000 requests/month",
      "400 requests/minute",
      "REST + WebSocket (5 connections)",
      "Full props + alternates",
      "Full historical odds & props",
      "Priority support",
    ],
    color: "purple",
  },
};

export default function BillingPage() {
  const { subscription, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Validate tier from API to prevent runtime errors
  const validTiers = ["free", "bench", "rookie", "mvp"] as const;
  const rawTier = subscription?.tier;
  const currentTier = rawTier && validTiers.includes(rawTier) ? rawTier : "free";

  function getTrialDaysRemaining(): number | null {
    if (subscription?.status !== "trialing" || !subscription.currentPeriodEnd) return null;
    const endDate = new Date(subscription.currentPeriodEnd);
    const diffMs = endDate.getTime() - Date.now();
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }

  const trialDays = getTrialDaysRemaining();
  const isTrialing = subscription?.status === "trialing";

  async function handleUpgrade(tier: "bench" | "rookie" | "mvp") {
    setIsLoading(tier);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          tier,
          successUrl: `${window.location.origin}/dashboard/billing?checkout=success`,
          cancelUrl: `${window.location.origin}/dashboard/billing?checkout=canceled`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to start checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to start checkout");
    } finally {
      setIsLoading(null);
    }
  }

  async function handleManageBilling() {
    setIsLoading("portal");
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/dashboard/billing`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to open billing portal");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to open billing portal");
    } finally {
      setIsLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-mono font-bold text-white">Billing</h1>
        <p className="text-zinc-400 mt-1">
          Manage your subscription and billing details
        </p>
      </div>

      {/* Current Plan */}
      <Card className="bg-[#111113] border-white/5">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-white flex items-center gap-2">
            <CreditCard size={20} weight="duotone" className="text-[#00FF88]" />
            Current Plan
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Your current subscription details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge
                className={`font-mono text-lg px-4 py-2 ${
                  currentTier === "mvp"
                    ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                    : currentTier === "rookie"
                    ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    : currentTier === "bench"
                    ? "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
                    : "bg-zinc-800/50 text-zinc-500 border-zinc-700/30"
                } border`}
              >
                {currentTier.toUpperCase()}
              </Badge>
              <div>
                <p className="text-white font-semibold">
                  {currentTier === "free" ? "No active plan" : `${tiers[currentTier].price}/month`}
                </p>
                <p className="text-zinc-500 text-sm">
                  {currentTier === "free"
                    ? "Subscribe to get API access"
                    : isTrialing && trialDays !== null
                    ? `Free trial — ${trialDays} day${trialDays !== 1 ? "s" : ""} remaining`
                    : subscription?.status === "active"
                    ? "Active"
                    : subscription?.status || "Active"}
                </p>
              </div>
            </div>
            {currentTier !== "free" && (
              <Button
                onClick={handleManageBilling}
                disabled={isLoading === "portal"}
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5"
              >
                {isLoading === "portal" ? "Loading..." : "Manage Billing"}
                <ArrowSquareOut size={16} className="ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trial Banner */}
      {isTrialing && trialDays !== null && (
        <Card className="bg-[#00FF88]/5 border-[#00FF88]/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#00FF88] font-mono font-semibold text-lg">
                  MVP Free Trial
                </p>
                <p className="text-zinc-400 text-sm mt-1">
                  {trialDays > 0
                    ? `Your trial ends on ${new Date(subscription!.currentPeriodEnd!).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. Your card will be charged $49.99/mo after the trial.`
                    : "Your trial has ended. Your card will be charged shortly."}
                </p>
              </div>
              <Button
                onClick={handleManageBilling}
                disabled={isLoading === "portal"}
                variant="outline"
                className="border-[#00FF88]/30 text-[#00FF88] hover:bg-[#00FF88]/10 shrink-0"
              >
                {isLoading === "portal" ? "Loading..." : "Cancel Trial"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div>
        <h2 className="text-lg font-mono font-semibold text-white mb-4">
          Available Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.entries(tiers) as [keyof typeof tiers, typeof tiers[keyof typeof tiers]][]).map(
            ([tier, config]) => {
              const isCurrent = tier === currentTier;
              const isUpgrade =
                currentTier === "free" ||
                (tier === "rookie" && currentTier === "bench") ||
                (tier === "mvp" && (currentTier === "bench" || currentTier === "rookie"));

              return (
                <Card
                  key={tier}
                  className={`bg-[#111113] ${
                    isCurrent
                      ? "border-[#00FF88]/50 ring-1 ring-[#00FF88]/20"
                      : "border-white/5"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-mono text-white">
                        {config.name}
                      </CardTitle>
                      {isCurrent && (
                        <Badge className="bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/30 border">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-white">
                        {config.price}
                      </span>
                      <span className="text-zinc-500">/month</span>
                    </div>
                    <CardDescription className="text-zinc-500">
                      {config.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {config.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-zinc-300"
                        >
                          <Check size={16} weight="bold" className="text-[#00FF88] shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {isCurrent ? (
                      <Button disabled className="w-full" variant="outline">
                        Current Plan
                      </Button>
                    ) : isUpgrade ? (
                      <Button
                        onClick={() => handleUpgrade(tier)}
                        disabled={isLoading === tier}
                        className="w-full bg-[#00FF88] hover:bg-[#00d474] text-[#0a0a0a] font-semibold"
                      >
                        {isLoading === tier ? "Loading..." : "Upgrade"}
                        <Lightning size={16} weight="fill" className="ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleManageBilling}
                        variant="outline"
                        className="w-full border-white/10 text-white hover:bg-white/5"
                      >
                        Manage in Portal
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            }
          )}
        </div>
      </div>

      {/* FAQ */}
      <Card className="bg-[#111113] border-white/5">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-white">
            Billing FAQ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-white font-medium">Can I upgrade or downgrade anytime?</h3>
            <p className="text-zinc-400 text-sm mt-1">
              Yes, you can change your plan at any time. Upgrades take effect immediately.
              Downgrades take effect at the end of your current billing period.
            </p>
          </div>
          <div>
            <h3 className="text-white font-medium">What happens if I exceed my limits?</h3>
            <p className="text-zinc-400 text-sm mt-1">
              Requests beyond your monthly limit will receive a 429 rate limit error.
              Consider upgrading for more capacity.
            </p>
          </div>
          <div>
            <h3 className="text-white font-medium">Do you offer refunds?</h3>
            <p className="text-zinc-400 text-sm mt-1">
              We offer a pro-rated refund within the first 7 days if you&apos;re not satisfied.
              Contact support for assistance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
