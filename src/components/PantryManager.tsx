import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { Tables } from '@/integrations/supabase/types';
import { Plus, Trash2, Package, Search } from 'lucide-react';

interface PantryManagerProps {
  user: User;
}

type PantryItem = Tables<'pantry_items'> & {
  ingredients?: Tables<'ingredients'>;
};
type Ingredient = Tables<'ingredients'>;

const PantryManager = ({ user }: PantryManagerProps) => {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const units = ['grams', 'kg', 'ml', 'liters', 'cups', 'tbsp', 'tsp', 'pieces', 'cans', 'bottles'];

  useEffect(() => {
    fetchPantryItems();
    fetchIngredients();
  }, [user]);

  const fetchPantryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('pantry_items')
        .select(`
          *,
          ingredients (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPantryItems(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load pantry items",
        variant: "destructive",
      });
    }
  };

  const fetchIngredients = async () => {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name');

      if (error) throw error;
      setIngredients(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load ingredients",
        variant: "destructive",
      });
    }
  };

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = async () => {
    if (!selectedIngredient || !quantity || !unit) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('pantry_items')
        .upsert({
          user_id: user.id,
          ingredient_id: selectedIngredient,
          quantity: parseFloat(quantity),
          unit: unit as any,
          expiry_date: expiryDate || null,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Reset form
      setSelectedIngredient('');
      setQuantity('');
      setUnit('');
      setExpiryDate('');
      setSearchTerm('');

      await fetchPantryItems();

      toast({
        title: "Success",
        description: "Item added to pantry",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('pantry_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      await fetchPantryItems();

      toast({
        title: "Success",
        description: "Item removed from pantry",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Pantry Item</CardTitle>
          <CardDescription>
            Track what you have at home to get better shopping recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ingredient-search">Search Ingredient</Label>
              <Input
                id="ingredient-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ingredients..."
                className="mb-2"
              />
              <Select value={selectedIngredient} onValueChange={setSelectedIngredient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ingredient" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {filteredIngredients.map((ingredient) => (
                    <SelectItem key={ingredient.id} value={ingredient.id}>
                      {ingredient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unitOption) => (
                    <SelectItem key={unitOption} value={unitOption}>
                      {unitOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date (Optional)</Label>
              <Input
                id="expiry"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleAddItem} disabled={loading} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            {loading ? 'Adding...' : 'Add to Pantry'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Pantry</CardTitle>
          <CardDescription>
            Items you currently have at home
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pantryItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Your pantry is empty. Add some items to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pantryItems.map((item) => (
                <Card key={item.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{item.ingredients?.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">
                      {item.quantity} {item.unit}
                    </p>
                    {item.expiry_date && (
                      <p className="text-xs text-gray-500 mt-1">
                        Expires: {new Date(item.expiry_date).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PantryManager;