
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
  analyzeSentiment: (text: string) => Promise<{ sentiment: string; score: number }>;
  detectSpam: (text: string) => Promise<{ isSpam: boolean; confidence: number }>;
}

const initialMessages: Message[] = [
  {
    id: "msg-1",
    content: "Hello! I'm your AI writing assistant. I can help you with blog ideas, content suggestions, or answer questions about writing and blogging. How can I assist you today?",
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

  // Enhanced AI responses based on input with more blogging focus
  const generateLocalAIResponse = async (userMessage: string): Promise<string> => {
    // Wait to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello there! I'm your AI writing assistant. I can help you create better blog content. What would you like to work on today?";
    } else if (lowerMessage.includes("blog idea") || lowerMessage.includes("topic")) {
      return "Here are some trending blog topic ideas:\n\n1. The Impact of AI on Content Quality\n2. How to Use AI to Overcome Writer's Block\n3. Ethical Considerations in AI-Generated Content\n4. The Future of Human-AI Collaboration in Writing\n5. AI Tools Every Blogger Should Know About\n\nWould you like me to elaborate on any of these topics?";
    } else if (lowerMessage.includes("seo") || lowerMessage.includes("search engine")) {
      return "To improve your blog's SEO with AI tools:\n\n1. Use AI keyword research to find relevant topics with search volume\n2. Analyze competing content with AI analysis tools\n3. Ensure readability and engagement - AI can help optimize this\n4. Create SEO-friendly meta descriptions and title tags\n5. Use structured data markup for better visibility\n\nWould you like specific tips for implementing any of these strategies?";
    } else if (lowerMessage.includes("write introduction") || lowerMessage.includes("intro")) {
      return "Here's a sample introduction for your blog post:\n\n\"In today's digital landscape, content creators face unprecedented challenges and opportunities. With the rise of artificial intelligence and machine learning technologies, the way we approach content creation has fundamentally changed. This post explores how these emerging tools can enhance rather than replace human creativity, offering practical insights for bloggers looking to stay ahead of the curve.\"";
    } else if (lowerMessage.includes("improve engagement") || lowerMessage.includes("more readers")) {
      return "To boost your blog engagement:\n\n1. Create compelling headlines that spark curiosity\n2. Open with a strong hook that addresses reader pain points\n3. Use storytelling techniques to maintain interest\n4. Include visual content like images, infographics or videos\n5. End posts with thought-provoking questions\n6. Respond to comments quickly and thoughtfully\n7. Create shareable content with emotional appeal";
    } else {
      return "That's an interesting point about blogging! I can help you develop this idea further with research-backed insights, practical examples, or content outlines. Would you like me to focus on any specific aspect to help improve your blog content?";
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

  // Enhanced content suggestion generator with more blogging-focused suggestions
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
      
      // Enhanced local fallback with better blogging suggestions
      let suggestion = "";
      
      switch (type) {
        case "title":
          suggestion = prompt 
            ? generateTitleSuggestion(prompt)
            : generateRandomTitleSuggestion();
          break;
          
        case "content":
          suggestion = prompt 
            ? generateContentIdeaSuggestion(prompt)
            : generateRandomContentSuggestion();
          break;
          
        case "improvement":
          suggestion = prompt
            ? generateImprovementSuggestion(prompt)
            : generateRandomImprovementSuggestion();
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

  // Helper functions for generating better suggestions
  const generateTitleSuggestion = (topic: string) => {
    const titleFormats = [
      `${topic}: The Ultimate Guide for Beginners`,
      `10 Ways to Master ${topic} in 2025`,
      `Why ${topic} Matters More Than Ever Before`,
      `The Surprising Truth About ${topic} That No One Talks About`,
      `How ${topic} Is Revolutionizing The Industry`
    ];
    return titleFormats[Math.floor(Math.random() * titleFormats.length)];
  };

  const generateRandomTitleSuggestion = () => {
    const titles = [
      "The Future of AI in Content Creation: Beyond Automation",
      "10 Data-Driven Strategies to Double Your Blog Traffic",
      "Why Storytelling Remains the Most Powerful Blogging Technique",
      "The Psychology Behind Viral Content: What Makes Readers Share",
      "Balancing SEO and Readability: The Ultimate Guide for Content Creators"
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const generateContentIdeaSuggestion = (topic: string) => {
    return `Here are 5 content ideas for blog posts about ${topic}:\n\n` +
      `1. The Beginner's Guide to ${topic}: Everything You Need to Know\n` +
      `2. How ${topic} Can Transform Your Business in 2025\n` +
      `3. Common Myths About ${topic} Debunked\n` +
      `4. Case Study: How Company X Used ${topic} to Achieve Amazing Results\n` +
      `5. The Future of ${topic}: Trends and Predictions\n\n` +
      `Each of these can be expanded into full articles with research, examples, and actionable advice.`;
  };

  const generateRandomContentSuggestion = () => {
    return "Here's an outline for your next blog post:\n\n" +
      "**Title: 7 Proven Ways to Grow Your Blog Audience**\n\n" +
      "**Introduction:**\n- Hook: Start with a surprising statistic about blog growth\n- Problem statement: Many bloggers struggle to find and retain readers\n- Promise: This post will provide actionable strategies\n\n" +
      "**Main Sections:**\n1. Understand Your Target Audience\n2. Create Consistent, Quality Content\n3. Master SEO Fundamentals\n4. Leverage Social Media Strategically\n5. Build an Email List From Day One\n6. Network with Other Bloggers\n7. Analyze and Adapt Based on Performance Metrics\n\n" +
      "**Conclusion:**\n- Recap of strategies\n- Encouragement to start with just 1-2 tactics\n- Call to action for readers to share their own experiences";
  };

  const generateImprovementSuggestion = (content: string) => {
    // Simple analysis of content to provide relevant improvements
    const wordCount = content.split(/\s+/).length;
    let suggestions = "Here are some suggestions to improve your content:\n\n";
    
    if (wordCount < 100) {
      suggestions += "- Your content is quite brief. Consider expanding it to provide more value to readers.\n";
    }
    
    if (!content.includes("?")) {
      suggestions += "- Add questions to engage readers and make your content more conversational.\n";
    }
    
    if (content.split(".").length < 5) {
      suggestions += "- Break up long paragraphs into shorter ones to improve readability.\n";
    }
    
    suggestions += "- Consider adding subheadings to organize information better.\n";
    suggestions += "- Include relevant statistics or data to support your points.\n";
    suggestions += "- Add a clear call to action at the end to guide readers on what to do next.";
    
    return suggestions;
  };

  const generateRandomImprovementSuggestion = () => {
    return "Here are some ways to enhance your blog post:\n\n" +
      "1. **Add a compelling headline** - Your current title could be more attention-grabbing. Consider using power words or numbers.\n\n" +
      "2. **Improve your introduction** - Start with a strong hook that identifies a problem your readers face.\n\n" +
      "3. **Add more subheadings** - Breaking your content into clear sections improves readability and scannability.\n\n" +
      "4. **Include visual elements** - Add relevant images, infographics, or diagrams to illustrate key points.\n\n" +
      "5. **Strengthen your conclusion** - End with a clear summary and actionable next steps for readers.\n\n" +
      "6. **Add internal and external links** - Connect to your other relevant content and authoritative sources.";
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

  // New AI features
  
  // Sentiment analysis feature
  const analyzeSentiment = async (text: string): Promise<{ sentiment: string; score: number }> => {
    try {
      // In a real implementation, this would call a backend API
      // For now, we'll return a mock result
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple sentiment detection
      const positiveWords = ["good", "great", "excellent", "amazing", "love", "best", "happy"];
      const negativeWords = ["bad", "awful", "terrible", "hate", "worst", "poor", "disappointed"];
      
      const words = text.toLowerCase().split(/\W+/);
      let positiveCount = 0;
      let negativeCount = 0;
      
      words.forEach(word => {
        if (positiveWords.includes(word)) positiveCount++;
        if (negativeWords.includes(word)) negativeCount++;
      });
      
      let sentiment: string;
      let score: number;
      
      if (positiveCount > negativeCount) {
        sentiment = "positive";
        score = 0.5 + (positiveCount / (positiveCount + negativeCount)) * 0.5;
      } else if (negativeCount > positiveCount) {
        sentiment = "negative";
        score = 0.5 - (negativeCount / (positiveCount + negativeCount)) * 0.5;
      } else {
        sentiment = "neutral";
        score = 0.5;
      }
      
      return { sentiment, score };
    } catch (error) {
      console.error("Sentiment analysis error:", error);
      throw error;
    }
  };
  
  // Spam detection feature
  const detectSpam = async (text: string): Promise<{ isSpam: boolean; confidence: number }> => {
    try {
      // In a real implementation, this would call a backend API
      // For now, we'll implement a simple detection algorithm
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const spamIndicators = [
        "buy now", "click here", "free money", "limited time", "act now",
        "guarantee", "no risk", "viagra", "casino", "lottery", "winner",
        "earn money", "earn from home", "get rich", "double your"
      ];
      
      const lowerText = text.toLowerCase();
      
      // Check for spam indicators
      let spamScore = 0;
      spamIndicators.forEach(indicator => {
        if (lowerText.includes(indicator)) spamScore += 1;
      });
      
      // Check for excessive URLs
      const urlCount = (lowerText.match(/https?:\/\//g) || []).length;
      if (urlCount > 2) spamScore += urlCount - 1;
      
      // Check for ALL CAPS
      const wordsArray = text.split(/\s+/);
      const capsWordCount = wordsArray.filter(word => word.length > 2 && word === word.toUpperCase()).length;
      if (capsWordCount > wordsArray.length * 0.3) spamScore += 2;
      
      // Calculate confidence
      const confidence = Math.min(0.95, spamScore * 0.15);
      const isSpam = confidence > 0.5;
      
      return { isSpam, confidence };
    } catch (error) {
      console.error("Spam detection error:", error);
      throw error;
    }
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
      analyzeSentiment,
      detectSpam,
    }}>
      {children}
    </ChatbotContext.Provider>
  );
};
