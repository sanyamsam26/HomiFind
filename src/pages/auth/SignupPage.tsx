import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Building2, Check, MapPin, Compass, Sun, Layout } from "lucide-react";
import { getStableUserId } from "../../services/api";

export function SignupPage() {
  const { setCurrentUser, setCurrentRole, triggerToast } = useApp();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      triggerToast("Please agree to the Terms of Service to continue");
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const userEmail = email.trim() || "user@example.com";
      const userId = getStableUserId(userEmail);
      const user = {
        id: userId,
        name: fullName || userEmail.split("@")[0] || "New Member",
        email: userEmail,
        role: "renter" as const,
        verified: true,
      };
      setCurrentUser(user);
      setCurrentRole("renter");
      triggerToast(`Account created! Set up your AI Housing Preferences.`);
      navigate("/onboarding");
    }, 400);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user = {
        id: "google-user-1",
        name: "Google Member",
        email: "google.user@example.com",
        role: "renter" as const,
        verified: true,
      };
      setCurrentUser(user);
      setCurrentRole("renter");
      triggerToast("Signed in with Google!");
      navigate("/onboarding");
    }, 300);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#f4f6fa] font-sans text-slate-800">
      {/* Left Column: Artistic Brand Canvas */}
      <div className="lg:col-span-6 bg-gradient-to-br from-[#c3cad9] via-[#dce3f0] to-[#b8c4da] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Background Decorative Graphic Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.7),transparent_60%)] pointer-events-none" />
        
        {/* Floating Glassmorphic Graphic Cards */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-white/40 bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl pointer-events-none">
          <div className="w-[300px] h-[300px] rounded-full border border-white/50 bg-white/30 backdrop-blur-lg flex items-center justify-center">
            {/* Inner Floating Visual Cards */}
            <div className="absolute top-8 left-4 bg-white/80 backdrop-blur-md border border-white/60 p-3 rounded-2xl shadow-lg flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-indigo-600" />
              <div className="w-20 h-2.5 bg-slate-200 rounded-full" />
            </div>
            <div className="absolute top-20 right-2 bg-white/80 backdrop-blur-md border border-white/60 p-3.5 rounded-2xl shadow-lg">
              <Layout className="h-6 w-6 text-indigo-500" />
            </div>
            <div className="absolute bottom-10 left-12 bg-white/80 backdrop-blur-md border border-white/60 p-3.5 rounded-2xl shadow-lg">
              <Sun className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Top Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center space-x-2 text-[#1b206b] font-bold text-lg">
            <Building2 className="h-5 w-5" />
            <span>HomiFind AI</span>
          </Link>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-md my-auto pt-16 pb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 leading-tight">
            Discover Your<br />
            Perfect Space.
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Create an account to receive personalized AI-powered home recommendations based on your lifestyle, commute, and unique preferences.
          </p>

          <div className="mt-8 space-y-3.5">
            {[
              "Secure Authentication & Data Protection",
              "Your preferences stay strictly private",
              "Hyper-personalized AI recommendations",
            ].map((text, index) => (
              <div key={index} className="flex items-center space-x-3 text-xs sm:text-sm text-slate-700 font-medium">
                <div className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer Note */}
        <div className="relative z-10 text-[11px] text-slate-500 font-medium">
          HomiFind Intelligent Real Estate Discovery Engine
        </div>
      </div>

      {/* Right Column: Sign Up Form Card */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10 shadow-xl border border-slate-100">
          <div className="text-left mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Continue to HomiFind</h2>
            <p className="text-xs text-slate-500 mt-1">Sign up to unlock intelligent curation.</p>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center space-x-2.5 py-2.5 px-4 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* OR Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              OR
            </span>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-3 bg-[#f1f4f9] border border-transparent rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-3 bg-[#f1f4f9] border border-transparent rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-3 bg-[#f1f4f9] border border-transparent rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-start space-x-2.5 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-indigo-700 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
              />
              <label htmlFor="terms" className="text-[11px] text-slate-600 leading-tight cursor-pointer">
                I agree to HomiFind AI's{" "}
                <a href="#" className="text-indigo-900 font-medium hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-indigo-900 font-medium hover:underline">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#1b206b] hover:bg-[#141854] text-white font-medium text-xs sm:text-sm py-3 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-[#1b206b] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

