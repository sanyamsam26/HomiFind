import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  MapPin,
  Calendar,
  MessageSquare,
  FileCheck,
  Heart,
  Share2,
  Maximize2,
  Check,
  X,
  Compass,
  DollarSign,
  Send,
  Plus,
  ShieldCheck,
  Navigation,
  ChevronDown,
  ChevronUp,
  Building,
  ArrowRight
} from "lucide-react";
import { Property } from "../types/database";

interface PropertyDetailViewProps {
  property: Property;
  onClose?: () => void;
  onBookVisit: (property: Property) => void;
  onChatOwner: (property: Property) => void;
  onApply: (property: Property) => void;
  onToggleSave: (id: string) => void;
  isSaved: boolean;
  onCompare: (property: Property) => void;
}

export function PropertyDetailView({
  property,
  onClose,
  onBookVisit,
  onChatOwner,
  onApply,
  onToggleSave,
  isSaved,
  onCompare,
}: PropertyDetailViewProps) {
  const [activeMediaTab, setActiveMediaTab] = useState<
    "gallery" | "360" | "video" | "street" | "floorplan"
  >("gallery");
  const [openAccordion, setOpenAccordion] = useState<string | null>("unique");
  const [aiChatInput, setAiChatInput] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState<
    { sender: "user" | "ai"; text: string }[]
  >([
    {
      sender: "user",
      text: "Will this be noisy on weekends?",
    },
    {
      sender: "ai",
      text: "Based on local zoning and street traffic data, this area is generally very quiet on weekends. The building is primarily residential, and there are no major nightlife venues within a 4-block radius. The heavy-duty window glazing (STC rating 45) will also block out most typical street noise.",
    },
  ]);

  const handleAskAi = (e?: React.FormEvent, presetQuestion?: string) => {
    if (e) e.preventDefault();
    const query = presetQuestion || aiChatInput;
    if (!query.trim()) return;

    setAiChatHistory((prev) => [...prev, { sender: "user", text: query }]);
    setAiChatInput("");

    setTimeout(() => {
      let aiResponse = "Our AI analyzed recent tenant reviews and local municipal data for " + property.title + ". ";
      if (query.toLowerCase().includes("wfh") || query.toLowerCase().includes("work")) {
        aiResponse += "It features fiber-optic high speed internet (1Gbps symmetrically) and ample natural sunlight in the east-facing study nook.";
      } else if (query.toLowerCase().includes("cell") || query.toLowerCase().includes("reception")) {
        aiResponse += "Cell coverage is excellent with 5G towers from major carriers within 300 meters.";
      } else {
        aiResponse += "This location ranks in the top 5% for neighborhood livability and transit accessibility.";
      }

      setAiChatHistory((prev) => [...prev, { sender: "ai", text: aiResponse }]);
    }, 600);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Top Banner Bar */}
      {onClose && (
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>Back to Explorer</span>
          </button>
          <div className="flex items-center space-x-3">
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center space-x-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Property</span>
            </span>
            <button
              onClick={() => onToggleSave(property.id)}
              className={`p-2 rounded-xl border text-xs font-semibold transition flex items-center space-x-1 ${
                isSaved ? "bg-red-50 text-red-600 border-red-200" : "bg-white text-slate-600 border-slate-200"
              }`}
            >
              <Heart className={`h-4 w-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Title */}
          <div>
            <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Property</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {property.title}
            </h1>
            <p className="text-slate-500 text-sm flex items-center space-x-1 mt-1">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <span>
                {property.address_line1}, {property.city}, {property.state} {property.zip_code}
              </span>
            </p>
          </div>

          {/* AI Verdict Card */}
          <div className="bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/40 rounded-2xl p-6 border border-indigo-100 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-indigo-900 font-bold text-sm">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <span>AI Match Verdict</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              This home is an exceptional match for your lifestyle profile. It hits your core requirements for natural light and a short commute, while staying well within budget. The property offers premium finishes and a highly-rated neighborhood, making it one of the strongest options currently on the market.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Overall Match Circle */}
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-indigo-100 shadow-sm text-center">
                <div className="relative flex items-center justify-center h-20 w-20 rounded-full border-4 border-indigo-600/20 bg-indigo-50">
                  <span className="text-2xl font-black text-indigo-700">{property.match_score || 96}%</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-2">
                  Overall Match
                </span>
              </div>

              {/* Key Strengths */}
              <div className="p-4 bg-white rounded-xl border border-emerald-100 shadow-sm space-y-2">
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Key Strengths</span>
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li className="flex items-center space-x-1">
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span>Perfect 22min Commute</span>
                  </li>
                  <li className="flex items-center space-x-1">
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span>Exceptional Natural Light</span>
                  </li>
                  <li className="flex items-center space-x-1">
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span>High Safety Rating (A+)</span>
                  </li>
                </ul>
              </div>

              {/* Trade-offs */}
              <div className="p-4 bg-white rounded-xl border border-amber-100 shadow-sm space-y-2">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center space-x-1">
                  <X className="h-3.5 w-3.5 text-amber-600" />
                  <span>Trade-offs</span>
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li className="flex items-center space-x-1">
                    <X className="h-3 w-3 text-amber-500" />
                    <span>No Private Balcony</span>
                  </li>
                  <li className="flex items-center space-x-1">
                    <X className="h-3 w-3 text-amber-500" />
                    <span>Smaller Kitchen Space</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Media Viewer Tabs */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-semibold text-slate-600 overflow-x-auto">
              {[
                { id: "gallery", label: "Gallery" },
                { id: "360", label: "360° Tour" },
                { id: "video", label: "Video Tour" },
                { id: "street", label: "Street View" },
                { id: "floorplan", label: "Floor Plan" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMediaTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    activeMediaTab === tab.id
                      ? "bg-indigo-900 text-white font-bold"
                      : "hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 group">
              <img
                src={property.primary_image_url}
                alt={property.title}
                className="w-full h-[400px] object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <button className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-slate-800 hover:bg-white shadow transition">
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onToggleSave(property.id)}
                  className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-slate-800 hover:bg-white shadow transition"
                >
                  <Heart className={`h-4 w-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Property Intelligence & Advanced Financial Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Intelligence */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">Property Intelligence</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-slate-400 font-medium uppercase text-[10px]">Monthly Rent</p>
                  <p className="text-xl font-black text-slate-900 mt-0.5">${property.rent_price.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-slate-400 font-medium uppercase text-[10px]">Deposit</p>
                  <p className="text-xl font-black text-slate-900 mt-0.5">${property.deposit_amount.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-slate-400 font-medium uppercase text-[10px]">Layout</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{property.bedrooms} Bed, {property.bathrooms} Bath</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-slate-400 font-medium uppercase text-[10px]">Furnishing</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{property.is_furnished ? "Furnished" : "Semi-furnished"}</p>
                </div>
              </div>
            </div>

            {/* Advanced Financial Analysis */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-slate-900 text-base">Advanced Financial Analysis</h3>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Below Market Value
                </span>
              </div>

              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase text-indigo-700">AI Estimated Fair Value</p>
                  <p className="text-xl font-black text-indigo-950">${property.rent_price.toLocaleString()} <span className="text-xs text-slate-400 font-normal line-through">$3,100</span></p>
                </div>
                <Sparkles className="h-5 w-5 text-indigo-600" />
              </div>

              <div className="text-xs space-y-2 border-t border-slate-100 pt-3">
                <p className="font-bold text-slate-800 text-[11px] uppercase">Monthly Cost Breakdown</p>
                <div className="flex justify-between text-slate-600">
                  <span>Base Rent</span>
                  <span className="font-semibold text-slate-900">${property.rent_price}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Est. Utilities (AI predicted)</span>
                  <span className="font-semibold text-slate-900">~$120</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Internet/Cable Avg.</span>
                  <span className="font-semibold text-slate-900">~$90</span>
                </div>
                <div className="flex justify-between font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Estimated Monthly</span>
                  <span>${property.rent_price + 210}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Deep Dive Accordion */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">AI Deep Dive</h3>

            <div className="space-y-2 text-xs">
              {[
                { id: "unique", title: "What makes it unique?", text: "Floor-to-ceiling double-glazed windows provide uninterrupted panoramic skyline views with optimized thermal insulation." },
                { id: "concerns", title: "Possible concerns", text: "The primary kitchen counter length is slightly smaller than suburban standard homes, but compensated by custom pull-out prep drawers." },
                { id: "suited", title: "Best suited for", text: "Young professionals and remote workers seeking a stylish, light-filled central sanctuary close to tech hubs." },
                { id: "avoid", title: "Who should avoid it", text: "Families requiring multi-car garage storage or large private outdoor backyards." },
              ].map((item) => {
                const isOpen = openAccordion === item.id;
                return (
                  <div key={item.id} className="border border-slate-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenAccordion(isOpen ? null : item.id)}
                      className="w-full px-4 py-3 bg-slate-50/60 hover:bg-slate-100 text-left font-bold text-slate-800 flex justify-between items-center transition"
                    >
                      <span>{item.title}</span>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-white text-slate-600 leading-relaxed">
                        {item.text}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Neighborhood Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">Neighborhood Context</h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
                  <p className="text-2xl font-black text-amber-700">92</p>
                  <p className="text-xs font-bold text-slate-600">Walkability</p>
                </div>
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <p className="text-2xl font-black text-emerald-700">A+</p>
                  <p className="text-xs font-bold text-slate-600">Safety Rating</p>
                </div>
              </div>
            </div>

            {/* Detailed Match Metrics */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">Detailed Match Metrics</h3>
              <div className="space-y-3 text-xs">
                {[
                  { label: "Budget", score: 95, status: "Excellent" },
                  { label: "Commute", score: 88, status: "Great" },
                  { label: "Natural Light", score: 98, status: "Superb" },
                  { label: "Noise Level", score: 92, status: "Quiet" },
                ].map((m, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>{m.label}</span>
                      <span className="text-indigo-600">{m.status}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${m.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ask AI About This Property Chat Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <h3 className="font-extrabold text-white text-base">Ask AI about this property</h3>
            </div>

            {/* Suggestions Chips */}
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                "Will this be noisy on weekends?",
                "Can I WFH comfortably here?",
                "How is the cell reception?",
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskAi(undefined, q)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-full border border-slate-700 transition"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Q&A Thread */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {aiChatHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl text-xs leading-relaxed ${
                    item.sender === "user"
                      ? "bg-indigo-600/30 text-indigo-100 ml-8 border border-indigo-500/30"
                      : "bg-slate-800 text-slate-200 mr-8 border border-slate-700"
                  }`}
                >
                  <p className="font-bold text-[10px] uppercase text-indigo-300 mb-1">
                    {item.sender === "user" ? "You" : "HomiFind AI"}
                  </p>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={(e) => handleAskAi(e)} className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                placeholder="Type your question..."
                value={aiChatInput}
                onChange={(e) => setAiChatInput(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Sticky Action Sidebar (Right col) */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 bg-white rounded-2xl border border-slate-200 p-6 shadow-xl space-y-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">Take the next step</h3>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => onBookVisit(property)}
                className="w-full py-3.5 px-4 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Visit</span>
              </button>

              <button
                onClick={() => onChatOwner(property)}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Chat with Owner</span>
              </button>

              <button
                onClick={() => onApply(property)}
                className="w-full py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2"
              >
                <FileCheck className="h-4 w-4" />
                <span>Apply Now</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <button
                onClick={() => onToggleSave(property.id)}
                className="w-full py-2 text-slate-600 hover:text-slate-900 font-semibold flex items-center justify-center space-x-1.5"
              >
                <Heart className={`h-4 w-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                <span>{isSaved ? "Saved in Wishlist" : "Save for later"}</span>
              </button>

              <button
                onClick={() => onCompare(property)}
                className="w-full py-2 text-slate-600 hover:text-slate-900 font-semibold flex items-center justify-center space-x-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>Add to compare</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
