import React, { useState } from "react";
import {
  Sparkles,
  Share2,
  FileText,
  CheckCircle2,
  ArrowRight,
  Send,
  Building,
  DollarSign,
  TrendingUp,
  X,
  ChevronLeft
} from "lucide-react";
import { Property } from "../types/database";

interface PropertyComparisonViewProps {
  propertyA: Property;
  propertyB?: Property;
  onClose?: () => void;
  onSelectWinner: (property: Property) => void;
}

export function PropertyComparisonView({
  propertyA,
  propertyB,
  onClose,
  onSelectWinner,
}: PropertyComparisonViewProps) {
  // Fallback property B if none passed
  const secondProp: Property = propertyB || {
    id: "prop-oasis",
    owner_id: "owner-2",
    title: "Oasis Residences",
    description: "Modern luxury high-rise with dedicated storage and resort amenities.",
    property_type: "apartment",
    status: "available",
    rent_price: 3100,
    deposit_amount: 3100,
    utilities_included: false,
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1150,
    is_pet_friendly: true,
    is_furnished: true,
    amenities: ["Gym", "Pool", "Storage", "Parking"],
    address_line1: "880 Westside Blvd",
    city: "Austin",
    state: "TX",
    zip_code: "78703",
    country: "USA",
    featured: true,
    view_count: 85,
    match_score: 89,
    primary_image_url:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const handleAsk = (q: string) => {
    setAiAnswer("Analyzing comparison metrics...");
    setTimeout(() => {
      if (q.toLowerCase().includes("quiet")) {
        setAiAnswer("Oasis Residences scores slightly higher for quietness due to courtyard orientation away from main avenue traffic.");
      } else if (q.toLowerCase().includes("gym")) {
        setAiAnswer("Both properties offer modern fitness centers, but Lumina Lofts includes Peloton bikes and yoga studios.");
      } else {
        setAiAnswer(`${propertyA.title} delivers a total savings of $240/mo with a significantly shorter commute time.`);
      }
    }, 600);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500">
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            AI Property Comparison
          </span>
          <h1 className="text-lg font-extrabold text-slate-900 hidden sm:block">
            {propertyA.title} vs {secondProp.title}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center space-x-1">
            <FileText className="h-3.5 w-3.5" />
            <span>Export PDF</span>
          </button>
          <button className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center space-x-1">
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Comparison Area (Left 8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Side-by-side Property Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Property A */}
            <div className="bg-white p-5 rounded-2xl border-2 border-indigo-600 shadow-md space-y-4 relative">
              <span className="absolute -top-3 left-4 bg-indigo-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                {propertyA.match_score || 96}% Match
              </span>
              <img src={propertyA.primary_image_url} alt={propertyA.title} className="w-full h-44 object-cover rounded-xl" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">{propertyA.title}</h3>
                <p className="text-xs text-slate-500">{propertyA.address_line1}, {propertyA.city}</p>
              </div>
              <div className="flex justify-between items-end pt-2 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Monthly Rent</p>
                  <p className="text-2xl font-black text-indigo-900">${propertyA.rent_price.toLocaleString()}</p>
                </div>
                <span className="text-xs font-semibold text-slate-600">{propertyA.bedrooms} Bed, {propertyA.bathrooms} Bath</span>
              </div>
            </div>

            {/* Property B */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative">
              <span className="absolute -top-3 left-4 bg-slate-700 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                {secondProp.match_score || 89}% Match
              </span>
              <img src={secondProp.primary_image_url} alt={secondProp.title} className="w-full h-44 object-cover rounded-xl" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">{secondProp.title}</h3>
                <p className="text-xs text-slate-500">{secondProp.address_line1}, {secondProp.city}</p>
              </div>
              <div className="flex justify-between items-end pt-2 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Monthly Rent</p>
                  <p className="text-2xl font-black text-slate-900">${secondProp.rent_price.toLocaleString()}</p>
                </div>
                <span className="text-xs font-semibold text-slate-600">{secondProp.bedrooms} Bed, {secondProp.bathrooms} Bath</span>
              </div>
            </div>
          </div>

          {/* Lifestyle Analytics Bar Charts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="font-extrabold text-slate-900 text-base">Lifestyle Analytics</h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Commute Efficiency</span>
                  <span className="text-indigo-600 font-extrabold">{propertyA.title} wins</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                  <div className="bg-indigo-600 h-full" style={{ width: "85%" }}></div>
                  <div className="bg-slate-300 h-full" style={{ width: "55%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Natural Light Exposure</span>
                  <span className="text-indigo-600 font-extrabold">{propertyA.title} wins</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                  <div className="bg-indigo-600 h-full" style={{ width: "95%" }}></div>
                  <div className="bg-slate-300 h-full" style={{ width: "70%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Quietness (Low Noise)</span>
                  <span className="text-slate-600 font-extrabold">{secondProp.title} wins</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                  <div className="bg-slate-300 h-full" style={{ width: "75%" }}></div>
                  <div className="bg-slate-700 h-full" style={{ width: "90%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Callout Cards: "Choose A if..." vs "Choose B if..." */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 space-y-3">
              <h4 className="font-bold text-indigo-950 text-sm">Choose {propertyA.title} if...</h4>
              <ul className="text-xs text-indigo-900 space-y-1.5">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>You work from home and need inspiring sunlit spaces.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>A short 22-minute commute is a top priority.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Choose {secondProp.title} if...</h4>
              <ul className="text-xs text-slate-700 space-y-1.5">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>Dedicated parking and extra storage space are essential.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>You expect frequent visitors and need guest parking.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Panel: Recommendation & Financial Forecast (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* My Recommendation Panel */}
          <div className="bg-gradient-to-b from-indigo-900 to-indigo-950 text-white p-6 rounded-2xl shadow-xl space-y-5">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-amber-300" />
              <span className="font-extrabold text-white text-base">My Recommendation</span>
            </div>

            <div className="text-center py-3 bg-white/10 rounded-xl backdrop-blur-md space-y-1">
              <span className="text-3xl font-black text-amber-300">96%</span>
              <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">Confidence Score</p>
              <p className="text-xl font-extrabold text-white pt-1">{propertyA.title}</p>
              <p className="text-xs text-indigo-200">Clear winner for your profile.</p>
            </div>

            <ul className="text-xs text-indigo-100 space-y-2">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Better commute for your office</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Excellent natural light</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Lower overall monthly cost</span>
              </li>
            </ul>

            <button
              onClick={() => onSelectWinner(propertyA)}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl text-xs transition shadow"
            >
              Choose {propertyA.title}
            </button>
          </div>

          {/* Monthly Cost Forecast */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm">Monthly Cost Forecast</h4>

            <div className="text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Base Rent</span>
                <span className="font-bold text-slate-900">${propertyA.rent_price} vs ${secondProp.rent_price}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Est. Utilities</span>
                <span className="font-bold text-slate-900">$120 vs $145</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Transport Cost</span>
                <span className="font-bold text-slate-900">$45 vs $110</span>
              </div>

              <div className="pt-3 p-3 bg-emerald-50 text-emerald-900 rounded-xl text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Expected Savings</p>
                <p className="text-2xl font-black text-emerald-700">+ $240 / mo</p>
              </div>
            </div>
          </div>

          {/* Ask AI Box */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg space-y-3">
            <p className="font-bold text-xs text-indigo-300">Ask AI about these properties</p>
            <div className="flex gap-2">
              <button onClick={() => handleAsk("Which one is quieter?")} className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] px-2.5 py-1 rounded-md">
                Which one is quieter?
              </button>
              <button onClick={() => handleAsk("Compare the gyms.")} className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] px-2.5 py-1 rounded-md">
                Compare gyms
              </button>
            </div>

            {aiAnswer && (
              <p className="text-xs text-indigo-100 bg-slate-800 p-2.5 rounded-xl border border-slate-700 leading-relaxed">
                {aiAnswer}
              </p>
            )}

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                placeholder="Type your question..."
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
              />
              <button onClick={() => handleAsk(aiQuestion)} className="p-2 bg-indigo-600 rounded-xl text-white">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
