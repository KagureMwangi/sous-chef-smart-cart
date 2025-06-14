
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type UserRecipe = Tables<'user_recipes'>;

export const useRecipes = (userId?: string) => {
  const [recipes, setRecipes] = useState<UserRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRecipes = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_recipes')
        .select('*')
        .eq('user_id', userId)
        .order('last_searched_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes:', error);
        toast({
          title: "Error",
          description: "Failed to load recipes. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast({
        title: "Error",
        description: "Failed to load recipes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (recipeId: string, isFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('user_recipes')
        .update({ is_favorite: isFavorite, updated_at: new Date().toISOString() })
        .eq('id', recipeId);

      if (error) {
        console.error('Error updating favorite:', error);
        toast({
          title: "Error",
          description: "Failed to update favorite status.",
          variant: "destructive",
        });
        return;
      }

      setRecipes(prev => 
        prev.map(recipe => 
          recipe.id === recipeId 
            ? { ...recipe, is_favorite: isFavorite }
            : recipe
        )
      );

      toast({
        title: isFavorite ? "Added to Favorites" : "Removed from Favorites",
        description: isFavorite ? "Recipe saved to your favorites!" : "Recipe removed from favorites.",
      });
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive",
      });
    }
  };

  const resetRecipes = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('user_recipes')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Error resetting recipes:', error);
        toast({
          title: "Error",
          description: "Failed to reset recipes. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setRecipes([]);
      toast({
        title: "Recipes Reset",
        description: "All your recipes have been cleared for a fresh start!",
      });
    } catch (error) {
      console.error('Error resetting recipes:', error);
      toast({
        title: "Error",
        description: "Failed to reset recipes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addRecipe = async (recipe: Omit<UserRecipe, 'id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_recipes')
        .insert({
          ...recipe,
          user_id: userId,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding recipe:', error);
        toast({
          title: "Error",
          description: "Failed to save recipe. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setRecipes(prev => [data, ...prev]);
      toast({
        title: "Recipe Saved",
        description: "Recipe has been added to your collection!",
      });
    } catch (error) {
      console.error('Error adding recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [userId]);

  return {
    recipes,
    loading,
    fetchRecipes,
    toggleFavorite,
    resetRecipes,
    addRecipe,
  };
};
