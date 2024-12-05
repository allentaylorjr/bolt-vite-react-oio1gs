export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      churches: {
        Row: {
          id: string
          name: string
          subdomain: string
          logo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          subdomain: string
          logo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          subdomain?: string
          logo_url?: string | null
          created_at?: string
        }
      }
      sermons: {
        Row: {
          id: string
          church_id: string
          title: string
          description: string | null
          speaker_id: string | null
          series_id: string | null
          video_url: string | null
          thumbnail_url: string | null
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          church_id: string
          title: string
          description?: string | null
          speaker_id?: string | null
          series_id?: string | null
          video_url?: string | null
          thumbnail_url?: string | null
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          church_id?: string
          title?: string
          description?: string | null
          speaker_id?: string | null
          series_id?: string | null
          video_url?: string | null
          thumbnail_url?: string | null
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}