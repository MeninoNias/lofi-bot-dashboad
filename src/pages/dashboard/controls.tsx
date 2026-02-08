import { useState, useMemo } from "react";
import {
  Server,
  Headphones,
  Radio,
  Square,
  Play,
  Search,
  Volume2,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGuilds, usePlayInGuild, useStopInGuild, useStopAll } from "@/hooks/use-guilds";
import { useStations } from "@/hooks/use-stations";
import type { GuildStatus } from "@/types/api";

function GuildInitials({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="w-14 h-14 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold border border-zinc-700 text-sm">
      {initials}
    </div>
  );
}

function GuildIcon({ guild }: { guild: GuildStatus }) {
  if (guild.iconUrl) {
    return (
      <div className="w-14 h-14 rounded-lg overflow-hidden border border-zinc-700">
        <img
          src={guild.iconUrl}
          alt={guild.name}
          className="w-full h-full object-cover opacity-80"
        />
      </div>
    );
  }
  return <GuildInitials name={guild.name} />;
}

function ActiveConnectionCard({ guild }: { guild: GuildStatus }) {
  const stopMutation = useStopInGuild();

  return (
    <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-5 hover:border-zinc-600 transition-all group">
      <div className="relative shrink-0">
        <GuildIcon guild={guild} />
        <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5">
          <div className="bg-emerald-500 text-[8px] text-black font-bold px-1.5 rounded-full uppercase tracking-wider">
            Live
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-white truncate text-sm">{guild.name}</h3>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 truncate">
            <Volume2 className="w-3.5 h-3.5" />
            <span>{guild.audio.channelName ?? "Unknown"}</span>
          </span>
          <span className="w-1 h-1 bg-zinc-700 rounded-full" />
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Radio className="w-3.5 h-3.5" />
            <span className="truncate">{guild.audio.currentStation?.name ?? "Unknown"}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:border-l sm:border-zinc-800 sm:pl-4">
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-white font-bold text-sm">
            <span>{guild.audio.listenerCount}</span>
            <Headphones className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wide">Listeners</span>
        </div>
        <button
          onClick={() => stopMutation.mutate(guild.guildId)}
          disabled={stopMutation.isPending}
          className="bg-zinc-900 hover:bg-red-900/30 text-zinc-400 hover:text-red-400 border border-zinc-700 hover:border-red-800 p-2 rounded transition-colors disabled:opacity-50"
        >
          <Square className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function StatsCards({ guilds }: { guilds: GuildStatus[] }) {
  const totalGuilds = guilds.length;
  const activeStreams = guilds.filter((g) => g.audio.isPlaying).length;
  const totalListeners = guilds.reduce((sum, g) => sum + g.audio.listenerCount, 0);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6 flex items-center justify-between group hover:border-zinc-600 transition-colors">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">
            Total Guilds
          </span>
          <span className="text-3xl font-bold text-white tracking-tighter">{totalGuilds}</span>
        </div>
        <div className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
          <Server className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6 flex items-center justify-between group hover:border-zinc-600 transition-colors relative overflow-hidden">
        {activeStreams > 0 && (
          <div className="absolute top-0 right-0 p-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </div>
        )}
        <div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">
            Active Streams
          </span>
          <span className="text-3xl font-bold text-white tracking-tighter">{activeStreams}</span>
        </div>
        <div className="w-10 h-10 rounded bg-emerald-900/20 flex items-center justify-center text-emerald-500">
          <Radio className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6 flex items-center justify-between group hover:border-zinc-600 transition-colors">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">
            Total Listeners
          </span>
          <span className="text-3xl font-bold text-white tracking-tighter">
            {totalListeners.toLocaleString()}
          </span>
        </div>
        <div className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
          <Headphones className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
}

function QuickPlaySidebar({ guilds }: { guilds: GuildStatus[] }) {
  const [selectedGuildId, setSelectedGuildId] = useState("");
  const [selectedChannelId, setSelectedChannelId] = useState("");
  const [selectedStationId, setSelectedStationId] = useState("");
  const { data: stations } = useStations();
  const playMutation = usePlayInGuild();
  const stopAllMutation = useStopAll();

  const selectedGuild = guilds.find((g) => g.guildId === selectedGuildId);

  const handleGuildChange = (guildId: string) => {
    setSelectedGuildId(guildId);
    setSelectedChannelId("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuildId || !selectedChannelId || !selectedStationId) return;
    playMutation.mutate(
      {
        guildId: selectedGuildId,
        input: { stationId: Number(selectedStationId), channelId: selectedChannelId },
      },
      {
        onSuccess: () => {
          setSelectedGuildId("");
          setSelectedChannelId("");
          setSelectedStationId("");
        },
      },
    );
  };

  return (
    <aside className="lg:col-span-1 sticky top-6">
      <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6 lg:p-8 shadow-xl shadow-black/40">
        <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
          <div className="p-2 bg-white text-black rounded">
            <Play className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">Quick Play</h2>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">
              Target Guild
            </label>
            <select
              value={selectedGuildId}
              onChange={(e) => handleGuildChange(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded p-3 text-sm text-white focus:border-white focus:ring-0 transition-colors"
            >
              <option value="">Select Guild...</option>
              {guilds.map((g) => (
                <option key={g.guildId} value={g.guildId}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">
              Voice Channel
            </label>
            <select
              value={selectedChannelId}
              onChange={(e) => setSelectedChannelId(e.target.value)}
              disabled={!selectedGuildId}
              className="w-full bg-black border border-zinc-700 rounded p-3 text-sm text-white focus:border-white focus:ring-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Channel...</option>
              {selectedGuild?.voiceChannels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">
              Radio Station
            </label>
            <select
              value={selectedStationId}
              onChange={(e) => setSelectedStationId(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded p-3 text-sm text-white focus:border-white focus:ring-0 transition-colors"
            >
              <option value="">Select Station...</option>
              {stations?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={
                !selectedGuildId ||
                !selectedChannelId ||
                !selectedStationId ||
                playMutation.isPending
              }
              className="w-full bg-white text-black hover:bg-zinc-200 transition-colors py-4 rounded font-bold uppercase tracking-widest shadow-lg shadow-white/5 hover:shadow-white/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4" />
              {playMutation.isPending ? "Starting..." : "Start Stream"}
            </button>
            <p className="text-[10px] text-zinc-600 mt-3 text-center">
              By starting a stream, the bot will join the selected channel immediately.
            </p>
          </div>
        </form>
      </div>

      <div className="mt-6 border border-red-900/30 rounded-lg p-4 bg-red-900/10">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest">
            Emergency Zone
          </h4>
        </div>
        <p className="text-[10px] text-zinc-400 mb-4 leading-relaxed">
          Instantly disconnect bot from all voice channels. Use only in case of issues.
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
    </aside>
  );
}

function ConnectionsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-[#18181b] border border-zinc-800/50 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-5 opacity-40"
        >
          <Skeleton className="w-14 h-14 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ControlsPage() {
  const { data: guilds, isLoading } = useGuilds();
  const [searchQuery, setSearchQuery] = useState("");

  const activeGuilds = useMemo(
    () => (guilds ?? []).filter((g) => g.audio.isPlaying),
    [guilds],
  );

  const filteredGuilds = useMemo(
    () =>
      activeGuilds.filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [activeGuilds, searchQuery],
  );

  return (
    <div className="space-y-0">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Playback Control Center
          </h1>
          <p className="text-zinc-400 text-sm">
            Manage active voice connections and stream status.
          </p>
        </div>
      </header>

      {isLoading ? (
        <>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </section>
          <ConnectionsSkeleton />
        </>
      ) : (
        <>
          <StatsCards guilds={guilds ?? []} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <section className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">
                  Active Connections
                </h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                    <input
                      type="text"
                      placeholder="Search guild..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 text-white text-xs px-3 py-1.5 pl-8 rounded focus:border-zinc-500 focus:ring-0 placeholder-zinc-600 w-48"
                    />
                  </div>
                </div>
              </div>

              {filteredGuilds.length === 0 ? (
                <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-12 text-center">
                  <Radio className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm text-zinc-500">No active connections</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Use Quick Play to start a stream in a guild.
                  </p>
                </div>
              ) : (
                filteredGuilds.map((guild) => (
                  <ActiveConnectionCard key={guild.guildId} guild={guild} />
                ))
              )}
            </section>

            <QuickPlaySidebar guilds={guilds ?? []} />
          </div>
        </>
      )}
    </div>
  );
}
