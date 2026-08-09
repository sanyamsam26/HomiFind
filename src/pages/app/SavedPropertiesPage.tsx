import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { PropertyCard } from "../../components/property-card";
import { Heart, Search } from "lucide-react";
import { Button } from "../../components/ui/button";

export function SavedPropertiesPage() {
  const { properties, savedPropertyIds, handleToggleSaveProperty } = useApp();
  const navigate = useNavigate();

  const savedListings = properties.filter((p) => savedPropertyIds.includes(p.id));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Saved Wishlist ({savedListings.length})</h3>
        <p className="text-xs text-slate-500">Your favorite AI matched properties saved for quick review</p>
      </div>

      {savedListings.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <Heart className="h-10 w-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">No saved listings yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any property card while exploring to save it to your personal wishlist.
          </p>
          <Button
            onClick={() => navigate("/app/explore")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
          >
            <Search className="h-4 w-4 mr-1.5" /> Explore Properties
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedListings.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isSaved={true}
              onSaveToggle={() => handleToggleSaveProperty(property.id)}
              onSelect={() => navigate(`/app/properties/${property.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
