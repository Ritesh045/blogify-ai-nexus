
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useBlog } from "@/context/BlogContext";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CommentSection from "@/components/Blog/CommentSection";
import { Heart, Share, Edit, Trash2, ArrowLeft, Clock, Eye } from "lucide-react";
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
import { toast } from "sonner";

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getPost, deletePost, likePost } = useBlog();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(id ? getPost(id) : undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    if (id) {
      const foundPost = getPost(id);
      setPost(foundPost);
      
      if (!foundPost) {
        navigate("/blogs", { replace: true });
      }
    }
  }, [id, getPost, navigate]);

  const handleDelete = () => {
    if (id) {
      deletePost(id);
      setDeleteDialogOpen(false);
      toast.success("Blog post deleted successfully");
      navigate("/blogs");
    }
  };

  const handleLike = () => {
    if (id && !hasLiked) {
      likePost(id);
      setHasLiked(true);
      setPost(getPost(id));
      toast.success("Thanks for liking this post!");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Blog post not found</h2>
        <p className="mt-4 text-gray-600">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/blogs">
          <Button className="mt-6">
            View all blogs
          </Button>
        </Link>
      </div>
    );
  }

  const isAuthor = user && user.id === post.authorId;

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-8">
        <Link to="/blogs" className="flex items-center text-gray-600 hover:text-ai mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to blogs
        </Link>
        
        {/* Cover image */}
        {post.coverImage && (
          <div className="rounded-xl overflow-hidden mb-8 shadow-lg">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto object-cover max-h-[400px]"
            />
          </div>
        )}

        {/* Title and meta */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarFallback className="bg-ai/80 text-white">
                {post.authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{post.authorName}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag, index) => (
            <Link to={`/blogs?tag=${tag}`} key={index}>
              <Badge variant="outline" className="bg-secondary/50">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Actions for author */}
        {isAuthor && (
          <div className="flex gap-2 mb-8">
            <Link to={`/edit/${post.id}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-1"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
        
        {/* Divider */}
        <div className="border-t my-6"></div>

        {/* Content */}
        <div className="prose max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
        </div>
        
        {/* Divider */}
        <div className="border-t my-8"></div>

        {/* Engagement metrics and actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={hasLiked}
              className={`flex items-center gap-1 ${hasLiked ? "text-red-500" : ""}`}
            >
              <Heart className={`h-5 w-5 ${hasLiked ? "fill-current" : ""}`} />
              <span>{post.likes} likes</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-1"
            >
              <Share className="h-5 w-5" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Comments */}
      <CommentSection post={post} />

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete blog post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogDetailPage;
