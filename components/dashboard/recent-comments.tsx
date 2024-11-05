"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThumbsUp, ThumbsDown, Flag } from "lucide-react";
import { fetchAndStoreComments, getRecentComments } from "@/lib/youtube";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  author_name: string;
  author_profile_image_url: string;
  text: string;
  video_title: string;
  published_at: string;
}

export function RecentComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadComments() {
      try {
        // First fetch new comments from YouTube
        await fetchAndStoreComments();
        
        // Then get recent comments from our database
        const recentComments = await getRecentComments();
        setComments(recentComments);
      } catch (error) {
        console.error("Error loading comments:", error);
      } finally {
        setLoading(false);
      }
    }

    loadComments();

    // Refresh comments every 5 minutes
    const interval = setInterval(loadComments, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <p className="text-muted-foreground">Loading comments...</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <p className="text-muted-foreground">No comments yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[350px] pr-4">
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
              <AvatarImage src={comment.author_profile_image_url} />
              <AvatarFallback>{comment.author_name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{comment.author_name}</p>
                  <p className="text-xs text-muted-foreground">
                    on {comment.video_title}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.published_at), { addSuffix: true })}
                </p>
              </div>
              <p className="text-sm">{comment.text}</p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button variant="ghost" size="sm">
                  <Flag className="h-4 w-4 mr-1" />
                  Report
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
