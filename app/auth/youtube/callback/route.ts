import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error);
    return NextResponse.redirect(
      new URL(`/dashboard/channels?error=${error}`, request.url)
    );
  }

  if (!code) {
    console.error("No code received in the callback");
    return NextResponse.redirect(
      new URL("/dashboard/channels?error=no_code", request.url)
    );
  }

  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Exchange the code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
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

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Token exchange error:", errorData);
      return NextResponse.redirect(
        new URL("/dashboard/channels?error=token_exchange_failed", request.url)
      );
    }

    const { access_token, refresh_token } = await tokenResponse.json();
    
    if (!access_token) {
      console.error("No access token received");
      return NextResponse.redirect(
        new URL("/dashboard/channels?error=no_access_token", request.url)
      );
    }

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

    if (!channelResponse.ok || !channelData.items?.length) {
      console.error("No channel found or API error:", JSON.stringify(channelData));
      return NextResponse.redirect(
        new URL("/dashboard/channels?error=channel_info_failed", request.url)
      );
    }

    const channel = channelData.items[0];

    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("User not authenticated");
      return NextResponse.redirect(
        new URL("/dashboard/channels?error=not_authenticated", request.url)
      );
    }

    // Prepare channel data for insertion
    const channelInsertData = {
      user_id: user.id,
      channel_id: channel.id,
      channel_title: channel.snippet.title,
      access_token: access_token,
      refresh_token: refresh_token,
      subscriber_count: channel.statistics.subscriberCount?.toString() || '0',
      video_count: parseInt(channel.statistics.videoCount || '0', 10),
      channel_data: channel,
    };

    console.log("Attempting to insert channel data:", JSON.stringify(channelInsertData, null, 2));

    // Upsert the actual channel data
    const { error: upsertError } = await supabase.from("youtube_channels").upsert(
      channelInsertData,
      {
        onConflict: 'channel_id,user_id'
      }
    );

    if (upsertError) {
      console.error("Detailed Database Error:", {
        message: upsertError.message,
        details: upsertError.details,
        hint: upsertError.hint,
        code: upsertError.code
      });
      return NextResponse.redirect(
        new URL(`/dashboard/channels?error=database_error&details=${encodeURIComponent(upsertError.message)}`, request.url)
      );
    }

    // Redirect back to the channels page with success
    return NextResponse.redirect(
      new URL("/dashboard/channels?success=true", request.url)
    );
  } catch (error) {
    console.error("Comprehensive Error in YouTube callback:", error);
    return NextResponse.redirect(
      new URL("/dashboard/channels?error=auth_failed", request.url)
    );
  }
}
