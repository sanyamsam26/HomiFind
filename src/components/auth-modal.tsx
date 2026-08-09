import React, { useState } from "react";
import { UserRole } from "../types/database";
import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Building2, Home, Briefcase, ShieldCheck, Mail, Lock, User, Phone, ArrowRight, KeyRound, FileBadge, Loader2 } from "lucide-react";
import { signInWithPassword, signUpWithPassword } from "../services/auth-service";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "signup" | "signin";
  defaultRole?: UserRole;
  onSuccess: (user: { id: string; name: string; email: string; role: UserRole; verified: boolean }) => void;
}

const roles: Array<{ role: UserRole; label: string; desc: string; icon: React.ReactNode }> = [
  { role: "renter", label: "Renter", desc: "Find & apply to homes", icon: <Home className="h-5 w-5" /> },
  { role: "owner", label: "Owner", desc: "List & manage units", icon: <Building2 className="h-5 w-5" /> },
  { role: "broker", label: "Broker", desc: "Manage listings & deals", icon: <Briefcase className="h-5 w-5" /> },
];

export function AuthModal({ isOpen, onClose, defaultMode = "signup", defaultRole = "renter", onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"signup" | "signin">(defaultMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const switchMode = (next: "signup" | "signin") => {
    setMode(next);
    setErrorMsg(null);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) return setErrorMsg("Email and password are required.");
    if (password.length < 6) return setErrorMsg("Password must be at least 6 characters.");
    if (mode === "signup" && !fullName.trim()) return setErrorMsg("Please enter your full name.");
    if (mode === "signup" && selectedRole === "broker" && !licenseNumber.trim()) return setErrorMsg("Broker license number is required.");

    setIsLoading(true);
    try {
      if (mode === "signin") {
        const user = await signInWithPassword(cleanEmail, password);
        onSuccess(user);
        onClose();
        return;
      }

      const result = await signUpWithPassword(fullName, cleanEmail, password, selectedRole, phone, licenseNumber);
      if (result.needsEmailConfirmation) {
        setMessage("Account created. Check your email to confirm your account, then sign in.");
        switchMode("signin");
        return;
      }
      if (!result.user) throw new Error("Account creation succeeded but no user was returned. Please sign in.");
      onSuccess(result.user);
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed. Please try again.";
      setErrorMsg(message.replace(/^AuthApiError:\s*/i, ""));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={mode === "signup" ? "Create your HomiFind account" : "Welcome back"} description={mode === "signup" ? "One account for renters, owners and brokers." : "Sign in securely with your HomiFind account."} maxWidth="lg">
      <div className="space-y-5">
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          {(["signup", "signin"] as const).map((item) => (
            <button key={item} type="button" onClick={() => switchMode(item)} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${mode === item ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
              {item === "signup" ? "Create account" : "Sign in"}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Account type</label>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((item) => (
              <button key={item.role} type="button" onClick={() => setSelectedRole(item.role)} className={`p-3 rounded-xl border text-center transition-all ${selectedRole === item.role ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                <div className="mx-auto mb-1.5 w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-emerald-600">{item.icon}</div>
                <div className="text-xs font-bold text-slate-800">{item.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {message && <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">{message}</div>}
        {errorMsg && <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && <div><label className="block text-xs font-semibold text-slate-700 mb-1">Full name</label><div className="relative"><User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><Input type="text" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-9 text-xs" autoComplete="name" /></div></div>}
          <div><label className="block text-xs font-semibold text-slate-700 mb-1">Email</label><div className="relative"><Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 text-xs" autoComplete="email" /></div></div>
          <div><label className="block text-xs font-semibold text-slate-700 mb-1">Password</label><div className="relative"><Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><Input type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 text-xs" autoComplete={mode === "signup" ? "new-password" : "current-password"} /></div></div>

          {mode === "signup" && <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label><div className="relative"><Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><Input type="tel" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9 text-xs" autoComplete="tel" /></div></div>
            {selectedRole === "broker" && <div><label className="block text-xs font-semibold text-slate-700 mb-1">Real estate license</label><div className="relative"><FileBadge className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><Input type="text" placeholder="License number" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className="pl-9 text-xs" /></div></div>}
          </div>}

          <Button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold text-xs py-2.5 rounded-xl text-white shadow-md">
            {isLoading ? <span className="flex items-center justify-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Authenticating...</span> : mode === "signup" ? <span className="flex items-center justify-center">Create secure account <ArrowRight className="ml-1.5 h-4 w-4" /></span> : <span className="flex items-center justify-center">Sign in securely <KeyRound className="ml-1.5 h-4 w-4" /></span>}
          </Button>
        </form>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500"><span className="flex items-center"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600 mr-1" /> Supabase Auth secured</span><button type="button" onClick={() => switchMode(mode === "signup" ? "signin" : "signup")} className="text-emerald-700 hover:underline font-bold">{mode === "signup" ? "Already registered? Sign in" : "Need an account? Sign up"}</button></div>
      </div>
    </Dialog>
  );
}
