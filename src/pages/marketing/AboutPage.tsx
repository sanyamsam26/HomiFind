import React from "react";
import { Building2, ShieldCheck, Sparkles, Users, Award, Heart } from "lucide-react";

export function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Our Mission</span>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Reinventing Real Estate Leasing with AI & Trust</h1>
        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl mx-auto">
          HomiFind was founded to solve the friction, ambiguity, and high fees associated with residential rentals. We build verified connections between renters, landlords, and licensed brokers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl w-fit">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">AI Compatibility Match</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our neural matching model analyzes lifestyle preferences, commute vectors, and amenity requirements to ensure long-term tenant happiness.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl w-fit">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">256-Bit Identity Security</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All credit verifications, background screening documents, and digital lease contracts are stored using bank-grade security protocols.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl w-fit">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Verified Broker Network</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every real estate broker on HomiFind holds active state licensure and maintains high tenant satisfaction ratings.
          </p>
        </div>
      </div>
    </div>
  );
}
