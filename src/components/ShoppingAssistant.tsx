
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';

interface ShoppingAssistantProps {
  user: User;
}

const ShoppingAssistant = ({ user }: ShoppingAssistantProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shopping Assistant</CardTitle>
          <CardDescription>
            Coming soon - Get personalized shopping recommendations based on your pantry and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">This feature will be implemented next!</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShoppingAssistant;
