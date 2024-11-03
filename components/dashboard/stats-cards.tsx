"use client";

import { Card } from "@/components/ui/card";
import { MessageSquare, ThumbsUp, AlertTriangle, BarChart } from "lucide-react";

const stats = [
  {
    title: "Total Comments",
    value: "12,345",
    change: "+12%",
    icon: MessageSquare,
  },
  {
    title: "Approved",
    value: "10,893",
    change: "+8%",
    icon: ThumbsUp,
  },
  {
    title: "Spam Detected",
    value: "452",
    change: "-5%",
    icon: AlertTriangle,
  },
  {
    title: "Engagement Rate",
    value: "8.5%",
    change: "+2%",
    icon: BarChart,
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="p-4 md:p-6">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{stat.title}</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className={`text-xs ${
                stat.change.startsWith("+") ? "text-green-500" : "text-red-500"
              }`}>
                {stat.change}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}