import { apiClient } from "@/lib/api-client";
import type { UserProfile } from "@/types/api";

export function getUserProfile(userId: string): Promise<UserProfile> {
  return apiClient<UserProfile>(`/api/users/${userId}/profile`);
}
