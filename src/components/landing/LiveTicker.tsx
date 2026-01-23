"use client";

import { useEffect, useState } from "react";

interface OddsUpdate {
  id: string;
  sport: string;
  teams: string;
  book: string;
  line: string;
  movement: "up" | "down" | "none";
}

const INITIAL_ODDS: OddsUpdate[] = [
  { id: "1", sport: "NBA", teams: "LAL @ BOS", book: "PIN", line: "-3.5", movement: "none" },
  { id: "2", sport: "NFL", teams: "KC @ SF", book: "FD", line: "+2.5", movement: "up" },
  { id: "3", sport: "NHL", teams: "TOR @ NYR", book: "DK", line: "-1.5", movement: "down" },
  { id: "4", sport: "NBA", teams: "GSW @ MIA", book: "MGM", line: "-5.5", movement: "none" },
  { id: "5", sport: "NCAAB", teams: "DUKE @ UNC", book: "365", line: "-2.5", movement: "up" },
  { id: "6", sport: "NFL", teams: "DAL @ PHI", book: "CZR", line: "+3.0", movement: "none" },
  { id: "7", sport: "NBA", teams: "DEN @ PHX", book: "PIN", line: "-4.0", movement: "down" },
  { id: "8", sport: "NHL", teams: "VGK @ COL", book: "FD", line: "-1.5", movement: "up" },
];

export function LiveTicker() {
  const [odds, setOdds] = useState<OddsUpdate[]>(INITIAL_ODDS);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOdds((current) => {
        const idx = Math.floor(Math.random() * current.length);
        const updated = [...current];
        const item = { ...updated[idx] };

        // Randomly adjust the line
        const currentValue = parseFloat(item.line);
        const delta = (Math.random() - 0.5) * 1;
        const newValue = currentValue + delta;

        item.line = newValue >= 0 ? `+${newValue.toFixed(1)}` : newValue.toFixed(1);
        item.movement = delta > 0 ? "up" : delta < 0 ? "down" : "none";
        updated[idx] = item;

        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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
