"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/owl-logo.png"
            alt="Owls Insight"
            width={44}
            height={44}
            className="group-hover:scale-105 transition-transform"
          />
          <span className="font-mono font-medium text-lg tracking-tight">
            <span className="bg-gradient-to-r from-[#00FF88] to-[#00d4aa] bg-clip-text text-transparent">
              Owls Insight
            </span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/docs"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            Docs
          </Link>
          <Link
            href="#coverage"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            Coverage
          </Link>
        </nav>

        {/* TODO: Uncomment when ready to launch
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-sm text-neutral-400 hover:text-white hover:bg-white/5"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="text-sm bg-[#00FF88] hover:bg-[#00d4aa] text-[#0a0a0a] font-medium px-4">
              Get API Key
            </Button>
          </Link>
        </div>
        */}
      </div>
    </header>
  );
}
