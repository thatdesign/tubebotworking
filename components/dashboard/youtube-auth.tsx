"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Youtube } from "lucide-react";
import { createClient } from "@/lib/supabase";

interface YouTubeAuthProps {
  variant?: 'default' | 'header';
}

export function YouTubeAuth({ variant = 'default' }: YouTubeAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const params = {
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/youtube/callback`,
        response_type: 'code',
        scope: process.env.NEXT_PUBLIC_YOUTUBE_SCOPES || '',
        access_type: 'offline',
        prompt: 'consent'  // Force prompt to ensure we get a refresh token
      };

      const YOUTUBE_OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth?' + 
        new URLSearchParams(params).toString();
      
      // Store the current URL in localStorage to redirect back after auth
      localStorage.setItem("youtubeAuthRedirect", window.location.pathname);
      window.location.href = YOUTUBE_OAUTH_URL;
    } catch (error) {
      console.error("Error connecting to YouTube:", error);
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
