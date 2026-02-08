import { apiClient } from "@/lib/api-client";
import type { Station, CreateStationInput } from "@/types/api";

export function getStations(): Promise<Station[]> {
  return apiClient<Station[]>("/api/stations");
}

export function getStation(id: number): Promise<Station> {
  return apiClient<Station>(`/api/stations/${id}`);
}

export function createStation(input: CreateStationInput): Promise<Station> {
  return apiClient<Station>("/api/stations", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteStation(id: number): Promise<void> {
  return apiClient<void>(`/api/stations/${id}`, { method: "DELETE" });
}

export function setDefaultStation(id: number): Promise<Station> {
  return apiClient<Station>(`/api/stations/${id}/default`, { method: "PUT" });
}
