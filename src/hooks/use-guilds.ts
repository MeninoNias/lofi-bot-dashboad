import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PlayInGuildInput } from "@/types/api";
import {
  getGuilds,
  getGuildStatus,
  playInGuild,
  stopInGuild,
  stopAll,
} from "@/services/guild-service";

export const guildKeys = {
  all: ["guilds"] as const,
  list: () => [...guildKeys.all, "list"] as const,
  detail: (guildId: string) => [...guildKeys.all, "detail", guildId] as const,
};

export function useGuilds() {
  return useQuery({
    queryKey: guildKeys.list(),
    queryFn: getGuilds,
    refetchInterval: 10_000,
  });
}

export function useGuildStatus(guildId: string) {
  return useQuery({
    queryKey: guildKeys.detail(guildId),
    queryFn: () => getGuildStatus(guildId),
    enabled: !!guildId,
  });
}

export function usePlayInGuild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ guildId, input }: { guildId: string; input: PlayInGuildInput }) =>
      playInGuild(guildId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guildKeys.all });
    },
  });
}

export function useStopInGuild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (guildId: string) => stopInGuild(guildId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guildKeys.all });
    },
  });
}

export function useStopAll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => stopAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guildKeys.all });
    },
  });
}
