"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Copy, Check } from "@phosphor-icons/react";

// Navigation sections
const sections = [
  { id: "getting-started", label: "Getting Started" },
  { id: "authentication", label: "Authentication" },
  { id: "odds-api", label: "Odds" },
  { id: "props-api", label: "Player Props" },
  { id: "scores-api", label: "Live Scores" },
  { id: "kalshi-api", label: "Kalshi Markets" },
  { id: "history-api", label: "Historical Data" },
  { id: "websocket", label: "WebSocket" },
  { id: "usage-api", label: "Usage" },
  { id: "rate-limits", label: "Rate Limits" },
  { id: "coverage", label: "Coverage" },
  { id: "errors", label: "Errors" },
];

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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-mono font-bold text-white mb-1 tracking-tight">
      {children}
    </h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-mono font-semibold text-zinc-300 mt-10 mb-3 uppercase tracking-wider">
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

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
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
        </div>
      </header>

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside className="fixed left-0 top-14 bottom-0 w-56 border-r border-white/[0.04] overflow-y-auto">
          <nav className="py-6 px-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600 mb-3 px-2">Reference</p>
            <div className="space-y-0.5">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`block px-2 py-1.5 rounded text-[13px] transition-colors ${
                    activeSection === section.id
                      ? "text-white bg-white/[0.04]"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {section.label}
                </a>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-56 px-12 py-12 max-w-3xl">

          {/* ─── Getting Started ────────────────────────────────────── */}
          <section id="getting-started" className="mb-20">
            <h1 className="text-3xl font-mono font-bold tracking-tight text-white mb-2">
              API Reference
            </h1>
            <p className="text-zinc-500 text-sm font-sans leading-relaxed mb-10">
              REST API and WebSocket streaming for real-time sports betting odds from major sportsbooks and Kalshi prediction markets.
            </p>

            <div className="rounded-lg bg-[#111113] border border-white/[0.06] px-5 py-4 mb-10">
              <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Base URL</p>
              <code className="text-sm font-mono text-white">https://api.owlsinsight.com</code>
            </div>

            <SubHeading>Quick start</SubHeading>
            <ol className="text-sm text-zinc-400 font-sans space-y-2 mb-6 list-decimal list-inside">
              <li>Create an account and get your API key from the dashboard.</li>
              <li>Include the key in every request via the <code className="text-[13px] font-mono text-zinc-300">Authorization</code> header.</li>
            </ol>
            <CodeBlock
              language="bash"
              code={`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.owlsinsight.com/api/v1/nba/odds`}
            />

            <SubHeading>Health check</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              No authentication required.
            </p>
            <CodeBlock
              language="bash"
              code={`curl https://api.owlsinsight.com/api/health`}
            />
          </section>

          {/* ─── Authentication ─────────────────────────────────────── */}
          <section id="authentication" className="mb-20">
            <SectionHeading>Authentication</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-6">
              All endpoints require an API key in the Authorization header.
            </p>

            <CodeBlock language="http" code={`Authorization: Bearer YOUR_API_KEY`} />
          </section>

          {/* ─── Odds API ──────────────────────────────────────────── */}
          <section id="odds-api" className="mb-20">
            <SectionHeading>Odds API</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-6">
              Real-time betting odds from Pinnacle, FanDuel, DraftKings, BetMGM, Bet365, Caesars, and Kalshi.
            </p>

            <SubHeading>Endpoints</SubHeading>
            <div className="mb-8">
              <Endpoint method="GET" path="/api/v1/{sport}/odds" description="All odds for a sport (spreads, moneylines, totals)" />
              <Endpoint method="GET" path="/api/v1/{sport}/moneyline" description="Moneyline odds only" />
              <Endpoint method="GET" path="/api/v1/{sport}/spreads" description="Point spread odds only" />
              <Endpoint method="GET" path="/api/v1/{sport}/totals" description="Over/under totals only" />
            </div>

            <SubHeading>Sports</SubHeading>
            <div className="flex flex-wrap gap-2 mb-8">
              {["nba", "ncaab", "nfl", "nhl", "ncaaf", "mlb"].map((sport) => (
                <code key={sport} className="text-[13px] font-mono text-zinc-300 bg-white/[0.04] px-2.5 py-1 rounded">
                  {sport}
                </code>
              ))}
            </div>

            <SubHeading>Sportsbooks</SubHeading>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Key</th>
                    <th className="text-left py-2 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Name</th>
                    <th className="text-left py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {[
                    { key: "pinnacle", name: "Pinnacle", notes: "Sharp book, market-making reference" },
                    { key: "fanduel", name: "FanDuel", notes: "US retail leader, full props" },
                    { key: "draftkings", name: "DraftKings", notes: "Full market coverage" },
                    { key: "betmgm", name: "BetMGM", notes: "Vegas-backed lines" },
                    { key: "bet365", name: "Bet365", notes: "Global market leader" },
                    { key: "caesars", name: "Caesars", notes: "Casino heritage" },
                    { key: "kalshi", name: "Kalshi", notes: "CFTC-regulated prediction exchange" },
                  ].map((book) => (
                    <tr key={book.key} className="border-b border-white/[0.04]">
                      <td className="py-2.5 pr-6 font-mono text-white">{book.key}</td>
                      <td className="py-2.5 pr-6 text-zinc-300">{book.name}</td>
                      <td className="py-2.5 text-zinc-500">{book.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SubHeading>Parameters</SubHeading>
            <ParamTable
              params={[
                { name: "books", type: "string", required: false, description: "Comma-separated list of sportsbooks to include" },
                { name: "game_id", type: "string", required: false, description: "Filter to a specific game" },
              ]}
            />

            <SubHeading>Example request</SubHeading>
            <CodeBlock
              language="bash"
              code={`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/nba/odds?books=pinnacle,fanduel"`}
            />

            <SubHeading>Response</SubHeading>
            <CodeBlock
              language="json"
              code={`{
  "success": true,
  "timestamp": "2026-01-31T18:30:00.000Z",
  "sport": "nba",
  "events": [
    {
      "id": "nba:BOS@LAL-20260131",
      "commence_time": "2026-01-31T20:00:00Z",
      "home_team": "Los Angeles Lakers",
      "away_team": "Boston Celtics",
      "bookmakers": [
        {
          "key": "pinnacle",
          "title": "Pinnacle",
          "last_update": "2026-01-31T18:29:45Z",
          "markets": [
            {
              "key": "h2h",
              "outcomes": [
                { "name": "Los Angeles Lakers", "price": -150 },
                { "name": "Boston Celtics", "price": 130 }
              ]
            },
            {
              "key": "spreads",
              "outcomes": [
                { "name": "Los Angeles Lakers", "price": -110, "point": -3.5 },
                { "name": "Boston Celtics", "price": -110, "point": 3.5 }
              ]
            },
            {
              "key": "totals",
              "outcomes": [
                { "name": "Over", "price": -110, "point": 224.5 },
                { "name": "Under", "price": -110, "point": 224.5 }
              ]
            }
          ]
        }
      ]
    }
  ]
}`}
            />
          </section>

          {/* ─── Props API ─────────────────────────────────────────── */}
          <section id="props-api" className="mb-20">
            <SectionHeading>Player Props API</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-2">
              Player prop betting lines from multiple sportsbooks with alternate lines support.
            </p>
            <p className="text-sm mb-6">
              <TierBadge tier="Rookie+" />
            </p>

            <SubHeading>Endpoints</SubHeading>
            <div className="mb-8">
              <Endpoint method="GET" path="/api/v1/{sport}/props" description="Aggregated player props from all books" tier="Rookie+" />
              <Endpoint method="GET" path="/api/v1/{sport}/props/bet365" description="Bet365 player props only" tier="Rookie+" />
              <Endpoint method="GET" path="/api/v1/{sport}/props/fanduel" description="FanDuel player props only" tier="Rookie+" />
              <Endpoint method="GET" path="/api/v1/{sport}/props/history" description="Historical prop line movements" tier="Rookie+" />
              <Endpoint method="GET" path="/api/v1/props/stats" description="Props cache statistics" tier="Rookie+" />
            </div>

            <SubHeading>Parameters</SubHeading>
            <ParamTable
              params={[
                { name: "game_id", type: "string", required: false, description: "Filter to a specific game" },
                { name: "player", type: "string", required: false, description: "Filter by player name (partial match)" },
                { name: "category", type: "string", required: false, description: "Filter by prop category" },
                { name: "books", type: "string", required: false, description: "Comma-separated: pinnacle, fanduel, draftkings, betmgm, bet365, caesars" },
              ]}
            />

            <SubHeading>Prop categories</SubHeading>
            <div className="flex flex-wrap gap-1.5 mb-8">
              {[
                "points", "rebounds", "assists", "steals", "blocks", "threes_made",
                "pts_rebs_asts", "pts_rebs", "pts_asts", "rebs_asts",
                "passing_yards", "passing_tds", "rushing_yards", "rushing_tds",
                "receiving_yards", "receptions", "touchdowns",
                "goals", "hockey_assists", "hockey_points", "shots_on_goal",
              ].map((cat) => (
                <code key={cat} className="text-[12px] font-mono text-zinc-500 bg-white/[0.03] px-2 py-0.5 rounded">
                  {cat}
                </code>
              ))}
            </div>

            <SubHeading>Response</SubHeading>
            <CodeBlock
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
          <section id="scores-api" className="mb-20">
            <SectionHeading>Live Scores API</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-6">
              Real-time game scores and status updates.
            </p>

            <SubHeading>Endpoints</SubHeading>
            <div className="mb-8">
              <Endpoint method="GET" path="/api/v1/scores/live" description="Live scores across all sports" />
              <Endpoint method="GET" path="/api/v1/{sport}/scores/live" description="Live scores for a specific sport" />
            </div>

            <SubHeading>Response</SubHeading>
            <CodeBlock
              language="json"
              code={`{
  "success": true,
  "sport": "nba",
  "timestamp": "2026-01-31T20:15:00.000Z",
  "count": 2,
  "events": [
    {
      "id": "401584721",
      "name": "Boston Celtics at Los Angeles Lakers",
      "shortName": "BOS @ LAL",
      "status": {
        "type": "in",
        "period": 3,
        "clock": "8:42",
        "displayClock": "8:42 - 3rd"
      },
      "homeTeam": {
        "id": "13",
        "name": "Lakers",
        "abbreviation": "LAL",
        "score": 78
      },
      "awayTeam": {
        "id": "2",
        "name": "Celtics",
        "abbreviation": "BOS",
        "score": 82
      },
      "venue": "Crypto.com Arena"
    }
  ]
}`}
            />
          </section>

          {/* ─── Kalshi Markets API ──────────────────────────────────── */}
          <section id="kalshi-api" className="mb-20">
            <SectionHeading>Kalshi Markets API</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-6">
              Raw prediction market data from Kalshi, a CFTC-regulated event contract exchange.
              Returns full market objects with 50+ fields including liquidity, open interest, volume,
              order book depth, settlement rules, and price history.
            </p>

            <SubHeading>Endpoints</SubHeading>
            <div className="mb-8">
              <Endpoint method="GET" path="/api/v1/kalshi/{sport}/markets" description="Prediction markets for a sport (game outcomes, spreads, totals)" />
              <Endpoint method="GET" path="/api/v1/kalshi/series/{seriesTicker}/markets" description="Markets for any Kalshi series ticker (Super Bowl, MVP, specials)" />
              <Endpoint method="GET" path="/api/v1/kalshi/series" description="List all known series tickers and sport mappings" />
            </div>

            <SubHeading>Sports</SubHeading>
            <div className="flex flex-wrap gap-2 mb-8">
              {["nba", "ncaab", "nfl", "nhl", "mlb"].map((sport) => (
                <code key={sport} className="text-[13px] font-mono text-zinc-300 bg-white/[0.04] px-2.5 py-1 rounded">
                  {sport}
                </code>
              ))}
            </div>

            <SubHeading>Series tickers</SubHeading>
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
            <CodeBlock
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
            <CodeBlock
              language="json"
              code={`{
  "sport_series": [
    { "sport": "nba", "series_ticker": "KXNBAGAME" },
    { "sport": "ncaab", "series_ticker": "KXNCAAMBGAME" },
    { "sport": "nfl", "series_ticker": "KXNFLGAME" },
    { "sport": "mlb", "series_ticker": "KXMLBGAME" }
  ],
  "special_series": [
    { "series_ticker": "KXSB", "description": "Big Game / Championship Winner", "sport": "nfl" },
    { "series_ticker": "KXNFLSPREAD", "description": "NFL Game Spreads", "sport": "nfl" },
    { "series_ticker": "KXNFLTOTAL", "description": "NFL Game Totals", "sport": "nfl" },
    { "series_ticker": "KXNFLSBMVP", "description": "Big Game MVP", "sport": "nfl" }
  ],
  "all_known_tickers": [
    "KXNBAGAME", "KXNCAAMBGAME", "KXNFLGAME", "KXNHLGAME", "KXMLBGAME"
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
          </section>

          {/* ─── Historical Data API ───────────────────────────────── */}
          <section id="history-api" className="mb-20">
            <SectionHeading>Historical Data API</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-2">
              Archived odds and props snapshots for completed games. Data is archived automatically when games finish.
            </p>
            <p className="text-sm mb-6">
              <TierBadge tier="MVP" />
            </p>

            <SubHeading>Endpoints</SubHeading>
            <div className="mb-8">
              <Endpoint method="GET" path="/api/v1/history/games" description="List archived games with filtering and pagination" tier="MVP" />
              <Endpoint method="GET" path="/api/v1/history/odds" description="Historical odds snapshots for an archived game" tier="MVP" />
              <Endpoint method="GET" path="/api/v1/history/props" description="Historical props snapshots for an archived game" tier="MVP" />
            </div>

            <SubHeading>/history/games parameters</SubHeading>
            <ParamTable
              params={[
                { name: "sport", type: "string", required: false, description: "Filter by sport (nba, ncaab, nfl, nhl, ncaaf, mlb)" },
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
                { name: "limit", type: "number", required: false, description: "Max results (1-5000, default 1000)" },
              ]}
            />

            <SubHeading>/history/props parameters</SubHeading>
            <ParamTable
              params={[
                { name: "eventId", type: "string", required: true, description: "Game identifier from /history/games" },
                { name: "playerName", type: "string", required: false, description: "Filter by player name" },
                { name: "propType", type: "string", required: false, description: "Filter by prop type (points, rebounds, etc.)" },
                { name: "book", type: "string", required: false, description: "Filter by sportsbook" },
                { name: "limit", type: "number", required: false, description: "Max results (1-5000, default 1000)" },
              ]}
            />

            <SubHeading>Games response</SubHeading>
            <CodeBlock
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
        "propsSnapshots": 41650
      }
    ],
    "pagination": { "total": 602, "limit": 50, "offset": 0 }
  }
}`}
            />

            <SubHeading>Odds snapshots response</SubHeading>
            <CodeBlock
              language="json"
              code={`{
  "success": true,
  "data": {
    "eventId": "nba:Los Angeles Clippers@Sacramento Kings-20260207",
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
    "limit": 1000
  }
}`}
            />

            <SubHeading>Props snapshots response</SubHeading>
            <CodeBlock
              language="json"
              code={`{
  "success": true,
  "data": {
    "eventId": "nba:Los Angeles Clippers@Sacramento Kings-20260207",
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
    "limit": 1000
  }
}`}
            />
          </section>

          {/* ─── WebSocket API ─────────────────────────────────────── */}
          <section id="websocket" className="mb-20">
            <SectionHeading>WebSocket API</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-2">
              Real-time streaming for odds, scores, and player props.
            </p>
            <p className="text-sm mb-6">
              <TierBadge tier="Rookie+" />
            </p>

            <SubHeading>Connection</SubHeading>
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

            <SubHeading>Events</SubHeading>
            <div className="space-y-0 mb-8">
              {[
                { name: "odds-update", description: "Latest odds data, emitted every ~30 seconds", tier: undefined },
                { name: "scores-update", description: "Current scores during live games, every ~3 seconds", tier: undefined },
                { name: "props-update", description: "Aggregated player props from all books, every ~45 seconds", tier: "Rookie+" },
              ].map((event) => (
                <div key={event.name} className="flex items-start gap-3 py-3 border-b border-white/[0.04]">
                  <code className="text-[13px] font-mono text-white shrink-0">{event.name}</code>
                  <p className="text-sm text-zinc-500 flex-1">{event.description}</p>
                  {event.tier && <TierBadge tier={event.tier} className="shrink-0" />}
                </div>
              ))}
            </div>

            <SubHeading>Subscribing to events</SubHeading>
            <CodeBlock
              language="javascript"
              code={`// Listen to odds updates
socket.on("odds-update", (data) => {
  console.log("NBA games:", data.sports.nba?.length || 0);
  data.sports.nba?.forEach(game => {
    console.log(\`\${game.away_team} @ \${game.home_team}\`);
  });
});

// Listen to live scores
socket.on("scores-update", (data) => {
  data.sports.nba?.forEach(game => {
    console.log(\`\${game.awayTeam.abbreviation} \${game.awayTeam.score} - \${game.homeTeam.score} \${game.homeTeam.abbreviation}\`);
  });
});

// Listen to player props (Rookie+ only)
socket.on("props-update", (data) => {
  console.log("Props games:", data.sports.nba?.length || 0);
});`}
            />

            <SubHeading>Filtering</SubHeading>
            <CodeBlock
              language="javascript"
              code={`// Subscribe to specific sports
socket.emit("subscribe", {
  sports: ["nba", "nfl"],
  markets: ["h2h", "spreads", "totals"]
});

// Subscribe to player props for specific sports
socket.emit("subscribe:props", {
  sports: ["nba"],
  categories: ["points", "rebounds", "assists"]
});`}
            />
          </section>

          {/* ─── Usage API ─────────────────────────────────────────── */}
          <section id="usage-api" className="mb-20">
            <SectionHeading>Usage API</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-6">
              Monitor API usage and rate limit status.
            </p>

            <SubHeading>Endpoint</SubHeading>
            <div className="mb-8">
              <Endpoint method="GET" path="/api/v1/usage" description="API usage statistics for today or a specific date" />
            </div>

            <SubHeading>Parameters</SubHeading>
            <ParamTable
              params={[
                { name: "date", type: "string", required: false, description: "Date in YYYY-MM-DD format (defaults to today)" },
                { name: "apiKeyId", type: "string", required: false, description: "Filter to a specific API key" },
              ]}
            />

            <SubHeading>Response</SubHeading>
            <CodeBlock
              language="json"
              code={`{
  "success": true,
  "date": "2026-02-01",
  "totals": {
    "totalRequests": 1234,
    "successfulRequests": 1200,
    "failedRequests": 34
  },
  "usage": [
    {
      "apiKeyId": "key_abc123",
      "keyName": "Production",
      "tier": "rookie",
      "stats": {
        "totalRequests": 1234,
        "successfulRequests": 1200,
        "failedRequests": 34
      },
      "currentRateLimits": {
        "minute": { "count": 45, "limit": 120, "remaining": 75 },
        "month": { "count": 12340, "limit": 75000, "remaining": 62660 }
      }
    }
  ]
}`}
            />
          </section>

          {/* ─── Rate Limits ───────────────────────────────────────── */}
          <section id="rate-limits" className="mb-20">
            <SectionHeading>Rate Limits</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-6">
              Rate limits are applied per API key. Limits vary by subscription tier.
            </p>

            <div className="overflow-x-auto mb-10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-2.5 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Tier</th>
                    <th className="text-left py-2.5 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Price</th>
                    <th className="text-left py-2.5 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Req/Month</th>
                    <th className="text-left py-2.5 pr-6 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">Req/Minute</th>
                    <th className="text-left py-2.5 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">WebSocket</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-2.5 pr-6 font-mono text-white">Bench</td>
                    <td className="py-2.5 pr-6 text-zinc-400">$9.99/mo</td>
                    <td className="py-2.5 pr-6 text-zinc-400">10,000</td>
                    <td className="py-2.5 pr-6 text-zinc-400">20</td>
                    <td className="py-2.5 text-zinc-600">REST only</td>
                  </tr>
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-2.5 pr-6 font-mono text-white">Rookie</td>
                    <td className="py-2.5 pr-6 text-zinc-400">$24.99/mo</td>
                    <td className="py-2.5 pr-6 text-zinc-400">75,000</td>
                    <td className="py-2.5 pr-6 text-zinc-400">120</td>
                    <td className="py-2.5 text-zinc-400">2 connections</td>
                  </tr>
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-2.5 pr-6 font-mono text-white">MVP</td>
                    <td className="py-2.5 pr-6 text-zinc-400">$49.99/mo</td>
                    <td className="py-2.5 pr-6 text-zinc-400">300,000</td>
                    <td className="py-2.5 pr-6 text-zinc-400">400</td>
                    <td className="py-2.5 text-zinc-400">5 connections</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <SubHeading>Tier features</SubHeading>
            <div className="space-y-4 mb-10">
              <div className="rounded-lg bg-[#111113] border border-white/[0.06] p-5">
                <p className="font-mono text-sm font-semibold text-white mb-2">Bench</p>
                <ul className="text-[13px] text-zinc-500 space-y-1">
                  <li>REST API only, odds/spreads/totals, live scores, 45-second delay</li>
                </ul>
              </div>
              <div className="rounded-lg bg-[#111113] border border-white/[0.06] p-5">
                <p className="font-mono text-sm font-semibold text-white mb-2">Rookie</p>
                <ul className="text-[13px] text-zinc-500 space-y-1">
                  <li>REST + WebSocket (2 connections), player props, historical odds & props, real-time data</li>
                </ul>
              </div>
              <div className="rounded-lg bg-[#111113] border border-purple-500/15 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-mono text-sm font-semibold text-white">MVP</p>
                  <span className="text-[10px] font-mono text-purple-400">Most Popular</span>
                </div>
                <ul className="text-[13px] text-zinc-500 space-y-1">
                  <li>REST + WebSocket (5 connections), 15 concurrent requests, full props + WebSocket streaming, full historical odds & props, real-time data</li>
                </ul>
              </div>
            </div>

            <SubHeading>Rate limit headers</SubHeading>
            <p className="text-sm text-zinc-500 font-sans mb-4">
              Every response includes headers with your current rate limit status.
            </p>
            <CodeBlock
              language="http"
              code={`X-RateLimit-Limit-Minute: 120
X-RateLimit-Remaining-Minute: 87
X-RateLimit-Limit-Month: 75000
X-RateLimit-Remaining-Month: 62340`}
            />
          </section>

          {/* ─── Coverage ──────────────────────────────────────────── */}
          <section id="coverage" className="mb-20">
            <SectionHeading>Coverage</SectionHeading>
            <p className="text-sm text-zinc-500 font-sans mb-6 leading-relaxed">
              We aggregate odds from multiple sportsbooks across multiple sports. Coverage varies by sport, book, and market type.
              We&apos;re continuously expanding coverage and improving data quality.
            </p>

            <SubHeading>Game odds</SubHeading>
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
                    <th className="text-left py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">NHL</th>
                    <th className="text-left py-2.5 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">MLB</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {[
                    { book: "Pinnacle", nba: "strong", ncaab: "partial", nfl: "strong", nhl: "strong", mlb: "strong" },
                    { book: "FanDuel", nba: "strong", ncaab: "strong", nfl: "strong", nhl: "strong", mlb: "strong" },
                    { book: "DraftKings", nba: "strong", ncaab: "strong", nfl: "strong", nhl: "strong", mlb: "strong" },
                    { book: "BetMGM", nba: "strong", ncaab: "partial", nfl: "strong", nhl: "partial", mlb: "soon" },
                    { book: "Bet365", nba: "strong", ncaab: "partial", nfl: "strong", nhl: "partial", mlb: "soon" },
                    { book: "Caesars", nba: "strong", ncaab: "partial", nfl: "strong", nhl: "partial", mlb: "soon" },
                    { book: "Kalshi", nba: "strong", ncaab: "partial", nfl: "strong", nhl: "partial", mlb: "partial" },
                  ].map((row) => (
                    <tr key={row.book} className="border-b border-white/[0.04]">
                      <td className="py-2.5 pr-4 font-mono text-white">{row.book}</td>
                      {[row.nba, row.ncaab, row.nfl, row.nhl, row.mlb].map((status, i) => (
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

            <SubHeading>Player props</SubHeading>
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
                    <th className="text-left py-2.5 font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-medium">NHL</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {[
                    { book: "FanDuel", nba: "strong", ncaab: "partial", nfl: "strong", nhl: "partial" },
                    { book: "DraftKings", nba: "strong", ncaab: "partial", nfl: "strong", nhl: "partial" },
                    { book: "Caesars", nba: "partial", ncaab: "soon", nfl: "partial", nhl: "soon" },
                    { book: "Bet365", nba: "partial", ncaab: "soon", nfl: "partial", nhl: "soon" },
                    { book: "Pinnacle", nba: "soon", ncaab: "soon", nfl: "soon", nhl: "soon" },
                    { book: "BetMGM", nba: "soon", ncaab: "soon", nfl: "soon", nhl: "soon" },
                  ].map((row) => (
                    <tr key={row.book} className="border-b border-white/[0.04]">
                      <td className="py-2.5 pr-4 font-mono text-white">{row.book}</td>
                      {[row.nba, row.ncaab, row.nfl, row.nhl].map((status, i) => (
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
          <section id="errors" className="mb-20">
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
                    { code: 503, title: "Service Unavailable", description: "Temporarily unavailable" },
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
    </div>
  );
}
