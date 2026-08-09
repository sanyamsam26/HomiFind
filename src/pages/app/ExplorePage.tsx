import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { AISearchBar } from "../../components/ai-search-bar";
import { PropertyCard } from "../../components/property-card";
import { ScheduleVisitModal } from "../../components/schedule-visit-modal";
import { Property } from "../../types/database";
import { fetchRecommendations, extractRenterIntent, recordAIFeedback } from "../../services/backend-api";
import { Sparkles, SlidersHorizontal } from "lucide-react";

export function ExplorePage() {
  const { properties, userPreferences, savedPropertyIds, handleToggleSaveProperty } = useApp();
  const navigate = useNavigate();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [isSearching, setIsSearching] = useState(false);
  const [visitProperty, setVisitProperty] = useState<Property | null>(null);

  useEffect(() => {
    let active = true;
    setFilteredProperties(properties);
    if (!userPreferences) return () => { active = false; };
    void fetchRecommendations(12).then((recommendations) => {
      if (!active || recommendations.length === 0) return;
      const ranked: Property[] = recommendations.map((result) => {
        const base = properties.find((property) => property.id === result.property.id);
        return base ? { ...base, match_score: result.matchScore } : null;
      }).filter((property): property is Property => property !== null);
      if (ranked.length) {
        const rankedIds = new Set(ranked.map((p) => p.id));
        setFilteredProperties([...ranked, ...properties.filter((p) => !rankedIds.has(p.id))]);
        ranked.forEach((property) => void recordAIFeedback(property.id, "impression", { matchScore: property.match_score }));
      }
    }).catch(() => undefined);
    return () => { active = false; };
  }, [properties, userPreferences]);

  const handleAISearch = async (filters: { query: string; minPrice?: number; maxPrice?: number; bedrooms?: number; city?: string }) => {
    setIsSearching(true);
    try {
      const intentResponse = await extractRenterIntent(filters.query);
      const intent = intentResponse?.intent || {};
      const normalized = {
        ...intent,
        minBudget: filters.minPrice ?? intent.minBudget,
        maxBudget: filters.maxPrice ?? intent.maxBudget,
        bedrooms: filters.bedrooms ?? intent.bedrooms,
        location: filters.city ?? intent.location,
      };
      const local = properties.filter((p) => {
        if (normalized.maxBudget && p.rent_price > normalized.maxBudget) return false;
        if (normalized.minBudget && p.rent_price < normalized.minBudget) return false;
        if (normalized.bedrooms && p.bedrooms < normalized.bedrooms) return false;
        if (normalized.location && !p.city.toLowerCase().includes(String(normalized.location).toLowerCase())) return false;
        return p.status === "available";
      });
      setFilteredProperties(local.length ? local : properties);
      void recordAIFeedback(null, "view", { searchQuery: filters.query, extractedIntent: normalized });
    } catch {
      const lower = filters.query.toLowerCase();
      setFilteredProperties(properties.filter((p) => p.title.toLowerCase().includes(lower) || p.city.toLowerCase().includes(lower) || (p.description || "").toLowerCase().includes(lower)));
    } finally { setIsSearching(false); }
  };

  const handleSave = (property: Property) => {
    handleToggleSaveProperty(property.id);
    void recordAIFeedback(property.id, savedPropertyIds.includes(property.id) ? "unsave" : "save", { matchScore: property.match_score });
  };

  return (
    <div className="space-y-6">
      {visitProperty && <ScheduleVisitModal isOpen={!!visitProperty} onClose={() => setVisitProperty(null)} property={visitProperty} onConfirmVisit={(data) => console.log("Visit confirmed:", data)} />}
      {userPreferences && (
        <div className="bg-[#1b206b] text-white p-4.5 rounded-2xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border border-indigo-900">
          <div className="flex items-center space-x-3.5"><div className="p-2.5 rounded-xl bg-indigo-500/20 text-amber-300 border border-indigo-400/20 shrink-0"><Sparkles className="h-5 w-5" /></div><div><div className="text-xs font-bold">AI Search Active: {userPreferences.profileType || "Working Professional"}</div><p className="text-[11px] text-indigo-200 mt-1 font-medium">Workplace: <strong>{userPreferences.workplace || "Not specified"}</strong> ({userPreferences.travelMode || "Flexible"}) • Budget: <strong>₹{(userPreferences.minBudget || 0).toLocaleString()} - ₹{(userPreferences.maxBudget || 0).toLocaleString()}</strong> • Vibe: <strong>{userPreferences.lifestyle || "Personalized"}</strong></p></div></div>
          <button onClick={() => navigate("/app/onboarding?force=true")} className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-white transition-all shrink-0 cursor-pointer flex items-center space-x-1.5"><SlidersHorizontal className="h-3.5 w-3.5" /><span>Edit AI Persona</span></button>
        </div>
      )}
      <AISearchBar onSearch={handleAISearch} />
      <div className="flex items-center justify-between pt-2"><div><h3 className="text-xl font-bold text-slate-900">Recommended AI Property Matches</h3><p className="text-xs text-slate-500">Showing {filteredProperties.length} dynamically ranked listings{isSearching ? " • Understanding your request…" : ""}</p></div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => <div key={property.id} onClick={() => void recordAIFeedback(property.id, "view", { matchScore: property.match_score })}><PropertyCard property={property} isSaved={savedPropertyIds.includes(property.id)} onSaveToggle={() => handleSave(property)} onSelect={() => navigate(`/app/properties/${property.id}`)} /></div>)}
      </div>
    </div>
  );
}
