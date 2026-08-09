import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { dbService, VisitRecord } from "../../services/api";
import { Calendar, Clock, MapPin, Video, UserCheck, CheckCircle2, ArrowRight, Building } from "lucide-react";

export function VisitsPage() {
  const { currentUser, properties, triggerToast } = useApp();
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadVisits() {
      if (!currentUser?.id) return;
      setIsLoading(true);
      const data = await dbService.fetchVisits(currentUser.id);
      if (data && data.length > 0) {
        setVisits(data);
      } else {
        // Fallback mockup visits if DB is empty
        setVisits([
          {
            id: "visit-1",
            property_id: properties[0]?.id || "prop-1",
            renter_id: currentUser.id,
            host_id: "owner-1",
            visit_type: "in_person",
            scheduled_start: new Date(Date.now() + 86400000).toISOString(),
            scheduled_end: new Date(Date.now() + 90000000).toISOString(),
            status: "confirmed",
            notes: "Host Sarah Jenkins will meet you at the lobby.",
            property: properties[0],
          },
          {
            id: "visit-2",
            property_id: properties[1]?.id || "prop-2",
            renter_id: currentUser.id,
            host_id: "owner-2",
            visit_type: "virtual_tour",
            scheduled_start: new Date(Date.now() + 172800000).toISOString(),
            scheduled_end: new Date(Date.now() + 176400000).toISOString(),
            status: "requested",
            notes: "Virtual video link will be sent 15 mins prior.",
            property: properties[1],
          },
        ]);
      }
      setIsLoading(false);
    }
    loadVisits();
  }, [currentUser, properties]);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Calendar className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Scheduled Visits & Tours</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your in-person walkthroughs, virtual live tours, and self-guided access codes.
          </p>
        </div>
      </div>

      {/* Visits List */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading tour calendar...</div>
      ) : visits.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No Scheduled Visits</h3>
          <p className="text-xs text-slate-500 mt-1">
            Explore property detail pages to book an in-person or virtual walkthrough.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visits.map((visit) => {
            const prop = visit.property || properties[0];
            return (
              <div
                key={visit.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        visit.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {visit.status}
                    </span>

                    <span className="text-[11px] font-semibold text-slate-500 flex items-center">
                      {visit.visit_type === "virtual_tour" ? (
                        <>
                          <Video className="h-3.5 w-3.5 mr-1 text-indigo-600" /> Virtual Tour
                        </>
                      ) : (
                        <>
                          <MapPin className="h-3.5 w-3.5 mr-1 text-amber-600" /> In-Person Walkthrough
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <img
                      src={prop?.primary_image_url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80"}
                      alt={prop?.title}
                      className="h-16 w-20 object-cover rounded-xl shrink-0"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{prop?.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {prop?.address_line1}, {prop?.city}
                      </p>
                      <p className="text-xs font-bold text-emerald-600 mt-1">
                        ${prop?.rent_price}/mo
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-medium">
                        {new Date(visit.scheduled_start).toLocaleDateString()} at{" "}
                        {new Date(visit.scheduled_start).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {visit.notes && (
                      <p className="text-[11px] text-slate-500 italic pl-5">{visit.notes}</p>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 font-medium">Host Confirmed</span>
                  <button
                    onClick={() => triggerToast("Calendar invitation resent to your email!")}
                    className="text-xs font-semibold text-[#1b206b] hover:underline cursor-pointer"
                  >
                    Sync to Calendar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
