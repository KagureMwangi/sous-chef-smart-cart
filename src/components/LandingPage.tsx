
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, ShoppingCart, Package, Users, Star, CheckCircle } from 'lucide-react';
import Auth from './Auth';

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-green-700">Sous-Chef</h1>
            </div>
            <Button onClick={() => setShowAuth(true)}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Personal <span className="text-green-600">Shopping Assistant</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your grocery shopping with intelligent recommendations, pantry management, 
            and recipe-based shopping lists tailored to your household needs.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-3"
            onClick={() => setShowAuth(true)}
          >
            Start Shopping Smarter
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need for Smart Shopping
          </h2>
          <p className="text-lg text-gray-600">
            Powerful features designed to save you time and money
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Household Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Set up your household size, dietary restrictions, and preferences for personalized recommendations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Smart Pantry</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track what you have at home and get suggestions on what to buy based on your inventory.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <ChefHat className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Recipe Manager</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Add your favorite recipes and automatically generate shopping lists with cost estimates.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <ShoppingCart className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Shopping Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get personalized shopping recommendations and optimize your grocery trips.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Sous-Chef?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Save Time & Money</h3>
                    <p className="text-gray-600">Reduce food waste and avoid unnecessary purchases with smart inventory tracking.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Personalized Experience</h3>
                    <p className="text-gray-600">Tailored recommendations based on your household size, dietary needs, and preferences.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Easy Organization</h3>
                    <p className="text-gray-600">Keep your recipes, pantry, and shopping lists organized in one convenient place.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Cost Estimates</h3>
                    <p className="text-gray-600">Get estimated costs for your shopping lists to better manage your budget.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-8">
              <div className="text-center">
                <Star className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of users who are already shopping smarter with Sous-Chef.
                </p>
                <Button 
                  size="lg" 
                  onClick={() => setShowAuth(true)}
                  className="w-full"
                >
                  Create Your Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <ChefHat className="h-6 w-6 text-green-400" />
              <span className="text-lg font-semibold">Sous-Chef</span>
            </div>
            <p className="text-gray-400">
              Your personal shopping assistant for smarter grocery shopping.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
