import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Navbar } from "../components/navbar";
import { Sidebar } from "../components/sidebar";
import { AuthModal } from "../components/auth-modal";
import { Dialog } from "../components/ui/dialog";
import { Bell, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { UserRole } from "../types/database";
import { dbService } from "../services/api";

export function DashboardLayout() {
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    setCurrentUser,
    toastMessage,
    triggerToast,
    isNotificationsOpen,
    setIsNotificationsOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    handleOpenAuth,
    logout,
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  // Extract activeNav from location pathname
  const pathParts = location.pathname.split("/").filter(Boolean);
  const activeNav = pathParts[1] || (currentRole === "renter" ? "explore" : currentRole === "owner" ? "dashboard" : "overview");

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === "renter") navigate("/app/explore");
    else if (role === "owner") navigate("/owner/dashboard");
    else if (role === "broker") navigate("/broker/overview");
    triggerToast(`Switched workspace to ${role.toUpperCase()} mode`);
  };

  const handleNavChange = (navId: string) => {
    const rolePrefix = currentRole === "renter" ? "app" : currentRole;
    navigate(`/${rolePrefix}/${navId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main App Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        unreadCount={3}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenMessages={() => handleNavChange("messages")}
        onOpenAuthModal={handleOpenAuth}
        currentUser={currentUser}
        onLogout={logout}
      />

      {/* App Workspace Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-3">
            <Sidebar
              currentRole={currentRole}
              activeNav={activeNav}
              onNavChange={handleNavChange}
            />
          </div>

          {/* Main Outlet Workspace */}
          <main className="lg:col-span-9 space-y-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Modal: Notifications Drawer */}
      <Dialog
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        title="Recent Workspace Notifications"
        description="Live status updates from landlords, broker verifications, and lease submissions."
        maxWidth="md"
      >
        <div className="space-y-3 pt-2">
          {[
            {
              title: "Application Received",
              time: "10 mins ago",
              desc: "Owner Sarah Jenkins opened your application for Modern Upper West Side Apartment.",
              type: "success",
            },
            {
              title: "AI Match Score Updated",
              time: "1 hour ago",
              desc: "98% AI Match found in Soho Loft for your lifestyle preferences.",
              type: "info",
            },
            {
              title: "Visit Scheduled",
              time: "Yesterday",
              desc: "In-person tour confirmed for tomorrow at 2:00 PM.",
              type: "warning",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3"
            >
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <span className="text-[10px] text-slate-400">{item.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Dialog>

      {/* Modal: Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
        defaultRole={currentRole}
        onSuccess={async (user) => {
          setCurrentUser(user);
          setCurrentRole(user.role);
          triggerToast(`Welcome ${user.name}! Signed in as ${user.role.toUpperCase()}`);
          if (user.role === "renter") {
            const prefs = await dbService.fetchUserPreferences(user.id);
            if (!prefs || !prefs.hasCompletedOnboarding) {
              navigate("/onboarding");
            } else {
              navigate("/app/explore");
            }
          } else if (user.role === "owner") navigate("/owner/dashboard");
          else if (user.role === "broker") navigate("/broker/overview");
        }}
      />
    </div>
  );
}
