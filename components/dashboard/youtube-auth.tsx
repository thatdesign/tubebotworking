"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Youtube } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface YouTubeAuthProps {
  variant?: 'default' | 'header';
}

export function YouTubeAuth({ variant = 'default' }: YouTubeAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // Validate required environment variables
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/youtube/callback`;
      const scopes = process.env.NEXT_PUBLIC_YOUTUBE_SCOPES || 
        'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl';

      if (!clientId || !redirectUri) {
        throw new Error("Missing YouTube authentication configuration");
      }

      const params = {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: scopes,
        access_type: 'offline',
        prompt: 'consent'  // Force prompt to ensure we get a refresh token
      };

      const YOUTUBE_OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth?' + 
        new URLSearchParams(params).toString();
      
      // Store the current URL in localStorage to redirect back after auth
      localStorage.setItem("youtubeAuthRedirect", window.location.pathname);
      
      // Redirect to YouTube OAuth
      window.location.href = YOUTUBE_OAUTH_URL;
    } catch (error) {
      console.error("Error connecting to YouTube:", error);
      
      // Provide user-friendly error notification
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to initiate YouTube connection",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'header') {
    return (
      <Button
        onClick={handleConnect}
        disabled={isLoading}
        size="sm"
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        <Youtube className="mr-2 h-4 w-4" />
        {isLoading ? "Connecting..." : "Connect Another Channel"}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading}
      className="w-full"
      variant="outline"
    >
      <Youtube className="mr-2 h-4 w-4" />
      {isLoading ? "Connecting..." : "Connect YouTube Channel"}
    </Button>
  );
}
