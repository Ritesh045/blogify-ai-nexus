
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Brain, Shield, Bot, Sparkles, Check } from "lucide-react";

const AboutPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-b from-white to-secondary/10 py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About BlogifyAI</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We're on a mission to transform the way people create content
              through the power of artificial intelligence.
            </p>
            {!isAuthenticated && (
              <Link to="/signup">
                <Button size="lg">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-gray-600 mb-4">
                BlogifyAI was born from a simple idea: what if AI could help anyone create
                amazing blog content, regardless of their writing experience?
              </p>
              <p className="text-gray-600 mb-4">
                We believe that AI can be a powerful companion in the creative process,
                offering suggestions, combating writer's block, and helping bloggers
                focus on what matters most – sharing valuable ideas with their audience.
              </p>
              <p className="text-gray-600">
                Our platform combines cutting-edge AI technology with intuitive design
                to make blogging more accessible, engaging, and spam-free.
              </p>
            </div>
            <div className="order-first md:order-last">
              <div className="bg-gradient-to-br from-ai/10 to-purple-100 rounded-xl p-6 md:p-10">
                <div className="bg-white rounded-lg shadow-lg p-6 relative">
                  <div className="absolute -top-4 -left-4 bg-ai text-white rounded-lg p-3">
                    <Brain className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-xl mt-4 mb-2">AI-Powered Creativity</h3>
                  <p className="text-gray-600">
                    Our intelligent assistant helps you generate ideas, improve your writing,
                    and engage with your readers in meaningful ways.
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Smart content suggestions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Engaging blog titles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Writing improvements</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Core Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-ai/10 text-ai rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-3">AI Content Suggestions</h3>
              <p className="text-gray-600">
                Get intelligent recommendations for blog titles, outlines, and improvements
                to your existing content.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-purple-100 text-purple-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-3">Smart AI Chatbot</h3>
              <p className="text-gray-600">
                Collaborate with our AI assistant to refine ideas, overcome writer's block,
                and enhance your writing.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-3">Spam Detection</h3>
              <p className="text-gray-600">
                Keep your comment section clean with automatic detection of spam and
                inappropriate content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Team</h2>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            We're a passionate team of AI enthusiasts, developers, and content creators
            committed to building the best AI-powered blogging platform.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="bg-gray-200 rounded-full w-32 h-32 mx-auto mb-4 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                  alt="Sarah Johnson"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg">Sarah Johnson</h3>
              <p className="text-ai">CEO & Co-Founder</p>
              <p className="text-gray-600 mt-2 text-sm">
                AI researcher with a passion for creating accessible tech tools.
              </p>
            </div>
            
            {/* Team Member 2 */}
            <div className="text-center">
              <div className="bg-gray-200 rounded-full w-32 h-32 mx-auto mb-4 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
                  alt="David Chen"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg">David Chen</h3>
              <p className="text-ai">CTO & Co-Founder</p>
              <p className="text-gray-600 mt-2 text-sm">
                Full-stack developer with expertise in AI and machine learning.
              </p>
            </div>
            
            {/* Team Member 3 */}
            <div className="text-center">
              <div className="bg-gray-200 rounded-full w-32 h-32 mx-auto mb-4 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"
                  alt="Mia Rodriguez"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg">Mia Rodriguez</h3>
              <p className="text-ai">Head of Content</p>
              <p className="text-gray-600 mt-2 text-sm">
                Content strategist and former editor with 10+ years of experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
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
    </div>
  );
};

export default AboutPage;
