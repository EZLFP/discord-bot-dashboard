"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MatchingQualityResponse } from "@/types/analytics";

interface MatchingQualityChartsProps {
  data: MatchingQualityResponse;
}

export function MatchingQualityCharts({ data }: MatchingQualityChartsProps) {
  const proposalRows = [
    { label: "Total Proposals", value: data.counts.totalProposals },
    { label: "Matched", value: data.counts.matchedProposals },
    { label: "Declined", value: data.counts.declinedProposals },
    { label: "Timed Out", value: data.counts.timedOutProposals },
  ];

  const feedbackRows = [
    { label: "Total Feedback", value: data.counts.totalFeedback },
    { label: "Positive", value: data.counts.positiveFeedback },
    { label: "Negative", value: data.counts.negativeFeedback },
  ];

  const declineRows = [
    { label: "Re-queued", value: data.counts.requeues },
    { label: "Left Queue", value: data.counts.leaves },
  ];

  const lfRows = [
    { label: "Total /lf Requests", value: data.counts.lfTotal },
    { label: "Accepted", value: data.counts.lfAccepted },
    { label: "Declined", value: data.counts.lfDeclined },
    { label: "Expired", value: data.counts.lfExpired },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <CountsCard title="Match Proposals" rows={proposalRows} />
      <CountsCard title="Match Feedback" rows={feedbackRows} />
      <CountsCard title="Decline Actions" rows={declineRows} />
      <CountsCard title="/lf Requests" rows={lfRows} />
    </div>
  );
}

function CountsCard({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: number }[];
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-mono font-medium">{row.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
