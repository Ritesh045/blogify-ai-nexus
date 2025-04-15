
import React, { useState, useRef, useEffect } from "react";
import { useChatbot } from "@/context/ChatbotContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, Sparkles, RefreshCw, X, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Chatbot = () => {
  const { messages, sendMessage, isLoading, clearChat } = useChatbot();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };

  const predefinedPrompts = [
    "How can I make my blog more engaging?",
    "Generate a catchy headline about AI technology",
    "What are some common blogging mistakes to avoid?"
  ];

  const usePrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <Card className="rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
      <CardHeader className="bg-white border-b py-3 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-ai text-white">
              <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-medium">AI Writing Assistant</CardTitle>
              <p className="text-xs text-gray-500">Powered by advanced AI</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearChat}
            className="text-gray-500 hover:text-red-500"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback
                    className={
                      msg.role === "assistant"
                        ? "bg-ai text-white"
                        : "bg-gray-200"
                    }
                  >
                    {msg.role === "assistant" ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      "U"
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-ai/10 text-gray-800 border border-ai/20"
                      : "bg-white border border-gray-200 shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-ai text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-ai/30 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-ai/30 animate-bounce delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-ai/30 animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        {messages.length === 0 && !isLoading && (
          <div className="px-4 py-10 flex flex-col items-center">
            <div className="bg-ai/10 p-3 rounded-full mb-3">
              <Lightbulb className="h-6 w-6 text-ai" />
            </div>
            <h3 className="font-medium text-lg mb-2">Ask anything</h3>
            <p className="text-gray-600 text-center text-sm mb-5">
              Get writing help, content ideas, or blogging advice
            </p>
            <div className="grid grid-cols-1 gap-2 w-full">
              {predefinedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="text-left text-sm bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg border border-gray-200 transition-colors"
                  onClick={() => usePrompt(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for a new line
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;
