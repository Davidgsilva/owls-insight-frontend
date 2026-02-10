"use client";

import {
  Lightning,
  Broadcast,
  ClockCounterClockwise,
  ShieldCheck,
  ChartBar,
  UsersThree,
} from "@phosphor-icons/react";

const features = [
  {
    icon: Lightning,
    title: "Multi-Book Aggregation",
    description:
      "Sportsbooks and prediction markets — all normalized into a single, consistent API schema.",
    highlight: "Aggregated",
  },
  {
    icon: Broadcast,
    title: "WebSocket Streaming",
    description:
      "Real-time push updates the moment lines move. No polling required. Subscribe to specific events or entire markets.",
    highlight: "Real-time",
  },
  {
    icon: ClockCounterClockwise,
    title: "Line History & Analytics",
    description:
      "Track opening lines, line movements, and historical data. Identify CLV opportunities and steam moves.",
    highlight: "Full History",
  },
  {
    icon: ShieldCheck,
    title: "99.9% Uptime SLA",
    description:
      "Enterprise-grade infrastructure with automatic failover. Rate limiting per API key with generous quotas.",
    highlight: "Enterprise",
  },
  {
    icon: ChartBar,
    title: "Player Props",
    description:
      "Complete player prop markets including points, rebounds, assists, and more. Available on Pro and Enterprise tiers.",
    highlight: "Full Props",
  },
  {
    icon: UsersThree,
    title: "Multi-Sport Coverage",
    description:
      "NBA, NFL, NHL, MLB, NCAAB, and NCAAF. All major sports with consistent data schemas across markets.",
    highlight: "Multi-Sport",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00FF88]/20 bg-[#00FF88]/5 mb-6">
            <span className="text-xs font-mono text-[#00FF88]">FEATURES</span>
          </div>
          <h2 className="text-4xl font-mono font-bold mb-4">
            Built for{" "}
            <span className="text-[#00FF88] text-glow-green">Speed & Scale</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Every feature designed for professional traders, sportsbook operators,
            and data analysts who need reliable, fast, and comprehensive odds data.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="relative p-6 rounded-xl bg-[#111111] border border-white/5"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Highlight badge */}
              <div className="absolute top-4 right-4">
                <span className="text-xs font-mono text-[#00FF88]/60">
                  {feature.highlight}
                </span>
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <feature.icon size={24} weight="duotone" className="text-neutral-400" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-mono font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
