
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { ShoppingCart, ChefHat, Package, User as UserIcon, LogOut, MessageSquare, Send } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import ProfileSetup from './ProfileSetup';
import RecipeManager from './RecipeManager';
import PantryManager from './PantryManager';
import ShoppingAssistant from './ShoppingAssistant';
import CopilotChat from './CopilotChat';
import ApiRequestForm from './ApiRequestForm';

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
    <div className="min-h-screen gradient-bg">
      <header className="glass-effect border-b backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-neon-green drop-shadow-lg" />
              <h1 className="text-2xl font-bold gradient-text">Sous-Chef</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-high-contrast">Welcome, {user.email}</span>
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={handleSignOut} className="neon-border hover:neon-glow transition-all duration-300 text-high-contrast">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 glass-effect">
            <TabsTrigger value="profile" className="flex items-center space-x-2 hover:text-neon-blue transition-colors text-high-contrast">
              <UserIcon className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="pantry" className="flex items-center space-x-2 hover:text-neon-green transition-colors text-high-contrast">
              <Package className="h-4 w-4" />
              <span>Pantry</span>
            </TabsTrigger>
            <TabsTrigger value="recipes" className="flex items-center space-x-2 hover:text-neon-cyan transition-colors text-high-contrast">
              <ChefHat className="h-4 w-4" />
              <span>Recipes</span>
            </TabsTrigger>
            <TabsTrigger value="shopping" className="flex items-center space-x-2 hover:text-neon-blue transition-colors text-high-contrast">
              <ShoppingCart className="h-4 w-4" />
              <span>Shopping</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2 hover:text-neon-green transition-colors text-high-contrast">
              <MessageSquare className="h-4 w-4" />
              <span>Assistant</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center space-x-2 hover:text-neon-cyan transition-colors text-high-contrast">
              <Send className="h-4 w-4" />
              <span>API Test</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="glass-effect neon-border hover:neon-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="gradient-text">Profile Setup</CardTitle>
                <CardDescription className="text-high-contrast">
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
                <CardTitle className="gradient-text">Pantry Management</CardTitle>
                <CardDescription className="text-high-contrast">
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
                <CardTitle className="gradient-text">Recipe Manager</CardTitle>
                <CardDescription className="text-high-contrast">
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
                <CardTitle className="gradient-text">Shopping Assistant</CardTitle>
                <CardDescription className="text-high-contrast">
                  Get personalized shopping recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ShoppingAssistant user={user} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <Card className="glass-effect neon-border hover:neon-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="gradient-text">AI Assistant</CardTitle>
                <CardDescription className="text-high-contrast">
                  Chat with your culinary copilot assistant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CopilotChat />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card className="glass-effect neon-border hover:neon-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="gradient-text">API Request Test</CardTitle>
                <CardDescription className="text-high-contrast">
                  Send test requests to external APIs
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
