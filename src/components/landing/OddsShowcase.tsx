"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";

interface Outcome {
  name: string;
  price: number;
  point?: number | null;
}

interface Market {
  key: string;
  outcomes: Outcome[];
}

interface Bookmaker {
  key: string;
  title: string;
  markets: Market[];
}

interface OddsEvent {
  id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  status?: string;
  bookmakers: Bookmaker[];
}

interface GameOdds {
  eventId: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  books: BookOdds[];
}

interface BookOdds {
  key: string;
  name: string;
  spread?: { away: number; home: number; awayPrice: number; homePrice: number };
  moneyline?: { away: number; home: number; draw?: number };
  total?: { over: number; under: number; point: number };
}

type SportKey = "nba" | "nhl" | "soccer";

const SPORT_LABELS: Record<string, string> = {
  nba: "NBA",
  nhl: "NHL",
  soccer: "Soccer",
};

const BOOK_DISPLAY: Record<string, string> = {
  pinnacle: "Pinnacle",
  fanduel: "FanDuel",
  draftkings: "DraftKings",
  betmgm: "BetMGM",
  bet365: "Bet365",
  caesars: "Caesars",
  kalshi: "Kalshi",
  "1xbet": "1xBet",
};

// Only fetch 3 sports to keep landing page API load reasonable
const SPORT_FETCH_ORDER: SportKey[] = ["nba", "nhl", "soccer"];

function formatPrice(price: number): string {
  if (price >= 0) return `+${price}`;
  return `${price}`;
}

function formatSpread(point: number): string {
  if (point >= 0) return `+${point.toFixed(1)}`;
  return point.toFixed(1);
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function parseGamesFromResponse(data: Record<string, OddsEvent[]>): GameOdds[] {
  const eventMap = new Map<string, GameOdds>();

  for (const [, events] of Object.entries(data)) {
    if (!Array.isArray(events)) continue;
    for (const ev of events) {
      if (ev.status && ev.status !== "scheduled" && ev.status !== "pre") continue;

      const key = ev.id || `${ev.away_team}@${ev.home_team}-${ev.commence_time}`;
      if (!eventMap.has(key)) {
        eventMap.set(key, {
          eventId: key,
          homeTeam: ev.home_team,
          awayTeam: ev.away_team,
          startTime: ev.commence_time,
          books: [],
        });
      }

      const game = eventMap.get(key)!;
      for (const bk of ev.bookmakers || []) {
        if (game.books.some((b) => b.key === bk.key)) continue;

        const bookOdds: BookOdds = {
          key: bk.key,
          name: BOOK_DISPLAY[bk.key] || bk.title || bk.key,
        };

        for (const mkt of bk.markets || []) {
          if (mkt.key === "h2h") {
            const away = mkt.outcomes.find((o) => o.name === ev.away_team);
            const home = mkt.outcomes.find((o) => o.name === ev.home_team);
            const draw = mkt.outcomes.find((o) => o.name === "Draw");
            if (away && home) {
              bookOdds.moneyline = {
                away: Math.round(away.price),
                home: Math.round(home.price),
                draw: draw ? Math.round(draw.price) : undefined,
              };
            }
          }
          if (mkt.key === "spreads") {
            const away = mkt.outcomes.find((o) => o.name === ev.away_team);
            const home = mkt.outcomes.find((o) => o.name === ev.home_team);
            if (away?.point != null && home?.point != null) {
              bookOdds.spread = {
                away: away.point,
                home: home.point,
                awayPrice: Math.round(away.price),
                homePrice: Math.round(home.price),
              };
            }
          }
          if (mkt.key === "totals") {
            const over = mkt.outcomes.find((o) => o.name === "Over");
            const under = mkt.outcomes.find((o) => o.name === "Under");
            if (over?.point != null && under) {
              bookOdds.total = {
                over: Math.round(over.price),
                under: Math.round(under.price),
                point: over.point,
              };
            }
          }
        }

        if (bookOdds.moneyline || bookOdds.spread || bookOdds.total) {
          game.books.push(bookOdds);
        }
      }
    }
  }

  return Array.from(eventMap.values())
    .filter((g) => g.books.length >= 2)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}

function findBestOdds(games: GameOdds[]) {
  const best = new Map<string, { bestAwayML: string; bestHomeML: string; bestOver: string; bestUnder: string }>();

  for (const game of games) {
    let bestAwayML = "";
    let bestAwayVal = -Infinity;
    let bestHomeML = "";
    let bestHomeVal = -Infinity;
    let bestOver = "";
    let bestOverVal = -Infinity;
    let bestUnder = "";
    let bestUnderVal = -Infinity;

    for (const bk of game.books) {
      if (bk.moneyline) {
        if (bk.moneyline.away > bestAwayVal) {
          bestAwayVal = bk.moneyline.away;
          bestAwayML = bk.key;
        }
        if (bk.moneyline.home > bestHomeVal) {
          bestHomeVal = bk.moneyline.home;
          bestHomeML = bk.key;
        }
      }
      if (bk.total) {
        if (bk.total.over > bestOverVal) {
          bestOverVal = bk.total.over;
          bestOver = bk.key;
        }
        if (bk.total.under > bestUnderVal) {
          bestUnderVal = bk.total.under;
          bestUnder = bk.key;
        }
      }
    }

    best.set(game.eventId, { bestAwayML, bestHomeML, bestOver, bestUnder });
  }

  return best;
}

// Unified odds cell — tracks its own previous value via local ref
function OddsCell({
  value,
  isBest,
  defaultColor = "text-zinc-300",
}: {
  value: number | undefined;
  isBest: boolean;
  defaultColor?: string;
}) {
  const prevRef = useRef<number | undefined>(undefined);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    const prev = prevRef.current;
    if (prev !== undefined && value !== undefined && prev !== value) {
      setFlash(value > prev ? "up" : "down");
      const t = setTimeout(() => setFlash(null), 3000);
      return () => clearTimeout(t);
    }
  }, [value]);

  // Update ref after comparison
  useEffect(() => {
    prevRef.current = value;
  }, [value]);

  if (value === undefined) {
    return <span className="text-xs font-mono text-right text-zinc-700 tabular-nums">—</span>;
  }

  return (
    <span
      className={`text-xs font-mono text-right tabular-nums transition-colors ${
        flash === "up"
          ? "text-green-400"
          : flash === "down"
            ? "text-red-400"
            : isBest
              ? "text-[#00FF88]"
              : defaultColor
      }`}
    >
      {formatPrice(value)}
      {flash && (
        <span className={`ml-0.5 text-[10px] ${flash === "up" ? "text-green-400" : "text-red-400"}`}>
          {flash === "up" ? "▲" : "▼"}
        </span>
      )}
    </span>
  );
}

function GameCard({
  game,
  bestOdds,
  isSoccer,
}: {
  game: GameOdds;
  bestOdds: { bestAwayML: string; bestHomeML: string; bestOver: string; bestUnder: string };
  isSoccer: boolean;
}) {
  const displayBooks = game.books.slice(0, 5);

  return (
    <div className="rounded-xl bg-[#111111] border border-white/5 overflow-hidden card-hover">
      {/* Matchup header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-mono text-white font-semibold truncate">
            {game.awayTeam}
          </span>
          <span className="text-xs font-mono text-zinc-600 shrink-0 ml-2">
            {formatTime(game.startTime)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-mono text-white font-semibold truncate">
            @ {game.homeTeam}
          </span>
        </div>
      </div>

      {/* Odds table */}
      <div className="px-4 py-3">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 mb-2 text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
          <span>Book</span>
          {!isSoccer && <span className="text-right">Spread</span>}
          <span className="text-right">{isSoccer ? "1" : "ML"}</span>
          {isSoccer && <span className="text-right">X</span>}
          {isSoccer ? (
            <span className="text-right">2</span>
          ) : (
            <span className="text-right">Total</span>
          )}
        </div>

        {displayBooks.map((bk) => (
          <div
            key={bk.key}
            className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 py-1.5 border-t border-white/[0.03]"
          >
            <span className="text-xs text-zinc-500 truncate">{bk.name}</span>

            {!isSoccer && (
              <span className="text-xs font-mono text-right text-zinc-300 tabular-nums">
                {bk.spread ? (
                  <>
                    {formatSpread(bk.spread.away)}{" "}
                    <span className="text-zinc-500">
                      ({formatPrice(bk.spread.awayPrice)})
                    </span>
                  </>
                ) : (
                  <span className="text-zinc-700">—</span>
                )}
              </span>
            )}

            <OddsCell
              value={bk.moneyline?.away}
              isBest={bestOdds.bestAwayML === bk.key}
            />

            {isSoccer && (
              <OddsCell
                value={bk.moneyline?.draw}
                isBest={false}
              />
            )}

            {isSoccer ? (
              <OddsCell
                value={bk.moneyline?.home}
                isBest={bestOdds.bestHomeML === bk.key}
              />
            ) : (
              <span className="text-xs font-mono text-right tabular-nums">
                {bk.total ? (
                  <>
                    <span className="text-zinc-500">o</span>
                    <span className="text-zinc-400">{bk.total.point}</span>{" "}
                    <OddsCell
                      value={bk.total.over}
                      isBest={bestOdds.bestOver === bk.key}
                      defaultColor="text-zinc-400"
                    />
                  </>
                ) : (
                  <span className="text-zinc-700">—</span>
                )}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function OddsShowcase() {
  const [gamesBySport, setGamesBySport] = useState<Record<string, GameOdds[]>>({});
  const [activeSport, setActiveSport] = useState<SportKey | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOdds = useCallback(async () => {
    const results: Record<string, GameOdds[]> = {};

    await Promise.all(
      SPORT_FETCH_ORDER.map(async (sport) => {
        try {
          const res = await fetch(`/api/odds?sport=${sport}`);
          if (!res.ok) return;
          const json = await res.json();
          if (!json?.data || typeof json.data !== "object") return;
          const games = parseGamesFromResponse(json.data);
          if (games.length > 0) {
            results[sport] = games;
          }
        } catch {
          // skip
        }
      })
    );

    setGamesBySport(results);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchOdds();
    const interval = setInterval(fetchOdds, 60000);
    return () => clearInterval(interval);
  }, [fetchOdds]);

  // Set first available sport as active
  useEffect(() => {
    if (activeSport === null) {
      const first = SPORT_FETCH_ORDER.find((s) => (gamesBySport[s]?.length ?? 0) > 0);
      if (first) setActiveSport(first);
    }
  }, [gamesBySport, activeSport]);

  const availableSports = useMemo(
    () => SPORT_FETCH_ORDER.filter((s) => (gamesBySport[s]?.length ?? 0) > 0),
    [gamesBySport]
  );
  const currentGames = activeSport ? (gamesBySport[activeSport] || []).slice(0, 3) : [];
  const isSoccer = activeSport === "soccer";
  const bestOddsMap = useMemo(() => findBestOdds(currentGames), [currentGames]);

  if (isLoading) {
    return (
      <section id="odds" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <span className="text-sm font-mono text-zinc-600">Loading odds data...</span>
          </div>
        </div>
      </section>
    );
  }

  if (availableSports.length === 0) return null;

  return (
    <section id="odds" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00FF88]/20 bg-[#00FF88]/5 mb-6">
            <span className="text-xs font-mono text-[#00FF88]">LIVE ODDS</span>
          </div>
          <h2 className="text-4xl font-mono font-bold mb-4">
            Multi-Book{" "}
            <span className="text-[#00FF88] text-glow-green">Odds Comparison</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Compare pre-match odds across sportsbooks in real-time.
            Best prices highlighted in green.
          </p>
        </div>

        {/* Sport tabs */}
        {availableSports.length > 1 && (
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            {availableSports.map((sport) => (
              <button
                key={sport}
                onClick={() => setActiveSport(sport)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  activeSport === sport
                    ? "bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20"
                    : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                }`}
              >
                {SPORT_LABELS[sport] || sport.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* Games grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentGames.map((game) => (
            <GameCard
              key={game.eventId}
              game={game}
              bestOdds={bestOddsMap.get(game.eventId) || { bestAwayML: "", bestHomeML: "", bestOver: "", bestUnder: "" }}
              isSoccer={isSoccer}
            />
          ))}
        </div>

        {currentGames.length === 0 && activeSport && (
          <div className="text-center py-8">
            <p className="text-sm font-mono text-zinc-600">
              No upcoming {SPORT_LABELS[activeSport]} games with multi-book odds right now.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
