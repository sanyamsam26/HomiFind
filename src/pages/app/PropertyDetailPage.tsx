import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { PropertyDetailView } from "../../components/property-detail-view";
import { ScheduleVisitModal } from "../../components/schedule-visit-modal";
import { Dialog } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Property } from "../../types/database";

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, savedPropertyIds, handleToggleSaveProperty, handleApplySubmit } = useApp();

  const [visitProperty, setVisitProperty] = useState<Property | null>(null);
  const [applyProperty, setApplyProperty] = useState<Property | null>(null);

  // Application form state
  const [moveInDate, setMoveInDate] = useState("2026-09-01");
  const [occupants, setOccupants] = useState(2);
  const [income, setIncome] = useState(120000);
  const [employment, setEmployment] = useState("Full-time Employed");

  const property = properties.find((p) => p.id === id) || properties[0];

  if (!property) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Property not found. <button onClick={() => navigate("/app/explore")} className="text-emerald-600 underline">Back to listings</button>
      </div>
    );
  }

  const handleConfirmApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyProperty) {
      handleApplySubmit(applyProperty, { moveInDate, occupants, income, employment });
      setApplyProperty(null);
      navigate("/app/applications");
    }
  };

  return (
    <div>
      {visitProperty && (
        <ScheduleVisitModal
          isOpen={!!visitProperty}
          onClose={() => setVisitProperty(null)}
          property={visitProperty}
          onConfirmVisit={() => setVisitProperty(null)}
        />
      )}

      {/* Apply Modal */}
      {applyProperty && (
        <Dialog
          isOpen={!!applyProperty}
          onClose={() => setApplyProperty(null)}
          title={`Digital Rental Application: ${applyProperty.title}`}
          description="Submit pre-verified credentials directly to property management."
          maxWidth="md"
        >
          <form onSubmit={handleConfirmApply} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Move-In Date</label>
                <Input
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Occupants Count</label>
                <Input
                  type="number"
                  min={1}
                  value={occupants}
                  onChange={(e) => setOccupants(Number(e.target.value))}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Annual Household Income ($)</label>
                <Input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Employment Status</label>
                <Input
                  type="text"
                  value={employment}
                  onChange={(e) => setEmployment(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => setApplyProperty(null)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
                Submit Application
              </Button>
            </div>
          </form>
        </Dialog>
      )}

      <PropertyDetailView
        property={property}
        onClose={() => navigate("/app/explore")}
        onBookVisit={(p) => setVisitProperty(p)}
        onChatOwner={() => navigate("/app/messages")}
        onApply={(p) => setApplyProperty(p)}
        onToggleSave={handleToggleSaveProperty}
        isSaved={savedPropertyIds.includes(property.id)}
        onCompare={() => navigate("/app/compare")}
      />
    </div>
  );
}
