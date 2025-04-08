
import React, { useState, useEffect } from "react";
import { useBlog } from "@/context/BlogContext";
import BlogCard from "@/components/Blog/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";

const BlogsPage: React.FC = () => {
  const { posts } = useBlog();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filteredPosts, setFilteredPosts] = useState(posts);

  // Extract unique tags from all posts
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags))
  ).sort();

  useEffect(() => {
    let result = [...posts];

    // Apply search filter
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(lowercaseSearch) ||
          post.content.toLowerCase().includes(lowercaseSearch) ||
          post.excerpt.toLowerCase().includes(lowercaseSearch) ||
          post.tags.some((tag) => tag.toLowerCase().includes(lowercaseSearch))
      );
    }

    // Apply tag filter
    if (selectedTag) {
      result = result.filter((post) =>
        post.tags.includes(selectedTag)
      );
    }

    // Sort by date (newest first)
    result.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredPosts(result);
  }, [posts, searchTerm, selectedTag]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTag(null);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Blog Posts</h1>
        <p className="text-gray-600 mb-6">
          Explore our collection of AI-powered blog posts on technology, content creation, and more.
        </p>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search blog posts..."
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            {(searchTerm || selectedTag) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-1"
              >
                <X className="h-3.5 w-3.5" />
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className={`cursor-pointer ${
                selectedTag === tag ? "bg-ai hover:bg-ai-dark" : "hover:bg-secondary"
              }`}
              onClick={() => 
                selectedTag === tag ? setSelectedTag(null) : setSelectedTag(tag)
              }
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          Showing {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
        </p>
      </div>

      {/* Blog Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <Filter className="mx-auto h-8 w-8 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No posts found</h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <Button 
            variant="link" 
            onClick={clearFilters}
            className="mt-2"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogsPage;
