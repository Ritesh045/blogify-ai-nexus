
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut, PenSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-ai to-purple-600 flex items-center justify-center text-white font-semibold">
              B
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-ai-light animate-pulse-slow"></div>
          </div>
          <span className="font-bold text-lg ai-gradient-text">BlogifyAI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-ai font-medium transition">Home</Link>
          <Link to="/blogs" className="text-gray-700 hover:text-ai font-medium transition">Blogs</Link>
          <Link to="/chat" className="text-gray-700 hover:text-ai font-medium transition">AI Chat</Link>
          <Link to="/about" className="text-gray-700 hover:text-ai font-medium transition">About</Link>
        </nav>

        {/* Desktop Auth/User Menu */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/create">
                <Button variant="outline" className="flex items-center gap-2">
                  <PenSquare className="w-4 h-4" />
                  <span>Create Blog</span>
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-0 w-10 h-10">
                    <Avatar>
                      <AvatarFallback className="bg-ai text-white">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-4 py-2 flex flex-col gap-1">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/suggestions" className="cursor-pointer flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Suggestions</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="cursor-pointer text-red-600 hover:text-red-700 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white absolute top-16 left-0 w-full border-b shadow-md z-40">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-3">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded">Home</Link>
            <Link to="/blogs" onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded">Blogs</Link>
            <Link to="/chat" onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded">AI Chat</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded">About</Link>
            
            <div className="border-t my-2"></div>
            
            {isAuthenticated ? (
              <>
                <div className="p-2 flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-ai text-white">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <Link to="/create" onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded flex items-center gap-2">
                  <PenSquare className="w-4 h-4" />
                  <span>Create Blog</span>
                </Link>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <Link to="/suggestions" onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Suggestions</span>
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded flex items-center gap-2 text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
