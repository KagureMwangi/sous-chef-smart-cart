import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { allergies, AllergyType } from './types';

interface DietaryRestrictionsProps {
  userAllergies: string[];
  onAllergyChange: (allergy: AllergyType, checked: boolean, details?: string) => void;
}

const DietaryRestrictions = ({ userAllergies, onAllergyChange }: DietaryRestrictionsProps) => {
  const [otherAllergyDetails, setOtherAllergyDetails] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);

  const handleOtherAllergyChange = (checked: boolean) => {
    if (checked) {
      setShowOtherInput(true);
    } else {
      setShowOtherInput(false);
      setOtherAllergyDetails('');
      onAllergyChange('other', false);
    }
  };

  const handleOtherAllergySave = () => {
    if (otherAllergyDetails.trim()) {
      onAllergyChange('other', true, otherAllergyDetails);
    }
  };

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
                onCheckedChange={(checked) => {
                  if (allergy === 'other') {
                    handleOtherAllergyChange(checked as boolean);
                  } else {
                    onAllergyChange(allergy, checked as boolean);
                  }
                }}
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

        {showOtherInput && (
          <div className="mt-4 space-y-2">
            <Label htmlFor="other-allergy">Specify your allergies</Label>
            <div className="flex gap-2">
              <Input
                id="other-allergy"
                value={otherAllergyDetails}
                onChange={(e) => setOtherAllergyDetails(e.target.value)}
                placeholder="Enter your specific allergies"
                className="flex-1"
              />
              <Button onClick={handleOtherAllergySave}>Save</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DietaryRestrictions;