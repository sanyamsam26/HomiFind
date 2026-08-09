import React from "react";
import {
  Building2,
  Sparkles,
  Bell,
  User,
  ShieldCheck,
  CheckCircle,
  Briefcase,
  Home,
  MessageSquare,
  Search,
  LogOut,
} from "lucide-react";
import { UserRole } from "../types/database";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onOpenMessages?: () => void;
  onOpenAuthModal?: (mode?: "signup" | "signin") => void;
  currentUser?: { name: string; email: string; role: UserRole; verified: boolean } | null;
  onLogout?: () => void;
}

export function Navbar({
  currentRole,
  onRoleChange,
  unreadCount = 3,
  onOpenNotifications,
  onOpenMessages,
  onOpenAuthModal,
  currentUser,
  onLogout,
}: NavbarProps) {
  const roles: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    {
      role: "renter",
      label: "Renter Portal",
      icon: <Home className="h-4 w-4" />,
      color: "hover:text-teal-600",
    },
    {
      role: "owner",
      label: "Property Owner",
      icon: <Building2 className="h-4 w-4" />,
      color: "hover:text-indigo-600",
    },
    {
      role: "broker",
      label: "Broker Hub",
      icon: <Briefcase className="h-4 w-4" />,
      color: "hover:text-purple-600",
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-sm text-white font-bold">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900">
                Homi<span className="text-emerald-600">Find</span>
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                <Sparkles className="mr-1 h-2.5 w-2.5" /> AI Powered
              </span>
            </div>
            <span className="text-[10px] font-medium text-slate-400 -mt-1 hidden sm:block">
              Next-Gen Property Matching & Management
            </span>
          </div>
        </div>

        {/* Workspace Role Switcher */}
        <div className="hidden md:flex items-center space-x-1 rounded-xl bg-slate-100/80 p-1 border border-slate-200">
          {roles.map((item) => {
            const isActive = currentRole === item.role;
            return (
              <button
                key={item.role}
                onClick={() => onRoleChange(item.role)}
                className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobile Role selector dropdown */}
          <div className="md:hidden">
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800"
            >
              <option value="renter">Renter</option>
              <option value="owner">Owner</option>
              <option value="broker">Broker</option>
            </select>
          </div>

          <button
            onClick={onOpenMessages}
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            title="Messages"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>

          <button
            onClick={onOpenNotifications}
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile & Auth Trigger */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            {currentUser ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex items-center space-x-2 bg-slate-100/90 pl-2 pr-2.5 py-1 rounded-xl border border-slate-200">
                  <Avatar name={currentUser.name} role={currentUser.role} size="sm" />
                  <div className="hidden sm:flex flex-col text-left leading-tight">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[110px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium truncate max-w-[110px]">
                      {currentUser.email}
                    </span>
                  </div>
                  <span className="ml-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wide">
                    {currentUser.role}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl cursor-pointer flex items-center space-x-1 px-2.5 py-1.5 border border-rose-200/80"
                  title="Sign Out of HomiFind"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenAuthModal && onOpenAuthModal("signin")}
                  className="hidden sm:inline-flex text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => onOpenAuthModal && onOpenAuthModal("signup")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-2xs cursor-pointer"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
