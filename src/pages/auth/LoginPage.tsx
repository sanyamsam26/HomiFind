import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Building2, Mail, Lock, Eye, EyeOff, Sparkles, UserCheck, Key, Shield } from "lucide-react";
import { UserRole } from "../../types/database";
import { dbService, getStableUserId } from "../../services/api";

export function LoginPage() {
  const { setCurrentUser, setCurrentRole, triggerToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const userEmail = email.trim() || "member@homifind.com";
    const userId = getStableUserId(userEmail);
    const isOwnerEmail = userEmail.toLowerCase().includes("owner") || userEmail.toLowerCase().includes("landlord");
    const isBrokerEmail = userEmail.toLowerCase().includes("broker") || userEmail.toLowerCase().includes("agent");
    const detectedRole: UserRole = isOwnerEmail ? "owner" : isBrokerEmail ? "broker" : "renter";

    const user = {
      id: userId,
      name: userEmail.split("@")[0] || "Authenticated Member",
      email: userEmail,
      role: detectedRole,
      verified: true,
    };

    setCurrentUser(user);
    setCurrentRole(detectedRole);

    // Fetch existing preferences for this user ID
    const existingPrefs = await dbService.fetchUserPreferences(userId);

    setIsLoading(false);

    if (redirectPath) {
      navigate(redirectPath);
      return;
    }

    if (detectedRole === "owner") {
      triggerToast(`Welcome back, ${user.name}!`);
      navigate("/owner/dashboard");
    } else if (detectedRole === "broker") {
      triggerToast(`Welcome back, ${user.name}!`);
      navigate("/broker/overview");
    } else {
      // Renter role: Check if they have completed preferences or onboarding
      if (!existingPrefs || !existingPrefs.hasCompletedOnboarding) {
        triggerToast(`Welcome ${user.name}! Please set your housing preferences.`);
        navigate("/onboarding");
      } else {
        triggerToast(`Welcome back, ${user.name}! AI matching preferences active.`);
        navigate("/app/explore");
      }
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user = {
        id: "google-user-1",
        name: "Alex Rivera",
        email: "alex.rivera@example.com",
        role: "renter" as UserRole,
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
      {/* Left Column: High-Res Interior Photo Canvas */}
      <div className="lg:col-span-6 relative p-8 sm:p-12 flex flex-col justify-between overflow-hidden min-h-[500px] lg:min-h-screen bg-slate-900">
        {/* Living Room Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-85 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-slate-950/40" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center space-x-2 text-white font-bold text-lg drop-shadow-md">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-white font-extrabold text-xl tracking-tight drop-shadow-md">HomiFind <span className="text-indigo-400 font-semibold text-sm px-2 py-0.5 rounded-full bg-white/10 border border-white/20 ml-1">AI</span></span>
          </Link>
        </div>

        {/* Hero Copy & Feature Cards */}
        <div className="relative z-10 max-w-md my-auto pt-12 pb-8">
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
            Discover with<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-indigo-200 to-white">Intelligence.</span>
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-slate-100 font-medium leading-relaxed max-w-sm bg-slate-950/60 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg">
            Experience a frictionless journey to your perfect home. Our AI curates properties that match your lifestyle, not just your budget.
          </p>

          <div className="mt-8 space-y-3.5">
            {/* Curated Matches Chip */}
            <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 shadow-xl">
              <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm font-bold">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Curated AI Matches</div>
                <div className="text-[11px] text-slate-600 mt-0.5 leading-snug font-medium">
                  Receive highly personalized recommendations based on deep learning & lifestyle preferences.
                </div>
              </div>
            </div>

            {/* Transparent Insights Chip */}
            <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 shadow-xl">
              <div className="h-10 w-10 rounded-xl bg-[#1b206b] text-white flex items-center justify-center shrink-0 shadow-sm font-bold">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Transparent Insights</div>
                <div className="text-[11px] text-slate-600 mt-0.5 leading-snug font-medium">
                  Understand the true value, commute metrics, and investment potential of every property.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Sign In Card */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10 shadow-xl border border-slate-100">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Welcome Back</h2>
            <p className="text-xs text-slate-500 mt-1">Sign in to continue your home search.</p>
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

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-700">Password</label>
                <Link to="/auth/forgot-password" className="text-[11px] font-semibold text-[#1b206b] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-indigo-700 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-slate-600 cursor-pointer">
                Remember Me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#1b206b] hover:bg-[#141854] text-white font-medium text-xs sm:text-sm py-3 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <Link to="/auth/signup" className="text-[#1b206b] font-semibold hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

