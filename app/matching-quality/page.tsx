import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { getMatchingQuality } from "@/lib/analytics";
import { MatchingQualityCards } from "@/components/dashboard/matching-quality-cards";
import { MatchingQualityCharts } from "@/components/dashboard/matching-quality-charts";

export default async function MatchingQualityPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const data = await getMatchingQuality(30);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Matching Quality</h1>
          <p className="text-muted-foreground mt-1">
            {data.period} — Metrics to evaluate matching algorithm performance
          </p>
        </div>

        {/* Metric cards */}
        <MatchingQualityCards data={data} />

        {/* Raw counts breakdown */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Raw Counts</h2>
          <MatchingQualityCharts data={data} />
        </section>
      </main>

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
