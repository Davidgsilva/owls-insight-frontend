"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TerminalDemo } from "./TerminalDemo";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      {/* Gradient orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#00FF88]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00FF88]/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left column - Text */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00FF88]/20 bg-[#00FF88]/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF88]" />
              </span>
              <span className="text-xs font-mono text-[#00FF88]">
                LIVE DATA STREAMING
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-mono font-bold leading-[1.1] tracking-tight opacity-0 animate-fade-in-up stagger-1">
              Real-Time Odds.
              <br />
              <span className="text-[#00FF88] text-glow-primary">
                Institutional Grade.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-zinc-400 leading-relaxed max-w-lg opacity-0 animate-fade-in-up stagger-2">
              Access live betting odds from{" "}
              <span className="text-white font-medium">6 major sportsbooks</span>{" "}
              via REST API and WebSocket. Built for traders, analysts, and betting
              platforms that demand speed and reliability.
            </p>

            {/* Stats row */}
            <div className="flex gap-8 opacity-0 animate-fade-in-up stagger-3">
              <div>
                <div className="text-3xl font-mono font-bold text-[#00FF88] text-glow-green">
                  &lt;500ms
                </div>
                <div className="text-sm text-zinc-500">Avg Latency</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="text-3xl font-mono font-bold text-white">6</div>
                <div className="text-sm text-zinc-500">Sportsbooks</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="text-3xl font-mono font-bold text-white">99.9%</div>
                <div className="text-sm text-zinc-500">Uptime</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 opacity-0 animate-fade-in-up stagger-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-[#00FF88] hover:bg-[#00d4aa] text-[#0a0a0a] font-mono font-medium px-6 glow-primary"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/docs">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/10 bg-white/5 hover:bg-white/10 font-mono"
                >
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>

          {/* Right column - Terminal Demo */}
          <div className="opacity-0 animate-fade-in-up stagger-5">
            <TerminalDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
