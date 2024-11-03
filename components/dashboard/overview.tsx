"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const data = [
  { name: "Jan", total: 1234 },
  { name: "Feb", total: 2345 },
  { name: "Mar", total: 3456 },
  { name: "Apr", total: 4567 },
  { name: "May", total: 5678 },
  { name: "Jun", total: 6789 },
];

export function Overview() {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="total"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}