
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tables } from '@/integrations/supabase/types';

type UserRecipe = Tables<'user_recipes'>;

interface RecipeModalProps {
  recipe: UserRecipe | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
}

const RecipeModal = ({ recipe, isOpen, onClose, onToggleFavorite }: RecipeModalProps) => {
  if (!recipe) return null;
  
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{recipe.recipe_name}</DialogTitle>
              <DialogDescription className="text-base">
                {recipe.recipe_description}
              </DialogDescription>
            </div>
            <div className="flex gap-2 ml-4">
              {recipe.source === 'recommended' && (
                <Badge variant="secondary">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
              <Button
                variant={recipe.is_favorite ? "default" : "outline"}
                size="sm"
                onClick={() => onToggleFavorite(recipe.id, !recipe.is_favorite)}
              >
                <Heart className={`w-4 h-4 mr-1 ${recipe.is_favorite ? 'fill-current' : ''}`} />
                {recipe.is_favorite ? 'Favorited' : 'Add to Favorites'}
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="flex gap-6 text-sm">
            {recipe.prep_time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Prep: {recipe.prep_time} minutes</span>
              </div>
            )}
            {recipe.cook_time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Cook: {recipe.cook_time} minutes</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{recipe.servings} servings</span>
              </div>
            )}
          </div>
          
          {ingredients.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
              <ul className="space-y-1">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {recipe.instructions && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Instructions</h3>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {recipe.instructions}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeModal;
