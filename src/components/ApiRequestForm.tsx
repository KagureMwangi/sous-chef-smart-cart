
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useConversationHistory } from '@/hooks/useConversationHistory';
import ChatHeader from './chat/ChatHeader';
import ChatMessages from './chat/ChatMessages';
import ChatInput from './chat/ChatInput';

interface ApiRequestFormProps {
  userId?: string;
}

const ApiRequestForm = ({ userId }: ApiRequestFormProps) => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const { conversation, addMessage, getRecentRecipes, clearHistory, saveRecipeToManager } = useConversationHistory(userId);

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
    <Card className="glass-effect neon-border hover:neon-glow transition-all duration-300 w-full max-w-full mx-auto h-[600px] flex flex-col px-1 sm:px-4">
      <CardHeader className="flex-shrink-0 px-1 sm:px-6">
        <ChatHeader
          recentRecipes={recentRecipes}
          conversationLength={conversation.length}
          onClearHistory={clearHistory}
        />
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col min-h-0 px-1 sm:px-6">
        <ChatMessages
          conversation={conversation}
          isLoading={isLoading}
          userId={userId}
          onSaveRecipe={saveRecipeToManager}
        />

        <ChatInput
          userInput={userInput}
          isLoading={isLoading}
          recentRecipesCount={recentRecipes.length}
          onInputChange={setUserInput}
          onSubmit={handleSendRequest}
        />
      </CardContent>
    </Card>
  );
};

export default ApiRequestForm;
