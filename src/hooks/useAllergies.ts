
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { AllergyType } from '@/components/profile/types';

export const useAllergies = (user: User) => {
  const [userAllergies, setUserAllergies] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllergies();
  }, [user]);

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

  const handleAllergyChange = async (allergy: AllergyType, checked: boolean) => {
    try {
      if (checked) {
        const { error } = await supabase
          .from('user_allergies')
          .insert({
            user_id: user.id,
            allergy: allergy,
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

  return {
    userAllergies,
    handleAllergyChange,
  };
};
