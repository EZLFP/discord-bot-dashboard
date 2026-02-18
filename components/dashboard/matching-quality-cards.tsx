import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MatchingQualityResponse } from "@/types/analytics";
import { formatPercentage, formatDuration } from "@/lib/utils";
import {
  CheckCircle,
  ThumbsUp,
  MessageSquare,
  Send,
  RefreshCw,
  Clock,
  Users,
} from "lucide-react";

interface MatchingQualityCardsProps {
  data: MatchingQualityResponse;
}

export function MatchingQualityCards({ data }: MatchingQualityCardsProps) {
  return (
    <div className="space-y-6">
      {/* Top row: 4 rate metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Acceptance Rate"
          value={formatPercentage(data.acceptanceRate)}
          subtitle={`${data.counts.matchedProposals} matched of ${data.counts.matchedProposals + data.counts.declinedProposals + data.counts.timedOutProposals} resolved`}
          icon={CheckCircle}
          className="border-l-4 border-l-green-500"
        />
        <StatCard
          title="Positive Feedback"
          value={formatPercentage(data.positiveFeedbackRatio)}
          subtitle={`${data.counts.positiveFeedback} positive, ${data.counts.negativeFeedback} negative`}
          icon={ThumbsUp}
          className="border-l-4 border-l-blue-500"
        />
        <StatCard
          title="Feedback Submission"
          value={formatPercentage(data.feedbackSubmissionRate)}
          subtitle={`${data.counts.totalFeedback} feedback from ${data.counts.matchedProposals * 2} possible`}
          icon={MessageSquare}
          className="border-l-4 border-l-amber-500"
        />
        <StatCard
          title="/lf Acceptance Rate"
          value={formatPercentage(data.lfRequestAcceptanceRate)}
          subtitle={`${data.counts.lfAccepted} accepted of ${data.counts.lfTotal} total`}
          icon={Send}
          className="border-l-4 border-l-purple-500"
        />
      </div>

      {/* Second row: 3 detail cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Re-queue Rate
            </CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatPercentage(data.reQueueRate)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Re-queued</span>
                <span className="font-medium">{data.counts.requeues}</span>
              </div>
              <div className="flex justify-between">
                <span>Left queue</span>
                <span className="font-medium">{data.counts.leaves}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Time to Match
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatDuration(data.timeToMatch.medianMinutes)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Average</span>
                <span className="font-medium">
                  {formatDuration(data.timeToMatch.avgMinutes)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Median (p50)</span>
                <span className="font-medium">
                  {formatDuration(data.timeToMatch.medianMinutes)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>p95</span>
                <span className="font-medium">
                  {formatDuration(data.timeToMatch.p95Minutes)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-pink-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Repeat Pairs
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {data.repeatMatching.repeatPairCount}
            </div>
            <div className="mt-2 text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Repeat pairs</span>
                <span className="font-medium">
                  {data.repeatMatching.repeatPairCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total repeat matches</span>
                <span className="font-medium">
                  {data.repeatMatching.totalRepeatMatches}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
