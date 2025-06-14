
-- Create shopping lists table
CREATE TABLE public.shopping_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'My Shopping List',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_completed BOOLEAN DEFAULT false
);

-- Create shopping list items table
CREATE TABLE public.shopping_list_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shopping_list_id UUID NOT NULL REFERENCES public.shopping_lists(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES public.ingredients(id),
  custom_item_name TEXT,
  quantity NUMERIC NOT NULL,
  unit unit_type NOT NULL,
  is_purchased BOOLEAN DEFAULT false,
  notes TEXT,
  estimated_price NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT shopping_list_items_item_check CHECK (
    (ingredient_id IS NOT NULL AND custom_item_name IS NULL) OR
    (ingredient_id IS NULL AND custom_item_name IS NOT NULL)
  )
);

-- Add Row Level Security (RLS) for shopping_lists
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own shopping lists" 
  ON public.shopping_lists 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own shopping lists" 
  ON public.shopping_lists 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shopping lists" 
  ON public.shopping_lists 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shopping lists" 
  ON public.shopping_lists 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add Row Level Security (RLS) for shopping_list_items
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own shopping list items" 
  ON public.shopping_list_items 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.shopping_lists 
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own shopping list items" 
  ON public.shopping_list_items 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shopping_lists 
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own shopping list items" 
  ON public.shopping_list_items 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.shopping_lists 
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own shopping list items" 
  ON public.shopping_list_items 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.shopping_lists 
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );
