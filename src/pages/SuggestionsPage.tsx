
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentSuggestions from "@/components/Suggestions/ContentSuggestions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Sparkles, BookOpen, Edit, Lightbulb, Check } from "lucide-react";

const SuggestionsPage = () => {
  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Content Suggestions</h1>
        <p className="text-gray-600 mt-2">
          Get intelligent suggestions to improve your blog writing and content creation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="content">
            <TabsList className="mb-6">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Content Suggestions
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Writing Tips
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="content">
              <ContentSuggestions />
            </TabsContent>
            
            <TabsContent value="tips">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-ai" />
                    AI Writing Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-secondary/20 rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-2">Crafting Engaging Headlines</h3>
                    <p className="text-gray-700 mb-3">
                      Your headline is the first thing readers see. Make it count with these AI-approved tips:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>Include numbers when relevant (e.g., "7 Ways to Improve...")</span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>Use powerful adjectives that evoke emotion</span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>Ask compelling questions that spark curiosity</span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>Make a bold claim or promise (that your content delivers on)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-secondary/20 rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-2">Creating Readable Content Structure</h3>
                    <p className="text-gray-700 mb-3">
                      Well-structured content keeps readers engaged and makes information digestible:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>Use descriptive subheadings to break up content</span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>Keep paragraphs short (3-4 sentences maximum)</span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>Include bulleted or numbered lists for easy scanning</span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>Add visual breaks with images, quotes, or examples</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-secondary/20 rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-2">Engaging Your Readers</h3>
                    <p className="text-gray-700 mb-3">
                      Connection is key to keeping your audience interested and coming back:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>Tell personal stories and anecdotes that relate to your topic</span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>Use the second person ("you") to speak directly to readers</span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>Ask thought-provoking questions throughout your content</span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>End with a clear call-to-action or conversation starter</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div>
          <div className="space-y-6">
            <Card className="bg-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-ai" />
                  How AI Can Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-white rounded-full p-2 h-8 w-8 flex items-center justify-center shadow-sm">
                    <Edit className="h-4 w-4 text-ai" />
                  </div>
                  <div>
                    <h3 className="font-medium">Generate Ideas</h3>
                    <p className="text-sm text-gray-600">Overcome writer's block with AI-generated topic ideas</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-white rounded-full p-2 h-8 w-8 flex items-center justify-center shadow-sm">
                    <BookOpen className="h-4 w-4 text-ai" />
                  </div>
                  <div>
                    <h3 className="font-medium">Improve Content</h3>
                    <p className="text-sm text-gray-600">Get suggestions to enhance readability and engagement</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-white rounded-full p-2 h-8 w-8 flex items-center justify-center shadow-sm">
                    <Bot className="h-4 w-4 text-ai" />
                  </div>
                  <div>
                    <h3 className="font-medium">Personal Assistant</h3>
                    <p className="text-sm text-gray-600">Get AI assistance throughout the writing process</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer">AI Technology</Badge>
                  <Badge variant="outline" className="cursor-pointer">Content Marketing</Badge>
                  <Badge variant="outline" className="cursor-pointer">SEO</Badge>
                  <Badge variant="outline" className="cursor-pointer">Writing Tips</Badge>
                  <Badge variant="outline" className="cursor-pointer">Productivity</Badge>
                  <Badge variant="outline" className="cursor-pointer">Digital Marketing</Badge>
                  <Badge variant="outline" className="cursor-pointer">Social Media</Badge>
                  <Badge variant="outline" className="cursor-pointer">Business</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-gray-500">Did you know?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Blog posts with good headlines get 2x more social media shares and 3x more traffic than posts with generic titles.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionsPage;
