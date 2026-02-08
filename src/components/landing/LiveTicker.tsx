"use client";

import { useEffect, useState, useRef } from "react";

interface OddsUpdate {
  id: string;
  sport: string;
  teams: string;
  book: string;
  line: string;
  movement: "up" | "down" | "none";
}

// Book key to display abbreviation mapping
const BOOK_ABBREV: Record<string, string> = {
  pinnacle: "PIN",
  fanduel: "FD",
  draftkings: "DK",
  betmgm: "MGM",
  bet365: "365",
  caesars: "CZR",
  kalshi: "KAL",
};

// Generate short team name from full name
function shortenTeamName(fullName: string): string {
  if (!fullName) return "???";

  // Split into words
  const words = fullName.trim().split(/\s+/);

  // If single word, take first 4 chars
  if (words.length === 1) {
    return words[0].substring(0, 4).toUpperCase();
  }

  // For multi-word names, use last word (usually the mascot/nickname)
  // But handle special cases like "Los Angeles Lakers" -> "LAL"
  const lastWord = words[words.length - 1];

  // Check if it looks like a city name followed by team name
  // Take first letter of each word for city, then first letter of team
  if (words.length >= 2) {
    // Special handling for common patterns
    const firstWord = words[0];

    // "76ers" -> "PHI" (special case)
    if (lastWord === "76ers") return "PHI";

    // Two-word city names like "Los Angeles", "New York", "San Antonio"
    if (["Los", "New", "San", "Las", "Oklahoma", "Golden", "Trail"].includes(firstWord)) {
      // Take first letter of first two words + first letter of team
      if (words.length >= 3) {
        return (words[0][0] + words[1][0] + words[2][0]).toUpperCase();
      }
    }

    // Standard: first 3-4 letters of last word
    return lastWord.substring(0, 4).toUpperCase();
  }

  return lastWord.substring(0, 4).toUpperCase();
}

export function LiveTicker() {
  const [odds, setOdds] = useState<OddsUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const previousOdds = useRef<Map<string, number>>(new Map());

  // Fetch real odds data from multiple sports via server-side proxy
  useEffect(() => {
    async function fetchSportOdds(sport: string): Promise<OddsUpdate[]> {
      const items: OddsUpdate[] = [];

      try {
        const response = await fetch(`/api/odds?sport=${sport}`);

        if (!response.ok) return items;

        const data = await response.json();
        const bookData = data.data;

        if (!bookData || typeof bookData !== "object") return items;

        // API returns { data: { pinnacle: [...], fanduel: [...], ... } }
        // Each bookmaker key has an array of events with that book's odds
        const bookKeys = Object.keys(bookData);
        // Pick a few random books for variety
        const shuffledBooks = bookKeys.sort(() => Math.random() - 0.5);

        for (const bookKey of shuffledBooks) {
          const events = bookData[bookKey];
          if (!Array.isArray(events)) continue;

          for (const event of events.slice(0, 3)) {
            if (!event.bookmakers || event.bookmakers.length === 0) continue;

            const book = event.bookmakers[0];
            if (!book) continue;

            const spreadsMarket = book.markets?.find((m: { key: string }) => m.key === "spreads");
            if (!spreadsMarket?.outcomes?.length) continue;

            const awaySpread = spreadsMarket.outcomes.find(
              (o: { name: string }) => o.name === event.away_team
            );
            if (awaySpread?.point === undefined) continue;

            const point = awaySpread.point;
            const line = point >= 0 ? `+${point.toFixed(1)}` : point.toFixed(1);
            const itemId = `${event.id}-${book.key}`;

            // Check for movement compared to previous fetch
            const prevPoint = previousOdds.current.get(itemId);
            let movement: "up" | "down" | "none" = "none";
            if (prevPoint !== undefined) {
              if (point > prevPoint) movement = "up";
              else if (point < prevPoint) movement = "down";
            }
            previousOdds.current.set(itemId, point);

            items.push({
              id: itemId,
              sport: sport.toUpperCase(),
              teams: `${shortenTeamName(event.away_team)} @ ${shortenTeamName(event.home_team)}`,
              book: BOOK_ABBREV[book.key] || book.key.substring(0, 3).toUpperCase(),
              line,
              movement,
            });
          }
        }
      } catch {
        // Silently fail for individual sports
      }

      return items;
    }

    async function fetchAllOdds() {
      try {
        // Fetch from multiple sports in parallel
        const sports = ["nba", "ncaab", "nhl", "nfl"];
        const results = await Promise.all(sports.map(fetchSportOdds));

        // Combine results
        const allItems = results.flat();

        // Shuffle to mix sports together
        for (let i = allItems.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
        }

        if (allItems.length > 0) {
          setOdds(allItems.slice(0, 20)); // Limit to 20 items
        }
      } catch (error) {
        console.warn("Ticker: Error fetching odds:", error);
      } finally {
        setIsLoading(false);
      }
    }

    // Initial fetch
    fetchAllOdds();

    // Refresh every 30 seconds
    const interval = setInterval(fetchAllOdds, 30000);

    return () => clearInterval(interval);
  }, []);

  // Clear movement indicators after a delay
  useEffect(() => {
    if (odds.some(o => o.movement !== "none")) {
      const timeout = setTimeout(() => {
        setOdds((current) =>
          current.map((item) => ({ ...item, movement: "none" }))
        );
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [odds]);

  // Don't render anything if no data
  if (isLoading || odds.length === 0) {
    return (
      <div className="w-full overflow-hidden bg-[#111111] border-y border-white/5">
        <div className="flex items-center justify-center py-2">
          <span className="text-xs font-mono text-zinc-600">Loading live odds...</span>
        </div>
      </div>
    );
  }

  const duplicatedOdds = [...odds, ...odds]; // Duplicate for seamless loop

  return (
    <div className="w-full overflow-hidden bg-[#111111] border-y border-white/5">
      <div className="flex animate-ticker">
        {duplicatedOdds.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex items-center gap-3 px-6 py-2 border-r border-white/5 whitespace-nowrap"
          >
            <span className="text-xs font-mono text-zinc-500">{item.sport}</span>
            <span className="text-sm font-mono text-zinc-300">{item.teams}</span>
            <span className="text-xs font-mono text-zinc-600">{item.book}</span>
            <span
              className={`text-sm font-mono font-medium transition-all ${
                item.movement === "up"
                  ? "text-green-400"
                  : item.movement === "down"
                  ? "text-red-400"
                  : "text-[#00FF88]"
              }`}
            >
              {item.line}
            </span>
            {item.movement !== "none" && (
              <span
                className={`text-xs ${
                  item.movement === "up" ? "text-green-400" : "text-red-400"
                }`}
              >
                {item.movement === "up" ? "▲" : "▼"}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
