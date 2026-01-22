import { getDailyMetrics } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendsChartClient } from "./trends-chart-client";
import { format } from "date-fns";

export async function TrendsCharts() {
  const { dailyMetrics } = await getDailyMetrics(30);

  const chartData = dailyMetrics
    .map((day) => ({
      date: format(new Date(day.date), "MMM dd"),
      users: day.totalUsers,
      matches: day.totalMatches,
      queueJoins: day.totalQueueJoins,
      avgWait: day.averageWaitTimeMin,
    }))
    .reverse();

  const charts = [
    {
      title: "Total Users Over Time",
      dataKey: "users",
      color: "#3b82f6",
    },
    {
      title: "Matches Per Day",
      dataKey: "matches",
      color: "#10b981",
    },
    {
      title: "Queue Joins Per Day",
      dataKey: "queueJoins",
      color: "#f59e0b",
    },
    {
      title: "Average Wait Time (Minutes)",
      dataKey: "avgWait",
      color: "#ef4444",
    },
  ];

  return (
    <div className="space-y-6">
      {charts.map((chart) => (
        <Card key={chart.dataKey}>
          <CardHeader>
            <CardTitle>{chart.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendsChartClient
              data={chartData}
              dataKey={chart.dataKey}
              color={chart.color}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
