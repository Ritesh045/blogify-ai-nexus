
import React, { useState } from "react";
import { useChatbot, ContentSuggestion } from "@/context/ChatbotContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy, Sparkles, Plus, Loader2, X, Lightbulb } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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

  const suggestionTypeOptions = [
    { value: "title", label: "Blog Title", description: "Generate catchy blog post titles" },
    { value: "content", label: "Content Ideas", description: "Get content and topic suggestions" },
    { value: "improvement", label: "Improvements", description: "Enhance your existing content" },
  ];

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="bg-white border-b py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-ai/10 rounded-full p-2">
              <Sparkles className="h-5 w-5 text-ai" />
            </div>
            <div>
              <CardTitle className="text-lg">Content Suggestions</CardTitle>
              <p className="text-sm text-gray-600">AI-powered blog content ideas</p>
            </div>
          </div>
          {contentSuggestions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-gray-500 hover:text-red-500"
              onClick={clearSuggestions}
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-5">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 className="text-sm font-medium mb-3">What would you like to generate?</h3>
            
            <div className="grid md:grid-cols-3 gap-3 mb-4">
              {suggestionTypeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    suggestionType === option.value 
                      ? "border-ai/50 bg-ai/5 shadow-sm" 
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setSuggestionType(option.value)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{option.label}</span>
                    {suggestionType === option.value && (
                      <Badge variant="secondary" className="bg-ai/20 text-ai">Selected</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{option.description}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Add specific prompt (optional)</label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowInput(!showInput)}
                  className="text-xs h-7"
                >
                  {showInput ? "Hide" : "Add Prompt"}
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

              <Button 
                onClick={handleGenerateSuggestion} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {customPrompt ? "Generate Based on Prompt" : "Generate Suggestion"}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {contentSuggestions.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <Lightbulb className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                <h3 className="font-medium mb-1">No suggestions yet</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Generate AI suggestions to improve your content
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateSuggestion}
                  className="mx-auto"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Generate your first suggestion
                </Button>
              </div>
            ) : (
              contentSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`border rounded-lg overflow-hidden bg-white ${
                    suggestion.used ? "opacity-70" : ""
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
                      <span className="text-green-600 text-xs flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Applied
                      </span>
                    )}
                  </div>
                  <div className="p-4">
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
