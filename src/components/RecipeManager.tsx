
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@supabase/supabase-js';
import { useRecipes } from '@/hooks/useRecipes';
import RecipeCard from './RecipeCard';
import RecipeModal from './RecipeModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RefreshCw, Heart, Clock, Star } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type UserRecipe = Tables<'user_recipes'>;

interface RecipeManagerProps {
  user: User;
}

const RecipeManager = ({ user }: RecipeManagerProps) => {
  const { recipes, loading, toggleFavorite, resetRecipes } = useRecipes(user.id);
  const [selectedRecipe, setSelectedRecipe] = useState<UserRecipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
                  Reset Collection
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
          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recent" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent ({recentRecipes.length})
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Favorites ({favoriteRecipes.length})
              </TabsTrigger>
              <TabsTrigger value="recommended" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Popular ({recommendedRecipes.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="mt-6">
              {recentRecipes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No recent recipes</p>
                  <p className="text-sm">Your recipe searches will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onToggleFavorite={toggleFavorite}
                      onView={handleViewRecipe}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="mt-6">
              {favoriteRecipes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No favorite recipes yet</p>
                  <p className="text-sm">Click the heart icon on recipes to save them here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onToggleFavorite={toggleFavorite}
                      onView={handleViewRecipe}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="recommended" className="mt-6">
              {recommendedRecipes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No recommendations available</p>
                  <p className="text-sm">Check back later for popular recipe suggestions</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onToggleFavorite={toggleFavorite}
                      onView={handleViewRecipe}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
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
