"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Youtube } from "lucide-react";
import { createClient } from "@/lib/supabase";

// Define required YouTube API scopes
const YOUTUBE_SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',        // View channel info
  'https://www.googleapis.com/auth/youtube.force-ssl',       // Manage comments
  'https://www.googleapis.com/auth/youtube.channel-memberships.creator', // Access channel memberships
  'https://www.googleapis.com/auth/youtubepartner',         // Access and manage YouTube account
  'https://www.googleapis.com/auth/youtube',                // Manage account
].join(' ');

export function YouTubeAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const YOUTUBE_OAUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?` + 
        new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/youtube/callback`,
          response_type: 'code',
          scope: YOUTUBE_SCOPES,
          access_type: 'offline',
          prompt: 'consent'  // Force prompt to ensure we get a refresh token
        }).toString();
      
      // Store the current URL in localStorage to redirect back after auth
      localStorage.setItem("youtubeAuthRedirect", window.location.pathname);
      window.location.href = YOUTUBE_OAUTH_URL;
    } catch (error) {
      console.error("Error connecting to YouTube:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
