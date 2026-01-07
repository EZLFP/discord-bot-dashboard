import { getMatches } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchAnalyticsChart } from "./match-analytics-chart";
import { formatPercentage } from "@/lib/utils";

export async function MatchAnalytics() {
  const { matchStatusBreakdown } = await getMatches(30);

  const pieData = [
    { name: "Matched", value: matchStatusBreakdown.matched, color: "#10b981" },
    { name: "Declined", value: matchStatusBreakdown.declined, color: "#f59e0b" },
    { name: "Timed Out", value: matchStatusBreakdown.timedOut, color: "#ef4444" },
    { name: "Pending", value: matchStatusBreakdown.pending, color: "#6b7280" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Match Analytics (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Stats */}
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Acceptance Rate</div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-500">
                {formatPercentage(matchStatusBreakdown.acceptanceRate)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Average Match Score</div>
              <div className="text-2xl font-semibold">
                {Math.round(matchStatusBreakdown.avgMatchScore)}/100
              </div>
            </div>
            <div className="space-y-2">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="flex items-center justify-center">
            <MatchAnalyticsChart data={pieData} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
