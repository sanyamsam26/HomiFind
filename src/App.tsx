import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

// Shared Layouts
import { PublicLayout } from "./layouts/PublicLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { ProtectedLayout } from "./layouts/ProtectedLayout";

// Marketing Routes
import { HomePage } from "./pages/marketing/HomePage";
import { AboutPage } from "./pages/marketing/AboutPage";
import { PricingPage } from "./pages/marketing/PricingPage";
import { ContactPage } from "./pages/marketing/ContactPage";

// Auth Routes
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { OnboardingPage } from "./pages/auth/OnboardingPage";

// Application Routes (Renter)
import { ExplorePage } from "./pages/app/ExplorePage";
import { PropertyDetailPage } from "./pages/app/PropertyDetailPage";
import { ApplicationsPage } from "./pages/app/ApplicationsPage";
import { SavedPropertiesPage } from "./pages/app/SavedPropertiesPage";
import { MaintenancePage } from "./pages/app/MaintenancePage";
import { MessagesPage } from "./pages/app/MessagesPage";
import { ComparePropertiesPage } from "./pages/app/ComparePropertiesPage";
import { NotificationsPage } from "./pages/app/NotificationsPage";
import { ProfilePage } from "./pages/app/ProfilePage";
import { VisitsPage } from "./pages/app/VisitsPage";

// Owner Routes
import { OwnerDashboardPage } from "./pages/owner/OwnerDashboardPage";
import { OwnerPropertiesPage } from "./pages/owner/OwnerPropertiesPage";
import { NewPropertyPage } from "./pages/owner/NewPropertyPage";
import { OwnerApplicationsPage } from "./pages/owner/OwnerApplicationsPage";
import { OwnerLeasesPage } from "./pages/owner/OwnerLeasesPage";
import { OwnerMaintenancePage } from "./pages/owner/OwnerMaintenancePage";
import { OwnerMessagesPage } from "./pages/owner/OwnerMessagesPage";
import { OwnerOnboardingPage } from "./pages/owner/OwnerOnboardingPage";
import { OwnerLeadsPage } from "./pages/owner/OwnerLeadsPage";
import { OwnerVisitsPage } from "./pages/owner/OwnerVisitsPage";
import { OwnerAnalyticsPage } from "./pages/owner/OwnerAnalyticsPage";
import { OwnerVerificationPage } from "./pages/owner/OwnerVerificationPage";
import { OwnerSubscriptionPage } from "./pages/owner/OwnerSubscriptionPage";

// Broker Routes
import { BrokerOverviewPage } from "./pages/broker/BrokerOverviewPage";
import { BrokerListingsPage } from "./pages/broker/BrokerListingsPage";
import { BrokerApplicationsPage } from "./pages/broker/BrokerApplicationsPage";
import { BrokerMessagesPage } from "./pages/broker/BrokerMessagesPage";

// System Routes
import { LoadingPage } from "./pages/system/LoadingPage";
import { ErrorPage } from "./pages/system/ErrorPage";
import { NotFoundPage } from "./pages/system/NotFoundPage";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Default Start Route - Always Start from Signup Page */}
          <Route path="/" element={<Navigate to="/auth/signup" replace />} />

          {/* Public / Marketing Layout Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/discover" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Authentication Layout Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Experience Selector Onboarding Route */}
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Application Routes (Renter Workspace) */}
          <Route element={<ProtectedLayout requiredRole="renter" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/app" element={<Navigate to="/app/explore" replace />} />
              <Route path="/app/explore" element={<ExplorePage />} />
              <Route path="/app/properties/:id" element={<PropertyDetailPage />} />
              <Route path="/app/applications" element={<ApplicationsPage />} />
              <Route path="/app/saved" element={<SavedPropertiesPage />} />
              <Route path="/app/maintenance" element={<MaintenancePage />} />
              <Route path="/app/messages" element={<MessagesPage />} />
              <Route path="/app/compare" element={<ComparePropertiesPage />} />
              <Route path="/app/visits" element={<VisitsPage />} />
              <Route path="/app/notifications" element={<NotificationsPage />} />
              <Route path="/app/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Owner Routes */}
          <Route element={<ProtectedLayout requiredRole="owner" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/owner" element={<Navigate to="/owner/dashboard" replace />} />
              <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
              <Route path="/owner/onboarding" element={<OwnerOnboardingPage />} />
              <Route path="/owner/properties" element={<OwnerPropertiesPage />} />
              <Route path="/owner/properties/new" element={<NewPropertyPage />} />
              <Route path="/owner/leads" element={<OwnerLeadsPage />} />
              <Route path="/owner/visits" element={<OwnerVisitsPage />} />
              <Route path="/owner/applications" element={<OwnerApplicationsPage />} />
              <Route path="/owner/leases" element={<OwnerLeasesPage />} />
              <Route path="/owner/maintenance" element={<OwnerMaintenancePage />} />
              <Route path="/owner/messages" element={<OwnerMessagesPage />} />
              <Route path="/owner/analytics" element={<OwnerAnalyticsPage />} />
              <Route path="/owner/verification" element={<OwnerVerificationPage />} />
              <Route path="/owner/subscription" element={<OwnerSubscriptionPage />} />
            </Route>
          </Route>

          {/* Broker Routes */}
          <Route element={<ProtectedLayout requiredRole="broker" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/broker" element={<Navigate to="/broker/overview" replace />} />
              <Route path="/broker/overview" element={<BrokerOverviewPage />} />
              <Route path="/broker/listings" element={<BrokerListingsPage />} />
              <Route path="/broker/applications" element={<BrokerApplicationsPage />} />
              <Route path="/broker/messages" element={<BrokerMessagesPage />} />
            </Route>
          </Route>

          {/* System Fallback & 404 Routes */}
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
