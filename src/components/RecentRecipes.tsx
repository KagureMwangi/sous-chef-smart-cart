
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Clock, Eye } from 'lucide-react';
import { ConversationMessage } from '@/hooks/useConversationHistory';

interface RecentRecipesProps {
  recipes: ConversationMessage[];
}

const RecentRecipes = ({ recipes }: RecentRecipesProps) => {
  const [selectedRecipe, setSelectedRecipe] = useState<ConversationMessage | null>(null);

  if (recipes.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        <ChefHat className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No recent recipes available</p>
      </div>
    );
  }

  const getRecipeTitle = (message: string) => {
    // Try to extract recipe title from the message
    const lines = message.split('\n');
    for (const line of lines) {
      if (line.includes('Recipe') && line.length < 100) {
        return line.replace(/\*\*/g, '').trim();
      }
    }
    // Fallback to first line or truncated message
    return lines[0].length > 50 ? `${lines[0].substring(0, 50)}...` : lines[0];
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <ChefHat className="h-5 w-5 text-neon-green" />
        <h3 className="text-lg font-semibold gradient-text">Recent Recipes</h3>
      </div>

      <div className="grid gap-3">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="glass-effect neon-border p-3 rounded-lg hover:neon-glow transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-sm text-high-contrast line-clamp-2">
                {getRecipeTitle(recipe.message)}
              </h4>
              <Badge variant="secondary" className="ml-2 flex-shrink-0">
                <Clock className="h-3 w-3 mr-1" />
                {formatTimestamp(recipe.timestamp)}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground line-clamp-1">
                {recipe.message.substring(0, 80)}...
              </p>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="ml-2 flex-shrink-0"
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <ChefHat className="h-5 w-5" />
                      <span>Recipe from {formatTimestamp(recipe.timestamp)}</span>
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="mt-4 max-h-[60vh]">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed p-4">
                      {recipe.message}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentRecipes;
