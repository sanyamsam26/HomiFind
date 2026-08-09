import React, { useEffect, useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { PropertyCard } from "../../components/property-card";
import { fetchBrokerAssignments, type BrokerAssignment } from "../../services/backend-api";
import { Loader2, ShieldCheck } from "lucide-react";

export function BrokerListingsPage() {
  const { properties } = useApp();
  const [assignments, setAssignments] = useState<BrokerAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    void fetchBrokerAssignments()
      .then((data) => { if (active) setAssignments(data.filter((item) => item.status === "active")); })
      .catch((error) => console.error("Failed to load broker assignments", error))
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const managedProperties = useMemo(() => {
    const ids = new Set(assignments.map((assignment) => assignment.property_id));
    return properties.filter((property) => ids.has(property.id));
  }, [assignments, properties]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-slate-900">Managed Listings ({managedProperties.length})</h3>
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
        </div>
        <p className="text-xs text-slate-500">Properties assigned to you by their owners. Ownership remains with the owner.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-sm text-slate-500 gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading your assigned listings…
        </div>
      ) : managedProperties.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <h4 className="font-semibold text-slate-900">No assigned properties yet</h4>
          <p className="text-xs text-slate-500 mt-2">When an owner assigns a property to you, it will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
