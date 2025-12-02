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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      article: {
        Row: {
          category_id: number
          content: string
          date_created: string | null
          id: number
          profile_id: number
          slug: string
          thumbnail: string
          title: string
        }
        Insert: {
          category_id: number
          content: string
          date_created?: string | null
          id: number
          profile_id: number
          slug: string
          thumbnail: string
          title: string
        }
        Update: {
          category_id?: number
          content?: string
          date_created?: string | null
          id?: number
          profile_id?: number
          slug?: string
          thumbnail?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_category_id_foreign"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_profile_id_foreign"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmark: {
        Row: {
          article_id: number
          date_created: string | null
          id: number
          profile_id: number
        }
        Insert: {
          article_id: number
          date_created?: string | null
          id: number
          profile_id: number
        }
        Update: {
          article_id?: number
          date_created?: string | null
          id?: number
          profile_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bookmark_article_id_foreign"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "article"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmark_profile_id_foreign"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      category: {
        Row: {
          id: number
          slug: string
          thumbnail: string
          title: string
        }
        Insert: {
          id: number
          slug: string
          thumbnail: string
          title: string
        }
        Update: {
          id?: number
          slug?: string
          thumbnail?: string
          title?: string
        }
        Relationships: []
      }
      comment: {
        Row: {
          article_id: number
          comment: string
          date_created: string | null
          id: number
          profile_id: number
        }
        Insert: {
          article_id: number
          comment: string
          date_created?: string | null
          id: number
          profile_id: number
        }
        Update: {
          article_id?: number
          comment?: string
          date_created?: string | null
          id?: number
          profile_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "comment_article_id_foreign"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "article"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_profile_id_foreign"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      like: {
        Row: {
          article_id: number
          date_created: string | null
          id: number
          profile_id: number
        }
        Insert: {
          article_id: number
          date_created?: string | null
          id: number
          profile_id: number
        }
        Update: {
          article_id?: number
          date_created?: string | null
          id?: number
          profile_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "like_article_id_foreign"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "article"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "like_profile_id_foreign"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      notification: {
        Row: {
          article_id: number
          date_created: string | null
          id: number
          is_read: boolean
          message: string
          reciver_id: number
          sender_id: number
          type: string
        }
        Insert: {
          article_id: number
          date_created?: string | null
          id: number
          is_read?: boolean
          message: string
          reciver_id: number
          sender_id: number
          type: string
        }
        Update: {
          article_id?: number
          date_created?: string | null
          id?: number
          is_read?: boolean
          message?: string
          reciver_id?: number
          sender_id?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_article_id_foreign"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "article"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_reciver_id_foreign"
            columns: ["reciver_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_sender_id_foreign"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          biography: string
          country: string
          id: number
          image: string
          job: string
          name: string
          role: string
        }
        Insert: {
          biography: string
          country: string
          id: number
          image: string
          job: string
          name: string
          role: string
        }
        Update: {
          biography?: string
          country?: string
          id?: number
          image?: string
          job?: string
          name?: string
          role?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
