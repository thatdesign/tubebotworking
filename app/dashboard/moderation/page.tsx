"use client";

export const dynamic = 'force-dynamic'

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AutoModeration } from "@/components/dashboard/auto-moderation";
import { ModRules } from "@/components/dashboard/mod-rules";

export default function ModerationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Moderation Settings</h1>
      
      <Tabs defaultValue="auto" className="space-y-6">
        <TabsList>
          <TabsTrigger value="auto">Auto-Moderation</TabsTrigger>
          <TabsTrigger value="rules">Moderation Rules</TabsTrigger>
        </TabsList>
        
        <TabsContent value="auto" className="space-y-6">
          <AutoModeration />
        </TabsContent>
        
        <TabsContent value="rules" className="space-y-6">
          <ModRules />
        </TabsContent>
      </Tabs>
    </div>
  );
}
