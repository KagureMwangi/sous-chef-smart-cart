
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, ShoppingCart, Package, Users, Star, CheckCircle } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import Auth from './Auth';

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="glass-effect border-b backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-neon-green drop-shadow-lg" />
              <h1 className="text-2xl font-bold gradient-text">Sous-Chef</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button onClick={() => setShowAuth(true)} className="gradient-bg text-green-contrast hover:opacity-90 transition-all duration-300">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-high-contrast mb-6">
            Your Personal <span className="gradient-text">Shopping Assistant</span>
          </h1>
          <p className="text-xl text-high-contrast mb-8 max-w-3xl mx-auto">
            Streamline your grocery shopping with intelligent recommendations, pantry management, 
            and recipe-based shopping lists tailored to your household needs.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-3 gradient-bg text-green-contrast hover:opacity-90 neon-glow transition-all duration-300"
            onClick={() => setShowAuth(true)}
          >
            Start Shopping Smarter
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold gradient-text mb-4">
            Everything You Need for Smart Shopping
          </h2>
          <p className="text-lg text-high-contrast">
            Powerful features designed to save you time and money
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center glass-effect neon-border hover:neon-glow transition-all duration-300">
            <CardHeader>
              <Users className="h-12 w-12 text-neon-green mx-auto mb-4 drop-shadow-lg" />
              <CardTitle className="gradient-text">Household Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-high-contrast">
                Set up your household size, dietary restrictions, and preferences for personalized recommendations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center glass-effect neon-border hover:neon-glow transition-all duration-300">
            <CardHeader>
              <Package className="h-12 w-12 text-neon-blue mx-auto mb-4 drop-shadow-lg" />
              <CardTitle className="gradient-text">Smart Pantry</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-high-contrast">
                Track what you have at home and get suggestions on what to buy based on your inventory.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center glass-effect neon-border hover:neon-glow transition-all duration-300">
            <CardHeader>
              <ChefHat className="h-12 w-12 text-neon-cyan mx-auto mb-4 drop-shadow-lg" />
              <CardTitle className="gradient-text">Recipe Manager</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-high-contrast">
                Add your favorite recipes and automatically generate shopping lists with cost estimates.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center glass-effect neon-border hover:neon-glow transition-all duration-300">
            <CardHeader>
              <ShoppingCart className="h-12 w-12 text-neon-green mx-auto mb-4 drop-shadow-lg" />
              <CardTitle className="gradient-text">Shopping Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-high-contrast">
                Get personalized shopping recommendations and optimize your grocery trips.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold gradient-text mb-6">
                Why Choose Sous-Chef?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-neon-green mt-1" />
                  <div>
                    <h3 className="font-semibold text-high-contrast">Save Time & Money</h3>
                    <p className="text-high-contrast">Reduce food waste and avoid unnecessary purchases with smart inventory tracking.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-neon-green mt-1" />
                  <div>
                    <h3 className="font-semibold text-high-contrast">Personalized Experience</h3>
                    <p className="text-high-contrast">Tailored recommendations based on your household size, dietary needs, and preferences.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-neon-green mt-1" />
                  <div>
                    <h3 className="font-semibold text-high-contrast">Easy Organization</h3>
                    <p className="text-high-contrast">Keep your recipes, pantry, and shopping lists organized in one convenient place.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-neon-green mt-1" />
                  <div>
                    <h3 className="font-semibold text-high-contrast">Cost Estimates</h3>
                    <p className="text-high-contrast">Get estimated costs for your shopping lists to better manage your budget.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-effect neon-border rounded-lg p-8 hover:neon-glow transition-all duration-300">
              <div className="text-center">
                <Star className="h-16 w-16 text-neon-cyan mx-auto mb-4 drop-shadow-lg" />
                <h3 className="text-2xl font-bold gradient-text mb-4">Ready to Get Started?</h3>
                <p className="text-high-contrast mb-6">
                  Join thousands of users who are already shopping smarter with Sous-Chef.
                </p>
                <Button 
                  size="lg" 
                  onClick={() => setShowAuth(true)}
                  className="w-full gradient-bg text-green-contrast hover:opacity-90 transition-all duration-300"
                >
                  Create Your Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-effect border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <ChefHat className="h-6 w-6 text-neon-green" />
              <span className="text-lg font-semibold gradient-text">Sous-Chef</span>
            </div>
            <p className="text-high-contrast">
              Your personal shopping assistant for smarter grocery shopping.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
