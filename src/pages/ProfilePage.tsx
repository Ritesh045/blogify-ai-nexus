
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useBlog } from "@/context/BlogContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlogCard from "@/components/Blog/BlogCard";
import { PenSquare, Settings, User as UserIcon } from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuth();
  const { userPosts } = useBlog();
  const [activeTab, setActiveTab] = useState("blogs");

  const posts = user ? userPosts(user.id) : [];
  
  // Sample stats (in a real app these would come from an API)
  const stats = {
    postsCount: posts.length,
    views: posts.reduce((total, post) => total + Math.floor(post.likes * 3.5), 0), // Just a placeholder calculation
    likes: posts.reduce((total, post) => total + post.likes, 0),
    comments: posts.reduce((total, post) => total + post.comments.filter(c => !c.isSpam).length, 0),
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Please log in to view your profile</h2>
        <Link to="/login">
          <Button className="mt-6">
            Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-ai text-white text-xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/create">
              <Button variant="outline" className="flex items-center gap-1">
                <PenSquare className="h-4 w-4" />
                New Post
              </Button>
            </Link>
            <Button variant="ghost" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <span className="text-2xl font-bold text-ai">{stats.postsCount}</span>
            <span className="text-gray-600 text-sm">Posts</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <span className="text-2xl font-bold text-ai">{stats.views}</span>
            <span className="text-gray-600 text-sm">Views</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <span className="text-2xl font-bold text-ai">{stats.likes}</span>
            <span className="text-gray-600 text-sm">Likes</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <span className="text-2xl font-bold text-ai">{stats.comments}</span>
            <span className="text-gray-600 text-sm">Comments</span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="blogs" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="blogs">My Blogs</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="blogs">
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <div className="bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <PenSquare className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-medium">No blog posts yet</h3>
              <p className="text-gray-600 mt-2 mb-6">
                Share your thoughts with the world by creating your first blog post.
              </p>
              <Link to="/create">
                <Button>Create Your First Post</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="mt-1">{user.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                    <p className="mt-1">{user.id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                    <p className="mt-1">April 2025</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Account Preferences</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive email notifications about your blog activity</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Enabled</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">AI Content Suggestions</h3>
                      <p className="text-sm text-gray-500">Get automated content suggestions when creating blogs</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
                <div className="bg-red-50 p-4 rounded-md">
                  <h3 className="font-medium text-red-600 mb-1">Delete Account</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Permanently delete your account and all associated data
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
