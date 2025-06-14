
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Heart, Star } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type UserRecipe = Tables<'user_recipes'>;

interface RecipeCardProps {
  recipe: UserRecipe;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onView: (recipe: UserRecipe) => void;
}

const RecipeCard = ({ recipe, onToggleFavorite, onView }: RecipeCardProps) => {
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{recipe.recipe_name}</CardTitle>
            <CardDescription className="text-sm">
              {recipe.recipe_description}
            </CardDescription>
          </div>
          <div className="flex gap-2 ml-2">
            {recipe.source === 'recommended' && (
              <Badge variant="secondary" className="text-xs">
                <Star className="w-3 h-3 mr-1" />
                Popular
              </Badge>
            )}
            {recipe.is_favorite && (
              <Badge variant="outline" className="text-xs text-red-500">
                <Heart className="w-3 h-3 mr-1 fill-current" />
                Favorite
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex gap-4 text-sm text-muted-foreground">
            {recipe.prep_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Prep: {recipe.prep_time}m
              </div>
            )}
            {recipe.cook_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Cook: {recipe.cook_time}m
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {recipe.servings} servings
              </div>
            )}
          </div>
          
          {ingredients.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-1">Ingredients:</p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {ingredients.slice(0, 3).join(', ')}
                {ingredients.length > 3 && ` +${ingredients.length - 3} more`}
              </p>
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onView(recipe)}
              className="flex-1"
            >
              View Recipe
            </Button>
            <Button
              variant={recipe.is_favorite ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleFavorite(recipe.id, !recipe.is_favorite)}
            >
              <Heart className={`w-4 h-4 ${recipe.is_favorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
