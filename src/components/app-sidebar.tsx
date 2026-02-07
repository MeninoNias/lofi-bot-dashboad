import { NavLink } from "react-router";
import {
  HeartPulse,
  LayoutDashboard,
  Music,
  Radio,
  Settings,
  SlidersHorizontal,
  Trophy,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, to: "/" },
  { title: "Stations", icon: Radio, to: "/stations" },
  { title: "Controls", icon: SlidersHorizontal, to: "/controls" },
  { title: "Health", icon: HeartPulse, to: "/health" },
  { title: "Profiles", icon: Users, to: "/profiles" },
  { title: "Leaderboard", icon: Trophy, to: "/leaderboard" },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-md border border-zinc-700 bg-white/10">
                  <Music className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Lofi Bot</span>
                  <span className="text-xs">Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink to={item.to} end={item.to === "/"}>
                    {({ isActive }) => (
                      <SidebarMenuButton isActive={isActive} tooltip={item.title}>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavLink to="/settings">
              {({ isActive }) => (
                <SidebarMenuButton isActive={isActive} tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
