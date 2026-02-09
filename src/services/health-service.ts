import { apiClient } from "@/lib/api-client";
import type { ApiInfo, BotVersion, HealthStatus } from "@/types/api";

export function getApiInfo(): Promise<ApiInfo> {
  return apiClient<ApiInfo>("/");
}

export function getHealth(): Promise<HealthStatus> {
  return apiClient<HealthStatus>("/health");
}

export function validateApiKey(key: string): Promise<HealthStatus> {
  return apiClient<HealthStatus>("/health", { apiKey: key });
}

export function getBotVersion(): Promise<BotVersion> {
  return apiClient<BotVersion>("/api/version");
}
