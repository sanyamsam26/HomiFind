import React, { useState } from "react";
import {
  DollarSign,
  Building,
  Users,
  Wrench,
  PlusCircle,
  TrendingUp,
  FileText,
  MessageSquare,
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
import { LeaseViewer } from "../lease-viewer";
import { MaintenanceTicketCard } from "../maintenance-ticket-card";
import { MessagesView } from "../messages-view";
import { PropertyUploadWizard } from "../property-upload-wizard";
import { OwnerDashboard } from "../owner-dashboard";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";

interface OwnerWorkspaceProps {
  activeNav: string;
  properties: Property[];
  applications: Application[];
  leases: Lease[];
  maintenanceTickets: MaintenanceTicket[];
  messages: Message[];
  onSendMessage: (text: string) => void;
  onCreateProperty: (propertyData: Partial<Property>) => void;
  onUpdateAppStatus: (appId: string, status: any) => void;
  onUpdateTicketStatus: (ticketId: string, status: any) => void;
}

export function OwnerWorkspace({
  activeNav,
  properties,
  applications,
  leases,
  maintenanceTickets,
  messages,
  onSendMessage,
  onCreateProperty,
  onUpdateAppStatus,
  onUpdateTicketStatus,
}: OwnerWorkspaceProps) {
  const [isNewPropertyOpen, setIsNewPropertyOpen] = useState(false);
  const [isUploadWizardOpen, setIsUploadWizardOpen] = useState(false);

  // New property form state
  const [title, setTitle] = useState("");
  const [rentPrice, setRentPrice] = useState("3200");
  const [beds, setBeds] = useState("2");
  const [baths, setBaths] = useState("2");
  const [city, setCity] = useState("Austin");
  const [state, setState] = useState("TX");
  const [address, setAddress] = useState("400 Congress Ave");
  const [propType, setPropType] = useState("apartment");
  const [description, setDescription] = useState("");

  const handleCreatePropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateProperty({
      title,
      rent_price: parseFloat(rentPrice),
      bedrooms: parseInt(beds, 10),
      bathrooms: parseFloat(baths),
      city,
      state,
      address_line1: address,
      property_type: propType as any,
      description,
      status: "available",
      deposit_amount: parseFloat(rentPrice),
      utilities_included: true,
      is_pet_friendly: true,
      is_furnished: false,
      amenities: ["Gym", "Parking", "Elevator"],
      view_count: 1,
      match_score: 95,
      primary_image_url:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    });
    setIsNewPropertyOpen(false);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="space-y-6">
      {/* Property Upload Wizard Modal */}
      {isUploadWizardOpen && (
        <PropertyUploadWizard
          isOpen={isUploadWizardOpen}
          onClose={() => setIsUploadWizardOpen(false)}
          onPublish={(newProp) => {
            onCreateProperty(newProp);
          }}
          onGoToDashboard={() => {
            setIsUploadWizardOpen(false);
          }}
        />
      )}

      {/* 1. PORTFOLIO DASHBOARD / OVERVIEW */}
      {(activeNav === "dashboard" || !activeNav) && (
        <OwnerDashboard
          properties={properties}
          applications={applications}
          onOpenUploadWizard={() => setIsUploadWizardOpen(true)}
        />
      )}

      {/* 2. PROPERTIES TAB */}
      {activeNav === "properties" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Portfolio Properties</h3>
            <Button
              onClick={() => setIsNewPropertyOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs rounded-xl"
            >
              <PlusCircle className="mr-1.5 h-4 w-4" /> Add Property Listing
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      )}

      {/* 3. TENANT APPLICATIONS TAB */}
      {activeNav === "applications" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Tenant Screening & Applications
              </h3>
              <p className="text-xs text-slate-500">
                Review verified income, employment, and background checks
              </p>
            </div>
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

      {/* 4. MAINTENANCE TAB */}
      {activeNav === "maintenance" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Property Maintenance Requests
            </h3>
            <p className="text-xs text-slate-500">
              Manage work orders and dispatch assigned technicians
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {maintenanceTickets.map((ticket) => (
              <MaintenanceTicketCard
                key={ticket.id}
                ticket={ticket}
                isManager={true}
                onUpdateStatus={onUpdateTicketStatus}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. FINANCES TAB */}
      {activeNav === "finances" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Rental Income Ledger</h3>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800 block">
                    Penthouse B - Skyline Tower
                  </span>
                  <span className="text-slate-400">Paid by Alex Rivera • Sep 2026</span>
                </div>
                <span className="font-bold text-emerald-600 text-sm">$3,450.00</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800 block">
                    Oak Creek Modern Villa
                  </span>
                  <span className="text-slate-400">Paid by Elena Rostova • Sep 2026</span>
                </div>
                <span className="font-bold text-emerald-600 text-sm">$4,200.00</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TENANT CHAT TAB */}
      {activeNav === "messages" && (
        <MessagesView
          messages={messages}
          onSendMessage={onSendMessage}
        />
      )}

      {/* MODAL: Create New Property */}
      <Dialog
        isOpen={isNewPropertyOpen}
        onClose={() => setIsNewPropertyOpen(false)}
        title="Create New Property Listing"
        description="Add a rental property to HomiFind database"
      >
        <form onSubmit={handleCreatePropertySubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Listing Title</label>
            <Input
              placeholder="e.g. Modern Lakefront Condo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Rent Price ($/mo)</label>
              <Input
                type="number"
                value={rentPrice}
                onChange={(e) => setRentPrice(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Property Type</label>
              <select
                value={propType}
                onChange={(e) => setPropType(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Bedrooms</label>
              <Input
                type="number"
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Bathrooms</label>
              <Input
                type="number"
                value={baths}
                onChange={(e) => setBaths(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">City</label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Description</label>
            <textarea
              rows={3}
              placeholder="Describe property features, views, amenities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsNewPropertyOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 font-bold">
              Publish Listing
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
