"use client";

export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { fetchAndStoreComments, getRecentComments } from "@/lib/youtube";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  author_name: string;
  text: string;
  video_title: string;
  published_at: string;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadComments() {
      const supabase = createClient();
      try {
        setLoading(true);
        setError(null);
        console.log('Starting comment fetch process...');

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error('Auth error:', authError);
          throw new Error('Authentication error');
        }
        if (!user) {
          console.error('No user found');
          throw new Error('Not authenticated');
        }
        console.log('User authenticated:', user.id);

        // Check if user has any channels
        const { data: channels, error: channelsError } = await supabase
          .from('youtube_channels')
          .select('channel_id')
          .eq('user_id', user.id);

        if (channelsError) {
          console.error('Error fetching channels:', channelsError);
          throw new Error('Failed to fetch channels');
        }

        if (!channels || channels.length === 0) {
          console.log('No channels found for user');
          setComments([]);
          return;
        }

        console.log(`Found ${channels.length} channels:`, channels);

        // Fetch new comments from YouTube
        console.log('Fetching new comments from YouTube...');
        await fetchAndStoreComments();
        
        // Get comments from database
        console.log('Getting comments from database...');
        const recentComments = await getRecentComments();
        console.log('Fetched comments:', recentComments);
        
        setComments(recentComments);
      } catch (error) {
        console.error("Error loading comments:", error);
        setError(error instanceof Error ? error.message : 'Failed to load comments');
        setComments([]);
      } finally {
        setLoading(false);
      }
    }

    loadComments();
  }, []);

  // Filter comments based on search term
  const filteredComments = comments.filter(comment => {
    const matchesSearch = searchTerm === "" || 
      comment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.video_title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Comments</h1>
        <Button onClick={() => window.location.reload()}>Refresh Comments</Button>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search comments..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select 
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Comments</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="spam">Spam</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Video</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">
                    Loading comments...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-red-500">
                    Error: {error}
                  </TableCell>
                </TableRow>
              ) : filteredComments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">
                    No comments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredComments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell className="font-medium">{comment.author_name}</TableCell>
                    <TableCell>{comment.text}</TableCell>
                    <TableCell>{comment.video_title}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(comment.published_at), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
