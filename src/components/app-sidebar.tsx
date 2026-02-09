import { NavLink } from "react-router";
import {
  HeartPulse,
  LayoutDashboard,
  Radio,
  Settings,
  SlidersHorizontal,
  Terminal,
  Trophy,
  Users,
} from "lucide-react";

import { useHealth } from "@/hooks/use-health";
import { useBotVersion } from "@/hooks/use-health";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, to: "/" },
  { title: "Stations", icon: Radio, to: "/stations" },
  { title: "Controls", icon: SlidersHorizontal, to: "/controls" },
  { title: "Health", icon: HeartPulse, to: "/health" },
  { title: "Profiles", icon: Users, to: "/profiles" },
  { title: "Leaderboard", icon: Trophy, to: "/leaderboard" },
];

export function AppSidebar() {
  const { data: health } = useHealth();
  const { data: version, isLoading: versionLoading } = useBotVersion();

  const isOnline = health?.status === "healthy";

  return (
    <aside className="w-64 fixed h-screen bg-[#101012] border-r border-zinc-800 flex flex-col z-20">
      {/* Header: logo + version */}
      <div className="p-8 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Terminal className="size-6 text-emerald-500" />
          <div>
            <h1 className="font-bold text-white text-sm tracking-tight">LOFI BOT</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              {versionLoading ? "..." : version?.version ?? "unknown"} Stable
            </p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.title} to={item.to} end={item.to === "/"}>
            {({ isActive }) => (
              <div
                className={`flex items-center gap-3 px-4 py-3 text-sm rounded transition-colors ${
                  isActive
                    ? "bg-zinc-800 text-white border border-zinc-700"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <item.icon
                  className={`size-4 ${isActive ? "text-emerald-500" : ""}`}
                />
                {item.title}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Settings link */}
      <div className="px-4 pb-2">
        <NavLink to="/settings">
          {({ isActive }) => (
            <div
              className={`flex items-center gap-3 px-4 py-3 text-sm rounded transition-colors ${
                isActive
                  ? "bg-zinc-800 text-white border border-zinc-700"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Settings className={`size-4 ${isActive ? "text-emerald-500" : ""}`} />
              Settings
            </div>
          )}
        </NavLink>
      </div>

      {/* Footer: bot status */}
      <div className="p-4 border-t border-zinc-800">
        <div className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500" : "bg-red-500"}`}
            />
            {isOnline && (
              <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Bot Status</div>
            <div className="text-xs text-white font-mono">
              {isOnline ? "Online" : "Offline"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
