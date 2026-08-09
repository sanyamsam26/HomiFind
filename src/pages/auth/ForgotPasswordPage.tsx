import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Sparkles, Lock, Shield, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#f4f6fa] font-sans text-slate-800">
      {/* Left Column: Glass Overlay Image Canvas */}
      <div className="lg:col-span-6 relative p-8 sm:p-12 flex flex-col justify-between overflow-hidden min-h-[450px] lg:min-h-screen bg-slate-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-slate-950/30" />

        {/* Center Frosted Glass Card from Screenshot 2 */}
        <div className="relative z-10 my-auto max-w-sm mx-auto bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-2xl shadow-2xl space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
            <Building2 className="h-5 w-5 text-indigo-900" />
            <span>HomiFind AI</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">Forgot Password?</h2>
          <p className="text-xs text-slate-800 font-medium leading-relaxed">
            Please enter the email address associated with your account to receive a verification code.
          </p>
        </div>

        {/* Bottom Glass Card */}
        <div className="relative z-10 max-w-sm mx-auto bg-white/60 backdrop-blur-md border border-white/70 p-5 rounded-2xl shadow-lg">
          <div className="inline-flex items-center text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-1">
            <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-600" />
            Intelligence in Every Home
          </div>
          <h3 className="text-lg font-bold text-slate-900">Curated Discovery.</h3>
          <p className="text-xs text-slate-700 mt-1 leading-relaxed">
            Let our AI guide you back to your personalized home gallery.
          </p>
        </div>
      </div>

      {/* Right Column: Reset Form */}
      <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 sm:p-12">
        {/* Top Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center space-x-2 text-[#1b206b] font-bold text-xl">
            <Building2 className="h-6 w-6 text-[#1b206b]" />
            <span>HomiFind AI</span>
          </Link>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10 shadow-xl border border-slate-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {sent ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <div className="h-10 w-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-emerald-950">Reset Link Sent</h3>
              <p className="text-xs text-emerald-800">
                Check <span className="font-semibold">{email}</span> for instructions to reset your password.
              </p>
              <div className="pt-2">
                <Link
                  to="/auth/login"
                  className="inline-flex items-center text-xs font-semibold text-[#1b206b] hover:underline"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <button
                type="submit"
                className="w-full bg-[#1b206b] hover:bg-[#141854] text-white font-medium text-xs sm:text-sm py-3 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                Send Reset Link
              </button>

              <div className="pt-2 text-center">
                <Link
                  to="/auth/login"
                  className="inline-flex items-center text-xs text-slate-600 hover:text-[#1b206b] font-medium"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Return to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Security Icons Footer */}
        <div className="mt-8 flex items-center justify-center space-x-4 text-slate-400">
          <Lock className="h-4 w-4" />
          <Shield className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

