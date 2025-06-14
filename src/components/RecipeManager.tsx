import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { User } from '@supabase/supabase-js';
import { useRecipes } from '@/hooks/useRecipes';
import { useIsMobile } from '@/hooks/use-mobile';
import RecipeModal from './RecipeModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RefreshCw, Heart, Clock, Star, Eye } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type UserRecipe = Tables<'user_recipes'>;

interface RecipeManagerProps {
  user: User;
}

const RecipeManager = ({ user }: RecipeManagerProps) => {
  const { recipes, loading, toggleFavorite, resetRecipes } = useRecipes(user.id);
  const [selectedRecipe, setSelectedRecipe] = useState<UserRecipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState('recent');
  const isMobile = useIsMobile();

  const handleViewRecipe = (recipe: UserRecipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const favoriteRecipes = recipes.filter(recipe => recipe.is_favorite);
  const recentRecipes = recipes.filter(recipe => recipe.source !== 'recommended').slice(0, 10);
  const recommendedRecipes = recipes.filter(recipe => recipe.source === 'recommended');

  const getCurrentRecipes = () => {
    switch (activeView) {
      case 'favorites':
        return favoriteRecipes;
      case 'recommended':
        return recommendedRecipes;
      default:
        return recentRecipes;
    }
  };

  const getEmptyState = () => {
    switch (activeView) {
      case 'favorites':
        return {
          icon: <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />,
          title: "No favorite recipes yet",
          description: "Click the heart icon on recipes to save them here"
        };
      case 'recommended':
        return {
          icon: <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />,
          title: "No recommendations available",
          description: "Check back later for popular recipe suggestions"
        };
      default:
        return {
          icon: <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />,
          title: "No recent recipes",
          description: "Your recipe searches will appear here"
        };
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Recipe Manager</CardTitle>
            <CardDescription>Loading your recipes...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentRecipes = getCurrentRecipes();
  const emptyState = getEmptyState();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Recipe Manager</CardTitle>
              <CardDescription>
                Manage your recipe collection, search history, and discover new favorites
              </CardDescription>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {!isMobile && "Reset Collection"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Recipe Collection</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your saved recipes and search history. 
                    This action cannot be undone. Are you sure you want to start fresh?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={resetRecipes}>
                    Yes, Reset Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Toggle Navigation */}
            <ToggleGroup type="single" value={activeView} onValueChange={setActiveView} className="justify-start">
              <ToggleGroupItem value="recent" aria-label="Recent recipes" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {!isMobile && `Recent (${recentRecipes.length})`}
              </ToggleGroupItem>
              <ToggleGroupItem value="favorites" aria-label="Favorite recipes" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                {!isMobile && `Favorites (${favoriteRecipes.length})`}
              </ToggleGroupItem>
              <ToggleGroupItem value="recommended" aria-label="Popular recipes" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                {!isMobile && `Popular (${recommendedRecipes.length})`}
              </ToggleGroupItem>
            </ToggleGroup>

            {/* Recipe List */}
            {currentRecipes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {emptyState.icon}
                <p className="text-lg mb-2">{emptyState.title}</p>
                <p className="text-sm">{emptyState.description}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentRecipes.map((recipe) => {
                  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
                  
                  return (
                    <div key={recipe.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{recipe.recipe_name}</h3>
                            <div className="flex gap-1">
                              {recipe.source === 'recommended' && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">
                                  <Star className="w-3 h-3 mr-1" />
                                  Popular
                                </span>
                              )}
                              {recipe.is_favorite && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200">
                                  <Heart className="w-3 h-3 mr-1 fill-current" />
                                  Favorite
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {recipe.recipe_description && (
                            <p className="text-sm text-muted-foreground mb-2">{recipe.recipe_description}</p>
                          )}
                          
                          <div className="flex gap-4 text-sm text-muted-foreground mb-2">
                            {recipe.prep_time && (
                              <span>Prep: {recipe.prep_time}m</span>
                            )}
                            {recipe.cook_time && (
                              <span>Cook: {recipe.cook_time}m</span>
                            )}
                            {recipe.servings && (
                              <span>{recipe.servings} servings</span>
                            )}
                          </div>
                          
                          {ingredients.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Ingredients: </span>
                              {ingredients.slice(0, 3).join(', ')}
                              {ingredients.length > 3 && ` +${ingredients.length - 3} more`}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewRecipe(recipe)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant={recipe.is_favorite ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleFavorite(recipe.id, !recipe.is_favorite)}
                          >
                            <Heart className={`w-4 h-4 ${recipe.is_favorite ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <RecipeModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default RecipeManager;
