"use client";

const sportsbooks = [
  {
    name: "Pinnacle",
    description: "Sharp book, no limits",
    badge: "Sharp",
    logo: "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://pinnacle.com&size=128",
  },
  {
    name: "FanDuel",
    description: "Top US retail book",
    badge: "Props",
    logo: "https://www.google.com/s2/favicons?domain=fanduel.com&sz=128",
  },
  {
    name: "DraftKings",
    description: "Full market coverage",
    badge: "Props",
    logo: "https://www.google.com/s2/favicons?domain=draftkings.com&sz=128",
  },
  {
    name: "BetMGM",
    description: "Vegas-backed lines",
    badge: "Props",
    logo: "https://www.google.com/s2/favicons?domain=betmgm.com&sz=128",
  },
  {
    name: "Bet365",
    description: "Global market leader",
    badge: "Props",
    logo: "https://www.google.com/s2/favicons?domain=bet365.com&sz=128",
  },
  {
    name: "Caesars",
    description: "Casino heritage",
    badge: "Props",
    logo: "https://www.google.com/s2/favicons?domain=caesars.com&sz=128",
  },
  {
    name: "Kalshi",
    description: "Prediction markets",
    badge: "Exchange",
    logo: "https://www.google.com/s2/favicons?domain=kalshi.com&sz=128",
  },
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
            7 Books. 6 Sports.{" "}
            <span className="text-[#00FF88] text-glow-primary">One API.</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Normalized data from all major US sportsbooks, delivered in a
            consistent schema across every sport and market type.
          </p>
        </div>

        {/* Sportsbooks Grid */}
        <div className="mb-16">
          <h3 className="text-sm font-mono text-zinc-500 mb-6 flex items-center gap-2">
            <span className="w-8 h-px bg-zinc-700" />
            SPORTSBOOKS
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sportsbooks.map((book) => (
              <div
                key={book.name}
                className="group p-4 rounded-xl bg-[#111111] border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <img
                    src={book.logo}
                    alt={`${book.name} logo`}
                    className="w-8 h-8 rounded"
                  />
                  <span className="text-xs font-mono text-[#00FF88]/60">
                    {book.badge}
                  </span>
                </div>
                <div className="text-sm text-white font-medium mb-1">
                  {book.name}
                </div>
                <div className="text-xs text-zinc-500">{book.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sports Grid */}
        <div>
          <h3 className="text-sm font-mono text-zinc-500 mb-6 flex items-center gap-2">
            <span className="w-8 h-px bg-zinc-700" />
            SPORTS
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sports.map((sport) => (
              <div
                key={sport.name}
                className="group p-4 rounded-xl bg-[#111111] border border-white/5 hover:border-[#00FF88]/20 transition-all text-center"
              >
                <div className="flex justify-center mb-2">
                  <img
                    src={sport.logo}
                    alt={`${sport.name} logo`}
                    className="w-8 h-8"
                  />
                </div>
                <div className="font-mono font-bold text-white">
                  {sport.name}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
