import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ConversationMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
  containsRecipe?: boolean;
}

export const useConversationHistory = (userId?: string) => {
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const { toast } = useToast();

  // Load conversation from localStorage on mount
  useEffect(() => {
    if (!userId) return;
    
    const storageKey = `conversation_history_${userId}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const messages = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setConversation(messages);
      } catch (error) {
        console.error('Error loading conversation history:', error);
      }
    }
  }, [userId]);

  // Save conversation to localStorage whenever it changes
  useEffect(() => {
    if (!userId || conversation.length === 0) return;
    
    const storageKey = `conversation_history_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify(conversation));
  }, [userId, conversation]);

  const addMessage = (message: Omit<ConversationMessage, 'id' | 'timestamp'>) => {
    const newMessage: ConversationMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      containsRecipe: message.type === 'bot' && (
        message.message.toLowerCase().includes('recipe') ||
        message.message.toLowerCase().includes('ingredient') ||
        message.message.toLowerCase().includes('cook') ||
        message.message.toLowerCase().includes('bake')
      )
    };

    setConversation(prev => {
      const updated = [...prev, newMessage];
      // Keep only the last 50 messages to prevent storage overflow
      return updated.slice(-50);
    });
  };

  const getRecentRecipes = () => {
    return conversation
      .filter(msg => msg.type === 'bot' && msg.containsRecipe)
      .slice(-5) // Get last 5 recipe messages
      .reverse(); // Most recent first
  };

  const clearHistory = () => {
    if (!userId) return;
    
    setConversation([]);
    const storageKey = `conversation_history_${userId}`;
    localStorage.removeItem(storageKey);
    
    toast({
      title: "History Cleared",
      description: "Conversation history has been cleared.",
    });
  };

  return {
    conversation,
    addMessage,
    getRecentRecipes,
    clearHistory,
  };
};
