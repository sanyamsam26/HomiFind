import React from "react";
import { Link } from "react-router-dom";
import { Compass, Home, ArrowLeft, Search } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-4">
        <div className="text-8xl font-black text-slate-200 select-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg">
            <Compass className="h-8 w-8 animate-spin-slow" />
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-900">Page or Route Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm mt-2">
        The route you are looking for doesn't exist or has been relocated within the HomiFind platform.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <Link
          to="/"
          className="flex items-center px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs shadow-sm transition-all"
        >
          <Home className="h-4 w-4 mr-1.5" /> Back to Home
        </Link>
        <Link
          to="/app/explore"
          className="flex items-center px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs shadow-sm transition-all"
        >
          <Search className="h-4 w-4 mr-1.5" /> Explore Listings
        </Link>
      </div>
    </div>
  );
}
