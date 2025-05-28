
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';

interface RecipeManagerProps {
  user: User;
}

const RecipeManager = ({ user }: RecipeManagerProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recipe Manager</CardTitle>
          <CardDescription>
            Coming soon - Add your favorite recipes and get ingredient lists with cost estimates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">This feature will be implemented next!</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeManager;
