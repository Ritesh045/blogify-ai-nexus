
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBlog } from "@/context/BlogContext";
import { useAuth } from "@/context/AuthContext";
import BlogCard from "@/components/Blog/BlogCard";
import { Sparkles, PenSquare, Shield, MessageSquare } from "lucide-react";

const HomePage = () => {
  const { posts } = useBlog();
  const { isAuthenticated } = useAuth();
  
  // Get the 3 most recent posts
  const recentPosts = [...posts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/20 py-20 md:py-28">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl space-y-6 animate-fade-in">
              <div className="bg-ai/10 text-ai font-medium rounded-full inline-flex items-center px-3 py-1 text-sm mb-2">
                <Sparkles className="w-4 h-4 mr-1" />
                AI-Powered Blogging Platform
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Create <span className="ai-gradient-text">intelligent</span> blog content
              </h1>
              <p className="text-lg text-gray-600">
                Elevate your blogging with AI-powered content suggestions, smart chatbot assistance, and automatic spam detection.
              </p>
              <div className="flex flex-wrap gap-3">
                {isAuthenticated ? (
                  <Link to="/create">
                    <Button size="lg" className="gap-2">
                      <PenSquare className="w-4 h-4" />
                      Create Blog Post
                    </Button>
                  </Link>
                ) : (
                  <Link to="/signup">
                    <Button size="lg" className="gap-2">
                      Get Started
                    </Button>
                  </Link>
                )}
                <Link to="/blogs">
                  <Button size="lg" variant="outline">
                    Explore Blogs
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="absolute top-[-20px] left-[-20px] w-[140%] h-[140%] bg-gradient-to-r from-ai/10 to-purple-500/10 rounded-full blur-3xl"></div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 relative animate-fade-up">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-ai/20 rounded-full p-2.5">
                    <Sparkles className="h-5 w-5 text-ai" />
                  </div>
                  <div>
                    <div className="font-medium">Title Suggestion</div>
                    <p className="text-sm text-gray-600">How AI Can Enhance Your Content Creation Process</p>
                  </div>
                </div>
                <div className="h-px bg-gray-200 my-3"></div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 rounded-full p-2.5">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">AI Chat Assistance</div>
                    <p className="text-sm text-gray-600">I can help improve your article's readability and engagement.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-[5%] w-24 h-24 rounded-full bg-gradient-to-r from-ai-light to-purple-400 opacity-20 blur-2xl"></div>
        <div className="absolute bottom-10 left-[10%] w-32 h-32 rounded-full bg-gradient-to-r from-purple-400 to-ai-light opacity-20 blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Intelligent Features for Better Blogging</h2>
            <p className="text-gray-600">
              Our AI-powered tools help you create engaging content, interact with readers, and protect your blog from spam.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-ai/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-ai" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Content Suggestions</h3>
              <p className="text-gray-600">
                Get intelligent recommendations for blog titles, outlines, and improvements to your existing content.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart AI Chatbot</h3>
              <p className="text-gray-600">
                Collaborate with our AI assistant to refine ideas, overcome writer's block, and enhance your writing.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Spam Detection</h3>
              <p className="text-gray-600">
                Keep your comment section clean with automatic detection of spam and inappropriate content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blogs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Recent Blog Posts</h2>
            <Link to="/blogs">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No blog posts yet. Be the first to create one!</p>
              {isAuthenticated && (
                <Link to="/create" className="mt-4 inline-block">
                  <Button>Create Blog Post</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-ai to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your blogging?</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Join thousands of content creators who use our AI-powered tools to create engaging, high-quality blog posts.
          </p>
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Sign Up Free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                  Login
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/create">
              <Button size="lg" variant="secondary">
                Create Your Blog Post
              </Button>
            </Link>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;
