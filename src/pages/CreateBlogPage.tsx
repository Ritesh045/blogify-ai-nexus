
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlog } from "@/context/BlogContext";
import { useAuth } from "@/context/AuthContext";
import { useChatbot } from "@/context/ChatbotContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, PenSquare, Tag, Image, ArrowLeft } from "lucide-react";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import ContentSuggestions from "@/components/Suggestions/ContentSuggestions";
import { toast } from "sonner";

const CreateBlogPage = () => {
  const { createPost } = useBlog();
  const { user } = useAuth();
  const { generateContentSuggestion } = useChatbot();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"editor" | "suggestions">("editor");

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !excerpt.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to create a post");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      createPost({
        title,
        content,
        excerpt,
        coverImage: coverImage || "https://images.unsplash.com/photo-1664575198308-3959904fa2e9",
        authorId: user.id,
        authorName: user.name,
        tags: tags.length > 0 ? tags : ["General"],
      });
      
      toast.success("Blog post created successfully!");
      navigate("/blogs");
    } catch (error) {
      toast.error("Failed to create blog post");
    } finally {
      setLoading(false);
    }
  };

  const handleUseSuggestion = (suggestion: string) => {
    // Determine where to apply the suggestion based on its content and structure
    if (suggestion.length < 100) {
      // If it's short, likely a title
      setTitle(suggestion);
    } else {
      // If it's longer, likely content
      setContent(suggestion);
      // Try to extract a good excerpt
      const firstParagraph = suggestion.split('\n')[0];
      if (firstParagraph && firstParagraph.length > 20) {
        setExcerpt(firstParagraph.substring(0, 150) + "...");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-ai mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={activeTab === "editor" ? "default" : "outline"}
            onClick={() => setActiveTab("editor")}
            className="flex items-center gap-1"
          >
            <PenSquare className="h-4 w-4" />
            Editor
          </Button>
          <Button 
            variant={activeTab === "suggestions" ? "default" : "outline"}
            onClick={() => setActiveTab("suggestions")}
            className="flex items-center gap-1"
          >
            <Sparkles className="h-4 w-4" />
            AI Suggestions
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2">
          {activeTab === "editor" ? (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Create Your Blog Post</CardTitle>
                <CardDescription>
                  Fill out the form below to create your blog post.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter blog title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverImage">Cover Image URL (optional)</Label>
                    <Input
                      id="coverImage"
                      placeholder="Enter image URL"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Write a brief summary of your post"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      className="resize-none h-20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Write your blog content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="editor-content"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag, index) => (
                        <div key={index} className="bg-secondary rounded-full px-3 py-1 text-sm flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleTagRemove(tag)}
                            className="ml-1 text-gray-500 hover:text-gray-700"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 text-gray-500 mr-2" />
                      <Input
                        id="tags"
                        placeholder="Add tags (press Enter)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagAdd}
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="button" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Creating..." : "Create Post"}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <ContentSuggestions onUseSuggestion={handleUseSuggestion} />
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h3 className="font-bold text-lg">{title || "Your Title"}</h3>
                  {coverImage && (
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-40 object-cover rounded-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1664575198308-3959904fa2e9";
                      }}
                    />
                  )}
                  <p className="text-sm text-gray-600">
                    {excerpt || "Your excerpt will appear here..."}
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    {tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-secondary/50 text-xs rounded-full px-2 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-ai" />
                  Writing Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2">
                    <div className="bg-ai/20 rounded-full p-1 h-6 w-6 flex items-center justify-center text-ai text-xs flex-shrink-0">
                      1
                    </div>
                    <span>Start with an engaging introduction to hook readers.</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="bg-ai/20 rounded-full p-1 h-6 w-6 flex items-center justify-center text-ai text-xs flex-shrink-0">
                      2
                    </div>
                    <span>Use short paragraphs and subheadings for readability.</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="bg-ai/20 rounded-full p-1 h-6 w-6 flex items-center justify-center text-ai text-xs flex-shrink-0">
                      3
                    </div>
                    <span>Include examples or stories to illustrate your points.</span>
                  </li>
                  <li className="flex gap-2">
                    <div className="bg-ai/20 rounded-full p-1 h-6 w-6 flex items-center justify-center text-ai text-xs flex-shrink-0">
                      4
                    </div>
                    <span>End with a conclusion that summarizes and calls to action.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPage;
