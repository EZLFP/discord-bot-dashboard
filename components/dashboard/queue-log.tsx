"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QueueAction } from "@/types/analytics";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface QueueLogProps {
  actions: QueueAction[];
  period: string;
}

type Filter = "ALL" | "WAITING" | "MATCHED" | "LEFT";

export function QueueLog({ actions, period }: QueueLogProps) {
  const [filter, setFilter] = useState<Filter>("ALL");

  const filtered = useMemo(() => {
    if (filter === "ALL") return actions;
    return actions.filter((a) => a.status === filter);
  }, [actions, filter]);

  const getStatusDot = (status: string) => {
    switch (status) {
      case "MATCHED":
        return "bg-green-500";
      case "WAITING":
        return "bg-yellow-500";
      case "LEFT":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const getActionText = (action: QueueAction) => {
    switch (action.status) {
      case "MATCHED":
        return "was matched";
      case "WAITING":
        return "joined queue";
      case "LEFT":
        return "left queue";
      default:
        return action.status.toLowerCase();
    }
  };

  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "ALL" },
    { label: "Joins", value: "WAITING" },
    { label: "Matches", value: "MATCHED" },
    { label: "Leaves", value: "LEFT" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle>Queue Activity Log ({period})</CardTitle>
          <div className="flex gap-1">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                  filter === f.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filtered.map((action) => (
            <div
              key={action.id}
              className="flex gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors"
            >
              <div
                className={cn(
                  "h-2 w-2 rounded-full mt-2 flex-shrink-0",
                  getStatusDot(action.status)
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm">
                    <span className="font-medium">{action.username}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      {getActionText(action)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(action.updatedAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  <span className="font-medium">{action.game}</span>
                  <span className="capitalize"> {action.mode}</span>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No queue actions found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
