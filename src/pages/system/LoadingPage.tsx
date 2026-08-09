import React from "react";
import { Loader2, Sparkles, Building2 } from "lucide-react";

export function LoadingPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-4">
        <div className="h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center animate-pulse">
          <Building2 className="h-8 w-8 text-emerald-600 animate-bounce" />
        </div>
        <div className="absolute -top-1 -right-1 bg-teal-500 text-white p-1 rounded-full shadow-xs">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
      </div>
      <h3 className="text-lg font-bold text-slate-900">Loading HomiFind Workspace...</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1">
        Synchronizing real estate listings, AI match preferences, and verified lease contracts.
      </p>
      <div className="flex items-center mt-4 text-emerald-600 text-xs font-semibold space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading Route Assets...</span>
      </div>
    </div>
  );
}
