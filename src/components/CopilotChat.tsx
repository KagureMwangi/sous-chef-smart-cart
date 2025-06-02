
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

interface CopilotResponse {
  recommendation: string;
  conversationId: string;
  directLineToken: string;
}

const CopilotChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentDirectLineToken, setCurrentDirectLineToken] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    console.log('🚀 Starting message send process...');
    console.log('📤 User input:', userInput);
    console.log('🔗 Current conversation ID:', currentConversationId);
    console.log('🎫 Current direct line token:', currentDirectLineToken);

    // Add user message to conversation
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: userInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const requestPayload = {
      userInput,
      currentConversationId,
      currentDirectLineToken,
    };

    console.log('📦 Request payload:', requestPayload);

    try {
      console.log('🌐 Making fetch request to:', 'https://tlzgtdnnuzqvzpxexlsm.supabase.co/functions/v1/copilot-agent');
      
      const response = await fetch('https://tlzgtdnnuzqvzpxexlsm.supabase.co/functions/v1/copilot-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsemd0ZG5udXpxdnpweGV4bHNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NDc0OTksImV4cCI6MjA2NDAyMzQ5OX0.j3S8ZrJ_SJzaNDOwU55ebx6Mb5W3OByNp3nihnSZpPk'}`,
        },
        body: JSON.stringify(requestPayload),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('✅ Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data: CopilotResponse = await response.json();
      console.log('📥 Response data:', data);

      // Update conversation state
      setCurrentConversationId(data.conversationId);
      setCurrentDirectLineToken(data.directLineToken);

      console.log('🔄 Updated conversation ID:', data.conversationId);
      console.log('🔄 Updated direct line token:', data.directLineToken);

      // Add bot response to conversation
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: data.recommendation,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      console.log('✅ Successfully added bot message');
    } catch (error) {
      console.error('💥 Detailed error information:');
      console.error('Error type:', typeof error);
      console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('Full error object:', error);
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('🌐 This appears to be a network connectivity issue');
        toast({
          title: "Network Error",
          description: "Unable to connect to the server. Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      setUserInput('');
      console.log('🏁 Message send process completed');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="glass-effect neon-border hover:neon-glow transition-all duration-300 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="gradient-text flex items-center space-x-2">
          <Bot className="h-6 w-6" />
          <span>Copilot Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Debug Info */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          <p>🔍 Debug Info:</p>
          <p>API Endpoint: https://tlzgtdnnuzqvzpxexlsm.supabase.co/functions/v1/copilot-agent</p>
          <p>Conversation ID: {currentConversationId || 'Not set'}</p>
          <p>Token Status: {currentDirectLineToken ? 'Available' : 'Not available'}</p>
        </div>

        {/* Messages Display Area */}
        <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-3 bg-background/50">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start a conversation with the Copilot assistant</p>
              <p className="text-xs mt-2">Check the browser console for detailed logs</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'bot' && (
                  <div className="flex-shrink-0">
                    <Bot className="h-6 w-6 text-neon-cyan" />
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.type === 'user' && (
                  <div className="flex-shrink-0">
                    <User className="h-6 w-6 text-neon-green" />
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <Bot className="h-6 w-6 text-neon-cyan animate-pulse" />
              <div className="bg-muted text-foreground max-w-xs px-4 py-2 rounded-lg">
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex space-x-2">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !userInput.trim()}
            className="neon-border hover:neon-glow transition-all duration-300"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Connection Status */}
        <div className="text-xs text-muted-foreground">
          <p>Conversation ID: {currentConversationId || 'Not started'}</p>
          <p>Token Status: {currentDirectLineToken ? 'Connected' : 'Not connected'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CopilotChat;
