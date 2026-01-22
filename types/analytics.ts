// Analytics API Response Types

export interface OverviewResponse {
  totalUsers: number;
  totalMatches: number;
  totalQueueEntries: number;
  totalCommands: number;
  successfulMatches: number;
  matchSuccessRate: number;
  newUsersLast7Days: number;
}

export interface CommandStats {
  commandName: string;
  totalUsage: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  avgExecutionTimeMs: number;
}

export interface CommandsResponse {
  commands: CommandStats[];
  period: string;
}

export interface QueueModeStats {
  game: "LOL" | "VAL";
  mode: string;
  totalEntries: number;
  successfulMatches: number;
  matchRate: number;
  avgWaitTimeMinutes: number;
}

export interface CurrentQueueState {
  game: "LOL" | "VAL";
  mode: string;
  waitingPlayers: number;
}

export interface QueuesResponse {
  modeStats: QueueModeStats[];
  currentQueueState: CurrentQueueState[];
  period: string;
}

export interface MatchStatusBreakdown {
  totalProposals: number;
  matched: number;
  declined: number;
  timedOut: number;
  pending: number;
  acceptanceRate: number;
  avgMatchScore: number;
}

export interface MatchesResponse {
  matchStatusBreakdown: MatchStatusBreakdown;
  period: string;
}

export interface EventCount {
  eventType: string;
  count: number;
}

export interface AnalyticsEvent {
  id: string;
  eventType: string;
  userId: string | null;
  metadata: Record<string, any> | null;
  createdAt: string;
}

export interface EventsResponse {
  eventCounts: EventCount[];
  recentEvents: AnalyticsEvent[];
  period: string;
}

export interface UsersByGame {
  LOL: number;
  VAL: number;
  unknown: number;
}

export interface UsersResponse {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  usersByGame: UsersByGame;
  period: string;
}

export interface DailyMetric {
  id: string;
  date: string;
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  totalQueueJoins: number;
  totalMatches: number;
  totalMatchDeclines: number;
  totalMatchTimeouts: number;
  averageWaitTimeMin: number;
  totalCommands: number;
  totalLfgPosts: number;
  totalLfgCompletions: number;
  totalTenMansMatches: number;
  createdAt: string;
  updatedAt: string;
}

export interface DailyMetricsResponse {
  dailyMetrics: DailyMetric[];
  period: string;
}
