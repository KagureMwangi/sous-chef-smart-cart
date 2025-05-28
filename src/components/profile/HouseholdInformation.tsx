
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Profile, countries } from './types';

interface HouseholdInformationProps {
  profile: Partial<Profile>;
  setProfile: (profile: Partial<Profile>) => void;
  onSave: () => void;
  loading: boolean;
}

const HouseholdInformation = ({ profile, setProfile, onSave, loading }: HouseholdInformationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Household Information</CardTitle>
        <CardDescription>
          Help us provide better quantity recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="household-size">Household Size</Label>
          <Input
            id="household-size"
            type="number"
            min="1"
            max="20"
            value={profile.household_size || 1}
            onChange={(e) => setProfile({
              ...profile,
              household_size: parseInt(e.target.value) || 1
            })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select
            value={profile.country}
            onValueChange={(value) => {
              const country = countries.find(c => c.code === value);
              setProfile({
                ...profile,
                country: value,
                currency: country?.currency || 'USD'
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            value={profile.currency || 'USD'}
            disabled
            className="bg-gray-50"
          />
        </div>

        <Button onClick={onSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default HouseholdInformation;
