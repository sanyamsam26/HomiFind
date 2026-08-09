import { supabase } from "../../lib/supabase";
import { Property } from "../../types/database";

export const propertyService = {
  async getAllProperties(): Promise<Property[]> {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return [];
    return data.map((item: any) => ({
      id: item.id,
      owner_id: item.owner_id || "owner-1",
      broker_id: item.broker_id,
      title: item.title,
      description: item.description,
      property_type: item.property_type || "apartment",
      status: item.status || "available",
      rent_price: Number(item.rent_price) || 2800,
      deposit_amount: Number(item.deposit_amount) || 2800,
      utilities_included: item.utilities_included ?? true,
      bedrooms: item.bedrooms || 2,
      bathrooms: item.bathrooms || 2,
      square_feet: item.square_feet || 1100,
      is_pet_friendly: item.is_pet_friendly ?? true,
      is_furnished: item.is_furnished ?? false,
      amenities: item.amenities || ["Gym", "Parking"],
      address_line1: item.address_line1 || "100 Main St",
      city: item.city || "Austin",
      state: item.state || "TX",
      zip_code: item.zip_code || "78701",
      country: item.country || "USA",
      featured: item.featured ?? true,
      view_count: item.view_count || 100,
      match_score: 96,
      primary_image_url:
        item.primary_image_url ||
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
    }));
  },

  async createProperty(property: Partial<Property>) {
    return await supabase.from("properties").insert([property]).select().single();
  }
};
