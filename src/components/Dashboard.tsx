
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { ShoppingCart, ChefHat, Package, User as UserIcon, LogOut } from 'lucide-react';
import ProfileSetup from './ProfileSetup';
import RecipeManager from './RecipeManager';
import PantryManager from './PantryManager';
import ShoppingAssistant from './ShoppingAssistant';

interface DashboardProps {
  user: User;
}

const Dashboard = ({ user }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-green-700">Sous-Chef</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <UserIcon className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="pantry" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Pantry</span>
            </TabsTrigger>
            <TabsTrigger value="recipes" className="flex items-center space-x-2">
              <ChefHat className="h-4 w-4" />
              <span>Recipes</span>
            </TabsTrigger>
            <TabsTrigger value="shopping" className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Shopping</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Setup</CardTitle>
                <CardDescription>
                  Configure your household information and dietary preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileSetup user={user} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pantry">
            <Card>
              <CardHeader>
                <CardTitle>Pantry Management</CardTitle>
                <CardDescription>
                  Track what you have at home
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PantryManager user={user} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recipes">
            <Card>
              <CardHeader>
                <CardTitle>Recipe Manager</CardTitle>
                <CardDescription>
                  Add recipes and get ingredient lists with cost estimates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecipeManager user={user} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shopping">
            <Card>
              <CardHeader>
                <CardTitle>Shopping Assistant</CardTitle>
                <CardDescription>
                  Get personalized shopping recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ShoppingAssistant user={user} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
