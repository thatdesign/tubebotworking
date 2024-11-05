import { createClient } from '@/lib/supabase';

interface YouTubeComment {
  id: string;
  snippet: {
    topLevelComment: {
      snippet: {
        authorDisplayName: string;
        authorProfileImageUrl: string;
        textDisplay: string;
        publishedAt: string;
      }
    }
    videoId: string;
  }
}

export async function fetchAndStoreComments() {
  const supabase = createClient();
  
  // Get the authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Get all connected channels
  const { data: channels } = await supabase
    .from('youtube_channels')
    .select('*')
    .eq('user_id', user.id);

  if (!channels || channels.length === 0) return;

  for (const channel of channels) {
    try {
      // Fetch comments from YouTube API
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&allThreadsRelatedToChannelId=${channel.channel_id}&maxResults=100&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`,
        {
          headers: {
            'Authorization': `Bearer ${channel.access_token}`,
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.statusText}`);
      }

      const data = await response.json();
      const comments: YouTubeComment[] = data.items;

      // Get video details for the comments
      const videoIds = Array.from(new Set(comments.map(comment => comment.snippet.videoId)));
      const videoDetailsResponse = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds.join(',')}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`,
        {
          headers: {
            'Authorization': `Bearer ${channel.access_token}`,
            'Accept': 'application/json',
          }
        }
      );

      if (!videoDetailsResponse.ok) {
        throw new Error(`YouTube API error: ${videoDetailsResponse.statusText}`);
      }

      const videoData = await videoDetailsResponse.json();
      const videoTitles = Object.fromEntries(
        videoData.items.map((video: any) => [video.id, video.snippet.title])
      );

      // Store comments in Supabase
      for (const comment of comments) {
        const { error } = await supabase
          .from('youtube_comments')
          .upsert({
            channel_id: channel.channel_id,
            video_id: comment.snippet.videoId,
            comment_id: comment.id,
            author_name: comment.snippet.topLevelComment.snippet.authorDisplayName,
            author_profile_image_url: comment.snippet.topLevelComment.snippet.authorProfileImageUrl,
            text: comment.snippet.topLevelComment.snippet.textDisplay,
            video_title: videoTitles[comment.snippet.videoId],
            published_at: comment.snippet.topLevelComment.snippet.publishedAt,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'comment_id'
          });

        if (error) {
          console.error('Error storing comment:', error);
        }
      }
    } catch (error) {
      console.error(`Error fetching comments for channel ${channel.channel_id}:`, error);
    }
  }
}

export async function getRecentComments() {
  const supabase = createClient();
  
  const { data: comments, error } = await supabase
    .from('youtube_comments')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return comments;
}
