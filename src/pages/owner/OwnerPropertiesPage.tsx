import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { PropertyCard } from "../../components/property-card";
import { OwnerBrokerManager } from "../../components/owner-broker-manager";
import { Button } from "../../components/ui/button";
import { Loader2, PlusCircle, Building2 } from "lucide-react";

export function OwnerPropertiesPage() {
  const { properties, isLoadingDb } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">My Properties ({properties.length})</h3>
          <p className="text-xs text-slate-500">Your listings are owned by you. Brokers can be assigned separately to manage them.</p>
        </div>
        <Button
          onClick={() => navigate("/owner/properties/new")}
          className="bg-indigo-600 hover:bg-indigo-700 font-bold text-xs rounded-xl text-white cursor-pointer shrink-0"
        >
          <PlusCircle className="mr-1.5 h-4 w-4" /> Add Property Listing
        </Button>
      </div>

      {isLoadingDb ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-14 text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-indigo-600" />
          <p className="mt-4 text-sm font-semibold text-slate-800">Loading your portfolio</p>
          <p className="mt-1 text-xs text-slate-500">Fetching your latest listings securely.</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Building2 className="h-6 w-6" />
          </div>
          <h4 className="mt-4 text-base font-bold text-slate-900">No properties yet</h4>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">Create your first listing and it will appear here as soon as it is saved.</p>
          <Button
            onClick={() => navigate("/owner/properties/new")}
            className="mt-5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Create your first listing
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      <OwnerBrokerManager properties={properties} />
    </div>
  );
}
