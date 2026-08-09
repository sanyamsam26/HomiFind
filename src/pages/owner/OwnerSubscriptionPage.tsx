import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Check, Zap, Sparkles, Building2, Shield, CreditCard, ArrowRight } from "lucide-react";

export function OwnerSubscriptionPage() {
  const { triggerToast } = useApp();
  const [currentPlan, setCurrentPlan] = useState<"starter" | "pro" | "enterprise">("pro");

  const plans = [
    {
      id: "starter",
      name: "Starter Landlord",
      price: "$29",
      billing: "per month",
      units: "Up to 3 Listed Units",
      features: [
        "AI Property Description Generator",
        "Standard Pre-Screening Checks",
        "Direct Tenant Chat",
        "Basic Financial Tracking",
      ],
      recommended: false,
    },
    {
      id: "pro",
      name: "Pro Portfolio",
      price: "$79",
      billing: "per month",
      units: "Up to 15 Listed Units",
      features: [
        "Unlimited AI Match Scoring",
        "Plaid Automated Rent Collection",
        "Priority Search Placement",
        "1-Click Verified Landlord Badge",
        "Automated Maintenance Ticketing",
      ],
      recommended: true,
    },
    {
      id: "enterprise",
      name: "Property Management Hub",
      price: "$199",
      billing: "per month",
      units: "Unlimited Units",
      features: [
        "Dedicated Account Manager",
        "Custom Supabase Database Sync",
        "Multi-User Agent Access",
        "Advanced Market Yield Analytics",
        "Custom Lease Contract Builder",
      ],
      recommended: false,
    },
  ];

  const handleSelectPlan = (planId: "starter" | "pro" | "enterprise") => {
    setCurrentPlan(planId);
    triggerToast(`Subscription updated to ${planId.toUpperCase()} plan!`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Zap className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Owner Subscription & Billing</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Choose the portfolio plan tailored to your unit count and automation requirements.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
          <CreditCard className="h-4 w-4 text-slate-500" />
          <span className="font-semibold text-slate-700">Active Plan:</span>
          <span className="font-bold text-[#1b206b] uppercase">{currentPlan}</span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isSelected = currentPlan === plan.id;
          return (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between relative ${
                plan.recommended
                  ? "border-[#1b206b] ring-2 ring-[#1b206b]/10 shadow-md"
                  : "border-slate-200 shadow-2xs"
              }`}
            >
              {plan.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#1b206b] text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-xs">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500">{plan.units}</p>
                </div>

                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
                  <span className="text-xs text-slate-500 font-medium">/{plan.billing}</span>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleSelectPlan(plan.id as any)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-[#1b206b] hover:bg-[#141854] text-white"
                  }`}
                >
                  {isSelected ? "Current Active Plan" : "Switch Plan"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
