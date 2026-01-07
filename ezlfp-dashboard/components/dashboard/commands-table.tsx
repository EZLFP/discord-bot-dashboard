"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CommandStats } from "@/types/analytics";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn, formatPercentage } from "@/lib/utils";

interface CommandsTableProps {
  commands: CommandStats[];
  period: string;
}

type SortKey = keyof CommandStats;
type SortDirection = "asc" | "desc";

export function CommandsTable({ commands, period }: CommandsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("totalUsage");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const sortedCommands = [...commands].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    const modifier = sortDirection === "asc" ? 1 : -1;

    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal) * modifier;
    }

    return ((aVal as number) - (bVal as number)) * modifier;
  });

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
        <CardTitle>Command Usage ({period})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-medium">
                  <button
                    onClick={() => handleSort("commandName")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Command
                    <SortIcon columnKey="commandName" />
                  </button>
                </th>
                <th className="p-3 text-right font-medium">
                  <button
                    onClick={() => handleSort("totalUsage")}
                    className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
                  >
                    Total Usage
                    <SortIcon columnKey="totalUsage" />
                  </button>
                </th>
                <th className="p-3 text-right font-medium">
                  <button
                    onClick={() => handleSort("successRate")}
                    className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
                  >
                    Success Rate
                    <SortIcon columnKey="successRate" />
                  </button>
                </th>
                <th className="p-3 text-right font-medium">
                  <button
                    onClick={() => handleSort("avgExecutionTimeMs")}
                    className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
                  >
                    Avg Time (ms)
                    <SortIcon columnKey="avgExecutionTimeMs" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedCommands.map((command, index) => (
                <tr
                  key={command.commandName}
                  className={cn(
                    "border-b transition-colors hover:bg-muted/50",
                    index % 2 === 0 && "bg-muted/20"
                  )}
                >
                  <td className="p-3 font-mono font-medium">{command.commandName}</td>
                  <td className="p-3 text-right">{command.totalUsage.toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <span
                      className={cn(
                        "font-medium",
                        command.successRate >= 95
                          ? "text-green-600 dark:text-green-500"
                          : command.successRate >= 80
                          ? "text-yellow-600 dark:text-yellow-500"
                          : "text-red-600 dark:text-red-500"
                      )}
                    >
                      {formatPercentage(command.successRate)}
                    </span>
                  </td>
                  <td className="p-3 text-right text-muted-foreground">
                    {Math.round(command.avgExecutionTimeMs)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
