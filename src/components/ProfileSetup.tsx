
import React from 'react';
import { User } from '@supabase/supabase-js';
import { useProfile } from '@/hooks/useProfile';
import { useAllergies } from '@/hooks/useAllergies';
import HouseholdInformation from './profile/HouseholdInformation';
import DietaryRestrictions from './profile/DietaryRestrictions';

interface ProfileSetupProps {
  user: User;
}

const ProfileSetup = ({ user }: ProfileSetupProps) => {
  const { profile, setProfile, saveProfile, loading } = useProfile(user);
  const { userAllergies, handleAllergyChange } = useAllergies(user);

  return (
    <div className="space-y-6">
      <HouseholdInformation
        profile={profile}
        setProfile={setProfile}
        onSave={saveProfile}
        loading={loading}
      />
      
      <DietaryRestrictions
        userAllergies={userAllergies}
        onAllergyChange={handleAllergyChange}
      />
    </div>
  );
};

export default ProfileSetup;
