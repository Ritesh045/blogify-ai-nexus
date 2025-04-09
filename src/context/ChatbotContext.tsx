
import React, { createContext, useState, useContext } from "react";
import { toast } from "sonner";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

type SuggestionType = "title" | "content" | "improvement";

export type ContentSuggestion = {
  type: SuggestionType;
  suggestion: string;
  used: boolean;
};

interface ChatbotContextType {
  messages: Message[];
  isLoading: boolean;
  contentSuggestions: ContentSuggestion[];
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  generateContentSuggestion: (type: SuggestionType, prompt?: string) => Promise<void>;
  markSuggestionAsUsed: (index: number) => void;
  clearSuggestions: () => void;
}

const initialMessages: Message[] = [
  {
    id: "msg-1",
    content: "Hello! I'm your AI assistant. I can help you with blog ideas, content suggestions, or answer questions about AI and blogging. How can I assist you today?",
    role: "assistant",
    timestamp: new Date(),
  },
];

// API URL - update this to match your Flask backend URL
const API_URL = "http://localhost:5000/api";

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [contentSuggestions, setContentSuggestions] = useState<ContentSuggestion[]>([]);

  // Mock AI responses based on input when API is unavailable
  const generateLocalAIResponse = async (userMessage: string): Promise<string> => {
    // Wait to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello there! How can I help with your blog today?";
    } else if (lowerMessage.includes("blog idea") || lowerMessage.includes("topic")) {
      return "Here are some blog topic ideas:\n\n1. The Impact of AI on Content Quality\n2. How to Use AI to Overcome Writer's Block\n3. Ethical Considerations in AI-Generated Content\n4. The Future of Human-AI Collaboration in Writing\n5. AI Tools Every Blogger Should Know About";
    } else if (lowerMessage.includes("seo") || lowerMessage.includes("search engine")) {
      return "To improve your blog's SEO with AI tools:\n\n1. Use AI keyword research tools to find relevant topics\n2. Analyze competing content with AI analysis tools\n3. Ensure readability and engagement - AI can help optimize this\n4. Create SEO-friendly meta descriptions with AI assistance\n5. Use AI to optimize your content structure";
    } else if (lowerMessage.includes("chatgpt") || lowerMessage.includes("openai")) {
      return "ChatGPT is a powerful language model that can help with your blogging by:\n\n- Generating creative ideas when you're stuck\n- Helping refine your existing content\n- Creating outlines for complex topics\n- Suggesting alternative phrasings\n- Explaining complex concepts you want to write about";
    } else {
      return "That's an interesting point! As an AI assistant for your blog, I can help you develop this idea further or suggest related topics that might engage your readers. Would you like me to elaborate on any particular aspect?";
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      content,
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call a backend API with AI capabilities
      // For now, we'll use the mock implementation
      const aiResponse = await generateLocalAIResponse(content);
      
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        content: aiResponse,
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages(initialMessages);
  };

  // Generate content suggestions using the Flask API
  const generateContentSuggestion = async (type: SuggestionType, prompt?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/ai/suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, prompt }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to get content suggestion");
      }
      
      const data = await response.json();
      
      setContentSuggestions(prev => [...prev, { 
        type: data.type,
        suggestion: data.suggestion,
        used: false 
      }]);
      toast.success(`Generated ${type} suggestion!`);
    } catch (error) {
      console.error("Failed to generate content suggestion:", error);
      toast.error("Failed to connect to AI service. Using local fallback.");
      
      // Local fallback when API is unavailable
      let suggestion = "";
      
      switch (type) {
        case "title":
          suggestion = prompt 
            ? `${prompt}: A New Perspective`
            : [
                "The Future of AI in Content Creation",
                "10 Ways AI is Revolutionizing Blogging",
                "How to Leverage AI for Better Blog Engagement",
                "AI and Human Creativity: The Perfect Partnership",
                "Beyond ChatGPT: Emerging AI Tools for Writers"
              ][Math.floor(Math.random() * 5)];
          break;
          
        case "content":
          suggestion = prompt 
            ? `Here's an introduction for your topic on ${prompt}:\n\nIn the rapidly evolving digital landscape, ${prompt} has emerged as a transformative force. This post explores how it's reshaping our understanding and creating new opportunities for innovation.`
            : "Artificial Intelligence is revolutionizing how we create and consume digital content. From automated content suggestions to sophisticated text generation, the tools available to modern content creators are more powerful than ever before. In this post, we'll explore how AI is transforming the blogging landscape and how you can leverage these technologies to enhance your own writing.";
          break;
          
        case "improvement":
          suggestion = prompt
            ? `To enhance your content on ${prompt}, consider adding specific examples, relevant statistics, and addressing common questions your readers might have about ${prompt}.`
            : "Consider adding more specific examples to illustrate your points. Statistics and data can also strengthen your arguments. Make sure your introduction clearly states the value readers will get from your post, and your conclusion reinforces your main points while including a clear call to action.";
          break;
          
        default:
          suggestion = "I don't have a suggestion for this type of content yet.";
      }
      
      setContentSuggestions(prev => [...prev, { type, suggestion, used: false }]);
      toast.success(`Generated ${type} suggestion (local fallback)!`);
    } finally {
      setIsLoading(false);
    }
  };

  const markSuggestionAsUsed = (index: number) => {
    setContentSuggestions(prev => 
      prev.map((suggestion, i) => 
        i === index ? { ...suggestion, used: true } : suggestion
      )
    );
  };

  const clearSuggestions = () => {
    setContentSuggestions([]);
  };

  return (
    <ChatbotContext.Provider value={{
      messages,
      isLoading,
      contentSuggestions,
      sendMessage,
      clearChat,
      generateContentSuggestion,
      markSuggestionAsUsed,
      clearSuggestions,
    }}>
      {children}
    </ChatbotContext.Provider>
  );
};
