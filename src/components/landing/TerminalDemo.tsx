"use client";

import { useEffect, useRef, useState } from "react";

const API_RESPONSE = `{
  "event_id": "nba_20240315_lal_bos",
  "home_team": "Boston Celtics",
  "away_team": "Los Angeles Lakers",
  "commence_time": "2024-03-15T19:30:00Z",
  "odds": {
    "pinnacle": {
      "spread": { "home": -3.5, "away": +3.5 },
      "moneyline": { "home": -155, "away": +135 },
      "total": { "over": 224.5, "under": 224.5 }
    },
    "fanduel": {
      "spread": { "home": -3.0, "away": +3.0 },
      "moneyline": { "home": -150, "away": +130 }
    },
    "draftkings": {
      "spread": { "home": -3.5, "away": +3.5 },
      "moneyline": { "home": -152, "away": +132 }
    }
  },
  "last_update": "2024-03-15T18:45:32.847Z"
}`;

export function TerminalDemo() {
  const [displayedText, setDisplayedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isTyping, setIsTyping] = useState(true);
  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    let animationId: number;
    let lastTime = 0;
    const charsPerFrame = 3;
    const frameDelay = 16;

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameDelay) {
        if (index < API_RESPONSE.length) {
          index = Math.min(index + charsPerFrame, API_RESPONSE.length);
          setDisplayedText(API_RESPONSE.slice(0, index));
          lastTime = currentTime;
          // Auto-scroll to bottom as text appears
          if (responseRef.current) {
            responseRef.current.scrollTop = responseRef.current.scrollHeight;
          }
        } else {
          setIsTyping(false);
          return;
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Syntax highlighting helper
  const highlightJson = (text: string) => {
    return text
      .split("\n")
      .map((line, i) => {
        // Highlight keys
        let highlighted = line.replace(
          /"([^"]+)":/g,
          '<span class="text-[#00FF88]">"$1"</span>:'
        );
        // Highlight string values
        highlighted = highlighted.replace(
          /: "([^"]+)"/g,
          ': <span class="text-emerald-400">"$1"</span>'
        );
        // Highlight numbers
        highlighted = highlighted.replace(
          /: (-?\d+\.?\d*)/g,
          ': <span class="text-[#00d4aa]">$1</span>'
        );
        // Highlight booleans
        highlighted = highlighted.replace(
          /: (true|false)/g,
          ': <span class="text-purple-400">$1</span>'
        );

        return (
          <div key={i} className="flex">
            <span className="w-8 text-right pr-4 text-neutral-600 select-none">
              {i + 1}
            </span>
            <span dangerouslySetInnerHTML={{ __html: highlighted }} />
          </div>
        );
      });
  };

  return (
    <div className="rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-2xl shadow-black/50 h-[480px] flex flex-col">
      {/* Terminal Header */}
      <div className="px-4 py-3 flex items-center gap-3 bg-[#111111] border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs font-mono text-neutral-500">
            GET /api/v1/nba/odds
          </span>
        </div>
        <div className="w-16" />
      </div>

      {/* Terminal Body - flex-1 fills remaining space, scrolls when content overflows */}
      <div ref={responseRef} className="p-4 font-mono text-xs leading-relaxed overflow-y-auto flex-1 bg-[#0a0a0a]">
        {/* Request line */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
          <span className="text-[#00FF88]">$</span>
          <span className="text-neutral-400">curl</span>
          <span className="text-[#00d4aa]">-H</span>
          <span className="text-neutral-300">
            &quot;X-API-Key: oi_live_xxxx&quot;
          </span>
          <span className="text-[#00FF88] break-all">
            https://api.owlsinsight.com/api/v1/nba/odds
          </span>
        </div>

        {/* Response */}
        <div className="relative">
          <pre className="text-neutral-300 whitespace-pre">
            {highlightJson(displayedText)}
          </pre>
          {isTyping && (
            <span
              className={`inline-block w-2 h-4 bg-[#00FF88] ml-0.5 transition-opacity duration-100 ${
                cursorVisible ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between text-xs font-mono bg-[#0a0a0a]">
        <div className="flex items-center gap-4">
          <span className="text-[#00FF88] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
            200 OK
          </span>
          <span className="text-neutral-500">47ms</span>
        </div>
        <span className="text-neutral-600">application/json</span>
      </div>
    </div>
  );
}
