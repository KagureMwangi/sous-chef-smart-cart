
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type ShoppingList = Database['public']['Tables']['shopping_lists']['Row'];
type ShoppingListItem = Database['public']['Tables']['shopping_list_items']['Row'] & {
  ingredient?: Database['public']['Tables']['ingredients']['Row'];
};
type InsertShoppingList = Database['public']['Tables']['shopping_lists']['Insert'];
type InsertShoppingListItem = Database['public']['Tables']['shopping_list_items']['Insert'];

export const useShoppingLists = (userId?: string) => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [activeList, setActiveList] = useState<ShoppingList | null>(null);
  const [listItems, setListItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchShoppingLists = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShoppingLists(data || []);
      
      // Set the first list as active if none is selected
      if (data && data.length > 0 && !activeList) {
        setActiveList(data[0]);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch shopping lists: " + error.message,
        variant: "destructive",
      });
    }
  };

  const fetchListItems = async (listId: string) => {
    try {
      const { data, error } = await supabase
        .from('shopping_list_items')
        .select(`
          *,
          ingredient:ingredients(*)
        `)
        .eq('shopping_list_id', listId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setListItems(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch list items: " + error.message,
        variant: "destructive",
      });
    }
  };

  const createShoppingList = async (name: string) => {
    if (!userId) return null;

    try {
      const listData: InsertShoppingList = {
        user_id: userId,
        name,
      };

      const { data, error } = await supabase
        .from('shopping_lists')
        .insert(listData)
        .select()
        .single();

      if (error) throw error;

      setShoppingLists(prev => [data, ...prev]);
      setActiveList(data);
      
      toast({
        title: "Success",
        description: "Shopping list created successfully!",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create shopping list: " + error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const addItemToList = async (item: Omit<InsertShoppingListItem, 'shopping_list_id'>) => {
    if (!activeList) return null;

    try {
      const itemData: InsertShoppingListItem = {
        ...item,
        shopping_list_id: activeList.id,
      };

      const { data, error } = await supabase
        .from('shopping_list_items')
        .insert(itemData)
        .select(`
          *,
          ingredient:ingredients(*)
        `)
        .single();

      if (error) throw error;

      setListItems(prev => [...prev, data]);
      
      toast({
        title: "Success",
        description: "Item added to shopping list!",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add item: " + error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const toggleItemPurchased = async (itemId: string, isPurchased: boolean) => {
    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .update({ is_purchased: isPurchased })
        .eq('id', itemId);

      if (error) throw error;

      setListItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, is_purchased: isPurchased } : item
      ));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update item: " + error.message,
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setListItems(prev => prev.filter(item => item.id !== itemId));
      
      toast({
        title: "Success",
        description: "Item deleted from shopping list",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete item: " + error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchShoppingLists().finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (activeList) {
      fetchListItems(activeList.id);
    }
  }, [activeList]);

  return {
    shoppingLists,
    activeList,
    listItems,
    loading,
    setActiveList,
    createShoppingList,
    addItemToList,
    toggleItemPurchased,
    deleteItem,
    refreshLists: fetchShoppingLists,
  };
};
