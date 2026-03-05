"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { List, X } from "@phosphor-icons/react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
          ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
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
            className="group-hover:scale-105 transition-transform duration-200"
          />
          <span className="font-mono font-medium text-lg tracking-tight">
            <span className="bg-gradient-to-r from-[#00FF88] to-[#00d4aa] bg-clip-text text-transparent">
              Owls Insight
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
          >
            Pricing
          </Link>
          <Link
            href="/docs"
            className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
          >
            Docs
          </Link>
          <Link
            href="#coverage"
            className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
          >
            Coverage
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-sm text-neutral-400 hover:text-white hover:bg-white/[0.05] cursor-pointer transition-all duration-200"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="text-sm bg-[#00FF88] hover:bg-[#00e67a] text-[#0a0a0a] font-medium px-4 cursor-pointer transition-all duration-200">
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-white cursor-pointer transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={24} /> : <List size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/[0.06] px-6 py-6 space-y-4">
          <Link
            href="#features"
            onClick={() => setMobileOpen(false)}
            className="block text-sm text-neutral-400 hover:text-white transition-colors py-2"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            onClick={() => setMobileOpen(false)}
            className="block text-sm text-neutral-400 hover:text-white transition-colors py-2"
          >
            Pricing
          </Link>
          <Link
            href="/docs"
            onClick={() => setMobileOpen(false)}
            className="block text-sm text-neutral-400 hover:text-white transition-colors py-2"
          >
            Docs
          </Link>
          <Link
            href="#coverage"
            onClick={() => setMobileOpen(false)}
            className="block text-sm text-neutral-400 hover:text-white transition-colors py-2"
          >
            Coverage
          </Link>
          <div className="flex gap-3 pt-4 border-t border-white/[0.06]">
            <Link href="/login" className="flex-1">
              <Button
                variant="outline"
                className="w-full text-sm border-white/10 cursor-pointer"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register" className="flex-1">
              <Button className="w-full text-sm bg-[#00FF88] hover:bg-[#00e67a] text-[#0a0a0a] cursor-pointer">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
