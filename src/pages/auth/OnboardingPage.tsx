import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import {
  Building2,
  GraduationCap,
  Briefcase,
  Users,
  Luggage,
  Search,
  MapPin,
  Navigation,
  Train,
  Car,
  Bike,
  Footprints,
  Bus,
  Wifi,
  Wind,
  Bath,
  Utensils,
  Dumbbell,
  SquareCheck,
  Dog,
  Home,
  Sun,
  ShieldCheck,
  Zap,
  Elevator,
  Trees,
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  Edit2,
  CheckCircle2,
  Compass,
  Cpu,
  BarChart2,
  VolumeX,
} from "lucide-react";

export function OnboardingPage() {
  const { saveUserPreferences, userPreferences, hasCompletedOnboarding, setCurrentRole, triggerToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isForceEdit = searchParams.get("force") === "true";

  // Current step state (1 to 7, plus step 8 for AI Calculation Radar)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Profile
  const [userProfile, setUserProfile] = useState<string>("Working Professional");

  // Step 2: Budget
  const [minBudget, setMinBudget] = useState<number>(12000);
  const [maxBudget, setMaxBudget] = useState<number>(18000);

  // Step 3: Location / Work Destination
  const [workplace, setWorkplace] = useState<string>("Cyber Hub, Gurugram");

  // Step 4: Travel Mode
  const [travelMode, setTravelMode] = useState<string>("Metro");

  // Step 5: Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "High-Speed WiFi",
    "Central AC",
    "Secured Parking",
    "24/7 Security",
    "Natural Light",
  ]);

  // Step 6: Lifestyle Vibe
  const [lifestyle, setLifestyle] = useState<string>("Urban Pulse");

  // Step 7: Natural Language Description
  const [customDescription, setCustomDescription] = useState<string>(
    "I'm looking for a quiet private room near my office with lots of natural light and high-speed internet."
  );

  // Load existing preferences if available
  useEffect(() => {
    if (userPreferences) {
      if (userPreferences.profileType) setUserProfile(userPreferences.profileType);
      if (userPreferences.minBudget) setMinBudget(userPreferences.minBudget);
      if (userPreferences.maxBudget) setMaxBudget(userPreferences.maxBudget);
      if (userPreferences.workplace) setWorkplace(userPreferences.workplace);
      if (userPreferences.travelMode) setTravelMode(userPreferences.travelMode);
      if (userPreferences.amenities && userPreferences.amenities.length > 0) {
        setSelectedAmenities(userPreferences.amenities);
      }
      if (userPreferences.lifestyle) setLifestyle(userPreferences.lifestyle);
      if (userPreferences.customDescription) setCustomDescription(userPreferences.customDescription);
    }
  }, [userPreferences]);

  // Step 8: AI Calculation Stats
  const [propertiesAnalyzed, setPropertiesAnalyzed] = useState<number>(12488);
  const [verifiedMatches, setVerifiedMatches] = useState<number>(1289);
  const [topScore, setTopScore] = useState<number>(94);

  const totalSteps = 7;

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === totalSteps) {
      // Transition to Step 8: AI Matching Calculation
      setCurrentStep(8);
      triggerToast("AI Vector Engine active: Analyzing properties...");
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleCompleteOnboarding = async () => {
    setCurrentRole("renter");
    await saveUserPreferences({
      profileType: userProfile,
      minBudget,
      maxBudget,
      workplace,
      travelMode,
      amenities: selectedAmenities,
      lifestyle,
      customDescription,
      hasCompletedOnboarding: true,
    });
    triggerToast("Preferences saved to database! Showing your personalized AI recommendations.");
    navigate("/app/explore");
  };

  return (
    <div className="min-h-screen bg-[#f8fafd] flex flex-col font-sans text-slate-800">
      {/* Top Banner if user has already completed onboarding */}
      {hasCompletedOnboarding && !isForceEdit && (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-[#1b206b] text-white px-6 py-3.5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
            <span>
              <strong>AI Preferences Active & Saved!</strong> We already have your preferences on file ({userPreferences?.profileType || "Professional"} &bull; {userPreferences?.workplace || "Cyber Hub"}).
            </span>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => navigate("/app/explore")}
              className="px-4 py-1.5 bg-white text-[#1b206b] rounded-full font-bold hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
            >
              View My Recommendations
            </button>
          </div>
        </div>
      )}
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-200/50 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <Link to="/" className="flex items-center space-x-2 text-[#1b206b] font-bold text-xl tracking-tight">
          <Building2 className="h-6 w-6 text-[#1b206b]" />
          <span>HomiFind AI</span>
        </Link>

        <div className="text-xs font-semibold text-slate-500">
          {currentStep <= totalSteps ? (
            <span className="uppercase tracking-wider font-extrabold text-[#1b206b]">
              Step {currentStep} of {totalSteps}
            </span>
          ) : (
            <span className="text-emerald-700 font-extrabold flex items-center">
              <Sparkles className="h-3.5 w-3.5 mr-1" /> AI Real-Time Matching
            </span>
          )}
        </div>
      </header>

      {/* Progress Bar Header */}
      {currentStep <= totalSteps && (
        <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
          <div
            className="bg-[#1b206b] h-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full flex flex-col justify-center items-center">
        {/* ================= STEP 1: TELL US ABOUT YOURSELF ================= */}
        {currentStep === 1 && (
          <div className="w-full max-w-2xl bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-md space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                STEP 1 OF 7 &bull; Profile
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Tell us about yourself
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Who are you?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "Student", label: "Student", icon: <GraduationCap className="h-6 w-6" /> },
                { id: "Working Professional", label: "Working Professional", icon: <Briefcase className="h-6 w-6" /> },
                { id: "Family", label: "Family", icon: <Users className="h-6 w-6" /> },
                { id: "Relocating", label: "Relocating", icon: <Luggage className="h-6 w-6" /> },
              ].map((opt) => {
                const isSelected = userProfile === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setUserProfile(opt.id)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-3 ${
                      isSelected
                        ? "border-[#1b206b] bg-indigo-50/40 ring-2 ring-[#1b206b]/20 text-[#1b206b]"
                        : "border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/80 text-slate-700"
                    }`}
                  >
                    <div className={`p-3 rounded-2xl ${isSelected ? "bg-[#1b206b] text-white" : "bg-slate-200/60 text-slate-600"}`}>
                      {opt.icon}
                    </div>
                    <span className="text-sm font-bold">{opt.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex flex-col items-center space-y-3">
              <button
                onClick={handleNextStep}
                className="w-full sm:w-auto px-10 py-3 rounded-full bg-[#1b206b] hover:bg-[#141854] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center"
              >
                <span>Continue</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                onClick={handleNextStep}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: MONTHLY BUDGET ================= */}
        {currentStep === 2 && (
          <div className="w-full max-w-2xl bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-md space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="flex justify-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                  <div
                    key={s}
                    className={`h-1 rounded-full transition-all ${
                      s <= currentStep ? "w-6 bg-[#1b206b]" : "w-4 bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                STEP 2 OF 7
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                What's your monthly budget?
              </h1>
            </div>

            <div className="py-6 text-center space-y-6">
              <div className="text-3xl sm:text-4xl font-black text-[#1b206b] tracking-tight">
                ₹{minBudget.toLocaleString()} &mdash; ₹{maxBudget.toLocaleString()}
              </div>

              <div className="space-y-4 px-4">
                <input
                  type="range"
                  min="5000"
                  max="80000"
                  step="1000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-[#1b206b] cursor-pointer"
                />
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>₹5,000</span>
                  <span>₹50,000+</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center cursor-pointer"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
              </button>
              <button
                onClick={handleNextStep}
                className="px-8 py-3 rounded-full bg-[#1b206b] hover:bg-[#141854] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center"
              >
                <span>Continue</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: WORK / STUDY DESTINATION ================= */}
        {currentStep === 3 && (
          <div className="w-full max-w-2xl bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-md space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                STEP 3 OF 7
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Where do you work or study?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto">
                We'll optimize your property recommendations to ensure a seamless daily commute.
              </p>
            </div>

            {/* Location Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={workplace}
                onChange={(e) => setWorkplace(e.target.value)}
                className="w-full pl-11 pr-10 py-3 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#1b206b] shadow-2xs"
                placeholder="Enter workplace or university address..."
              />
              <Navigation className="absolute right-4 top-3.5 h-4 w-4 text-[#1b206b] cursor-pointer" />
            </div>

            {/* Interactive Commute Map Card */}
            <div className="rounded-2xl border border-slate-200/80 overflow-hidden bg-slate-50 grid grid-cols-1 md:grid-cols-12 gap-0">
              <div className="md:col-span-7 h-48 bg-slate-200 relative overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                  alt="Interactive Commute Map"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-indigo-950/20 backdrop-blur-[1px]" />
                <div className="absolute p-3 rounded-2xl bg-white/95 shadow-md flex items-center space-x-2 border border-white">
                  <div className="p-1.5 bg-[#1b206b] text-white rounded-lg">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-900">{workplace}</div>
                    <div className="text-[9px] text-slate-500 font-semibold">Primary Target Destination</div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 p-5 bg-white flex flex-col justify-center space-y-3">
                <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-[10px] w-fit flex items-center">
                  <Sparkles className="h-3 w-3 mr-1 text-amber-600" /> Commute Preview
                </span>
                <h3 className="text-lg font-bold text-slate-900">{workplace}</h3>
                <p className="text-[11px] text-slate-500 leading-snug font-medium">
                  Analyzing optimal neighborhoods within a 30-minute radius.
                </p>

                <div className="space-y-2 pt-1 text-[11px]">
                  <div className="flex items-center space-x-2 text-slate-700 font-medium">
                    <Car className="h-4 w-4 text-[#1b206b] shrink-0" />
                    <span><strong>Target:</strong> Under 30 mins (Normal Traffic)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-700 font-medium">
                    <Train className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span><strong>Transit:</strong> Near Metro Stations</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center cursor-pointer"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
              </button>
              <button
                onClick={handleNextStep}
                className="px-8 py-3 rounded-full bg-[#1b206b] hover:bg-[#141854] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center"
              >
                <span>Continue</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: TRAVEL MODE ================= */}
        {currentStep === 4 && (
          <div className="w-full max-w-2xl bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-md space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                STEP 4 OF 7
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                How do you usually travel?
              </h1>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { id: "Metro", label: "Metro / Train", icon: <Train className="h-6 w-6" /> },
                { id: "Car", label: "Car", icon: <Car className="h-6 w-6" /> },
                { id: "Bike", label: "Bike / Scooter", icon: <Bike className="h-6 w-6" /> },
                { id: "Walk", label: "Walk", icon: <Footprints className="h-6 w-6" /> },
                { id: "Bus", label: "Bus", icon: <Bus className="h-6 w-6" /> },
              ].map((opt) => {
                const isSelected = travelMode === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setTravelMode(opt.id)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-3 ${
                      isSelected
                        ? "border-[#1b206b] bg-indigo-50/50 ring-2 ring-[#1b206b]/20 text-[#1b206b]"
                        : "border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/80 text-slate-700"
                    }`}
                  >
                    <div className={`p-3 rounded-2xl ${isSelected ? "bg-[#1b206b] text-white" : "bg-slate-200/60 text-slate-600"}`}>
                      {opt.icon}
                    </div>
                    <span className="text-xs font-bold">{opt.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center cursor-pointer"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
              </button>
              <button
                onClick={handleNextStep}
                className="px-8 py-3 rounded-full bg-[#1b206b] hover:bg-[#141854] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center"
              >
                <span>Continue</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: WHAT MATTERS MOST (AMENITIES) ================= */}
        {currentStep === 5 && (
          <div className="w-full max-w-2xl bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-md space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                STEP 5 OF 7
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                What matters most?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto">
                Select the amenities and features that are non-negotiable for your ideal living space.
              </p>
            </div>

            {/* Pill Chips Grid */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {[
                "High-Speed WiFi",
                "Central AC",
                "Attached Bathroom",
                "Included Meals",
                "Fitness Center",
                "Secured Parking",
                "Pet Friendly",
                "Private Balcony",
                "Quiet Area",
                "24/7 Security",
                "Housekeeping",
                "Power Backup",
                "Elevator Access",
                "Garden Access",
                "Natural Light",
              ].map((item) => {
                const isSelected = selectedAmenities.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAmenity(item)}
                    className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center border ${
                      isSelected
                        ? "bg-[#1b206b] text-white border-[#1b206b] shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 mr-1.5 text-white" />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center cursor-pointer"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
              </button>
              <button
                onClick={handleNextStep}
                className="px-8 py-3 rounded-full bg-[#1b206b] hover:bg-[#141854] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center"
              >
                <span>Continue</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 6: LIFESTYLE & VIBE ================= */}
        {currentStep === 6 && (
          <div className="w-full max-w-4xl bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-md space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                STEP 6 OF 7
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1b206b] tracking-tight">
                Choose your lifestyle.
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg mx-auto">
                Select the aesthetic and vibe that best aligns with how you want to live. Our AI uses this to curate your perfect matches.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  id: "Minimalist",
                  title: "Minimalist",
                  subtitle: "Clean lines, essential spaces",
                  img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
                },
                {
                  id: "Urban Pulse",
                  title: "Urban Pulse",
                  subtitle: "City lights, modern apartment",
                  img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
                },
                {
                  id: "Quiet Sanctuary",
                  title: "Quiet Sanctuary",
                  subtitle: "Nature, private garden",
                  img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
                },
                {
                  id: "Social Hub",
                  title: "Social Hub",
                  subtitle: "Open kitchen, entertaining area",
                  img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
                },
              ].map((card) => {
                const isSelected = lifestyle === card.id;
                return (
                  <div
                    key={card.id}
                    onClick={() => setLifestyle(card.id)}
                    className={`h-72 rounded-3xl overflow-hidden relative cursor-pointer group transition-all ${
                      isSelected
                        ? "ring-4 ring-[#1b206b] scale-[1.02] shadow-xl"
                        : "opacity-80 hover:opacity-100 hover:shadow-md"
                    }`}
                  >
                    <img src={card.img} alt={card.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <h3 className="text-lg font-bold drop-shadow-sm">{card.title}</h3>
                      <p className="text-[11px] text-slate-200 mt-0.5 font-medium leading-snug">{card.subtitle}</p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-4 right-4 h-7 w-7 rounded-full bg-[#1b206b] text-white flex items-center justify-center shadow-md">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center cursor-pointer"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
              </button>
              <button
                onClick={handleNextStep}
                className="px-8 py-3 rounded-full bg-[#1b206b] hover:bg-[#141854] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center"
              >
                <span>Continue</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 7: NATURAL LANGUAGE DESCRIPTION & REVIEW ================= */}
        {currentStep === 7 && (
          <div className="w-full max-w-2xl bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-md space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                STEP 7 OF 7 &bull; ALMOST THERE
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1b206b] tracking-tight">
                Describe your ideal home.
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto">
                Tell us what you're looking for in your own words. Our AI will use this to refine your matches perfectly.
              </p>
            </div>

            {/* AI Textarea */}
            <div className="relative">
              <textarea
                rows={3}
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                className="w-full p-4 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#1b206b] bg-slate-50/50 shadow-2xs font-medium"
                placeholder="I'm looking for a quiet private room near my office with lots of natural light..."
              />
              <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-extrabold flex items-center">
                <Sparkles className="h-3 w-3 mr-1 text-amber-600" /> AI Assisted
              </span>
            </div>

            {/* Final Review Grid */}
            <div className="pt-2 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Final Review</h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Location */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase">LOCATION</div>
                  <div className="font-bold text-slate-900 mt-0.5">{workplace}</div>
                  <div className="text-[11px] text-slate-500">Commute: &lt; 30 mins</div>
                  <button onClick={() => setCurrentStep(3)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-700">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Property Type */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase">PROPERTY TYPE</div>
                  <div className="font-bold text-slate-900 mt-0.5">Private Room in Apartment</div>
                  <div className="text-[11px] text-slate-500">Furnished, Shared Bathroom</div>
                  <button onClick={() => setCurrentStep(1)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-700">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Budget */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase">BUDGET</div>
                  <div className="font-bold text-slate-900 mt-0.5">₹{minBudget.toLocaleString()} - ₹{maxBudget.toLocaleString()} / mo</div>
                  <div className="text-[11px] text-slate-500">Utilities included</div>
                  <button onClick={() => setCurrentStep(2)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-700">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Vibe & Amenities */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase">VIBE & AMENITIES</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="px-1.5 py-0.5 rounded bg-slate-200/70 text-[10px] font-bold text-slate-700">{lifestyle}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-200/70 text-[10px] font-bold text-slate-700">{selectedAmenities[0]}</span>
                  </div>
                  <button onClick={() => setCurrentStep(5)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-700">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 text-center">
              <button
                onClick={handleNextStep}
                className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-[#1b206b] hover:bg-[#141854] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer inline-flex items-center justify-center"
              >
                <span>Find My Perfect Home</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 8: REAL-TIME AI VECTOR CALCULATION SCREEN ================= */}
        {currentStep === 8 && (
          <div className="w-full max-w-5xl space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1b206b] tracking-tight">
                Finding your perfect home...
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg mx-auto">
                Our AI is analyzing thousands of verified properties based on your lifestyle, commute, budget, and preferences.
              </p>
            </div>

            {/* Stepper Node Progress */}
            <div className="flex items-center justify-center space-x-6 text-xs font-bold text-slate-500 py-2">
              <div className="flex items-center space-x-2 text-[#1b206b]">
                <div className="h-6 w-6 rounded-full bg-[#1b206b] text-white flex items-center justify-center">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>Understanding You</span>
              </div>
              <div className="h-0.5 w-12 bg-[#1b206b]" />
              <div className="flex items-center space-x-2 text-[#1b206b]">
                <div className="h-6 w-6 rounded-full bg-[#1b206b] text-white flex items-center justify-center">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>Analyzing Homes</span>
              </div>
              <div className="h-0.5 w-12 bg-[#1b206b]" />
              <div className="flex items-center space-x-2 text-[#1b206b]">
                <div className="h-6 w-6 rounded-full bg-[#1b206b] text-white flex items-center justify-center animate-pulse">
                  <Cpu className="h-3.5 w-3.5 animate-spin" />
                </div>
                <span>Calculating Scores</span>
              </div>
              <div className="h-0.5 w-12 bg-slate-200" />
              <div className="flex items-center space-x-2 text-slate-400">
                <div className="h-6 w-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
                  4
                </div>
                <span>Recommendations</span>
              </div>
            </div>

            {/* 3 Main Display Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Box: Thinking Process */}
              <div className="md:col-span-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
                <span className="text-[10px] font-extrabold uppercase text-amber-700 tracking-wider flex items-center">
                  <Sparkles className="h-3 w-3 mr-1 text-amber-600" /> THINKING PROCESS
                </span>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">Understanding lifestyle</div>
                      <div className="text-[10px] text-slate-500 leading-snug">Processed preferences for quiet neighborhoods</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">Finding neighborhoods</div>
                      <div className="text-[10px] text-slate-500 leading-snug">Identified 4 key districts matching criteria</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <Cpu className="h-4 w-4 text-[#1b206b] shrink-0 mt-0.5 animate-spin" />
                    <div>
                      <div className="font-bold text-[#1b206b]">Calculating commute</div>
                      <div className="text-[10px] text-slate-500 leading-snug">Mapping routes to tech hub...</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 opacity-40">
                    <div className="h-4 w-4 rounded-full border border-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-700">Verifying amenities</div>
                      <div className="text-[10px] text-slate-500 leading-snug">Checking for nearby parks</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Box: Glowing 3D Vector Sphere Radar Animation */}
              <div className="md:col-span-6 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md flex flex-col items-center justify-center relative overflow-hidden min-h-[280px]">
                <div className="relative h-44 w-44 flex items-center justify-center">
                  {/* Glowing pulses */}
                  <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping" />
                  <div className="absolute inset-4 rounded-full bg-indigo-600/20 animate-pulse" />
                  <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-[#1b206b] to-indigo-500 text-white flex items-center justify-center shadow-2xl relative z-10 border-4 border-indigo-200/50">
                    <Compass className="h-14 w-14 animate-spin text-indigo-100" />
                  </div>
                  {/* Floating badge label */}
                  <div className="absolute bottom-2 bg-white px-3 py-1 rounded-full text-[10px] font-extrabold text-[#1b206b] shadow-md border border-indigo-100 flex items-center z-20">
                    <Trees className="h-3 w-3 mr-1 text-emerald-600" /> Near Park & Metro
                  </div>
                </div>
              </div>

              {/* Right Box: Live Analysis Stats */}
              <div className="md:col-span-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
                <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider flex items-center">
                  <BarChart2 className="h-3 w-3 mr-1 text-[#1b206b]" /> LIVE ANALYSIS STATS
                </span>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">Properties Analyzed</div>
                    <div className="text-2xl font-black text-slate-900">{propertiesAnalyzed.toLocaleString()}</div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div className="bg-amber-500 h-full w-3/4 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">Verified Matches</div>
                    <div className="text-2xl font-black text-[#1b206b]">{verifiedMatches.toLocaleString()}</div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div className="bg-[#1b206b] h-full w-1/2 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">Top Score So Far</div>
                    <div className="text-2xl font-black text-emerald-600">{topScore} <span className="text-xs text-slate-400 font-normal">/100</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom AI Reasoning Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex items-start space-x-4">
              <div className="p-3 rounded-2xl bg-indigo-50 text-[#1b206b] shrink-0">
                <Cpu className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-[#1b206b] uppercase tracking-wider">AI Reasoning Engine</h4>
                <p className="text-xs sm:text-sm text-slate-700 italic font-medium leading-relaxed">
                  "Your commute appears to be a high priority. I'm prioritizing properties within a 30-minute radius of {workplace}, while ensuring they still meet your requirement for natural light and workspace suitability."
                </p>
              </div>
            </div>

            {/* Final Navigation CTA */}
            <div className="pt-2 text-center">
              <button
                onClick={handleCompleteOnboarding}
                className="px-10 py-3.5 rounded-full bg-[#1b206b] hover:bg-[#141854] text-white font-extrabold text-xs sm:text-sm shadow-lg transition-all cursor-pointer inline-flex items-center"
              >
                <span>View My AI Recommendations</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-200/60 bg-white/50">
        <div className="max-w-xl mx-auto flex items-center justify-between px-6 text-[11px] text-slate-400 font-medium">
          <span className="font-bold text-[#1b206b]">HomiFind AI</span>
          <div className="flex space-x-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="hover:underline cursor-pointer">AI Ethics</span>
          </div>
          <span>&copy; 2026 HomiFind AI</span>
        </div>
      </footer>
    </div>
  );
}
