import type * as T from "@/types/analytics";

const API_URL =
  process.env.NEXT_PUBLIC_BOT_API_URL || "http://localhost:3000";

/**
 * Fetch wrapper with caching for server components
 * Uses Next.js ISR (Incremental Static Regeneration) caching
 */
async function fetchWithCache<T>(
  url: string,
  revalidate: number
): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate }, // Cache for specified seconds
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `Failed to fetch ${url}`);
  }

  return res.json();
}

/**
 * Fetch overview statistics
 * Cache: 60 seconds
 */
export async function getOverview(): Promise<T.OverviewResponse> {
  return fetchWithCache<T.OverviewResponse>(
    `${API_URL}/api/analytics/overview`,
    60
  );
}

/**
 * Fetch command statistics
 * Cache: 120 seconds
 */
export async function getCommands(
  days: number = 30,
  limit: number = 20
): Promise<T.CommandsResponse> {
  return fetchWithCache<T.CommandsResponse>(
    `${API_URL}/api/analytics/commands?days=${days}&limit=${limit}`,
    120
  );
}

/**
 * Fetch queue statistics
 * Cache: 120 seconds
 */
export async function getQueues(
  days: number = 30
): Promise<T.QueuesResponse> {
  return fetchWithCache<T.QueuesResponse>(
    `${API_URL}/api/analytics/queues?days=${days}`,
    120
  );
}

/**
 * Fetch match statistics
 * Cache: 120 seconds
 */
export async function getMatches(
  days: number = 30
): Promise<T.MatchesResponse> {
  return fetchWithCache<T.MatchesResponse>(
    `${API_URL}/api/analytics/matches?days=${days}`,
    120
  );
}

/**
 * Fetch event statistics
 * Cache: 120 seconds
 */
export async function getEvents(
  eventType?: string,
  days: number = 30,
  limit: number = 100
): Promise<T.EventsResponse> {
  const params = new URLSearchParams({
    days: days.toString(),
    limit: limit.toString(),
  });

  if (eventType) {
    params.set("eventType", eventType);
  }

  return fetchWithCache<T.EventsResponse>(
    `${API_URL}/api/analytics/events?${params.toString()}`,
    120
  );
}

/**
 * Fetch user statistics
 * Cache: 120 seconds
 */
export async function getUsers(days: number = 30): Promise<T.UsersResponse> {
  return fetchWithCache<T.UsersResponse>(
    `${API_URL}/api/analytics/users?days=${days}`,
    120
  );
}

/**
 * Fetch daily metrics
 * Cache: 120 seconds
 */
export async function getDailyMetrics(
  days: number = 30
): Promise<T.DailyMetricsResponse> {
  return fetchWithCache<T.DailyMetricsResponse>(
    `${API_URL}/api/analytics/daily-metrics?days=${days}`,
    120
  );
}

/**
 * Client-side fetch for polling (without caching)
 * Used in client components that need real-time data
 */
export async function fetchLiveQueues(): Promise<T.QueuesResponse> {
  const res = await fetch(`${API_URL}/api/analytics/queues?days=1`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch live queue data");
  }

  return res.json();
}
