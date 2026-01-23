"use client";

const sportsbooks = [
  {
    name: "Pinnacle",
    shortName: "PIN",
    description: "Sharp book, no limits",
    speed: "500-800ms",
    color: "text-amber-400",
  },
  {
    name: "FanDuel",
    shortName: "FD",
    description: "Top US retail book",
    speed: "300-600ms",
    color: "text-blue-400",
  },
  {
    name: "DraftKings",
    shortName: "DK",
    description: "Full market coverage",
    speed: "400-700ms",
    color: "text-green-400",
  },
  {
    name: "BetMGM",
    shortName: "MGM",
    description: "Vegas-backed lines",
    speed: "3-8s",
    color: "text-yellow-400",
  },
  {
    name: "Bet365",
    shortName: "365",
    description: "Global market leader",
    speed: "15-30s",
    color: "text-emerald-400",
  },
  {
    name: "Caesars",
    shortName: "CZR",
    description: "Casino heritage",
    speed: "2-5s",
    color: "text-purple-400",
  },
];

const sports = [
  { name: "NBA", icon: "🏀", games: "~15/day" },
  { name: "NFL", icon: "🏈", games: "~16/week" },
  { name: "NHL", icon: "🏒", games: "~15/day" },
  { name: "MLB", icon: "⚾", games: "~15/day" },
  { name: "NCAAB", icon: "🏀", games: "~100/day" },
  { name: "NCAAF", icon: "🏈", games: "~60/week" },
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
            6 Books. 6 Sports.{" "}
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
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono font-bold ${book.color}`}>
                    {book.shortName}
                  </span>
                  <span className="text-xs font-mono text-zinc-600">
                    {book.speed}
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
                <div className="text-3xl mb-2">{sport.icon}</div>
                <div className="font-mono font-bold text-white mb-1">
                  {sport.name}
                </div>
                <div className="text-xs text-zinc-500">{sport.games}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Data coverage matrix teaser */}
        <div className="mt-16 p-6 rounded-xl bg-[#111111] border border-white/5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-mono font-semibold mb-1">
                Live Coverage Matrix
              </h3>
              <p className="text-sm text-zinc-500">
                See real-time coverage percentages across all books and sports
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-green-400">
                  98.2%
                </div>
                <div className="text-xs text-zinc-500">Avg Coverage</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-[#00FF88]">
                  ~500
                </div>
                <div className="text-xs text-zinc-500">Events/Day</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
