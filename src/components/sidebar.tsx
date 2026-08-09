import React from "react";
import {
  LayoutDashboard,
  Search,
  Heart,
  FileText,
  Wrench,
  MessageSquare,
  Building,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  ShieldCheck,
  PlusCircle,
  Calendar,
  Layers,
  Bell,
  User,
} from "lucide-react";
import { UserRole } from "../types/database";

interface SidebarProps {
  currentRole: UserRole;
  activeNav: string;
  onNavChange: (navId: string) => void;
  onNewListingClick?: () => void;
}

export function Sidebar({
  currentRole,
  activeNav,
  onNavChange,
  onNewListingClick,
}: SidebarProps) {
  const navItemsByRole: Record<
    UserRole,
    { id: string; label: string; icon: React.ReactNode; badge?: string }[]
  > = {
    renter: [
      { id: "explore", label: "AI Match & Workspace", icon: <Search className="h-4 w-4" /> },
      { id: "saved", label: "Saved Homes", icon: <Heart className="h-4 w-4" />, badge: "4" },
      { id: "compare", label: "Compare Homes", icon: <Layers className="h-4 w-4" /> },
      { id: "visits", label: "Scheduled Tours", icon: <Calendar className="h-4 w-4" />, badge: "2" },
      { id: "applications", label: "My Applications", icon: <FileText className="h-4 w-4" />, badge: "1" },
      { id: "messages", label: "Direct Messages", icon: <MessageSquare className="h-4 w-4" /> },
      { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
      { id: "profile", label: "Profile & Search Persona", icon: <User className="h-4 w-4" /> },
    ],
    owner: [
      { id: "dashboard", label: "Portfolio Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
      { id: "properties", label: "My Properties", icon: <Building className="h-4 w-4" />, badge: "8" },
      { id: "leads", label: "Pre-Screened Leads", icon: <Users className="h-4 w-4" />, badge: "3" },
      { id: "visits", label: "Tour Requests", icon: <Calendar className="h-4 w-4" />, badge: "2" },
      { id: "applications", label: "Tenant Applications", icon: <FileText className="h-4 w-4" /> },
      { id: "messages", label: "Tenant Chat", icon: <MessageSquare className="h-4 w-4" /> },
      { id: "analytics", label: "Yield & Analytics", icon: <TrendingUp className="h-4 w-4" /> },
      { id: "verification", label: "Verification Status", icon: <ShieldCheck className="h-4 w-4" /> },
      { id: "subscription", label: "Owner Plan & Billing", icon: <DollarSign className="h-4 w-4" /> },
    ],
    broker: [
      { id: "overview", label: "Agency Overview", icon: <TrendingUp className="h-4 w-4" /> },
      { id: "listings", label: "Agency Listings", icon: <Building className="h-4 w-4" />, badge: "15" },
      { id: "pipeline", label: "Deals Pipeline", icon: <Users className="h-4 w-4" /> },
      { id: "applications", label: "Client Screening", icon: <FileText className="h-4 w-4" /> },
      { id: "messages", label: "Client Conversations", icon: <MessageSquare className="h-4 w-4" /> },
    ],
    vendor: [],
    admin: [],
  };

  const items = navItemsByRole[currentRole] || [];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200/80 bg-slate-50/50 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Call to action for owners/brokers */}
        {(currentRole === "owner" || currentRole === "broker") && (
          <button
            onClick={onNewListingClick}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all cursor-pointer active:scale-98"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create New Listing</span>
          </button>
        )}

        {/* Navigation Group */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            {currentRole} Menu
          </p>
          <nav className="mt-2 space-y-1">
            {items.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavChange(item.id)}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-emerald-950 font-semibold shadow-xs border border-slate-200"
                      : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={
                        isActive ? "text-emerald-600 font-bold" : "text-slate-400"
                      }
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="rounded-xl border border-emerald-100 bg-gradient-to-b from-emerald-50/50 to-teal-50/30 p-3.5 space-y-2">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-900">
            pgvector Semantic Match
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-snug">
          Real-time AI property similarity vector database active on PostgreSQL.
        </p>
      </div>
    </aside>
  );
}
