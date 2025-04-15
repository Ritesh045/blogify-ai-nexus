
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError("Failed to reset password. Please check if the email is registered.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
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
          <h2 className="mt-6 text-3xl font-bold tracking-tight">Reset your password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email, and we'll send you a link to reset your password
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {isSubmitted ? (
          <div className="space-y-6">
            <Alert className="bg-green-50 border-green-100">
              <AlertDescription>
                Password reset instructions have been sent to your email address. 
                Please check your inbox and follow the link to reset your password.
              </AlertDescription>
            </Alert>
            <div className="text-center">
              <Link to="/login" className="text-ai hover:text-ai-dark inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Reset Password"}
            </Button>

            <div className="text-center">
              <Link to="/login" className="text-ai hover:text-ai-dark inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
