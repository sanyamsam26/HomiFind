import React, { useState } from "react";
import {
  Sparkles,
  Plus,
  DollarSign,
  Building,
  FileCheck,
  Calendar,
  Users,
  TrendingUp,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  UserCheck
} from "lucide-react";
import { Property, Application } from "../types/database";

interface OwnerDashboardProps {
  properties: Property[];
  applications: Application[];
  onOpenUploadWizard: () => void;
  onSelectProperty?: (property: Property) => void;
}

export function OwnerDashboard({
  properties,
  applications,
  onOpenUploadWizard,
  onSelectProperty,
}: OwnerDashboardProps) {
  const [pipelineTab, setPipelineTab] = useState<"all" | "review" | "approved">("all");

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, Sarah Jenkins! 👋
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Owner Management Dashboard • 4 active properties listed
          </p>
        </div>

        <button
          onClick={onOpenUploadWizard}
          className="px-5 py-3 bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-2 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Listing</span>
        </button>
      </div>

      {/* AI Suggestions Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-200/80 flex items-start space-x-4 shadow-xs">
        <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="font-extrabold text-amber-950 text-sm">AI Portfolio Insight</p>
          <p className="text-xs text-amber-900 leading-relaxed">
            Listing <span className="font-bold">"Skyline Tower Penthouse"</span> is priced 8% above market average. Adjusting rent to <span className="font-bold">$3,200/mo</span> could increase high-tier tenant inquiries by up to 35%.
          </p>
        </div>
        <button className="px-3.5 py-2 bg-amber-900 text-white rounded-xl text-xs font-bold hover:bg-amber-950 transition shrink-0 hidden sm:block">
          Apply Suggestion
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase">Monthly Revenue</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">$14,200</p>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>+12% vs last month</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase">Active Properties</span>
            <Building className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{properties.length || 4}</p>
          <span className="text-[10px] text-slate-500 font-medium">100% Occupancy</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase">Pending Applications</span>
            <FileCheck className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-600">{applications.length || 3}</p>
          <span className="text-[10px] text-amber-800 font-bold">Review required</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase">Upcoming Visits</span>
            <Calendar className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-indigo-900">5</p>
          <span className="text-[10px] text-indigo-600 font-semibold">Scheduled this week</span>
        </div>
      </div>

      {/* Main Grid: Left Performance & Visits + Right Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Performing Listing */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-base">Top Performing Listing</h3>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                98% Match Rate
              </span>
            </div>

            {properties[0] && (
              <div
                onClick={() => onSelectProperty && onSelectProperty(properties[0])}
                className="p-4 rounded-xl border border-slate-100 hover:border-slate-300 transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={properties[0].primary_image_url}
                    alt={properties[0].title}
                    className="h-16 w-20 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{properties[0].title}</h4>
                    <p className="text-xs text-slate-500">{properties[0].city}, {properties[0].state}</p>
                    <p className="text-sm font-black text-indigo-900 mt-1">${properties[0].rent_price}/mo</p>
                  </div>
                </div>

                <div className="text-right sm:text-right space-y-1 w-full sm:w-auto flex sm:flex-col justify-between items-end">
                  <span className="text-xs font-bold text-emerald-600">14 Active Leads</span>
                  <span className="text-[11px] text-slate-400">85 Views today</span>
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Visits List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-base">Upcoming Visits</h3>
              <span className="text-xs font-bold text-indigo-600">View Calendar</span>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { date: "Sat, Oct 5", time: "11:00 AM", renter: "Alex Morgan", property: "The Lumina Lofts" },
                { date: "Sun, Oct 6", time: "02:00 PM", renter: "Rachel Kim", property: "Skyline Tower" },
              ].map((visit, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{visit.renter}</p>
                      <p className="text-slate-500 text-[11px]">{visit.property}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-indigo-900">{visit.date}</p>
                    <p className="text-slate-400 text-[11px]">{visit.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Active Lead Pipeline */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-base">Active Lead Pipeline</h3>
              <span className="text-xs text-slate-400 font-medium">6 Total</span>
            </div>

            {/* Kanban Columns Preview */}
            <div className="space-y-3">
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-indigo-950">
                  <span className="flex items-center space-x-1.5">
                    <Clock className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Under Review</span>
                  </span>
                  <span className="bg-indigo-200/60 text-indigo-900 px-2 py-0.5 rounded-full text-[10px]">2 Candidates</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-indigo-100 text-xs space-y-1 shadow-2xs">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Michael Chen</span>
                    <span className="text-emerald-600">$140k/yr</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Applied for The Lumina Lofts • Move-in Oct 1</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-emerald-950">
                  <span className="flex items-center space-x-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Approved & Ready</span>
                  </span>
                  <span className="bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded-full text-[10px]">1 Candidate</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-100 text-xs space-y-1 shadow-2xs">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Sarah Taylor</span>
                    <span className="text-emerald-600">Lease Generated</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Oasis Residences • Security Deposit Paid</p>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenUploadWizard}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Listing Wizard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
