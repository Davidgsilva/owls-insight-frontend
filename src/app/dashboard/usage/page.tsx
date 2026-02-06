"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { BarChart3, Zap, Clock, CheckCircle, XCircle, TrendingUp, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

interface UsageStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgResponseTime: number;
  endpoints: Record<string, number>;
}

interface RateLimits {
  minute: { count: number; limit: number };
  month: { count: number; limit: number };
}

interface UsageData {
  date: string;
  totals: UsageStats;
  usage: Array<{
    apiKeyId: string;
    keyName: string;
    tier: string;
    stats: UsageStats;
    currentRateLimits: RateLimits;
  }>;
}

interface DailyDataPoint {
  date: string;
  label: string;
  total: number;
  successful: number;
  failed: number;
}

function ProgressBar({
  value,
  max,
  color = "green",
}: {
  value: number;
  max: number;
  color?: "green" | "yellow" | "red";
}) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  const bgColor =
    color === "red"
      ? "bg-red-500"
      : color === "yellow"
      ? "bg-yellow-500"
      : "bg-[#00FF88]";

  return (
    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
      <div
        className={`h-full ${bgColor} transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) {
  if (!active || !payload?.length) return null;

  const colorMap: Record<string, string> = {
    total: "#06b6d4",
    successful: "#00FF88",
    failed: "#ef4444",
  };
  const labelMap: Record<string, string> = {
    total: "Total",
    successful: "Successful",
    failed: "Failed",
  };

  return (
    <div className="bg-[#18181b]/95 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 shadow-2xl shadow-black/50">
      <p className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colorMap[entry.dataKey] }} />
              <span className="text-xs text-zinc-400">{labelMap[entry.dataKey] || entry.dataKey}</span>
            </div>
            <span className="text-sm font-mono font-medium" style={{ color: colorMap[entry.dataKey] }}>
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getLastNDays(n: number): string[] {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function UsagePage() {
  const { subscription } = useAuth();
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [chartData, setChartData] = useState<DailyDataPoint[]>([]);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const selectedDate = format(selectedDay, "yyyy-MM-dd");

  // Validate tier from API to prevent runtime errors
  const validTiers = ["bench", "rookie", "mvp"] as const;
  const rawTier = subscription?.tier;
  const tier = rawTier && validTiers.includes(rawTier) ? rawTier : "bench";
  const tierLimits = {
    bench: { month: 10000, minute: 20 },
    rookie: { month: 75000, minute: 120 },
    mvp: { month: 300000, minute: 400 },
  };
  const limits = tierLimits[tier];

  // Fetch 7-day chart data
  useEffect(() => {
    const controller = new AbortController();

    async function fetchChartData() {
      setIsChartLoading(true);
      const dates = getLastNDays(7);

      try {
        const responses = await Promise.all(
          dates.map((date) =>
            fetch(`/api/usage?date=${date}`, {
              credentials: "include",
              signal: controller.signal,
            }).then((res) => res.json()).catch(() => null)
          )
        );

        const points: DailyDataPoint[] = dates.map((date, i) => {
          const data = responses[i];
          return {
            date,
            label: formatDateLabel(date),
            total: data?.totals?.totalRequests || 0,
            successful: data?.totals?.successfulRequests || 0,
            failed: data?.totals?.failedRequests || 0,
          };
        });

        setChartData(points);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error("Failed to fetch chart data:", error);
      } finally {
        setIsChartLoading(false);
      }
    }

    fetchChartData();
    return () => controller.abort();
  }, []);

  // Fetch single-day data
  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsage() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/usage?date=${selectedDate}`, {
          credentials: "include",
          signal: controller.signal,
        });
        const data = await res.json();
        if (data.success) {
          setUsageData(data);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error("Failed to fetch usage:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsage();
    return () => controller.abort();
  }, [selectedDate]);

  const currentUsage = usageData?.usage?.[0];
  const rateLimits = currentUsage?.currentRateLimits || {
    minute: { count: 0, limit: limits.minute },
    month: { count: 0, limit: limits.month },
  };

  const monthPercentage = (rateLimits.month.count / limits.month) * 100;
  const monthColor = monthPercentage > 90 ? "red" : monthPercentage > 70 ? "yellow" : "green";

  const minutePercentage = (rateLimits.minute.count / limits.minute) * 100;
  const minuteColor = minutePercentage > 90 ? "red" : minutePercentage > 70 ? "yellow" : "green";

  const weekTotal = useMemo(
    () => chartData.reduce((sum, d) => sum + d.total, 0),
    [chartData]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-white">Usage</h1>
          <p className="text-zinc-400 mt-1">
            Monitor your API usage and rate limits
          </p>
        </div>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="bg-[#0a0a0a] border-white/10 text-white hover:bg-white/5 hover:text-white font-mono text-sm gap-2 px-3"
            >
              <CalendarIcon className="w-4 h-4 text-zinc-400" />
              {format(selectedDay, "MMM d, yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-auto p-0 bg-[#111113] border-white/10"
          >
            <Calendar
              mode="single"
              selected={selectedDay}
              onSelect={(day) => {
                if (day) {
                  setSelectedDay(day);
                  setCalendarOpen(false);
                }
              }}
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

      {/* 7-Day Usage Chart */}
      <Card className="bg-[#111113] border-white/5 overflow-hidden relative">
        {/* Subtle ambient glow behind chart */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[60%] h-[40%] bg-[#06b6d4]/[0.03] rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[30%] bg-[#00FF88]/[0.02] rounded-full blur-3xl" />
        </div>
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-mono text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#00FF88]" />
                7-Day Usage Trend
              </CardTitle>
              <CardDescription className="text-zinc-500">
                Daily request volume over the past week
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono font-bold text-white">
                {isChartLoading ? "..." : weekTotal.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-500">total this week</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          {isChartLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 4 }}>
                  <defs>
                    <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} />
                      <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.08} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00FF88" stopOpacity={0.15} />
                      <stop offset="50%" stopColor="#00FF88" stopOpacity={0.05} />
                      <stop offset="100%" stopColor="#00FF88" stopOpacity={0} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06" vertical={false} />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#52525b", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#52525b", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
                    width={48}
                    tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#ffffff08", strokeWidth: 1 }} />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fill="url(#totalGradient)"
                    dot={false}
                    activeDot={{ fill: "#06b6d4", strokeWidth: 2, stroke: "#111113", r: 5, filter: "url(#glow)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="successful"
                    stroke="#00FF88"
                    strokeWidth={2}
                    fill="url(#successGradient)"
                    dot={false}
                    activeDot={{ fill: "#00FF88", strokeWidth: 2, stroke: "#111113", r: 5, filter: "url(#glow)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="failed"
                    stroke="#ef4444"
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={{ fill: "#ef4444", strokeWidth: 2, stroke: "#111113", r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
          {/* Legend */}
          <div className="flex items-center gap-5 mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.5)]" />
              <span className="text-[11px] text-zinc-500 font-mono">Total</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00FF88] shadow-[0_0_6px_rgba(0,255,136,0.4)]" />
              <span className="text-[11px] text-zinc-500 font-mono">Successful</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full border border-dashed border-red-500" />
              <span className="text-[11px] text-zinc-500 font-mono">Failed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate Limit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[#111113] border-white/5">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#00FF88]" />
              Monthly Usage
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Requests this billing period
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-mono font-bold text-white">
                  {rateLimits.month.count.toLocaleString()}
                </span>
                <span className="text-zinc-500 ml-2">
                  / {limits.month.toLocaleString()}
                </span>
              </div>
              <span className={`text-sm ${monthColor === "red" ? "text-red-400" : monthColor === "yellow" ? "text-yellow-400" : "text-[#00FF88]"}`}>
                {monthPercentage.toFixed(1)}%
              </span>
            </div>
            <ProgressBar value={rateLimits.month.count} max={limits.month} color={monthColor} />
            <p className="text-xs text-zinc-500">
              {(limits.month - rateLimits.month.count).toLocaleString()} requests remaining
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#111113] border-white/5">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#00FF88]" />
              Rate Limit
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Current requests per minute
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-mono font-bold text-white">
                  {rateLimits.minute.count}
                </span>
                <span className="text-zinc-500 ml-2">
                  / {limits.minute}
                </span>
              </div>
              <span className={`text-sm ${minuteColor === "red" ? "text-red-400" : minuteColor === "yellow" ? "text-yellow-400" : "text-[#00FF88]"}`}>
                {minutePercentage.toFixed(0)}%
              </span>
            </div>
            <ProgressBar value={rateLimits.minute.count} max={limits.minute} color={minuteColor} />
            <p className="text-xs text-zinc-500">
              Resets every minute
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Stats */}
      <Card className="bg-[#111113] border-white/5">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#00FF88]" />
            Daily Statistics
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Usage breakdown for {selectedDate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-[#0a0a0a] rounded-lg border border-white/5">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                  <BarChart3 className="w-4 h-4" />
                  Total Requests
                </div>
                <p className="text-2xl font-mono font-bold text-white">
                  {(usageData?.totals?.totalRequests || 0).toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-[#0a0a0a] rounded-lg border border-white/5">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Successful
                </div>
                <p className="text-2xl font-mono font-bold text-green-400">
                  {(usageData?.totals?.successfulRequests || 0).toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-[#0a0a0a] rounded-lg border border-white/5">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  Failed
                </div>
                <p className="text-2xl font-mono font-bold text-red-400">
                  {(usageData?.totals?.failedRequests || 0).toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-[#0a0a0a] rounded-lg border border-white/5">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                  <Clock className="w-4 h-4" />
                  Avg Response
                </div>
                <p className="text-2xl font-mono font-bold text-white">
                  {currentUsage?.stats?.avgResponseTime
                    ? `${currentUsage.stats.avgResponseTime.toFixed(0)}ms`
                    : "N/A"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Endpoint Breakdown */}
      {currentUsage?.stats?.endpoints && Object.keys(currentUsage.stats.endpoints).length > 0 && (
        <Card className="bg-[#111113] border-white/5">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-white">
              Endpoint Breakdown
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Requests by endpoint
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(currentUsage.stats.endpoints)
                .sort(([, a], [, b]) => b - a)
                .map(([endpoint, count]) => (
                  <div key={endpoint} className="flex items-center justify-between">
                    <code className="text-sm text-zinc-400 font-mono">
                      {endpoint}
                    </code>
                    <span className="text-white font-mono">
                      {count.toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
