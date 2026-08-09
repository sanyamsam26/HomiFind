import React from "react";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

interface ErrorPageProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export function ErrorPage({ error, resetErrorBoundary }: ErrorPageProps) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="h-16 w-16 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 shadow-sm">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <span className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-1 flex items-center">
        <ShieldAlert className="h-3.5 w-3.5 mr-1" /> Application Route Error
      </span>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">
        Something unexpected occurred
      </h2>
      <p className="text-xs text-slate-600 max-w-md mt-2 leading-relaxed">
        {error?.message || "An issue occurred while loading this view. You can retry or head back to the main dashboard."}
      </p>

      <div className="flex items-center space-x-3 mt-6">
        {resetErrorBoundary && (
          <button
            onClick={resetErrorBoundary}
            className="flex items-center px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" /> Try Again
          </button>
        )}
        <Link
          to="/"
          className="flex items-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
        >
          <Home className="h-4 w-4 mr-1.5" /> Return to Homepage
        </Link>
      </div>
    </div>
  );
}
