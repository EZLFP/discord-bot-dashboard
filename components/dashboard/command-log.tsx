"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CommandLogEntry, BotGuild } from "@/types/analytics";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface CommandLogProps {
  entries: CommandLogEntry[];
  total: number;
  period: string;
  guilds: BotGuild[];
}

type SortKey = "createdAt" | "username" | "commandName";
type SortDirection = "asc" | "desc";

export function CommandLog({ entries, total, period, guilds }: CommandLogProps) {
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filterCommand, setFilterCommand] = useState<string>("");
  const [filterGuild, setFilterGuild] = useState<string>("");

  const guildMap = useMemo(
    () => new Map(guilds.map((g) => [g.id, g.name])),
    [guilds]
  );

  const uniqueCommands = useMemo(
    () => [...new Set(entries.map((e) => e.commandName))].sort(),
    [entries]
  );

  const uniqueGuildIds = useMemo(
    () => [...new Set(entries.map((e) => e.guildId).filter(Boolean))] as string[],
    [entries]
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection(key === "createdAt" ? "desc" : "asc");
    }
  };

  const filtered = useMemo(() => {
    let result = entries;
    if (filterCommand) {
      result = result.filter((e) => e.commandName === filterCommand);
    }
    if (filterGuild) {
      result = result.filter((e) => e.guildId === filterGuild);
    }
    return result;
  }, [entries, filterCommand, filterGuild]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const modifier = sortDirection === "asc" ? 1 : -1;
      if (sortKey === "createdAt") {
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * modifier;
      }
      return a[sortKey].localeCompare(b[sortKey]) * modifier;
    });
  }, [filtered, sortKey, sortDirection]);

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return <ArrowUpDown className="h-3 w-3" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle>
            Command Log ({period})
            <span className="text-sm font-normal text-muted-foreground ml-2">
              {filtered.length} of {total} entries
            </span>
          </CardTitle>
          <div className="flex gap-2">
            <select
              value={filterCommand}
              onChange={(e) => setFilterCommand(e.target.value)}
              className="text-xs rounded-md border bg-background px-2 py-1"
            >
              <option value="">All Commands</option>
              {uniqueCommands.map((cmd) => (
                <option key={cmd} value={cmd}>
                  {cmd}
                </option>
              ))}
            </select>
            <select
              value={filterGuild}
              onChange={(e) => setFilterGuild(e.target.value)}
              className="text-xs rounded-md border bg-background px-2 py-1"
            >
              <option value="">All Servers</option>
              {uniqueGuildIds.map((gId) => (
                <option key={gId} value={gId}>
                  {guildMap.get(gId) || gId}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border max-h-[600px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-background">
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-medium">
                  <button
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Timestamp
                    <SortIcon columnKey="createdAt" />
                  </button>
                </th>
                <th className="p-3 text-left font-medium">
                  <button
                    onClick={() => handleSort("username")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    User
                    <SortIcon columnKey="username" />
                  </button>
                </th>
                <th className="p-3 text-left font-medium">
                  <button
                    onClick={() => handleSort("commandName")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Command
                    <SortIcon columnKey="commandName" />
                  </button>
                </th>
                <th className="p-3 text-left font-medium">Server</th>
                <th className="p-3 text-right font-medium">Status</th>
                <th className="p-3 text-right font-medium">Exec Time</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry, index) => (
                <tr
                  key={entry.id}
                  className={cn(
                    "border-b transition-colors hover:bg-muted/50",
                    index % 2 === 0 && "bg-muted/20"
                  )}
                >
                  <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(entry.createdAt), {
                      addSuffix: true,
                    })}
                  </td>
                  <td className="p-3 font-medium">{entry.username}</td>
                  <td className="p-3 font-mono">{entry.commandName}</td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {entry.guildId
                      ? guildMap.get(entry.guildId) || entry.guildId
                      : "—"}
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full",
                        entry.success
                          ? "bg-green-500/10 text-green-600 dark:text-green-500"
                          : "bg-red-500/10 text-red-600 dark:text-red-500"
                      )}
                    >
                      {entry.success ? "OK" : "Failed"}
                    </span>
                  </td>
                  <td className="p-3 text-right text-muted-foreground text-xs">
                    {entry.executionTimeMs != null
                      ? `${entry.executionTimeMs}ms`
                      : "—"}
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No command log entries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
