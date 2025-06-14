
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  const saveRecipeToManager = async (recipe: ConversationMessage) => {
    if (!userId || !recipe.containsRecipe) {
      toast({
        title: "Error",
        description: "Cannot save this message as a recipe.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Extract recipe details from the message
      const recipeData = extractRecipeFromMessage(recipe.message);
      
      const { error } = await supabase
        .from('user_recipes')
        .insert({
          user_id: userId,
          recipe_name: recipeData.name,
          recipe_description: recipeData.description,
          ingredients: recipeData.ingredients,
          instructions: recipeData.instructions,
          prep_time: recipeData.prepTime,
          cook_time: recipeData.cookTime,
          servings: recipeData.servings,
          source: 'searched',
        });

      if (error) {
        console.error('Error saving recipe:', error);
        toast({
          title: "Error",
          description: "Failed to save recipe. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Recipe Saved!",
        description: "Recipe has been added to your collection.",
      });
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const extractRecipeFromMessage = (message: string) => {
    const lines = message.split('\n');
    let recipeName = 'AI Recipe';
    let description = '';
    let ingredients: string[] = [];
    let instructions = '';
    let prepTime: number | null = null;
    let cookTime: number | null = null;
    let servings: number | null = null;

    // Extract recipe name (look for title-like lines)
    for (const line of lines) {
      if (line.includes('Recipe') && line.length < 100 && !line.toLowerCase().includes('ingredient')) {
        recipeName = line.replace(/\*\*/g, '').replace(/#+/g, '').trim();
        break;
      }
    }

    let currentSection = '';
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.toLowerCase().includes('ingredient')) {
        currentSection = 'ingredients';
        continue;
      } else if (trimmedLine.toLowerCase().includes('instruction') || trimmedLine.toLowerCase().includes('direction')) {
        currentSection = 'instructions';
        continue;
      } else if (trimmedLine.toLowerCase().includes('prep time')) {
        const timeMatch = trimmedLine.match(/(\d+)/);
        if (timeMatch) prepTime = parseInt(timeMatch[1]);
        continue;
      } else if (trimmedLine.toLowerCase().includes('cook time')) {
        const timeMatch = trimmedLine.match(/(\d+)/);
        if (timeMatch) cookTime = parseInt(timeMatch[1]);
        continue;
      } else if (trimmedLine.toLowerCase().includes('serving')) {
        const servingMatch = trimmedLine.match(/(\d+)/);
        if (servingMatch) servings = parseInt(servingMatch[1]);
        continue;
      }

      if (currentSection === 'ingredients' && trimmedLine.match(/^[-*•]\s/)) {
        ingredients.push(trimmedLine.replace(/^[-*•]\s/, ''));
      } else if (currentSection === 'instructions' && trimmedLine) {
        instructions += trimmedLine + '\n';
      } else if (!currentSection && trimmedLine && !description) {
        description = trimmedLine;
      }
    }

    return {
      name: recipeName,
      description: description || 'Recipe from AI Assistant',
      ingredients,
      instructions: instructions.trim(),
      prepTime,
      cookTime,
      servings,
    };
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
    saveRecipeToManager,
  };
};
