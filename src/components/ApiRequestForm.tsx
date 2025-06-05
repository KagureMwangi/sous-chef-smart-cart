
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ApiRequestForm = () => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

    try {
      console.log('Sending API request with user input:', userInput);
      
      const response = await fetch('https://hook.eu2.make.com/iw6l3sqlvme6kcbc7uxukxsczsj9cz4o', {
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
        toast({
          title: "Success",
          description: "API request sent successfully!",
        });
        setUserInput(''); // Clear input after successful send
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending API request:', error);
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

        <div className="mt-4 text-xs text-muted-foreground">
          <p>Endpoint: https://hook.eu2.make.com/iw6l3sqlvme6kcbc7uxukxsczsj9cz4o</p>
          <p>Method: POST</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiRequestForm;
