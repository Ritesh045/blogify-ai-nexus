
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Mail, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailLinkMode, setEmailLinkMode] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading, sendEmailLink } = useAuth();
  const navigate = useNavigate();

  // Check if the user has been redirected from an email link
  useEffect(() => {
    // Handle the email link sign-in
    const handleEmailLink = async () => {
      // Additional logic for handling email sign-in would be added here
    };

    handleEmailLink();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!emailLinkMode && !password) {
      setError("Please enter your password");
      return;
    }

    try {
      if (emailLinkMode) {
        await sendEmailLink(email);
      } else {
        await login(email, password);
        navigate("/");
      }
    } catch (err) {
      setError(emailLinkMode ? "Failed to send login link" : "Failed to log in");
    }
  };

  const toggleLoginMode = () => {
    setEmailLinkMode(!emailLinkMode);
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-ai to-purple-600 flex items-center justify-center text-white font-semibold text-xl">
                  B
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-ai-light animate-pulse-slow"></div>
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your AI-powered blogging experience
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              
              {!emailLinkMode && (
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-ai hover:text-ai-dark">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required={!emailLinkMode}
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading 
                ? "Please wait..." 
                : emailLinkMode 
                  ? "Send login link to email" 
                  : "Sign in with Email"}
              {!isLoading && (emailLinkMode ? <Mail className="ml-2" /> : <ArrowRight className="ml-2" />)}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={toggleLoginMode}
            >
              {emailLinkMode 
                ? "Sign in with password instead" 
                : "Sign in with email link instead"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-ai hover:text-ai-dark">
              Sign up
            </Link>
          </p>
          
          <div className="mt-6">
            <p className="text-xs text-center text-gray-500">
              For demo, you can use any email and password
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image/Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-ai to-purple-700 flex-col justify-center items-center p-8 text-white">
        <div className="max-w-md text-center space-y-6">
          <Sparkles className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold">AI-Powered Blogging</h2>
          <p className="text-lg text-white/90">
            Write better content with intelligent suggestions, spam protection, and conversational AI assistance.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-medium mb-1">Content Suggestions</h3>
              <p className="text-sm text-white/80">Get AI-powered ideas for your blog posts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-medium mb-1">Smart Chatbot</h3>
              <p className="text-sm text-white/80">Ask questions and get writing help</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-medium mb-1">Spam Detection</h3>
              <p className="text-sm text-white/80">Keep your blog comments clean</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-medium mb-1">Writing Analysis</h3>
              <p className="text-sm text-white/80">Improve your writing style</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
