"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="py-16 border-t border-white/[0.05] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/owl-logo.png"
                alt="Owls Insight"
                width={36}
                height={36}
              />
              <span className="font-mono font-medium text-lg">
                <span className="bg-gradient-to-r from-[#00FF88] to-[#00d4aa] bg-clip-text text-transparent">
                  Owls Insight
                </span>
              </span>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Professional-grade sports betting odds API with real-time WebSocket
              updates.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-mono font-semibold text-sm mb-4 text-neutral-300">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-neutral-500 hover:text-white transition-colors duration-200"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-sm text-neutral-500 hover:text-white transition-colors duration-200"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-sm text-neutral-500 hover:text-white transition-colors duration-200"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#coverage"
                  className="text-sm text-neutral-500 hover:text-white transition-colors duration-200"
                >
                  Coverage
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-mono font-semibold text-sm mb-4 text-neutral-300">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-neutral-500 hover:text-white transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-neutral-500 hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-neutral-500 hover:text-white transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h4 className="font-mono font-semibold text-sm mb-4 text-neutral-300">
              Get Started
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/register"
                  className="text-sm text-neutral-500 hover:text-white transition-colors duration-200"
                >
                  Sign Up Free
                </Link>
              </li>
              <li>
                <Link
                  href="/register?tier=mvp"
                  className="text-sm text-[#00FF88]/70 hover:text-[#00FF88] transition-colors duration-200"
                >
                  Start Free Trial
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-neutral-500 hover:text-white transition-colors duration-200"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-neutral-600">
              &copy; {new Date().getFullYear()} Owls Insight. All rights reserved.
            </p>
            <Link href="/privacy" className="text-sm text-neutral-600 hover:text-neutral-400 transition-colors duration-200">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-neutral-600 hover:text-neutral-400 transition-colors duration-200">
              Terms
            </Link>
          </div>

          {/* API Status indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111111] border border-white/[0.05]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF88]" />
            </span>
            <span className="text-xs font-mono text-neutral-400">
              API Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
