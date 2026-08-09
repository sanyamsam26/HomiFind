export type UserRole = "renter" | "owner" | "broker" | "vendor" | "admin";

export type PropertyType =
  | "apartment"
  | "house"
  | "condo"
  | "townhouse"
  | "studio"
  | "commercial"
  | "villa"
  | "multi_family";

export type PropertyStatus =
  | "draft"
  | "available"
  | "under_review"
  | "leased"
  | "archived";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "cancelled";

export type LeaseStatus =
  | "pending_signature"
  | "active"
  | "expiring_soon"
  | "terminated"
  | "expired";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketStatus =
  | "open"
  | "in_progress"
  | "pending_vendor"
  | "resolved"
  | "closed";

export interface UserPreferences {
  profileType?: string;
  minBudget?: number;
  maxBudget?: number;
  workplace?: string;
  travelMode?: string;
  amenities?: string[];
  lifestyle?: string;
  customDescription?: string;
  hasCompletedOnboarding?: boolean;
  updated_at?: string;
}

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  company_name?: string;
  license_number?: string;
  is_verified: boolean;
  preferences?: UserPreferences;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  owner_id: string;
  broker_id?: string;
  agency_id?: string;
  title: string;
  description?: string;
  property_type: PropertyType;
  status: PropertyStatus;
  rent_price: number;
  deposit_amount: number;
  utilities_included: boolean;
  bedrooms: number;
  bathrooms: number;
  square_feet?: number;
  year_built?: number;
  is_pet_friendly: boolean;
  is_furnished: boolean;
  amenities: string[];
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
  featured: boolean;
  view_count: number;
  match_score?: number; // Calculated for AI semantic search
  primary_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyMedia {
  id: string;
  property_id: string;
  storage_path: string;
  media_type: "image" | "video" | "floorplan" | "3d_tour";
  caption?: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface Application {
  id: string;
  property_id: string;
  renter_id: string;
  status: ApplicationStatus;
  proposed_move_in_date: string;
  occupants_count: number;
  annual_income: number;
  employment_status: string;
  credit_score_range?: string;
  has_pets: boolean;
  pet_details?: string;
  background_check_consent: boolean;
  document_paths: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  property?: Property;
  renter?: Profile;
}

export interface Lease {
  id: string;
  application_id?: string;
  property_id: string;
  renter_id: string;
  owner_id: string;
  broker_id?: string;
  status: LeaseStatus;
  rent_amount: number;
  security_deposit: number;
  start_date: string;
  end_date: string;
  lease_document_path?: string;
  renter_signed_at?: string;
  owner_signed_at?: string;
  created_at: string;
  updated_at: string;
  property?: Property;
  renter?: Profile;
  owner?: Profile;
}

export interface MaintenanceTicket {
  id: string;
  property_id: string;
  renter_id: string;
  assigned_vendor_id?: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  attachment_paths: string[];
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  property?: Property;
  renter?: Profile;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  attachment_url?: string;
  metadata?: Record<string, any>;
  created_at: string;
  sender?: Profile;
}

export interface Conversation {
  id: string;
  property_id?: string;
  property?: Property;
  last_message?: Message;
  participants?: Profile[];
  created_at: string;
  updated_at: string;
}

export interface Agency {
  id: string;
  name: string;
  license_id?: string;
  logo_url?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  owner_id: string;
  created_at: string;
}
