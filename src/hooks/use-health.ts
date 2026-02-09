import { useQuery } from "@tanstack/react-query";
import { getHealth, getApiInfo, getBotVersion } from "@/services/health-service";

export const healthKeys = {
  all: ["health"] as const,
  status: () => [...healthKeys.all, "status"] as const,
  info: () => [...healthKeys.all, "info"] as const,
  version: () => [...healthKeys.all, "version"] as const,
};

export function useHealth() {
  return useQuery({
    queryKey: healthKeys.status(),
    queryFn: getHealth,
    refetchInterval: 30_000,
  });
}

export function useApiInfo() {
  return useQuery({
    queryKey: healthKeys.info(),
    queryFn: getApiInfo,
  });
}

export function useBotVersion() {
  return useQuery({
    queryKey: healthKeys.version(),
    queryFn: getBotVersion,
    staleTime: 5 * 60 * 1000,
  });
}
