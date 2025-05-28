
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Auth from '@/components/Auth';
import Dashboard from '@/components/Dashboard';
import LandingPage from '@/components/LandingPage';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} />;
  }

  // Show landing page for non-authenticated users
  return <LandingPage />;
};

export default Index;
