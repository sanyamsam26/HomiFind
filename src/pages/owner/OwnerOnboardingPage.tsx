import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Building2, ShieldCheck, Sparkles, CheckCircle2, ArrowRight, Upload, User, DollarSign } from "lucide-react";

export function OwnerOnboardingPage() {
  const navigate = useNavigate();
  const { triggerToast, setCurrentRole } = useApp();

  const [portfolioName, setPortfolioName] = useState("Aegis Properties LLC");
  const [propertyCount, setPropertyCount] = useState("2-5 units");
  const [phone, setPhone] = useState("+1 (555) 321-9876");
  const [bankAccountLinked, setBankAccountLinked] = useState(true);
  const [preferredTenantScore, setPreferredTenantScore] = useState("700+ Credit, 3x Income");

  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentRole("owner");
    triggerToast("Owner profile & Supabase landlord verification saved!");
    navigate("/owner/dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans py-4">
      {/* Banner */}
      <div className="bg-[#1b206b] text-white p-8 rounded-3xl shadow-md space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold text-amber-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>HomiFind Landlord Onboarding</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Welcome, Property Owner
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
          Set up your landlord profile, link automated rent collection via Supabase, and configure AI tenant pre-screening criteria to automate 90% of listing inquiries.
        </p>
      </div>

      {/* Setup Form */}
      <form onSubmit={handleCompleteOnboarding} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Company or Portfolio Name</label>
            <input
              type="text"
              value={portfolioName}
              onChange={(e) => setPortfolioName(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#1b206b]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Portfolio Size</label>
            <select
              value={propertyCount}
              onChange={(e) => setPropertyCount(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#1b206b]"
            >
              <option value="1 unit">1 unit (Independent Landlord)</option>
              <option value="2-5 units">2 - 5 units</option>
              <option value="6-20 units">6 - 20 units</option>
              <option value="20+ units">20+ units (Commercial/PM)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#1b206b]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">AI Pre-Screening Criteria</label>
            <input
              type="text"
              value={preferredTenantScore}
              onChange={(e) => setPreferredTenantScore(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#1b206b]"
            />
          </div>
        </div>

        {/* Supabase Verification & Bank Setup Status */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Direct Deposit & Identity Verification</h3>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Plaid bank account linked for zero-fee payout sync stored securely in Supabase.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-3 py-1 bg-emerald-600 text-white rounded-full">
            Connected
          </span>
        </div>

        <div className="pt-4 flex items-center justify-end space-x-3">
          <button
            type="submit"
            className="px-6 py-3 bg-[#1b206b] hover:bg-[#141854] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center cursor-pointer"
          >
            <span>Complete Setup & Launch Dashboard</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
