
import React, { useState } from "react";
import Chatbot from "@/components/Chatbot/Chatbot";
import ContentSuggestions from "@/components/Suggestions/ContentSuggestions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Sparkles } from "lucide-react";

const ChatPage = () => {
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
        <p className="text-gray-600">
          Get writing help, content ideas, or answers to your blogging questions.
        </p>
      </div>

      <Tabs defaultValue="chat" className="mb-8">
        <TabsList>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Content Suggestions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <div className="mt-6">
            <Chatbot />
          </div>
        </TabsContent>
        <TabsContent value="suggestions">
          <div className="mt-6">
            <ContentSuggestions />
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">How can the AI assist you?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-ai" />
              Chat with the AI
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Get writing advice and feedback</li>
              <li>• Overcome writer's block with prompts</li>
              <li>• Research topics and gather information</li>
              <li>• Improve your writing style and grammar</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ai" />
              Generate Content Suggestions
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Get blog title ideas</li>
              <li>• Generate introductions and outlines</li>
              <li>• Find ways to improve existing content</li>
              <li>• Create content tailored to your topics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
