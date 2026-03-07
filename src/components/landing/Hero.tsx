"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TerminalDemo } from "./TerminalDemo";


export function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      {/* Gradient orbs */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#00FF88]/[0.07] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#00FF88]/[0.04] rounded-full blur-[80px] pointer-events-none" />

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
              Live Odds.
              <br />
              <span className="text-[#00FF88] text-glow-primary">
                Top Books. One API.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-zinc-400 leading-relaxed max-w-lg opacity-0 animate-fade-in-up stagger-2">
              Access live betting odds from{" "}
              <span className="text-white font-medium">major sportsbooks and prediction markets</span>{" "}
              via REST API and WebSocket. Built for traders, analysts, and betting
              platforms that demand speed and reliability.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 opacity-0 animate-fade-in-up stagger-3">
              <Link href="/register?tier=mvp">
                <Button
                  size="lg"
                  className="bg-[#00FF88] hover:bg-[#00e67a] text-[#0a0a0a] font-mono font-semibold px-6 cursor-pointer shadow-[0_0_20px_rgba(0,255,136,0.25)] hover:shadow-[0_0_30px_rgba(0,255,136,0.35)] transition-all duration-200"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/docs">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/10 bg-white/[0.03] hover:bg-white/[0.08] font-mono cursor-pointer transition-all duration-200"
                >
                  View Documentation
                </Button>
              </Link>
            </div>

          </div>

          {/* Right column - Terminal Demo */}
          <div className="opacity-0 animate-fade-in-up stagger-4">
            <TerminalDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
