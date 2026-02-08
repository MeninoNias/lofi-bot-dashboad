import { apiClient } from "@/lib/api-client";
import type { GuildUserStats } from "@/types/api";

export function getGlobalLeaderboard(limit = 10): Promise<GuildUserStats[]> {
  return apiClient<GuildUserStats[]>(`/api/leaderboard?limit=${limit}`);
}

export function getGuildLeaderboard(
  guildId: string,
  limit = 10,
): Promise<GuildUserStats[]> {
  return apiClient<GuildUserStats[]>(
    `/api/guilds/${guildId}/leaderboard?limit=${limit}`,
  );
}
