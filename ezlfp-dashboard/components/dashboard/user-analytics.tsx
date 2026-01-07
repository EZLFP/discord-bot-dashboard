import { getUsers } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAnalyticsChart } from "./user-analytics-chart";

export async function UserAnalytics() {
  const data = await getUsers(30);

  const gameData = [
    {
      name: "League of Legends",
      value: data.usersByGame.LOL,
      color: "#115F9A",
    },
    { name: "Valorant", value: data.usersByGame.VAL, color: "#FF4655" },
    { name: "Unknown", value: data.usersByGame.unknown, color: "#6b7280" },
  ];

  const activityRate = Math.round((data.activeUsers / data.totalUsers) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Analytics (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Stats */}
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Total Users</div>
              <div className="text-4xl font-bold">{data.totalUsers}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">New Users</div>
              <div className="text-2xl font-semibold text-green-600 dark:text-green-500">
                +{data.newUsers}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Activity Rate</div>
              <div className="text-2xl font-semibold">{activityRate}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                {data.activeUsers} of {data.totalUsers} users active
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-sm font-medium mb-2">Game Distribution</div>
            <UserAnalyticsChart data={gameData} />
            <div className="mt-4 space-y-1">
              {gameData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}:</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
