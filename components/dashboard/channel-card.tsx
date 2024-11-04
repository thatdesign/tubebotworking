"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube } from "lucide-react";

interface ChannelCardProps {
  channel: {
    channel_title: string;
    subscriber_count: string;
    video_count: number;
    channel_data: any;
  };
  onManage: (channelId: string) => void;
}

export function ChannelCard({ channel, onManage }: ChannelCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
          <Youtube className="h-6 w-6 text-red-500" />
        </div>
        <div>
          <h3 className="font-semibold">{channel.channel_title}</h3>
          <p className="text-sm text-muted-foreground">
            {parseInt(channel.subscriber_count).toLocaleString()} subscribers
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Videos</p>
          <p className="font-semibold">{channel.video_count}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Comments</p>
          <p className="font-semibold">
            {parseInt(channel.channel_data.statistics.commentCount || "0").toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="mt-4 flex gap-2">
        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => window.open(`https://youtube.com/channel/${channel.channel_data.id}`, '_blank')}
        >
          View Channel
        </Button>
        <Button 
          className="w-full"
          onClick={() => onManage(channel.channel_data.id)}
        >
          Manage
        </Button>
      </div>
    </Card>
  );
}
