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
      places: {
        Row: {
          id: string
          name: string
          zone_code: string
          zone_name: string
          category: string
          category_name: string
          rating: number
          rating_count: number
          hero_image: string
          gallery: string[]
          short_desc: string
          history: string | null
          highlights: string[]
          coordinates: string
          address: string
          open_time: string | null
          ticket_price: string | null
          tips: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['places']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['places']['Insert']>
      }
      services: {
        Row: {
          id: string
          name: string
          type: string
          type_label: string
          zone_code: string
          zone_name: string
          price: string
          rating: number
          reviews: number
          address: string
          hotline: string
          zalo: string
          image: string
          is_verified: boolean
          affiliate_url: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['services']['Insert']>
      }
      threads: {
        Row: {
          id: string
          author_name: string
          author_avatar: string
          author_badge: string | null
          title: string
          content: string
          tag: string
          zone_code: string
          images: string[]
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: Partial<Omit<Database['public']['Tables']['threads']['Row'], 'id' | 'created_at' | 'updated_at'>> & {
          author_name: string
          title: string
          content: string
        }
        Update: Partial<Database['public']['Tables']['threads']['Insert']>
      }
      comments: {
        Row: {
          id: string
          thread_id: string
          author_name: string
          author_avatar: string
          text: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['comments']['Insert']>
      }
      leads: {
        Row: {
          id: string
          service_id: string
          service_name: string
          action: 'call' | 'zalo'
          user_ip: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
      }
      partner_registrations: {
        Row: {
          id: string
          business_name: string
          service_type: string
          zone_code: string
          contact_name: string
          phone: string
          zalo: string | null
          address: string
          price_range: string | null
          status: 'pending' | 'approved' | 'rejected'
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['partner_registrations']['Row'], 'id' | 'created_at' | 'status'>
        Update: Partial<Database['public']['Tables']['partner_registrations']['Insert']>
      }
    }
  }
}
