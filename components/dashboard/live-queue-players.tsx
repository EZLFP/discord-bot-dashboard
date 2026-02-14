"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchLiveQueuePlayers } from "@/lib/analytics";
import type { QueuePlayer } from "@/types/analytics";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface LiveQueuePlayersProps {
  initialData: QueuePlayer[];
}

interface QueueGroup {
  game: string;
  mode: string;
  players: QueuePlayer[];
}

export function LiveQueuePlayers({ initialData }: LiveQueuePlayersProps) {
  const [players, setPlayers] = useState<QueuePlayer[]>(initialData);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setLastUpdate(new Date());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsRefreshing(true);
        const data = await fetchLiveQueuePlayers();
        setPlayers(data.players);
        setLastUpdate(new Date());
      } catch (error) {
        console.error("Failed to fetch queue players:", error);
      } finally {
        setIsRefreshing(false);
      }
    };

    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  // Group players by game + mode
  const groups: QueueGroup[] = [];
  const groupMap = new Map<string, QueuePlayer[]>();
  for (const player of players) {
    const key = `${player.game}-${player.mode}`;
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key)!.push(player);
  }
  for (const [key, groupPlayers] of groupMap) {
    const [game, mode] = key.split("-");
    groups.push({ game, mode, players: groupPlayers });
  }

  const getGameBadgeColor = (game: string) => {
    return game === "LOL"
      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
      : "bg-red-500/10 text-red-600 dark:text-red-400";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Live Queue — Players</CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <RefreshCw
              className={cn("h-3 w-3", isRefreshing && "animate-spin")}
            />
            <span>
              Updated {lastUpdate ? lastUpdate.toLocaleTimeString() : "..."}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {groups.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No players currently in queue
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {groups.map((group) => (
              <div
                key={`${group.game}-${group.mode}`}
                className="rounded-lg border p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full",
                        getGameBadgeColor(group.game)
                      )}
                    >
                      {group.game}
                    </span>
                    <span className="text-sm font-medium capitalize">
                      {group.mode}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {group.players.length}{" "}
                    {group.players.length === 1 ? "player" : "players"}
                  </span>
                </div>
                <div className="space-y-2">
                  {group.players.map((player) => (
                    <div
                      key={player.userId}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <span className="font-medium">{player.username}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {player.rank}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(player.joinedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
