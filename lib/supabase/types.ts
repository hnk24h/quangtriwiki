export type UserRole = 'admin' | 'editor' | 'user';
export type UserStatus = 'active' | 'inactive';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone?: string | null;
  avatar?: string | null;
  note?: string | null;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface ItineraryStep {
  name: string;
  time: string;
  desc: string;
}

export interface EmergencyHotline {
  name: string;
  phone: string;
  note?: string;
}

export interface GasStation {
  name: string;
  route: string;
  tip?: string;
}

export interface BestTimeSeason {
  season: string;
  desc: string;
}

export interface GuidesData {
  bestTimeToVisit: BestTimeSeason[];
  packingChecklist: string[];
  emergencyHotlines: EmergencyHotline[];
  gasStations: GasStation[];
}

export interface Place {
  id: string;
  name: string;
  zoneCode: string;
  zoneName: string;
  category: string;
  categoryName: string;
  image: string;
  hero_image?: string;
  gallery?: string[];
  rating: number;
  reviewsCount: number;
  shortDesc: string;
  fullDesc?: string;
  history?: string | null;
  highlights: string[];
  coordinates: string;
  address: string;
  openHours: string;
  ticket: string;
  tips?: string | null;
}

export interface Service {
  id: string;
  name: string;
  type: string;
  typeLabel: string;
  category?: string;
  categoryName?: string;
  zoneCode: string;
  zoneName: string;
  price: string;
  rating: number;
  reviewsCount: number;
  address: string;
  phone: string;
  hotline?: string;
  zalo: string;
  image: string;
  verified: boolean;
  is_verified?: boolean;
  badge?: string;
  description?: string | null;
  highlights?: string[];
}

export interface Comment {
  id: string;
  thread_id: string;
  author_name: string;
  author_avatar?: string;
  text: string;
  created_at: string;
}

export interface Thread {
  id: string;
  author: string;
  author_name?: string;
  avatar: string;
  author_avatar?: string;
  badge: string;
  author_badge?: string | null;
  time: string;
  created_at?: string;
  tag: string;
  zoneCode: string;
  zone_code?: string;
  title: string;
  content: string;
  images: string[];
  likes: number;
  likes_count: number;
  comments: Comment[];
}

export interface Food {
  id: string;
  name: string;
  origin: string;
  type: string;
  priceRange: string;
  description: string;
  tasteNotes?: string;
  image: string;
  addressRecs: string[];
  highlights?: string[];
}

export interface Itinerary {
  id: string;
  title: string;
  duration: string;
  suitability: string;
  distance: string;
  description: string;
  highlights: string[];
  steps: ItineraryStep[];
  stops: ItineraryStep[];
}

export interface Zone {
  code: string;
  name: string;
  slug: string;
  tagline: string;
  heroImage: string;
  description: string;
  desc?: string;
  featuredCount?: string;
  specialty?: string;
  typeTag?: string;
  typeGroup?: 'history' | 'mountain' | 'coastal';
  lat?: number;
  lon?: number;
  showInWeather?: boolean;
  weatherRegionLabel?: string;
}

export interface BannerSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  zoneCode?: string;
  statsTag?: string;
  sortOrder?: number;
}

export interface PartnerRegistration {
  id: string;
  business_name: string;
  service_type: string;
  zone_code: string;
  contact_name: string;
  phone: string;
  zalo: string | null;
  address: string;
  price_range: string | null;
  status: 'pending' | 'approved' | 'rejected';
  notes: string | null;
  created_at: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  todayViews: number;
  last7DaysViews: number;
  prev7DaysViews: number;
  growthPercent: number | null;
  hourlyDistribution: { hour: number; label: string; count: number }[];
  peakHourRange: string;
  peakHourSharePercent: number;
  topPages: { path: string; count: number; percent: number }[];
  deviceBreakdown: { device: string; count: number; percent: number }[];
  regionBreakdown: { region: string; count: number; percent: number }[];
}

export interface Database {
  public: {
    Tables: {
      places: {
        Row: {
          id: string;
          name: string;
          zone_code: string;
          zone_name: string;
          category: string;
          category_name: string;
          rating: number;
          rating_count: number;
          hero_image: string;
          gallery: string[];
          short_desc: string;
          history: string | null;
          highlights: string[];
          coordinates: string;
          address: string;
          open_time: string | null;
          ticket_price: string | null;
          tips: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Omit<Database['public']['Tables']['places']['Row'], 'created_at' | 'updated_at'>> & {
          id: string;
          name: string;
          zone_code: string;
          zone_name: string;
          category: string;
          category_name: string;
          short_desc: string;
          coordinates: string;
          address: string;
        };
        Update: Partial<Database['public']['Tables']['places']['Insert']>;
      };
      services: {
        Row: {
          id: string;
          name: string;
          type: string;
          type_label: string;
          zone_code: string;
          zone_name: string;
          price: string;
          rating: number;
          reviews: number;
          address: string;
          hotline: string;
          zalo: string;
          image: string;
          is_verified: boolean;
          affiliate_url: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Omit<Database['public']['Tables']['services']['Row'], 'created_at' | 'updated_at'>> & {
          id: string;
          name: string;
          type: string;
          type_label: string;
          zone_code: string;
          zone_name: string;
          price: string;
          address: string;
          hotline: string;
          zalo: string;
          image: string;
        };
        Update: Partial<Database['public']['Tables']['services']['Insert']>;
      };
      threads: {
        Row: {
          id: string;
          author_name: string;
          author_avatar: string;
          author_badge: string | null;
          title: string;
          content: string;
          tag: string;
          zone_code: string;
          images: string[];
          likes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Omit<Database['public']['Tables']['threads']['Row'], 'id' | 'created_at' | 'updated_at'>> & {
          author_name: string;
          title: string;
          content: string;
        };
        Update: Partial<Database['public']['Tables']['threads']['Insert']>;
      };
      comments: {
        Row: {
          id: string;
          thread_id: string;
          author_name: string;
          author_avatar: string;
          text: string;
          created_at: string;
        };
        Insert: Partial<Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at'>> & {
          thread_id: string;
          author_name: string;
          text: string;
        };
        Update: Partial<Database['public']['Tables']['comments']['Insert']>;
      };
      leads: {
        Row: {
          id: string;
          service_id: string;
          service_name: string;
          action: 'call' | 'zalo';
          user_ip: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['leads']['Insert']>;
      };
      partner_registrations: {
        Row: PartnerRegistration;
        Insert: Partial<Omit<PartnerRegistration, 'id' | 'created_at' | 'status'>> & {
          business_name: string;
          service_type: string;
          zone_code: string;
          contact_name: string;
          phone: string;
          address: string;
        };
        Update: Partial<Omit<PartnerRegistration, 'id' | 'created_at'>>;
      };
      foods: {
        Row: {
          id: string;
          name: string;
          origin: string | null;
          type: string;
          price_range: string | null;
          description: string | null;
          taste_notes: string | null;
          image: string | null;
          address_recs: string[];
          highlights: string[];
          created_at: string;
        };
        Insert: Partial<Omit<Database['public']['Tables']['foods']['Row'], 'created_at'>> & {
          id: string;
          name: string;
        };
        Update: Partial<Database['public']['Tables']['foods']['Insert']>;
      };
      itineraries: {
        Row: {
          id: string;
          title: string;
          duration: string;
          suitability: string | null;
          distance: string | null;
          description: string | null;
          highlights: string[];
          stops: ItineraryStep[];
          created_at: string;
        };
        Insert: Partial<Omit<Database['public']['Tables']['itineraries']['Row'], 'created_at'>> & {
          id: string;
          title: string;
          duration: string;
        };
        Update: Partial<Database['public']['Tables']['itineraries']['Insert']>;
      };
      zones: {
        Row: {
          code: string;
          name: string;
          slug: string;
          tagline: string | null;
          hero_image: string | null;
          description: string | null;
          featured_count: string | null;
          specialty: string | null;
          type_tag: string | null;
          type_group: string | null;
          lat: number | null;
          lon: number | null;
          show_in_weather: boolean | null;
          weather_region_label: string | null;
          created_at: string;
        };
        Insert: Partial<Omit<Database['public']['Tables']['zones']['Row'], 'created_at'>> & {
          code: string;
          name: string;
          slug: string;
        };
        Update: Partial<Database['public']['Tables']['zones']['Insert']>;
      };
      page_views: {
        Row: {
          id: string;
          path: string;
          ip: string | null;
          user_agent: string | null;
          region: string | null;
          device_type: string | null;
          created_at: string;
        };
        Insert: {
          path: string;
          ip?: string | null;
          user_agent?: string | null;
          region?: string | null;
          device_type?: string | null;
        };
        Update: Partial<Database['public']['Tables']['page_views']['Insert']>;
      };
      banner_slides: {
        Row: {
          id: string;
          badge: string | null;
          title: string;
          subtitle: string | null;
          image: string;
          zone_code: string | null;
          stats_tag: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Omit<Database['public']['Tables']['banner_slides']['Row'], 'created_at' | 'updated_at'>> & {
          id: string;
          title: string;
          image: string;
        };
        Update: Partial<Database['public']['Tables']['banner_slides']['Insert']>;
      };
      guides: {
        Row: {
          id: string;
          best_time_to_visit: BestTimeSeason[];
          packing_checklist: string[];
          emergency_hotlines: EmergencyHotline[];
          gas_stations: GasStation[];
          updated_at: string;
        };
        Insert: Partial<Omit<Database['public']['Tables']['guides']['Row'], 'updated_at'>> & {
          id?: string;
        };
        Update: Partial<Database['public']['Tables']['guides']['Insert']>;
      };
      map_pins: {
        Row: {
          id: string;
          name: string;
          category: string;
          category_label: string | null;
          zone_code: string;
          zone_name: string | null;
          lat: number;
          lng: number;
          address: string | null;
          price_or_hours: string | null;
          description: string | null;
          image: string | null;
          contributor: string | null;
          created_at: string;
        };
        Insert: Partial<Omit<Database['public']['Tables']['map_pins']['Row'], 'created_at'>> & {
          id: string;
          name: string;
          lat: number;
          lng: number;
        };
        Update: Partial<Database['public']['Tables']['map_pins']['Insert']>;
      };
    };
  };
}
