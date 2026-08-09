import { Property } from "../../types/database";

export interface TenantPreferences {
  maxBudget: number;
  bedrooms: string;
  commuteRule: string;
  petFriendly: boolean;
}

export const matchingService = {
  calculateMatchScore(property: Property, prefs: TenantPreferences): number {
    let score = 80;
    if (property.rent_price <= prefs.maxBudget) score += 10;
    if (property.is_pet_friendly === prefs.petFriendly) score += 5;
    if (property.featured) score += 5;
    return Math.min(99, score);
  },

  async rankPropertiesForRenter(properties: Property[], prefs: TenantPreferences) {
    return properties.map((prop) => ({
      ...prop,
      match_score: this.calculateMatchScore(prop, prefs),
    })).sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
  }
};
