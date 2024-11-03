"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThumbsUp, ThumbsDown, Flag } from "lucide-react";

const comments = [
  {
    id: 1,
    author: "Sarah Chen",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    comment: "Great video! Really helped me understand the concept better.",
    time: "2 minutes ago",
    video: "Understanding AI Basics",
  },
  {
    id: 2,
    author: "John Smith",
    avatar: "https://i.pravatar.cc/150?u=john",
    comment: "Could you make a follow-up video on advanced techniques?",
    time: "1 hour ago",
    video: "Machine Learning 101",
  },
  {
    id: 3,
    author: "Emma Wilson",
    avatar: "https://i.pravatar.cc/150?u=emma",
    comment: "This was exactly what I was looking for. Thanks!",
    time: "3 hours ago",
    video: "Python for Beginners",
  },
];

export function RecentComments() {
  return (
    <ScrollArea className="h-[350px] pr-4">
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
              <AvatarImage src={comment.avatar} />
              <AvatarFallback>{comment.author[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{comment.author}</p>
                  <p className="text-xs text-muted-foreground">
                    on {comment.video}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{comment.time}</p>
              </div>
              <p className="text-sm">{comment.comment}</p>
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