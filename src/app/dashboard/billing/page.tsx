"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, CreditCard, ArrowSquareOut, CurrencyBtc, PaypalLogo, ShieldCheck, Envelope } from "@phosphor-icons/react";

const tiers = {
  bench: {
    name: "Bench",
    price: "$9.99",
    description: "Perfect for getting started",
    features: [
      "10,000 requests/month",
      "20 requests/minute",
      "REST API access",
      "All sportsbooks and prediction markets",
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
      "Real-time sharp Pinnacle odds",
      "Full props + alternates",
      "Historical odds & props",
    ],
    color: "purple",
  },
  hall_of_fame: {
    name: "Hall of Fame",
    price: "$200",
    description: "Enterprise-grade, unlimited volume",
    features: [
      "Unlimited monthly requests",
      "1,000 requests/minute burst",
      "REST + WebSocket (20 connections)",
      "20 concurrent requests",
      "Everything in MVP",
    ],
    color: "amber",
  },
};

export default function BillingPage() {
  return (
    <Suspense>
      <BillingContent />
    </Suspense>
  );
}

function BillingContent() {
  const { subscription, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [paymentDialogTier, setPaymentDialogTier] = useState<"bench" | "rookie" | "mvp" | "hall_of_fame" | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const searchParams = useSearchParams();
  const hasSynced = useRef(false);

  // When returning from Stripe portal or checkout, sync subscription state
  // directly from Stripe to avoid stale data due to webhook processing delay
  useEffect(() => {
    const fromPortal = searchParams.get("from") === "portal";
    const checkoutSuccess = searchParams.get("checkout") === "success";
    const paypalSuccess = searchParams.get("paypal") === "success";
    const cryptoSuccess = searchParams.get("crypto") === "success";
    if ((fromPortal || checkoutSuccess || paypalSuccess || cryptoSuccess) && !hasSynced.current) {
      hasSynced.current = true;
      window.history.replaceState({}, "", "/dashboard/billing");
      if (paypalSuccess) {
        const subId = sessionStorage.getItem("paypal_sub_id");
        sessionStorage.removeItem("paypal_sub_id");
        fetch("/api/paypal/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ subscriptionId: subId }),
        })
          .catch(() => {})
          .finally(() => refreshUser());
      } else {
        const syncUrl = cryptoSuccess ? "/api/nowpayments/sync" : "/api/stripe/sync";
        fetch(syncUrl, { method: "POST", credentials: "include" })
          .catch(() => {})
          .finally(() => refreshUser());
      }
    }
  }, [searchParams, refreshUser]);

  // Validate tier from API to prevent runtime errors
  const validTiers = ["free", "bench", "rookie", "mvp", "hall_of_fame"] as const;
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
  const trialCanceled = isTrialing && subscription?.cancelAtPeriodEnd;
  const trialEligible = subscription?.trialEligible ?? false;

  async function handleUpgrade(tier: "bench" | "rookie" | "mvp" | "hall_of_fame") {
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
          returnUrl: `${window.location.origin}/dashboard/billing?from=portal`,
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

  async function handlePayPalCheckout(tier: "bench" | "rookie" | "mvp" | "hall_of_fame") {
    setPaymentDialogTier(null);
    setIsLoading(tier);
    try {
      const res = await fetch("/api/paypal/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tier }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to start PayPal checkout");
      }

      if (data.approvalUrl) {
        if (data.subscriptionId) {
          sessionStorage.setItem("paypal_sub_id", data.subscriptionId);
        }
        window.location.href = data.approvalUrl;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to start PayPal checkout");
    } finally {
      setIsLoading(null);
    }
  }

  async function handlePayPalCancel() {
    setIsLoading("paypal-cancel");
    try {
      const res = await fetch("/api/paypal/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel subscription");
      }

      toast.success("Cancellation requested — your plan stays active until the billing period ends");
      await refreshUser();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel subscription");
    } finally {
      setIsLoading(null);
    }
  }

  async function handleCryptoCheckout(tier: "bench" | "rookie" | "mvp" | "hall_of_fame") {
    setPaymentDialogTier(null);
    setIsLoading(tier);
    try {
      const res = await fetch("/api/nowpayments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tier }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to start crypto checkout");
      }

      if (data.trial) {
        toast.success("Your 3-day free trial has started!");
        await refreshUser();
      } else if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        toast.success("Crypto subscription created. Check your email for invoice.");
        await refreshUser();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to start crypto checkout");
    } finally {
      setIsLoading(null);
    }
  }

  async function handleCryptoCancel() {
    setIsLoading("crypto-cancel");
    try {
      const res = await fetch("/api/nowpayments/cancel", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel subscription");
      }

      toast.success("Crypto subscription canceled successfully");
      await refreshUser();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel subscription");
    } finally {
      setIsLoading(null);
    }
  }

  const isPayPal = subscription?.paymentProvider === "paypal";
  const isCrypto = subscription?.paymentProvider === "nowpayments";

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
                  currentTier === "hall_of_fame"
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    : currentTier === "mvp"
                    ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                    : currentTier === "rookie"
                    ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    : currentTier === "bench"
                    ? "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
                    : "bg-zinc-800/50 text-zinc-500 border-zinc-700/30"
                } border`}
              >
                {currentTier === "hall_of_fame" ? "HALL OF FAME" : currentTier.toUpperCase()}
              </Badge>
              <div>
                <p className="text-white font-semibold">
                  {currentTier === "free" ? "No active plan" : `${tiers[currentTier].price}/month`}
                  {isPayPal && currentTier !== "free" && (
                    <span className="text-zinc-500 text-sm font-normal ml-2">via PayPal</span>
                  )}
                  {isCrypto && currentTier !== "free" && (
                    <span className="text-zinc-500 text-sm font-normal ml-2">via Crypto</span>
                  )}
                </p>
                <p className="text-zinc-500 text-sm">
                  {currentTier === "free"
                    ? "Subscribe to get API access"
                    : trialCanceled && trialDays !== null
                    ? `Trial canceled — access until ${new Date(subscription!.currentPeriodEnd!).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                    : isTrialing && trialDays !== null
                    ? `Free trial — ${trialDays} day${trialDays !== 1 ? "s" : ""} remaining`
                    : subscription?.cancelAtPeriodEnd && subscription?.currentPeriodEnd
                    ? `Cancels ${new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                    : subscription?.status === "active"
                    ? "Active"
                    : subscription?.status || "Active"}
                </p>
              </div>
            </div>
            {currentTier !== "free" && (
              isCrypto ? (
                <Button
                  onClick={handleCryptoCancel}
                  disabled={isLoading === "crypto-cancel"}
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  {isLoading === "crypto-cancel" ? "Canceling..." : "Cancel Subscription"}
                </Button>
              ) : isPayPal ? (
                subscription?.cancelAtPeriodEnd ? null : (
                  <Button
                    onClick={() => setShowCancelConfirm(true)}
                    disabled={isLoading === "paypal-cancel"}
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    {isLoading === "paypal-cancel" ? "Canceling..." : "Cancel Subscription"}
                  </Button>
                )
              ) : (
                <Button
                  onClick={handleManageBilling}
                  disabled={isLoading === "portal"}
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5"
                >
                  {isLoading === "portal" ? "Loading..." : "Manage Billing"}
                  <ArrowSquareOut size={16} className="ml-2" />
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Free Trial Banner — shown to free users who haven't subscribed */}
      {trialEligible && (
        <Card className="bg-gradient-to-r from-purple-500/10 to-[#00FF88]/10 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-mono font-semibold text-lg">
                  Try MVP free for 3 days
                </p>
                <p className="text-zinc-400 text-sm mt-1">
                  Get full API access with 300K requests/month, WebSocket streaming, player props, and historical data.
                  Cancel anytime during the trial — you won&apos;t be charged.
                </p>
              </div>
              <Button
                onClick={() => setPaymentDialogTier("mvp")}
                disabled={isLoading === "mvp"}
                className="bg-[#00FF88] hover:bg-[#00d474] text-[#0a0a0a] font-semibold shrink-0 ml-4"
              >
                {isLoading === "mvp" ? "Loading..." : "Start 3-Day Free Trial"}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.entries(tiers) as [keyof typeof tiers, typeof tiers[keyof typeof tiers]][]).map(
            ([tier, config]) => {
              const isCurrent = tier === currentTier;
              const tierOrder: Record<string, number> = { free: 0, bench: 1, rookie: 2, mvp: 3, hall_of_fame: 4 };
              const isUpgrade = (tierOrder[tier] || 0) > (tierOrder[currentTier] || 0);

              return (
                <Card
                  key={tier}
                  className={`bg-[#111113] flex flex-col ${
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
                      {tier === "mvp" && trialEligible && (
                        <p className="text-xs text-[#00FF88] font-mono mt-1">3-day free trial</p>
                      )}
                    </div>
                    <CardDescription className="text-zinc-500">
                      {config.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1 space-y-4">
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

                    <div className="mt-auto pt-4">
                      {isCurrent ? (
                        <Button disabled className="w-full" variant="outline">
                          Current Plan
                        </Button>
                      ) : isUpgrade ? (
                        <Button
                          onClick={() => setPaymentDialogTier(tier)}
                          disabled={isLoading === tier}
                          className="w-full bg-[#00FF88] hover:bg-[#00d474] text-[#0a0a0a] font-semibold"
                        >
                          {isLoading === tier
                            ? "Loading..."
                            : tier === "mvp" && trialEligible
                            ? "Start 3-Day Free Trial"
                            : "Upgrade"}
                        </Button>
                      ) : isPayPal || isCrypto ? (
                        <Button disabled variant="outline" className="w-full border-white/10 text-zinc-500">
                          Cancel first to switch
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
                    </div>
                  </CardContent>
                </Card>
              );
            }
          )}
        </div>
      </div>

      {/* Payment Method Dialog */}
      <Dialog open={!!paymentDialogTier} onOpenChange={(open) => !open && setPaymentDialogTier(null)}>
        <DialogContent className="bg-[#111113] border-white/10 sm:max-w-[420px] p-0 gap-0 overflow-hidden">
          <div className="px-6 pt-6 pb-4">
            <DialogHeader>
              <DialogTitle className="text-white font-mono text-lg">Choose Payment Method</DialogTitle>
              <DialogDescription className="text-zinc-400 text-sm">
                {paymentDialogTier && (
                  paymentDialogTier === "mvp" && trialEligible ? (
                    <>
                      Start your 3-day free trial of{" "}
                      <span className="font-semibold text-purple-400">MVP</span>
                    </>
                  ) : (
                    <>
                      Subscribe to{" "}
                      <span className={`font-semibold ${
                        paymentDialogTier === "hall_of_fame" ? "text-amber-400" :
                        paymentDialogTier === "mvp" ? "text-purple-400" :
                        paymentDialogTier === "rookie" ? "text-blue-400" : "text-zinc-300"
                      }`}>
                        {tiers[paymentDialogTier].name}
                      </span>
                      {" "}&middot;{" "}
                      <span className="text-white font-medium">{tiers[paymentDialogTier].price}/mo</span>
                    </>
                  )
                )}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 pb-6 flex flex-col gap-2">
            {/* Card */}
            <button
              onClick={() => {
                if (paymentDialogTier) {
                  setPaymentDialogTier(null);
                  handleUpgrade(paymentDialogTier);
                }
              }}
              disabled={!!isLoading}
              className="group flex items-center gap-4 w-full rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 transition-all px-4 py-3.5 text-left disabled:opacity-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <CreditCard size={22} weight="duotone" className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">Credit or Debit Card</p>
                <p className="text-zinc-500 text-xs">Visa, Mastercard, Amex</p>
              </div>
              {paymentDialogTier === "mvp" && trialEligible && (
                <Badge className="bg-[#00FF88]/15 text-[#00FF88] border-[#00FF88]/20 border text-[10px] font-mono shrink-0">
                  3-DAY TRIAL
                </Badge>
              )}
            </button>

            {/* PayPal — not available for Hall of Fame */}
            {paymentDialogTier !== "hall_of_fame" && <button
              onClick={() => {
                if (paymentDialogTier) handlePayPalCheckout(paymentDialogTier);
              }}
              disabled={!!isLoading}
              className="group flex items-center gap-4 w-full rounded-xl border border-white/10 bg-white/[0.03] hover:bg-[#0070BA]/10 hover:border-[#0070BA]/30 transition-all px-4 py-3.5 text-left disabled:opacity-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0070BA]/15">
                <PaypalLogo size={22} weight="fill" className="text-[#0070BA]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">PayPal</p>
                <p className="text-zinc-500 text-xs">Pay with your PayPal account</p>
              </div>
              {paymentDialogTier === "mvp" && trialEligible && (
                <Badge className="bg-[#00FF88]/15 text-[#00FF88] border-[#00FF88]/20 border text-[10px] font-mono shrink-0">
                  3-DAY TRIAL
                </Badge>
              )}
            </button>}

            {/* Crypto — not available for Hall of Fame */}
            {paymentDialogTier !== "hall_of_fame" && <button
              onClick={() => {
                if (paymentDialogTier) handleCryptoCheckout(paymentDialogTier);
              }}
              disabled={!!isLoading}
              className="group flex items-center gap-4 w-full rounded-xl border border-white/10 bg-white/[0.03] hover:bg-[#F7931A]/10 hover:border-[#F7931A]/30 transition-all px-4 py-3.5 text-left disabled:opacity-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F7931A]/15">
                <CurrencyBtc size={22} weight="bold" className="text-[#F7931A]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">Cryptocurrency</p>
                <p className="text-zinc-500 text-xs flex items-center gap-1">
                  <Envelope size={12} className="text-zinc-500" />
                  {paymentDialogTier === "mvp" && trialEligible
                    ? "No payment required during trial"
                    : "Payment link sent to your email"}
                </p>
              </div>
              {paymentDialogTier === "mvp" && trialEligible && (
                <Badge className="bg-[#00FF88]/15 text-[#00FF88] border-[#00FF88]/20 border text-[10px] font-mono shrink-0">
                  3-DAY TRIAL
                </Badge>
              )}
            </button>}
          </div>

          <div className="px-6 py-3 border-t border-white/5 bg-white/[0.02]">
            <p className="text-zinc-600 text-[11px] text-center flex items-center justify-center gap-1.5">
              <ShieldCheck size={13} weight="fill" className="text-zinc-500" />
              Payments processed securely. Cancel anytime.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <DialogContent className="bg-[#111113] border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white font-mono">Cancel Subscription?</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Your PayPal subscription will be canceled at the end of your current billing period. You&apos;ll retain access until then.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <Button
              onClick={() => setShowCancelConfirm(false)}
              variant="outline"
              className="flex-1 border-white/10 text-white hover:bg-white/5"
            >
              Keep Subscription
            </Button>
            <Button
              onClick={() => {
                setShowCancelConfirm(false);
                handlePayPalCancel();
              }}
              disabled={isLoading === "paypal-cancel"}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading === "paypal-cancel" ? "Canceling..." : "Yes, Cancel"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
              Contact us at{" "}
              <a href="mailto:david@wisesportsai.com" className="text-[#00FF88] hover:underline">
                david@wisesportsai.com
              </a>{" "}
              for assistance.
            </p>
          </div>
          <div>
            <h3 className="text-white font-medium">Need help?</h3>
            <p className="text-zinc-400 text-sm mt-1">
              For any questions about billing, API access, or technical support, reach out to{" "}
              <a href="mailto:david@wisesportsai.com" className="text-[#00FF88] hover:underline">
                david@wisesportsai.com
              </a>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
