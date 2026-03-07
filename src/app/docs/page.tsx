"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { Copy, Check, MagnifyingGlass, ArrowUp } from "@phosphor-icons/react";
import * as Tabs from "@radix-ui/react-tabs";

// Navigation sections
type SubItem = { id: string; label: string };
type Section = { id: string; label: string; subItems?: SubItem[]; keywords?: string[] };

const sections: Section[] = [
  { id: "getting-started", label: "Getting Started", subItems: [
    { id: "sub-quick-start", label: "Quick start" },
  ], keywords: ["base url", "curl", "api key", "setup"] },
  { id: "authentication", label: "Authentication", keywords: ["bearer", "header", "api key", "auth"] },
  { id: "odds-api", label: "Odds", subItems: [
    { id: "sub-odds-endpoints", label: "Endpoints" },
    { id: "sub-odds-sports", label: "Sports" },
    { id: "sub-odds-sportsbooks", label: "Sportsbooks" },
    { id: "sub-odds-parameters", label: "Parameters" },
    { id: "sub-tennis-markets", label: "Tennis markets" },
    { id: "sub-soccer-markets", label: "Soccer markets" },
    { id: "sub-basketball-intl", label: "Intl Basketball" },
  ], keywords: ["nba", "nfl", "nhl", "mlb", "ncaab", "ncaaf", "soccer", "tennis", "basketball", "euroleague", "mma", "ufc", "pinnacle", "fanduel", "draftkings", "betonline", "moneyline", "spreads", "totals", "alternates", "double chance", "btts", "asian handicap", "corners", "cards"] },
  { id: "esports-api", label: "Esports", subItems: [
    { id: "sub-esports-markets", label: "Markets" },
  ], keywords: ["cs2", "counter-strike", "1xbet", "esports"] },
  { id: "props-api", label: "Player Props", subItems: [
    { id: "sub-props-endpoints", label: "Endpoints" },
    { id: "sub-props-parameters", label: "Parameters" },
    { id: "sub-prop-categories", label: "Prop categories" },
  ], keywords: ["props", "player", "points", "rebounds", "assists", "threes", "fanduel", "draftkings", "caesars", "betmgm", "bet365"] },
  { id: "scores-api", label: "Live Scores", subItems: [
    { id: "sub-scores-endpoints", label: "Endpoints" },
    { id: "sub-scores-nba", label: "Sport examples" },
  ], keywords: ["scores", "live", "soccer", "nba", "tennis", "aces", "serve", "break points", "possession", "goals", "cards", "xg", "expected goals", "incidents", "substitution", "match stats", "tennis stats"] },
  { id: "stats-api", label: "Player Stats", subItems: [
    { id: "sub-stats-endpoints", label: "Endpoints" },
    { id: "sub-box-scores", label: "Box scores" },
    { id: "sub-rolling-averages", label: "Rolling averages" },
  ], keywords: ["stats", "box score", "averages", "l5", "l10", "l20", "h2h"] },
  { id: "prediction-markets", label: "Prediction Markets", subItems: [
    { id: "sub-kalshi-endpoints", label: "Kalshi" },
    { id: "sub-polymarket-endpoints", label: "Polymarket" },
  ], keywords: ["kalshi", "polymarket", "prediction", "markets", "series", "cftc", "decentralized", "exchange", "series tickers"] },
  { id: "history-api", label: "Historical Data", subItems: [
    { id: "sub-history-endpoints", label: "Endpoints" },
    { id: "sub-history-tennis-stats", label: "Tennis stats" },
  ], keywords: ["history", "historical", "snapshots", "games", "odds history", "props history", "stats history", "tennis stats", "aces", "serve"] },
  { id: "websocket", label: "WebSocket", subItems: [
    { id: "sub-ws-connection", label: "Connection" },
    { id: "sub-ws-events", label: "Events" },
    { id: "sub-ws-props", label: "Props streaming" },
  ], keywords: ["websocket", "ws", "socket", "streaming", "live", "subscribe", "events", "real-time"] },
  { id: "realtime-api", label: "Real-Time Odds (Beta)", subItems: [
    { id: "sub-realtime-endpoints", label: "Endpoints" },
    { id: "sub-realtime-parameters", label: "Parameters" },
    { id: "sub-realtime-ws", label: "WebSocket event" },
  ], keywords: ["realtime", "real-time", "pinnacle", "live odds", "fast", "low latency"] },
  { id: "rate-limits", label: "Rate Limits", subItems: [
    { id: "sub-tier-features", label: "Tier features" },
  ], keywords: ["rate limit", "tier", "bench", "rookie", "mvp", "pricing", "price", "connections"] },
  { id: "coverage", label: "Sportsbooks & Coverage", subItems: [
    { id: "sub-game-odds-coverage", label: "Game odds" },
    { id: "sub-props-coverage", label: "Player props" },
  ], keywords: ["coverage", "sports", "books", "sportsbooks", "availability", "mma", "ufc", "betonline", "pinnacle", "fanduel", "draftkings", "betmgm", "bet365", "caesars", "kalshi", "polymarket", "1xbet", "sharp", "retail", "exchange"] },
  { id: "errors", label: "Errors", keywords: ["error", "status code", "401", "403", "429", "500"] },
];

// Map sub-item IDs to their parent section IDs for IntersectionObserver
const subItemToParent: Record<string, string> = {};
for (const section of sections) {
  if (section.subItems) {
    for (const sub of section.subItems) {
      subItemToParent[sub.id] = section.id;
    }
  }
}

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

function CodeBlock({ code, language = "json" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden bg-[#0a0a0a] border border-white/[0.06]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.04]">
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-600">{language}</span>
        <button
          onClick={handleCopy}
          className="text-zinc-600 hover:text-zinc-300 transition-colors p-1 -m-1"
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-zinc-400">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function CollapsibleCodeBlock({ code, language = "json", label = "response" }: { code: string; language?: string; label?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const lineCount = useMemo(() => code.split("\n").length, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-l-2 border-[#00FF88]/20">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#0a0a0a] border border-white/[0.06] rounded-t-lg">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-3 flex-1 text-left hover:bg-white/[0.02] transition-colors"
          aria-expanded={expanded}
        >
          <span className="text-zinc-600 text-xs shrink-0">{expanded ? "\u25BC" : "\u25B6"}</span>
          <span className="text-[12px] font-mono text-zinc-500">
            {expanded ? `Hide ${label}` : `Show ${label}`}
            <span className="text-zinc-700 ml-2">&middot; {lineCount} lines</span>
          </span>
        </button>
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-600">{language}</span>
        <button
          onClick={handleCopy}
          className="text-zinc-600 hover:text-zinc-300 transition-colors p-1 -m-1"
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="bg-[#0a0a0a] border border-t-0 border-white/[0.06] rounded-b-lg">
            <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-zinc-400">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      </div>
      {!expanded && <div className="h-0 border-b border-white/[0.06] rounded-b-lg" />}
    </div>
  );
}

function Endpoint({
  method,
  path,
  description,
  tier,
}: {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  tier?: string;
}) {
  const methodColors: Record<string, string> = {
    GET: "text-emerald-400",
    POST: "text-blue-400",
    PUT: "text-amber-400",
    DELETE: "text-red-400",
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/[0.04] last:border-0">
      <span className={`font-mono text-xs font-semibold mt-0.5 w-10 shrink-0 ${methodColors[method]}`}>
        {method}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <code className="text-sm font-mono text-white">{path}</code>
          {tier && (
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
              {tier}
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function ParamTable({
  params,
}: {
  params: { name: string; type: string; required: boolean; description: string }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.08]">
            <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Parameter</th>
            <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Type</th>
            <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Required</th>
            <th className="text-left py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map((param) => (
            <tr key={param.name} className="border-b border-white/[0.04]">
              <td className="py-2.5 pr-6 font-mono text-[13px] text-white">{param.name}</td>
              <td className="py-2.5 pr-6 font-mono text-[13px] text-zinc-500">{param.type}</td>
              <td className="py-2.5 pr-6">
                {param.required ? (
                  <span className="text-[13px] text-amber-400">required</span>
                ) : (
                  <span className="text-[13px] text-zinc-600">optional</span>
                )}
              </td>
              <td className="py-2.5 text-[13px] text-zinc-400">{param.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocsTabs({ tabs, defaultValue, label }: { tabs: { value: string; label: string; content: React.ReactNode }[]; defaultValue?: string; label?: string }) {
  return (
    <Tabs.Root defaultValue={defaultValue || tabs[0]?.value}>
      <Tabs.List aria-label={label} className="flex border-b border-white/[0.06] mb-6">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className="px-4 py-2.5 font-mono text-[12px] uppercase tracking-wider text-zinc-600 hover:text-zinc-300 transition-colors border-b-2 border-transparent data-[state=active]:text-white data-[state=active]:border-[#00FF88]"
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Content key={tab.value} value={tab.value} forceMount className="data-[state=inactive]:hidden">
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-mono font-bold text-white mb-1 tracking-tight">
      {children}
    </h2>
  );
}

function SubHeading({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h3 id={id} className="text-sm font-mono font-semibold text-zinc-300 mt-10 mb-3 uppercase tracking-wider scroll-mt-20">
      {children}
    </h3>
  );
}

function TierBadge({ tier, className = "" }: { tier: string; className?: string }) {
  return (
    <span className={`inline-block text-[11px] font-mono font-medium uppercase tracking-wider px-2 py-1 rounded border ${
      tier === "MVP"
        ? "text-purple-400 bg-purple-500/10 border-purple-500/20"
        : "text-blue-400 bg-blue-500/10 border-blue-500/20"
    } ${className}`}>
      {tier}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIndex, setSearchIndex] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [pageCopied, setPageCopied] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Build search results from query
  const results = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const matches: { sectionId: string; sectionLabel: string; subId?: string; subLabel?: string }[] = [];
    for (const section of sections) {
      const sectionMatch = section.label.toLowerCase().includes(q) ||
        section.keywords?.some(k => k.includes(q));
      if (sectionMatch) {
        matches.push({ sectionId: section.id, sectionLabel: section.label });
      }
      if (section.subItems) {
        for (const sub of section.subItems) {
          if (sub.label.toLowerCase().includes(q)) {
            matches.push({ sectionId: section.id, sectionLabel: section.label, subId: sub.id, subLabel: sub.label });
          }
        }
      }
    }
    // Deduplicate by target ID
    const seen = new Set<string>();
    return matches.filter(r => {
      const key = r.subId || r.sectionId;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 8);
  }, [searchQuery]);

  // Track active section on scroll (sections + sub-items) + URL hash sync
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            // Map sub-item IDs to parent section
            const parentId = subItemToParent[id];
            setActiveSection(parentId || id);
            // Sync URL hash for deep linking
            window.history.replaceState(null, "", `#${id}`);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
      if (section.subItems) {
        for (const sub of section.subItems) {
          const subEl = document.getElementById(sub.id);
          if (subEl) observer.observe(subEl);
        }
      }
    }

    // On mount: scroll to hash target and set active section
    const hash = window.location.hash.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
        const parentId = subItemToParent[hash];
        setActiveSection(parentId || hash);
      }
    }

    return () => observer.disconnect();
  }, []);

  // Cmd/Ctrl+K keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(prev => !prev);
        setSearchQuery("");
        setSearchIndex(0);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchOpen) {
      const id = setTimeout(() => searchInputRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
  }, [searchOpen]);

  // Back-to-top visibility
  useEffect(() => {
    const handler = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-zinc-500 hover:text-white transition-colors text-sm font-sans">
              Home
            </Link>
            <span className="text-zinc-700">/</span>
            <span className="font-mono text-sm text-white">Docs</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (!contentRef.current) return;
                navigator.clipboard.writeText(contentRef.current.innerText);
                setPageCopied(true);
                setTimeout(() => setPageCopied(false), 2000);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-zinc-500 hover:text-zinc-300 hover:border-white/[0.12] transition-colors text-sm"
            >
              {pageCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span className="font-sans">{pageCopied ? "Copied!" : "Copy Page"}</span>
            </button>
            <button
              onClick={() => { setSearchOpen(true); setSearchQuery(""); setSearchIndex(0); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-zinc-500 hover:text-zinc-300 hover:border-white/[0.12] transition-colors text-sm"
            >
              <MagnifyingGlass size={14} />
              <span className="font-sans">Search</span>
              <kbd className="hidden sm:inline-block text-[10px] font-mono text-zinc-600 bg-white/[0.06] px-1.5 py-0.5 rounded ml-1">⌘K</kbd>
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside className="fixed left-0 top-14 bottom-0 w-56 border-r border-white/[0.04] overflow-y-auto">
          <nav className="py-6 px-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600 mb-3 px-2">Reference</p>
            <div className="space-y-0.5">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                const hasSubItems = section.subItems && section.subItems.length > 0;
                return (
                  <div key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={`block px-2 py-1.5 rounded text-[13px] transition-colors ${
                        isActive
                          ? "text-white bg-white/[0.04]"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {section.label}
                    </a>
                    {hasSubItems && (
                      <div
                        className="overflow-hidden transition-all duration-200 ease-in-out"
                        style={{ maxHeight: isActive ? `${section.subItems!.length * 32 + 8}px` : "0px", opacity: isActive ? 1 : 0 }}
                      >
                        <div className="ml-3 pl-2 border-l border-white/[0.06]">
                          {section.subItems!.map((sub) => (
                            <a
                              key={sub.id}
                              href={`#${sub.id}`}
                              className="block px-2 py-1 text-[12px] text-zinc-600 hover:text-zinc-300 transition-colors"
                            >
                              {sub.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main ref={contentRef} className="flex-1 ml-56 px-12 py-12 max-w-3xl">

          {/* ─── Getting Started ────────────────────────────────────── */}
          <section id="getting-started" className="mb-20 scroll-mt-20">
            <h1 className="text-3xl font-mono font-bold tracking-tight text-white mb-2">
              API Reference
            </h1>
            <p className="text-zinc-500 text-sm font-sans leading-relaxed mb-10">
              REST API and WebSocket streaming for live sports and esports betting odds from 10 sportsbooks, prediction markets (Kalshi and Polymarket), and 1xBet.
            </p>

            <div className="rounded-lg bg-[#111113] border border-white/[0.06] px-5 py-4 mb-10">
              <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Base URL</p>
              <code className="text-sm font-mono text-white">https://api.owlsinsight.com</code>
            </div>

            <SubHeading id="sub-quick-start">Quick start</SubHeading>
            <ol className="text-sm text-zinc-400 font-sans space-y-2 mb-6 list-decimal list-inside">
              <li>Create an account and get your API key from the dashboard.</li>
              <li>Include the key in every request via the <code className="text-[13px] font-mono text-zinc-300">Authorization</code> header.</li>
            </ol>
            <CodeBlock
              language="bash"
              code={`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.owlsinsight.com/api/v1/nba/odds`}
            />
          </section>

          {/* ─── Authentication ─────────────────────────────────────── */}
          <section id="authentication" className="mb-20 scroll-mt-20">
            <SectionHeading>Authentication</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-6">
              All endpoints require an API key in the Authorization header.
            </p>

            <CodeBlock language="http" code={`Authorization: Bearer YOUR_API_KEY`} />
          </section>

          {/* ─── Odds API ──────────────────────────────────────────── */}
          <section id="odds-api" className="mb-20 scroll-mt-20">
            <SectionHeading>Odds API</SectionHeading>
            <SubHeading id="sub-odds-endpoints">Endpoints</SubHeading>
            <div className="mb-8">
              <Endpoint method="GET" path="/api/v1/{sport}/odds" description="All odds for a sport (spreads, moneylines, totals)" />
              <Endpoint method="GET" path="/api/v1/{sport}/moneyline" description="Moneyline odds only" />
              <Endpoint method="GET" path="/api/v1/{sport}/spreads" description="Point spread odds only" />
              <Endpoint method="GET" path="/api/v1/{sport}/totals" description="Over/under totals only" />
            </div>

            <SubHeading id="sub-odds-sports">Sports</SubHeading>
            <div className="flex flex-wrap gap-2 mb-8">
              {["nba", "ncaab", "nfl", "nhl", "ncaaf", "mlb", "mma", "soccer", "ncaah", "tennis", "cs2"].map((sport) => (
                <code key={sport} className="text-[13px] font-mono text-zinc-300 bg-white/[0.04] px-2.5 py-1 rounded">
                  {sport}
                </code>
              ))}
            </div>

            <SubHeading id="sub-odds-sportsbooks">Sportsbooks</SubHeading>
            <div className="flex flex-wrap gap-2 mb-4">
              {["pinnacle", "fanduel", "draftkings", "betmgm", "bet365", "caesars", "kalshi", "polymarket", "betonline", "1xbet"].map((book) => (
                <code key={book} className="text-[13px] font-mono text-zinc-300 bg-white/[0.04] px-2.5 py-1 rounded">
                  {book}
                </code>
              ))}
            </div>
            <p className="text-sm text-zinc-500 font-sans mb-8">
              See <a href="#coverage" className="text-[#00FF88] hover:underline">Sportsbooks &amp; Coverage</a> for per-sport availability and details.
            </p>

            <SubHeading id="sub-odds-parameters">Parameters</SubHeading>
            <ParamTable
              params={[
                { name: "books", type: "string", required: false, description: "Comma-separated list of sportsbooks to include" },
                { name: "alternates", type: "boolean", required: false, description: "Include Pinnacle alternate spread/total lines" },
                { name: "league", type: "string", required: false, description: "Filter by league name — substring match, case-insensitive (soccer, tennis, and basketball)" },
              ]}
            />

            <SubHeading>Example request</SubHeading>
            <CodeBlock
              language="bash"
              code={`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/nba/odds?books=pinnacle,fanduel,draftkings&alternates=true"`}
            />

            <SubHeading>Response</SubHeading>
            <CollapsibleCodeBlock
              language="json"
              code={`{
  "success": true,
  "data": {
    "pinnacle": [
      {
        "id": "1624025571",
        "sport_key": "basketball_nba",
        "commence_time": "2026-01-31T20:00:00Z",
        "home_team": "Los Angeles Lakers",
        "away_team": "Boston Celtics",
        "bookmakers": [
          {
            "key": "pinnacle",
            "title": "Pinnacle",
            "last_update": "2026-01-31T18:29:45Z",
            "event_link": "https://www.pinnacle.com/en/1624025571/",
            "markets": [
              {
                "key": "h2h",
                "outcomes": [
                  { "name": "Los Angeles Lakers", "price": -150 },
                  { "name": "Boston Celtics", "price": 130 }
                ],
                "limits": [{ "type": "maxRiskStake", "amount": 1500 }]
              },
              {
                "key": "spreads",
                "outcomes": [
                  {
                    "name": "Los Angeles Lakers", "price": -110, "point": -3.5,
                    "alternateLines": [
                      { "point": -1.5, "price": -180 },
                      { "point": -2.5, "price": -140 },
                      { "point": -4.5, "price": 100 },
                      { "point": -5.5, "price": 130 }
                    ]
                  },
                  {
                    "name": "Boston Celtics", "price": -110, "point": 3.5,
                    "alternateLines": [
                      { "point": 1.5, "price": 130 },
                      { "point": 2.5, "price": 110 },
                      { "point": 4.5, "price": -130 },
                      { "point": 5.5, "price": -160 }
                    ]
                  }
                ],
                "limits": [{ "type": "maxRiskStake", "amount": 1500 }]
              },
              {
                "key": "totals",
                "outcomes": [
                  {
                    "name": "Over", "price": -110, "point": 224.5,
                    "alternateLines": [
                      { "point": 222.5, "price": -145 },
                      { "point": 223.5, "price": -125 },
                      { "point": 225.5, "price": 105 },
                      { "point": 226.5, "price": 125 }
                    ]
                  },
                  {
                    "name": "Under", "price": -110, "point": 224.5,
                    "alternateLines": [
                      { "point": 222.5, "price": 120 },
                      { "point": 223.5, "price": 105 },
                      { "point": 225.5, "price": -130 },
                      { "point": 226.5, "price": -150 }
                    ]
                  }
                ],
                "limits": [{ "type": "maxRiskStake", "amount": 1500 }]
              }
            ]
          }
        ]
      }
    ],
    "fanduel": [ ... ],
    "draftkings": [ ... ]
  },
  "meta": {
    "sport": "nba",
    "sport_key": "basketball_nba",
    "market": "all",
    "alternates": true,
    "timestamp": "2026-01-31T18:30:00.000Z",
    "requestedBooks": ["pinnacle", "fanduel", "draftkings"],
    "availableBooks": ["pinnacle", "fanduel", "draftkings", "betmgm", "bet365", "caesars", "kalshi", "polymarket", "1xbet"],
    "booksReturned": ["pinnacle", "fanduel", "draftkings"],
    "freshness": { "ageSeconds": 2, "stale": false, "threshold": 90 }
  }
}`}
            />

            <p className="text-xs text-zinc-600 font-sans mt-3 leading-relaxed">
              The <code className="text-[11px] font-mono text-zinc-500">alternateLines</code> array on spread/total outcomes is only present when <code className="text-[11px] font-mono text-zinc-500">?alternates=true</code> is passed. Currently available for Pinnacle.
              The <code className="text-[11px] font-mono text-zinc-500">alternates</code> field in <code className="text-[11px] font-mono text-zinc-500">meta</code> is always present in responses — it returns <code className="text-[11px] font-mono text-zinc-500">false</code> when the parameter is omitted.
              The <code className="text-[11px] font-mono text-zinc-500">limits</code> array is currently provided for Pinnacle markets only, reflecting their published maximum stake limits.
              A market may include <code className="text-[11px] font-mono text-zinc-500">suspended: true</code> when the market is temporarily closed (e.g., during a goal review in soccer). This field is omitted when the market is open.
              Soccer events include a <code className="text-[11px] font-mono text-zinc-500">league</code> field (e.g., &quot;England - Premier League&quot;) and <code className="text-[11px] font-mono text-zinc-500">country_code</code> (ISO 3166-1 alpha-2, e.g., &quot;GB&quot;) for league identification and flag display.
              International basketball events include a <code className="text-[11px] font-mono text-zinc-500">league</code> field (e.g., &quot;Europe - Euroleague&quot;) — see the <a href="#sub-basketball-intl" className="text-[#00FF88] hover:underline">International Basketball</a> section below.
            </p>

            <SubHeading id="sub-tennis-markets">Tennis markets</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              Tennis odds from Pinnacle include additional match and set-level markets beyond the standard h2h, spreads, and totals.
              All 8 market types are included in the <code className="text-[13px] font-mono text-zinc-300">/api/v1/tennis/odds</code> response.
            </p>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Key</th>
                    <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Market</th>
                    <th className="text-left py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { key: "h2h", name: "Match Winner", desc: "Moneyline \u2014 which player wins the match" },
                    { key: "spreads", name: "Set Handicap", desc: "Handicap on total sets won (e.g. -1.5)" },
                    { key: "totals", name: "Total Sets", desc: "Over/under on total sets played (e.g. 2.5)" },
                    { key: "total_games", name: "Total Games", desc: "Over/under on total games played across all sets" },
                    { key: "1st_set_winner", name: "1st Set Winner", desc: "Which player wins the first set" },
                    { key: "1st_set_spreads", name: "1st Set Handicap", desc: "Game handicap for the first set" },
                    { key: "1st_set_totals", name: "1st Set Total", desc: "Over/under on games in the first set" },
                    { key: "team_totals", name: "Player Total Games", desc: "Over/under on each player\u2019s total games won" },
                  ].map((m) => (
                    <tr key={m.key} className="border-b border-white/[0.04]">
                      <td className="py-2.5 pr-6 font-mono text-white">{m.key}</td>
                      <td className="py-2.5 pr-6 text-zinc-300">{m.name}</td>
                      <td className="py-2.5 text-zinc-500">{m.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SubHeading id="sub-soccer-markets">Soccer markets</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              Soccer odds include additional market types beyond the standard h2h, spreads, and totals.
              These markets are available from sportsbooks that cover soccer (Pinnacle, FanDuel, DraftKings, and others).
            </p>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Key</th>
                    <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Market</th>
                    <th className="text-left py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { key: "h2h", name: "Match Result", desc: "3-way moneyline — Home, Draw, Away" },
                    { key: "spreads", name: "Handicap", desc: "Goal handicap spread (e.g. -1.5)" },
                    { key: "totals", name: "Total Goals", desc: "Over/under on total goals scored" },
                    { key: "double_chance", name: "Double Chance", desc: "Home/Draw, Away/Draw, or Home/Away — two outcomes covered" },
                    { key: "btts", name: "Both Teams To Score", desc: "Yes or No — whether both teams score at least one goal" },
                    { key: "asian_handicap", name: "Asian Handicap", desc: "Quarter-line handicap spreads (e.g. -0.25, -0.75)" },
                    { key: "first_half_h2h", name: "1st Half Result", desc: "3-way moneyline for the first half only" },
                    { key: "first_half_spreads", name: "1st Half Handicap", desc: "Goal handicap for the first half" },
                    { key: "first_half_totals", name: "1st Half Total", desc: "Over/under on first half goals" },
                    { key: "corners", name: "Corners", desc: "Over/under on total corner kicks" },
                    { key: "cards", name: "Cards", desc: "Over/under on total yellow/red cards" },
                  ].map((m) => (
                    <tr key={m.key} className="border-b border-white/[0.04]">
                      <td className="py-2.5 pr-6 font-mono text-white">{m.key}</td>
                      <td className="py-2.5 pr-6 text-zinc-300">{m.name}</td>
                      <td className="py-2.5 text-zinc-500">{m.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SubHeading id="sub-basketball-intl">International Basketball</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4 leading-relaxed">
              Odds for international basketball leagues from Pinnacle, served via dedicated endpoints.
              Each event includes a <code className="text-[13px] font-mono text-zinc-300">league</code> field for filtering. Use the <code className="text-[13px] font-mono text-zinc-300">?league=</code> query parameter for case-insensitive substring matching.
            </p>
            <div className="mb-8">
              <Endpoint method="GET" path="/api/v1/basketball/odds" description="All international basketball odds" />
              <Endpoint method="GET" path="/api/v1/basketball/moneyline" description="Moneylines only" />
              <Endpoint method="GET" path="/api/v1/basketball/spreads" description="Spreads only" />
              <Endpoint method="GET" path="/api/v1/basketball/totals" description="Totals only" />
            </div>

            <SubHeading>Example request</SubHeading>
            <CodeBlock
              language="bash"
              code={`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/basketball/odds?league=EuroLeague"`}
            />

            <SubHeading>Leagues</SubHeading>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Region</th>
                    <th className="text-left py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">League</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { region: "Europe", league: "EuroLeague" },
                    { region: "Europe", league: "EuroCup" },
                    { region: "Europe", league: "ABA Adriatic League" },
                    { region: "Spain", league: "Liga FEB" },
                    { region: "France", league: "Championnat Pro B" },
                    { region: "Germany", league: "Pro A" },
                    { region: "Italy", league: "Serie A2" },
                    { region: "UK", league: "British SLB" },
                    { region: "Turkey", league: "Super League" },
                    { region: "Lithuania", league: "National Basketball League" },
                    { region: "Czech Republic", league: "Czech NBL" },
                    { region: "Brazil", league: "Novo Basquete Brasil" },
                    { region: "Argentina", league: "Liga Nacional / La Liga" },
                    { region: "Australia", league: "Australia NBL" },
                    { region: "South Korea", league: "KBL" },
                    { region: "China", league: "CBA" },
                  ].map((l) => (
                    <tr key={`${l.region}-${l.league}`} className="border-b border-white/[0.04]">
                      <td className="py-2.5 pr-6 text-zinc-400">{l.region}</td>
                      <td className="py-2.5 text-zinc-300">{l.league}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </section>

          {/* ─── Esports API ───────────────────────────────────────── */}
          <section id="esports-api" className="mb-20 scroll-mt-20">
            <SectionHeading>Esports API</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-6 leading-relaxed">
              CS2 (Counter-Strike 2) match odds from 1xBet. Live and prematch games with moneylines,
              map handicaps, map totals, correct score, map winner, round totals, and round handicap markets.
              Pushed on change via WebSocket, also available via REST.
            </p>

            <SubHeading>Endpoint</SubHeading>
            <div className="mb-8">
              <Endpoint method="GET" path="/api/v1/cs2/odds" description="CS2 match odds — live and prematch (6+ market types)" />
            </div>

            <SubHeading>Example request</SubHeading>
            <CodeBlock
              language="bash"
              code={`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/cs2/odds"`}
            />

            <SubHeading>Response</SubHeading>
            <CollapsibleCodeBlock
              language="json"
              code={`{
  "success": true,
  "data": {
    "1xbet": [
      {
        "id": "695559710",
        "sport_key": "esports_cs2",
        "sport_title": "CS2",
        "commence_time": "2026-02-12T15:00:00.000Z",
        "home_team": "Natus Vincere",
        "away_team": "G2 Esports",
        "status": "live",
        "sport": "cs2",
        "bookmakers": [
          {
            "key": "1xbet",
            "title": "1xBet",
            "event_link": "https://1xbet.com/en/line/esports/694454283",
            "markets": [
              {
                "key": "h2h",
                "outcomes": [
                  { "name": "Natus Vincere", "price": -150 },
                  { "name": "G2 Esports", "price": 120 }
                ]
              },
              {
                "key": "totals",
                "outcomes": [
                  { "name": "Over", "price": -115, "point": 2.5 },
                  { "name": "Under", "price": -105, "point": 2.5 }
                ]
              },
              {
                "key": "correct_score",
                "outcomes": [
                  { "name": "2-0", "price": 150 },
                  { "name": "2-1", "price": 200 },
                  { "name": "0-2", "price": 280 },
                  { "name": "1-2", "price": 350 }
                ]
              },
              {
                "key": "map_winner",
                "outcomes": [
                  { "name": "Natus Vincere", "price": -130 },
                  { "name": "G2 Esports", "price": 105 }
                ]
              },
              {
                "key": "round_totals",
                "outcomes": [
                  { "name": "Over", "price": -110, "point": 51.5 },
                  { "name": "Under", "price": -115, "point": 51.5 }
                ]
              },
              {
                "key": "round_handicap",
                "outcomes": [
                  { "name": "Natus Vincere", "price": -105, "point": -2.5 },
                  { "name": "G2 Esports", "price": -120, "point": 2.5 }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "694454283",
        "sport_key": "esports_cs2",
        "sport_title": "CS2",
        "commence_time": "2026-02-15T14:00:00.000Z",
        "home_team": "Sangal Esports",
        "away_team": "AaB Esport",
        "status": "scheduled",
        "sport": "cs2",
        "bookmakers": [ ... ]
      }
    ]
  },
  "meta": {
    "sport": "cs2",
    "sport_key": "esports_cs2",
    "market": "all",
    "timestamp": "2026-02-12T15:30:00.000Z",
    "booksReturned": ["1xbet"],
    "freshness": { "ageSeconds": 1, "stale": false, "threshold": 90 }
  }
}`}
            />

            <SubHeading id="sub-esports-markets">Markets</SubHeading>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Key</th>
                    <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Market</th>
                    <th className="text-left py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { key: "h2h", name: "Match Winner", desc: "Moneyline — which team wins the match" },
                    { key: "totals", name: "Map Total", desc: "Over/under on total maps played (e.g. 2.5)" },
                    { key: "correct_score", name: "Correct Score", desc: "Exact final map score (2-0, 2-1, 0-2, 1-2)" },
                    { key: "map_winner", name: "Current Map Winner", desc: "Which team wins the current map (live only)" },
                    { key: "round_totals", name: "Round Totals", desc: "Over/under on total rounds played" },
                    { key: "round_handicap", name: "Round Handicap", desc: "Round-level handicap spread" },
                  ].map((m) => (
                    <tr key={m.key} className="border-b border-white/[0.04]">
                      <td className="py-2.5 pr-6 font-mono text-white">{m.key}</td>
                      <td className="py-2.5 pr-6 text-zinc-300">{m.name}</td>
                      <td className="py-2.5 text-zinc-500">{m.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </section>

          {/* ─── Props API ─────────────────────────────────────────── */}
          <section id="props-api" className="mb-20 scroll-mt-20">
            <SectionHeading>Player Props API</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-6">
              Player prop betting lines from multiple sportsbooks with alternate lines support.
            </p>

            <SubHeading id="sub-props-endpoints">Endpoints</SubHeading>
            <div className="mb-8">
              <Endpoint method="GET" path="/api/v1/{sport}/props" description="Aggregated player props from all books (use ?books=pinnacle to filter)" />
              <Endpoint method="GET" path="/api/v1/{sport}/props/fanduel" description="FanDuel player props only" />
              <Endpoint method="GET" path="/api/v1/{sport}/props/draftkings" description="DraftKings player props only" />
              <Endpoint method="GET" path="/api/v1/{sport}/props/caesars" description="Caesars player props only" />
              <Endpoint method="GET" path="/api/v1/{sport}/props/betmgm" description="BetMGM player props" />
              <Endpoint method="GET" path="/api/v1/{sport}/props/bet365" description="Bet365 player props only" />
              <Endpoint method="GET" path="/api/v1/{sport}/props/history" description="Historical prop line movements" />
              <Endpoint method="GET" path="/api/v1/props/{book}/stats" description="Per-book props cache statistics (bet365, fanduel, draftkings, caesars, betmgm)" />
              <Endpoint method="GET" path="/api/v1/props/stats" description="Aggregated props cache statistics" />
            </div>

            <div className="rounded-lg bg-[#111113] border border-white/[0.06] p-5 mb-8">
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                <strong className="text-zinc-300">Sport availability by book:</strong> The aggregated <code className="text-[13px] font-mono text-zinc-300">/props</code> endpoint includes Pinnacle data for all sports.
                FanDuel, DraftKings, Caesars, and BetMGM per-book endpoints support nba, ncaab, nfl, nhl, and ncaaf.
                Bet365 supports all of the above plus mlb. If a book has no props for the requested sport, the response will be empty.
              </p>
            </div>

            <SubHeading id="sub-props-parameters">Parameters</SubHeading>
            <ParamTable
              params={[
                { name: "game_id", type: "string", required: false, description: "Filter to a specific game" },
                { name: "player", type: "string", required: false, description: "Filter by player name (partial match)" },
                { name: "category", type: "string", required: false, description: "Filter by prop category" },
                { name: "books", type: "string", required: false, description: "Comma-separated: pinnacle, fanduel, draftkings, betmgm, bet365, caesars" },
              ]}
            />

            <SubHeading id="sub-prop-categories">Prop categories</SubHeading>
            <div className="flex flex-wrap gap-1.5 mb-8">
              {[
                "points", "rebounds", "assists", "steals", "blocks", "threes_made",
                "pts_rebs_asts", "pts_rebs", "pts_asts", "rebs_asts",
                "double_double", "triple_double",
                "passing_yards", "passing_tds",
                "rushing_yards", "rushing_tds",
                "receiving_yards", "receptions", "touchdowns",
                "goals", "hockey_assists", "hockey_points", "shots_on_goal",
                "hits", "runs", "rbis", "home_runs", "stolen_bases", "total_bases",
                "strikeouts_pitcher", "strikeouts_batter", "walks", "earned_runs", "outs_recorded", "hits_allowed",
                "shots_on_target", "tackles", "passes", "fouls_committed", "corners_taken",
              ].map((cat) => (
                <code key={cat} className="text-[12px] font-mono text-zinc-500 bg-white/[0.03] px-2 py-0.5 rounded">
                  {cat}
                </code>
              ))}
            </div>

            <SubHeading>Response</SubHeading>
            <CollapsibleCodeBlock
              language="json"
              code={`{
  "success": true,
  "data": [
    {
      "gameId": "nba:BOS@LAL-20260131",
      "homeTeam": "Los Angeles Lakers",
      "awayTeam": "Boston Celtics",
      "books": [
        {
          "key": "pinnacle",
          "props": [
            {
              "playerName": "LeBron James",
              "category": "points",
              "line": 25.5,
              "overPrice": -115,
              "underPrice": -105
            }
          ]
        },
        {
          "key": "fanduel",
          "props": [
            {
              "playerName": "LeBron James",
              "category": "points",
              "line": 25.5,
              "overPrice": -112,
              "underPrice": -108,
              "alternateLines": [
                { "line": 20, "price": -280 },
                { "line": 30, "price": 145 }
              ]
            }
          ]
        }
      ]
    }
  ],
  "meta": {
    "sport": "nba",
    "timestamp": "2026-01-31T18:30:00.000Z",
    "gamesReturned": 1,
    "propsReturned": 156
  }
}`}
            />

            <SubHeading>Props history parameters</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              Track line movements for a specific player prop over time.
            </p>
            <ParamTable
              params={[
                { name: "game_id", type: "string", required: true, description: "Game ID (e.g. nba:BOS@LAL-20260131)" },
                { name: "player", type: "string", required: true, description: "Player name" },
                { name: "category", type: "string", required: true, description: "Prop category (e.g. points)" },
                { name: "hours", type: "number", required: false, description: "Hours of history (1-168, default: since opening)" },
              ]}
            />
          </section>

          {/* ─── Scores API ────────────────────────────────────────── */}
          <section id="scores-api" className="mb-20 scroll-mt-20">
            <SectionHeading>Live Scores API</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-6">
              Live game scores and status updates. Soccer matches include rich in-match data: team statistics, match incidents (goals, cards, substitutions), and per-player ratings. Tennis matches include per-match and per-set statistics (aces, serve %, break points, winners, unforced errors).
            </p>

            <SubHeading id="sub-scores-endpoints">Endpoints</SubHeading>
            <div className="mb-8">
              <Endpoint method="GET" path="/api/v1/scores/live" description="Live scores across all sports" />
              <Endpoint method="GET" path="/api/v1/{sport}/scores/live" description="Live scores for a specific sport" />
            </div>
            <p className="text-sm text-zinc-500 font-sans mb-6">
              Supported sports: <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">nba</code>, <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">ncaab</code>, <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">nfl</code>, <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">nhl</code>, <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">ncaaf</code>, <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">mlb</code>, <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">ncaah</code>, <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">soccer</code>, <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">tennis</code>
            </p>

            <SubHeading>Response structure</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              Returns an object keyed by sport, each containing an array of live game events.
            </p>
            <CodeBlock
              language="json"
              code={`{
  "success": true,
  "data": {
    "sports": {
      "nba": [ ... ],
      "soccer": [ ... ],
      "tennis": [ ... ]
    },
    "timestamp": "2026-02-18T20:15:00.000Z"
  }
}`}
            />

            <SubHeading id="sub-scores-nba">Sport examples</SubHeading>
            <DocsTabs
              defaultValue="nba"
              label="Sport examples"
              tabs={[
                {
                  value: "nba",
                  label: "NBA",
                  content: (
                    <>
                      <CollapsibleCodeBlock
                        language="json"
                        code={`{
  "id": "nba:BOS@LAL-20260131",
  "sport": "nba",
  "name": "Boston Celtics at Los Angeles Lakers",
  "startTime": "2026-01-31T20:00:00Z",
  "status": {
    "state": "in",
    "detail": "8:42 - 3rd Quarter",
    "displayClock": "8:42",
    "period": 3
  },
  "home": {
    "homeAway": "home",
    "team": { "displayName": "Los Angeles Lakers", "abbreviation": "LAL" },
    "score": 78
  },
  "away": {
    "homeAway": "away",
    "team": { "displayName": "Boston Celtics", "abbreviation": "BOS" },
    "score": 82
  },
  "lastUpdated": "2026-01-31T20:15:00.000Z"
}`}
                      />
                    </>
                  ),
                },
                {
                  value: "soccer",
                  label: "Soccer",
                  content: (
                    <>
                      <p id="sub-scores-soccer" className="text-sm text-zinc-500 font-sans mb-4 scroll-mt-20">
                        Soccer events include <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">matchStats</code>, <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">incidents</code>, and <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">playerStats</code> when available. Stats populate for top leagues (EPL, Champions League, La Liga, etc.) and update every ~30 seconds.
                      </p>
                      <CollapsibleCodeBlock
                        language="json"
                        code={`{
  "id": "soccer:Galatasaray@Juventus-20260218",
  "sport": "soccer",
  "name": "Galatasaray at Juventus",
  "startTime": "2026-02-18T20:00:00Z",
  "status": {
    "state": "in",
    "detail": "72'",
    "displayClock": "72",
    "period": null
  },
  "home": {
    "homeAway": "home",
    "team": { "displayName": "Juventus" },
    "score": 2
  },
  "away": {
    "homeAway": "away",
    "team": { "displayName": "Galatasaray" },
    "score": 5
  },
  "sourceMatchId": "jJa9kFZ1",
  "matchStats": {
    "possession": { "home": 38, "away": 62 },
    "shots": { "home": 7, "away": 22 },
    "shotsOnTarget": { "home": 3, "away": 9 },
    "corners": { "home": 5, "away": 5 },
    "fouls": { "home": 18, "away": 8 },
    "yellowCards": { "home": 4, "away": 1 },
    "redCards": { "home": 1, "away": 0 },
    "offsides": { "home": 2, "away": 1 },
    "expectedGoals": { "home": 1.12, "away": 2.92 },
    "bigChances": { "home": 3, "away": 5 },
    "shotsOffTarget": { "home": 2, "away": 7 },
    "blockedShots": { "home": 2, "away": 6 },
    "shotsInsideBox": { "home": 7, "away": 16 },
    "shotsOutsideBox": { "home": 0, "away": 6 },
    "goalkeeperSaves": { "home": 4, "away": 1 },
    "passes": { "home": 80, "away": 88 },
    "tackles": { "home": 63, "away": 64 },
    "freeKicks": { "home": 8, "away": 18 },
    "throwIns": { "home": 14, "away": 21 }
  },
  "incidents": [
    {
      "minute": 13,
      "type": "goal",
      "playerName": "Icardi M.",
      "teamSide": "away",
      "assistPlayerName": "Mertens D."
    },
    {
      "minute": 30,
      "type": "yellowCard",
      "playerName": "Locatelli M.",
      "teamSide": "home"
    },
    {
      "minute": 58,
      "type": "substitution",
      "playerName": "Yildiz K.",
      "teamSide": "home",
      "playerOut": "Weah T."
    }
  ],
  "playerStats": [
    { "playerName": "Icardi M.", "teamSide": "away", "rating": 8.6 },
    { "playerName": "Mertens D.", "teamSide": "away", "rating": 7.9 },
    { "playerName": "Vlahovic D.", "teamSide": "home", "rating": 6.4 }
  ],
  "lastUpdated": "2026-02-18T20:42:00.000Z"
}`}
                      />

                      <h4 id="sub-match-stats" className="text-sm font-mono font-semibold text-zinc-300 mt-10 mb-3 uppercase tracking-wider scroll-mt-20">Match stats fields</h4>
                      <p className="text-sm text-zinc-500 font-sans mb-4">
                        All stats use the <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">{`{ "home": number, "away": number }`}</code> format. Fields are <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">null</code> when not available for a given match.
                      </p>
                      <div className="overflow-x-auto mb-8">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-white/[0.08]">
                              <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Field</th>
                              <th className="text-left py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Description</th>
                            </tr>
                          </thead>
                          <tbody className="text-[13px]">
                            {[
                              { field: "possession", desc: "Ball possession %" },
                              { field: "shots", desc: "Total shots" },
                              { field: "shotsOnTarget", desc: "Shots on target" },
                              { field: "shotsOffTarget", desc: "Shots off target" },
                              { field: "blockedShots", desc: "Blocked shots" },
                              { field: "shotsInsideBox", desc: "Shots inside the box" },
                              { field: "shotsOutsideBox", desc: "Shots outside the box" },
                              { field: "corners", desc: "Corner kicks" },
                              { field: "fouls", desc: "Fouls committed" },
                              { field: "yellowCards", desc: "Yellow cards" },
                              { field: "redCards", desc: "Red cards" },
                              { field: "offsides", desc: "Offsides" },
                              { field: "expectedGoals", desc: "Expected goals (xG)" },
                              { field: "bigChances", desc: "Big chances created" },
                              { field: "goalkeeperSaves", desc: "Goalkeeper saves" },
                              { field: "passes", desc: "Pass accuracy (percentage)" },
                              { field: "tackles", desc: "Tackles" },
                              { field: "freeKicks", desc: "Free kicks" },
                              { field: "throwIns", desc: "Throw-ins" },
                            ].map((row) => (
                              <tr key={row.field} className="border-b border-white/[0.04]">
                                <td className="py-2.5 pr-6 font-mono text-white whitespace-nowrap">{row.field}</td>
                                <td className="py-2.5 text-zinc-400">{row.desc}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <h4 id="sub-incidents" className="text-sm font-mono font-semibold text-zinc-300 mt-10 mb-3 uppercase tracking-wider scroll-mt-20">Incident types</h4>
                      <div className="overflow-x-auto mb-8">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-white/[0.08]">
                              <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Type</th>
                              <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Extra fields</th>
                              <th className="text-left py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Description</th>
                            </tr>
                          </thead>
                          <tbody className="text-[13px]">
                            {[
                              { type: "goal", extra: "assistPlayerName?", desc: "Goal scored (includes assist when available)" },
                              { type: "penalty", extra: "assistPlayerName?", desc: "Penalty goal" },
                              { type: "ownGoal", extra: "\u2014", desc: "Own goal" },
                              { type: "yellowCard", extra: "\u2014", desc: "Yellow card" },
                              { type: "redCard", extra: "\u2014", desc: "Red card" },
                              { type: "substitution", extra: "playerOut", desc: "Substitution (playerName = in, playerOut = replaced)" },
                            ].map((row) => (
                              <tr key={row.type} className="border-b border-white/[0.04]">
                                <td className="py-2.5 pr-6 font-mono text-white whitespace-nowrap">{row.type}</td>
                                <td className="py-2.5 pr-6 font-mono text-zinc-500 whitespace-nowrap">{row.extra}</td>
                                <td className="py-2.5 text-zinc-400">{row.desc}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ),
                },
                {
                  value: "tennis",
                  label: "Tennis",
                  content: (
                    <>
                      <p id="sub-scores-tennis" className="text-sm text-zinc-500 font-sans mb-4 scroll-mt-20">
                        Tennis events include <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">tennisDetail</code> (set scores, current game score, serving indicator) and <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">tennisStats</code> (per-match and per-set statistics) when available.
                      </p>
                      <CollapsibleCodeBlock
                        language="json"
                        code={`{
  "id": "tennis:Rokusek@Vickery-20260304",
  "sport": "tennis",
  "name": "Vickery S. at Rokusek S.",
  "startTime": "2026-03-04T01:00:00Z",
  "status": {
    "state": "in",
    "detail": "Live"
  },
  "home": {
    "homeAway": "home",
    "team": { "displayName": "Rokusek S." },
    "score": 1
  },
  "away": {
    "homeAway": "away",
    "team": { "displayName": "Vickery S." },
    "score": 0
  },
  "tennisDetail": {
    "currentSet": 2,
    "sets": [
      { "home": 7, "away": 6 },
      { "home": 1, "away": 4 }
    ],
    "currentGameScore": { "home": "0", "away": "0" },
    "serving": "home"
  },
  "tennisStats": {
    "match": {
      "aces": { "home": 3, "away": 1 },
      "doubleFaults": { "home": 2, "away": 4 },
      "firstServePercent": { "home": 65, "away": 58 },
      "firstServePointsWon": { "home": 72, "away": 61 },
      "secondServePointsWon": { "home": 48, "away": 39 },
      "breakPointsSaved": { "home": 67, "away": 50 },
      "firstReturnPointsWon": { "home": 39, "away": 28 },
      "secondReturnPointsWon": { "home": 52, "away": 61 },
      "breakPointsConverted": { "home": 50, "away": 33 },
      "winners": { "home": 18, "away": 12 },
      "unforcedErrors": { "home": 14, "away": 22 },
      "netPointsWon": { "home": 8, "away": 4 },
      "servicePointsWon": { "home": 42, "away": 33 },
      "returnPointsWon": { "home": 16, "away": 16 },
      "totalPointsWon": { "home": 58, "away": 49 },
      "serviceGamesWon": { "home": 8, "away": 7 },
      "returnGamesWon": { "home": 2, "away": 1 },
      "totalGamesWon": { "home": 10, "away": 8 }
    },
    "sets": [
      {
        "set": 1,
        "stats": {
          "aces": { "home": 2, "away": 1 },
          "doubleFaults": { "home": 1, "away": 3 },
          "firstServePercent": { "home": 62, "away": 55 },
          "totalPointsWon": { "home": 42, "away": 38 }
        }
      }
    ]
  },
  "sourceMatchId": "WnroroiU",
  "lastUpdated": "2026-03-04T01:45:00.000Z"
}`}
                      />

                      <h4 id="sub-tennis-stats" className="text-sm font-mono font-semibold text-zinc-300 mt-10 mb-3 uppercase tracking-wider scroll-mt-20">Tennis stats fields</h4>
                      <p className="text-sm text-zinc-500 font-sans mb-4">
                        The <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">tennisStats</code> object contains <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">match</code> (full-match totals) and an optional <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">sets</code> array with per-set breakdowns. Per-set objects include the same stat fields as the match object. All values use <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">{`{ "home": number, "away": number }`}</code> format and are <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">null</code> when unavailable.
                      </p>
                      <div className="overflow-x-auto mb-8">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-white/[0.08]">
                              <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Field</th>
                              <th className="text-left py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Description</th>
                            </tr>
                          </thead>
                          <tbody className="text-[13px]">
                            {[
                              { field: "aces", desc: "Aces served" },
                              { field: "doubleFaults", desc: "Double faults" },
                              { field: "firstServePercent", desc: "1st serve percentage" },
                              { field: "firstServePointsWon", desc: "1st serve points won %" },
                              { field: "secondServePointsWon", desc: "2nd serve points won %" },
                              { field: "breakPointsSaved", desc: "Break points saved %" },
                              { field: "firstReturnPointsWon", desc: "1st return points won %" },
                              { field: "secondReturnPointsWon", desc: "2nd return points won %" },
                              { field: "breakPointsConverted", desc: "Break points converted %" },
                              { field: "winners", desc: "Winners hit" },
                              { field: "unforcedErrors", desc: "Unforced errors" },
                              { field: "netPointsWon", desc: "Net points won" },
                              { field: "servicePointsWon", desc: "Service points won" },
                              { field: "returnPointsWon", desc: "Return points won" },
                              { field: "totalPointsWon", desc: "Total points won" },
                              { field: "serviceGamesWon", desc: "Service games won" },
                              { field: "returnGamesWon", desc: "Return games won" },
                              { field: "totalGamesWon", desc: "Total games won" },
                            ].map((row) => (
                              <tr key={row.field} className="border-b border-white/[0.04]">
                                <td className="py-2.5 pr-6 font-mono text-white whitespace-nowrap">{row.field}</td>
                                <td className="py-2.5 text-zinc-400">{row.desc}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ),
                },
              ]}
            />

            <div className="rounded-lg bg-[#111113] border border-white/[0.06] p-5 mb-6">
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                <strong className="text-zinc-300">Live match data</strong> — Soccer includes team stats, match incidents (goals, cards, substitutions), and per-player ratings — extended stats (xG, big chances, shot breakdowns) are available for top leagues. Tennis includes per-match and per-set statistics (aces, serve %, break points, winners, unforced errors). When matches complete, all data is automatically archived to the{" "}
                <a href="#history-api" className="text-[#00FF88] hover:underline">Historical Data API</a>.
              </p>
            </div>
          </section>

          {/* ─── Player Stats API ──────────────────────────────────── */}
          <section id="stats-api" className="mb-20 scroll-mt-20">
            <SectionHeading>Player Stats API</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-6">
              Per-player statistics including points, rebounds, assists, shooting splits, and more for today&apos;s games. Rolling averages are available for all sports.
            </p>

            <SubHeading id="sub-stats-endpoints">Endpoints</SubHeading>
            <div className="mb-8">
              <Endpoint method="GET" path="/api/v1/nba/stats" description="Box scores for today's NBA games (live and completed)" />
              <Endpoint method="GET" path="/api/v1/{sport}/stats/averages" description="Rolling averages (L5/L10/L20) with optional H2H filtering" />
            </div>

            <SubHeading id="sub-box-scores">Box scores parameters</SubHeading>
            <ParamTable
              params={[
                { name: "date", type: "string", required: false, description: "Date in YYYY-MM-DD or YYYYMMDD format (defaults to today ET)" },
                { name: "player", type: "string", required: false, description: "Filter by player name (partial match)" },
              ]}
            />

            <SubHeading>Example request</SubHeading>
            <CodeBlock
              language="bash"
              code={`# Today's box scores
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/nba/stats"

# Specific date, filtered to a player
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/nba/stats?date=2026-02-10&player=Towns"`}
            />

            <SubHeading>Response</SubHeading>
            <CollapsibleCodeBlock
              language="json"
              code={`{
  "success": true,
  "data": [
    {
      "gameId": "401810626",
      "sport": "nba",
      "name": "Indiana Pacers at New York Knicks",
      "startTime": "2026-02-11T00:30Z",
      "status": {
        "state": "post",
        "detail": "Final/OT",
        "displayClock": "0:00",
        "period": 0
      },
      "home": {
        "team": {
          "displayName": "New York Knicks",
          "abbreviation": "NY"
        },
        "score": 134,
        "players": [
          {
            "id": "3136195",
            "name": "Karl-Anthony Towns",
            "position": "C",
            "jersey": "32",
            "starter": true,
            "didNotPlay": false,
            "stats": {
              "minutes": "32",
              "points": 22,
              "rebounds": 14,
              "assists": 3,
              "steals": 0,
              "blocks": 0,
              "turnovers": 5,
              "fouls": 6,
              "plusMinus": "+6",
              "fieldGoals": "8-17",
              "threePointers": "1-6",
              "freeThrows": "5-6"
            }
          }
        ]
      },
      "away": {
        "team": {
          "displayName": "Indiana Pacers",
          "abbreviation": "IND"
        },
        "score": 130,
        "players": [ ... ]
      }
    }
  ],
  "meta": {
    "sport": "nba",
    "date": "2026-02-10",
    "gameCount": 4
  }
}`}
            />

            <SubHeading>Player stats fields</SubHeading>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Field</th>
                    <th className="text-left py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {[
                    { field: "minutes", desc: "Minutes played" },
                    { field: "points", desc: "Total points scored" },
                    { field: "rebounds", desc: "Total rebounds" },
                    { field: "assists", desc: "Total assists" },
                    { field: "steals", desc: "Total steals" },
                    { field: "blocks", desc: "Total blocks" },
                    { field: "turnovers", desc: "Total turnovers" },
                    { field: "fouls", desc: "Personal fouls" },
                    { field: "plusMinus", desc: "Plus/minus rating (e.g. \"+6\", \"-3\")" },
                    { field: "fieldGoals", desc: "Field goals as \"made-attempted\" (e.g. \"8-17\")" },
                    { field: "threePointers", desc: "Three-pointers as \"made-attempted\" (e.g. \"1-6\")" },
                    { field: "freeThrows", desc: "Free throws as \"made-attempted\" (e.g. \"5-6\")" },
                  ].map((row) => (
                    <tr key={row.field} className="border-b border-white/[0.04]">
                      <td className="py-2.5 pr-6 font-mono text-white whitespace-nowrap">{row.field}</td>
                      <td className="py-2.5 text-zinc-400">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-lg bg-[#111113] border border-white/[0.06] p-5 mb-10">
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Stats update during live games.
                When a game completes, the final box score is automatically archived to the{" "}
                <a href="#history-api" className="text-[#00FF88] hover:underline">Historical Data API</a> for long-term access.
              </p>
            </div>

            <SubHeading id="sub-rolling-averages">Rolling averages parameters</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              Compute L5/L10/L20 rolling averages for any active player using full-season game logs.
              Add the <code className="text-[13px] font-mono text-zinc-300">opponent</code> parameter for head-to-head averages against a specific team.
              Shooting percentages are computed from totals (sum of makes / sum of attempts), not per-game averages.
            </p>
            <ParamTable
              params={[
                { name: "playerName", type: "string", required: true, description: "Player name (e.g. \"Jalen Brunson\")" },
                { name: "opponent", type: "string", required: false, description: "H2H filter by opponent team name (e.g. \"Boston Celtics\")" },
              ]}
            />

            <SubHeading>Averages example requests</SubHeading>
            <CodeBlock
              language="bash"
              code={`# Rolling averages for an NBA player
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/nba/stats/averages?playerName=Jalen%20Brunson"

# Head-to-head averages vs a specific team
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/nba/stats/averages?playerName=Jalen%20Brunson&opponent=Boston%20Celtics"

# NHL player
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/nhl/stats/averages?playerName=Connor%20McDavid"

# NCAAB player
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/ncaab/stats/averages?playerName=Cooper%20Flagg"`}
            />

            <SubHeading>Averages response</SubHeading>
            <CollapsibleCodeBlock
              language="json"
              code={`{
  "success": true,
  "data": {
    "player": {
      "name": "Jalen Brunson",
      "team": "New York Knicks",
      "position": "PG"
    },
    "opponent": null,
    "averages": {
      "last5": {
        "gamesPlayed": 5,
        "ppg": 29.2,
        "rpg": 4.2,
        "apg": 6.6,
        "spg": 1.4,
        "bpg": 0,
        "topg": 1.8,
        "fgPct": 0.452,
        "threePct": 0.292,
        "ftPct": 0.8,
        "minutesAvg": 36.8,
        "plusMinusAvg": 0
      },
      "last10": {
        "gamesPlayed": 10,
        "ppg": 25.6,
        "rpg": 3.8,
        "apg": 6.3,
        "..."
      },
      "last20": {
        "gamesPlayed": 20,
        "ppg": 24.5,
        "rpg": 3.4,
        "apg": 5.6,
        "..."
      }
    },
    "gameLogs": [
      {
        "gameDate": "2026-02-11",
        "opponent": "Indiana Pacers",
        "homeAway": "away",
        "teamScore": 0,
        "stats": {
          "minutes": "42",
          "points": 40,
          "rebounds": 5,
          "assists": 8,
          "steals": 1,
          "blocks": 0,
          "turnovers": 1,
          "fouls": 3,
          "plusMinus": 0,
          "fg": { "made": 15, "attempted": 31 },
          "threePoint": { "made": 4, "attempted": 14 },
          "freeThrow": { "made": 6, "attempted": 8 }
        }
      }
    ]
  }
}`}
            />

            <SubHeading>Averages fields</SubHeading>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Field</th>
                    <th className="text-left py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {[
                    { field: "ppg", desc: "Points per game" },
                    { field: "rpg", desc: "Rebounds per game" },
                    { field: "apg", desc: "Assists per game" },
                    { field: "spg", desc: "Steals per game" },
                    { field: "bpg", desc: "Blocks per game" },
                    { field: "topg", desc: "Turnovers per game" },
                    { field: "fgPct", desc: "Field goal percentage (0.0\u20131.0)" },
                    { field: "threePct", desc: "Three-point percentage (0.0\u20131.0)" },
                    { field: "ftPct", desc: "Free throw percentage (0.0\u20131.0)" },
                    { field: "minutesAvg", desc: "Average minutes per game" },
                    { field: "plusMinusAvg", desc: "Average plus/minus per game" },
                  ].map((row) => (
                    <tr key={row.field} className="border-b border-white/[0.04]">
                      <td className="py-2.5 pr-6 font-mono text-white whitespace-nowrap">{row.field}</td>
                      <td className="py-2.5 text-zinc-400">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-lg bg-[#111113] border border-white/[0.06] p-5">
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Rolling averages use full-season game logs, covering any active player across all supported sports.
                The response includes up to 100 individual game logs alongside the computed averages.
                Windows with fewer games than the window size will return all available games
                (e.g., <code className="text-[13px] font-mono text-zinc-300">last20</code> may show <code className="text-[13px] font-mono text-zinc-300">gamesPlayed: 15</code> if only 15 games have been played).
              </p>
            </div>
          </section>

          {/* ─── Prediction Markets ──────────────────────────────────── */}
          <section id="prediction-markets" className="mb-20 scroll-mt-20">
            <SectionHeading>Prediction Markets</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-6 leading-relaxed">
              Odds from prediction market exchanges — Kalshi (CFTC-regulated) and Polymarket (decentralized).
              Both are included as bookmakers in the standard <code className="text-[13px] font-mono text-zinc-300">/api/v1/&#123;sport&#125;/odds</code> response.
              Kalshi also has dedicated endpoints for raw market data (order book depth, liquidity, settlement rules).
            </p>

            <DocsTabs
              defaultValue="kalshi"
              label="Prediction market providers"
              tabs={[
                {
                  value: "kalshi",
                  label: "Kalshi",
                  content: (
                    <>
            <p className="text-sm text-zinc-500 font-sans mb-6">
              Raw prediction market data from Kalshi, a CFTC-regulated event contract exchange.
              Returns full market objects with 50+ fields including liquidity, open interest, volume,
              order book depth, settlement rules, and price history.
            </p>

            <SubHeading id="sub-kalshi-endpoints">Endpoints</SubHeading>
            <div className="mb-8">
              <Endpoint method="GET" path="/api/v1/kalshi/{sport}/markets" description="Prediction markets for a sport (game outcomes, spreads, totals)" />
              <Endpoint method="GET" path="/api/v1/kalshi/series/{seriesTicker}/markets" description="Markets for any Kalshi series ticker (Super Bowl, MVP, specials)" />
              <Endpoint method="GET" path="/api/v1/kalshi/series" description="List all known series tickers and sport mappings" />
            </div>

            <SubHeading id="sub-kalshi-sports">Sports</SubHeading>
            <div className="flex flex-wrap gap-2 mb-8">
              {["nba", "ncaab", "nfl", "nhl", "mlb", "soccer"].map((sport) => (
                <code key={sport} className="text-[13px] font-mono text-zinc-300 bg-white/[0.04] px-2.5 py-1 rounded">
                  {sport}
                </code>
              ))}
            </div>

            <SubHeading id="sub-series-tickers">Series tickers</SubHeading>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Ticker</th>
                    <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Sport</th>
                    <th className="text-left py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {[
                    { ticker: "KXNBAGAME", sport: "nba", desc: "NBA game outcomes" },
                    { ticker: "KXNCAAMBGAME", sport: "ncaab", desc: "NCAAB game outcomes" },
                    { ticker: "KXNFLGAME", sport: "nfl", desc: "NFL regular season games" },
                    { ticker: "KXNHLGAME", sport: "nhl", desc: "NHL game outcomes" },
                    { ticker: "KXMLBGAME", sport: "mlb", desc: "MLB game outcomes" },
                    { ticker: "KXSB", sport: "nfl", desc: "Super Bowl / Championship winner" },
                    { ticker: "KXNFLSPREAD", sport: "nfl", desc: "NFL game spreads" },
                    { ticker: "KXNFLTOTAL", sport: "nfl", desc: "NFL game totals" },
                    { ticker: "KXNFLSBMVP", sport: "nfl", desc: "Super Bowl MVP" },
                    { ticker: "KXEPLGAME", sport: "soccer", desc: "English Premier League game outcomes" },
                    { ticker: "KXUCLGAME", sport: "soccer", desc: "UEFA Champions League game outcomes" },
                    { ticker: "KXMLSGAME", sport: "soccer", desc: "MLS game outcomes" },
                    { ticker: "KXLALIGAGAME", sport: "soccer", desc: "La Liga game outcomes" },
                    { ticker: "KXSERIEAGAME", sport: "soccer", desc: "Serie A game outcomes" },
                    { ticker: "KXBUNDESLIGAGAME", sport: "soccer", desc: "Bundesliga game outcomes" },
                    { ticker: "KXLIGUE1GAME", sport: "soccer", desc: "Ligue 1 game outcomes" },
                    { ticker: "KXNWSLGAME", sport: "soccer", desc: "NWSL game outcomes" },
                  ].map((s) => (
                    <tr key={s.ticker} className="border-b border-white/[0.04]">
                      <td className="py-2.5 pr-6 font-mono text-white">{s.ticker}</td>
                      <td className="py-2.5 pr-6 text-zinc-300">{s.sport}</td>
                      <td className="py-2.5 text-zinc-500">{s.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SubHeading>/{"{sport}"}/markets parameters</SubHeading>
            <ParamTable
              params={[
                { name: "status", type: "string", required: false, description: "Market status: open, closed, settled, unopened, paused (default: open)" },
                { name: "limit", type: "number", required: false, description: "Max markets per page (1-200, default: 200)" },
                { name: "cursor", type: "string", required: false, description: "Pagination cursor from previous response" },
              ]}
            />

            <SubHeading>/series/{"{seriesTicker}"}/markets parameters</SubHeading>
            <ParamTable
              params={[
                { name: "status", type: "string", required: false, description: "Market status: open, closed, settled, unopened, paused (default: open)" },
                { name: "limit", type: "number", required: false, description: "Max markets per page (1-200, default: 200)" },
                { name: "cursor", type: "string", required: false, description: "Pagination cursor from previous response" },
                { name: "event_ticker", type: "string", required: false, description: "Filter to a specific event within the series" },
              ]}
            />

            <SubHeading>Example requests</SubHeading>
            <CodeBlock
              language="bash"
              code={`# NBA prediction markets
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/kalshi/nba/markets"

# Super Bowl MVP markets
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/kalshi/series/KXNFLSBMVP/markets"

# NFL spreads filtered by event
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/kalshi/series/KXNFLSPREAD/markets?event_ticker=KXNFLSPREAD-26FEB08SEANE"

# List all series tickers
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/kalshi/series"`}
            />

            <SubHeading>Markets response</SubHeading>
            <CollapsibleCodeBlock
              language="json"
              code={`{
  "series_ticker": "KXNBAGAME",
  "sport": "nba",
  "status": "open",
  "markets": [
    {
      "ticker": "KXNBAGAME-26FEB08-BOS-DEN",
      "event_ticker": "KXNBAGAME-26FEB08-BOS-DEN",
      "market_type": "binary",
      "title": "Celtics vs. Nuggets: Celtics",
      "subtitle": "Celtics vs. Nuggets",
      "status": "open",
      "yes_bid": 59,
      "yes_ask": 61,
      "no_bid": 39,
      "no_ask": 41,
      "last_price": 60,
      "previous_yes_bid": 58,
      "previous_yes_ask": 60,
      "volume": 8234,
      "volume_24h": 2150,
      "open_interest": 5600,
      "liquidity": 32000,
      "close_time": "2026-02-09T01:10:00Z",
      "expiration_time": "2026-02-09T06:00:00Z",
      "settlement_timer_seconds": 3600,
      "rules_primary": "This market will resolve to Yes if...",
      "price_ranges": [],
      "result": "",
      "can_close_early": true,
      "... (54 fields total)"
    }
  ],
  "cursor": "next_page_cursor",
  "count": 28,
  "cached": false,
  "cache_age_seconds": 0
}`}
            />

            <SubHeading>Series listing response</SubHeading>
            <CollapsibleCodeBlock
              language="json"
              code={`{
  "sport_series": [
    { "sport": "nba", "series_ticker": "KXNBAGAME" },
    { "sport": "ncaab", "series_ticker": "KXNCAAMBGAME" },
    { "sport": "nfl", "series_ticker": "KXNFLGAME" },
    { "sport": "nhl", "series_ticker": "KXNHLGAME" },
    { "sport": "mlb", "series_ticker": "KXMLBGAME" },
    { "sport": "soccer", "series_ticker": "KXEPLGAME" }
  ],
  "special_series": [
    { "series_ticker": "KXSB", "description": "Big Game / Championship Winner", "sport": "nfl" },
    { "series_ticker": "KXNFLSPREAD", "description": "NFL Game Spreads", "sport": "nfl" },
    { "series_ticker": "KXNFLTOTAL", "description": "NFL Game Totals", "sport": "nfl" },
    { "series_ticker": "KXNFLSBMVP", "description": "Big Game MVP", "sport": "nfl" }
  ],
  "all_known_tickers": [
    "KXNBAGAME", "KXNCAAMBGAME", "KXNFLGAME", "KXNHLGAME", "KXMLBGAME",
    "KXEPLGAME", "KXUCLGAME", "KXMLSGAME", "KXLALIGAGAME", "KXSERIEAGAME",
    "KXBUNDESLIGAGAME", "KXLIGUE1GAME", "KXNWSLGAME"
  ]
}`}
            />

            <SubHeading>Key fields</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              Kalshi markets are binary contracts priced in cents (0-100). Each market has Yes/No sides with bid/ask spreads.
            </p>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Field</th>
                    <th className="text-left py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {[
                    { field: "yes_bid / yes_ask", desc: "Best bid and ask prices for Yes contracts (cents, 0-100)" },
                    { field: "last_price", desc: "Last traded price (approximates implied probability)" },
                    { field: "volume", desc: "Total contracts traded since market open" },
                    { field: "volume_24h", desc: "Contracts traded in the last 24 hours" },
                    { field: "open_interest", desc: "Outstanding unsettled contracts" },
                    { field: "liquidity", desc: "Depth of the order book (cents)" },
                    { field: "settlement_timer_seconds", desc: "Seconds after close before settlement" },
                    { field: "rules_primary", desc: "Full settlement rules text" },
                  ].map((row) => (
                    <tr key={row.field} className="border-b border-white/[0.04]">
                      <td className="py-2.5 pr-6 font-mono text-white whitespace-nowrap">{row.field}</td>
                      <td className="py-2.5 text-zinc-400">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

                    </>
                  ),
                },
                {
                  value: "polymarket",
                  label: "Polymarket",
                  content: (
                    <>
            <p className="text-sm text-zinc-500 font-sans mb-6">
              Prediction market odds from Polymarket, the largest decentralized prediction market.
              Polymarket odds are included as a bookmaker in the standard odds response — no separate endpoint needed.
            </p>

            <SubHeading id="sub-polymarket-endpoints">How Polymarket data is delivered</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4 leading-relaxed">
              Polymarket appears as a bookmaker (<code className="text-[13px] font-mono text-zinc-300">key: &quot;polymarket&quot;</code>) in the
              standard <code className="text-[13px] font-mono text-zinc-300">/api/v1/&#123;sport&#125;/odds</code> response alongside
              Pinnacle, FanDuel, DraftKings, and other books. No separate API call required.
            </p>

            <CodeBlock
              language="bash"
              code={`# Polymarket odds are included in the standard odds endpoint
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/nba/odds"

# Look for bookmaker with key "polymarket" in each game's bookmakers array`}
            />

            <SubHeading>Supported sports</SubHeading>
            <div className="flex flex-wrap gap-2 mb-8">
              {["nba", "ncaab", "nfl", "nhl", "ncaaf", "mlb", "ncaah", "tennis", "soccer"].map((sport) => (
                <code key={sport} className="text-[13px] font-mono text-zinc-300 bg-white/[0.04] px-2.5 py-1 rounded">
                  {sport}
                </code>
              ))}
            </div>

            <SubHeading>Example response</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              Polymarket odds use the same format as all other bookmakers — American odds for moneylines, spreads, and totals:
            </p>
            <CollapsibleCodeBlock
              language="json"
              code={`{
  "key": "polymarket",
  "title": "Polymarket",
  "last_update": "2026-03-01T08:12:04.678Z",
  "markets": [
    {
      "key": "h2h",
      "last_update": "2026-03-01T08:12:04.678Z",
      "outcomes": [
        { "name": "Memphis Grizzlies", "price": 245 },
        { "name": "Denver Nuggets", "price": -223 }
      ]
    },
    {
      "key": "spreads",
      "outcomes": [
        { "name": "Memphis Grizzlies", "price": 1553, "point": -12.5 },
        { "name": "Denver Nuggets", "price": -1553, "point": 12.5 }
      ]
    }
  ]
}`}
            />

            <SubHeading>Raw market data</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4 leading-relaxed">
              For raw Polymarket market data including condition IDs, token addresses, and order book info, use the dedicated endpoint:
            </p>
            <div className="mb-8">
              <Endpoint method="GET" path="/api/v1/polymarket/{sport}/markets" description="Raw Polymarket market data (condition IDs, token addresses, order book info)" />
            </div>
                    </>
                  ),
                },
              ]}
            />
          </section>

          {/* ─── Historical Data API ───────────────────────────────── */}
          <section id="history-api" className="mb-20 scroll-mt-20">
            <SectionHeading>Historical Data API</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-6">
              Archived odds, props, player stats, and tennis match statistics for completed games. Data is archived automatically when games finish.
            </p>

            <SubHeading id="sub-history-endpoints">Endpoints</SubHeading>
            <div className="mb-8">
              <Endpoint method="GET" path="/api/v1/history/games" description="List archived games with filtering and pagination" />
              <Endpoint method="GET" path="/api/v1/history/odds" description="Historical odds snapshots for an archived game" />
              <Endpoint method="GET" path="/api/v1/history/props" description="Historical props snapshots for an archived game" />
              <Endpoint method="GET" path="/api/v1/history/stats" description="Historical player box scores for archived games" />
              <Endpoint method="GET" path="/api/v1/history/stats/averages" description="Rolling averages (L5/L10/L20) with optional H2H filtering" />
              <Endpoint method="GET" path="/api/v1/history/tennis-stats" description="Historical tennis match statistics (per-match and per-set)" />
            </div>

            <SubHeading>/history/games parameters</SubHeading>
            <ParamTable
              params={[
                { name: "sport", type: "string", required: false, description: "Filter by sport (nba, ncaab, nfl, nhl, ncaaf, mlb, soccer)" },
                { name: "startDate", type: "string", required: false, description: "Start date (YYYY-MM-DD)" },
                { name: "endDate", type: "string", required: false, description: "End date (YYYY-MM-DD)" },
                { name: "limit", type: "number", required: false, description: "Max results (1-100, default 50)" },
                { name: "offset", type: "number", required: false, description: "Pagination offset" },
              ]}
            />

            <SubHeading>/history/odds parameters</SubHeading>
            <ParamTable
              params={[
                { name: "eventId", type: "string", required: true, description: "Game identifier from /history/games" },
                { name: "book", type: "string", required: false, description: "Filter by sportsbook" },
                { name: "market", type: "string", required: false, description: "h2h, spreads, or totals" },
                { name: "side", type: "string", required: false, description: "home, away, over, or under" },
                { name: "startTime", type: "string", required: false, description: "ISO date or Unix timestamp (ms)" },
                { name: "endTime", type: "string", required: false, description: "ISO date or Unix timestamp (ms)" },
                { name: "opening", type: "string", required: false, description: "Set to \"true\" to return only opening lines (first recorded snapshot per book/market/side)" },
                { name: "limit", type: "number", required: false, description: "Max results (1-5000, default 1000)" },
                { name: "offset", type: "number", required: false, description: "Pagination offset (default 0)" },
              ]}
            />

            <SubHeading>/history/props parameters</SubHeading>
            <ParamTable
              params={[
                { name: "eventId", type: "string", required: true, description: "Game identifier from /history/games" },
                { name: "playerName", type: "string", required: false, description: "Filter by player name" },
                { name: "propType", type: "string", required: false, description: "Filter by prop type (points, rebounds, etc.)" },
                { name: "book", type: "string", required: false, description: "Filter by sportsbook" },
                { name: "startTime", type: "string", required: false, description: "ISO date or Unix timestamp (ms)" },
                { name: "endTime", type: "string", required: false, description: "ISO date or Unix timestamp (ms)" },
                { name: "opening", type: "string", required: false, description: "Set to \"true\" to return only opening lines (first recorded snapshot per player/prop/book)" },
                { name: "limit", type: "number", required: false, description: "Max results (1-5000, default 1000)" },
                { name: "offset", type: "number", required: false, description: "Pagination offset (default 0)" },
              ]}
            />

            <SubHeading>Games response</SubHeading>
            <CollapsibleCodeBlock
              language="json"
              code={`{
  "success": true,
  "data": {
    "games": [
      {
        "eventId": "nba:Los Angeles Clippers@Sacramento Kings-20260207",
        "sport": "nba",
        "homeTeam": "Sacramento Kings",
        "awayTeam": "Los Angeles Clippers",
        "gameDate": "2026-02-07T00:00:00.000Z",
        "archivedAt": "2026-02-07T05:54:48.000Z",
        "oddsSnapshots": 116364,
        "propsSnapshots": 41650,
        "playerStats": 26
      }
    ],
    "pagination": { "total": 602, "limit": 50, "offset": 0 }
  }
}`}
            />

            <SubHeading>Odds snapshots response</SubHeading>
            <CollapsibleCodeBlock
              language="json"
              code={`{
  "success": true,
  "data": {
    "eventId": "nba:Los Angeles Clippers@Sacramento Kings-20260207",
    "opening": false,
    "timeRange": { "start": null, "end": null },
    "snapshots": [
      {
        "book": "pinnacle",
        "market": "h2h",
        "side": "home",
        "price": 143,
        "point": null,
        "recordedAt": "2026-02-05T22:17:24.424Z"
      }
    ],
    "count": 1,
    "limit": 1000,
    "offset": 0
  }
}`}
            />

            <SubHeading>Props snapshots response</SubHeading>
            <CollapsibleCodeBlock
              language="json"
              code={`{
  "success": true,
  "data": {
    "eventId": "nba:Los Angeles Clippers@Sacramento Kings-20260207",
    "opening": false,
    "timeRange": { "start": null, "end": null },
    "snapshots": [
      {
        "playerName": "deaaronfox",
        "propType": "points",
        "book": "fanduel",
        "line": "26.5",
        "overPrice": -110,
        "underPrice": -110,
        "recordedAt": "2026-02-06T15:30:12.000Z"
      }
    ],
    "count": 1,
    "limit": 1000,
    "offset": 0
  }
}`}
            />

            <SubHeading>/history/stats parameters</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              Query archived player box scores. At least one of <code className="text-[13px] font-mono text-zinc-300">eventId</code> or <code className="text-[13px] font-mono text-zinc-300">playerName</code> is required.
            </p>
            <ParamTable
              params={[
                { name: "eventId", type: "string", required: false, description: "Game identifier from /history/games" },
                { name: "playerName", type: "string", required: false, description: "Player name (partial match supported)" },
                { name: "sport", type: "string", required: false, description: "Filter by sport (nba, ncaab, nfl, nhl, ncaaf, mlb, soccer)" },
                { name: "position", type: "string", required: false, description: "Filter by position (e.g. G, F, C)" },
                { name: "startDate", type: "string", required: false, description: "Start date (YYYY-MM-DD)" },
                { name: "endDate", type: "string", required: false, description: "End date (YYYY-MM-DD)" },
                { name: "limit", type: "number", required: false, description: "Max results (1-5000, default 1000)" },
                { name: "offset", type: "number", required: false, description: "Pagination offset (default 0)" },
              ]}
            />

            <SubHeading>Stats example request</SubHeading>
            <CodeBlock
              language="bash"
              code={`# Get all player stats for a specific game
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/history/stats?eventId=nba:Indiana%20Pacers@New%20York%20Knicks-20260210"

# Query a player across multiple games
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/history/stats?playerName=Jalen%20Brunson&sport=nba&startDate=2026-02-01&endDate=2026-02-10"`}
            />

            <SubHeading>Stats response</SubHeading>
            <CollapsibleCodeBlock
              language="json"
              code={`{
  "success": true,
  "data": {
    "eventId": "nba:Indiana Pacers@New York Knicks-20260210",
    "playerName": null,
    "stats": [
      {
        "eventId": "nba:Indiana Pacers@New York Knicks-20260210",
        "sport": "nba",
        "espnGameId": "401810626",
        "gameDate": "2026-02-10",
        "team": {
          "name": "New York Knicks",
          "abbreviation": "NY",
          "homeAway": "home",
          "score": 134
        },
        "player": {
          "espnId": "3136195",
          "name": "Karl-Anthony Towns",
          "position": "C",
          "jersey": "32",
          "starter": true,
          "didNotPlay": false
        },
        "stats": {
          "minutes": "32",
          "points": 22,
          "rebounds": 14,
          "assists": 3,
          "steals": 0,
          "blocks": 0,
          "turnovers": 5,
          "fouls": 6,
          "plusMinus": 6,
          "fg": { "made": 8, "attempted": 17 },
          "threePoint": { "made": 1, "attempted": 6 },
          "freeThrow": { "made": 5, "attempted": 6 }
        },
        "recordedAt": "2026-02-10T06:15:00.000Z"
      }
    ],
    "count": 26,
    "limit": 1000,
    "offset": 0
  }
}`}
            />

            <SubHeading>/history/stats/averages parameters</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              Alternate path for rolling averages. Same data as <code className="text-[13px] font-mono text-zinc-300">/api/v1/{"{sport}"}/stats/averages</code> above.
            </p>
            <ParamTable
              params={[
                { name: "playerName", type: "string", required: true, description: "Player name (e.g. \"Jalen Brunson\")" },
                { name: "sport", type: "string", required: true, description: "Sport: nba, ncaab, nfl, nhl, ncaaf, mlb" },
                { name: "opponent", type: "string", required: false, description: "H2H filter by opponent team name (e.g. \"Boston Celtics\")" },
              ]}
            />

            <SubHeading>Averages example request</SubHeading>
            <CodeBlock
              language="bash"
              code={`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/history/stats/averages?playerName=Jalen%20Brunson&sport=nba"`}
            />

            <SubHeading id="sub-history-tennis-stats">/history/tennis-stats parameters</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              Archived per-match and per-set tennis statistics (aces, serve %, break points, winners, etc.). Data is archived automatically when tennis matches complete.
            </p>
            <ParamTable
              params={[
                { name: "eventId", type: "string", required: true, description: "Tennis game identifier from /history/games" },
              ]}
            />

            <SubHeading>Tennis stats example request</SubHeading>
            <CodeBlock
              language="bash"
              code={`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/history/tennis-stats?eventId=tennis:Sinner@Djokovic-20260301"`}
            />

            <SubHeading>Tennis stats response</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              Returns a flat array of stat objects — one with <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">scope: &quot;match&quot;</code> for match totals, plus one per set (<code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">set1</code>, <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">set2</code>, etc.). Each stat field is <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">{`{ "home": number, "away": number }`}</code> or <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-300">null</code> when unavailable.
            </p>
            <CollapsibleCodeBlock
              language="json"
              code={`{
  "success": true,
  "data": {
    "eventId": "tennis:Sinner@Djokovic-20260301",
    "stats": [
      {
        "scope": "match",
        "aces": { "home": 8, "away": 5 },
        "doubleFaults": { "home": 2, "away": 4 },
        "firstServePercent": { "home": 68, "away": 62 },
        "firstServePointsWon": { "home": 76, "away": 65 },
        "secondServePointsWon": { "home": 52, "away": 44 },
        "breakPointsSaved": { "home": 80, "away": 60 },
        "firstReturnPointsWon": { "home": 35, "away": 24 },
        "secondReturnPointsWon": { "home": 56, "away": 48 },
        "breakPointsConverted": { "home": 40, "away": 20 },
        "winners": { "home": 34, "away": 22 },
        "unforcedErrors": { "home": 18, "away": 31 },
        "netPointsWon": { "home": 12, "away": 6 },
        "servicePointsWon": { "home": 68, "away": 52 },
        "returnPointsWon": { "home": 44, "away": 42 },
        "totalPointsWon": { "home": 112, "away": 94 },
        "serviceGamesWon": { "home": 14, "away": 11 },
        "returnGamesWon": { "home": 3, "away": 2 },
        "totalGamesWon": { "home": 17, "away": 13 },
        "recordedAt": "2026-03-01T18:45:00.000Z"
      },
      {
        "scope": "set1",
        "aces": { "home": 3, "away": 2 },
        "doubleFaults": { "home": 1, "away": 1 },
        "firstServePercent": { "home": 70, "away": 60 },
        "totalPointsWon": { "home": 38, "away": 30 },
        "recordedAt": "2026-03-01T18:45:00.000Z"
      }
    ],
    "count": 2
  }
}`}
            />
          </section>

          {/* ─── WebSocket API ─────────────────────────────────────── */}
          <section id="websocket" className="mb-20 scroll-mt-20">
            <SectionHeading>WebSocket API</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-6">
              Live streaming for odds, scores, and player props. Updates are pushed on change — no polling required, no message limits.
            </p>

            <SubHeading id="sub-ws-connection">Connection</SubHeading>
            <CodeBlock
              language="javascript"
              code={`import { io } from "socket.io-client";

const socket = io("wss://api.owlsinsight.com", {
  query: { apiKey: "YOUR_API_KEY" },
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected to Owls Insight");
});`}
            />

            <SubHeading id="sub-ws-events">Events</SubHeading>
            <div className="space-y-0 mb-8">
              {[
                { name: "odds-update", description: "Latest odds data, pushed on change — frequency varies by book (automatic)", tier: undefined },
                { name: "player-props-update", description: "Pinnacle player props, streamed on change (requires subscribe-props)", tier: undefined },
                { name: "fanduel-props-update", description: "FanDuel player props, streamed on change (requires subscribe-fanduel-props)", tier: undefined },
                { name: "draftkings-props-update", description: "DraftKings player props, streamed on change (requires subscribe-draftkings-props)", tier: undefined },
                { name: "bet365-props-update", description: "Bet365 player props, streamed on change (requires subscribe-bet365-props)", tier: undefined },
                { name: "betmgm-props-update", description: "BetMGM player props, streamed on change (requires subscribe-betmgm-props)", tier: undefined },
                { name: "caesars-props-update", description: "Caesars player props, streamed on change (requires subscribe-caesars-props)", tier: undefined },
                { name: "esports-update", description: "CS2 live + prematch odds from 1xBet, streamed on change (requires esports: true)", tier: undefined },
                { name: "pinnacle-realtime", description: "Real-time Pinnacle sharp odds via dedicated feed", tier: undefined },
              ].map((event) => (
                <div key={event.name} className="flex items-start gap-3 py-3 border-b border-white/[0.04]">
                  <code className="text-[13px] font-mono text-white shrink-0">{event.name}</code>
                  <p className="text-sm text-zinc-500 flex-1">{event.description}</p>
                  {event.tier && <TierBadge tier={event.tier} className="shrink-0" />}
                </div>
              ))}
            </div>

            <SubHeading>Odds (automatic)</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              Odds are pushed automatically after connecting — no polling required. Update frequency varies by source (see above). Use <code className="text-[13px] font-mono text-zinc-300">subscribe</code> to filter by sport or book. For live scores, use the <a href="#scores-api" className="text-blue-400 hover:text-blue-300 transition-colors">REST Live Scores API</a>.
            </p>
            <CodeBlock
              language="javascript"
              code={`// Odds arrive automatically after connecting
socket.on("odds-update", (data) => {
  console.log("NBA games:", data.sports.nba?.length || 0);
  console.log("Available leagues:", data.leagues.nba); // ["NBA"]
  data.sports.nba?.forEach(game => {
    console.log(\`\${game.away_team} @ \${game.home_team}\`);
  });
});

// Optional: filter odds to specific sports/books
socket.emit("subscribe", {
  sports: ["nba", "ncaab"],
  books: ["pinnacle", "fanduel", "draftkings", "betmgm", "bet365", "caesars"],
  alternates: true  // Include Pinnacle alternate spread/total lines
});`}
            />

            <SubHeading>Payload structure</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              Each WebSocket event includes a <code className="text-[13px] font-mono text-zinc-300">leagues</code> field listing available leagues per sport, and a <code className="text-[13px] font-mono text-zinc-300">last_odds_change</code> timestamp indicating when any odds value last changed (distinct from <code className="text-[13px] font-mono text-zinc-300">timestamp</code> which updates on every heartbeat):
            </p>
            <CodeBlock
              language="json"
              code={`{
  "sports": {
    "soccer": [ ... ],
    "tennis": [ ... ],
    "nba": [ ... ]
  },
  "leagues": {
    "soccer": ["England - Premier League", "Spain - La Liga", "Germany - Bundesliga"],
    "tennis": ["ATP Dubai - R1", "WTA Austin - R1", "ATP Melbourne - QF"],
    "nba": ["NBA"]
  },
  "timestamp": "2026-01-31T12:34:56.789Z",
  "last_odds_change": "2026-01-31T12:34:52.100Z"
}`}
            />

            <SubHeading id="sub-ws-props">Player props (subscription required)</SubHeading>
            <div className="rounded-lg bg-[#111113] border border-amber-500/20 p-5 mb-6">
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Props are <strong className="text-zinc-200">not sent automatically</strong>. You must emit a subscribe event for each book
                you want to receive. After subscribing, cached data is sent immediately and live updates stream continuously as lines change.
              </p>
            </div>
            <CodeBlock
              language="javascript"
              code={`// Step 1: Set up listeners BEFORE subscribing
socket.on("player-props-update", (data) => {
  // Pinnacle props
  console.log("Pinnacle props:", data.sports.nba?.length || 0, "games");
});
socket.on("fanduel-props-update", (data) => {
  console.log("FanDuel props:", data.sports.nba?.length || 0, "games");
});
socket.on("draftkings-props-update", (data) => {
  console.log("DraftKings props:", data.sports.nba?.length || 0, "games");
});
socket.on("bet365-props-update", (data) => {
  console.log("Bet365 props:", data.sports.nba?.length || 0, "games");
});
socket.on("betmgm-props-update", (data) => {
  console.log("BetMGM props:", data.sports.nba?.length || 0, "games");
});
socket.on("caesars-props-update", (data) => {
  console.log("Caesars props:", data.sports.nba?.length || 0, "games");
});

// Step 2: Subscribe to each book you want (emit AFTER connect)
socket.on("connect", () => {
  const filter = { sports: ["nba", "ncaab", "nhl"] };

  socket.emit("subscribe-props", filter);           // Pinnacle
  socket.emit("subscribe-fanduel-props", filter);    // FanDuel
  socket.emit("subscribe-draftkings-props", filter); // DraftKings
  socket.emit("subscribe-bet365-props", filter);     // Bet365
  socket.emit("subscribe-betmgm-props", filter);     // BetMGM
  socket.emit("subscribe-caesars-props", filter);     // Caesars
});

// Confirmation events (server replies after each subscribe)
socket.on("props-subscribed", (sub) => console.log("Pinnacle props active:", sub));
socket.on("fanduel-props-subscribed", (sub) => console.log("FanDuel props active:", sub));
// Same pattern: draftkings-props-subscribed, bet365-props-subscribed,
//               betmgm-props-subscribed, caesars-props-subscribed`}
            />

            <SubHeading>Props subscription parameters</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              All parameters are optional. Omit everything to receive all props.
            </p>
            <ParamTable
              params={[
                { name: "sports", type: "string[]", required: false, description: "Filter by sport: nba, ncaab, nfl, nhl, ncaaf, mlb, soccer" },
                { name: "games", type: "string[]", required: false, description: "Filter by specific game IDs" },
                { name: "categories", type: "string[]", required: false, description: "Filter by prop type: points, rebounds, assists, threes, blocks, steals, turnovers, goals, shots" },
              ]}
            />

            <SubHeading>Esports</SubHeading>
            <CodeBlock
              language="javascript"
              code={`// Esports requires opt-in via the subscribe event
socket.emit("subscribe", { esports: true });

socket.on("esports-update", (data) => {
  console.log("CS2 matches:", data.sports.cs2?.length || 0);
});`}
            />
          </section>

          {/* ─── Real-Time Odds API ──────────────────────────────────── */}
          <section id="realtime-api" className="mb-20 scroll-mt-20">
            <SectionHeading>Real-Time Odds (Beta)</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-6">
              Real-time sharp Pinnacle odds delivered via a dedicated low-latency feed.
              This is separate from the aggregated <code className="text-[13px] font-mono text-zinc-300">/odds</code> endpoint — it provides the fastest possible Pinnacle data with freshness metadata.
              The <code className="text-[13px] font-mono text-zinc-300">meta.freshness</code> object in each response tells you exactly how old the data is.
            </p>

            <SubHeading id="sub-realtime-endpoints">Endpoints</SubHeading>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-2.5 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Method</th>
                    <th className="text-left py-2.5 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Endpoint</th>
                    <th className="text-left py-2.5 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-2.5 pr-6 font-mono text-[#00FF88]">GET</td>
                    <td className="py-2.5 pr-6 font-mono text-white">/api/v1/&#123;sport&#125;/realtime</td>
                    <td className="py-2.5 text-zinc-400">Real-time sharp Pinnacle odds for a sport</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-zinc-500 font-sans mb-6">
              Supported sports: <code className="text-[13px] font-mono text-zinc-300">nba</code>, <code className="text-[13px] font-mono text-zinc-300">ncaab</code>, <code className="text-[13px] font-mono text-zinc-300">nfl</code>, <code className="text-[13px] font-mono text-zinc-300">nhl</code>, <code className="text-[13px] font-mono text-zinc-300">ncaaf</code>, <code className="text-[13px] font-mono text-zinc-300">mlb</code>, <code className="text-[13px] font-mono text-zinc-300">ncaah</code>, <code className="text-[13px] font-mono text-zinc-300">tennis</code>, <code className="text-[13px] font-mono text-zinc-300">soccer</code>
            </p>

            <SubHeading id="sub-realtime-parameters">Parameters</SubHeading>
            <ParamTable
              params={[
                { name: "league", type: "string", required: false, description: "Filter by league name — substring match, case-insensitive (useful for soccer, tennis, and basketball)" },
              ]}
            />

            <SubHeading>Example request</SubHeading>
            <CodeBlock
              language="bash"
              code={`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/nba/realtime"`}
            />

            <SubHeading>Response</SubHeading>
            <CollapsibleCodeBlock
              language="json"
              code={`{
  "success": true,
  "data": [
    {
      "id": "1624025571",
      "sport_key": "basketball_nba",
      "commence_time": "2026-02-22T20:00:00Z",
      "home_team": "Atlanta Hawks",
      "away_team": "Brooklyn Nets",
      "bookmakers": [
        {
          "key": "pinnacle",
          "title": "Pinnacle",
          "event_link": "https://www.pinnacle.com/en/1624025571/",
          "markets": [
            {
              "key": "h2h",
              "outcomes": [
                { "name": "Atlanta Hawks", "price": -366 },
                { "name": "Brooklyn Nets", "price": 295 }
              ]
            },
            {
              "key": "spreads",
              "outcomes": [
                { "name": "Atlanta Hawks", "price": 102, "point": -8.5 },
                { "name": "Brooklyn Nets", "price": -130, "point": 8.5 }
              ]
            },
            {
              "key": "totals",
              "outcomes": [
                { "name": "Over", "price": -122, "point": 226.5 },
                { "name": "Under", "price": -106, "point": 226.5 }
              ]
            }
          ]
        }
      ]
    }
  ],
  "meta": {
    "sport": "nba",
    "source": "pinnacle_mqtt",
    "available": true,
    "events": 10,
    "timestamp": "2026-02-22T20:59:09.308Z",
    "freshness": {
      "ageSeconds": 3,
      "stale": false,
      "threshold": 30
    }
  }
}`}
            />

            <SubHeading>Freshness metadata</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              The <code className="text-[13px] font-mono text-zinc-300">meta.freshness</code> object indicates how recent the data is.
            </p>
            <ParamTable
              params={[
                { name: "ageSeconds", type: "number", required: true, description: "How many seconds ago the data was last updated" },
                { name: "stale", type: "boolean", required: true, description: "True if data is older than the threshold (feed may be reconnecting)" },
                { name: "threshold", type: "number", required: true, description: "Staleness threshold in seconds (currently 30)" },
              ]}
            />

            <SubHeading id="sub-realtime-ws">WebSocket event</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              WebSocket connections automatically receive a <code className="text-[13px] font-mono text-zinc-300">pinnacle-realtime</code> event
              with the full real-time payload whenever new data is available. No subscription required — it is pushed automatically.
            </p>
            <CodeBlock
              language="javascript"
              code={`socket.on("pinnacle-realtime", (data) => {
  // data contains all sports: nba, ncaab, nfl, nhl, ncaaf, mlb, ncaah, tennis, soccer
  console.log("NBA real-time events:", data.nba?.length || 0);
  console.log("Soccer real-time events:", data.soccer?.length || 0);
  console.log("Timestamp:", data.timestamp);
});`}
            />

          </section>



          {/* ─── Rate Limits ───────────────────────────────────────── */}
          <section id="rate-limits" className="mb-20 scroll-mt-20">
            <SectionHeading>Rate Limits</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-6">
              Rate limits apply to <strong className="text-zinc-400">REST API requests only</strong>. WebSocket connections receive unlimited push updates with no message limits — once connected, all odds changes are streamed to you automatically.
            </p>

            <div className="overflow-x-auto mb-10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-2.5 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Tier</th>
                    <th className="text-left py-2.5 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Price</th>
                    <th className="text-left py-2.5 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">REST Req/Month</th>
                    <th className="text-left py-2.5 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">REST Req/Minute</th>
                    <th className="text-left py-2.5 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Concurrent</th>
                    <th className="text-left py-2.5 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">WebSocket (unlimited msgs)</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-2.5 pr-6 font-mono text-white">Bench</td>
                    <td className="py-2.5 pr-6 text-zinc-400">$9.99/mo</td>
                    <td className="py-2.5 pr-6 text-zinc-400">10,000</td>
                    <td className="py-2.5 pr-6 text-zinc-400">20</td>
                    <td className="py-2.5 pr-6 text-zinc-400">1</td>
                    <td className="py-2.5 text-zinc-600">REST only</td>
                  </tr>
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-2.5 pr-6 font-mono text-white">Rookie</td>
                    <td className="py-2.5 pr-6 text-zinc-400">$24.99/mo</td>
                    <td className="py-2.5 pr-6 text-zinc-400">75,000</td>
                    <td className="py-2.5 pr-6 text-zinc-400">120</td>
                    <td className="py-2.5 pr-6 text-zinc-400">5</td>
                    <td className="py-2.5 text-zinc-400">2 connections</td>
                  </tr>
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-2.5 pr-6 font-mono text-white">MVP</td>
                    <td className="py-2.5 pr-6 text-zinc-400">$49.99/mo</td>
                    <td className="py-2.5 pr-6 text-zinc-400">300,000</td>
                    <td className="py-2.5 pr-6 text-zinc-400">400</td>
                    <td className="py-2.5 pr-6 text-zinc-400">15</td>
                    <td className="py-2.5 text-zinc-400">5 connections</td>
                  </tr>
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-2.5 pr-6 font-mono text-amber-400">Hall of Fame</td>
                    <td className="py-2.5 pr-6 text-zinc-400">$200/mo</td>
                    <td className="py-2.5 pr-6 text-zinc-400">Unlimited</td>
                    <td className="py-2.5 pr-6 text-zinc-400">1,000</td>
                    <td className="py-2.5 pr-6 text-zinc-400">20</td>
                    <td className="py-2.5 text-zinc-400">20 connections</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <SubHeading id="sub-tier-features">Tier features</SubHeading>
            <div className="space-y-4 mb-10">
              <div className="rounded-lg bg-[#111113] border border-white/[0.06] p-5">
                <p className="font-mono text-sm font-semibold text-white mb-2">Bench</p>
                <ul className="text-[13px] text-zinc-500 space-y-1">
                  <li>REST API only, polled odds/spreads/totals, live scores, prediction markets (Kalshi + Polymarket)</li>
                </ul>
              </div>
              <div className="rounded-lg bg-[#111113] border border-white/[0.06] p-5">
                <p className="font-mono text-sm font-semibold text-white mb-2">Rookie</p>
                <ul className="text-[13px] text-zinc-500 space-y-1">
                  <li>REST + WebSocket (2 connections), polled odds, player props, player stats, prop line history, rolling averages</li>
                </ul>
              </div>
              <div className="rounded-lg bg-[#111113] border border-purple-500/15 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-mono text-sm font-semibold text-white">MVP</p>
                  <span className="text-[10px] font-mono text-purple-400">Most Popular</span>
                </div>
                <ul className="text-[13px] text-zinc-500 space-y-1">
                  <li>REST + WebSocket (5 connections), 15 concurrent requests, full props + WebSocket streaming, full historical odds/props/stats, real-time sharp Pinnacle odds (beta)</li>
                </ul>
              </div>
              <div className="rounded-lg bg-[#111113] border border-amber-500/15 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-mono text-sm font-semibold text-white">Hall of Fame</p>
                  <span className="text-[10px] font-mono text-amber-400">Enterprise</span>
                </div>
                <ul className="text-[13px] text-zinc-500 space-y-1">
                  <li>Everything in MVP + unlimited monthly requests, 1,000 req/min burst, 20 WebSocket connections, 20 concurrent requests, historical data</li>
                </ul>
              </div>
            </div>

            <SubHeading>Rate limit headers</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              Every response includes headers with your current rate limit status.
            </p>
            <CodeBlock
              language="http"
              code={`X-RateLimit-Remaining-Minute: 87
X-RateLimit-Remaining-Month: 62340
X-RateLimit-Reset-Minute: 1738348260
X-RateLimit-Reset-Month: 2026-03-01T00:00:00.000Z`}
            />
          </section>

          {/* ─── Sportsbooks & Coverage ─────────────────────────────── */}
          <section id="coverage" className="mb-20 scroll-mt-20">
            <SectionHeading>Sportsbooks &amp; Coverage</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-6 leading-relaxed">
              We aggregate real-time odds from 10 sportsbooks — sharp lines from Pinnacle, US retail leaders, prediction exchanges (Kalshi and Polymarket), and international markets.
              Coverage varies by sport, book, and market type.
            </p>

            <div className="overflow-x-auto mb-10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Book</th>
                    <th className="text-left py-2.5 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Sports</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {[
                    { book: "Pinnacle", sports: "NBA, NCAAB, NFL, NHL, NCAAF, NCAAH, MLB, Soccer, Tennis, Intl Basketball" },
                    { book: "FanDuel", sports: "NBA, NCAAB, NFL, NHL, NCAAF, MLB, Soccer" },
                    { book: "DraftKings", sports: "NBA, NCAAB, NFL, NHL, NCAAF, MLB, Soccer" },
                    { book: "BetMGM", sports: "NBA, NCAAB, NFL, NHL, NCAAF, Soccer" },
                    { book: "Bet365", sports: "NBA, NCAAB, NFL, NHL, NCAAF, Soccer" },
                    { book: "Caesars", sports: "NBA, NCAAB, NFL, NHL, NCAAF, Soccer" },
                    { book: "Kalshi", sports: "NBA, NCAAB, NFL, NHL, MLB, Soccer" },
                    { book: "BetOnline", sports: "MMA" },
                    { book: "1xBet", sports: "CS2, Soccer, MLB" },
                    { book: "Polymarket", sports: "NBA, NCAAB, NFL, NHL, NCAAF, NCAAH, MLB, Soccer, Tennis" },
                  ].map((row) => (
                    <tr key={row.book} className="border-b border-white/[0.04]">
                      <td className="py-2.5 pr-4 font-mono text-white">{row.book}</td>
                      <td className="py-2.5 text-zinc-400 text-[12px]">{row.sports}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SubHeading id="sub-game-odds-coverage">Game odds</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              Pre-match and live odds including moneylines, spreads, and totals.
            </p>
            <div className="overflow-x-auto mb-10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Book</th>
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">NBA</th>
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">NCAAB</th>
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">NFL</th>
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">NCAAF</th>
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">NHL</th>
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">NCAAH</th>
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">MLB</th>
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Soccer</th>
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Tennis</th>
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">MMA</th>
                    <th className="text-left py-2.5 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">CS2</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {[
                    { book: "Pinnacle", nba: "strong", ncaab: "strong", nfl: "strong", ncaaf: "strong", nhl: "strong", ncaah: "strong", mlb: "strong", soccer: "strong", tennis: "strong", mma: "none", cs2: "none" },
                    { book: "FanDuel", nba: "strong", ncaab: "strong", nfl: "strong", ncaaf: "strong", nhl: "strong", ncaah: "partial", mlb: "strong", soccer: "strong", tennis: "none", mma: "none", cs2: "none" },
                    { book: "DraftKings", nba: "strong", ncaab: "strong", nfl: "strong", ncaaf: "strong", nhl: "strong", ncaah: "partial", mlb: "strong", soccer: "strong", tennis: "none", mma: "none", cs2: "none" },
                    { book: "BetMGM", nba: "strong", ncaab: "partial", nfl: "strong", ncaaf: "partial", nhl: "partial", ncaah: "partial", mlb: "soon", soccer: "partial", tennis: "none", mma: "none", cs2: "none" },
                    { book: "Bet365", nba: "strong", ncaab: "partial", nfl: "strong", ncaaf: "partial", nhl: "partial", ncaah: "none", mlb: "soon", soccer: "partial", tennis: "none", mma: "none", cs2: "none" },
                    { book: "Caesars", nba: "strong", ncaab: "partial", nfl: "strong", ncaaf: "partial", nhl: "partial", ncaah: "none", mlb: "soon", soccer: "partial", tennis: "none", mma: "none", cs2: "none" },
                    { book: "Kalshi", nba: "strong", ncaab: "partial", nfl: "strong", ncaaf: "none", nhl: "partial", ncaah: "none", mlb: "partial", soccer: "strong", tennis: "none", mma: "none", cs2: "none" },
                    { book: "BetOnline", nba: "none", ncaab: "none", nfl: "none", ncaaf: "none", nhl: "none", ncaah: "none", mlb: "none", soccer: "none", tennis: "none", mma: "strong", cs2: "none" },
                    { book: "1xBet", nba: "none", ncaab: "none", nfl: "none", ncaaf: "none", nhl: "none", ncaah: "none", mlb: "partial", soccer: "strong", tennis: "none", mma: "none", cs2: "strong" },
                    { book: "Polymarket", nba: "strong", ncaab: "strong", nfl: "strong", ncaaf: "strong", nhl: "strong", ncaah: "strong", mlb: "strong", soccer: "strong", tennis: "strong", mma: "none", cs2: "none" },
                  ].map((row) => (
                    <tr key={row.book} className="border-b border-white/[0.04]">
                      <td className="py-2.5 pr-4 font-mono text-white">{row.book}</td>
                      {[row.nba, row.ncaab, row.nfl, row.ncaaf, row.nhl, row.ncaah, row.mlb, row.soccer, row.tennis, row.mma, row.cs2].map((status, i) => (
                        <td key={i} className="py-2.5 pr-4">
                          {status === "none" ? (
                            <span className="text-[12px] font-mono text-zinc-700">—</span>
                          ) : (
                          <span className={`inline-flex items-center gap-1.5 text-[12px] font-mono ${
                            status === "strong"
                              ? "text-[#00FF88]"
                              : status === "partial"
                              ? "text-amber-400"
                              : "text-zinc-600"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              status === "strong"
                                ? "bg-[#00FF88]"
                                : status === "partial"
                                ? "bg-amber-400"
                                : "bg-zinc-700"
                            }`} />
                            {status === "strong" ? "Strong" : status === "partial" ? "Partial" : "Coming soon"}
                          </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SubHeading id="sub-props-coverage">Player props</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              Player prop lines vary by sport and sportsbook. NBA has the deepest prop coverage.
              We&apos;re actively working to expand prop coverage across all sports and books.
            </p>
            <div className="overflow-x-auto mb-10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Book</th>
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">NBA</th>
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">NCAAB</th>
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">NFL</th>
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">NCAAF</th>
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">NHL</th>
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">NCAAH</th>
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">MLB</th>
                    <th className="text-left py-2.5 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Soccer</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {[
                    { book: "FanDuel", nba: "strong", ncaab: "partial", nfl: "partial", ncaaf: "partial", nhl: "partial", ncaah: "soon", mlb: "soon", soccer: "none" },
                    { book: "DraftKings", nba: "strong", ncaab: "soon", nfl: "partial", ncaaf: "soon", nhl: "soon", ncaah: "soon", mlb: "soon", soccer: "none" },
                    { book: "Caesars", nba: "strong", ncaab: "soon", nfl: "partial", ncaaf: "soon", nhl: "soon", ncaah: "none", mlb: "soon", soccer: "none" },
                    { book: "Pinnacle", nba: "partial", ncaab: "soon", nfl: "partial", ncaaf: "partial", nhl: "soon", ncaah: "partial", mlb: "soon", soccer: "partial" },
                    { book: "Bet365", nba: "partial", ncaab: "soon", nfl: "partial", ncaaf: "soon", nhl: "soon", ncaah: "soon", mlb: "soon", soccer: "none" },
                    { book: "BetMGM", nba: "strong", ncaab: "none", nfl: "soon", ncaaf: "soon", nhl: "soon", ncaah: "none", mlb: "soon", soccer: "none" },
                  ].map((row) => (
                    <tr key={row.book} className="border-b border-white/[0.04]">
                      <td className="py-2.5 pr-4 font-mono text-white">{row.book}</td>
                      {[row.nba, row.ncaab, row.nfl, row.ncaaf, row.nhl, row.ncaah, row.mlb, row.soccer].map((status, i) => (
                        <td key={i} className="py-2.5 pr-4">
                          <span className={`inline-flex items-center gap-1.5 text-[12px] font-mono ${
                            status === "strong"
                              ? "text-[#00FF88]"
                              : status === "partial"
                              ? "text-amber-400"
                              : "text-zinc-600"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              status === "strong"
                                ? "bg-[#00FF88]"
                                : status === "partial"
                                ? "bg-amber-400"
                                : "bg-zinc-700"
                            }`} />
                            {status === "strong" ? "Strong" : status === "partial" ? "Partial" : "Coming soon"}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SubHeading>Legend</SubHeading>
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00FF88]" />
                <span className="text-[13px] text-zinc-400">Strong — reliable coverage for most games</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-[13px] text-zinc-400">Partial — available but may not cover all games</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-700" />
                <span className="text-[13px] text-zinc-400">Coming soon — actively being developed</span>
              </div>
            </div>

            <div className="rounded-lg bg-[#111113] border border-white/[0.06] p-5">
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Coverage is continuously improving. We add new sportsbooks, sports, and market types regularly.
                Seasonal sports (NFL, MLB, NCAAF) are available during their respective seasons.
                If you need specific coverage for your use case, reach out to{" "}
                <a href="mailto:david@wisesportsai.com" className="text-[#00FF88] hover:underline">
                  david@wisesportsai.com
                </a>.
              </p>
            </div>
          </section>

          {/* ─── Errors ────────────────────────────────────────────── */}
          <section id="errors" className="mb-20 scroll-mt-20">
            <SectionHeading>Error Codes</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-6">
              All errors return JSON with an error message.
            </p>

            <div className="overflow-x-auto mb-10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Code</th>
                    <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Status</th>
                    <th className="text-left py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {[
                    { code: 400, title: "Bad Request", description: "Invalid parameters or malformed request" },
                    { code: 401, title: "Unauthorized", description: "Missing or invalid API key" },
                    { code: 403, title: "Forbidden", description: "Insufficient tier for this endpoint" },
                    { code: 404, title: "Not Found", description: "Endpoint or resource not found" },
                    { code: 429, title: "Too Many Requests", description: "Rate limit exceeded" },
                    { code: 500, title: "Internal Server Error", description: "Server error, please retry" },
                    { code: 503, title: "Service Unavailable", description: "Rate limit system failure or server overload" },
                  ].map((error) => (
                    <tr key={error.code} className="border-b border-white/[0.04]">
                      <td className="py-2.5 pr-6 font-mono text-red-400">{error.code}</td>
                      <td className="py-2.5 pr-6 text-white">{error.title}</td>
                      <td className="py-2.5 text-zinc-500">{error.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SubHeading>Error response format</SubHeading>
            <CodeBlock
              language="json"
              code={`{
  "error": "Rate limit exceeded",
  "message": "You have exceeded your minute rate limit of 100 requests",
  "limit": "minute",
  "retryAfter": 42
}`}
            />
          </section>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-white/[0.06] text-sm text-zinc-600 font-sans">
            <p>
              Questions?{" "}
              <a
                href="mailto:david@wisesportsai.com"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                david@wisesportsai.com
              </a>
            </p>
          </div>
        </main>
      </div>

      {/* Search modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
          onClick={() => setSearchOpen(false)}
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search documentation"
            className="relative w-full max-w-lg bg-[#111113] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 border-b border-white/[0.06]">
              <MagnifyingGlass size={16} className="text-zinc-500 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchIndex(0); }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" && results.length > 0) {
                    e.preventDefault();
                    setSearchIndex(i => Math.min(i + 1, results.length - 1));
                  } else if (e.key === "ArrowUp" && results.length > 0) {
                    e.preventDefault();
                    setSearchIndex(i => Math.max(i - 1, 0));
                  } else if (e.key === "Enter" && results[searchIndex]) {
                    const r = results[searchIndex];
                    const target = r.subId || r.sectionId;
                    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
                    setSearchOpen(false);
                  }
                }}
                placeholder="Search docs..."
                className="flex-1 bg-transparent py-3.5 text-sm text-white placeholder-zinc-600 outline-none font-sans"
              />
              <kbd className="text-[10px] font-mono text-zinc-600 bg-white/[0.06] px-1.5 py-0.5 rounded">ESC</kbd>
            </div>
            {searchQuery.trim() && (
              <div className="max-h-72 overflow-y-auto py-2">
                {results.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-zinc-600 text-center font-sans">No results found</p>
                ) : (
                  results.map((r, i) => (
                    <button
                      key={r.subId || r.sectionId}
                      className={`w-full text-left px-4 py-2.5 flex items-center gap-2 text-sm transition-colors ${
                        i === searchIndex ? "bg-white/[0.06] text-white" : "text-zinc-400 hover:bg-white/[0.03]"
                      }`}
                      onClick={() => {
                        const target = r.subId || r.sectionId;
                        document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
                        setSearchOpen(false);
                      }}
                      onMouseEnter={() => setSearchIndex(i)}
                    >
                      {r.subLabel ? (
                        <>
                          <span className="text-[11px] font-mono text-zinc-600 shrink-0">{r.sectionLabel}</span>
                          <span className="text-zinc-700">&rsaquo;</span>
                          <span className="font-sans">{r.subLabel}</span>
                        </>
                      ) : (
                        <span className="font-sans">{r.sectionLabel}</span>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/[0.06] border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.1] transition-all duration-200 ${
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}
