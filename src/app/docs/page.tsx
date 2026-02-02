"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Copy,
  Check,
  Home,
  Key,
  Zap,
  Radio,
  BarChart3,
  Users,
  AlertCircle,
  BookOpen,
  TrendingUp,
  Target,
  Settings,
} from "lucide-react";

// Navigation sections
const sections = [
  { id: "getting-started", label: "Getting Started", icon: BookOpen },
  { id: "authentication", label: "Authentication", icon: Key },
  { id: "odds-api", label: "Odds API", icon: Zap },
  { id: "props-api", label: "Player Props API", icon: Users },
  { id: "scores-api", label: "Live Scores API", icon: BarChart3 },
  // { id: "analytics-api", label: "EV & Arbitrage", icon: TrendingUp },
  // { id: "picks-api", label: "Picks API", icon: Target },
  { id: "websocket", label: "WebSocket API", icon: Radio },
  { id: "account-api", label: "Account API", icon: Settings },
  { id: "rate-limits", label: "Rate Limits", icon: AlertCircle },
  { id: "errors", label: "Error Codes", icon: AlertCircle },
];

// Code block component with copy functionality
function CodeBlock({ code, language = "json" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden bg-[#0a0a0a] border border-white/10">
      <div className="flex items-center justify-between px-4 py-2 bg-[#111111] border-b border-white/5">
        <span className="text-xs font-mono text-zinc-500">{language}</span>
        <button
          onClick={handleCopy}
          className="text-zinc-500 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-zinc-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Endpoint component
function Endpoint({
  method,
  path,
  description,
  auth = true,
  tier,
}: {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  auth?: boolean;
  tier?: string;
}) {
  const methodColors = {
    GET: "bg-green-500/20 text-green-400 border-green-500/30",
    POST: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    PUT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <div className="p-4 rounded-lg bg-[#111111] border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <span
          className={`px-2 py-0.5 rounded text-xs font-mono font-medium border ${methodColors[method]}`}
        >
          {method}
        </span>
        <code className="text-sm font-mono text-[#00FF88]">{path}</code>
        {tier && (
          <span className="px-2 py-0.5 rounded text-xs font-mono bg-purple-500/20 text-purple-400 border border-purple-500/30">
            {tier}
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-400">{description}</p>
      {auth && (
        <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500">
          <Key className="w-3 h-3" />
          <span>Requires API Key</span>
        </div>
      )}
    </div>
  );
}

// Parameter table component
function ParamTable({
  params,
}: {
  params: { name: string; type: string; required: boolean; description: string }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-2 px-3 font-mono text-zinc-400">Parameter</th>
            <th className="text-left py-2 px-3 font-mono text-zinc-400">Type</th>
            <th className="text-left py-2 px-3 font-mono text-zinc-400">Required</th>
            <th className="text-left py-2 px-3 font-mono text-zinc-400">Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map((param) => (
            <tr key={param.name} className="border-b border-white/5">
              <td className="py-2 px-3 font-mono text-[#00FF88]">{param.name}</td>
              <td className="py-2 px-3 font-mono text-zinc-500">{param.type}</td>
              <td className="py-2 px-3">
                {param.required ? (
                  <span className="text-red-400">Yes</span>
                ) : (
                  <span className="text-zinc-500">No</span>
                )}
              </td>
              <td className="py-2 px-3 text-zinc-400">{param.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5 text-zinc-400" />
            </Link>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
            <span className="font-mono text-[#00FF88]">API Documentation</span>
          </div>
          {/* TODO: Uncomment when ready to launch
          <div className="flex items-center gap-4">
            <Link href="/register">
              <Button
                size="sm"
                className="bg-[#00FF88] hover:bg-[#00d4aa] text-[#0a0a0a] font-mono"
              >
                Get API Key
              </Button>
            </Link>
          </div>
          */}
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#0a0a0a] border-r border-white/5 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === section.id
                    ? "bg-[#00FF88]/10 text-[#00FF88]"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-64 p-8 max-w-4xl">
          {/* Getting Started */}
          <section id="getting-started" className="mb-16">
            <h1 className="text-3xl font-mono font-bold mb-4">API Documentation</h1>
            <p className="text-zinc-400 mb-8">
              Complete reference for the Owls Insight REST API and WebSocket streaming service.
            </p>

            <div className="p-4 rounded-lg bg-[#00FF88]/5 border border-[#00FF88]/20 mb-8">
              <h3 className="font-mono font-semibold text-[#00FF88] mb-2">Base URL</h3>
              <code className="text-sm font-mono text-white">https://api.owlsinsight.com</code>
            </div>

            <h2 className="text-xl font-mono font-bold mb-4">Quick Start</h2>
            <div className="space-y-4">
              <p className="text-zinc-400">1. Get your API key from the dashboard after signing up.</p>
              <p className="text-zinc-400">2. Include your API key in the Authorization header:</p>
              <CodeBlock
                language="bash"
                code={`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.owlsinsight.com/api/v1/nba/odds`}
              />
            </div>

            <h3 className="text-lg font-mono font-semibold mt-8 mb-3">Health Check</h3>
            <p className="text-zinc-400 mb-4">
              Verify the API is operational (no authentication required):
            </p>
            <CodeBlock
              language="bash"
              code={`curl https://api.owlsinsight.com/api/health`}
            />
          </section>

          {/* Authentication */}
          <section id="authentication" className="mb-16">
            <h2 className="text-2xl font-mono font-bold mb-4 flex items-center gap-2">
              <Key className="w-6 h-6 text-[#00FF88]" />
              Authentication
            </h2>
            <p className="text-zinc-400 mb-6">
              All API requests require authentication via an API key. Include your key in the
              Authorization header.
            </p>

            <h3 className="text-lg font-mono font-semibold mb-3">Header Format</h3>
            <CodeBlock language="http" code={`Authorization: Bearer YOUR_API_KEY`} />

            {/* TODO: Uncomment when auth is ready
            <h3 className="text-lg font-mono font-semibold mt-8 mb-3">Auth Endpoints</h3>
            <div className="space-y-3">
              <Endpoint
                method="POST"
                path="/api/v1/auth/register"
                description="Create a new account"
                auth={false}
              />
              <Endpoint
                method="POST"
                path="/api/v1/auth/login"
                description="Login and receive JWT token"
                auth={false}
              />
              <Endpoint
                method="POST"
                path="/api/v1/auth/generate-key"
                description="Generate a new API key (requires JWT)"
              />
              <Endpoint
                method="GET"
                path="/api/v1/auth/generate-key"
                description="List your API keys (requires JWT)"
              />
            </div>

            <h3 className="text-lg font-mono font-semibold mt-8 mb-3">Register Request</h3>
            <CodeBlock
              language="json"
              code={`{
  "email": "user@example.com",
  "password": "your_password",
  "name": "Your Name"
}`}
            />

            <h3 className="text-lg font-mono font-semibold mt-8 mb-3">Login Response</h3>
            <CodeBlock
              language="json"
              code={`{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "tier": "rookie"
  }
}`}
            />
            */}
          </section>

          {/* Odds API */}
          <section id="odds-api" className="mb-16">
            <h2 className="text-2xl font-mono font-bold mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-[#00FF88]" />
              Odds API
            </h2>
            <p className="text-zinc-400 mb-6">
              Real-time betting odds from 6 major sportsbooks: Pinnacle, FanDuel, DraftKings,
              BetMGM, Bet365, and Caesars.
            </p>

            <h3 className="text-lg font-mono font-semibold mb-3">Endpoints</h3>
            <div className="space-y-3 mb-8">
              <Endpoint
                method="GET"
                path="/api/v1/{sport}/odds"
                description="Get all odds for a sport (spreads, moneylines, totals)"
              />
              <Endpoint
                method="GET"
                path="/api/v1/{sport}/moneyline"
                description="Get moneyline odds only"
              />
              <Endpoint
                method="GET"
                path="/api/v1/{sport}/spreads"
                description="Get point spread odds only"
              />
              <Endpoint
                method="GET"
                path="/api/v1/{sport}/totals"
                description="Get over/under totals only"
              />
            </div>

            <h3 className="text-lg font-mono font-semibold mb-3">Supported Sports</h3>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {["nba", "ncaab", "nfl", "nhl", "ncaaf", "mlb"].map((sport) => (
                <div
                  key={sport}
                  className="p-3 rounded-lg bg-[#111111] border border-white/5 text-center"
                >
                  <code className="font-mono text-[#00FF88]">{sport}</code>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-mono font-semibold mb-3">Query Parameters</h3>
            <ParamTable
              params={[
                { name: "books", type: "string", required: false, description: "Comma-separated list of sportsbooks (pinnacle,fanduel,draftkings,betmgm,bet365,caesars)" },
                { name: "game_id", type: "string", required: false, description: "Filter to a specific game" },
              ]}
            />

            <h3 className="text-lg font-mono font-semibold mt-8 mb-3">Example Request</h3>
            <CodeBlock
              language="bash"
              code={`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.owlsinsight.com/api/v1/nba/odds?books=pinnacle,fanduel"`}
            />

            <h3 className="text-lg font-mono font-semibold mt-8 mb-3">Example Response</h3>
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

          {/* Props API */}
          <section id="props-api" className="mb-16">
            <h2 className="text-2xl font-mono font-bold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-[#00FF88]" />
              Player Props API
            </h2>
            <p className="text-zinc-400 mb-2">
              Player prop betting lines from multiple sportsbooks with alternate lines support.
            </p>
            <p className="text-sm text-purple-400 mb-6">
              Requires Rookie or MVP subscription tier.
            </p>

            <h3 className="text-lg font-mono font-semibold mb-3">Endpoints</h3>
            <div className="space-y-3 mb-8">
              <Endpoint
                method="GET"
                path="/api/v1/{sport}/props"
                description="Get aggregated player props from all books"
                tier="Rookie+"
              />
              <Endpoint
                method="GET"
                path="/api/v1/{sport}/props/bet365"
                description="Get Bet365 player props only"
                tier="Rookie+"
              />
              <Endpoint
                method="GET"
                path="/api/v1/{sport}/props/fanduel"
                description="Get FanDuel player props only"
                tier="Rookie+"
              />
              <Endpoint
                method="GET"
                path="/api/v1/{sport}/props/history"
                description="Get historical prop line movements"
                tier="Rookie+"
              />
              <Endpoint
                method="GET"
                path="/api/v1/props/stats"
                description="Get props cache statistics"
                tier="Rookie+"
              />
            </div>

            <h3 className="text-lg font-mono font-semibold mb-3">Query Parameters</h3>
            <ParamTable
              params={[
                { name: "game_id", type: "string", required: false, description: "Filter to a specific game" },
                { name: "player", type: "string", required: false, description: "Filter by player name (partial match)" },
                { name: "category", type: "string", required: false, description: "Filter by prop category" },
                { name: "books", type: "string", required: false, description: "Comma-separated list: pinnacle,bet365,fanduel,draftkings,caesars" },
              ]}
            />

            <h3 className="text-lg font-mono font-semibold mt-8 mb-3">Prop Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
              {[
                "points", "rebounds", "assists", "steals", "blocks", "threes_made",
                "pts_rebs_asts", "pts_rebs", "pts_asts", "rebs_asts",
                "passing_yards", "passing_tds", "rushing_yards", "rushing_tds",
                "receiving_yards", "receptions", "touchdowns",
                "goals", "hockey_assists", "hockey_points", "shots_on_goal",
              ].map((cat) => (
                <code key={cat} className="text-xs font-mono text-zinc-400 bg-[#111111] px-2 py-1 rounded">
                  {cat}
                </code>
              ))}
            </div>

            <h3 className="text-lg font-mono font-semibold mt-8 mb-3">Example Response</h3>
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
            },
            {
              "playerName": "LeBron James",
              "category": "rebounds",
              "line": 7.5,
              "overPrice": -110,
              "underPrice": -110
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
    "propsReturned": 156,
    "requestedBooks": ["pinnacle", "fanduel", "bet365", "draftkings", "caesars"]
  }
}`}
            />

            <h3 className="text-lg font-mono font-semibold mt-8 mb-3">Props History</h3>
            <p className="text-zinc-400 mb-4">
              Track line movements for a specific player prop over time.
            </p>
            <ParamTable
              params={[
                { name: "game_id", type: "string", required: true, description: "Game ID (e.g., nba:BOS@LAL-20260131)" },
                { name: "player", type: "string", required: true, description: "Player name" },
                { name: "category", type: "string", required: true, description: "Prop category (e.g., points)" },
                { name: "hours", type: "number", required: false, description: "Hours of history (1-168, default: since opening)" },
              ]}
            />
          </section>

          {/* Scores API */}
          <section id="scores-api" className="mb-16">
            <h2 className="text-2xl font-mono font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-[#00FF88]" />
              Live Scores API
            </h2>
            <p className="text-zinc-400 mb-6">
              Real-time game scores and status updates from ESPN.
            </p>

            <h3 className="text-lg font-mono font-semibold mb-3">Endpoints</h3>
            <div className="space-y-3 mb-8">
              <Endpoint
                method="GET"
                path="/api/v1/scores/live"
                description="Get live scores across all sports"
              />
              <Endpoint
                method="GET"
                path="/api/v1/{sport}/scores/live"
                description="Get live scores for a specific sport"
              />
            </div>

            <h3 className="text-lg font-mono font-semibold mt-8 mb-3">Example Response</h3>
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

          {/* TODO: Uncomment when EV & Arbitrage API is ready
          <section id="analytics-api" className="mb-16">
            <h2 className="text-2xl font-mono font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[#00FF88]" />
              EV & Arbitrage API
            </h2>
            <p className="text-zinc-400 mb-6">
              Expected value calculations and arbitrage opportunity detection across sportsbooks.
            </p>

            <h3 className="text-lg font-mono font-semibold mb-3">Endpoints</h3>
            <div className="space-y-3 mb-8">
              <Endpoint
                method="GET"
                path="/api/v1/{sport}/ev"
                description="Get expected value opportunities for a sport"
              />
              <Endpoint
                method="GET"
                path="/api/odds/ev/history"
                description="Get historical EV data"
              />
              <Endpoint
                method="GET"
                path="/api/v1/{sport}/arbitrage"
                description="Get arbitrage opportunities for a sport"
              />
              <Endpoint
                method="GET"
                path="/api/odds/history"
                description="Get historical odds data for a specific event"
              />
              <Endpoint
                method="GET"
                path="/api/odds/analytics"
                description="Get line movement analytics and sharp indicators"
              />
            </div>

            <p className="text-sm text-zinc-500 mb-4">
              Supported sports: nba, ncaab, nfl, nhl, ncaaf (MLB not yet supported for EV/arbitrage)
            </p>

            <h3 className="text-lg font-mono font-semibold mt-8 mb-3">EV Response Example</h3>
            <CodeBlock
              language="json"
              code={`{
  "success": true,
  "sport": "nba",
  "opportunities": [
    {
      "event_id": "nba:BOS@LAL-20260131",
      "market": "spreads",
      "side": "away",
      "team": "Boston Celtics",
      "book": "draftkings",
      "price": -105,
      "point": 3.5,
      "pinnacle_price": -110,
      "ev_percent": 2.4,
      "kelly_fraction": 0.048
    }
  ],
  "timestamp": "2026-01-31T18:30:00.000Z"
}`}
            />

            <h3 className="text-lg font-mono font-semibold mt-8 mb-3">Arbitrage Response Example</h3>
            <CodeBlock
              language="json"
              code={`{
  "success": true,
  "sport": "nba",
  "arbitrages": [
    {
      "event_id": "nba:BOS@LAL-20260131",
      "market": "h2h",
      "profit_percent": 1.2,
      "legs": [
        { "book": "fanduel", "side": "home", "price": 145 },
        { "book": "draftkings", "side": "away", "price": -135 }
      ],
      "stake_allocation": {
        "home": 0.425,
        "away": 0.575
      }
    }
  ],
  "timestamp": "2026-01-31T18:30:00.000Z"
}`}
            />
          </section>
          */}

          {/* TODO: Uncomment when Picks API is ready
          <section id="picks-api" className="mb-16">
            <h2 className="text-2xl font-mono font-bold mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-[#00FF88]" />
              Picks API
            </h2>
            <p className="text-zinc-400 mb-6">
              Save, manage, and track your betting picks. Get suggested picks based on EV and arbitrage analysis.
            </p>

            <h3 className="text-lg font-mono font-semibold mb-3">Endpoints</h3>
            <div className="space-y-3 mb-8">
              <Endpoint
                method="GET"
                path="/api/v1/{sport}/picks/suggest"
                description="Get AI-suggested picks based on EV and line movement"
              />
              <Endpoint
                method="GET"
                path="/api/v1/picks"
                description="List all your saved picks"
              />
              <Endpoint
                method="POST"
                path="/api/v1/picks"
                description="Create a new pick"
              />
              <Endpoint
                method="DELETE"
                path="/api/v1/picks/{id}"
                description="Delete a saved pick"
              />
            </div>

            <h3 className="text-lg font-mono font-semibold mt-8 mb-3">Create Pick Request</h3>
            <CodeBlock
              language="json"
              code={`{
  "event_id": "nba:BOS@LAL-20260131",
  "market": "spreads",
  "side": "away",
  "book": "pinnacle",
  "price": -110,
  "point": 3.5,
  "stake": 100,
  "notes": "Sharp line movement detected"
}`}
            />
          </section>
          */}

          {/* WebSocket API */}
          <section id="websocket" className="mb-16">
            <h2 className="text-2xl font-mono font-bold mb-4 flex items-center gap-2">
              <Radio className="w-6 h-6 text-[#00FF88]" />
              WebSocket API
            </h2>
            <p className="text-zinc-400 mb-2">
              Real-time streaming updates for odds, scores, and player props.
            </p>
            <p className="text-sm text-purple-400 mb-6">
              Requires Rookie or MVP subscription tier.
            </p>

            <h3 className="text-lg font-mono font-semibold mb-3">Connection</h3>
            <CodeBlock
              language="javascript"
              code={`import { io } from "socket.io-client";

const socket = io("wss://api.owlsinsight.com", {
  query: { apiKey: "YOUR_API_KEY" },
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected to Owls Insight");
});

socket.on("connect_error", (error) => {
  console.error("Connection failed:", error.message);
});`}
            />

            <h3 className="text-lg font-mono font-semibold mt-8 mb-3">Events</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#111111] border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-green-500/20 text-green-400 border border-green-500/30">
                    EVENT
                  </span>
                  <code className="font-mono text-[#00FF88]">odds-update</code>
                </div>
                <p className="text-sm text-zinc-400">
                  Emitted every ~30 seconds with latest odds data. Payload contains all sports with active events.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#111111] border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-green-500/20 text-green-400 border border-green-500/30">
                    EVENT
                  </span>
                  <code className="font-mono text-[#00FF88]">scores-update</code>
                </div>
                <p className="text-sm text-zinc-400">
                  Emitted every ~3 seconds during live games with current scores.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#111111] border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-green-500/20 text-green-400 border border-green-500/30">
                    EVENT
                  </span>
                  <code className="font-mono text-[#00FF88]">props-update</code>
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    Rookie+
                  </span>
                </div>
                <p className="text-sm text-zinc-400">
                  Emitted every ~45 seconds with aggregated player props from all books.
                </p>
              </div>
            </div>

            <h3 className="text-lg font-mono font-semibold mt-8 mb-3">Subscribing to Events</h3>
            <CodeBlock
              language="javascript"
              code={`// Listen to odds updates
socket.on("odds-update", (data) => {
  console.log("NBA games:", data.sports.nba?.length || 0);
  console.log("NFL games:", data.sports.nfl?.length || 0);

  // Access individual games
  data.sports.nba?.forEach(game => {
    console.log(\`\${game.away_team} @ \${game.home_team}\`);
    game.bookmakers.forEach(book => {
      console.log(\`  \${book.key}: \${book.markets[0]?.outcomes[0]?.price}\`);
    });
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

            <h3 className="text-lg font-mono font-semibold mt-8 mb-3">Subscription Filtering</h3>
            <p className="text-zinc-400 mb-4">
              You can filter which sports and markets you receive updates for:
            </p>
            <CodeBlock
              language="javascript"
              code={`// Subscribe to specific sports only
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

          {/* Account API */}
          <section id="account-api" className="mb-16">
            <h2 className="text-2xl font-mono font-bold mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-[#00FF88]" />
              Account API
            </h2>
            <p className="text-zinc-400 mb-6">
              Manage your subscription and view usage statistics.
            </p>

            <h3 className="text-lg font-mono font-semibold mb-3">Endpoints</h3>
            <div className="space-y-3 mb-8">
              <Endpoint
                method="GET"
                path="/api/v1/subscription"
                description="Get your current subscription details"
              />
              <Endpoint
                method="PUT"
                path="/api/v1/subscription"
                description="Update your subscription tier"
              />
              <Endpoint
                method="GET"
                path="/api/v1/usage"
                description="Get your API usage statistics"
              />
            </div>

            <h3 className="text-lg font-mono font-semibold mt-8 mb-3">Subscription Response</h3>
            <CodeBlock
              language="json"
              code={`{
  "success": true,
  "subscription": {
    "tier": "rookie",
    "status": "active",
    "currentPeriodStart": "2026-01-01T00:00:00.000Z",
    "currentPeriodEnd": "2026-02-01T00:00:00.000Z",
    "limits": {
      "requestsPerMonth": 50000,
      "requestsPerMinute": 100,
      "websocketConnections": 2,
      "historyDays": 30
    }
  }
}`}
            />

            <h3 className="text-lg font-mono font-semibold mt-8 mb-3">Usage Response</h3>
            <CodeBlock
              language="json"
              code={`{
  "success": true,
  "date": "2026-01-31",
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
        "failedRequests": 34,
        "avgResponseTime": 24
      },
      "currentRateLimits": {
        "minute": { "count": 45, "limit": 100 },
        "month": { "count": 12340, "limit": 50000 }
      }
    }
  ]
}`}
            />
          </section>

          {/* Rate Limits */}
          <section id="rate-limits" className="mb-16">
            <h2 className="text-2xl font-mono font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-[#00FF88]" />
              Rate Limits
            </h2>
            <p className="text-zinc-400 mb-6">
              Rate limits are applied per API key. Limits vary by subscription tier.
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 font-mono text-zinc-400">Tier</th>
                    <th className="text-left py-3 px-4 font-mono text-zinc-400">Requests/Month</th>
                    <th className="text-left py-3 px-4 font-mono text-zinc-400">Requests/Minute</th>
                    <th className="text-left py-3 px-4 font-mono text-zinc-400">WebSocket</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-mono text-white">Bench</td>
                    <td className="py-3 px-4 text-zinc-400">500</td>
                    <td className="py-3 px-4 text-zinc-400">10</td>
                    <td className="py-3 px-4 text-zinc-500">Not available</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-mono text-white">Rookie</td>
                    <td className="py-3 px-4 text-zinc-400">50,000</td>
                    <td className="py-3 px-4 text-zinc-400">100</td>
                    <td className="py-3 px-4 text-zinc-400">2 connections</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-mono text-white">MVP</td>
                    <td className="py-3 px-4 text-zinc-400">500,000</td>
                    <td className="py-3 px-4 text-zinc-400">500</td>
                    <td className="py-3 px-4 text-zinc-400">10 connections</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-mono font-semibold mb-3">Rate Limit Headers</h3>
            <p className="text-zinc-400 mb-4">
              Each response includes headers showing your current rate limit status:
            </p>
            <CodeBlock
              language="http"
              code={`X-RateLimit-Limit-Minute: 100
X-RateLimit-Remaining-Minute: 87
X-RateLimit-Limit-Month: 50000
X-RateLimit-Remaining-Month: 49234`}
            />
          </section>

          {/* Error Codes */}
          <section id="errors" className="mb-16">
            <h2 className="text-2xl font-mono font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-[#00FF88]" />
              Error Codes
            </h2>
            <p className="text-zinc-400 mb-6">
              All errors return a JSON response with an error message.
            </p>

            <div className="space-y-4">
              {[
                { code: 400, title: "Bad Request", description: "Invalid parameters or malformed request" },
                { code: 401, title: "Unauthorized", description: "Missing or invalid API key" },
                { code: 403, title: "Forbidden", description: "Valid API key but insufficient tier for this endpoint" },
                { code: 404, title: "Not Found", description: "Endpoint or resource not found" },
                { code: 429, title: "Too Many Requests", description: "Rate limit exceeded" },
                { code: 500, title: "Internal Server Error", description: "Server error, please retry" },
                { code: 503, title: "Service Unavailable", description: "Service temporarily unavailable" },
              ].map((error) => (
                <div key={error.code} className="p-4 rounded-lg bg-[#111111] border border-white/5">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-red-500/20 text-red-400 border border-red-500/30">
                      {error.code}
                    </span>
                    <span className="font-mono font-semibold">{error.title}</span>
                  </div>
                  <p className="text-sm text-zinc-400">{error.description}</p>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-mono font-semibold mt-8 mb-3">Error Response Format</h3>
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
          <div className="mt-16 pt-8 border-t border-white/10 text-center text-sm text-zinc-500">
            <p>
              Questions?{" "}
              <a
                href="mailto:support@owlsinsight.com"
                className="text-[#00FF88] hover:text-[#00d4aa] transition-colors"
              >
                Contact Support
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
