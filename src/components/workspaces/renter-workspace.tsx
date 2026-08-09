import React, { useState } from "react";
import {
  Sparkles,
  Heart,
  FileText,
  Wrench,
  Building,
  PlusCircle,
  CheckCircle2,
  Filter,
  Columns,
} from "lucide-react";
import {
  Property,
  Application,
  Lease,
  MaintenanceTicket,
  Message,
} from "../../types/database";
import { AISearchBar } from "../ai-search-bar";
import { PropertyCard } from "../property-card";
import { ApplicationCard } from "../application-card";
import { LeaseViewer } from "../lease-viewer";
import { MaintenanceTicketCard } from "../maintenance-ticket-card";
import { MessagesView } from "../messages-view";
import { PropertyDetailView } from "../property-detail-view";
import { ScheduleVisitModal } from "../schedule-visit-modal";
import { PropertyComparisonView } from "../property-comparison-view";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";

interface RenterWorkspaceProps {
  activeNav: string;
  properties: Property[];
  savedPropertyIds: string[];
  onToggleSave: (id: string) => void;
  applications: Application[];
  leases: Lease[];
  maintenanceTickets: MaintenanceTicket[];
  messages: Message[];
  onSendMessage: (text: string) => void;
  onApplySubmit: (property: Property, formData: any) => void;
  onCreateMaintenance: (ticketData: any) => void;
}

export function RenterWorkspace({
  activeNav,
  properties,
  savedPropertyIds,
  onToggleSave,
  applications,
  leases,
  maintenanceTickets,
  messages,
  onSendMessage,
  onApplySubmit,
  onCreateMaintenance,
}: RenterWorkspaceProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [applyModalProperty, setApplyModalProperty] = useState<Property | null>(null);
  const [visitProperty, setVisitProperty] = useState<Property | null>(null);
  const [compareProperty, setCompareProperty] = useState<Property | null>(null);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [isSearching, setIsSearching] = useState(false);

  // Apply Form state
  const [income, setIncome] = useState("125000");
  const [moveInDate, setMoveInDate] = useState("2026-09-01");
  const [occupants, setOccupants] = useState("2");
  const [employment, setEmployment] = useState("Software Engineer");

  // Maintenance Form state
  const [maintTitle, setMaintTitle] = useState("");
  const [maintDesc, setMaintDesc] = useState("");
  const [maintPriority, setMaintPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");

  const handleSearch = (filters: {
    query: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    city?: string;
    propertyType?: any;
  }) => {
    setIsSearching(true);
    setTimeout(() => {
      let result = [...properties];
      if (filters.query) {
        const q = filters.query.toLowerCase();
        result = result.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q) ||
            p.amenities.some((a) => a.toLowerCase().includes(q))
        );
      }
      if (filters.minPrice) {
        result = result.filter((p) => p.rent_price >= filters.minPrice!);
      }
      if (filters.maxPrice) {
        result = result.filter((p) => p.rent_price <= filters.maxPrice!);
      }
      if (filters.bedrooms) {
        result = result.filter((p) => p.bedrooms >= filters.bedrooms!);
      }
      if (filters.city) {
        result = result.filter((p) =>
          p.city.toLowerCase().includes(filters.city!.toLowerCase())
        );
      }
      setFilteredProperties(result);
      setIsSearching(false);
    }, 300);
  };

  const handleApplyFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModalProperty) return;
    onApplySubmit(applyModalProperty, {
      income: parseFloat(income),
      moveInDate,
      occupants: parseInt(occupants, 10),
      employment,
    });
    setApplyModalProperty(null);
  };

  const handleMaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateMaintenance({
      title: maintTitle,
      description: maintDesc,
      priority: maintPriority,
      property_id: properties[0]?.id || "prop-1",
    });
    setMaintTitle("");
    setMaintDesc("");
    setIsMaintenanceModalOpen(false);
  };

  // Render full property detail view if selected
  if (selectedProperty) {
    return (
      <PropertyDetailView
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onBookVisit={(p) => setVisitProperty(p)}
        onChatOwner={() => {
          setSelectedProperty(null);
        }}
        onApply={(p) => setApplyModalProperty(p)}
        onToggleSave={onToggleSave}
        isSaved={savedPropertyIds.includes(selectedProperty.id)}
        onCompare={(p) => setCompareProperty(p)}
      />
    );
  }

  // Render property comparison view if comparing or on compare tab
  if (compareProperty || activeNav === "compare") {
    return (
      <PropertyComparisonView
        propertyA={compareProperty || properties[0]}
        propertyB={properties[1]}
        onClose={() => setCompareProperty(null)}
        onSelectWinner={(p) => {
          setSelectedProperty(p);
          setCompareProperty(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Schedule Visit Modal */}
      {visitProperty && (
        <ScheduleVisitModal
          isOpen={!!visitProperty}
          onClose={() => setVisitProperty(null)}
          property={visitProperty}
          onConfirmVisit={(data) => {
            console.log("Visit confirmed:", data);
          }}
        />
      )}
      {/* 1. EXPLORE & AI MATCH TAB */}
      {(activeNav === "explore" || !activeNav) && (
        <div className="space-y-6">
          <AISearchBar onSearch={handleSearch} isLoading={isSearching} />

          <div className="flex items-center justify-between pt-2">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                AI Matched Rental Properties
              </h3>
              <p className="text-xs text-slate-500">
                Showing {filteredProperties.length} homes matching your preference profile
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isSaved={savedPropertyIds.includes(property.id)}
                onSaveToggle={onToggleSave}
                onSelect={(p) => setSelectedProperty(p)}
                onApply={(p) => setApplyModalProperty(p)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. SAVED PROPERTIES TAB */}
      {activeNav === "saved" && (
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 font-bold border border-rose-100">
              <Heart className="h-5 w-5 fill-rose-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Saved Favorites</h3>
              <p className="text-xs text-slate-500">
                {savedPropertyIds.length} properties saved to your wishlist
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties
              .filter((p) => savedPropertyIds.includes(p.id))
              .map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isSaved={true}
                  onSaveToggle={onToggleSave}
                  onSelect={(p) => setSelectedProperty(p)}
                  onApply={(p) => setApplyModalProperty(p)}
                />
              ))}
          </div>
        </div>
      )}

      {/* 3. MY APPLICATIONS TAB */}
      {activeNav === "applications" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">My Rental Applications</h3>
                <p className="text-xs text-slate-500">
                  Track landlord decision status, credit checks, and lease offers
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        </div>
      )}

      {/* 4. ACTIVE LEASE TAB */}
      {activeNav === "lease" && (
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold border border-teal-100">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Active Lease Contract</h3>
              <p className="text-xs text-slate-500">
                Legally binding residential lease and digital signature records
              </p>
            </div>
          </div>

          {leases.length > 0 ? (
            <LeaseViewer lease={leases[0]} currentUserRole="renter" />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              <p className="text-sm font-semibold">No active lease found.</p>
              <p className="text-xs mt-1">Submit an application to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* 5. MAINTENANCE TAB */}
      {activeNav === "maintenance" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 font-bold border border-amber-100">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Maintenance & Repairs</h3>
                <p className="text-xs text-slate-500">
                  Report issue details and monitor vendor dispatch
                </p>
              </div>
            </div>

            <Button
              onClick={() => setIsMaintenanceModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs rounded-xl"
            >
              <PlusCircle className="mr-1.5 h-4 w-4" /> Report Issue
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {maintenanceTickets.map((ticket) => (
              <MaintenanceTicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </div>
      )}

      {/* 6. DIRECT MESSAGES TAB */}
      {activeNav === "messages" && (
        <MessagesView
          messages={messages}
          onSendMessage={onSendMessage}
          onBookVisit={() => {
            if (properties[0]) setVisitProperty(properties[0]);
          }}
          onCompare={() => {
            if (properties[0]) setCompareProperty(properties[0]);
          }}
        />
      )}

      {/* MODAL: Apply Now */}
      <Dialog
        isOpen={!!applyModalProperty}
        onClose={() => setApplyModalProperty(null)}
        title="Submit Rental Application"
        description={applyModalProperty ? `Applying for ${applyModalProperty.title}` : ""}
      >
        <form onSubmit={handleApplyFormSubmit} className="space-y-4">
          <div className="rounded-xl bg-emerald-50/50 p-3.5 border border-emerald-100 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">
                {applyModalProperty?.title}
              </span>
              <span className="text-slate-500">
                Rent: ${applyModalProperty?.rent_price}/mo
              </span>
            </div>
            <span className="font-bold text-emerald-700">Instant AI Check</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Annual Income ($)</label>
              <Input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Proposed Move-In</label>
              <Input
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Total Occupants</label>
              <Input
                type="number"
                value={occupants}
                onChange={(e) => setOccupants(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Employment / Role</label>
              <Input
                type="text"
                value={employment}
                onChange={(e) => setEmployment(e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setApplyModalProperty(null)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 font-bold">
              Confirm & Submit
            </Button>
          </div>
        </form>
      </Dialog>

      {/* MODAL: Report Maintenance */}
      <Dialog
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        title="Report Maintenance Issue"
        description="Submit repair requests to your property manager"
      >
        <form onSubmit={handleMaintSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Issue Title</label>
            <Input
              placeholder="e.g. Garbage disposal jammed, AC leaking"
              value={maintTitle}
              onChange={(e) => setMaintTitle(e.target.value)}
              className="mt-1"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Priority Level</label>
            <select
              value={maintPriority}
              onChange={(e) => setMaintPriority(e.target.value as any)}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent / Emergency</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Description</label>
            <textarea
              rows={3}
              placeholder="Provide specific details about the issue..."
              value={maintDesc}
              onChange={(e) => setMaintDesc(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs"
              required
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsMaintenanceModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 font-bold">
              Submit Ticket
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
