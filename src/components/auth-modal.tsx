import React, { useState } from "react";
import {
  UserRole,
} from "../types/database";
import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Building2,
  Home,
  Briefcase,
  ShieldCheck,
  Mail,
  Lock,
  User,
  Phone,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  KeyRound,
  FileBadge,
} from "lucide-react";
import { getStableUserId } from "../services/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "signup" | "signin";
  defaultRole?: UserRole;
  onSuccess: (user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    verified: boolean;
  }) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  defaultMode = "signup",
  defaultRole = "renter",
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<"signup" | "signin">(defaultMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please fill in all required credentials.");
      return;
    }

    if (mode === "signup" && !fullName) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    setIsLoading(true);

    // Simulate Auth Latency & DB registration
    setTimeout(() => {
      setIsLoading(false);
      const userEmail = email.trim() || "user@homifind.com";
      const generatedUser = {
        id: getStableUserId(userEmail),
        name: mode === "signup" ? (fullName || userEmail.split("@")[0]) : (email.split("@")[0] || "Authenticated User"),
        email: userEmail,
        role: selectedRole,
        verified: true,
      };
      onSuccess(generatedUser);
      onClose();
    }, 600);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const demoUsers: Partial<Record<UserRole, { id: string; name: string; email: string; role: UserRole; verified: boolean }>> = {
        renter: {
          id: "user-renter-1",
          name: "Alex Rivera",
          email: "alex.rivera@example.com",
          role: "renter",
          verified: true,
        },
        owner: {
          id: "owner-1",
          name: "Sarah Jenkins",
          email: "sarah.j@homifind.com",
          role: "owner",
          verified: true,
        },
        broker: {
          id: "broker-1",
          name: "Marcus Vance",
          email: "m.vance@primebrokers.com",
          role: "broker",
          verified: true,
        },
      };

      const selectedUser = demoUsers[role] || {
        id: `user-${Date.now()}`,
        name: `${role.toUpperCase()} User`,
        email: `${role}@homifind.com`,
        role,
        verified: true,
      };

      onSuccess(selectedUser);
      onClose();
    }, 300);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "signup" ? "Create HomiFind Account" : "Welcome Back to HomiFind"}
      description={
        mode === "signup"
          ? "Join thousands of verified renters, property owners, and licensed brokers."
          : "Sign in to manage your rental applications, listings, and tenant messages."
      }
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Toggle Mode Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === "signup"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Sign Up (New User)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === "signin"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Role Selector Cards */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Select Your Account Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                role: "renter" as UserRole,
                label: "Renter",
                desc: "Find & Apply to Homes",
                icon: <Home className="h-5 w-5 text-teal-600" />,
                activeBorder: "border-teal-500 bg-teal-50/50 text-teal-950",
              },
              {
                role: "owner" as UserRole,
                label: "Owner",
                desc: "List & Manage Units",
                icon: <Building2 className="h-5 w-5 text-indigo-600" />,
                activeBorder: "border-indigo-500 bg-indigo-50/50 text-indigo-950",
              },
              {
                role: "broker" as UserRole,
                label: "Broker",
                desc: "Agent Portal & Deals",
                icon: <Briefcase className="h-5 w-5 text-purple-600" />,
                activeBorder: "border-purple-500 bg-purple-50/50 text-purple-950",
              },
            ].map((item) => {
              const isSelected = selectedRole === item.role;
              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => setSelectedRole(item.role)}
                  className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? `${item.activeBorder} ring-2 ring-emerald-500/30 shadow-xs font-bold`
                      : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-white shadow-2xs mb-1.5">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold">{item.label}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Demo Fast Login Shortcuts */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 p-3.5 border border-emerald-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-900 flex items-center">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 mr-1" />
              Demo Instant Auth (1-Click Login)
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">Pre-verified accounts</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("renter")}
              className="py-1.5 px-2 bg-white hover:bg-emerald-100 text-slate-800 text-[11px] font-semibold rounded-lg border border-emerald-200 shadow-2xs text-center transition-colors cursor-pointer"
            >
              As Renter (Alex)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("owner")}
              className="py-1.5 px-2 bg-white hover:bg-emerald-100 text-slate-800 text-[11px] font-semibold rounded-lg border border-emerald-200 shadow-2xs text-center transition-colors cursor-pointer"
            >
              As Owner (Sarah)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("broker")}
              className="py-1.5 px-2 bg-white hover:bg-emerald-100 text-slate-800 text-[11px] font-semibold rounded-lg border border-emerald-200 shadow-2xs text-center transition-colors cursor-pointer"
            >
              As Broker (Marcus)
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {errorMsg}
          </div>
        )}

        {/* Credential Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="e.g. Eleanor Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
          </div>

          {mode === "signup" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="tel"
                    placeholder="+1 (555) 019-2831"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              {selectedRole === "broker" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Real Estate License #
                  </label>
                  <div className="relative">
                    <FileBadge className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="RE-891042-NY"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="pl-9 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold text-xs py-2.5 rounded-xl text-white shadow-md transition-all cursor-pointer"
            >
              {isLoading ? (
                "Processing Authentication..."
              ) : mode === "signup" ? (
                <span className="flex items-center justify-center">
                  Create Account & Access Portal <ArrowRight className="ml-1.5 h-4 w-4" />
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Sign In to Account <KeyRound className="ml-1.5 h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
        </form>

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 mr-1" /> 256-bit Encrypted
          </span>
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "signin" : "signup");
              setErrorMsg(null);
            }}
            className="text-emerald-700 hover:underline font-bold cursor-pointer"
          >
            {mode === "signup"
              ? "Already have an account? Sign In"
              : "Need a new account? Sign Up"}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
