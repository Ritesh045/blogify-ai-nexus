
import React, { useState } from "react";
import { useChatbot, ContentSuggestion } from "@/context/ChatbotContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy, Sparkles, Plus, Loader2, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface ContentSuggestionsProps {
  onUseSuggestion?: (suggestion: string) => void;
}

const ContentSuggestions: React.FC<ContentSuggestionsProps> = ({ onUseSuggestion }) => {
  const { contentSuggestions, generateContentSuggestion, markSuggestionAsUsed, isLoading, clearSuggestions } = useChatbot();
  const [suggestionType, setSuggestionType] = useState("title");
  const [customPrompt, setCustomPrompt] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleGenerateSuggestion = () => {
    generateContentSuggestion(suggestionType as "title" | "content" | "improvement", customPrompt || undefined);
    setCustomPrompt("");
    setShowInput(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleUse = (index: number, suggestion: string) => {
    markSuggestionAsUsed(index);
    if (onUseSuggestion) {
      onUseSuggestion(suggestion);
    }
    toast.success("Suggestion applied!");
  };

  return (
    <Card className="shadow-md border-gray-200">
      <CardHeader className="bg-secondary/30 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-ai" />
            <CardTitle className="text-lg">AI Content Suggestions</CardTitle>
          </div>
          {contentSuggestions.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-gray-500 hover:text-red-500"
              onClick={clearSuggestions}
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex gap-2 items-start">
            <Select
              value={suggestionType}
              onValueChange={setSuggestionType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Blog Title</SelectItem>
                <SelectItem value="content">Content Ideas</SelectItem>
                <SelectItem value="improvement">Improvements</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInput(!showInput)}
              className="flex-shrink-0"
            >
              {showInput ? "Hide Prompt" : "Add Prompt"}
            </Button>

            <Button 
              onClick={handleGenerateSuggestion} 
              disabled={isLoading}
              className="flex-shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>

          {showInput && (
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={
                suggestionType === "title"
                  ? "Enter topic for title suggestions..."
                  : suggestionType === "content"
                  ? "Enter topic for content ideas..."
                  : "Enter your draft content for improvement suggestions..."
              }
              className="min-h-[80px] w-full"
            />
          )}

          <div className="space-y-4 mt-4">
            {contentSuggestions.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                <Sparkles className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">
                  Generate AI suggestions to improve your content
                </p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleGenerateSuggestion}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Generate your first suggestion
                </Button>
              </div>
            ) : (
              contentSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`border rounded-lg overflow-hidden ${
                    suggestion.used ? "opacity-60" : ""
                  }`}
                >
                  <div className="p-3 bg-gray-50 border-b flex items-center justify-between">
                    <div className="flex items-center">
                      <Sparkles className="h-4 w-4 text-ai mr-2" />
                      <span className="font-medium capitalize">
                        {suggestion.type} Suggestion
                      </span>
                    </div>
                    {suggestion.used && (
                      <span className="text-green-600 text-sm flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Applied
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="whitespace-pre-line text-gray-700">
                      {suggestion.suggestion}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 border-t flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(suggestion.suggestion)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    {onUseSuggestion && !suggestion.used && (
                      <Button
                        size="sm"
                        onClick={() => handleUse(index, suggestion.suggestion)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Use
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentSuggestions;
