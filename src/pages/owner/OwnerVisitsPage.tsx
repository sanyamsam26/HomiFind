import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, Video, UserCheck, ShieldCheck } from "lucide-react";

export function OwnerVisitsPage() {
  const { triggerToast, properties } = useApp();

  const [visitRequests, setVisitRequests] = useState([
    {
      id: "v-1",
      renterName: "Marcus Sterling",
      renterEmail: "m.sterling@techcorp.io",
      propertyTitle: properties[0]?.title || "Soho Luxury Loft",
      type: "in_person",
      dateTime: "Tomorrow, 2:00 PM - 2:30 PM",
      status: "requested",
      notes: "Interested in parking space availability during walkthrough.",
    },
    {
      id: "v-2",
      renterName: "Elena Rostova",
      renterEmail: "elena.r@designstudio.co",
      propertyTitle: properties[1]?.title || "Upper West Side Modern 2BR",
      type: "virtual_tour",
      dateTime: "Thursday, 4:00 PM - 4:20 PM",
      status: "confirmed",
      notes: "Will join via Google Meet live feed.",
    },
  ]);

  const handleAction = (id: string, action: "confirm" | "decline") => {
    setVisitRequests((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: action === "confirm" ? "confirmed" : "declined" } : v))
    );
    triggerToast(action === "confirm" ? "Visit request confirmed & calendar invite dispatched!" : "Visit request declined");
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Calendar className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Incoming Tour Requests</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review, confirm, or reschedule tenant walkthroughs for your listed units.
          </p>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {visitRequests.map((v) => (
          <div
            key={v.id}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    v.status === "confirmed"
                      ? "bg-emerald-100 text-emerald-800"
                      : v.status === "declined"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {v.status}
                </span>

                <span className="text-xs font-semibold text-slate-500 flex items-center">
                  {v.type === "virtual_tour" ? (
                    <>
                      <Video className="h-3.5 w-3.5 mr-1 text-indigo-600" /> Virtual Live Tour
                    </>
                  ) : (
                    <>
                      <MapPin className="h-3.5 w-3.5 mr-1 text-amber-600" /> In-Person Visit
                    </>
                  )}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{v.renterName}</h3>
                <p className="text-xs text-slate-500">{v.renterEmail}</p>
                <p className="text-xs font-semibold text-indigo-900 mt-1">Unit: {v.propertyTitle}</p>
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-medium">{v.dateTime}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end md:self-center">
              {v.status === "requested" && (
                <>
                  <button
                    onClick={() => handleAction(v.id, "decline")}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleAction(v.id, "confirm")}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer flex items-center"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    Confirm Tour
                  </button>
                </>
              )}

              {v.status === "confirmed" && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  Scheduled on Calendar
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
