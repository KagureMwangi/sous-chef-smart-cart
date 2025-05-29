import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { AllergyType } from '@/components/profile/types';

export const useAllergies = (user: User) => {
  const [userAllergies, setUserAllergies] = useState<string[]>([]);
  const [allergyDetails, setAllergyDetails] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchAllergies();
  }, [user]);

  const fetchAllergies = async () => {
    try {
      const { data, error } = await supabase
        .from('user_allergies')
        .select('allergy, severity')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const allergies = data.map(item => item.allergy);
      const details = data.reduce((acc, item) => {
        if (item.severity) {
          acc[item.allergy] = item.severity;
        }
        return acc;
      }, {} as Record<string, string>);
      
      setUserAllergies(allergies);
      setAllergyDetails(details);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load allergies",
        variant: "destructive",
      });
    }
  };

  const handleAllergyChange = async (allergy: AllergyType, checked: boolean, details?: string) => {
    try {
      if (checked) {
        const { error } = await supabase
          .from('user_allergies')
          .insert({
            user_id: user.id,
            allergy: allergy,
            severity: details || null,
          });
        
        if (error) throw error;
        setUserAllergies([...userAllergies, allergy]);
        if (details) {
          setAllergyDetails({ ...allergyDetails, [allergy]: details });
        }
      } else {
        const { error } = await supabase
          .from('user_allergies')
          .delete()
          .eq('user_id', user.id)
          .eq('allergy', allergy);
        
        if (error) throw error;
        setUserAllergies(userAllergies.filter(a => a !== allergy));
        const newDetails = { ...allergyDetails };
        delete newDetails[allergy];
        setAllergyDetails(newDetails);
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

  return {
    userAllergies,
    allergyDetails,
    handleAllergyChange,
  };
};