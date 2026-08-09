import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { User, Mail, ShieldCheck, CheckCircle2, Sparkles, Sliders, Lock, FileCheck, Building2 } from "lucide-react";

export function ProfilePage() {
  const { currentUser, setCurrentUser, triggerToast, currentRole, setCurrentRole } = useApp();

  const [name, setName] = useState(currentUser?.name || "Alex Rivera");
  const [email, setEmail] = useState(currentUser?.email || "alex.rivera@example.com");
  const [targetBudget, setTargetBudget] = useState(3200);
  const [targetBedrooms, setTargetBedrooms] = useState("2 Bedrooms");
  const [preferredCommute, setPreferredCommute] = useState("Under 25 mins to Midtown");
  const [petFriendlyRequired, setPetFriendlyRequired] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        name,
        email,
      });
    }
    triggerToast("Profile & AI Search preferences updated successfully!");
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-2xl bg-[#1b206b] text-white flex items-center justify-center font-bold text-xl shadow-md">
            {name ? name.charAt(0) : "U"}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900">{name}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <ShieldCheck className="h-3 w-3 mr-1" /> Verified Renter
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-600 pl-2">Current Role:</span>
          <span className="px-3 py-1 bg-[#1b206b] text-white rounded-lg text-xs font-bold uppercase tracking-wider">
            {currentRole}
          </span>
        </div>
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Account & Personal Information */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
            <User className="h-5 w-5 text-[#1b206b]" />
            <h2 className="text-sm font-bold text-slate-900">Personal Information</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1b206b] hover:bg-[#141854] text-white font-medium text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Save Personal Changes
              </button>
            </div>
          </form>
        </div>

        {/* AI Housing Search Preferences */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
            <Sparkles className="h-5 w-5 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900">AI Search Persona</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Max Target Rent Budget (${targetBudget}/mo)
              </label>
              <input
                type="range"
                min="1500"
                max="8000"
                step="100"
                value={targetBudget}
                onChange={(e) => setTargetBudget(Number(e.target.value))}
                className="w-full accent-[#1b206b] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Preferred Bedrooms</label>
              <select
                value={targetBedrooms}
                onChange={(e) => setTargetBedrooms(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="Studio">Studio</option>
                <option value="1 Bedroom">1 Bedroom</option>
                <option value="2 Bedrooms">2 Bedrooms</option>
                <option value="3+ Bedrooms">3+ Bedrooms</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Commute Rule</label>
              <input
                type="text"
                value={preferredCommute}
                onChange={(e) => setPreferredCommute(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="pet"
                checked={petFriendlyRequired}
                onChange={(e) => setPetFriendlyRequired(e.target.checked)}
                className="rounded border-slate-300 text-indigo-700 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
              />
              <label htmlFor="pet" className="text-xs text-slate-700 cursor-pointer font-medium">
                Must be Pet-Friendly
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Verifications & Badges Card */}
      <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-200/80 space-y-3">
        <div className="flex items-center space-x-2">
          <FileCheck className="h-5 w-5 text-emerald-700" />
          <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
            Verified Renter Status (Supabase Sync)
          </h3>
        </div>
        <p className="text-xs text-emerald-800 leading-relaxed max-w-2xl">
          Your background check, soft credit check, and proof of income are synchronized with Supabase database storage. Landlords can process your applications 3x faster with 1-click verification.
        </p>
      </div>
    </div>
  );
}
