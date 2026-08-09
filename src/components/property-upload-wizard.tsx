import React, { useState } from "react";
import {
  Building,
  Home,
  BedDouble,
  Hotel,
  Building2,
  MapPin,
  Upload,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Share2,
  LayoutDashboard,
  Users,
  Copy,
  CheckCircle2,
  Compass,
  DollarSign,
  Info,
  ShieldCheck,
  Zap,
  TrendingUp,
  Eye,
  CheckSquare,
  ChevronRight,
  FileText
} from "lucide-react";
import { Property } from "../types/database";

interface PropertyUploadWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (propertyData: Partial<Property>) => void;
  onGoToDashboard?: () => void;
}

export function PropertyUploadWizard({
  isOpen,
  onClose,
  onPublish,
  onGoToDashboard,
}: PropertyUploadWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(0); // 0 = Onboarding Welcome, 1-7 = Steps, 8 = Success Live

  // Form Data
  const [propertyType, setPropertyType] = useState<string>("apartment");
  const [address, setAddress] = useState<string>("1420 Premium Ave, Unit 4B");
  const [city, setCity] = useState<string>("New York");
  const [zipCode, setZipCode] = useState<string>("10028");
  const [state, setState] = useState<string>("NY");
  const [photos, setPhotos] = useState<
    { url: string; tag: string; blurry?: boolean }[]
  >([
    {
      url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      tag: "Living Room",
    },
    {
      url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      tag: "Bedroom",
      blurry: true,
    },
  ]);
  const [detectedAmenities, setDetectedAmenities] = useState<string[]>([
    "Air Conditioning",
    "King Size Bed",
    "Sectional Sofa",
    "Dining Table (6 seats)",
    "Smart TV",
    "Modern Kitchen",
  ]);
  const [manualToggles, setManualToggles] = useState({
    mealsIncluded: false,
    onSiteParking: true,
    powerBackup: false,
    petFriendly: false,
  });
  const [monthlyRent, setMonthlyRent] = useState<number>(2950);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://estateai.com/listing/p-84729-lux");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handlePublishClick = () => {
    const newPropertyData: Partial<Property> = {
      title: `${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} at ${address}`,
      description: "Luxurious open-concept space with rich natural sunlight, modern amenities, and prime city connectivity.",
      property_type: propertyType as any,
      rent_price: monthlyRent,
      deposit_amount: monthlyRent,
      bedrooms: 2,
      bathrooms: 2,
      square_feet: 1250,
      address_line1: address,
      city,
      state,
      zip_code: zipCode,
      country: "USA",
      is_pet_friendly: manualToggles.petFriendly,
      is_furnished: true,
      amenities: [...detectedAmenities, manualToggles.onSiteParking ? "Parking" : ""].filter(Boolean),
      primary_image_url: photos[0]?.url,
    };
    onPublish(newPropertyData);
    setCurrentStep(8); // Move to Success screen
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-100 min-h-[600px] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              E
            </div>
            <span className="font-bold text-slate-900 tracking-tight">EstateAI</span>
            <span className="text-xs text-slate-400 font-medium border-l border-slate-200 pl-3">
              Property Upload Wizard
            </span>
          </div>

          {currentStep >= 1 && currentStep <= 7 && (
            <div className="flex items-center space-x-4">
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                Step {currentStep} of 7
              </span>
              <button
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1"
              >
                <X className="h-4 w-4" />
                <span>Save & Exit</span>
              </button>
            </div>
          )}

          {currentStep === 0 && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Wizard Content Body */}
        <div className="flex-1 p-6 sm:p-10 overflow-y-auto">
          {/* STEP 0: ONBOARDING WELCOME SCREEN */}
          {currentStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                  Let's get your property ready for the right tenants.
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Our AI will help you create a professional listing, improve its quality score, recommend optimal market pricing, and connect you with verified renters.
                </p>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition flex items-center space-x-2"
                  >
                    <span>Create My First Listing</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-sm transition"
                  >
                    Learn More
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  Creating your first listing usually takes less than 5 minutes.
                </p>

                <div className="pt-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>AI Assisted Creation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Transparent Pricing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Verified Matching</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Easy Management</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <p className="font-bold text-slate-800 text-sm">AI Listing Assistant</p>
                    <p className="text-xs text-slate-500">Guides every step to build high-converting listings.</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <p className="font-bold text-slate-800 text-sm">AI Pricing Suggestions</p>
                    <p className="text-xs text-slate-500">Market-based rent recommendations from live comp data.</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <p className="font-bold text-slate-800 text-sm">Quality Analysis</p>
                    <p className="text-xs text-slate-500">Reviews photo clarity and details to boost inquiries.</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <p className="font-bold text-slate-800 text-sm">Tenant Matching</p>
                    <p className="text-xs text-slate-500">Matches with high-intent renters looking in your area.</p>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Your Journey to Success
                  </p>
                  <div className="flex items-center justify-around text-xs text-slate-600">
                    <div className="flex flex-col items-center">
                      <span className="h-6 w-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mb-1">1</span>
                      <span>Property Details</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="h-6 w-6 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center mb-1">2</span>
                      <span>Upload Photos</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="h-6 w-6 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center mb-1">3</span>
                      <span>AI Optimization</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="h-6 w-6 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center mb-1">4</span>
                      <span>Publish & Receive Leads</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: WHAT ARE YOU LISTING */}
          {currentStep === 1 && (
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-extrabold text-slate-900">What are you listing?</h2>
                <p className="text-slate-500 text-sm">
                  Select the type of property you'd like to list. This helps us tailor the rest of the questions.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { id: "apartment", label: "Apartment", desc: "Flats, condos, or units in a residential building", icon: Building },
                  { id: "private_room", label: "Private Room", desc: "A dedicated bedroom in a shared home", icon: BedDouble },
                  { id: "house", label: "House", desc: "Standalone single-family homes or villas", icon: Home },
                  { id: "pg", label: "PG", desc: "Paying Guest accommodations with shared facilities", icon: Hotel },
                  { id: "hostel", label: "Hostel", desc: "Dormitory-style living spaces", icon: Building2 },
                  { id: "studio", label: "Studio", desc: "Self-contained open-plan units", icon: Compass },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = propertyType === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setPropertyType(item.id)}
                      className={`p-5 rounded-2xl text-left border transition-all flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/20 shadow-md"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{item.label}</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-snug">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: WHERE IS YOUR PROPERTY */}
          {currentStep === 2 && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-extrabold text-slate-900">Where is your property?</h2>
                <p className="text-slate-500 text-sm">
                  Enter the address or verify the location pin. We'll automatically fetch neighborhood insights.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">ZIP Code</label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>
                  </div>

                  {/* AI Location Insights */}
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
                      <Sparkles className="h-4 w-4 text-amber-600" />
                      <span>AI Location Insights</span>
                    </div>
                    <div className="space-y-1.5 text-xs text-amber-900">
                      <div className="flex items-center justify-between">
                        <span>Grand Central Station</span>
                        <span className="font-semibold">12 min walk</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Central Park</span>
                        <span className="font-semibold">5 min walk</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Representation */}
                <div className="relative h-64 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex flex-col items-center justify-center p-4">
                  <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                  <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg animate-bounce">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span className="bg-slate-900/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                      {address}, {city}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: UPLOAD PHOTOS */}
          {currentStep === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">Upload your property photos</h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Our AI will automatically tag and analyze your photos to optimize your listing appearance.
                  </p>
                </div>

                {/* Dropzone */}
                <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-8 bg-indigo-50/30 text-center hover:bg-indigo-50/50 transition cursor-pointer space-y-3">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Drag & drop photos here</p>
                    <p className="text-xs text-slate-500 mt-1">or click to browse from your computer (JPG, PNG, WEBP up to 20MB)</p>
                  </div>
                </div>

                {/* Uploaded Photos Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {photos.map((photo, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden border border-slate-200 group">
                      <img src={photo.url} alt={`Upload ${i}`} className="w-full h-36 object-cover" />
                      <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        {photo.tag}
                      </div>
                      {photo.blurry && (
                        <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                          Slightly Blurry
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Panel: Live AI Analysis */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
                <div className="flex items-center space-x-2 text-indigo-700 font-bold text-sm">
                  <Sparkles className="h-4 w-4" />
                  <span>Live AI Analysis</span>
                </div>

                <div className="text-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm space-y-2">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="text-3xl font-black text-indigo-600">78<span className="text-sm font-normal text-slate-400">/100</span></div>
                  </div>
                  <p className="font-bold text-slate-800 text-xs">Listing Quality Score</p>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Good start! A score of 85+ typically results in 3x more inquiries.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Detections</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center space-x-1">
                      <Check className="h-3 w-3" />
                      <span>Living room detected</span>
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center space-x-1">
                      <Check className="h-3 w-3" />
                      <span>Bedroom detected</span>
                    </span>
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center space-x-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Good natural lighting</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recommendations</p>
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs space-y-1">
                    <p className="font-bold">Bathroom photo missing</p>
                    <p className="text-[11px] text-red-700">Listings with bathroom photos receive higher engagement.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: AI DETECTED AMENITIES */}
          {currentStep === 4 && (
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI Insight</span>
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900">AI detected these amenities</h2>
                <p className="text-slate-500 text-sm">
                  We've analyzed your photos and automatically identified features. Review and add any manual confirmations.
                </p>
              </div>

              <div className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 p-6 rounded-2xl border border-amber-100 space-y-4">
                <p className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Automatically Identified</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {detectedAmenities.map((item, idx) => (
                    <span key={idx} className="bg-white border border-amber-200 text-slate-800 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm flex items-center space-x-1.5">
                      <Zap className="h-3.5 w-3.5 text-amber-500" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">Manual Confirmation</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "mealsIncluded", label: "Meals Included", sub: "Breakfast, Lunch, or Dinner" },
                    { id: "onSiteParking", label: "On-site Parking", sub: "Dedicated spot available" },
                    { id: "powerBackup", label: "Power Backup", sub: "24/7 generator support" },
                    { id: "petFriendly", label: "Pet Friendly", sub: "Allows small pets" },
                  ].map((item) => {
                    const isChecked = (manualToggles as any)[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => setManualToggles((prev) => ({ ...prev, [item.id]: !isChecked }))}
                        className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          isChecked ? "bg-indigo-50/50 border-indigo-500" : "bg-white border-slate-200"
                        }`}
                      >
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.sub}</p>
                        </div>
                        <div className={`w-10 h-6 rounded-full transition-colors flex items-center p-1 ${isChecked ? "bg-indigo-600 justify-end" : "bg-slate-300 justify-start"}`}>
                          <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PRICE YOUR PROPERTY */}
          {currentStep === 5 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900">Let's price your property</h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Set your monthly rent. Our AI assistant analyzes local market trends to help you find the sweet spot between high yield and fast occupancy.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Monthly Rent ($)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-2xl font-bold text-slate-400">$</span>
                      <input
                        type="number"
                        value={monthlyRent}
                        onChange={(e) => setMonthlyRent(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-2xl font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Lower Yield (Fastest Fill)</span>
                      <span className="text-indigo-600 font-bold">Optimal Range</span>
                      <span>Higher Yield (Slower Fill)</span>
                    </div>
                    <input
                      type="range"
                      min={2000}
                      max={4500}
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>$2,200</span>
                      <span>$4,000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Pricing Assistant */}
              <div className="bg-gradient-to-b from-indigo-50/50 to-white p-6 rounded-2xl border border-indigo-100 space-y-4">
                <div className="flex items-center space-x-2 text-indigo-800 font-bold text-sm">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Pricing Assistant</span>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Recommended Rent</p>
                  <p className="text-3xl font-black text-indigo-900 mt-1">${monthlyRent} <span className="text-xs font-normal text-slate-500">/ mo</span></p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">+5% vs area average</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Similar listings nearby:</span>
                    <span className="font-bold text-slate-800">$2,800 – $3,200</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <p className="text-slate-400 text-[10px]">Demand</p>
                    <p className="font-bold text-slate-800 mt-0.5">High</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <p className="text-slate-400 text-[10px]">Enquiries</p>
                    <p className="font-bold text-slate-800 mt-0.5">24/wk</p>
                  </div>
                </div>

                <p className="text-xs text-indigo-950 bg-indigo-50 p-3 rounded-xl leading-relaxed">
                  At ${monthlyRent}, your property is positioned to attract high-quality tenants quickly while maximizing annual yield.
                </p>
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW LISTING */}
          {currentStep === 6 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900">Review your listing</h2>
                  <p className="text-slate-500 text-sm mt-1">Take a final look before publishing to the premium network.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <img src={photos[0]?.url} alt="Listing main" className="w-full h-56 object-cover" />
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{address}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{city}, {state} {zipCode}</p>
                      </div>
                      <span className="text-2xl font-black text-indigo-600">${monthlyRent}<span className="text-xs font-normal text-slate-500">/mo</span></span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center py-3 border-y border-slate-100 text-xs">
                      <div>
                        <p className="font-bold text-slate-900">2 Beds</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">2 Baths</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">1,250 Sq Ft</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {detectedAmenities.map((a, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Readiness Report */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
                <div className="flex items-center space-x-2 text-indigo-700 font-bold text-sm">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Readiness Report</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <p className="text-2xl font-black text-emerald-600">92/100</p>
                    <p className="text-[11px] text-slate-500 font-medium">Listing Quality</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <p className="text-2xl font-black text-indigo-600">100%</p>
                    <p className="text-[11px] text-slate-500 font-medium">Completeness</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-amber-900">Recommendation</p>
                  <p className="text-amber-800 text-[11px]">Add a floor plan to increase visibility by 24% among premium buyers.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: READY TO PUBLISH */}
          {currentStep === 7 && (
            <div className="max-w-2xl mx-auto text-center space-y-8 py-4">
              <div className="space-y-2">
                <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900">Ready to Publish</h2>
                <p className="text-slate-500 text-sm">
                  Your property profile is optimized and ready for the market. Review performance predictions below.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Listing Quality</p>
                  <p className="text-3xl font-black text-indigo-600">96<span className="text-xs text-slate-400">/100</span></p>
                  <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Exceptional</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Est. Monthly Views</p>
                  <p className="text-3xl font-black text-slate-900">2.5k+</p>
                  <span className="text-[10px] text-slate-500">Top 5% of similar</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Tenant Matching</p>
                  <p className="text-3xl font-black text-emerald-600">High</p>
                  <span className="text-[10px] text-slate-500">85% match confidence</span>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-xl text-xs flex items-center justify-center space-x-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span>AI suggests your high-quality virtual tour is driving the exceptional score.</span>
              </div>
            </div>
          )}

          {/* STEP 8: SUCCESS / CONGRATULATIONS SCREEN (IMAGE 1) */}
          {currentStep === 8 && (
            <div className="max-w-2xl mx-auto text-center space-y-8 py-6">
              <div className="space-y-4">
                <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Congratulations! Your property is now live. 🎉
                </h2>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Your listing has been successfully published to the EstateAI network and is now visible to premium buyers.
                </p>
              </div>

              {/* URL Preview Box */}
              <div className="bg-slate-100 p-2 pl-4 rounded-xl flex items-center justify-between border border-slate-200 max-w-md mx-auto">
                <span className="text-xs font-mono text-slate-600 truncate">
                  estateai.com/listing/p-84729-lux
                </span>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
                </button>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Share Listing</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Send directly to your private client network or social channels.
                  </p>
                  <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 pt-1">
                    <span>Share now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">View Dashboard</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Return to your portfolio overview and performance metrics.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      if (onGoToDashboard) onGoToDashboard();
                    }}
                    className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center space-x-1 pt-1"
                  >
                    <span>Go to dashboard</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Manage Leads</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Prepare your inbox and set up automated responses for this property.
                  </p>
                  <button
                    onClick={onClose}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center space-x-1 pt-1"
                  >
                    <span>Set up leads</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        {currentStep >= 1 && currentStep <= 7 && (
          <div className="flex items-center justify-between px-8 py-4 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center space-x-1.5 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            {currentStep < 7 ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow transition flex items-center space-x-1.5"
              >
                <span>Next Step</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handlePublishClick}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow transition flex items-center space-x-1.5"
              >
                <span>Publish Listing 🚀</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
