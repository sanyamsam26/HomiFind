import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { AISearchBar } from "../../components/ai-search-bar";
import { PropertyCard } from "../../components/property-card";
import { ScheduleVisitModal } from "../../components/schedule-visit-modal";
import { Property } from "../../types/database";
import { Sparkles, SlidersHorizontal, MapPin } from "lucide-react";

export function ExplorePage() {
  const { properties, userPreferences, savedPropertyIds, handleToggleSaveProperty } = useApp();
  const navigate = useNavigate();

  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [isSearching, setIsSearching] = useState(false);
  const [visitProperty, setVisitProperty] = useState<Property | null>(null);

  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  const handleAISearch = (filters: { query: string; minPrice?: number; maxPrice?: number; bedrooms?: number; city?: string }) => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      const lower = (filters.query || "").toLowerCase();
      const results = properties.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.city.toLowerCase().includes(lower) ||
          (p.description || "").toLowerCase().includes(lower) ||
          p.amenities.some((a) => a.toLowerCase().includes(lower))
      );
      setFilteredProperties(results.length > 0 ? results : properties);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Schedule Visit Modal */}
      {visitProperty && (
        <ScheduleVisitModal
          isOpen={!!visitProperty}
          onClose={() => setVisitProperty(null)}
          property={visitProperty}
          onConfirmVisit={(data) => {
            console.log("Visit confirmed:", data);
          }}
        />
      )}

      {/* Active AI Search Persona Banner */}
      {userPreferences && (
        <div className="bg-[#1b206b] text-white p-4.5 rounded-2xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border border-indigo-900">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-amber-300 border border-indigo-400/20 shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center space-x-2">
                <span>AI Search Active: {userPreferences.profileType || "Working Professional"}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wide border border-emerald-400/30">
                  Database Synced
                </span>
              </div>
              <p className="text-[11px] text-indigo-200 mt-1 font-medium">
                Workplace: <strong>{userPreferences.workplace || "Cyber Hub"}</strong> ({userPreferences.travelMode || "Metro"}) &bull; Budget: <strong>₹{(userPreferences.minBudget || 12000).toLocaleString()} - ₹{(userPreferences.maxBudget || 18000).toLocaleString()}</strong> &bull; Vibe: <strong>{userPreferences.lifestyle || "Urban Pulse"}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/onboarding?force=true")}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-white transition-all shrink-0 cursor-pointer flex items-center space-x-1.5"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Edit AI Persona</span>
          </button>
        </div>
      )}

      {/* AI Search Header */}
      <AISearchBar onSearch={handleAISearch} />

      {/* Active Listings Grid */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Recommended AI Property Matches</h3>
          <p className="text-xs text-slate-500">
            Showing {filteredProperties.length} verified listings tailored dynamically to your preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isSaved={savedPropertyIds.includes(property.id)}
            onSaveToggle={() => handleToggleSaveProperty(property.id)}
            onSelect={() => navigate(`/app/properties/${property.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
