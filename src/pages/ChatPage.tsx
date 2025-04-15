
import React, { useState } from "react";
import Chatbot from "@/components/Chatbot/Chatbot";
import ContentSuggestions from "@/components/Suggestions/ContentSuggestions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Sparkles, Bot, Zap } from "lucide-react";

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState<"chat" | "suggestions">("chat");

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Writing Assistant</h1>
        <p className="text-gray-600">
          Get writing help, content ideas, or answers to your blogging questions.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="chat" className="mb-8" onValueChange={(value) => setActiveTab(value as "chat" | "suggestions")}>
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="chat" className="flex-1 flex items-center justify-center gap-2 py-3">
                <Bot className="w-4 h-4" />
                AI Chat
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="flex-1 flex items-center justify-center gap-2 py-3">
                <Sparkles className="w-4 h-4" />
                Content Ideas
              </TabsTrigger>
            </TabsList>
            <TabsContent value="chat">
              <div>
                <Chatbot />
              </div>
            </TabsContent>
            <TabsContent value="suggestions">
              <div>
                <ContentSuggestions />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              AI Writing Tools
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <div className="bg-ai/10 rounded-full p-1 h-6 w-6 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-3 w-3 text-ai" />
                </div>
                <div>
                  <p className="font-medium">AI Chat</p>
                  <p className="text-gray-600">Get writing advice and feedback</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <div className="bg-ai/10 rounded-full p-1 h-6 w-6 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-3 w-3 text-ai" />
                </div>
                <div>
                  <p className="font-medium">Content Ideas</p>
                  <p className="text-gray-600">Generate blog topics and outlines</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <div className="bg-ai/10 rounded-full p-1 h-6 w-6 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-3 w-3 text-ai" />
                </div>
                <div>
                  <p className="font-medium">Smart Comments</p>
                  <p className="text-gray-600">Auto spam detection on comments</p>
                </div>
              </li>
            </ul>

            {activeTab === "chat" && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-3">Popular Prompts:</h3>
                <div className="flex flex-col gap-2">
                  <button 
                    className="text-left text-sm bg-secondary/50 hover:bg-secondary px-3 py-2 rounded-md transition-colors"
                    onClick={() => {
                      // This would be connected to the Chatbot component in a real implementation
                      console.log("Prompt selected: Help me write an introduction");
                    }}
                  >
                    Help me write an introduction
                  </button>
                  <button 
                    className="text-left text-sm bg-secondary/50 hover:bg-secondary px-3 py-2 rounded-md transition-colors"
                    onClick={() => {
                      console.log("Prompt selected: Give me 5 blog topics about...");
                    }}
                  >
                    Give me 5 blog topics about...
                  </button>
                  <button 
                    className="text-left text-sm bg-secondary/50 hover:bg-secondary px-3 py-2 rounded-md transition-colors"
                    onClick={() => {
                      console.log("Prompt selected: How can I improve my SEO?");
                    }}
                  >
                    How can I improve my SEO?
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
