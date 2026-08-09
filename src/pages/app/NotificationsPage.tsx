import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Bell, CheckCircle2, Sparkles, Calendar, DollarSign, ArrowRight, ShieldCheck, Filter } from "lucide-react";

export function NotificationsPage() {
  const { triggerToast } = useApp();
  const [filter, setFilter] = useState<"all" | "unread" | "visits" | "matches">("all");

  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      title: "In-Person Tour Confirmed",
      desc: "Owner Sarah Jenkins confirmed your visit for Soho Luxury Loft tomorrow at 2:00 PM.",
      time: "10 mins ago",
      type: "visits",
      read: false,
      badge: "Visit Confirmed",
      link: "/app/messages",
    },
    {
      id: "notif-2",
      title: "New AI Match Available (98% Score)",
      desc: "A new property in Upper West Side matches your commute, natural light, and budget preferences.",
      time: "1 hour ago",
      type: "matches",
      read: false,
      badge: "98% Match",
      link: "/app/explore",
    },
    {
      id: "notif-3",
      title: "Application Status Update",
      desc: "Your background check and income verification were successfully approved by Landlord Verification system.",
      time: "3 hours ago",
      type: "all",
      read: true,
      badge: "Verified",
      link: "/app/applications",
    },
    {
      id: "notif-[#]",
      title: "Price Reduction Alert",
      desc: "Tribeca Penthouse dropped rent by $200/mo. Saved in your wishlist.",
      time: "1 day ago",
      type: "matches",
      read: true,
      badge: "Price Drop",
      link: "/app/saved",
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    triggerToast("All notifications marked as read");
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "visits") return n.type === "visits";
    if (filter === "matches") return n.type === "matches";
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-[#1b206b]">
              <Bell className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Notifications & Alerts</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time updates on tour confirmations, application reviews, and new AI property matches.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {[
          { id: "all", label: "All Activity" },
          { id: "unread", label: "Unread" },
          { id: "visits", label: "Scheduled Tours" },
          { id: "matches", label: "AI Matches & Price Drops" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              filter === tab.id
                ? "bg-[#1b206b] text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <Bell className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No Notifications Found</h3>
            <p className="text-xs text-slate-500 mt-0.5">You're all caught up for now!</p>
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                !n.read
                  ? "bg-indigo-50/40 border-indigo-200 shadow-2xs"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div
                  className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    n.type === "visits"
                      ? "bg-amber-100 text-amber-700"
                      : n.type === "matches"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {n.type === "visits" ? (
                    <Calendar className="h-4 w-4" />
                  ) : n.type === "matches" ? (
                    <Sparkles className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xs font-bold text-slate-900">{n.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                      {n.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.desc}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                </div>
              </div>

              {!n.read && (
                <div className="shrink-0 h-2.5 w-2.5 rounded-full bg-indigo-600 self-end sm:self-center" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
