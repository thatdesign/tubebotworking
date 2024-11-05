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

interface YouTubeVideo {
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    title: string;
    publishedAt: string;
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
      // First fetch recent videos from the channel
      const videosResponse = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel.channel_id}&maxResults=50&order=date&type=video&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`,
        {
          headers: {
            'Authorization': `Bearer ${channel.access_token}`,
            'Accept': 'application/json',
          }
        }
      );

      if (!videosResponse.ok) {
        throw new Error(`YouTube API error: ${videosResponse.statusText}`);
      }

      const videosData = await videosResponse.json();
      const videos: YouTubeVideo[] = videosData.items;
      
      // For each video, fetch its comments
      for (const video of videos) {
        const commentsResponse = await fetch(
          `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${video.id.videoId}&maxResults=100&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`,
          {
            headers: {
              'Authorization': `Bearer ${channel.access_token}`,
              'Accept': 'application/json',
            }
          }
        );

        if (!commentsResponse.ok) {
          console.error(`Error fetching comments for video ${video.id.videoId}: ${commentsResponse.statusText}`);
          continue;
        }

        const commentsData = await commentsResponse.json();
        const comments: YouTubeComment[] = commentsData.items || [];

        // Store comments in Supabase
        for (const comment of comments) {
          const { error } = await supabase
            .from('youtube_comments')
            .upsert({
              channel_id: channel.channel_id,
              video_id: video.id.videoId,
              comment_id: comment.id,
              author_name: comment.snippet.topLevelComment.snippet.authorDisplayName,
              author_profile_image_url: comment.snippet.topLevelComment.snippet.authorProfileImageUrl,
              text: comment.snippet.topLevelComment.snippet.textDisplay,
              video_title: video.snippet.title,
              published_at: comment.snippet.topLevelComment.snippet.publishedAt,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'comment_id'
            });

          if (error) {
            console.error('Error storing comment:', error);
          }
        }
      }
    } catch (error) {
      console.error(`Error processing channel ${channel.channel_id}:`, error);
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
