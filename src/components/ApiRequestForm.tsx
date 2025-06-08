
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ApiRequestForm = () => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'bot', message: string}>>([]);
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

    const userMessage = userInput.trim();
    setIsLoading(true);
    
    // Add user message to conversation
    setConversation(prev => [...prev, { type: 'user', message: userMessage }]);
    setUserInput(''); // Clear input immediately

    try {
      console.log('Sending message to custom backend:', userMessage);
      
      const response = await fetch('https://94c5-197-248-103-242.ngrok-free.app/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: userMessage
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const responseData = await response.json();
        console.log('Response data:', responseData);
        
        // Extract the reply field from the response
        if (responseData.reply) {
          setConversation(prev => [...prev, { type: 'bot', message: responseData.reply }]);
          toast({
            title: "Success",
            description: "Message sent successfully!",
          });
        } else {
          console.warn('No reply field found in response:', responseData);
          setConversation(prev => [...prev, { type: 'bot', message: "No reply received from the backend." }]);
          toast({
            title: "Warning",
            description: "Message sent but no reply field found in response",
            variant: "destructive",
          });
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setConversation(prev => [...prev, { type: 'bot', message: "Error: Failed to get response from backend." }]);
      toast({
        title: "Error",
        description: `Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-effect neon-border hover:neon-glow transition-all duration-300 max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="gradient-text flex items-center space-x-2">
          <Send className="h-6 w-6" />
          <span>Custom Backend Chat</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 border rounded-lg p-4 bg-background/50">
          {conversation.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start a conversation with your custom backend!</p>
            </div>
          ) : (
            conversation.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {item.type === 'user' ? (
                    <User className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Bot className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div className={`flex-1 rounded-lg p-3 ${
                  item.type === 'user' 
                    ? 'bg-blue-50 dark:bg-blue-900/20' 
                    : 'bg-gray-50 dark:bg-gray-800'
                }`}>
                  <p className="text-sm">{item.message}</p>
                </div>
              </div>
            ))
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Bot className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Backend is processing your message...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendRequest} className="flex space-x-2">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message here..."
            disabled={isLoading}
            className="flex-1"
            autoFocus
          />
          <Button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="neon-border hover:neon-glow transition-all duration-300"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>Backend: https://94c5-197-248-103-242.ngrok-free.app/</p>
          <p>Method: POST | Format: {"user_input": "message"} | Expects: {"reply": "response"}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiRequestForm;
