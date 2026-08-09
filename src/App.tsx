import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthBootstrap } from "./features/auth/components/AuthBootstrap";
import { PublicLayout } from "./layouts/PublicLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { HomePage } from "./pages/marketing/HomePage";
import { AboutPage } from "./pages/marketing/AboutPage";
import { PricingPage } from "./pages/marketing/PricingPage";
import { ContactPage } from "./pages/marketing/ContactPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { OnboardingPage } from "./pages/auth/OnboardingPage";
import { ExperienceSelectionPage } from "./features/workspace/pages/ExperienceSelectionPage";
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
import { BrokerOverviewPage } from "./pages/broker/BrokerOverviewPage";
import { BrokerListingsPage } from "./pages/broker/BrokerListingsPage";
import { BrokerApplicationsPage } from "./pages/broker/BrokerApplicationsPage";
import { BrokerMessagesPage } from "./pages/broker/BrokerMessagesPage";
import { LoadingPage } from "./pages/system/LoadingPage";
import { ErrorPage } from "./pages/system/ErrorPage";
import { NotFoundPage } from "./pages/system/NotFoundPage";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AuthBootstrap />
        <Routes>
          <Route path="/" element={<Navigate to="/discover" replace />} />
          <Route element={<PublicLayout />}>
            <Route path="/discover" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/callback" element={<LoadingPage />} />
          </Route>
          <Route element={<ProtectedLayout />}>
            <Route path="/choose-experience" element={<ExperienceSelectionPage />} />
            <Route path="/onboarding" element={<Navigate to="/choose-experience" replace />} />
            <Route path="/app/onboarding" element={<OnboardingPage />} />
          </Route>
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
          <Route element={<ProtectedLayout requiredRole="broker" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/broker" element={<Navigate to="/broker/overview" replace />} />
              <Route path="/broker/overview" element={<BrokerOverviewPage />} />
              <Route path="/broker/listings" element={<BrokerListingsPage />} />
              <Route path="/broker/applications" element={<BrokerApplicationsPage />} />
              <Route path="/broker/messages" element={<BrokerMessagesPage />} />
            </Route>
          </Route>
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
