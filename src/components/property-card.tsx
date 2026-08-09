import React, { useState } from "react";
import {
  Heart,
  Sparkles,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Dog,
  Check,
  ChevronRight,
  Eye,
  Building,
} from "lucide-react";
import { Property } from "../types/database";
import { formatCurrency } from "../lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export interface PropertyCardProps {
  key?: React.Key;
  property: Property;
  onSelect?: (property: Property) => void;
  onSaveToggle?: (propertyId: string) => void;
  isSaved?: boolean;
  onApply?: (property: Property) => void;
}

export function PropertyCard({
  property,
  onSelect,
  onSaveToggle,
  isSaved = false,
  onApply,
}: PropertyCardProps) {
  const [saved, setSaved] = useState(isSaved);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    if (onSaveToggle) onSaveToggle(property.id);
  };

  const defaultImage =
    property.primary_image_url ||
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80";

  return (
    <div
      onClick={() => onSelect && onSelect(property)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
    >
      {/* Image Container with Badges */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <img
          src={defaultImage}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20" />

        {/* Top Header Controls */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Badge
              variant={property.status === "available" ? "default" : "secondary"}
              className="backdrop-blur-md bg-white/95 shadow-xs"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
              {property.property_type.toUpperCase()}
            </Badge>

            {property.is_pet_friendly && (
              <Badge variant="secondary" className="backdrop-blur-md bg-white/95 text-slate-700 shadow-xs">
                <Dog className="h-3 w-3 mr-1 text-emerald-600" /> Pets Allowed
              </Badge>
            )}
          </div>

          <button
            onClick={handleSaveClick}
            className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer ${
              saved
                ? "bg-rose-500 text-white shadow-md scale-110"
                : "bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500 shadow-xs"
            }`}
            title={saved ? "Saved" : "Save Property"}
          >
            <Heart className={`h-4 w-4 ${saved ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Bottom Image Info: AI Match Badge & Price */}
        <div className="absolute bottom-3 inset-x-3 flex items-end justify-between">
          <div>
            <span className="text-2xl font-black text-white drop-shadow-md">
              {formatCurrency(property.rent_price)}
              <span className="text-xs font-normal text-slate-200">/mo</span>
            </span>
          </div>

          {property.match_score !== undefined && (
            <div className="flex items-center space-x-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 px-2.5 py-1 text-xs font-bold text-white shadow-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{property.match_score}% Match</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content Details */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        <div>
          <div className="flex items-center space-x-1 text-xs font-medium text-slate-500 mb-1">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            <span>
              {property.city}, {property.state}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
            {property.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2">
            {property.description || "Spacious luxury rental home in prime location."}
          </p>
        </div>

        {/* Specifications Bar */}
        <div className="grid grid-cols-3 gap-2 border-y border-slate-100 py-3 text-xs text-slate-600 font-medium">
          <div className="flex items-center space-x-1.5">
            <Bed className="h-4 w-4 text-emerald-600" />
            <span>{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Bath className="h-4 w-4 text-emerald-600" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Maximize2 className="h-4 w-4 text-emerald-600" />
            <span>{property.square_feet || 1200} sqft</span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-400 font-medium">
            Deposit: {formatCurrency(property.deposit_amount || property.rent_price)}
          </span>
          <div className="flex items-center space-x-2">
            {onApply && (
              <Button
                size="sm"
                variant="default"
                onClick={(e) => {
                  e.stopPropagation();
                  onApply(property);
                }}
                className="rounded-lg text-xs font-bold"
              >
                Apply Now
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelect) onSelect(property);
              }}
              className="rounded-lg p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
