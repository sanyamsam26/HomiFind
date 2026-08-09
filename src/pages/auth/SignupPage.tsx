import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Check, Sparkles } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { signInWithGoogle, signUpWithPassword } from "../../services/auth-service";

export function SignupPage() {
  const { triggerToast } = useApp();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!agreed) { triggerToast("Please agree to the Terms of Service to continue."); return; }
    setIsLoading(true);
    try {
      const result = await signUpWithPassword(fullName.trim(), email.trim(), password);
      if (result.needsEmailConfirmation) {
        triggerToast("Account created. Check your email to confirm your account, then sign in.");
        navigate("/auth/login");
      } else {
        triggerToast("Account created. Let's personalize your HomiFind experience.");
        navigate("/choose-experience");
      }
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : "Unable to create your account.");
    } finally { setIsLoading(false); }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try { await signInWithGoogle(); }
    catch (error) { triggerToast(error instanceof Error ? error.message : "Google sign-in failed."); setIsLoading(false); }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#f4f6fa] font-sans text-slate-800">
      <div className="lg:col-span-6 bg-gradient-to-br from-[#c3cad9] via-[#dce3f0] to-[#b8c4da] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
        <div><Link to="/discover" className="inline-flex items-center gap-2 text-[#1b206b] font-bold text-xl"><Building2 className="h-5 w-5" />HomiFind <span className="text-indigo-600">AI</span></Link></div>
        <div className="max-w-md my-auto py-16"><h1 className="text-4xl font-semibold text-slate-900">Find a place that<br />fits <span className="text-indigo-700">your life.</span></h1><p className="mt-4 text-sm text-slate-600 leading-relaxed">Create one account and choose whether you want to find a home, list a property, or do both.</p><div className="mt-8 space-y-3">{["AI-powered property matching", "Personalized Match Score", "Renter and owner workspaces"].map((text) => <div key={text} className="flex items-center gap-3 text-sm font-medium"><span className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center"><Check className="h-3 w-3" /></span>{text}</div>)}</div></div>
      </div>
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10 shadow-xl border border-slate-100">
          <div className="mb-6"><div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold mb-3"><Sparkles className="h-4 w-4" />HomiFind AI</div><h2 className="text-2xl font-semibold">Create your account</h2><p className="text-xs text-slate-500 mt-1">Your role comes next — one account can support multiple experiences.</p></div>
          <button type="button" onClick={handleGoogleSignIn} disabled={isLoading} className="w-full py-3 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50">Continue with Google</button>
          <div className="relative my-6 text-center"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div><span className="relative bg-white px-3 text-[11px] text-slate-400">OR</span></div>
          <form onSubmit={handleSignup} className="space-y-4">
            <input type="text" required placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
            <input type="email" required placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
            <input type="password" required minLength={8} placeholder="Password (minimum 8 characters)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
            <label className="flex items-start gap-2 text-[11px] text-slate-600"><input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5" />I agree to HomiFind's Terms of Service and Privacy Policy.</label>
            <button type="submit" disabled={isLoading} className="w-full bg-[#1b206b] hover:bg-[#141854] text-white font-medium py-3 rounded-lg disabled:opacity-50">{isLoading ? "Creating Account..." : "Create Account"}</button>
          </form>
          <p className="mt-6 text-center text-xs text-slate-500">Already have an account? <Link to="/auth/login" className="text-[#1b206b] font-semibold">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}
