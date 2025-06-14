
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { User } from '@supabase/supabase-js';
import { useShoppingLists } from '@/hooks/useShoppingLists';
import { Plus, ShoppingCart, Trash2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShoppingAssistantProps {
  user: User;
}

const ShoppingAssistant = ({ user }: ShoppingAssistantProps) => {
  const {
    shoppingLists,
    activeList,
    listItems,
    loading,
    setActiveList,
    createShoppingList,
    addItemToList,
    toggleItemPurchased,
    deleteItem,
  } = useShoppingLists(user.id);

  const [newListName, setNewListName] = useState('');
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [newItemUnit, setNewItemUnit] = useState('pieces');
  const { toast } = useToast();

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a list name",
        variant: "destructive",
      });
      return;
    }

    await createShoppingList(newListName);
    setNewListName('');
    setShowNewListForm(false);
  };

  const handleAddItem = async () => {
    if (!newItemName.trim()) {
      toast({
        title: "Error",
        description: "Please enter an item name",
        variant: "destructive",
      });
      return;
    }

    if (!activeList) {
      toast({
        title: "Error",
        description: "Please select or create a shopping list first",
        variant: "destructive",
      });
      return;
    }

    await addItemToList({
      custom_item_name: newItemName,
      quantity: parseFloat(newItemQuantity) || 1,
      unit: newItemUnit as any,
    });

    setNewItemName('');
    setNewItemQuantity('1');
  };

  const getItemDisplayName = (item: any) => {
    return item.ingredient?.name || item.custom_item_name || 'Unknown item';
  };

  const completedItems = listItems.filter(item => item.is_purchased);
  const pendingItems = listItems.filter(item => !item.is_purchased);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-high-contrast">Loading shopping lists...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Shopping Lists Header */}
      <Card className="glass-effect neon-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="gradient-text flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Shopping Lists
              </CardTitle>
              <CardDescription className="text-high-contrast">
                Manage your shopping lists and track your purchases
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowNewListForm(!showNewListForm)}
              size="sm"
              className="gradient-bg text-green-contrast hover:opacity-90 text-xs px-3 py-1"
            >
              <Plus className="h-3 w-3 mr-1" />
              New List
            </Button>
          </div>
        </CardHeader>
        
        {showNewListForm && (
          <CardContent className="border-t">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  placeholder="List name (e.g., Weekly Groceries)"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
                  className="glass-effect neon-border"
                />
              </div>
              <Button onClick={handleCreateList} className="gradient-bg text-green-contrast">
                Create
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNewListForm(false)}
                className="neon-border"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* List Selection */}
      {shoppingLists.length > 0 && (
        <Card className="glass-effect neon-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-high-contrast">Active List:</label>
              <Select
                value={activeList?.id || ''}
                onValueChange={(value) => {
                  const list = shoppingLists.find(l => l.id === value);
                  if (list) setActiveList(list);
                }}
              >
                <SelectTrigger className="w-64 glass-effect neon-border">
                  <SelectValue placeholder="Select a shopping list" />
                </SelectTrigger>
                <SelectContent>
                  {shoppingLists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {activeList && (
                <Badge variant="secondary" className="ml-auto">
                  {listItems.length} items
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeList ? (
        <>
          {/* Add Item Form */}
          <Card className="glass-effect neon-border">
            <CardHeader>
              <CardTitle className="text-lg gradient-text">Add Item to {activeList.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    placeholder="Item name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                    className="glass-effect neon-border"
                  />
                </div>
                <div className="w-20">
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                    className="glass-effect neon-border"
                    min="0.1"
                    step="0.1"
                  />
                </div>
                <div className="w-24">
                  <Select value={newItemUnit} onValueChange={setNewItemUnit}>
                    <SelectTrigger className="glass-effect neon-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pieces">pcs</SelectItem>
                      <SelectItem value="grams">g</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="liters">L</SelectItem>
                      <SelectItem value="cups">cups</SelectItem>
                      <SelectItem value="cans">cans</SelectItem>
                      <SelectItem value="bottles">bottles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddItem} className="gradient-bg text-green-contrast">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Shopping List Items */}
          <Card className="glass-effect neon-border">
            <CardHeader>
              <CardTitle className="text-lg gradient-text">Items</CardTitle>
            </CardHeader>
            <CardContent>
              {listItems.length === 0 ? (
                <p className="text-center text-high-contrast py-8">
                  No items in this list yet. Add some items above!
                </p>
              ) : (
                <div className="space-y-4">
                  {/* Pending Items */}
                  {pendingItems.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-high-contrast mb-3 flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        To Buy ({pendingItems.length})
                      </h4>
                      <div className="space-y-2">
                        {pendingItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 glass-effect rounded-lg">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={false}
                                onCheckedChange={() => toggleItemPurchased(item.id, true)}
                              />
                              <div>
                                <span className="text-high-contrast font-medium">
                                  {getItemDisplayName(item)}
                                </span>
                                <span className="text-sm text-high-contrast/70 ml-2">
                                  {item.quantity} {item.unit}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteItem(item.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Completed Items */}
                  {completedItems.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-high-contrast mb-3 flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Purchased ({completedItems.length})
                      </h4>
                      <div className="space-y-2">
                        {completedItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 glass-effect rounded-lg opacity-60">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={true}
                                onCheckedChange={() => toggleItemPurchased(item.id, false)}
                              />
                              <div>
                                <span className="text-high-contrast font-medium line-through">
                                  {getItemDisplayName(item)}
                                </span>
                                <span className="text-sm text-high-contrast/70 ml-2 line-through">
                                  {item.quantity} {item.unit}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteItem(item.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="glass-effect neon-border">
          <CardContent className="p-8 text-center">
            <ShoppingCart className="h-16 w-16 text-neon-green mx-auto mb-4 drop-shadow-lg" />
            <h3 className="text-xl font-semibold gradient-text mb-2">No Shopping Lists Yet</h3>
            <p className="text-high-contrast mb-4">
              Create your first shopping list to start organizing your grocery trips!
            </p>
            <Button
              onClick={() => setShowNewListForm(true)}
              className="gradient-bg text-green-contrast hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First List
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShoppingAssistant;
