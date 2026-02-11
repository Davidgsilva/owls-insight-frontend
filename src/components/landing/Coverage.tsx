"use client";

const sportsbooks = [
  { name: "Pinnacle", logo: "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://pinnacle.com&size=128" },
  { name: "FanDuel", logo: "https://www.google.com/s2/favicons?domain=fanduel.com&sz=128" },
  { name: "DraftKings", logo: "https://www.google.com/s2/favicons?domain=draftkings.com&sz=128" },
  { name: "BetMGM", logo: "https://www.google.com/s2/favicons?domain=betmgm.com&sz=128" },
  { name: "Bet365", logo: "https://www.google.com/s2/favicons?domain=bet365.com&sz=128" },
  { name: "Caesars", logo: "https://www.google.com/s2/favicons?domain=caesars.com&sz=128" },
  { name: "Kalshi", logo: "https://www.google.com/s2/favicons?domain=kalshi.com&sz=128" },
];

const sports = [
  { name: "NBA", logo: "https://www.google.com/s2/favicons?domain=nba.com&sz=128" },
  { name: "NFL", logo: "https://www.google.com/s2/favicons?domain=nfl.com&sz=128" },
  { name: "NHL", logo: "https://www.google.com/s2/favicons?domain=nhl.com&sz=128" },
  { name: "MLB", logo: "https://www.google.com/s2/favicons?domain=mlb.com&sz=128" },
  { name: "NCAAB", logo: "https://www.google.com/s2/favicons?domain=ncaa.com&sz=128" },
  { name: "NCAAF", logo: "https://www.google.com/s2/favicons?domain=ncaa.com&sz=128" },
];

export function Coverage() {
  return (
    <section id="coverage" className="py-24 relative bg-[#050505]">
      {/* Background pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00FF88]/20 bg-[#00FF88]/5 mb-6">
            <span className="text-xs font-mono text-[#00FF88]">COVERAGE</span>
          </div>
          <h2 className="text-4xl font-mono font-bold mb-4">
            Aggregated Odds. Unified Schema.{" "}
            <span className="text-[#00FF88] text-glow-primary">One API.</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Real-time data from major sportsbooks and prediction markets, normalized
            and delivered consistently across every sport and market type.
          </p>
        </div>

        {/* Sportsbooks Carousel */}
        <div className="mb-16">
          <h3 className="text-sm font-mono text-zinc-500 mb-6 flex items-center gap-2">
            <span className="w-8 h-px bg-zinc-700" />
            SOURCES
          </h3>
          <div className="relative overflow-hidden">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

            <div className="flex animate-ticker w-max" style={{ animationDuration: "50s" }}>
              {[...sportsbooks, ...sportsbooks].map((book, i) => (
                <div
                  key={`${book.name}-${i}`}
                  className="flex items-center gap-3 px-6 py-3 mx-2 rounded-lg border border-white/[0.04] bg-white/[0.02] opacity-50"
                >
                  <img
                    src={book.logo}
                    alt={`${book.name} logo`}
                    className="w-6 h-6 rounded grayscale"
                  />
                  <span className="text-sm font-mono text-zinc-500 whitespace-nowrap">
                    {book.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sports Carousel */}
        <div>
          <h3 className="text-sm font-mono text-zinc-500 mb-6 flex items-center gap-2">
            <span className="w-8 h-px bg-zinc-700" />
            SPORTS
          </h3>
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

            <div className="flex animate-ticker w-max" style={{ animationDuration: "50s", animationDirection: "reverse" }}>
              {[...sports, ...sports].map((sport, i) => (
                <div
                  key={`${sport.name}-${i}`}
                  className="flex items-center gap-3 px-6 py-3 mx-2 rounded-lg border border-white/[0.04] bg-white/[0.02] opacity-50"
                >
                  <img
                    src={sport.logo}
                    alt={`${sport.name} logo`}
                    className="w-6 h-6 grayscale"
                  />
                  <span className="text-sm font-mono text-zinc-500 whitespace-nowrap">
                    {sport.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
