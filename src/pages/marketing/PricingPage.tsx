import React from "react";
import { Check, Sparkles, Building2, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useApp } from "../../context/AppContext";

export function PricingPage() {
  const { handleOpenAuth } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Simple & Transparent Pricing</span>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Plans built for every real estate workflow</h1>
        <p className="text-xs text-slate-600 max-w-xl mx-auto">
          No hidden fees or unexpected commission markups. Choose the plan tailored to your role.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Renter Tier */}
        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-extrabold uppercase tracking-wide">
              For Renters
            </span>
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-black text-slate-900">$0</span>
              <span className="text-xs text-slate-500 font-medium">/ forever</span>
            </div>
            <p className="text-xs text-slate-500">Free search, AI matching, and unlimited listing inquiries.</p>

            <ul className="space-y-2.5 pt-2 text-xs text-slate-700">
              {["Unlimited AI Match Search", "Saved Wishlists & Comparison Tool", "Direct In-App Owner Chat", "Single Reusable Application Profile"].map((item, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            onClick={() => handleOpenAuth("signup")}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl"
          >
            Create Free Account
          </Button>
        </div>

        {/* Owner Tier */}
        <div className="p-8 bg-emerald-950 text-white rounded-3xl border border-emerald-800 shadow-xl space-y-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            Most Popular
          </div>
          <div className="space-y-4">
            <span className="px-3 py-1 bg-emerald-800 text-emerald-200 rounded-full text-[11px] font-extrabold uppercase tracking-wide">
              For Owners & Managers
            </span>
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-black text-white">$29</span>
              <span className="text-xs text-emerald-300 font-medium">/ month per property</span>
            </div>
            <p className="text-xs text-emerald-200/80">Complete tenant screening, maintenance tracking & digital lease signing.</p>

            <ul className="space-y-2.5 pt-2 text-xs text-emerald-100">
              {["Multi-unit Upload Wizard", "Income & Background Check Verification", "Digital Lease Contract Viewer", "Maintenance Ticket Management", "Automated Rent Reminders"].map((item, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            onClick={() => handleOpenAuth("signup")}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3 rounded-xl shadow-md"
          >
            Start Owner Trial <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>

        {/* Broker Tier */}
        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-[11px] font-extrabold uppercase tracking-wide">
              For Licensed Brokers
            </span>
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-black text-slate-900">$79</span>
              <span className="text-xs text-slate-500 font-medium">/ month per agent</span>
            </div>
            <p className="text-xs text-slate-500">Full agent pipeline tools, client lead matching, and deal closing analytics.</p>

            <ul className="space-y-2.5 pt-2 text-xs text-slate-700">
              {["Exclusive Broker Network Access", "Client Representation Dashboard", "Automated Commission Tracking", "Priority Property Syndication"].map((item, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            onClick={() => handleOpenAuth("signup")}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl"
          >
            Join Broker Portal
          </Button>
        </div>
      </div>
    </div>
  );
}
