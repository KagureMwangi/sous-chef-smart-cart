
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInputProps {
  userInput: string;
  isLoading: boolean;
  recentRecipesCount: number;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ChatInput = ({ 
  userInput, 
  isLoading, 
  recentRecipesCount, 
  onInputChange, 
  onSubmit 
}: ChatInputProps) => {
  return (
    <div className="flex-shrink-0">
      <form onSubmit={onSubmit} className="flex space-x-1 sm:space-x-2">
        <Input
          value={userInput}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Ask me about cooking, recipes, or what you can make..."
          disabled={isLoading}
          className="flex-1 text-xs sm:text-sm md:text-base min-w-0"
          autoFocus
        />
        <Button
          type="submit"
          disabled={isLoading || !userInput.trim()}
          className="neon-border hover:neon-glow transition-all duration-300 px-2 sm:px-3 md:px-4 flex-shrink-0"
        >
          <Send className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </form>

      <div className="mt-2 sm:mt-4 text-xs text-muted-foreground space-y-1">
        <p className="break-words">Enhanced AI Assistant with access to your pantry and dietary preferences</p>
        <p className="break-words">Try asking: "What can I cook with what I have?" or "Suggest a recipe for dinner"</p>
        {recentRecipesCount > 0 && (
          <p className="break-words text-green-600 dark:text-green-400">
            💡 {recentRecipesCount} recent recipe{recentRecipesCount > 1 ? 's' : ''} available in history
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
