"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Bench",
    price: "Free",
    period: "trial",
    description: "Test the API and explore the data",
    features: [
      "100 requests/day",
      "REST API access",
      "All 6 sportsbooks",
      "Spreads & moneylines",
      "7-day trial",
    ],
    cta: "Start Free Trial",
    ctaVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Rookie",
    price: "$49.99",
    period: "/month",
    description: "For individual traders and researchers",
    features: [
      "10,000 requests/day",
      "REST API + WebSocket",
      "All 6 sportsbooks",
      "All market types",
      "Line history (30 days)",
      "Email support",
    ],
    cta: "Get Started",
    ctaVariant: "outline" as const,
    popular: false,
  },
  {
    name: "MVP",
    price: "$149.99",
    period: "/month",
    description: "For serious traders and small teams",
    features: [
      "100,000 requests/day",
      "REST API + WebSocket",
      "All 6 sportsbooks",
      "All market types",
      "Player props",
      "Line history (90 days)",
      "Opening lines",
      "Priority support",
    ],
    cta: "Start MVP Trial",
    ctaVariant: "default" as const,
    popular: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 mb-6">
            <span className="text-xs font-mono text-green-400">PRICING</span>
          </div>
          <h2 className="text-4xl font-mono font-bold mb-4">
            Simple, Transparent{" "}
            <span className="text-green-400">Pricing</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Start free, scale as you grow. No hidden fees, no surprise charges.
            Cancel anytime.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative p-6 rounded-xl border transition-all ${
                tier.popular
                  ? "bg-gradient-to-b from-[#00FF88]/10 to-transparent border-[#00FF88]/30 scale-105"
                  : "bg-[#111111] border-white/5 hover:border-white/10"
              }`}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-[#00FF88] text-[#0a0a0a] text-xs font-mono font-medium">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <h3 className="font-mono font-bold text-lg mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-mono font-bold">
                    {tier.price}
                  </span>
                  <span className="text-zinc-500 text-sm">{tier.period}</span>
                </div>
                <p className="text-sm text-zinc-500 mt-2">{tier.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    <span className="text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href="/register" className="block">
                <Button
                  variant={tier.ctaVariant}
                  className={`w-full font-mono ${
                    tier.popular
                      ? "bg-[#00FF88] hover:bg-[#00d4aa] text-[#0a0a0a]"
                      : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  {tier.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ teaser */}
        <div className="mt-16 text-center">
          <p className="text-neutral-500">
            Have questions?{" "}
            <a
              href="mailto:support@owlsinsight.com"
              className="text-[#00FF88] hover:text-[#00d4aa] transition-colors"
            >
              Contact us
            </a>{" "}
            or check our{" "}
            <Link
              href="/docs#faq"
              className="text-[#00FF88] hover:text-[#00d4aa] transition-colors"
            >
              FAQ
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
