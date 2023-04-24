export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      client_projects: {
        Row: {
          cost: string | null
          created_at: string | null
          id: string
          milestones: Json | null
          protected_ip: boolean | null
          scope: string | null
          specific_requests: string | null
          terms_and_conditions: string | null
        }
        Insert: {
          cost?: string | null
          created_at?: string | null
          id?: string
          milestones?: Json | null
          protected_ip?: boolean | null
          scope?: string | null
          specific_requests?: string | null
          terms_and_conditions?: string | null
        }
        Update: {
          cost?: string | null
          created_at?: string | null
          id?: string
          milestones?: Json | null
          protected_ip?: boolean | null
          scope?: string | null
          specific_requests?: string | null
          terms_and_conditions?: string | null
        }
      }
      developers: {
        Row: {
          availability: string | null
          created_at: string | null
          exclusions: string | null
          id: string
          rate: string | null
          resume_url: string | null
          skills: string | null
        }
        Insert: {
          availability?: string | null
          created_at?: string | null
          exclusions?: string | null
          id?: string
          rate?: string | null
          resume_url?: string | null
          skills?: string | null
        }
        Update: {
          availability?: string | null
          created_at?: string | null
          exclusions?: string | null
          id?: string
          rate?: string | null
          resume_url?: string | null
          skills?: string | null
        }
      }
      portfolio_items: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          protected_ip: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          protected_ip?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          protected_ip?: string | null
          title?: string | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          client_id: string | null
          developer_id: string | null
          full_name: string | null
          id: string
          portfolio_id: string | null
          updated_at: string | null
          user_type: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          client_id?: string | null
          developer_id?: string | null
          full_name?: string | null
          id: string
          portfolio_id?: string | null
          updated_at?: string | null
          user_type?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          client_id?: string | null
          developer_id?: string | null
          full_name?: string | null
          id?: string
          portfolio_id?: string | null
          updated_at?: string | null
          user_type?: string | null
          website?: string | null
        }
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
