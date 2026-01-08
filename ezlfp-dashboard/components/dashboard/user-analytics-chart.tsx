"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface GameData {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

interface UserAnalyticsChartProps {
  data: GameData[];
}

export function UserAnalyticsChart({ data }: UserAnalyticsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={70}
          fill="#8884d8"
          dataKey="value"
          label={({ value, percent }) =>
            value > 0 ? `${((percent || 0) * 100).toFixed(0)}%` : ""
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
