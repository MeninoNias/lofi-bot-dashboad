import { useQuery } from "@tanstack/react-query";
import {
  getGlobalLeaderboard,
  getGuildLeaderboard,
} from "@/services/leaderboard-service";

export const leaderboardKeys = {
  all: ["leaderboard"] as const,
  global: (limit: number) => [...leaderboardKeys.all, "global", limit] as const,
  guild: (guildId: string, limit: number) =>
    [...leaderboardKeys.all, "guild", guildId, limit] as const,
};

export function useGlobalLeaderboard(limit = 10) {
  return useQuery({
    queryKey: leaderboardKeys.global(limit),
    queryFn: () => getGlobalLeaderboard(limit),
  });
}

export function useGuildLeaderboard(guildId: string, limit = 10) {
  return useQuery({
    queryKey: leaderboardKeys.guild(guildId, limit),
    queryFn: () => getGuildLeaderboard(guildId, limit),
    enabled: !!guildId,
  });
}
