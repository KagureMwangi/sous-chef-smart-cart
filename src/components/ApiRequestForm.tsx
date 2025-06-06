
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ApiRequestForm = () => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [botReply, setBotReply] = useState<string | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  const { toast } = useToast();

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

    setIsLoading(true);
    setLastUserMessage(userInput);
    setBotReply(null);

    try {
      console.log('Sending API request with user input:', userInput);
      
      const response = await fetch('https://hook.eu2.make.com/4y6p5i8y7jnbwbn3g37nx83wx9hoe81o', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: userInput
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const responseData = await response.json();
        console.log('Response data:', responseData);
        
        // Extract the reply field from the response
        if (responseData.reply) {
          setBotReply(responseData.reply);
          toast({
            title: "Success",
            description: "API request sent successfully!",
          });
        } else {
          console.warn('No reply field found in response:', responseData);
          setBotReply("No reply received from the webhook.");
          toast({
            title: "Warning",
            description: "Request sent but no reply field found in response",
            variant: "destructive",
          });
        }
        
        setUserInput(''); // Clear input after successful send
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending API request:', error);
      setBotReply("Error: Failed to get response from webhook.");
      toast({
        title: "Error",
        description: `Failed to send API request: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-effect neon-border hover:neon-glow transition-all duration-300 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="gradient-text flex items-center space-x-2">
          <Send className="h-6 w-6" />
          <span>API Request Form</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendRequest} className="space-y-4">
          <div>
            <label htmlFor="user_input" className="block text-sm font-medium mb-2">
              User Input
            </label>
            <Input
              id="user_input"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter your message here..."
              disabled={isLoading}
              className="w-full"
            />
          </div>
          
          <Button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="w-full neon-border hover:neon-glow transition-all duration-300"
          >
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? 'Sending...' : 'Send API Request'}
          </Button>
        </form>

        {/* Chat-like display for conversation */}
        {(lastUserMessage || botReply) && (
          <div className="mt-6 space-y-4 border-t pt-4">
            <h3 className="text-sm font-medium text-muted-foreground">Conversation</h3>
            
            {/* User message */}
            {lastUserMessage && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <User className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <p className="text-sm">{lastUserMessage}</p>
                </div>
              </div>
            )}

            {/* Bot reply or loading */}
            {isLoading ? (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Bot className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Bot is typing...</p>
                </div>
              </div>
            ) : botReply && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Bot className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-sm">{botReply}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 text-xs text-muted-foreground">
          <p>Endpoint: https://hook.eu2.make.com/4y6p5i8y7jnbwbn3g37nx83wx9hoe81o</p>
          <p>Method: POST</p>
          <p>Expected response field: "reply"</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiRequestForm;
