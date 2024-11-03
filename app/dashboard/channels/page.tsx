"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, Plus } from "lucide-react";

const channels = [
  {
    id: 1,
    name: "Tech Tutorials",
    subscribers: "125K",
    videos: 245,
    totalComments: "12.5K",
  },
  {
    id: 2,
    name: "Coding with AI",
    subscribers: "89K",
    videos: 178,
    totalComments: "8.2K",
  },
];

export default function ChannelsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Connected Channels</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Channel
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <Card key={channel.id} className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <Youtube className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold">{channel.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {channel.subscribers} subscribers
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Videos</p>
                <p className="font-semibold">{channel.videos}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Comments</p>
                <p className="font-semibold">{channel.totalComments}</p>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button className="w-full" variant="outline">View Details</Button>
              <Button className="w-full">Manage</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}