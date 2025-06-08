
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { ShoppingCart, ChefHat, Package, User as UserIcon, LogOut, Send, Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import ProfileSetup from './ProfileSetup';
import RecipeManager from './RecipeManager';
import PantryManager from './PantryManager';
import ShoppingAssistant from './ShoppingAssistant';
import ApiRequestForm from './ApiRequestForm';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface DashboardProps {
  user: User;
}

const Dashboard = ({ user }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const TabNavigation = () => (
    <TabsList className="grid w-full grid-cols-5 mb-8 glass-effect">
      <TabsTrigger value="profile" className="flex items-center space-x-2 hover:text-neon-blue transition-colors text-high-contrast text-xs sm:text-sm">
        <UserIcon className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Profile</span>
        <span className="sm:hidden">Pro</span>
      </TabsTrigger>
      <TabsTrigger value="pantry" className="flex items-center space-x-2 hover:text-neon-green transition-colors text-high-contrast text-xs sm:text-sm">
        <Package className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Pantry</span>
        <span className="sm:hidden">Pan</span>
      </TabsTrigger>
      <TabsTrigger value="recipes" className="flex items-center space-x-2 hover:text-neon-cyan transition-colors text-high-contrast text-xs sm:text-sm">
        <ChefHat className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Recipes</span>
        <span className="sm:hidden">Rec</span>
      </TabsTrigger>
      <TabsTrigger value="shopping" className="flex items-center space-x-2 hover:text-neon-blue transition-colors text-high-contrast text-xs sm:text-sm">
        <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Shopping</span>
        <span className="sm:hidden">Shop</span>
      </TabsTrigger>
      <TabsTrigger value="assistant" className="flex items-center space-x-2 hover:text-neon-cyan transition-colors text-high-contrast text-xs sm:text-sm">
        <Send className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Assistant</span>
        <span className="sm:hidden">Asst</span>
      </TabsTrigger>
    </TabsList>
  );

  return (
    <div className="min-h-screen gradient-bg">
      <header className="glass-effect border-b backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              {/* Mobile menu toggle */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <ChefHat className="h-8 w-8 text-neon-green drop-shadow-lg" />
                      <h1 className="text-xl font-bold gradient-text">Sous-Chef</h1>
                    </div>
                    <nav className="space-y-2">
                      <Button
                        variant={activeTab === 'profile' ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => {
                          setActiveTab('profile');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <UserIcon className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                      <Button
                        variant={activeTab === 'pantry' ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => {
                          setActiveTab('pantry');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Pantry
                      </Button>
                      <Button
                        variant={activeTab === 'recipes' ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => {
                          setActiveTab('recipes');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <ChefHat className="h-4 w-4 mr-2" />
                        Recipes
                      </Button>
                      <Button
                        variant={activeTab === 'shopping' ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => {
                          setActiveTab('shopping');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Shopping
                      </Button>
                      <Button
                        variant={activeTab === 'assistant' ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => {
                          setActiveTab('assistant');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Assistant
                      </Button>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
              <ChefHat className="h-6 w-6 sm:h-8 sm:w-8 text-neon-green drop-shadow-lg" />
              <h1 className="text-lg sm:text-2xl font-bold gradient-text">Sous-Chef</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-high-contrast hidden sm:inline">Welcome, {user.email}</span>
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={handleSignOut} className="neon-border hover:neon-glow transition-all duration-300 text-high-contrast text-xs sm:text-sm px-2 sm:px-4">
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop navigation */}
          <div className="hidden md:block">
            <TabNavigation />
          </div>

          <TabsContent value="profile">
            <Card className="glass-effect neon-border hover:neon-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="gradient-text text-lg sm:text-xl">Profile Setup</CardTitle>
                <CardDescription className="text-high-contrast text-sm sm:text-base">
                  Configure your household information and dietary preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileSetup user={user} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pantry">
            <Card className="glass-effect neon-border hover:neon-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="gradient-text text-lg sm:text-xl">Pantry Management</CardTitle>
                <CardDescription className="text-high-contrast text-sm sm:text-base">
                  Track what you have at home
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PantryManager user={user} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recipes">
            <Card className="glass-effect neon-border hover:neon-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="gradient-text text-lg sm:text-xl">Recipe Manager</CardTitle>
                <CardDescription className="text-high-contrast text-sm sm:text-base">
                  Add recipes and get ingredient lists with cost estimates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecipeManager user={user} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shopping">
            <Card className="glass-effect neon-border hover:neon-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="gradient-text text-lg sm:text-xl">Shopping Assistant</CardTitle>
                <CardDescription className="text-high-contrast text-sm sm:text-base">
                  Get personalized shopping recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ShoppingAssistant user={user} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assistant">
            <Card className="glass-effect neon-border hover:neon-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="gradient-text text-lg sm:text-xl">AI Assistant</CardTitle>
                <CardDescription className="text-high-contrast text-sm sm:text-base">
                  Chat with your culinary assistant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApiRequestForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
