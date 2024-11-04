"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Youtube } from "lucide-react";
import { createClient } from "@/lib/supabase";

const YOUTUBE_OAUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl&access_type=offline`;

export function YouTubeAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleConnect = async () => {
    setIsLoading(true);
    try {
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
