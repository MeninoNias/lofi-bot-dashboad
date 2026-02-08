import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateStationInput } from "@/types/api";
import {
  getStations,
  getStation,
  createStation,
  deleteStation,
  setDefaultStation,
} from "@/services/station-service";

export const stationKeys = {
  all: ["stations"] as const,
  list: () => [...stationKeys.all, "list"] as const,
  detail: (id: string) => [...stationKeys.all, "detail", id] as const,
};

export function useStations() {
  return useQuery({
    queryKey: stationKeys.list(),
    queryFn: getStations,
  });
}

export function useStation(id: string) {
  return useQuery({
    queryKey: stationKeys.detail(id),
    queryFn: () => getStation(id),
    enabled: !!id,
  });
}

export function useCreateStation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateStationInput) => createStation(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stationKeys.list() });
    },
  });
}

export function useDeleteStation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stationKeys.all });
    },
  });
}

export function useSetDefaultStation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => setDefaultStation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stationKeys.all });
    },
  });
}
