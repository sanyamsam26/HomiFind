import React from "react";
import {
  Briefcase,
  TrendingUp,
  Building,
  Users,
  DollarSign,
  FileText,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  Property,
  Application,
  Lease,
  MaintenanceTicket,
  Message,
} from "../../types/database";
import { AnalyticsStatCard } from "../analytics-stat-card";
import { PropertyCard } from "../property-card";
import { ApplicationCard } from "../application-card";
import { MessagesView } from "../messages-view";

interface BrokerWorkspaceProps {
  activeNav: string;
  properties: Property[];
  applications: Application[];
  messages: Message[];
  onSendMessage: (text: string) => void;
  onUpdateAppStatus: (appId: string, status: any) => void;
}

export function BrokerWorkspace({
  activeNav,
  properties,
  applications,
  messages,
  onSendMessage,
  onUpdateAppStatus,
}: BrokerWorkspaceProps) {
  return (
    <div className="space-y-6">
      {/* Overview Analytics */}
      {(activeNav === "overview" || !activeNav) && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnalyticsStatCard
              title="Agency Listings"
              value={properties.length}
              change="+4 This Month"
              isPositive={true}
              icon={<Building className="h-5 w-5 text-purple-600" />}
              description="Representing 3 Property Owner Clients"
            />
            <AnalyticsStatCard
              title="Pipeline Commission"
              value="$14,800"
              change="+18%"
              isPositive={true}
              icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
              description="Estimated commission from pending leases"
            />
            <AnalyticsStatCard
              title="Client Applications"
              value={applications.length}
              change="Active"
              isPositive={true}
              icon={<Users className="h-5 w-5 text-indigo-600" />}
              description="Screening in progress"
            />
            <AnalyticsStatCard
              title="Average Close Time"
              value="4.2 Days"
              change="-1.5 Days"
              isPositive={true}
              icon={<TrendingUp className="h-5 w-5 text-teal-600" />}
              description="Faster with AI Property Matcher"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Brokerage Agency Listings
              </h3>
              <p className="text-xs text-slate-500">
                Verified high-value rentals managed under Austin Prime Brokerage
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      )}

      {/* Agency Listings */}
      {activeNav === "listings" && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Agency Listings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      )}

      {/* Deals Pipeline & Client Screening */}
      {(activeNav === "pipeline" || activeNav === "applications") && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Client Screening & Deals Pipeline</h3>
            <p className="text-xs text-slate-500">
              Review applicant documentation before presenting to property owners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                isOwnerOrBrokerView={true}
                onUpdateStatus={onUpdateAppStatus}
              />
            ))}
          </div>
        </div>
      )}

      {/* Client Messages */}
      {activeNav === "messages" && (
        <MessagesView
          messages={messages}
          onSendMessage={onSendMessage}
        />
      )}
    </div>
  );
}
