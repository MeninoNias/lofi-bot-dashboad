export interface ApiInfo {
  name: string;
  version: string;
  endpoints: string[];
}

export interface HealthStatus {
  status: "healthy" | "unhealthy";
  timestamp: string;
  uptime: number;
  discord: {
    connected: boolean;
    ping: number;
    guilds: number;
  };
  database: {
    connected: boolean;
  };
  audio: {
    activeConnections: number;
  };
}

export interface Station {
  id: number;
  name: string;
  url: string;
  description: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStationInput {
  name: string;
  url: string;
  description?: string;
}

export interface UserProfile {
  userId: string;
  username: string;
  totalXp: number;
  level: number;
  totalListeningTime: number;
  createdAt: string;
}

export interface GuildUserStats {
  userId: string;
  username: string;
  xp: number;
  level: number;
  listeningTime: number;
}

export interface ApiErrorResponse {
  error: string;
  statusCode: number;
}

export interface GuildAudioState {
  isPlaying: boolean;
  currentStation: { id: number; name: string } | null;
  channelId: string | null;
  channelName: string | null;
  listenerCount: number;
  connectedSince: string | null;
}

export interface VoiceChannel {
  id: string;
  name: string;
}

export interface GuildStatus {
  guildId: string;
  name: string;
  iconUrl: string | null;
  memberCount: number;
  audio: GuildAudioState;
  voiceChannels: VoiceChannel[];
}

export interface PlayInGuildInput {
  stationId: number;
  channelId: string;
}
