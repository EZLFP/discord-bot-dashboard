# Analytics API Reference for Dashboard

Complete reference for all analytics endpoints with exact response structures, TypeScript types, and visualization recommendations.

---

## Base URL

```
http://your-bot-url:3000/api/analytics
```

**Local Development:**
```
http://localhost:3000/api/analytics
```

**Production:**
```
https://your-production-bot-url.com/api/analytics
```

---

## Authentication

Currently, endpoints are **public** (no authentication required).

**For Production Dashboard:**
Add authentication middleware to protect these endpoints:
- Use API keys
- Or restrict by IP whitelist
- Or add JWT/session-based auth

---

## Endpoints

### 1. GET /overview

**Purpose:** High-level summary of all bot activity

**Query Parameters:** None

**Response Structure:**
```typescript
{
  totalUsers: number;           // All registered users
  totalMatches: number;         // Successfully completed matches
  totalQueueEntries: number;    // All queue join attempts
  totalCommands: number;        // All commands executed
  successfulMatches: number;    // Queue entries that resulted in matches
  matchSuccessRate: number;     // Percentage (0-100)
  newUsersLast7Days: number;    // Users registered in last 7 days
}
```

**Example Response:**
```json
{
  "totalUsers": 342,
  "totalMatches": 156,
  "totalQueueEntries": 423,
  "totalCommands": 2847,
  "successfulMatches": 189,
  "matchSuccessRate": 45,
  "newUsersLast7Days": 28
}
```

**Dashboard Visualizations:**
- Large stat cards for each metric
- Match success rate as a progress circle/gauge
- User growth sparkline (7-day trend)
- Command vs matches ratio

**Sample Dashboard Code (Next.js):**
```tsx
async function getOverview() {
  const res = await fetch(`${process.env.BOT_API_URL}/api/analytics/overview`);
  return res.json();
}

export default async function DashboardPage() {
  const data = await getOverview();

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard title="Total Users" value={data.totalUsers} />
      <StatCard title="Total Matches" value={data.totalMatches} />
      <StatCard title="Match Success" value={`${data.matchSuccessRate}%`} />
      <StatCard title="New Users (7d)" value={data.newUsersLast7Days} />
    </div>
  );
}
```

---

### 2. GET /commands

**Purpose:** Command usage statistics and performance metrics

**Query Parameters:**
- `days` (optional, default: 30) - Look back period
- `limit` (optional, default: 20) - Max commands to return

**Response Structure:**
```typescript
{
  commands: Array<{
    commandName: string;        // Command identifier (e.g., "queue_join", "help")
    totalUsage: number;         // Total times executed
    successCount: number;       // Successful executions
    failureCount: number;       // Failed executions
    successRate: number;        // Percentage (0-100)
    avgExecutionTimeMs: number; // Average execution time
  }>;
  period: string;              // Human-readable period (e.g., "Last 30 days")
}
```

**Example Response:**
```json
{
  "commands": [
    {
      "commandName": "queue_join",
      "totalUsage": 487,
      "successCount": 472,
      "failureCount": 15,
      "successRate": 97,
      "avgExecutionTimeMs": 234
    },
    {
      "commandName": "help",
      "totalUsage": 312,
      "successCount": 312,
      "failureCount": 0,
      "successRate": 100,
      "avgExecutionTimeMs": 89
    },
    {
      "commandName": "queue_leave",
      "totalUsage": 156,
      "successCount": 154,
      "failureCount": 2,
      "successRate": 99,
      "avgExecutionTimeMs": 145
    }
  ],
  "period": "Last 30 days"
}
```

**Dashboard Visualizations:**
- **Bar Chart:** Command usage (horizontal bars, sorted by totalUsage)
- **Table:** All commands with sortable columns
- **Pie Chart:** Success vs failure distribution
- **Line Chart:** Execution time comparison
- **Heat Map:** Usage by time of day (requires additional query)

**Sample Dashboard Code (Recharts):**
```tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

async function getCommands() {
  const res = await fetch(`${process.env.BOT_API_URL}/api/analytics/commands?days=7`);
  return res.json();
}

export default async function CommandsChart() {
  const { commands } = await getCommands();

  return (
    <BarChart width={600} height={400} data={commands}>
      <XAxis dataKey="commandName" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="totalUsage" fill="#FF8C00" />
    </BarChart>
  );
}
```

**Useful Queries:**
```bash
# Last 7 days, top 10 commands
curl "http://localhost:3000/api/analytics/commands?days=7&limit=10"

# Last 90 days, all commands
curl "http://localhost:3000/api/analytics/commands?days=90&limit=100"
```

---

### 3. GET /queues

**Purpose:** Queue performance and wait time analytics

**Query Parameters:**
- `days` (optional, default: 30) - Look back period

**Response Structure:**
```typescript
{
  modeStats: Array<{
    game: "LOL" | "VAL";        // League of Legends or Valorant
    mode: string;                // "ranked", "aram", "normals", "flex", "unrated", etc.
    totalEntries: number;        // Total queue joins
    successfulMatches: number;   // Entries that resulted in matches
    matchRate: number;           // Percentage (0-100)
    avgWaitTimeMinutes: number;  // Average time from queue join to match
  }>;
  currentQueueState: Array<{
    game: "LOL" | "VAL";
    mode: string;
    waitingPlayers: number;      // LIVE count of players in queue right now
  }>;
  period: string;
}
```

**Example Response:**
```json
{
  "modeStats": [
    {
      "game": "LOL",
      "mode": "ranked",
      "totalEntries": 287,
      "successfulMatches": 142,
      "matchRate": 49,
      "avgWaitTimeMinutes": 8
    },
    {
      "game": "LOL",
      "mode": "aram",
      "totalEntries": 134,
      "successfulMatches": 78,
      "matchRate": 58,
      "avgWaitTimeMinutes": 5
    },
    {
      "game": "VAL",
      "mode": "ranked",
      "totalEntries": 198,
      "successfulMatches": 94,
      "matchRate": 47,
      "avgWaitTimeMinutes": 12
    }
  ],
  "currentQueueState": [
    {
      "game": "LOL",
      "mode": "ranked",
      "waitingPlayers": 3
    },
    {
      "game": "VAL",
      "mode": "ranked",
      "waitingPlayers": 8
    }
  ],
  "period": "Last 30 days"
}
```

**Dashboard Visualizations:**

**Historical Performance:**
- **Grouped Bar Chart:** Match rates by mode
- **Line Chart:** Average wait time over time (by mode)
- **Table:** Sortable queue performance stats

**Real-Time Status:**
- **Live Counter Cards:** Current players in each queue
- **Status Indicators:** Green (>5 players), Yellow (2-5), Red (<2)
- **Auto-refresh:** Poll every 10-30 seconds

**Sample Dashboard Code:**
```tsx
import { BarChart, Bar, XAxis, YAxis, Legend, Tooltip } from 'recharts';

async function getQueueStats() {
  const res = await fetch(`${process.env.BOT_API_URL}/api/analytics/queues?days=14`);
  return res.json();
}

export default async function QueueDashboard() {
  const { modeStats, currentQueueState } = await getQueueStats();

  return (
    <div>
      {/* Real-time queue status */}
      <h2>Live Queue Status</h2>
      <div className="grid grid-cols-3 gap-4">
        {currentQueueState.map(q => (
          <div key={`${q.game}-${q.mode}`} className="p-4 border rounded">
            <div className="text-sm text-gray-500">{q.game} - {q.mode}</div>
            <div className="text-3xl font-bold">{q.waitingPlayers}</div>
            <div className="text-xs">players waiting</div>
          </div>
        ))}
      </div>

      {/* Historical performance */}
      <h2 className="mt-8">Queue Performance (Last 14 Days)</h2>
      <BarChart width={800} height={400} data={modeStats}>
        <XAxis dataKey="mode" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="matchRate" fill="#82ca9d" name="Match Rate %" />
        <Bar dataKey="avgWaitTimeMinutes" fill="#8884d8" name="Avg Wait (min)" />
      </BarChart>
    </div>
  );
}
```

**Useful Queries:**
```bash
# Last 7 days queue performance
curl "http://localhost:3000/api/analytics/queues?days=7"

# Last 60 days for trend analysis
curl "http://localhost:3000/api/analytics/queues?days=60"
```

---

### 4. GET /matches

**Purpose:** Match proposal outcomes and quality metrics

**Query Parameters:**
- `days` (optional, default: 30) - Look back period

**Response Structure:**
```typescript
{
  matchStatusBreakdown: {
    totalProposals: number;     // All match proposals sent
    matched: number;            // Both players accepted
    declined: number;           // One or both players declined
    timedOut: number;           // No response within 60 seconds
    pending: number;            // Currently waiting for response
    acceptanceRate: number;     // Percentage of matched proposals (0-100)
    avgMatchScore: number;      // Average compatibility score (0-100)
  };
  period: string;
}
```

**Example Response:**
```json
{
  "matchStatusBreakdown": {
    "totalProposals": 234,
    "matched": 156,
    "declined": 48,
    "timedOut": 23,
    "pending": 7,
    "acceptanceRate": 67,
    "avgMatchScore": 78
  },
  "period": "Last 30 days"
}
```

**Dashboard Visualizations:**

**Funnel Chart:** Proposals → Matched → Playing
```
234 Proposals Sent
  ↓ 67% acceptance
156 Matches Confirmed
  ↓
156 Games Played
```

**Pie/Donut Chart:** Match outcomes
- Matched (green)
- Declined (yellow)
- Timed Out (red)
- Pending (gray)

**Gauge Chart:** Acceptance rate
- 0-50% (red)
- 50-75% (yellow)
- 75-100% (green)

**Sample Dashboard Code:**
```tsx
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

async function getMatchStats() {
  const res = await fetch(`${process.env.BOT_API_URL}/api/analytics/matches?days=30`);
  return res.json();
}

export default async function MatchAnalytics() {
  const { matchStatusBreakdown } = await getMatchStats();

  const data = [
    { name: 'Matched', value: matchStatusBreakdown.matched, color: '#00C49F' },
    { name: 'Declined', value: matchStatusBreakdown.declined, color: '#FFBB28' },
    { name: 'Timed Out', value: matchStatusBreakdown.timedOut, color: '#FF8042' },
    { name: 'Pending', value: matchStatusBreakdown.pending, color: '#999' }
  ];

  return (
    <div>
      <div className="stat-card">
        <h3>Acceptance Rate</h3>
        <div className="text-5xl font-bold text-green-600">
          {matchStatusBreakdown.acceptanceRate}%
        </div>
        <p className="text-sm text-gray-500">
          Avg Match Score: {matchStatusBreakdown.avgMatchScore}%
        </p>
      </div>

      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}
```

---

### 5. GET /events

**Purpose:** Track specific user actions and system events

**Query Parameters:**
- `eventType` (optional) - Filter by specific event
- `days` (optional, default: 30) - Look back period
- `limit` (optional, default: 100) - Max events to return

**Response Structure:**
```typescript
{
  eventCounts: Array<{
    eventType: string;          // Event identifier
    count: number;              // Number of occurrences
  }>;
  recentEvents: Array<{
    id: string;                 // Event ID
    eventType: string;          // Event identifier
    userId: string | null;      // Discord user ID (if applicable)
    metadata: Record<string, any> | null; // Event-specific data
    createdAt: string;          // ISO timestamp
  }>;
  period: string;
}
```

**Available Event Types:**
- `match_declined_requeue` - User declined match but stayed in queue
- `match_declined_leave` - User declined match and left queue
- `match_timeout` - Match proposal expired
- `queue_abandoned` - User left queue before getting matched
- `match_success` - Match confirmed and completed
- `oauth_failed` - OAuth authentication failed
- `riot_api_error` - Riot API error occurred
- `lfg_created` - LFG post created
- `lfg_completed` - LFG post resulted in match
- `tenmans_created` - 10-mans match created

**Example Response (All Events):**
```json
{
  "eventCounts": [
    { "eventType": "match_success", "count": 156 },
    { "eventType": "match_declined_requeue", "count": 34 },
    { "eventType": "match_timeout", "count": 23 },
    { "eventType": "match_declined_leave", "count": 14 },
    { "eventType": "queue_abandoned", "count": 89 }
  ],
  "recentEvents": [
    {
      "id": "clx1234567",
      "eventType": "match_declined_requeue",
      "userId": "123456789012345678",
      "metadata": {
        "proposalId": "clx9876543",
        "mode": "ranked",
        "reason": "requeue"
      },
      "createdAt": "2026-01-06T15:30:45.123Z"
    },
    {
      "id": "clx2345678",
      "eventType": "match_success",
      "userId": "234567890123456789",
      "metadata": {
        "mode": "aram",
        "matchScore": 82,
        "waitTimeMinutes": 7
      },
      "createdAt": "2026-01-06T15:28:12.456Z"
    }
  ],
  "period": "Last 30 days"
}
```

**Example Response (Filtered by Event Type):**
```json
{
  "eventCounts": [
    { "eventType": "match_timeout", "count": 23 }
  ],
  "recentEvents": [
    {
      "id": "clx3456789",
      "eventType": "match_timeout",
      "userId": "345678901234567890",
      "metadata": {
        "proposalId": "clx8765432",
        "mode": "ranked"
      },
      "createdAt": "2026-01-06T14:45:30.789Z"
    }
  ],
  "period": "Last 30 days"
}
```

**Dashboard Visualizations:**

**Event Timeline:**
- Line chart showing events over time
- Separate lines for each event type

**Event Distribution:**
- Bar chart of event counts

**Recent Activity Feed:**
- Live stream of recent events
- Color-coded by event type

**Sample Dashboard Code:**
```tsx
async function getEvents(eventType?: string) {
  const url = new URL(`${process.env.BOT_API_URL}/api/analytics/events`);
  if (eventType) url.searchParams.set('eventType', eventType);
  url.searchParams.set('days', '7');

  const res = await fetch(url.toString());
  return res.json();
}

export default async function EventsDashboard() {
  const { eventCounts, recentEvents } = await getEvents();

  return (
    <div>
      {/* Event counts */}
      <div className="grid grid-cols-5 gap-4">
        {eventCounts.map(event => (
          <div key={event.eventType} className="p-4 border rounded">
            <div className="text-xs text-gray-500">{event.eventType}</div>
            <div className="text-2xl font-bold">{event.count}</div>
          </div>
        ))}
      </div>

      {/* Recent events feed */}
      <div className="mt-8">
        <h3>Recent Events</h3>
        <div className="space-y-2">
          {recentEvents.map(event => (
            <div key={event.id} className="p-3 bg-gray-50 rounded">
              <div className="flex justify-between">
                <span className="font-medium">{event.eventType}</span>
                <span className="text-sm text-gray-500">
                  {new Date(event.createdAt).toLocaleString()}
                </span>
              </div>
              {event.metadata && (
                <pre className="text-xs mt-2 text-gray-600">
                  {JSON.stringify(event.metadata, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Useful Queries:**
```bash
# All events in last 7 days
curl "http://localhost:3000/api/analytics/events?days=7"

# Only match declines
curl "http://localhost:3000/api/analytics/events?eventType=match_declined_requeue&days=14"

# Only timeouts (last 100)
curl "http://localhost:3000/api/analytics/events?eventType=match_timeout&limit=100"

# Recent 50 events
curl "http://localhost:3000/api/analytics/events?limit=50"
```

---

### 6. GET /users

**Purpose:** User growth and activity metrics

**Query Parameters:**
- `days` (optional, default: 30) - Look back period

**Response Structure:**
```typescript
{
  totalUsers: number;           // All registered users
  newUsers: number;             // New users in period
  activeUsers: number;          // Users who ran commands in period
  usersByGame: {
    LOL: number;                // League of Legends users
    VAL: number;                // Valorant users
    unknown: number;            // Haven't queued yet
  };
  period: string;
}
```

**Example Response:**
```json
{
  "totalUsers": 342,
  "newUsers": 28,
  "activeUsers": 187,
  "usersByGame": {
    "LOL": 198,
    "VAL": 112,
    "unknown": 32
  },
  "period": "Last 30 days"
}
```

**Dashboard Visualizations:**

**User Growth:**
- Line chart of total users over time
- Area chart showing new users per day/week

**User Activity:**
- Active vs inactive users (donut chart)
- Activity rate percentage

**Game Distribution:**
- Pie chart: LOL vs VAL vs Unknown
- Stacked bar: User counts by game

**Sample Dashboard Code:**
```tsx
import { PieChart, Pie, Cell } from 'recharts';

async function getUserStats() {
  const res = await fetch(`${process.env.BOT_API_URL}/api/analytics/users?days=30`);
  return res.json();
}

export default async function UserDashboard() {
  const data = await getUserStats();

  const gameData = [
    { name: 'League of Legends', value: data.usersByGame.LOL, color: '#115F9A' },
    { name: 'Valorant', value: data.usersByGame.VAL, color: '#FF4655' },
    { name: 'Unknown', value: data.usersByGame.unknown, color: '#999' }
  ];

  const activityRate = Math.round((data.activeUsers / data.totalUsers) * 100);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-4xl font-bold">{data.totalUsers}</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-gray-500">New Users (30d)</div>
          <div className="text-4xl font-bold text-green-600">{data.newUsers}</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-gray-500">Activity Rate</div>
          <div className="text-4xl font-bold">{activityRate}%</div>
          <div className="text-xs text-gray-500">
            {data.activeUsers} of {data.totalUsers} active
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3>User Distribution by Game</h3>
        <PieChart width={400} height={400}>
          <Pie
            data={gameData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
          >
            {gameData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </div>
    </div>
  );
}
```

---

### 7. GET /daily-metrics

**Purpose:** Pre-aggregated daily statistics for time-series analysis

**Query Parameters:**
- `days` (optional, default: 30) - Number of days to return

**Response Structure:**
```typescript
{
  dailyMetrics: Array<{
    id: string;
    date: string;               // ISO date (YYYY-MM-DD)
    totalUsers: number;         // User count on that day
    newUsers: number;           // New registrations
    activeUsers: number;        // Users who ran commands
    totalQueueJoins: number;    // Queue entries
    totalMatches: number;       // Matches completed
    totalMatchDeclines: number; // Matches declined
    totalMatchTimeouts: number; // Matches timed out
    averageWaitTimeMin: number; // Avg wait time
    totalCommands: number;      // Commands executed
    totalLfgPosts: number;      // LFG posts created
    totalLfgCompletions: number;// LFG posts completed
    totalTenMansMatches: number;// 10-mans games
    createdAt: string;          // ISO timestamp
    updatedAt: string;          // ISO timestamp
  }>;
  period: string;
}
```

**Example Response:**
```json
{
  "dailyMetrics": [
    {
      "id": "clx1234567",
      "date": "2026-01-05T00:00:00.000Z",
      "totalUsers": 342,
      "newUsers": 5,
      "activeUsers": 89,
      "totalQueueJoins": 127,
      "totalMatches": 58,
      "totalMatchDeclines": 12,
      "totalMatchTimeouts": 7,
      "averageWaitTimeMin": 8.5,
      "totalCommands": 284,
      "totalLfgPosts": 34,
      "totalLfgCompletions": 28,
      "totalTenMansMatches": 3,
      "createdAt": "2026-01-06T00:01:00.000Z",
      "updatedAt": "2026-01-06T00:01:00.000Z"
    },
    {
      "id": "clx2345678",
      "date": "2026-01-04T00:00:00.000Z",
      "totalUsers": 337,
      "newUsers": 3,
      "activeUsers": 76,
      "totalQueueJoins": 98,
      "totalMatches": 42,
      "totalMatchDeclines": 9,
      "totalMatchTimeouts": 5,
      "averageWaitTimeMin": 9.2,
      "totalCommands": 231,
      "totalLfgPosts": 28,
      "totalLfgCompletions": 22,
      "totalTenMansMatches": 2,
      "createdAt": "2026-01-05T00:01:00.000Z",
      "updatedAt": "2026-01-05T00:01:00.000Z"
    }
  ],
  "period": "Last 30 days"
}
```

**Dashboard Visualizations:**

**Multi-line Chart:** Track metrics over time
- User growth (total users)
- New users per day
- Active users per day
- Matches per day

**Area Chart:** Queue activity
- Queue joins vs matches
- Show success rate trend

**Heatmap Calendar:** Daily activity
- Color intensity = activity level
- Click to see day details

**Sample Dashboard Code:**
```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

async function getDailyMetrics() {
  const res = await fetch(
    `${process.env.BOT_API_URL}/api/analytics/daily-metrics?days=30`
  );
  return res.json();
}

export default async function TrendsChart() {
  const { dailyMetrics } = await getDailyMetrics();

  // Format data for chart
  const chartData = dailyMetrics.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: day.totalUsers,
    matches: day.totalMatches,
    activeUsers: day.activeUsers,
    avgWaitTime: day.averageWaitTimeMin
  })).reverse(); // Oldest to newest

  return (
    <div>
      <h2>30-Day Trends</h2>
      <LineChart width={1000} height={400} data={chartData}>
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="users"
          stroke="#8884d8"
          name="Total Users"
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="activeUsers"
          stroke="#82ca9d"
          name="Active Users"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="matches"
          stroke="#ffc658"
          name="Matches"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="avgWaitTime"
          stroke="#ff7300"
          name="Avg Wait (min)"
        />
      </LineChart>
    </div>
  );
}
```

**Useful Queries:**
```bash
# Last 7 days for weekly overview
curl "http://localhost:3000/api/analytics/daily-metrics?days=7"

# Last 90 days for quarterly trends
curl "http://localhost:3000/api/analytics/daily-metrics?days=90"

# Full year
curl "http://localhost:3000/api/analytics/daily-metrics?days=365"
```

---

## Complete TypeScript Types

For type-safe dashboard development:

```typescript
// src/types/analytics.ts

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
  game: 'LOL' | 'VAL';
  mode: string;
  totalEntries: number;
  successfulMatches: number;
  matchRate: number;
  avgWaitTimeMinutes: number;
}

export interface CurrentQueueState {
  game: 'LOL' | 'VAL';
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
```

**Usage in Next.js:**
```typescript
import { OverviewResponse } from '@/types/analytics';

async function getOverview(): Promise<OverviewResponse> {
  const res = await fetch(`${process.env.BOT_API_URL}/api/analytics/overview`);
  if (!res.ok) throw new Error('Failed to fetch overview');
  return res.json();
}
```

---

## Dashboard Page Recommendations

### 1. Overview Dashboard (Home)
**Metrics:**
- Total users, matches, commands (from `/overview`)
- Match success rate gauge
- Recent 7-day trend sparklines
- Live queue status (from `/queues`)

### 2. Commands Page
**Visualizations:**
- Bar chart: Command usage
- Table: All commands (sortable)
- Line chart: Usage over time
- Success rate breakdown

### 3. Queue Analytics Page
**Visualizations:**
- Wait time trends by mode
- Match rate comparison
- Live queue status dashboard
- Peak hours heatmap

### 4. Match Analytics Page
**Visualizations:**
- Acceptance rate gauge
- Match outcome pie chart
- Funnel chart: Proposals → Matches
- Average match score trend

### 5. User Analytics Page
**Visualizations:**
- User growth chart (30/90 days)
- New vs returning users
- Game preference distribution
- User retention metrics

### 6. Events Timeline Page
**Visualizations:**
- Live activity feed
- Event distribution chart
- Filterable event log
- Event trends over time

### 7. Trends Page
**Visualizations:**
- Multi-line chart: All key metrics
- Compare date ranges
- Identify patterns
- Export data

---

## Polling & Real-Time Updates

For live dashboards, implement polling:

```typescript
'use client';

import { useEffect, useState } from 'react';
import type { CurrentQueueState } from '@/types/analytics';

export function LiveQueueStatus() {
  const [queueState, setQueueState] = useState<CurrentQueueState[]>([]);

  useEffect(() => {
    const fetchQueue = async () => {
      const res = await fetch('/api/analytics/queues');
      const data = await res.json();
      setQueueState(data.currentQueueState);
    };

    // Fetch immediately
    fetchQueue();

    // Poll every 15 seconds
    const interval = setInterval(fetchQueue, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {queueState.map(q => (
        <div key={`${q.game}-${q.mode}`} className="live-queue-card">
          <div className="game-badge">{q.game}</div>
          <div className="mode">{q.mode}</div>
          <div className="player-count">{q.waitingPlayers}</div>
          <div className="label">waiting</div>
        </div>
      ))}
    </div>
  );
}
```

---

## Error Handling

All endpoints return errors in this format:

```typescript
{
  error: string; // Error message
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error (database or internal issue)

**Example Error Response:**
```json
{
  "error": "Failed to fetch analytics overview"
}
```

**Handle in Dashboard:**
```typescript
async function getOverview() {
  try {
    const res = await fetch(`${process.env.BOT_API_URL}/api/analytics/overview`);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Unknown error');
    }

    return res.json();
  } catch (error) {
    console.error('Analytics error:', error);
    // Show error toast/banner to user
    return null;
  }
}
```

---

## Rate Limiting & Performance

**Current State:** No rate limiting (local/trusted use)

**For Production:**
1. Add rate limiting middleware
2. Implement caching (Redis/in-memory)
3. Add request logging
4. Set up monitoring alerts

**Caching Strategy:**
```typescript
// Cache responses for 5 minutes
const CACHE_TTL = 5 * 60 * 1000;

const cache = new Map();

router.get('/overview', async (req, res) => {
  const cached = cache.get('overview');

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json(cached.data);
  }

  // Fetch fresh data...
  const data = await getOverviewData();

  cache.set('overview', { data, timestamp: Date.now() });
  res.json(data);
});
```

---

## Complete Example: Next.js Dashboard

**Project Structure:**
```
dashboard/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 # Overview
│   ├── commands/page.tsx
│   ├── queues/page.tsx
│   ├── matches/page.tsx
│   ├── users/page.tsx
│   ├── events/page.tsx
│   └── trends/page.tsx
├── components/
│   ├── StatCard.tsx
│   ├── LiveQueueStatus.tsx
│   ├── CommandsChart.tsx
│   └── TrendsChart.tsx
├── lib/
│   └── analytics.ts             # API client
├── types/
│   └── analytics.ts             # TypeScript types
└── .env.local
```

**Environment Variables:**
```bash
# .env.local
BOT_API_URL=http://localhost:3000
# or production:
# BOT_API_URL=https://your-bot.com
```

**API Client (`lib/analytics.ts`):**
```typescript
import type * as T from '@/types/analytics';

const API_URL = process.env.BOT_API_URL || 'http://localhost:3000';

export async function getOverview(): Promise<T.OverviewResponse> {
  const res = await fetch(`${API_URL}/api/analytics/overview`, {
    next: { revalidate: 60 } // Cache for 60 seconds
  });
  return res.json();
}

export async function getCommands(days = 30, limit = 20): Promise<T.CommandsResponse> {
  const res = await fetch(
    `${API_URL}/api/analytics/commands?days=${days}&limit=${limit}`,
    { next: { revalidate: 300 } }
  );
  return res.json();
}

export async function getQueues(days = 30): Promise<T.QueuesResponse> {
  const res = await fetch(
    `${API_URL}/api/analytics/queues?days=${days}`,
    { next: { revalidate: 15 } } // Refresh every 15 seconds
  );
  return res.json();
}

// ... other functions
```

**Overview Page (`app/page.tsx`):**
```typescript
import { getOverview, getQueues } from '@/lib/analytics';
import StatCard from '@/components/StatCard';
import LiveQueueStatus from '@/components/LiveQueueStatus';

export default async function DashboardPage() {
  const [overview, queues] = await Promise.all([
    getOverview(),
    getQueues(7)
  ]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Bot Analytics Dashboard</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Users"
          value={overview.totalUsers}
          change={`+${overview.newUsersLast7Days} this week`}
        />
        <StatCard
          title="Total Matches"
          value={overview.totalMatches}
        />
        <StatCard
          title="Match Success"
          value={`${overview.matchSuccessRate}%`}
          variant={overview.matchSuccessRate > 50 ? 'success' : 'warning'}
        />
        <StatCard
          title="Total Commands"
          value={overview.totalCommands}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Live Queue Status</h2>
        <LiveQueueStatus initialData={queues.currentQueueState} />
      </div>
    </div>
  );
}
```

---

## Summary

You now have complete documentation for:
- ✅ 7 analytics endpoints with exact response structures
- ✅ TypeScript types for type-safe development
- ✅ Example visualizations for each endpoint
- ✅ Sample dashboard code (React/Next.js)
- ✅ Polling strategies for real-time data
- ✅ Error handling patterns
- ✅ Complete dashboard architecture

**Next Steps:**
1. Create Next.js dashboard project
2. Copy TypeScript types
3. Implement API client
4. Build overview page
5. Add authentication (NextAuth + Discord)
6. Deploy to Vercel

All endpoints are ready to use right now!
