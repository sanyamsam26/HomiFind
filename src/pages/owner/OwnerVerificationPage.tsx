import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ShieldCheck, FileCheck, Upload, CheckCircle2, Building, AlertCircle, Lock } from "lucide-react";

export function OwnerVerificationPage() {
  const { triggerToast } = useApp();
  const [deedUploaded, setDeedUploaded] = useState(true);
  const [idUploaded, setIdUploaded] = useState(true);
  const [taxDocUploaded, setTaxDocUploaded] = useState(false);

  const handleUploadTaxDoc = () => {
    setTaxDocUploaded(true);
    triggerToast("Property Tax Document submitted to Supabase land registry verification!");
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Landlord & Property Verification</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build renter trust with verified owner badges synced directly with Supabase registry data.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Level 2 Verified Owner
          </span>
        </div>
      </div>

      {/* Verification Checklist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Deed Verification */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <Building className="h-5 w-5 text-[#1b206b]" />
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Approved
            </span>
          </div>
          <h3 className="text-xs font-bold text-slate-900">Property Title Deed / Master Lease</h3>
          <p className="text-xs text-slate-500">
            Confirms legal ownership or property management authorization.
          </p>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 font-medium flex items-center">
            <FileCheck className="h-3.5 w-3.5 mr-1.5 text-emerald-600" /> deed_soho_loft_2026.pdf
          </div>
        </div>

        {/* Government ID Verification */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Approved
            </span>
          </div>
          <h3 className="text-xs font-bold text-slate-900">Government Photo ID</h3>
          <p className="text-xs text-slate-500">
            Encrypted Passport or Driver's License verification.
          </p>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 font-medium flex items-center">
            <FileCheck className="h-3.5 w-3.5 mr-1.5 text-emerald-600" /> identity_verified.enc
          </div>
        </div>

        {/* Property Tax Statement */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <FileCheck className="h-5 w-5 text-amber-600" />
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                taxDocUploaded ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              {taxDocUploaded ? "Uploaded" : "Pending Optional"}
            </span>
          </div>
          <h3 className="text-xs font-bold text-slate-900">Property Tax / Utility Bill</h3>
          <p className="text-xs text-slate-500">
            Unlocks Gold Verified Landlord badge on public listings.
          </p>
          {taxDocUploaded ? (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 font-medium flex items-center">
              <FileCheck className="h-3.5 w-3.5 mr-1.5 text-emerald-600" /> tax_statement_2026.pdf
            </div>
          ) : (
            <button
              onClick={handleUploadTaxDoc}
              className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-[#1b206b] text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center"
            >
              <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload Document
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
