import { useMemo } from "react";
import { Link } from "react-router";
import { Server, Headphones, Clock, Radio, Square, ArrowRight, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useHealth } from "@/hooks/use-health";
import { useGuilds, useStopAll } from "@/hooks/use-guilds";
import { formatUptime } from "@/lib/utils";
import type { GuildStatus } from "@/types/api";

function WaveformBars() {
  return (
    <div className="flex items-end gap-[2px] h-3">
      <div
        className="w-0.5 bg-emerald-500 rounded-sm animate-bounce"
        style={{ animationDelay: "0.1s", height: "8px" }}
      />
      <div
        className="w-0.5 bg-emerald-500 rounded-sm animate-bounce"
        style={{ animationDelay: "0.3s", height: "12px" }}
      />
      <div
        className="w-0.5 bg-emerald-500 rounded-sm animate-bounce"
        style={{ animationDelay: "0.2s", height: "4px" }}
      />
    </div>
  );
}

function TopStreamCard({ guild }: { guild: GuildStatus }) {
  return (
    <div className="group flex items-center gap-4 p-4 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-lg transition-all">
      <div className="relative w-12 h-12 rounded bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700">
        {guild.iconUrl ? (
          <img
            src={guild.iconUrl}
            alt={guild.name}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold text-sm">
            {guild.name
              .split(/\s+/)
              .slice(0, 2)
              .map((w) => w[0])
              .join("")
              .toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-sm font-bold text-white truncate">{guild.name}</h4>
          <div className="flex items-center gap-1">
            <WaveformBars />
            <span className="text-[10px] text-emerald-500 uppercase font-bold ml-1">Live</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-zinc-400 truncate">
            Playing: {guild.audio.currentStation?.name ?? "Unknown"}
          </p>
          <span className="text-xs text-white bg-zinc-800 px-2 py-0.5 rounded">
            {guild.audio.listenerCount} listeners
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: health, isLoading: healthLoading } = useHealth();
  const { data: guilds, isLoading: guildsLoading } = useGuilds();
  const stopAllMutation = useStopAll();

  const isLoading = healthLoading || guildsLoading;

  const activeGuilds = useMemo(
    () =>
      (guilds ?? [])
        .filter((g) => g.audio.isPlaying)
        .sort((a, b) => b.audio.listenerCount - a.audio.listenerCount),
    [guilds],
  );

  const totalListeners = useMemo(
    () => (guilds ?? []).reduce((sum, g) => sum + g.audio.listenerCount, 0),
    [guilds],
  );

  const topStreams = activeGuilds.slice(0, 3);

  return (
    <div className="space-y-0">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-2 py-1 bg-zinc-900 rounded text-[10px] uppercase tracking-widest text-emerald-500 mb-2 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            {health?.status === "healthy" ? "System Operational" : "System Status Unknown"}
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Command Center</h1>
          <p className="text-zinc-500 text-sm mt-1">Real-time bot metrics and controls.</p>
        </div>
      </header>

      {isLoading ? (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#18181b] border border-zinc-800 p-6 rounded-lg hover:border-zinc-700 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Server className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">
              Connected Servers
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white tracking-tighter">
                {health?.discord.guilds ?? 0}
              </span>
            </div>
            <div className="w-full bg-zinc-800 h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-white h-full w-[85%]" />
            </div>
          </div>

          <div className="bg-[#18181b] border border-zinc-800 p-6 rounded-lg hover:border-zinc-700 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Headphones className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">
              Active Listeners
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white tracking-tighter">
                {totalListeners.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-zinc-800 h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-emerald-500 h-full w-[65%]" />
            </div>
          </div>

          <div className="bg-[#18181b] border border-zinc-800 p-6 rounded-lg hover:border-zinc-700 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Clock className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">
              System Uptime
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white tracking-tighter">
                {health ? formatUptime(health.uptime) : "--"}
              </span>
            </div>
            <div className="w-full bg-zinc-800 h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-emerald-500 h-full w-[99%]" />
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="bg-[#18181b] border border-zinc-800 rounded-lg h-full flex flex-col">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Radio className="w-5 h-5 text-zinc-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">
                  Top Active Streams
                </h2>
              </div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest border border-zinc-700 px-2 py-1 rounded bg-zinc-900">
                Live Feed
              </span>
            </div>
            <div className="p-6 space-y-4 flex-1">
              {isLoading ? (
                [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-lg" />)
              ) : topStreams.length === 0 ? (
                <div className="text-center py-8">
                  <Radio className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm text-zinc-500">No active streams</p>
                </div>
              ) : (
                topStreams.map((guild) => (
                  <TopStreamCard key={guild.guildId} guild={guild} />
                ))
              )}
            </div>
            <div className="p-4 border-t border-zinc-800">
              <Link
                to="/controls"
                className="w-full py-2 text-xs font-bold text-zinc-500 uppercase hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                View All Active Streams <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="lg:col-span-1">
          <div className="bg-[#18181b] border border-zinc-800 rounded-lg h-full flex flex-col">
            <div className="p-6 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <Radio className="w-5 h-5 text-zinc-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">
                  Quick Controls
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-6 flex-1">
              <div className="p-4 rounded border border-red-900/30 bg-red-900/10">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest">
                    Emergency Zone
                  </h4>
                </div>
                <p className="text-[10px] text-zinc-400 mb-4 leading-relaxed">
                  Instantly disconnect bot from all voice channels. Use only in case of API rate
                  limits or bugs.
                </p>
                <button
                  onClick={() => stopAllMutation.mutate()}
                  disabled={stopAllMutation.isPending}
                  className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50 hover:border-red-500 transition-all px-4 py-2 rounded text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Square className="w-3.5 h-3.5" />
                  {stopAllMutation.isPending ? "Stopping..." : "Stop All Players"}
                </button>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <Link
                  to="/controls"
                  className="block text-center p-3 bg-white text-black hover:bg-zinc-200 transition-colors rounded text-sm font-bold uppercase tracking-wide shadow-lg shadow-white/5"
                >
                  Open Full Controls
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
