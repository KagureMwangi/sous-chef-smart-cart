
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ConversationMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
  containsRecipe?: boolean;
  suggestedItems?: SuggestedShoppingItem[];
}

export interface SuggestedShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  category?: string;
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
      ),
      suggestedItems: message.suggestedItems || extractShoppingItems(message.message)
    };

    setConversation(prev => {
      const updated = [...prev, newMessage];
      // Keep only the last 50 messages to prevent storage overflow
      return updated.slice(-50);
    });
  };

  const extractShoppingItems = (message: string): SuggestedShoppingItem[] => {
    if (!message.toLowerCase().includes('shopping') && !message.toLowerCase().includes('buy')) {
      return [];
    }

    // Simple extraction logic - this could be made more sophisticated
    const items: SuggestedShoppingItem[] = [];
    const lines = message.split('\n');
    
    lines.forEach(line => {
      // Look for lines that might contain shopping items
      const itemMatch = line.match(/[-*]\s*(\d+(?:\.\d+)?)\s*(\w+)\s+(.+?)(?:\s*-|$)/i);
      if (itemMatch) {
        const [, quantity, unit, name] = itemMatch;
        items.push({
          name: name.trim(),
          quantity: parseFloat(quantity),
          unit: unit.toLowerCase(),
        });
      }
    });

    return items;
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
