
import React from "react";
import { Link } from "react-router-dom";
import { BlogPost } from "@/context/BlogContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Clock } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
  compact?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, compact = false }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (compact) {
    return (
      <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
        <CardContent className="p-0">
          <Link to={`/blog/${post.id}`}>
            <div className="flex flex-col h-full">
              {post.coverImage && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
              )}
              <div className="p-4 flex-grow">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
      <CardContent className="p-0">
        <Link to={`/blog/${post.id}`}>
          <div className="flex flex-col h-full">
            {post.coverImage && (
              <div className="h-48 overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
            )}
            <div className="p-6 flex-grow">
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-ai/60 text-white text-xs">
                    {post.authorName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{post.authorName}</p>
                  <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-2 line-clamp-2">{post.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-secondary/50">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
      <CardFooter className="border-t p-4 bg-gray-50">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-600">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{post.likes}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">{post.comments.filter(c => !c.isSpam).length}</span>
            </div>
          </div>
          <Link 
            to={`/blog/${post.id}`} 
            className="text-ai hover:text-ai-dark text-sm font-medium"
          >
            Read more
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
