
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userInput } = await req.json();
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    console.log('Fetching user data for:', user.id);

    // Fetch user's pantry items
    const { data: pantryItems, error: pantryError } = await supabase
      .from('pantry_items')
      .select(`
        *,
        ingredients (name, category)
      `)
      .eq('user_id', user.id);

    if (pantryError) {
      console.error('Error fetching pantry:', pantryError);
    }

    // Fetch user's allergies
    const { data: allergies, error: allergiesError } = await supabase
      .from('user_allergies')
      .select('allergy, severity')
      .eq('user_id', user.id);

    if (allergiesError) {
      console.error('Error fetching allergies:', allergiesError);
    }

    // Fetch custom dietary restrictions
    const { data: customRestrictions, error: customError } = await supabase
      .from('custom_dietary_restrictions')
      .select('restriction')
      .eq('user_id', user.id);

    if (customError) {
      console.error('Error fetching custom restrictions:', customError);
    }

    // Fetch user profile for household info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('household_size, country, currency')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    // Prepare context for the AI
    let contextualInfo = '';
    
    if (pantryItems && pantryItems.length > 0) {
      contextualInfo += '\n\nUser\'s Current Pantry:\n';
      pantryItems.forEach(item => {
        contextualInfo += `- ${item.ingredients?.name}: ${item.quantity} ${item.unit}`;
        if (item.expiry_date) {
          contextualInfo += ` (expires: ${item.expiry_date})`;
        }
        contextualInfo += '\n';
      });
    }

    if (allergies && allergies.length > 0) {
      contextualInfo += '\n\nUser\'s Allergies:\n';
      allergies.forEach(allergy => {
        contextualInfo += `- ${allergy.allergy}`;
        if (allergy.severity) {
          contextualInfo += ` (${allergy.severity})`;
        }
        contextualInfo += '\n';
      });
    }

    if (customRestrictions && customRestrictions.length > 0) {
      contextualInfo += '\n\nUser\'s Dietary Restrictions:\n';
      customRestrictions.forEach(restriction => {
        contextualInfo += `- ${restriction.restriction}\n`;
      });
    }

    if (profile) {
      contextualInfo += `\n\nHousehold Information:\n- Household size: ${profile.household_size}\n- Country: ${profile.country}\n- Currency: ${profile.currency}\n`;
    }

    // Enhanced prompt with context
    const enhancedPrompt = contextualInfo 
      ? `${userInput}\n\n--- User Context ---${contextualInfo}\n\nPlease consider the user's pantry items, dietary restrictions, and household information when providing your response. If the question is about what they have available, cooking suggestions, or meal planning, use this information to give personalized advice.`
      : userInput;

    console.log('Sending to backend with context:', enhancedPrompt.substring(0, 200) + '...');

    // Forward the enhanced request to the original backend
    const response = await fetch('https://zgroq.onrender.com/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_input: enhancedPrompt
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const responseData = await response.json();
    
    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      reply: "Sorry, I encountered an error while processing your request. Please try again."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
