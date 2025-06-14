
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, History, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useConversationHistory } from '@/hooks/useConversationHistory';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import RecentRecipes from './RecentRecipes';

interface ApiRequestFormProps {
  userId?: string;
}

const ApiRequestForm = ({ userId }: ApiRequestFormProps) => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { conversation, addMessage, getRecentRecipes, clearHistory } = useConversationHistory(userId);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [conversation, isLoading]);

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text before sending",
        variant: "destructive",
      });
      return;
    }

    const userMessage = userInput.trim();
    setIsLoading(true);
    
    // Add user message to conversation
    addMessage({ type: 'user', message: userMessage });
    setUserInput(''); // Clear input immediately

    try {
      console.log('Sending message to enhanced AI assistant:', userMessage);
      
      // Use Supabase edge function that includes user context
      const { data: responseData, error } = await supabase.functions.invoke('ai-assistant', {
        body: { userInput: userMessage }
      });

      if (error) {
        throw error;
      }

      console.log('Response data:', responseData);
      
      // Extract the reply field from the response
      if (responseData.reply) {
        addMessage({ type: 'bot', message: responseData.reply });
        toast({
          title: "Success",
          description: "Message sent successfully!",
        });
      } else {
        console.warn('No reply field found in response:', responseData);
        addMessage({ type: 'bot', message: "No reply received from the assistant." });
        toast({
          title: "Warning",
          description: "Message sent but no reply field found in response",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({ type: 'bot', message: "Error: Failed to get response from assistant." });
      toast({
        title: "Error",
        description: `Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const recentRecipes = getRecentRecipes();

  return (
    <Card className="glass-effect neon-border hover:neon-glow transition-all duration-300 w-full max-w-5xl sm:max-w-6xl mx-auto h-[600px] flex flex-col px-2 sm:px-4">
      <CardHeader className="flex-shrink-0 px-2 sm:px-6">
        <div className="flex justify-between items-center">
          <CardTitle className="gradient-text flex items-center space-x-2 text-lg sm:text-2xl">
            <Send className="h-5 w-5 sm:h-6 sm:w-6" />
            <span>AI Question Assistant</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            {/* Recent Recipes Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="neon-border">
                  <History className="h-4 w-4 mr-1" />
                  Recipes ({recentRecipes.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Recent Recipes from AI Assistant</DialogTitle>
                </DialogHeader>
                <ScrollArea className="mt-4 max-h-[60vh]">
                  <RecentRecipes recipes={recentRecipes} />
                </ScrollArea>
              </DialogContent>
            </Dialog>

            {/* Clear History Button */}
            {conversation.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearHistory}
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col min-h-0 px-2 sm:px-6">
        {/* Chat Messages with ScrollArea */}
        <div className="flex-1 min-h-0 mb-4">
          <ScrollArea ref={scrollAreaRef} className="h-full border rounded-lg bg-background/50">
            <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
              {conversation.length === 0 ? (
                <div className="text-center text-muted-foreground py-6 sm:py-8">
                  <Bot className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">Ask me anything! I can help with cooking, meal planning, and recipes based on what you have in your pantry.</p>
                  <p className="text-xs sm:text-sm mt-2 opacity-75">I have access to your pantry items and dietary restrictions to give you personalized advice.</p>
                </div>
              ) : (
                conversation.map((item) => (
                  <div key={item.id} className="flex items-start space-x-2 sm:space-x-3">
                    <div className="flex-shrink-0">
                      {item.type === 'user' ? (
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                      ) : (
                        <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                      )}
                    </div>
                    <div className={`flex-1 rounded-lg p-2 sm:p-3 break-words ${
                      item.type === 'user' 
                        ? 'bg-blue-50 dark:bg-blue-900/20' 
                        : 'bg-gray-50 dark:bg-gray-800'
                    }`}>
                      <p className="text-xs sm:text-sm whitespace-pre-wrap">{item.message}</p>
                      {item.containsRecipe && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                            <Send className="h-3 w-3 mr-1" />
                            Recipe
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="flex-shrink-0">
                    <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                  <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-2 sm:p-3">
                    <p className="text-xs sm:text-sm text-muted-foreground">AI is thinking and checking your pantry...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input Form */}
        <div className="flex-shrink-0">
          <form onSubmit={handleSendRequest} className="flex space-x-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask me about cooking, recipes, or what you can make with your pantry..."
              disabled={isLoading}
              className="flex-1 text-sm sm:text-base"
              autoFocus
            />
            <Button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="neon-border hover:neon-glow transition-all duration-300 px-3 sm:px-4"
            >
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </form>

          <div className="mt-4 text-xs text-muted-foreground">
            <p className="break-all">Enhanced AI Assistant with access to your pantry and dietary preferences</p>
            <p className="break-all">Try asking: "What can I cook with what I have?" or "Suggest a recipe for dinner"</p>
            {recentRecipes.length > 0 && (
              <p className="break-all text-green-600 dark:text-green-400">
                💡 {recentRecipes.length} recent recipe{recentRecipes.length > 1 ? 's' : ''} available in history
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiRequestForm;
