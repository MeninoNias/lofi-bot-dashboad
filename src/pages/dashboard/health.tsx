import { useRef, useCallback } from "react";
import {
  Wifi,
  WifiOff,
  Database,
  Radio,
  Clock,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useHealth } from "@/hooks/use-health";
import { formatUptimeClock } from "@/lib/utils";
import type { HealthStatus } from "@/types/api";

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", { hour12: false });
}

function StatusBadge({ status }: { status: "healthy" | "unhealthy" }) {
  const isHealthy = status === "healthy";
  return (
    <div
      className={`inline-flex items-center gap-2 px-2 py-1 bg-zinc-900 border rounded mb-2 ${
        isHealthy ? "border-emerald-500/20" : "border-red-500/20"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isHealthy ? "bg-emerald-500" : "bg-red-500 animate-pulse"
        }`}
      />
      <span
        className={`text-[10px] uppercase tracking-widest font-bold ${
          isHealthy ? "text-emerald-500" : "text-red-500"
        }`}
      >
        {isHealthy ? "System Healthy" : "System Unhealthy"}
      </span>
    </div>
  );
}

function WaveformBars() {
  const delays = [0.1, 0.3, 0.5, 0.2, 0.4, 0.1, 0.6, 0.3];
  const heights = [16, 32, 24, 40, 20, 36, 28, 16];
  return (
    <div className="h-12 flex items-end gap-1 mt-4">
      {delays.map((delay, i) => (
        <div
          key={i}
          className="w-[3px] bg-emerald-500 rounded-sm animate-bounce"
          style={{ animationDelay: `${delay}s`, height: `${heights[i]}px` }}
        />
      ))}
    </div>
  );
}

function DiscordCard({ health }: { health: HealthStatus }) {
  const connected = health.discord.connected;
  return (
    <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6 relative overflow-hidden group hover:border-zinc-600 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Discord API</h3>
        {connected ? (
          <Wifi className="w-4 h-4 text-emerald-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" />
        )}
      </div>
      <div className="mb-4">
        <div className={`text-2xl font-bold ${connected ? "text-white" : "text-red-400"}`}>
          {connected ? "CONNECTED" : "DISCONNECTED"}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-4 mt-2">
        <div>
          <div className="text-[10px] text-zinc-500 uppercase">Latency</div>
          <div className="text-sm text-emerald-400 font-bold">{health.discord.ping}ms</div>
        </div>
        <div>
          <div className="text-[10px] text-zinc-500 uppercase">Guilds</div>
          <div className="text-sm text-white font-bold">{health.discord.guilds}</div>
        </div>
      </div>
    </div>
  );
}

function DatabaseCard({ health }: { health: HealthStatus }) {
  const connected = health.database.connected;
  return (
    <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6 relative overflow-hidden group hover:border-zinc-600 transition-colors">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Database className="w-16 h-16 text-white" />
      </div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Database</h3>
        {connected ? (
          <CheckCircle className="w-4 h-4 text-emerald-500" />
        ) : (
          <XCircle className="w-4 h-4 text-red-500" />
        )}
      </div>
      <div className="mb-4">
        <div className={`text-2xl font-bold ${connected ? "text-white" : "text-red-400"}`}>
          {connected ? "CONNECTED" : "DISCONNECTED"}
        </div>
      </div>
      <div className="border-t border-zinc-800 pt-4 mt-2">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span
            className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-red-500"}`}
          />
          {connected ? "Pool Active" : "Pool Inactive"}
        </div>
      </div>
    </div>
  );
}

function AudioCard({ health }: { health: HealthStatus }) {
  const count = health.audio.activeConnections;
  return (
    <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6 relative overflow-hidden group hover:border-zinc-600 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Audio Stream</h3>
        <Radio className="w-4 h-4 text-emerald-500" />
      </div>
      <div className="mb-2">
        <div className="text-2xl font-bold text-white">
          {count} ACTIVE
        </div>
        <div className="text-xs text-zinc-500 mt-1">Voice Connections</div>
      </div>
      {count > 0 ? (
        <WaveformBars />
      ) : (
        <div className="h-12 flex items-center">
          <div className="text-xs text-zinc-600">No active streams</div>
        </div>
      )}
    </div>
  );
}

function UptimeCard({ health }: { health: HealthStatus }) {
  return (
    <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6 relative overflow-hidden group hover:border-zinc-600 transition-colors">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Clock className="w-16 h-16 text-white" />
      </div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">System Uptime</h3>
        <Clock className="w-4 h-4 text-emerald-500" />
      </div>
      <div className="flex items-center justify-center h-20">
        <div className="text-3xl lg:text-4xl font-bold text-white tracking-widest">
          {formatUptimeClock(health.uptime)}
        </div>
      </div>
      <div className="text-center text-[10px] text-zinc-500 uppercase tracking-widest border-t border-zinc-800 pt-2">
        Since Last Reboot
      </div>
    </div>
  );
}

function PingHistoryChart({ ping }: { ping: number }) {
  const historyRef = useRef<number[]>([]);

  const getHistory = useCallback(() => {
    const history = historyRef.current;
    if (history.length === 0 || history[history.length - 1] !== ping) {
      history.push(ping);
      if (history.length > 30) history.shift();
    }
    return history;
  }, [ping]);

  const history = getHistory();
  const avg = history.length > 0 ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) : 0;
  const max = history.length > 0 ? Math.max(...history) : 0;

  const width = 800;
  const height = 200;
  const padding = 10;
  const maxPing = Math.max(max * 1.3, 100);

  const points = history.map((val, i) => {
    const x = history.length === 1 ? width / 2 : (i / (history.length - 1)) * (width - padding * 2) + padding;
    const y = height - (val / maxPing) * (height - padding * 2) - padding;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const fillPath = points.length > 0
    ? `${linePath} L${points[points.length - 1].x},${height} L${points[0].x},${height} Z`
    : "";

  return (
    <div className="lg:col-span-2 bg-[#18181b] border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
          Ping History (ms) — Last 30 checks
        </h3>
        <div className="flex gap-4">
          <span className="text-[10px] text-zinc-600">AVG: {avg}ms</span>
          <span className="text-[10px] text-zinc-600">MAX: {max}ms</span>
        </div>
      </div>
      <div className="h-48 w-full relative">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-b border-zinc-800/50 w-full h-px" />
          ))}
        </div>
        <svg
          className="w-full h-full relative z-10"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="pingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </linearGradient>
          </defs>
          {fillPath && <path d={fillPath} fill="url(#pingGradient)" />}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          )}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#10B981" opacity={i === points.length - 1 ? 1 : 0.4} />
          ))}
        </svg>
      </div>
      <div className="flex justify-between text-[10px] text-zinc-600 mt-2">
        <span>Oldest</span>
        <span>Current: {ping}ms</span>
      </div>
    </div>
  );
}

function SystemResourcesPlaceholder() {
  return (
    <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6">
      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">
        System Resources
      </h3>
      <div className="space-y-8">
        <div>
          <div className="flex justify-between text-xs font-medium mb-2 uppercase tracking-wide">
            <span className="text-zinc-400">vCPU Usage</span>
            <span className="text-zinc-600">—</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-900 rounded overflow-hidden border border-zinc-800">
            <div className="bg-zinc-700 h-full w-0" />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs font-medium mb-2 uppercase tracking-wide">
            <span className="text-zinc-400">RAM Allocation</span>
            <span className="text-zinc-600">—</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-900 rounded overflow-hidden border border-zinc-800">
            <div className="bg-zinc-700 h-full w-0" />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs font-medium mb-2 uppercase tracking-wide">
            <span className="text-zinc-400">Process Load</span>
            <span className="text-zinc-600">—</span>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-2 w-2 bg-zinc-800 rounded-sm" />
            ))}
          </div>
        </div>
      </div>
      <p className="text-[10px] text-zinc-600 mt-6 text-center">
        Requires backend resource monitoring endpoint
      </p>
    </div>
  );
}

function RecentEventsPlaceholder() {
  return (
    <section className="bg-[#18181b] border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-4">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Recent Events</h3>
        <button
          disabled
          className="text-[10px] text-zinc-600 uppercase border border-zinc-800 px-2 py-1 rounded cursor-not-allowed"
        >
          View All Logs
        </button>
      </div>
      <div className="text-xs space-y-2 h-32 overflow-y-auto pr-2">
        <div className="flex gap-4 p-1 rounded">
          <span className="text-zinc-700 select-none">--:--:--</span>
          <span className="text-zinc-600 font-bold select-none">INFO</span>
          <span className="text-zinc-600">Awaiting backend log streaming endpoint...</span>
        </div>
      </div>
    </section>
  );
}

function HealthSkeleton() {
  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-44 rounded-lg" />
        ))}
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-72 rounded-lg" />
        <Skeleton className="h-72 rounded-lg" />
      </section>
      <Skeleton className="h-48 rounded-lg" />
    </div>
  );
}

export default function HealthPage() {
  const { data: health, isLoading, dataUpdatedAt } = useHealth();

  if (isLoading) {
    return (
      <div className="space-y-0">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-zinc-800 pb-6">
          <div>
            <Skeleton className="h-6 w-40 rounded mb-2" />
            <Skeleton className="h-8 w-80 rounded" />
          </div>
        </header>
        <HealthSkeleton />
      </div>
    );
  }

  if (!health) {
    return (
      <div className="space-y-0">
        <header className="mb-10 border-b border-zinc-800 pb-6">
          <div className="inline-flex items-center gap-2 px-2 py-1 bg-zinc-900 border border-red-500/20 rounded mb-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-red-500 font-bold">
              Unreachable
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">SYSTEM HEALTH MONITOR</h1>
        </header>
        <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-12 text-center">
          <WifiOff className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <p className="text-sm text-zinc-500">Unable to reach bot API</p>
          <p className="text-xs text-zinc-600 mt-1">
            Check that the bot is running and the API URL is configured correctly.
          </p>
        </div>
      </div>
    );
  }

  const lastChecked = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString("en-US", { hour12: false }) : formatTime(health.timestamp);

  return (
    <div className="space-y-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-zinc-800 pb-6">
        <div>
          <StatusBadge status={health.status} />
          <h1 className="text-3xl font-bold text-white tracking-tight">SYSTEM HEALTH MONITOR</h1>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Last Checked</div>
          <div className="text-xl text-white flex items-center gap-2 justify-end">
            <RefreshCw className="w-4 h-4 text-zinc-600" />
            {lastChecked}
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DiscordCard health={health} />
        <DatabaseCard health={health} />
        <AudioCard health={health} />
        <UptimeCard health={health} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <PingHistoryChart ping={health.discord.ping} />
        <SystemResourcesPlaceholder />
      </section>

      <RecentEventsPlaceholder />
    </div>
  );
}
