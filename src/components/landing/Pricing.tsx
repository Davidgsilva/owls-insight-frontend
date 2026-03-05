"use client";

import { Button } from "@/components/ui/button";
import { Check, Lightning } from "@phosphor-icons/react";
import Link from "next/link";


const tiers = [
  {
    id: "bench",
    name: "Bench",
    price: "$9.99",
    period: "/month",
    description: "Casual users, basic odds tracking",
    features: [
      "10,000 requests/month",
      "20 requests/minute",
      "REST API only",
      "All sportsbooks & prediction markets",
      "Odds, spreads & totals",
      "Live scores",
    ],
    cta: "Get Started",
    popular: false,
    color: "zinc",
  },
  {
    id: "rookie",
    name: "Rookie",
    price: "$24.99",
    period: "/month",
    description: "Active bettors, enhanced API access",
    features: [
      "75,000 REST requests/month",
      "120 REST requests/minute",
      "WebSocket (2 connections)",
      "Everything in Bench",
      "Player props access",
    ],
    cta: "Get Started",
    popular: false,
    color: "blue",
  },
  {
    id: "mvp",
    name: "MVP",
    price: "$49.99",
    period: "/month",
    description: "Professional users, high-volume applications",
    features: [
      "300,000 REST requests/month",
      "400 REST requests/minute",
      "WebSocket (5 connections)",
      "15 concurrent requests",
      "Everything in Rookie",
      "Real-time sharp odds",
      "Player props & live odds via WebSocket",
      "Historical odds & props",
    ],
    cta: "Start Free Trial",
    popular: true,
    color: "green",
  },
  {
    id: "hall_of_fame",
    name: "Hall of Fame",
    price: "$200",
    period: "/month",
    description: "Enterprise-grade, unlimited volume",
    features: [
      "Unlimited REST requests",
      "1,000 requests/minute burst",
      "WebSocket (20 connections)",
      "20 concurrent requests",
      "Everything in MVP",
      "Historical data",
    ],
    cta: "Get Started",
    popular: false,
    color: "amber",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-28 relative">
      {/* Subtle background glow behind pricing */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#00FF88]/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00FF88]/20 bg-[#00FF88]/5 mb-6">
            <span className="text-xs font-mono text-[#00FF88]">PRICING</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-mono font-bold mb-4">
            Simple, Transparent{" "}
            <span className="text-[#00FF88] text-glow-green">Pricing</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Start free, scale as you grow. No hidden fees, no surprise charges.
            Cancel anytime.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
          {tiers.map((tier) => {
            const isPopular = tier.popular;

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 ${
                  isPopular
                    ? "bg-gradient-to-b from-[#00FF88]/[0.08] to-[#00FF88]/[0.02] border-[#00FF88]/30 shadow-[0_0_40px_rgba(0,255,136,0.08)]"
                    : "bg-[#111111]/80 border-white/[0.06] hover:border-white/[0.12] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
                }`}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-[#00FF88] text-[#0a0a0a] text-xs font-mono font-semibold tracking-wide shadow-[0_0_20px_rgba(0,255,136,0.3)]">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="mb-6">
                  <h3 className="font-mono font-bold text-lg mb-3">{tier.name}</h3>

                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-mono font-bold tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-zinc-500 text-sm font-mono">
                      {tier.period}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500">{tier.description}</p>
                  {isPopular && (
                    <p className="text-xs text-[#00FF88] font-mono mt-2 flex items-center gap-1.5">
                      <Lightning size={12} weight="fill" />
                      3-day free trial
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div
                  className={`h-px mb-6 ${
                    isPopular
                      ? "bg-gradient-to-r from-transparent via-[#00FF88]/20 to-transparent"
                      : "bg-white/[0.06]"
                  }`}
                />

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <div
                        className={`mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                          isPopular ? "bg-[#00FF88]/15" : "bg-white/[0.06]"
                        }`}
                      >
                        <Check
                          size={10}
                          weight="bold"
                          className={
                            isPopular ? "text-[#00FF88]" : "text-zinc-400"
                          }
                        />
                      </div>
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href={`/register?tier=${tier.id}`}
                  className="block mt-auto"
                >
                  <Button
                    className={`w-full font-mono cursor-pointer transition-all duration-200 ${
                      isPopular
                        ? "bg-[#00FF88] hover:bg-[#00e67a] text-[#0a0a0a] font-semibold shadow-[0_0_20px_rgba(0,255,136,0.2)] hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]"
                        : "bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-zinc-200"
                    }`}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Feature comparison hint + FAQ */}
        <div className="mt-16 text-center space-y-3">
          <p className="text-sm text-zinc-500">
            All plans include access to all sportsbooks, prediction markets, and live scores.
          </p>
          <p className="text-neutral-500">
            Have questions?{" "}
            <Link
              href="/contact"
              className="text-[#00FF88] hover:text-[#00d4aa] transition-colors"
            >
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
