export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      custom_dietary_restrictions: {
        Row: {
          created_at: string
          id: string
          restriction: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          restriction: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          restriction?: string
          user_id?: string
        }
        Relationships: []
      }
      ingredient_prices: {
        Row: {
          country: string
          currency: string
          id: string
          ingredient_id: string
          last_updated: string
          price_per_unit: number
          unit: Database["public"]["Enums"]["unit_type"]
        }
        Insert: {
          country: string
          currency: string
          id?: string
          ingredient_id: string
          last_updated?: string
          price_per_unit: number
          unit: Database["public"]["Enums"]["unit_type"]
        }
        Update: {
          country?: string
          currency?: string
          id?: string
          ingredient_id?: string
          last_updated?: string
          price_per_unit?: number
          unit?: Database["public"]["Enums"]["unit_type"]
        }
        Relationships: [
          {
            foreignKeyName: "ingredient_prices_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          category: string | null
          contains_allergens:
            | Database["public"]["Enums"]["allergy_type"][]
            | null
          created_at: string
          default_unit: Database["public"]["Enums"]["unit_type"]
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          contains_allergens?:
            | Database["public"]["Enums"]["allergy_type"][]
            | null
          created_at?: string
          default_unit?: Database["public"]["Enums"]["unit_type"]
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          contains_allergens?:
            | Database["public"]["Enums"]["allergy_type"][]
            | null
          created_at?: string
          default_unit?: Database["public"]["Enums"]["unit_type"]
          id?: string
          name?: string
        }
        Relationships: []
      }
      pantry_items: {
        Row: {
          created_at: string
          estimated_days_lasting: number | null
          expiry_date: string | null
          id: string
          ingredient_id: string
          purchase_date: string | null
          quantity: number
          unit: Database["public"]["Enums"]["unit_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          estimated_days_lasting?: number | null
          expiry_date?: string | null
          id?: string
          ingredient_id: string
          purchase_date?: string | null
          quantity: number
          unit: Database["public"]["Enums"]["unit_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          estimated_days_lasting?: number | null
          expiry_date?: string | null
          id?: string
          ingredient_id?: string
          purchase_date?: string | null
          quantity?: number
          unit?: Database["public"]["Enums"]["unit_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pantry_items_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          country: string
          created_at: string
          currency: string
          household_size: number
          id: string
          updated_at: string
        }
        Insert: {
          country?: string
          created_at?: string
          currency?: string
          household_size?: number
          id: string
          updated_at?: string
        }
        Update: {
          country?: string
          created_at?: string
          currency?: string
          household_size?: number
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      recipe_ingredients: {
        Row: {
          id: string
          ingredient_id: string
          notes: string | null
          quantity: number
          recipe_id: string
          unit: Database["public"]["Enums"]["unit_type"]
        }
        Insert: {
          id?: string
          ingredient_id: string
          notes?: string | null
          quantity: number
          recipe_id: string
          unit: Database["public"]["Enums"]["unit_type"]
        }
        Update: {
          id?: string
          ingredient_id?: string
          notes?: string | null
          quantity?: number
          recipe_id?: string
          unit?: Database["public"]["Enums"]["unit_type"]
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          cook_time: number | null
          created_at: string
          description: string | null
          id: string
          instructions: string | null
          is_public: boolean | null
          name: string
          prep_time: number | null
          servings: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cook_time?: number | null
          created_at?: string
          description?: string | null
          id?: string
          instructions?: string | null
          is_public?: boolean | null
          name: string
          prep_time?: number | null
          servings?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cook_time?: number | null
          created_at?: string
          description?: string | null
          id?: string
          instructions?: string | null
          is_public?: boolean | null
          name?: string
          prep_time?: number | null
          servings?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      shopping_items: {
        Row: {
          created_at: string
          id: string
          ingredient_id: string
          price_per_unit: number | null
          quantity: number
          total_price: number | null
          trip_id: string
          unit: Database["public"]["Enums"]["unit_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient_id: string
          price_per_unit?: number | null
          quantity: number
          total_price?: number | null
          trip_id: string
          unit: Database["public"]["Enums"]["unit_type"]
        }
        Update: {
          created_at?: string
          id?: string
          ingredient_id?: string
          price_per_unit?: number | null
          quantity?: number
          total_price?: number | null
          trip_id?: string
          unit?: Database["public"]["Enums"]["unit_type"]
        }
        Relationships: [
          {
            foreignKeyName: "shopping_items_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_items_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "shopping_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_trips: {
        Row: {
          created_at: string
          id: string
          store_name: string | null
          total_cost: number | null
          trip_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          store_name?: string | null
          total_cost?: number | null
          trip_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          store_name?: string | null
          total_cost?: number | null
          trip_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_allergies: {
        Row: {
          allergy: Database["public"]["Enums"]["allergy_type"]
          created_at: string
          id: string
          severity: string | null
          user_id: string
        }
        Insert: {
          allergy: Database["public"]["Enums"]["allergy_type"]
          created_at?: string
          id?: string
          severity?: string | null
          user_id: string
        }
        Update: {
          allergy?: Database["public"]["Enums"]["allergy_type"]
          created_at?: string
          id?: string
          severity?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_recipes: {
        Row: {
          cook_time: number | null
          created_at: string
          id: string
          ingredients: Json | null
          instructions: string | null
          is_favorite: boolean | null
          last_searched_at: string | null
          prep_time: number | null
          recipe_description: string | null
          recipe_name: string
          search_count: number | null
          servings: number | null
          source: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cook_time?: number | null
          created_at?: string
          id?: string
          ingredients?: Json | null
          instructions?: string | null
          is_favorite?: boolean | null
          last_searched_at?: string | null
          prep_time?: number | null
          recipe_description?: string | null
          recipe_name: string
          search_count?: number | null
          servings?: number | null
          source?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cook_time?: number | null
          created_at?: string
          id?: string
          ingredients?: Json | null
          instructions?: string | null
          is_favorite?: boolean | null
          last_searched_at?: string | null
          prep_time?: number | null
          recipe_description?: string | null
          recipe_name?: string
          search_count?: number | null
          servings?: number | null
          source?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      allergy_type:
        | "nuts"
        | "dairy"
        | "gluten"
        | "eggs"
        | "seafood"
        | "soy"
        | "shellfish"
        | "sesame"
        | "other"
      unit_type:
        | "grams"
        | "kg"
        | "ml"
        | "liters"
        | "cups"
        | "tbsp"
        | "tsp"
        | "pieces"
        | "cans"
        | "bottles"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      allergy_type: [
        "nuts",
        "dairy",
        "gluten",
        "eggs",
        "seafood",
        "soy",
        "shellfish",
        "sesame",
        "other",
      ],
      unit_type: [
        "grams",
        "kg",
        "ml",
        "liters",
        "cups",
        "tbsp",
        "tsp",
        "pieces",
        "cans",
        "bottles",
      ],
    },
  },
} as const
