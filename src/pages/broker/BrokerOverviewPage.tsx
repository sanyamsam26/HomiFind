import React from "react";
import { useApp } from "../../context/AppContext";
import { AnalyticsStatCard } from "../../components/analytics-stat-card";
import { PropertyCard } from "../../components/property-card";
import { ApplicationCard } from "../../components/application-card";
import { DollarSign, Briefcase, FileText, UserCheck } from "lucide-react";

export function BrokerOverviewPage() {
  const { properties, applications } = useApp();

  return (
    <div className="space-y-6">
      {/* Analytics Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsStatCard
          title="Active Deal Commission"
          value="$18,200"
          change="+18.5%"
          isPositive={true}
          icon={<DollarSign className="h-5 w-5 text-purple-600" />}
          description="4 Deals in closing stage"
        />
        <AnalyticsStatCard
          title="Represented Listings"
          value={properties.length}
          change="+3"
          isPositive={true}
          icon={<Briefcase className="h-5 w-5 text-indigo-600" />}
          description="Broker Exclusive Inventory"
        />
        <AnalyticsStatCard
          title="Client Submissions"
          value={applications.length}
          change="High Interest"
          isPositive={true}
          icon={<FileText className="h-5 w-5 text-emerald-600" />}
          description="Pre-qualified Tenant Leads"
        />
        <AnalyticsStatCard
          title="Verified Broker Rating"
          value="4.9 / 5"
          isPositive={true}
          icon={<UserCheck className="h-5 w-5 text-amber-600" />}
          description="Top 5% Agent Badge"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Brokerage Property Inventory</h3>
          <p className="text-xs text-slate-500">Co-broke listings available for tenant placement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
