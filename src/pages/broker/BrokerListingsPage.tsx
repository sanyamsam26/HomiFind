import React from "react";
import { useApp } from "../../context/AppContext";
import { PropertyCard } from "../../components/property-card";

export function BrokerListingsPage() {
  const { properties } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Agent Represented Listings ({properties.length})</h3>
        <p className="text-xs text-slate-500">Syndicated across HomiFind broker network</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
