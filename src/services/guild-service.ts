import { apiClient } from "@/lib/api-client";
import type { GuildStatus, PlayInGuildInput } from "@/types/api";

export function getGuilds(): Promise<GuildStatus[]> {
  return apiClient<GuildStatus[]>("/api/guilds");
}

export function getGuildStatus(guildId: string): Promise<GuildStatus> {
  return apiClient<GuildStatus>(`/api/guilds/${guildId}/status`);
}

export function playInGuild(guildId: string, input: PlayInGuildInput): Promise<GuildStatus> {
  return apiClient<GuildStatus>(`/api/guilds/${guildId}/play`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function stopInGuild(guildId: string): Promise<void> {
  return apiClient<void>(`/api/guilds/${guildId}/stop`, { method: "POST" });
}

export function stopAll(): Promise<void> {
  return apiClient<void>("/api/guilds/stop-all", { method: "POST" });
}
