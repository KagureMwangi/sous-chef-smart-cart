
-- Create a table for user recipe searches and saved recipes
CREATE TABLE public.user_recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recipe_name TEXT NOT NULL,
  recipe_description TEXT,
  ingredients JSONB,
  instructions TEXT,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  source TEXT, -- 'searched' or 'saved' or 'recommended'
  is_favorite BOOLEAN DEFAULT false,
  search_count INTEGER DEFAULT 1,
  last_searched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own recipes
ALTER TABLE public.user_recipes ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own recipes
CREATE POLICY "Users can view their own recipes" 
  ON public.user_recipes 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own recipes
CREATE POLICY "Users can create their own recipes" 
  ON public.user_recipes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own recipes
CREATE POLICY "Users can update their own recipes" 
  ON public.user_recipes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own recipes
CREATE POLICY "Users can delete their own recipes" 
  ON public.user_recipes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_user_recipes_user_id ON public.user_recipes(user_id);
CREATE INDEX idx_user_recipes_source ON public.user_recipes(source);
CREATE INDEX idx_user_recipes_last_searched ON public.user_recipes(last_searched_at DESC);

-- Insert some popular recipe recommendations
INSERT INTO public.user_recipes (user_id, recipe_name, recipe_description, source, ingredients, instructions, prep_time, cook_time, servings) VALUES
('00000000-0000-0000-0000-000000000000', 'Spaghetti Carbonara', 'Classic Italian pasta dish with eggs, cheese, and pancetta', 'recommended', 
 '["400g spaghetti", "200g pancetta", "4 large eggs", "100g Parmesan cheese", "Black pepper", "Salt"]',
 'Cook spaghetti al dente. Fry pancetta until crispy. Mix eggs with grated Parmesan. Combine hot pasta with pancetta, then add egg mixture off heat, stirring quickly.', 
 15, 15, 4),
('00000000-0000-0000-0000-000000000000', 'Chicken Stir Fry', 'Quick and healthy chicken stir fry with vegetables', 'recommended',
 '["500g chicken breast", "2 bell peppers", "1 onion", "2 cloves garlic", "Soy sauce", "Sesame oil", "Ginger"]',
 'Cut chicken into strips. Heat oil in wok. Cook chicken until done. Add vegetables and stir fry. Season with soy sauce and serve with rice.',
 10, 15, 4),
('00000000-0000-0000-0000-000000000000', 'Beef Tacos', 'Flavorful ground beef tacos with fresh toppings', 'recommended',
 '["500g ground beef", "Taco seasoning", "Taco shells", "Lettuce", "Tomatoes", "Cheese", "Sour cream"]',
 'Brown ground beef. Add taco seasoning and water. Simmer until thick. Warm taco shells. Fill with beef and desired toppings.',
 10, 20, 6);
