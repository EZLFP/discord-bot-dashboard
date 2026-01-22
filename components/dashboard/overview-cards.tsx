import { getOverview } from "@/lib/analytics";
import { StatCard } from "@/components/stat-card";
import { Users, Trophy, TrendingUp, Command } from "lucide-react";
import { formatNumber, formatPercentage } from "@/lib/utils";

export async function OverviewCards() {
  const data = await getOverview();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={formatNumber(data.totalUsers)}
        subtitle={`+${data.newUsersLast7Days} this week`}
        icon={Users}
      />
      <StatCard
        title="Total Matches"
        value={formatNumber(data.totalMatches)}
        subtitle={`${data.successfulMatches} successful`}
        icon={Trophy}
      />
      <StatCard
        title="Match Success Rate"
        value={formatPercentage(data.matchSuccessRate)}
        subtitle="Overall success"
        icon={TrendingUp}
      />
      <StatCard
        title="Total Commands"
        value={formatNumber(data.totalCommands)}
        subtitle="All-time usage"
        icon={Command}
      />
    </div>
  );
}
