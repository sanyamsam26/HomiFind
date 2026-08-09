import React, { useState } from "react";
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  DollarSign,
  Bed,
  MapPin,
  Home,
  X,
  Filter,
} from "lucide-react";
import { PropertyType } from "../types/database";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface AISearchBarProps {
  onSearch: (filters: {
    query: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    city?: string;
    propertyType?: PropertyType;
  }) => void;
  isLoading?: boolean;
}

export function AISearchBar({ onSearch, isLoading }: AISearchBarProps) {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      query,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms, 10) : undefined,
      city: city ? city : undefined,
      propertyType: propertyType ? (propertyType as PropertyType) : undefined,
    });
  };

  const handleReset = () => {
    setQuery("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setCity("");
    setPropertyType("");
    onSearch({ query: "" });
  };

  const samplePrompts = [
    "Modern 2-bedroom pet friendly apartment under $3,000 near downtown with parking",
    "Luxury condo in Miami with ocean view and swimming pool",
    "Cozy 3-bedroom house in Austin with backyard for dogs",
  ];

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-4 shadow-md sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              AI Natural Language Property Search
            </h2>
            <p className="text-xs text-slate-500">
              Describe your ideal rental or preferences in plain language
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="rounded-lg text-xs"
        >
          <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
          <span>Filters</span>
          {(minPrice || maxPrice || bedrooms || city || propertyType) && (
            <span className="ml-1.5 h-2 w-2 rounded-full bg-emerald-500" />
          )}
        </Button>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 'Pet friendly 2 bed apartment in Austin under $2,800 with balcony & gym'"
            icon={<Search className="h-4 w-4 text-emerald-600" />}
            className="flex-1 h-12 text-sm rounded-xl border-slate-300"
          />

          <div className="flex space-x-2">
            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="rounded-xl px-6 bg-emerald-600 hover:bg-emerald-700 font-bold"
            >
              <Sparkles className="mr-2 h-4 w-4" /> Match Properties
            </Button>

            {(query || minPrice || maxPrice || bedrooms || city || propertyType) && (
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={handleReset}
                className="rounded-xl"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Sample Prompt Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">
            Try searching:
          </span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(prompt);
                onSearch({ query: prompt });
              }}
              className="rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 px-2.5 py-1 text-xs text-slate-600 transition-colors cursor-pointer border border-slate-200/60"
            >
              "{prompt.substring(0, 42)}..."
            </button>
          ))}
        </div>

        {/* Advanced Filters Expandable Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 animate-in fade-in duration-200">
            <div>
              <label className="text-xs font-semibold text-slate-600">
                Min Rent ($)
              </label>
              <Input
                type="number"
                placeholder="1000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                icon={<DollarSign className="h-3.5 w-3.5" />}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">
                Max Rent ($)
              </label>
              <Input
                type="number"
                placeholder="4000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                icon={<DollarSign className="h-3.5 w-3.5" />}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">
                Min Bedrooms
              </label>
              <Input
                type="number"
                placeholder="2"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                icon={<Bed className="h-3.5 w-3.5" />}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">City</label>
              <Input
                type="text"
                placeholder="Austin"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                icon={<MapPin className="h-3.5 w-3.5" />}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="mt-1 flex h-9 w-full rounded-lg border border-slate-300 bg-white px-2 text-xs text-slate-800"
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="studio">Studio</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
