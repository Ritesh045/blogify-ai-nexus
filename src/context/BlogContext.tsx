import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  tags: string[];
  likes: number;
  comments: Comment[];
};

export type Comment = {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  isSpam: boolean;
};

interface BlogContextType {
  posts: BlogPost[];
  userPosts: (userId: string) => BlogPost[];
  getPost: (id: string) => BlogPost | undefined;
  createPost: (post: Omit<BlogPost, "id" | "createdAt" | "likes" | "comments">) => void;
  updatePost: (id: string, post: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  addComment: (postId: string, comment: Omit<Comment, "id" | "createdAt" | "isSpam">) => void;
  deleteComment: (postId: string, commentId: string) => void;
  likePost: (id: string) => void;
}

const API_URL = "http://localhost:5000/api";

const demoBlogs: BlogPost[] = [
  {
    id: "blog-1",
    title: "The Future of AI in Content Creation",
    content: "Artificial Intelligence is revolutionizing how we create content online. From automated blog suggestions to AI-powered editing tools, the landscape of content creation is changing rapidly. Writers can now collaborate with AI to enhance their creativity and productivity...",
    excerpt: "Exploring how AI is transforming the content creation landscape and what it means for creators.",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    authorId: "user-1",
    authorName: "Demo User",
    createdAt: new Date("2025-04-01"),
    tags: ["AI", "Content Creation", "Technology"],
    likes: 24,
    comments: [
      {
        id: "comment-1",
        content: "Great insights on AI's role in content creation!",
        authorId: "user-2",
        authorName: "Jane Smith",
        createdAt: new Date("2025-04-02"),
        isSpam: false,
      }
    ],
  },
  {
    id: "blog-2",
    title: "Building Effective AI Chatbots",
    content: "Creating conversational AI that truly engages users requires a deep understanding of both technical implementation and user psychology. This post explores the essential components of effective chatbot design...",
    excerpt: "Learn the key principles behind designing AI chatbots that provide meaningful user interactions.",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    authorId: "user-3",
    authorName: "Alex Johnson",
    createdAt: new Date("2025-03-28"),
    tags: ["Chatbots", "AI", "UX Design"],
    likes: 18,
    comments: [],
  }
];

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
};

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/posts`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        
        const data = await response.json();
        
        const formattedPosts = data.map((post: any) => ({
          id: post._id,
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          coverImage: post.coverImage,
          authorId: post.authorId,
          authorName: post.authorName,
          createdAt: new Date(post.createdAt),
          tags: post.tags || [],
          likes: post.likes || 0,
          comments: (post.comments || []).map((comment: any) => ({
            id: comment._id,
            content: comment.content,
            authorId: comment.authorId,
            authorName: comment.authorName,
            createdAt: new Date(comment.createdAt),
            isSpam: comment.isSpam || false,
          })),
        }));
        
        setPosts(formattedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        
        const storedPosts = localStorage.getItem("blogPosts");
        if (storedPosts) {
          try {
            const parsedPosts = JSON.parse(storedPosts).map((post: any) => ({
              ...post,
              createdAt: new Date(post.createdAt),
              comments: post.comments.map((comment: any) => ({
                ...comment,
                createdAt: new Date(comment.createdAt)
              }))
            }));
            setPosts(parsedPosts);
          } catch (error) {
            console.error("Failed to parse stored posts:", error);
            setPosts(demoBlogs);
          }
        } else {
          setPosts(demoBlogs);
        }
      }
    };
    
    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem("blogPosts", JSON.stringify(posts));
    }
  }, [posts]);

  const userPosts = (userId: string) => {
    return posts.filter(post => post.authorId === userId);
  };

  const getPost = (id: string) => {
    return posts.find(post => post.id === id);
  };

  const createPost = async (post: Omit<BlogPost, "id" | "createdAt" | "likes" | "comments">) => {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create post");
      }
      
      const data = await response.json();
      
      const newPost: BlogPost = {
        id: data._id,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        authorId: data.authorId,
        authorName: data.authorName,
        createdAt: new Date(data.createdAt),
        tags: data.tags,
        likes: data.likes,
        comments: [],
      };
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      toast.success("Blog post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create blog post. Using local storage instead.");
      
      const newPost: BlogPost = {
        ...post,
        id: `blog-${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date(),
        likes: 0,
        comments: [],
      };
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      toast.success("Blog post created successfully (local storage)!");
    }
  };

  const updatePost = async (id: string, updatedFields: Partial<BlogPost>) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update post");
      }
      
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === id ? { ...post, ...updatedFields } : post
        )
      );
      toast.success("Blog post updated!");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post on server. Updated locally only.");
      
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === id ? { ...post, ...updatedFields } : post
        )
      );
    }
  };

  const deletePost = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      toast.success("Blog post deleted!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post on server. Deleted locally only.");
      
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
    }
  };

  const addComment = async (postId: string, comment: Omit<Comment, "id" | "createdAt" | "isSpam">) => {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.rejected) {
          return { rejected: true };
        }
        throw new Error(data.error || "Failed to add comment");
      }
      
      const newComment: Comment = {
        id: data._id,
        content: data.content,
        authorId: data.authorId,
        authorName: data.authorName,
        createdAt: new Date(data.createdAt),
        isSpam: data.isSpam,
      };
      
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, newComment]
            };
          }
          return post;
        })
      );
      
      if (newComment.isSpam) {
        toast.warning("Comment flagged for potential spam and is awaiting review.");
      }
      
      return newComment;
    } catch (error) {
      console.error("Error adding comment:", error);
      
      const profanityWords = [
        "fuck", "shit", "bitch", "ass", "damn", "cunt", "dick",
        "pussy", "cock", "whore", "bastard", "asshole", "motherfucker"
      ];
      
      const hasProfanity = profanityWords.some(word => 
        new RegExp(`\\b${word}\\b`, 'i').test(comment.content)
      );
      
      if (hasProfanity) {
        throw new Error("Comment contains inappropriate language and was not posted");
      }
      
      const spamKeywords = ["viagra", "casino", "lottery", "winner", "free money"];
      const hasSpamKeywords = spamKeywords.some(keyword => 
        comment.content.toLowerCase().includes(keyword)
      );
      
      const urlCount = (comment.content.match(/https?:\/\/[^\s]+/g) || []).length;
      const isSpam = hasSpamKeywords || urlCount > 2;
      
      const newComment: Comment = {
        ...comment,
        id: `comment-${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date(),
        isSpam
      };
      
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, newComment]
            };
          }
          return post;
        })
      );
      
      if (isSpam) {
        toast.warning("Comment flagged for potential spam and is awaiting review.");
      } else {
        toast.success("Comment added successfully (local only)!");
      }
      
      return newComment;
    }
  };

  const deleteComment = async (postId: string, commentId: string) => {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }
      
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments.filter(comment => comment.id !== commentId)
            };
          }
          return post;
        })
      );
      toast.success("Comment deleted!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment on server. Deleted locally only.");
      
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments.filter(comment => comment.id !== commentId)
            };
          }
          return post;
        })
      );
      toast.success("Comment deleted (local only)!");
    }
  };

  const likePost = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}/like`, {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error("Failed to like post");
      }
      
      const data = await response.json();
      
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === id) {
            return { ...post, likes: data.likes };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Error liking post:", error);
      
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === id) {
            return { ...post, likes: post.likes + 1 };
          }
          return post;
        })
      );
    }
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        userPosts,
        getPost,
        createPost,
        updatePost,
        deletePost,
        addComment,
        deleteComment,
        likePost,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
