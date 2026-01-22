import { getEvents } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export async function EventsFeed() {
  const { recentEvents } = await getEvents(undefined, 7, 20);

  const getEventColor = (eventType: string) => {
    if (eventType.includes("success")) return "bg-green-500";
    if (eventType.includes("declined") || eventType.includes("timeout"))
      return "bg-red-500";
    if (eventType.includes("requeue")) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const formatEventType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Events (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {recentEvents.map((event) => (
            <div
              key={event.id}
              className="flex gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors"
            >
              <div
                className={cn(
                  "h-2 w-2 rounded-full mt-2 flex-shrink-0",
                  getEventColor(event.eventType)
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-sm">
                    {formatEventType(event.eventType)}
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(event.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                {event.metadata && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {Object.entries(event.metadata).map(([key, value]) => (
                      <span key={key} className="mr-3">
                        <span className="font-medium">{key}:</span>{" "}
                        {String(value)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {recentEvents.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No recent events
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
