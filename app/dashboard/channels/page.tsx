"use client";

export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YouTubeAuth } from "@/components/dashboard/youtube-auth";
import { ChannelCard } from "@/components/dashboard/channel-card";
import { createClient } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function ChannelsPage() {
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: channels, error } = await supabase
          .from("youtube_channels")
          .select("*")
          .eq("user_id", user.id);

        if (error) throw error;
        setChannels(channels || []);
      }
    } catch (error) {
      console.error("Error fetching channels:", error);
      toast({
        title: "Error",
        description: "Failed to load channels. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageChannel = (channelId: string) => {
    // TODO: Implement channel management functionality
    console.log("Managing channel:", channelId);
  };

  const handleDisconnectChannel = async (channelId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("youtube_channels")
        .delete()
        .eq("user_id", user.id)
        .eq("channel_id", channelId);

      if (error) throw error;

      // Update local state to remove the disconnected channel
      setChannels(channels.filter(channel => channel.channel_data.id !== channelId));

      toast({
        title: "Success",
        description: "Channel disconnected successfully",
      });
    } catch (error) {
      console.error("Error disconnecting channel:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect channel. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Connected Channels</h1>
        {channels.length > 0 && <YouTubeAuth variant="header" />}
      </div>

      {channels.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No channels connected</h3>
          <p className="text-muted-foreground mb-4">
            Connect your YouTube channel to start managing comments
          </p>
          <YouTubeAuth />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {channels.map((channel) => (
            <ChannelCard
              key={channel.channel_id}
              channel={channel}
              onManage={handleManageChannel}
              onDisconnect={handleDisconnectChannel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
