
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { Tables } from '@/integrations/supabase/types';

interface ProfileSetupProps {
  user: User;
}

type Profile = Tables<'profiles'>;
type UserAllergy = Tables<'user_allergies'>;

const allergies = [
  'nuts', 'dairy', 'gluten', 'eggs', 'seafood', 'soy', 'shellfish', 'sesame', 'other'
] as const;

const countries = [
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'UK', name: 'United Kingdom', currency: 'GBP' },
  { code: 'EU', name: 'European Union', currency: 'EUR' },
];

const ProfileSetup = ({ user }: ProfileSetupProps) => {
  const [profile, setProfile] = useState<Partial<Profile>>({
    household_size: 1,
    country: 'US',
    currency: 'USD',
  });
  const [userAllergies, setUserAllergies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
    fetchAllergies();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile(data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    }
  };

  const fetchAllergies = async () => {
    try {
      const { data, error } = await supabase
        .from('user_allergies')
        .select('allergy')
        .eq('user_id', user.id);

      if (error) throw error;
      
      setUserAllergies(data.map(item => item.allergy));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load allergies",
        variant: "destructive",
      });
    }
  };

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          household_size: profile.household_size || 1,
          country: profile.country || 'US',
          currency: profile.currency || 'USD',
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAllergyChange = async (allergy: string, checked: boolean) => {
    try {
      if (checked) {
        const { error } = await supabase
          .from('user_allergies')
          .insert({
            user_id: user.id,
            allergy: allergy as any,
          });
        
        if (error) throw error;
        setUserAllergies([...userAllergies, allergy]);
      } else {
        const { error } = await supabase
          .from('user_allergies')
          .delete()
          .eq('user_id', user.id)
          .eq('allergy', allergy);
        
        if (error) throw error;
        setUserAllergies(userAllergies.filter(a => a !== allergy));
      }

      toast({
        title: "Success",
        description: "Allergies updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
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

          <Button onClick={handleProfileSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardContent>
      </Card>

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
                    handleAllergyChange(allergy, checked as boolean)
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
    </div>
  );
};

export default ProfileSetup;
