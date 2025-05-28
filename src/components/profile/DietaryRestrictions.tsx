
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { allergies, AllergyType } from './types';

interface DietaryRestrictionsProps {
  userAllergies: string[];
  onAllergyChange: (allergy: AllergyType, checked: boolean) => void;
}

const DietaryRestrictions = ({ userAllergies, onAllergyChange }: DietaryRestrictionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dietary Restrictions</CardTitle>
        <CardDescription>
          Select any allergies or dietary restrictions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allergies.map((allergy) => (
            <div key={allergy} className="flex items-center space-x-2">
              <Checkbox
                id={allergy}
                checked={userAllergies.includes(allergy)}
                onCheckedChange={(checked) => 
                  onAllergyChange(allergy, checked as boolean)
                }
              />
              <Label 
                htmlFor={allergy} 
                className="text-sm font-medium capitalize cursor-pointer"
              >
                {allergy}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DietaryRestrictions;
