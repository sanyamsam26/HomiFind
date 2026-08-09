import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, ShieldCheck, Tag, Users, MapPin, Sun } from "lucide-react";
import { useApp } from "../../context/AppContext";

export function HomePage() {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  return (
    <div className="bg-[#f8fafd] text-slate-800 font-sans min-h-screen">
      {/* Hero Section from Image 6 */}
      <section className="relative overflow-hidden pt-12 lg:pt-20 pb-16 lg:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* AI Curation Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-800 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>AI-POWERED CURATION</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1b206b] tracking-tight leading-[1.1]">
              Find a home that fits your lifestyle, not just your budget.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
              HomiFind's AI housing advisor understands your daily rhythms—from commute patterns to natural light preferences—to recommend spaces that truly feel like home.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/auth/signup"
                className="inline-flex items-center space-x-2 bg-[#1b206b] hover:bg-[#141854] text-white font-medium text-xs sm:text-sm px-7 py-3.5 rounded-full shadow-md transition-all cursor-pointer"
              >
                <span>Start Finding My Home</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/owner/dashboard"
                className="inline-flex items-center bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-medium text-xs sm:text-sm px-7 py-3.5 rounded-full shadow-2xs transition-all cursor-pointer"
              >
                List Your Property
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-6 flex items-center space-x-4 border-t border-slate-200/80">
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="User"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="User"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="User"
                />
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-bold text-slate-900">10k+ matches</span> made this month
              </div>
            </div>
          </div>

          {/* Right Column: High-Res Interior Image Container */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl shadow-2xl overflow-hidden relative border border-slate-200/60 bg-white">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury Loft"
                className="w-full h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              {/* Top Floating Badge */}
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-semibold text-slate-800 shadow-md border border-white/60 flex items-center space-x-1.5">
                <Sun className="h-3.5 w-3.5 text-amber-500" />
                <span>Optimal Morning Light</span>
              </div>

              {/* Bottom Glass Card from Image 6 */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl border border-white/80 p-5 rounded-2xl shadow-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-1 text-slate-500 text-[11px]">
                    <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Tribeca, New York</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">Tribeca Loft</h3>
                  <div className="inline-block bg-indigo-50 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-md mt-1">
                    Perfect Lifestyle Match
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-600">98%</div>
                  <div className="text-[10px] text-slate-500 font-medium">Match Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Value Grid */}
      <section className="border-t border-slate-200/60 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start space-x-3.5">
              <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-[#1b206b] flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Verified Properties</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Every listing is physically inspected and background checked.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">AI Match Score</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Deep learning alignment with your lifestyle & commuting data.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Zero Brokerage</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Transparent, direct owner deals with zero hidden fees.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Trusted Owners</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Vetted landlords, superhosts, and premium communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
