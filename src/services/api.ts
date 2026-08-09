import { supabase } from "../lib/supabase";
import { authenticatedFetch } from "./backend-api";
import {
  Property,
  Application,
  Lease,
  MaintenanceTicket,
  Message,
  UserPreferences,
} from "../types/database";

export function getStableUserId(email: string): string {
  if (!email) return "user-guest";
  const clean = email.trim().toLowerCase();
  return `user-${clean.replace(/[^a-z0-9]/g, "-")}`;
}

export interface VisitRecord {
  id: string;
  property_id: string;
  renter_id: string;
  host_id: string;
  visit_type: "in_person" | "virtual_tour" | "self_guided";
  scheduled_start: string;
  scheduled_end: string;
  status: "requested" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  property?: Property;
}

export interface VerificationRecord {
  id: string;
  user_id: string;
  government_id_url: string;
  proof_of_ownership_url: string;
  license_number?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface NotificationRecord {
  id: string;
  user_id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

function mapProperty(item: any): Property {
  return {
    id: item.id,
    owner_id: item.owner_id || "",
    broker_id: item.broker_id ?? undefined,
    title: item.title || "Untitled Property",
    description: item.description || "",
    property_type: item.property_type || "apartment",
    status: item.status || "under_review",
    rent_price: Number(item.rent_price) || 0,
    deposit_amount: Number(item.deposit_amount) || 0,
    utilities_included: item.utilities_included ?? false,
    bedrooms: Number(item.bedrooms) || 0,
    bathrooms: Number(item.bathrooms) || 0,
    square_feet: item.square_feet ? Number(item.square_feet) : undefined,
    is_pet_friendly: item.is_pet_friendly ?? false,
    is_furnished: item.is_furnished ?? false,
    amenities: Array.isArray(item.amenities) ? item.amenities : [],
    address_line1: item.address_line1 || "",
    city: item.city || "",
    state: item.state || "",
    zip_code: item.zip_code || "",
    country: item.country || "India",
    featured: item.featured ?? false,
    view_count: Number(item.view_count) || 0,
    match_score: item.match_score,
    primary_image_url: item.primary_image_url || undefined,
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || new Date().toISOString(),
  };
}

export const dbService = {
  // --- PROPERTIES ---
  async fetchProperties(): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) return [];
      return data.map(mapProperty);
    } catch {
      return [];
    }
  },

  async fetchMyProperties(): Promise<Property[]> {
    try {
      const response = await authenticatedFetch("/properties/mine");
      const data = (await response.json()) as any[];
      return Array.isArray(data) ? data.map(mapProperty) : [];
    } catch (error) {
      console.error("Failed to fetch owner properties", error);
      return [];
    }
  },

  async createProperty(property: Partial<Property>): Promise<Property | null> {
    try {
      const response = await authenticatedFetch("/properties", {
        method: "POST",
        body: JSON.stringify({
          title: property.title,
          description: property.description,
          property_type: property.property_type || "apartment",
          status: "under_review",
          rent_price: property.rent_price || 0,
          deposit_amount: property.deposit_amount || 0,
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          square_feet: property.square_feet,
          city: property.city,
          state: property.state,
          address_line1: property.address_line1,
          zip_code: property.zip_code,
          country: property.country || "India",
          amenities: property.amenities || [],
          utilities_included: property.utilities_included ?? false,
          is_pet_friendly: property.is_pet_friendly ?? false,
          is_furnished: property.is_furnished ?? false,
        }),
      });
      return mapProperty(await response.json());
    } catch (error) {
      console.error("Failed to create property", error);
      return null;
    }
  },

  // --- VISITS ---
  async scheduleVisit(visitData: {
    property_id: string;
    renter_id: string;
    host_id: string;
    visit_type: "in_person" | "virtual_tour" | "self_guided";
    scheduled_start: string;
    scheduled_end: string;
    notes?: string;
  }): Promise<VisitRecord | null> {
    try {
      const { data, error } = await supabase
        .from("visits")
        .insert([visitData])
        .select()
        .single();
      if (error || !data) return null;
      return data;
    } catch {
      return null;
    }
  },

  async fetchVisits(userId: string): Promise<VisitRecord[]> {
    try {
      const { data, error } = await supabase
        .from("visits")
        .select("*, property:properties(*)")
        .or(`renter_id.eq.${userId},host_id.eq.${userId}`)
        .order("scheduled_start", { ascending: true });

      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  },

  // --- APPLICATIONS ---
  async fetchApplications(): Promise<Application[]> {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*, property:properties(*)")
        .order("created_at", { ascending: false });

      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  },

  async createApplication(app: Partial<Application>): Promise<Application | null> {
    try {
      const { data, error } = await supabase
        .from("applications")
        .insert([app])
        .select("*, property:properties(*)")
        .single();

      if (error || !data) return null;
      return data;
    } catch {
      return null;
    }
  },

  async updateApplicationStatus(id: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      return !error;
    } catch {
      return false;
    }
  },

  // --- NOTIFICATIONS ---
  async fetchNotifications(userId: string): Promise<NotificationRecord[]> {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  },

  // --- USER PREFERENCES (AI ONBOARDING DATA) ---
  async fetchUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const local = localStorage.getItem(`homifind_prefs_${userId}`);
      if (local) {
        try {
          return JSON.parse(local);
        } catch {
          // ignore invalid local cache
        }
      }

      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        const prefs: UserPreferences = {
          profileType: data.profile_type,
          minBudget: data.min_budget,
          maxBudget: data.max_budget,
          workplace: data.workplace,
          travelMode: data.travel_mode,
          amenities: data.amenities || [],
          lifestyle: data.lifestyle,
          customDescription: data.custom_description,
          hasCompletedOnboarding: data.has_completed_onboarding ?? true,
          updated_at: data.updated_at,
        };
        localStorage.setItem(`homifind_prefs_${userId}`, JSON.stringify(prefs));
        return prefs;
      }
      return null;
    } catch {
      return null;
    }
  },

  async saveUserPreferences(
    userId: string,
    preferences: UserPreferences
  ): Promise<boolean> {
    try {
      const fullPrefs: UserPreferences = {
        ...preferences,
        hasCompletedOnboarding: true,
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem(`homifind_prefs_${userId}`, JSON.stringify(fullPrefs));

      const { error } = await supabase.from("user_preferences").upsert(
        {
          user_id: userId,
          profile_type: preferences.profileType,
          min_budget: preferences.minBudget,
          max_budget: preferences.maxBudget,
          workplace: preferences.workplace,
          travel_mode: preferences.travelMode,
          amenities: preferences.amenities,
          lifestyle: preferences.lifestyle,
          custom_description: preferences.customDescription,
          has_completed_onboarding: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      return !error;
    } catch {
      return true;
    }
  },

  // --- DYNAMIC AI PROPERTY SCORING ---
  async fetchPersonalizedProperties(
    userId: string,
    prefs?: UserPreferences | null,
    baseProperties: Property[] = []
  ): Promise<Property[]> {
    const userPrefs = prefs || (await this.fetchUserPreferences(userId));
    if (!userPrefs) return baseProperties;

    return baseProperties
      .map((property) => {
        let score = 70;

        if (userPrefs.maxBudget) {
          if (property.rent_price <= userPrefs.maxBudget && property.rent_price >= (userPrefs.minBudget || 0)) score += 15;
          else if (property.rent_price > userPrefs.maxBudget + 5000) score -= 15;
        }

        if (userPrefs.amenities && userPrefs.amenities.length > 0) {
          const matchedCount = userPrefs.amenities.filter((a) =>
            property.amenities.some((pa) => pa.toLowerCase().includes(a.toLowerCase()))
          ).length;
          score += Math.min(12, matchedCount * 3);
        }

        if (userPrefs.workplace) {
          const wpLower = userPrefs.workplace.toLowerCase();
          if (
            property.city.toLowerCase().includes(wpLower) ||
            property.address_line1.toLowerCase().includes(wpLower) ||
            (property.description || "").toLowerCase().includes(wpLower)
          ) score += 10;
        }

        if (userPrefs.lifestyle) score += 5;

        return { ...property, match_score: Math.min(99, Math.max(65, score)) };
      })
      .sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
  },
};
