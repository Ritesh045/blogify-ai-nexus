import React, { useState } from "react";
import { useBlog, Comment, BlogPost } from "@/context/BlogContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Trash2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CommentSectionProps {
  post: BlogPost;
}

const CommentSection: React.FC<CommentSectionProps> = ({ post }) => {
  const { addComment, deleteComment } = useBlog();
  const { user, isAuthenticated } = useAuth();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [showSpam, setShowSpam] = useState(false);

  // Filter comments based on spam status and visibility setting
  const validComments = post.comments.filter(
    (comment) => !comment.isSpam || showSpam
  );

  // Count comments by type for display purposes
  const nonSpamCommentCount = post.comments.filter(
    (comment) => !comment.isSpam
  ).length;
  const spamCommentCount = post.comments.filter(
    (comment) => comment.isSpam
  ).length;

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const result = await addComment(post.id, {
        content: comment,
        authorId: user.id,
        authorName: user.name,
      });
      
      // If comment was rejected due to profanity
      if (result?.rejected) {
        toast.error("Your comment was not posted as it contains inappropriate language.");
      } else {
        setComment("");
        toast.success("Comment added successfully!");
      }
    } catch (error: any) {
      if (error.message?.includes("inappropriate language")) {
        toast.error("Your comment was not posted as it contains inappropriate language.");
      } else {
        console.error("Error adding comment:", error);
        toast.error("Failed to add comment. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (commentToDelete) {
      deleteComment(post.id, commentToDelete);
      setDeleteConfirmOpen(false);
      setCommentToDelete(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">
          Comments ({nonSpamCommentCount})
        </h3>
        {spamCommentCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSpam(!showSpam)}
            className="flex items-center gap-1"
          >
            <ShieldAlert className="h-4 w-4" />
            {showSpam ? "Hide Flagged Comments" : `Show Flagged Comments (${spamCommentCount})`}
          </Button>
        )}
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex gap-4">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-ai text-white">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="min-h-[100px] mb-3"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={!comment.trim() || isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-md mb-8 text-center">
          <p className="text-gray-600">
            Please{" "}
            <Link to="/login" className="text-ai font-medium">
              sign in
            </Link>{" "}
            to leave a comment.
          </p>
        </div>
      )}

      {validComments.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>Be the first to comment on this post!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {validComments
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((comment) => (
              <div 
                key={comment.id} 
                className={`flex gap-4 ${comment.isSpam ? "bg-red-50 p-3 rounded-md border border-red-200" : ""}`}
              >
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gray-300 text-gray-600">
                    {comment.authorName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{comment.authorName}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                    {user?.id === comment.authorId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(comment.id)}
                        className="h-8 w-8 p-0 text-gray-500"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    )}
                  </div>
                  <div className="mt-2">
                    {comment.isSpam ? (
                      <div className="flex items-center space-x-1 text-red-500 text-sm mb-1">
                        <ShieldAlert className="h-4 w-4" />
                        <span>This comment was flagged as potential spam</span>
                      </div>
                    ) : null}
                    <p className={`${comment.isSpam ? "text-gray-500" : "text-gray-700"}`}>
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      <AlertDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CommentSection;
