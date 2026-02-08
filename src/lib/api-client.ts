import { useAuthStore } from "@/stores/auth-store";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiClientOptions extends Omit<RequestInit, "headers"> {
  apiKey?: string;
  headers?: Record<string, string>;
}

const BASE_URL =
  import.meta.env.PUBLIC_LOFI_BOT_API_URL || "http://localhost:3000";

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { apiKey: overrideKey, headers: extraHeaders, ...fetchOptions } = options;
  const apiKey = overrideKey ?? useAuthStore.getState().apiKey;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });
  } catch {
    throw new ApiError("Network error: cannot reach bot API", 0);
  }

  if (response.status === 401) {
    useAuthStore.getState().clearApiKey();
    throw new ApiError("Unauthorized", 401);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => undefined);
    throw new ApiError(
      body?.error || `HTTP ${response.status}`,
      response.status,
      body,
    );
  }

  return response.json() as Promise<T>;
}
