import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    try {
      const supabase = createRouteHandlerClient({ cookies });
      
      // Exchange the code for tokens
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/youtube/callback`,
          grant_type: "authorization_code",
        }),
      });

      const { access_token, refresh_token } = await response.json();

      // Get user's YouTube channel info
      const channelResponse = await fetch(
        "https://youtube.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const channelData = await channelResponse.json();
      const channel = channelData.items[0];

      // Store the tokens and channel info in Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from("youtube_channels").upsert({
          user_id: user.id,
          channel_id: channel.id,
          channel_title: channel.snippet.title,
          access_token,
          refresh_token,
          subscriber_count: channel.statistics.subscriberCount,
          video_count: channel.statistics.videoCount,
          channel_data: channel,
        });
      }

      // Redirect back to the channels page
      return NextResponse.redirect(new URL("/dashboard/channels", request.url));
    } catch (error) {
      console.error("Error in YouTube callback:", error);
      return NextResponse.redirect(
        new URL("/dashboard/channels?error=auth_failed", request.url)
      );
    }
  }

  return NextResponse.redirect(
    new URL("/dashboard/channels?error=no_code", request.url)
  );
}
