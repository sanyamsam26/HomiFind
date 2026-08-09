import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Building2, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { signInWithGoogle, signInWithPassword } from "../../services/auth-service";
import { listWorkspaces, workspaceHome } from "../../services/workspace-service";

export function LoginPage() {
  const { triggerToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const continueAfterAuth = async () => {
    if (redirectPath) {
      navigate(redirectPath, { replace: true });
      return;
    }

    try {
      const workspaces = (await listWorkspaces()).filter((item) => item.is_active);
      if (workspaces.length === 0) {
        navigate("/choose-experience", { replace: true });
        return;
      }

      // Prefer the renter journey when an account has both workspaces.
      const preferred = workspaces.find((item) => item.workspace === "renter") ?? workspaces[0];
      localStorage.setItem("homifind_active_workspace", preferred.workspace);
      localStorage.setItem("homifind_workspace_selected", "true");
      navigate(workspaceHome(preferred.workspace), { replace: true });
    } catch {
      navigate("/choose-experience", { replace: true });
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await signInWithPassword(email.trim(), password);
      triggerToast("Welcome back to HomiFind.");
      await continueAfterAuth();
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : "Unable to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : "Google sign-in failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#f4f6fa] font-sans text-slate-800">
      <div className="lg:col-span-6 relative p-8 sm:p-12 flex flex-col justify-between overflow-hidden min-h-[500px] lg:min-h-screen bg-slate-900">
        <div className="absolute inset-0 bg-cover bg-center opacity-85" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-slate-950/40" />
        <div className="relative z-10"><Link to="/discover" className="inline-flex items-center gap-2 text-white font-bold text-xl"><span className="p-2 bg-indigo-600 rounded-xl"><Building2 className="h-5 w-5" /></span>HomiFind <span className="text-indigo-300 text-sm">AI</span></Link></div>
        <div className="relative z-10 max-w-md my-auto py-12"><h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">Discover with<br /><span className="text-indigo-200">Intelligence.</span></h1><p className="mt-4 text-sm text-slate-100 leading-relaxed bg-slate-950/55 backdrop-blur-md p-4 rounded-2xl border border-white/15">AI-powered property recommendations based on your budget, lifestyle, commute and real preferences.</p><div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/95 p-4 shadow-xl"><Sparkles className="h-6 w-6 text-amber-500" /><div><div className="text-sm font-bold">Personalized Match Score</div><div className="text-xs text-slate-500">Find homes that fit you, not just your filters.</div></div></div></div>
      </div>
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10 shadow-xl border border-slate-100">
          <div className="text-center mb-6"><h2 className="text-2xl font-semibold text-slate-900">Welcome Back</h2><p className="text-xs text-slate-500 mt-1">Sign in to continue your HomiFind journey.</p></div>
          <button type="button" onClick={handleGoogleSignIn} disabled={isLoading} className="w-full py-3 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50">Continue with Google</button>
          <div className="relative my-6 text-center"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div><span className="relative bg-white px-3 text-[11px] font-semibold text-slate-400">OR</span></div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div><label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label><div className="relative"><Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" /><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="name@example.com" /></div></div>
            <div><div className="flex justify-between mb-1"><label className="text-xs font-medium text-slate-700">Password</label><Link to="/auth/forgot-password" className="text-xs font-semibold text-indigo-900">Forgot Password?</Link></div><div className="relative"><Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" /><input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" placeholder="••••••••" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3.5 top-3 text-slate-400">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
            <button type="submit" disabled={isLoading} className="w-full bg-[#1b206b] hover:bg-[#141854] text-white font-medium py-3 rounded-lg disabled:opacity-50">{isLoading ? "Signing In..." : "Sign In"}</button>
          </form>
          <p className="mt-6 text-center text-xs text-slate-500">Don't have an account? <Link to="/auth/signup" className="text-[#1b206b] font-semibold">Create an Account</Link></p>
        </div>
      </div>
    </div>
  );
}
