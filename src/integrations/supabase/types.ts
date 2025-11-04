export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          caregiver_id: string
          created_at: string | null
          end_date: string
          id: string
          pet_id: string
          service_type: Database["public"]["Enums"]["service_type"]
          special_instructions: string | null
          start_date: string
          status: Database["public"]["Enums"]["booking_status"] | null
          total_price: number
          tutor_id: string
          updated_at: string | null
        }
        Insert: {
          caregiver_id: string
          created_at?: string | null
          end_date: string
          id?: string
          pet_id: string
          service_type: Database["public"]["Enums"]["service_type"]
          special_instructions?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price: number
          tutor_id: string
          updated_at?: string | null
        }
        Update: {
          caregiver_id?: string
          created_at?: string | null
          end_date?: string
          id?: string
          pet_id?: string
          service_type?: Database["public"]["Enums"]["service_type"]
          special_instructions?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price?: number
          tutor_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "pet_caregivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          booking_id: string
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          sender_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          sender_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_caregivers: {
        Row: {
          accepts_pet_sizes: Database["public"]["Enums"]["pet_size"][] | null
          available_services:
            | Database["public"]["Enums"]["service_type"][]
            | null
          background_check_date: string | null
          created_at: string | null
          experience_years: number | null
          has_yard: boolean | null
          home_type: string | null
          id: string
          max_pets_at_once: number | null
          price_per_day: number | null
          price_per_walk: number | null
          rating: number | null
          total_reviews: number | null
          updated_at: string | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          accepts_pet_sizes?: Database["public"]["Enums"]["pet_size"][] | null
          available_services?:
            | Database["public"]["Enums"]["service_type"][]
            | null
          background_check_date?: string | null
          created_at?: string | null
          experience_years?: number | null
          has_yard?: boolean | null
          home_type?: string | null
          id?: string
          max_pets_at_once?: number | null
          price_per_day?: number | null
          price_per_walk?: number | null
          rating?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          accepts_pet_sizes?: Database["public"]["Enums"]["pet_size"][] | null
          available_services?:
            | Database["public"]["Enums"]["service_type"][]
            | null
          background_check_date?: string | null
          created_at?: string | null
          experience_years?: number | null
          has_yard?: boolean | null
          home_type?: string | null
          id?: string
          max_pets_at_once?: number | null
          price_per_day?: number | null
          price_per_walk?: number | null
          rating?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      pets: {
        Row: {
          age: number | null
          allergies: string | null
          breed: string | null
          created_at: string | null
          health_notes: string | null
          id: string
          name: string
          neutered: boolean | null
          personality: string | null
          photo_url: string | null
          size: Database["public"]["Enums"]["pet_size"] | null
          species: string
          tutor_id: string
          updated_at: string | null
          vaccinated: boolean | null
          weight: number | null
        }
        Insert: {
          age?: number | null
          allergies?: string | null
          breed?: string | null
          created_at?: string | null
          health_notes?: string | null
          id?: string
          name: string
          neutered?: boolean | null
          personality?: string | null
          photo_url?: string | null
          size?: Database["public"]["Enums"]["pet_size"] | null
          species: string
          tutor_id: string
          updated_at?: string | null
          vaccinated?: boolean | null
          weight?: number | null
        }
        Update: {
          age?: number | null
          allergies?: string | null
          breed?: string | null
          created_at?: string | null
          health_notes?: string | null
          id?: string
          name?: string
          neutered?: boolean | null
          personality?: string | null
          photo_url?: string | null
          size?: Database["public"]["Enums"]["pet_size"] | null
          species?: string
          tutor_id?: string
          updated_at?: string | null
          vaccinated?: boolean | null
          weight?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string | null
          full_name: string
          id: string
          phone: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          full_name: string
          id: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          reviewed_id: string
          reviewer_id: string
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          reviewed_id: string
          reviewer_id: string
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          reviewed_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      service_updates: {
        Row: {
          booking_id: string
          caregiver_id: string
          created_at: string | null
          id: string
          location_lat: number | null
          location_lng: number | null
          message: string | null
          photo_url: string | null
        }
        Insert: {
          booking_id: string
          caregiver_id: string
          created_at?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          message?: string | null
          photo_url?: string | null
        }
        Update: {
          booking_id?: string
          caregiver_id?: string
          created_at?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          message?: string | null
          photo_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_updates_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "tutor" | "cuidador" | "admin"
      booking_status:
        | "pendente"
        | "confirmado"
        | "em_andamento"
        | "concluido"
        | "cancelado"
      pet_size: "pequeno" | "medio" | "grande" | "gigante"
      service_type: "hospedagem" | "passeio" | "creche" | "visita_diaria"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["tutor", "cuidador", "admin"],
      booking_status: [
        "pendente",
        "confirmado",
        "em_andamento",
        "concluido",
        "cancelado",
      ],
      pet_size: ["pequeno", "medio", "grande", "gigante"],
      service_type: ["hospedagem", "passeio", "creche", "visita_diaria"],
    },
  },
} as const
