"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchLiveQueues } from "@/lib/analytics";
import type { CurrentQueueState } from "@/types/analytics";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

interface LiveQueueStatusProps {
  initialData: CurrentQueueState[];
}

export function LiveQueueStatus({ initialData }: LiveQueueStatusProps) {
  const [queueState, setQueueState] = useState<CurrentQueueState[]>(initialData);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        setIsRefreshing(true);
        const data = await fetchLiveQueues();
        setQueueState(data.currentQueueState);
        setLastUpdate(new Date());
      } catch (error) {
        console.error("Failed to fetch queue data:", error);
      } finally {
        setIsRefreshing(false);
      }
    };

    // Poll every 15 seconds
    const interval = setInterval(fetchQueue, 15000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (count: number) => {
    if (count >= 5) return "bg-green-500";
    if (count >= 2) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusText = (count: number) => {
    if (count >= 5) return "Active";
    if (count >= 2) return "Low";
    return "Empty";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Live Queue Status</CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
            <span>
              Updated {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {queueState.map((queue) => (
            <div
              key={`${queue.game}-${queue.mode}`}
              className="rounded-lg border p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", getStatusColor(queue.waitingPlayers))} />
                  <span className="text-sm font-medium">{queue.game}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {getStatusText(queue.waitingPlayers)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground capitalize mb-1">{queue.mode}</div>
              <div className="text-2xl font-bold">{queue.waitingPlayers}</div>
              <div className="text-xs text-muted-foreground">
                {queue.waitingPlayers === 1 ? "player" : "players"} waiting
              </div>
            </div>
          ))}
        </div>
        {queueState.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No active queues
          </div>
        )}
      </CardContent>
    </Card>
  );
}
