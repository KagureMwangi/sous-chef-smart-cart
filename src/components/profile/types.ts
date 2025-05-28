
import { Tables } from '@/integrations/supabase/types';

export type Profile = Tables<'profiles'>;
export type UserAllergy = Tables<'user_allergies'>;
export type AllergyType = Tables<'user_allergies'>['allergy'];

export const allergies: AllergyType[] = [
  'nuts', 'dairy', 'gluten', 'eggs', 'seafood', 'soy', 'shellfish', 'sesame', 'other'
] as const;

export const countries = [
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'UK', name: 'United Kingdom', currency: 'GBP' },
  { code: 'EU', name: 'European Union', currency: 'EUR' },
];
