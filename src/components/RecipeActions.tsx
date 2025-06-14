
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Share2, BookmarkPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ConversationMessage } from '@/hooks/useConversationHistory';

interface RecipeActionsProps {
  recipe: ConversationMessage;
  onSaveRecipe: (recipe: ConversationMessage) => void;
}

const RecipeActions = ({ recipe, onSaveRecipe }: RecipeActionsProps) => {
  const { toast } = useToast();

  const handleCopyRecipe = () => {
    navigator.clipboard.writeText(recipe.message).then(() => {
      toast({
        title: "Recipe Copied!",
        description: "Recipe has been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Failed to copy recipe to clipboard.",
        variant: "destructive",
      });
    });
  };

  const handleShareRecipe = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Recipe from AI Assistant',
        text: recipe.message,
      }).catch(() => {
        // Fallback to clipboard if share fails
        handleCopyRecipe();
      });
    } else {
      // Fallback to clipboard if Web Share API is not supported
      handleCopyRecipe();
    }
  };

  const handleSaveRecipe = () => {
    onSaveRecipe(recipe);
  };

  return (
    <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyRecipe}
        className="flex items-center space-x-1"
      >
        <Copy className="h-3 w-3" />
        <span>Copy</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleShareRecipe}
        className="flex items-center space-x-1"
      >
        <Share2 className="h-3 w-3" />
        <span>Share</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleSaveRecipe}
        className="flex items-center space-x-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
      >
        <BookmarkPlus className="h-3 w-3" />
        <span>Save</span>
      </Button>
    </div>
  );
};

export default RecipeActions;
