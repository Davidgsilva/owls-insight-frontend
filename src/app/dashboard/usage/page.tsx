"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

// ─── Types ───────────────────────────────────────────────────────────────────

interface LogEntry {
  apiKeyId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  timestamp: string;
  responseTime: number;
}

interface WsStats {
  totalEvents: number;
  hourlyBreakdown: Record<string, number>;
  eventTypes: Record<string, number>;
}

interface UsageData {
  date: string;
  totals: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
  };
  wsTotals?: {
    totalEvents: number;
    eventTypes: Record<string, number>;
  };
  usage: Array<{
    apiKeyId: string;
    keyName: string;
    tier: string;
    stats: {
      totalRequests: number;
      successfulRequests: number;
      failedRequests: number;
      avgResponseTime: number;
      endpoints: Record<string, number>;
    };
    currentRateLimits: {
      minute: { count: number; limit: number };
      month: { count: number; limit: number };
    };
    websocket?: WsStats;
  }>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const tierLimits = {
  bench: { month: 10_000, minute: 20, wsPerMin: 0 },
  rookie: { month: 75_000, minute: 120, wsPerMin: 120 },
  mvp: { month: 300_000, minute: 400, wsPerMin: 400 },
} as const;

function statusColor(code: number): string {
  if (code >= 200 && code < 300) return "text-[#00FF88]";
  if (code >= 300 && code < 400) return "text-[#06b6d4]";
  if (code === 429) return "text-amber-400";
  return "text-red-400";
}

function statusDot(code: number): string {
  if (code >= 200 && code < 300) return "bg-[#00FF88]";
  if (code >= 300 && code < 400) return "bg-[#06b6d4]";
  if (code === 429) return "bg-amber-400";
  return "bg-red-400";
}

function methodColor(method: string): string {
  switch (method.toUpperCase()) {
    case "GET": return "text-[#06b6d4]";
    case "POST": return "text-[#00FF88]";
    case "DELETE": return "text-red-400";
    case "PUT": case "PATCH": return "text-amber-400";
    default: return "text-zinc-400";
  }
}

function formatMs(ms: number): string {
  if (ms < 1) return "<1ms";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatTime(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

function shortEndpoint(endpoint: string): string {
  return endpoint.replace(/^\/api\/v1/, "");
}

// WS event name → readable label
const wsEventLabels: Record<string, string> = {
  "odds-update": "Odds",
  "scores-update": "Scores",
  "player-props-update": "Props",
  "bet365-props-update": "Bet365",
  "fanduel-props-update": "FanDuel",
  "draftkings-props-update": "DraftKings",
  "betmgm-props-update": "BetMGM",
  "caesars-props-update": "Caesars",
};

// ─── Gauge Component ─────────────────────────────────────────────────────────

function Gauge({
  value,
  max,
  label,
  sublabel,
}: {
  value: number;
  max: number;
  label: string;
  sublabel: string;
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const color = pct > 90 ? "#ef4444" : pct > 70 ? "#eab308" : "#00FF88";
  const remaining = max - value;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] text-zinc-500 font-sans">{label}</span>
        <span className="text-[11px] text-zinc-600 font-mono">{sublabel}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[28px] font-mono font-bold text-white leading-none tabular-nums">
          {value.toLocaleString()}
        </span>
        <span className="text-sm text-zinc-600 font-mono">/ {max.toLocaleString()}</span>
      </div>
      <div className="h-1 bg-zinc-800/80 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[11px] text-zinc-600 font-mono">{remaining.toLocaleString()} remaining</span>
    </div>
  );
}

// ─── Hourly Heatmap Row ──────────────────────────────────────────────────────

function HourlyHeatmap({
  data,
  label,
  color,
}: {
  data: Record<string, number>;
  label: string;
  color: string;
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const values = hours.map((h) => data[`hour_${h}`] || 0);
  const max = Math.max(...values, 1);

  return (
    <div className="space-y-2">
      <span className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider">{label}</span>
      <div className="flex gap-[2px]">
        {hours.map((h) => {
          const v = values[h];
          const opacity = max > 0 ? Math.max(v / max, 0.06) : 0.06;
          return (
            <div
              key={h}
              className="flex-1 h-6 rounded-[2px] relative group cursor-default"
              style={{ backgroundColor: color, opacity: v > 0 ? opacity : 0.06 }}
            >
              {v > 0 && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#1a1a1a] border border-white/10 rounded text-[10px] font-mono text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {h}:00 — {v.toLocaleString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[9px] text-zinc-700 font-mono">
        <span>0:00</span>
        <span>6:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:00</span>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function UsagePage() {
  const { subscription } = useAuth();

  // State
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogsLoading, setIsLogsLoading] = useState(true);
  const logsRef = useRef<LogEntry[]>([]);
  const lastFetchRef = useRef<string>("");

  const selectedDate = format(selectedDay, "yyyy-MM-dd");
  const isToday = selectedDate === format(new Date(), "yyyy-MM-dd");

  const validTiers = ["bench", "rookie", "mvp"] as const;
  const rawTier = subscription?.tier;
  const tier = rawTier && validTiers.includes(rawTier) ? rawTier : "bench";
  const limits = tierLimits[tier];

  // ─── Fetch usage stats (smooth update) ──────────────────────────────────

  const fetchUsage = useCallback(async () => {
    try {
      const res = await fetch(`/api/usage?date=${selectedDate}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setUsageData(data);
      }
    } catch (error) {
      console.error("Failed to fetch usage:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  // ─── Fetch logs (append new entries, don't replace) ─────────────────────

  const fetchLogs = useCallback(async (initial = false) => {
    try {
      const since = initial ? "" : `&since=${logsRef.current.length > 0 ? new Date(logsRef.current[0].timestamp).getTime() + 1 : ""}`;
      const url = `/api/usage/logs?limit=100${since && logsRef.current.length > 0 ? since : ""}`;
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();

      if (data.success && data.logs) {
        if (initial || logsRef.current.length === 0) {
          logsRef.current = data.logs;
          setLogs(data.logs);
        } else {
          // Append only truly new entries (by timestamp dedup)
          const existingTs = new Set(logsRef.current.map((l: LogEntry) => l.timestamp));
          const newEntries = data.logs.filter((l: LogEntry) => !existingTs.has(l.timestamp));
          if (newEntries.length > 0) {
            const merged = [...newEntries, ...logsRef.current].slice(0, 200);
            logsRef.current = merged;
            setLogs(merged);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setIsLogsLoading(false);
    }
  }, []);

  // ─── Effects ────────────────────────────────────────────────────────────

  useEffect(() => {
    setIsLoading(true);
    fetchUsage();

    const interval = setInterval(fetchUsage, 15_000);
    return () => clearInterval(interval);
  }, [fetchUsage]);

  useEffect(() => {
    // Reset logs when date changes
    if (lastFetchRef.current !== selectedDate) {
      logsRef.current = [];
      setLogs([]);
      setIsLogsLoading(true);
      lastFetchRef.current = selectedDate;
    }

    fetchLogs(true);

    // Only poll for new logs on today's date
    if (isToday) {
      const interval = setInterval(() => fetchLogs(false), 10_000);
      return () => clearInterval(interval);
    }
  }, [fetchLogs, selectedDate, isToday]);

  // ─── Derived data ──────────────────────────────────────────────────────

  const currentUsage = usageData?.usage?.[0];
  const rateLimits = currentUsage?.currentRateLimits || {
    minute: { count: 0, limit: limits.minute },
    month: { count: 0, limit: limits.month },
  };

  const totalRequests = usageData?.totals?.totalRequests || 0;
  const successRate = totalRequests > 0
    ? ((usageData?.totals?.successfulRequests || 0) / totalRequests * 100).toFixed(1)
    : "—";

  const avgResponseTime = currentUsage?.stats?.avgResponseTime;

  const wsStats = currentUsage?.websocket;
  const wsTotalEvents = usageData?.wsTotals?.totalEvents || wsStats?.totalEvents || 0;
  const wsEventTypes = usageData?.wsTotals?.eventTypes || wsStats?.eventTypes || {};

  // Endpoint breakdown sorted
  const endpoints = useMemo(() => {
    if (!currentUsage?.stats?.endpoints) return [];
    return Object.entries(currentUsage.stats.endpoints)
      .sort(([, a], [, b]) => b - a);
  }, [currentUsage]);

  const wsHourlyData = wsStats?.hourlyBreakdown || {};

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-mono font-bold text-white tracking-tight">Usage</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5 font-sans">
            API consumption and WebSocket events
          </p>
        </div>

        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="bg-transparent border-white/8 text-zinc-300 hover:bg-white/5 hover:text-white font-mono text-[13px] px-3 h-8"
            >
              {format(selectedDay, "MMM d, yyyy")}
              {isToday && (
                <span className="ml-2 text-[10px] text-[#00FF88] font-sans uppercase tracking-wider">
                  live
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0 bg-[#111113] border-white/10">
            <Calendar
              mode="single"
              selected={selectedDay}
              onSelect={(day) => { if (day) { setSelectedDay(day); setCalendarOpen(false); }}}
              disabled={{ after: new Date() }}
              className="bg-[#111113] text-white"
              classNames={{
                today: "bg-[#00FF88]/15 text-[#00FF88] rounded-md",
                caption_label: "text-white font-mono text-sm select-none font-medium",
                weekday: "text-zinc-500 font-mono text-xs",
                button_previous: "text-zinc-400 hover:text-white hover:bg-white/10 size-8 p-0",
                button_next: "text-zinc-400 hover:text-white hover:bg-white/10 size-8 p-0",
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Requests",
            value: totalRequests.toLocaleString(),
            sub: `${successRate}% success`,
            accent: false,
          },
          {
            label: "Avg Latency",
            value: avgResponseTime ? formatMs(avgResponseTime) : "—",
            sub: "response time",
            accent: false,
          },
          {
            label: "WS Events",
            value: wsTotalEvents.toLocaleString(),
            sub: `${Object.keys(wsEventTypes).length} event types`,
            accent: true,
          },
          {
            label: "Rate Limit",
            value: `${rateLimits.minute.count}`,
            sub: `/ ${limits.minute} per min`,
            accent: false,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="px-4 py-3 rounded-lg bg-[#111113] border border-white/[0.04] transition-colors"
          >
            <span className="text-[11px] text-zinc-500 font-sans block mb-1">{stat.label}</span>
            <span className={`text-lg font-mono font-bold block leading-tight tabular-nums ${stat.accent ? "text-[#06b6d4]" : "text-white"}`}>
              {isLoading ? "..." : stat.value}
            </span>
            <span className="text-[10px] text-zinc-600 font-mono">{isLoading ? "" : stat.sub}</span>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">

        {/* Left Column: Request Timeline (3/5) */}
        <Card className="lg:col-span-3 bg-[#111113] border-white/[0.04] overflow-hidden">
          <div className="px-5 pt-4 pb-2 flex items-baseline justify-between border-b border-white/[0.04]">
            <div>
              <h2 className="text-[13px] font-mono font-medium text-white">Request Log</h2>
              <span className="text-[11px] text-zinc-600 font-sans">
                {logs.length > 0 ? `${logs.length} recent calls` : "No requests yet"}
              </span>
            </div>
            {isToday && logs.length > 0 && (
              <span className="flex items-center gap-1.5 text-[10px] text-zinc-600 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
                streaming
              </span>
            )}
          </div>
          <CardContent className="p-0">
            {isLogsLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-5 h-5 border-[1.5px] border-zinc-700 border-t-[#00FF88] rounded-full animate-spin" />
              </div>
            ) : logs.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-zinc-600 text-sm font-sans">No API calls recorded for this date</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.03] max-h-[520px] overflow-y-auto">
                {logs.map((log, i) => (
                  <div
                    key={`${log.timestamp}-${i}`}
                    className="group px-5 py-2.5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(log.statusCode)}`} />
                    <span className="text-[11px] text-zinc-600 font-mono w-[68px] shrink-0 tabular-nums">
                      {formatTime(log.timestamp)}
                    </span>
                    <span className={`text-[11px] font-mono font-medium w-[36px] shrink-0 ${methodColor(log.method)}`}>
                      {log.method}
                    </span>
                    <code className="text-[12px] text-zinc-300 font-mono truncate flex-1 group-hover:text-white transition-colors">
                      {shortEndpoint(log.endpoint)}
                    </code>
                    <span className={`text-[11px] font-mono tabular-nums ${statusColor(log.statusCode)}`}>
                      {log.statusCode}
                    </span>
                    <span className="text-[11px] text-zinc-600 font-mono w-[52px] text-right tabular-nums">
                      {formatMs(log.responseTime)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column: Single consolidated card (2/5), sticky */}
        <Card className="lg:col-span-2 lg:sticky lg:top-4 bg-[#111113] border-white/[0.04] overflow-hidden">
          <CardContent className="p-0 divide-y divide-white/[0.04]">

            {/* Quotas section */}
            <div className="p-4 space-y-4">
              <Gauge value={rateLimits.month.count} max={limits.month} label="Monthly Quota" sublabel={tier.toUpperCase()} />
              <Gauge value={rateLimits.minute.count} max={limits.minute} label="Rate Limit" sublabel="per minute" />
            </div>

            {/* WebSocket Events — compact, only for Rookie/MVP */}
            {(tier === "rookie" || tier === "mvp") && (
              <div className="p-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] text-zinc-500 font-sans">WebSocket Events</span>
                  <span className="text-[11px] text-zinc-600 font-mono">today</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[28px] font-mono font-bold text-[#06b6d4] leading-none tabular-nums">
                    {isLoading ? "..." : wsTotalEvents.toLocaleString()}
                  </span>
                </div>

                {Object.keys(wsEventTypes).length > 0 ? (
                  <div className="space-y-1">
                    {Object.entries(wsEventTypes)
                      .sort(([, a], [, b]) => b - a)
                      .map(([event, count]) => {
                        const pct = (count / (wsTotalEvents || 1)) * 100;
                        return (
                          <div key={event} className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-500 font-mono w-16 shrink-0 truncate">
                              {wsEventLabels[event] || event}
                            </span>
                            <div className="flex-1 h-[3px] bg-zinc-800/60 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-[#06b6d4] transition-all duration-500"
                                style={{ width: `${pct}%`, opacity: Math.max(pct / 100, 0.3) }}
                              />
                            </div>
                            <span className="text-[10px] text-zinc-600 font-mono tabular-nums w-10 text-right">
                              {count.toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                ) : !isLoading ? (
                  <p className="text-[11px] text-zinc-600 font-sans">No events recorded</p>
                ) : null}

                {Object.keys(wsHourlyData).length > 0 && (
                  <HourlyHeatmap data={wsHourlyData} label="By hour" color="#06b6d4" />
                )}
              </div>
            )}

            {/* Endpoints — compact inline rows */}
            {endpoints.length > 0 && (
              <div className="p-4 space-y-2">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[13px] text-zinc-500 font-sans">Endpoints</span>
                  <span className="text-[11px] text-zinc-600 font-mono">requests</span>
                </div>
                {endpoints.map(([endpoint, count]) => (
                  <div key={endpoint} className="flex items-center justify-between gap-3">
                    <code className="text-[11px] text-zinc-400 font-mono truncate">
                      {shortEndpoint(endpoint)}
                    </code>
                    <span className="text-[11px] text-zinc-500 font-mono tabular-nums shrink-0">
                      {count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
