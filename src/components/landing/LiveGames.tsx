"use client";

import { useEffect, useState, useCallback } from "react";

interface TeamInfo {
  homeAway: string;
  team: {
    displayName: string;
    abbreviation?: string;
  };
  score: number | null;
  linescores?: { period: number; score: number }[];
}

interface TennisDetail {
  currentSet: number;
  sets: { home: number; away: number }[];
  currentGameScore?: { home: string; away: string };
  serving?: "home" | "away";
}

interface LiveGame {
  id: string;
  sport: string;
  name: string;
  startTime: string;
  status: {
    state: "in" | "pre" | "post";
    detail: string;
    displayClock?: string;
    period?: number;
  };
  home: TeamInfo;
  away: TeamInfo;
  tennisDetail?: TennisDetail;
}

type SportKey = "nba" | "nhl" | "soccer" | "tennis" | "ncaab" | "mlb" | "nfl" | "ncaaf" | "cs2";

const SPORT_LABELS: Record<string, string> = {
  nba: "NBA",
  ncaab: "NCAAB",
  nfl: "NFL",
  nhl: "NHL",
  mlb: "MLB",
  soccer: "SOCCER",
  tennis: "TENNIS",
  ncaaf: "NCAAF",
  cs2: "CS2",
};

const TAB_ORDER: SportKey[] = ["nba", "nhl", "soccer", "tennis", "ncaab", "mlb", "nfl"];

function formatGameDetail(game: LiveGame): string {
  const { sport, status, tennisDetail } = game;

  if (status.state === "pre") {
    const d = new Date(game.startTime);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (status.state === "post") return "FINAL";

  if (sport === "soccer") {
    if (status.displayClock) return status.displayClock;
    if (status.detail) return status.detail;
    return "LIVE";
  }

  if (sport === "tennis" && tennisDetail) {
    const setScores = tennisDetail.sets.map((s) => `${s.home}-${s.away}`).join(", ");
    return `${setScores} • Set ${tennisDetail.currentSet}`;
  }

  if (sport === "nba" || sport === "ncaab") {
    const period = status.period;
    const clock = status.displayClock || "";
    if (period && period > 4) return `OT${period - 4 > 1 ? period - 4 : ""} ${clock}`.trim();
    return period ? `Q${period} ${clock}`.trim() : status.detail || "LIVE";
  }

  if (sport === "nhl") {
    const period = status.period;
    const clock = status.displayClock || "";
    if (period === 4) return `OT ${clock}`.trim();
    if (period === 5) return "SO";
    return period ? `P${period} ${clock}`.trim() : status.detail || "LIVE";
  }

  if (sport === "nfl" || sport === "ncaaf") {
    const period = status.period;
    const clock = status.displayClock || "";
    if (period && period > 4) return `OT ${clock}`.trim();
    return period ? `Q${period} ${clock}`.trim() : status.detail || "LIVE";
  }

  if (sport === "mlb") {
    const period = status.period;
    const detail = status.detail || "";
    if (detail) return detail;
    return period ? `Inning ${period}` : "LIVE";
  }

  return status.detail || "LIVE";
}

function getTeamAbbrev(team: TeamInfo): string {
  if (team.team.abbreviation) return team.team.abbreviation;
  const words = team.team.displayName.trim().split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 3).toUpperCase();
  return words[words.length - 1].substring(0, 3).toUpperCase();
}

function GameCard({ game }: { game: LiveGame }) {
  const isLive = game.status.state === "in";
  const isFinal = game.status.state === "post";
  const homeWinning =
    game.home.score !== null &&
    game.away.score !== null &&
    game.home.score > game.away.score;
  const awayWinning =
    game.home.score !== null &&
    game.away.score !== null &&
    game.away.score > game.home.score;

  const detail = formatGameDetail(game);
  const tennisSetScores =
    game.sport === "tennis" && game.tennisDetail?.sets
      ? game.tennisDetail.sets
      : null;

  return (
    <div
      className={`relative p-4 rounded-xl border transition-all duration-300 group ${
        isLive
          ? "bg-[#111111] border-[#00FF88]/10 hover:border-[#00FF88]/20"
          : "bg-[#111111] border-white/[0.05] hover:border-white/[0.1]"
      }`}
    >
      {/* Live pulse indicator bar */}
      {isLive && (
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#00FF88]/40 to-transparent" />
      )}

      {/* Top row: sport badge + status */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
          {SPORT_LABELS[game.sport] || game.sport.toUpperCase()}
        </span>
        {isLive ? (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00FF88]" />
            </span>
            <span className="text-[10px] font-mono font-semibold text-[#00FF88] tracking-wider">
              LIVE
            </span>
          </div>
        ) : isFinal ? (
          <span className="text-[10px] font-mono text-zinc-500 tracking-wider">FINAL</span>
        ) : (
          <span className="text-[10px] font-mono text-zinc-600">{detail}</span>
        )}
      </div>

      {/* Away team */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`text-sm font-mono font-medium truncate ${
              isFinal && awayWinning ? "text-white" : "text-zinc-300"
            }`}
          >
            {getTeamAbbrev(game.away)}
          </span>
          <span className="text-zinc-600 text-xs hidden sm:inline truncate">
            {game.away.team.displayName}
          </span>
        </div>
        <span
          className={`text-lg font-mono font-bold tabular-nums ml-2 ${
            isLive && awayWinning
              ? "text-[#00FF88]"
              : awayWinning
                ? "text-white"
                : "text-zinc-500"
          }`}
        >
          {game.away.score ?? "-"}
        </span>
      </div>

      {/* Home team */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`text-sm font-mono font-medium truncate ${
              isFinal && homeWinning ? "text-white" : "text-zinc-300"
            }`}
          >
            {getTeamAbbrev(game.home)}
          </span>
          <span className="text-zinc-600 text-xs hidden sm:inline truncate">
            {game.home.team.displayName}
          </span>
        </div>
        <span
          className={`text-lg font-mono font-bold tabular-nums ml-2 ${
            isLive && homeWinning
              ? "text-[#00FF88]"
              : homeWinning
                ? "text-white"
                : "text-zinc-500"
          }`}
        >
          {game.home.score ?? "-"}
        </span>
      </div>

      {/* Detail line */}
      <div className="border-t border-white/[0.04] pt-2">
        {tennisSetScores ? (
          <div className="flex items-center gap-2">
            {tennisSetScores.map((set, i) => (
              <span key={i} className="text-xs font-mono text-zinc-500">
                {set.home}-{set.away}
              </span>
            ))}
            {game.tennisDetail?.currentGameScore && (
              <span className="text-xs font-mono text-zinc-400">
                ({game.tennisDetail.currentGameScore.home}-
                {game.tennisDetail.currentGameScore.away})
              </span>
            )}
          </div>
        ) : isLive ? (
          <span className="text-xs font-mono text-zinc-500">{detail}</span>
        ) : null}
      </div>
    </div>
  );
}

export function LiveGames() {
  const [games, setGames] = useState<LiveGame[]>([]);
  const [activeSport, setActiveSport] = useState<SportKey | "all">("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchScores = useCallback(async () => {
    try {
      const res = await fetch("/api/scores");
      if (!res.ok) return;
      const json = await res.json();
      const sports = json?.data?.sports;
      if (!sports || typeof sports !== "object") return;

      const allGames: LiveGame[] = [];
      for (const [sport, events] of Object.entries(sports)) {
        if (!Array.isArray(events)) continue;
        for (const ev of events) {
          allGames.push({ ...ev, sport });
        }
      }

      const stateOrder: Record<string, number> = { in: 0, pre: 1, post: 2 };
      allGames.sort((a, b) => {
        const sa = stateOrder[a.status.state] ?? 1;
        const sb = stateOrder[b.status.state] ?? 1;
        if (sa !== sb) return sa - sb;
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      });

      setGames(allGames);
    } catch (err) {
      console.warn("LiveGames: fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 15000);
    return () => clearInterval(interval);
  }, [fetchScores]);

  const sportsWithGames = new Set(games.map((g) => g.sport));
  const availableTabs = TAB_ORDER.filter((s) => sportsWithGames.has(s));

  const filtered =
    activeSport === "all"
      ? games.slice(0, 8)
      : games.filter((g) => g.sport === activeSport).slice(0, 8);

  const liveCount = games.filter((g) => g.status.state === "in").length;

  if (isLoading) {
    return (
      <section id="live-scores" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#111111] border border-white/[0.05]">
              <div className="w-2 h-2 rounded-full bg-zinc-600 animate-pulse" />
              <span className="text-sm font-mono text-zinc-600">Loading live scores...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (games.length === 0) return null;

  return (
    <section id="live-scores" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00FF88]/20 bg-[#00FF88]/5 mb-6">
            {liveCount > 0 && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF88]" />
              </span>
            )}
            <span className="text-xs font-mono text-[#00FF88]">LIVE SCORES</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-mono font-bold mb-4">
            Real-Time{" "}
            <span className="text-[#00FF88] text-glow-green">Game Tracking</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Live scores across {availableTabs.length} sports, updated every 15 seconds.
            {liveCount > 0
              ? ` ${liveCount} game${liveCount > 1 ? "s" : ""} in progress right now.`
              : " Games update in real-time during live action."}
          </p>
        </div>

        {/* Sport tabs */}
        {availableTabs.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mb-10 flex-wrap">
            <button
              onClick={() => setActiveSport("all")}
              className={`px-4 py-2 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${
                activeSport === "all"
                  ? "bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20 shadow-[0_0_10px_rgba(0,255,136,0.08)]"
                  : "text-zinc-500 border border-transparent hover:text-zinc-300 hover:bg-white/[0.03]"
              }`}
            >
              ALL
            </button>
            {availableTabs.map((sport) => (
              <button
                key={sport}
                onClick={() => setActiveSport(sport)}
                className={`px-4 py-2 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${
                  activeSport === sport
                    ? "bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20 shadow-[0_0_10px_rgba(0,255,136,0.08)]"
                    : "text-zinc-500 border border-transparent hover:text-zinc-300 hover:bg-white/[0.03]"
                }`}
              >
                {SPORT_LABELS[sport] || sport.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* Games grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm font-mono text-zinc-600">
              No {activeSport !== "all" ? SPORT_LABELS[activeSport] : ""} games right now.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
