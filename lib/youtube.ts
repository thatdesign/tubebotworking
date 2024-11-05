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
  if (!user) {
    console.warn('No authenticated user found');
    return;
  }

  // Get all connected channels
  const { data: channels, error: channelsError } = await supabase
    .from('youtube_channels')
    .select('*')
    .eq('user_id', user.id);

  if (channelsError) {
    console.warn('Error fetching channels:', channelsError);
    return;
  }

  if (!channels || channels.length === 0) {
    console.warn('No channels found for user');
    return;
  }

  console.log(`Found ${channels.length} channels`);

  for (const channel of channels) {
    try {
      console.log(`Processing channel ${channel.channel_id}`);
      
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
        console.warn(`Error fetching videos: ${videosResponse.statusText}`);
        const errorData = await videosResponse.json();
        console.warn('Video API Error:', errorData);
        continue;
      }

      const videosData = await videosResponse.json();
      const videos: YouTubeVideo[] = videosData.items;
      console.log(`Found ${videos.length} videos for channel ${channel.channel_id}`);
      
      // For each video, fetch its comments
      for (const video of videos) {
        console.log(`Fetching comments for video ${video.id.videoId}`);
        
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
          console.warn(`Error fetching comments for video ${video.id.videoId}: ${commentsResponse.statusText}`);
          const errorData = await commentsResponse.json();
          console.warn('Comments API Error:', errorData);
          continue;
        }

        const commentsData = await commentsResponse.json();
        const comments: YouTubeComment[] = commentsData.items || [];
        console.log(`Found ${comments.length} comments for video ${video.id.videoId}`);

        // Store comments in Supabase
        for (const comment of comments) {
          try {
            const commentData = {
              channel_id: channel.channel_id,
              video_id: video.id.videoId,
              comment_id: comment.id,
              author_name: comment.snippet.topLevelComment.snippet.authorDisplayName,
              author_profile_image_url: comment.snippet.topLevelComment.snippet.authorProfileImageUrl,
              text: comment.snippet.topLevelComment.snippet.textDisplay,
              video_title: video.snippet.title,
              published_at: comment.snippet.topLevelComment.snippet.publishedAt,
              updated_at: new Date().toISOString(),
            };
            
            console.log('Storing comment:', commentData);
            
            const { error: upsertError } = await supabase
              .from('youtube_comments')
              .upsert(commentData, {
                onConflict: 'comment_id'
              });

            if (upsertError) {
              console.warn('Error storing comment:', {
                error: upsertError,
                comment: commentData,
                details: upsertError.details,
                hint: upsertError.hint,
                code: upsertError.code
              });
            }
          } catch (err) {
            console.warn('Error processing comment:', err);
          }
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.warn(`Error processing channel ${channel.channel_id}:`, error.message);
    }
  }
}

export async function getRecentComments() {
  const supabase = createClient();
  
  try {
    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn('No authenticated user found');
      return [];
    }

    // Get all connected channels
    const { data: channels, error: channelsError } = await supabase
      .from('youtube_channels')
      .select('channel_id')
      .eq('user_id', user.id);

    if (channelsError) {
      console.warn('Error fetching channels:', channelsError);
      return [];
    }

    if (!channels || channels.length === 0) {
      console.warn('No channels found for user');
      return [];
    }

    console.log(`Found ${channels.length} channels for comment fetching`);
    console.log('Channel IDs:', channels.map(c => c.channel_id));

    // Get comments for all channels the user has access to
    const { data: comments, error: commentsError } = await supabase
      .from('youtube_comments')
      .select('*')
      .in('channel_id', channels.map(c => c.channel_id))
      .order('published_at', { ascending: false });

    if (commentsError) {
      console.warn('Error fetching comments:', {
        error: commentsError,
        details: commentsError.details,
        hint: commentsError.hint,
        code: commentsError.code
      });
      return [];
    }

    console.log(`Retrieved ${comments?.length || 0} comments from database`);
    if (comments && comments.length > 0) {
      console.log('Sample comment:', comments[0]);
    }
    
    return comments || [];
  } catch (err) {
    console.warn('Error in getRecentComments:', err);
    return [];
  }
}
