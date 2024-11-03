export const dynamic = 'force-dynamic'

"use client";

import { Card } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentComments } from "@/components/dashboard/recent-comments";
import { StatsCards } from "@/components/dashboard/stats-cards";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
      
      <StatsCards />
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4 p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Analytics Overview</h2>
          <Overview />
        </Card>
        
        <Card className="lg:col-span-3 p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Comments</h2>
          <RecentComments />
        </Card>
      </div>
    </div>
  );
}
