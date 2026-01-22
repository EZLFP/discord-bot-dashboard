import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { LiveQueueStatus } from "@/components/dashboard/live-queue-status";
import { MatchAnalytics } from "@/components/dashboard/match-analytics";
import { TrendsCharts } from "@/components/dashboard/trends-charts";
import { CommandsTable } from "@/components/dashboard/commands-table";
import { EventsFeed } from "@/components/dashboard/events-feed";
import { UserAnalytics } from "@/components/dashboard/user-analytics";
import { getQueues, getCommands } from "@/lib/analytics";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";

function LoadingSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  // Fetch data for client components
  const queuesData = await getQueues(1);
  const commandsData = await getCommands(30, 20);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 space-y-8">
        {/* Overview Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <Suspense fallback={<LoadingSkeleton />}>
            <OverviewCards />
          </Suspense>
        </section>

        {/* Live Queue Status */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Live Queue Status</h2>
          <LiveQueueStatus initialData={queuesData.currentQueueState} />
        </section>

        {/* Match Analytics */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Match Performance</h2>
          <Suspense fallback={<LoadingSkeleton />}>
            <MatchAnalytics />
          </Suspense>
        </section>

        {/* Trends Charts */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Trends (Last 30 Days)</h2>
          <Suspense fallback={<LoadingSkeleton />}>
            <TrendsCharts />
          </Suspense>
        </section>

        {/* Commands Table */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Command Statistics</h2>
          <CommandsTable
            commands={commandsData.commands}
            period={commandsData.period}
          />
        </section>

        {/* Two Column Layout for Events and Users */}
        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <Suspense fallback={<LoadingSkeleton />}>
              <EventsFeed />
            </Suspense>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">User Statistics</h2>
            <Suspense fallback={<LoadingSkeleton />}>
              <UserAnalytics />
            </Suspense>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>
            EZLFP Analytics Dashboard • Data updates every 1-2 minutes • Built
            with Next.js 14
          </p>
        </div>
      </footer>
    </div>
  );
}
