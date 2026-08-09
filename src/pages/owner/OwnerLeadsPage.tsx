import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Users, Sparkles, ShieldCheck, Mail, Calendar, Filter, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react";

export function OwnerLeadsPage() {
  const { triggerToast, properties } = useApp();
  const [filter, setFilter] = useState<"all" | "high_match" | "pre_screened">("all");

  const [leads, setLeads] = useState([
    {
      id: "lead-1",
      name: "Marcus Sterling",
      email: "m.sterling@techcorp.io",
      propertyTitle: "Soho Luxury Loft with Private Terrace",
      matchScore: 98,
      verified: true,
      incomeVerified: "3.8x Rent Ratio",
      creditScore: "740+",
      moveInDate: "Sept 1, 2026",
      status: "Verified Lead",
      note: "Looking for 12-month lease. Has 1 trained dog.",
    },
    {
      id: "lead-2",
      name: "Elena Rostova",
      email: "elena.r@designstudio.co",
      propertyTitle: "Upper West Side Modern 2BR",
      matchScore: 94,
      verified: true,
      incomeVerified: "4.2x Rent Ratio",
      creditScore: "780+",
      moveInDate: "Immediate",
      status: "Pre-screened",
      note: "Quiet professional working in midtown finance.",
    },
    {
      id: "lead-3",
      name: "David Chen",
      email: "david.c@columbia.edu",
      propertyTitle: "Tribeca Executive Penthouse",
      matchScore: 89,
      verified: false,
      incomeVerified: "Guarantor Approved",
      creditScore: "710+",
      moveInDate: "Oct 1, 2026",
      status: "Inquiry Sent",
      note: "Requested video walkthrough for study room.",
    },
  ]);

  const filteredLeads = leads.filter((l) => {
    if (filter === "high_match") return l.matchScore >= 90;
    if (filter === "pre_screened") return l.verified;
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-[#1b206b]">
              <Users className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Tenant Leads & Pre-Screening</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            AI-matched renter candidates categorized by income verification, creditworthiness, and fit score.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {["all", "high_match", "pre_screened"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                filter === t
                  ? "bg-[#1b206b] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t === "all" ? "All Leads" : t === "high_match" ? "90%+ Match" : "Verified Only"}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4 flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 text-[#1b206b]">
                  <Sparkles className="h-3 w-3 mr-1" /> {lead.matchScore}% AI Fit
                </span>
                {lead.verified && (
                  <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    <ShieldCheck className="h-3 w-3 mr-1" /> Pre-Screened
                  </span>
                )}
              </div>

              <div className="mt-3">
                <h3 className="text-sm font-bold text-slate-900">{lead.name}</h3>
                <p className="text-xs text-slate-500">{lead.email}</p>
                <p className="text-[11px] font-medium text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  Target: <span className="font-semibold text-slate-900">{lead.propertyTitle}</span>
                </p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Income Ratio</span>
                  <span className="font-bold text-slate-800">{lead.incomeVerified}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Credit Check</span>
                  <span className="font-bold text-slate-800">{lead.creditScore}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 italic mt-3">{lead.note}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Move-in: {lead.moveInDate}</span>
              <button
                onClick={() => triggerToast(`Tour invite sent to ${lead.name}!`)}
                className="px-3 py-1.5 bg-[#1b206b] hover:bg-[#141854] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center"
              >
                <span>Invite Tour</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
