"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="py-16 border-t border-white/5 bg-[#0a0a0a]">
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

          {/* TODO: Uncomment when pages are ready
          {/* Product */}
          {/* <div>
            <h4 className="font-mono font-semibold text-sm mb-4 text-neutral-300">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-neutral-500 hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-sm text-neutral-500 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-sm text-neutral-500 hover:text-white transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#coverage"
                  className="text-sm text-neutral-500 hover:text-white transition-colors"
                >
                  Coverage
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Resources */}
          {/* <div>
            <h4 className="font-mono font-semibold text-sm mb-4 text-neutral-300">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/docs#quickstart"
                  className="text-sm text-neutral-500 hover:text-white transition-colors"
                >
                  Quick Start
                </Link>
              </li>
              <li>
                <Link
                  href="/docs#api-reference"
                  className="text-sm text-neutral-500 hover:text-white transition-colors"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="/docs#websocket"
                  className="text-sm text-neutral-500 hover:text-white transition-colors"
                >
                  WebSocket Guide
                </Link>
              </li>
              <li>
                <a
                  href="https://status.owlsinsight.com"
                  className="text-sm text-neutral-500 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Status Page
                </a>
              </li>
            </ul>
          </div> */}

          {/* Company */}
          {/* <div>
            <h4 className="font-mono font-semibold text-sm mb-4 text-neutral-300">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-neutral-500 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@owlsinsight.com"
                  className="text-sm text-neutral-500 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-neutral-500 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-neutral-500 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          */}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-600">
            &copy; {new Date().getFullYear()} Owls Insight. All rights reserved.
          </p>

          {/* API Status indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111111] border border-white/5">
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
