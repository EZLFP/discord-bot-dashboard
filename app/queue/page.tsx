import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { LiveQueuePlayers } from "@/components/dashboard/live-queue-players";
import { QueueLog } from "@/components/dashboard/queue-log";
import { getQueuePlayers, getQueueLog } from "@/lib/analytics";

export default async function QueuePage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const [queuePlayersData, queueLogData] = await Promise.all([
    getQueuePlayers(),
    getQueueLog(7, 100),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 space-y-8">
        {/* Live Queue Players */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Live Queue — Players</h2>
          <LiveQueuePlayers initialData={queuePlayersData.players} />
        </section>

        {/* Queue Activity Log */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Queue Activity Log</h2>
          <QueueLog
            actions={queueLogData.actions}
            period={queueLogData.period}
          />
        </section>
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
