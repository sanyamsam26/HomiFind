import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { PropertyCard } from "../../components/property-card";
import { OwnerBrokerManager } from "../../components/owner-broker-manager";
import { Button } from "../../components/ui/button";
import { PlusCircle } from "lucide-react";

export function OwnerPropertiesPage() {
  const { properties } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Portfolio Managed Properties ({properties.length})</h3>
          <p className="text-xs text-slate-500">Your properties remain owned by you while selected brokers can represent them.</p>
        </div>
        <Button
          onClick={() => navigate("/owner/properties/new")}
          className="bg-indigo-600 hover:bg-indigo-700 font-bold text-xs rounded-xl text-white cursor-pointer"
        >
          <PlusCircle className="mr-1.5 h-4 w-4" /> Add Property Listing
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      <OwnerBrokerManager properties={properties} />
    </div>
  );
}
