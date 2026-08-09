import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { UserRole, Property, Application, Lease, MaintenanceTicket, Message, UserPreferences } from "../types/database";
import { INITIAL_PROPERTIES, MOCK_APPLICATIONS, MOCK_LEASES, MOCK_MAINTENANCE_TICKETS, MOCK_MESSAGES } from "../data/mock-properties";
import { dbService } from "../services/api";
import { signOut as signOutSupabase } from "../services/auth-service";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verified: boolean;
}

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  userPreferences: UserPreferences | null;
  saveUserPreferences: (prefs: UserPreferences) => Promise<boolean>;
  hasCompletedOnboarding: boolean;
  properties: Property[];
  savedPropertyIds: string[];
  applications: Application[];
  leases: Lease[];
  maintenanceTickets: MaintenanceTicket[];
  messages: Message[];
  isLoadingDb: boolean;
  toastMessage: string | null;
  triggerToast: (msg: string) => void;
  handleToggleSaveProperty: (id: string) => void;
  handleApplySubmit: (property: Property, formData: any) => void;
  handleCreateMaintenance: (ticketData: any) => void;
  handleSendMessage: (text: string) => void;
  handleCreateProperty: (newProp: Partial<Property>) => void;
  handleUpdateApplicationStatus: (appId: string, newStatus: Application["status"]) => void;
  handleUpdateTicketStatus: (ticketId: string, newStatus: MaintenanceTicket["status"]) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: "signup" | "signin";
  setAuthMode: (mode: "signup" | "signin") => void;
  handleOpenAuth: (mode?: "signup" | "signin") => void;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function readStoredUser(): UserProfile | null {
  try {
    const saved = localStorage.getItem("homifind_active_user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function readStoredRole(): UserRole {
  const stored = localStorage.getItem("homifind_active_workspace");
  return stored === "owner" || stored === "broker" || stored === "renter" ? stored : "renter";
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>(readStoredRole);
  const [currentUser, setCurrentStateUser] = useState<UserProfile | null>(readStoredUser);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [leases, setLeases] = useState<Lease[]>(MOCK_LEASES);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(MOCK_MAINTENANCE_TICKETS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    localStorage.setItem("homifind_active_workspace", role);
  };

  const setCurrentUser = (user: UserProfile | null) => {
    setCurrentStateUser(user);
    if (user) localStorage.setItem("homifind_active_user", JSON.stringify(user));
    else {
      localStorage.removeItem("homifind_active_user");
      localStorage.removeItem("homifind_active_workspace");
      localStorage.removeItem("homifind_workspace_selected");
      localStorage.removeItem("homifind_has_owner_workspace");
      setCurrentRoleState("renter");
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function loadPreferences() {
      if (!currentUser?.id) { setUserPreferences(null); return; }
      const prefs = await dbService.fetchUserPreferences(currentUser.id);
      if (!cancelled) setUserPreferences(prefs);
    }
    void loadPreferences();
    return () => { cancelled = true; };
  }, [currentUser?.id]);

  useEffect(() => {
    let cancelled = false;
    async function syncDatabaseData() {
      if (!currentUser?.id) { setProperties(INITIAL_PROPERTIES); return; }
      setIsLoadingDb(true);
      try {
        const fetchedProps = await dbService.fetchProperties();
        const rawProps = fetchedProps.length > 0 ? fetchedProps : INITIAL_PROPERTIES;
        const personalized = await dbService.fetchPersonalizedProperties(currentUser.id, userPreferences, rawProps);
        const fetchedApps = await dbService.fetchApplications();
        if (!cancelled) {
          setProperties(personalized);
          if (fetchedApps.length > 0) setApplications(fetchedApps);
        }
      } catch (error) {
        console.error("Failed to synchronize HomiFind data", error);
      } finally {
        if (!cancelled) setIsLoadingDb(false);
      }
    }
    void syncDatabaseData();
    return () => { cancelled = true; };
  }, [currentUser?.id, userPreferences]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), 4000);
  };

  const saveUserPreferences = async (newPrefs: UserPreferences): Promise<boolean> => {
    if (!currentUser?.id) return false;
    const fullPrefs: UserPreferences = { ...newPrefs, hasCompletedOnboarding: true };
    setUserPreferences(fullPrefs);
    const success = await dbService.saveUserPreferences(currentUser.id, fullPrefs);
    triggerToast(success ? "AI preferences saved." : "Preferences saved locally. We will sync them when available.");
    return success;
  };

  const hasCompletedOnboarding = Boolean(userPreferences?.hasCompletedOnboarding || userPreferences?.profileType);

  const handleOpenAuth = (mode: "signup" | "signin" = "signup") => { setAuthMode(mode); setIsAuthModalOpen(true); };

  const logout = async () => {
    try {
      await signOutSupabase();
      triggerToast("Signed out successfully");
    } catch (error) {
      console.error("Supabase sign-out failed", error);
      triggerToast("Unable to sign out. Please try again.");
    } finally {
      setCurrentUser(null);
      setUserPreferences(null);
    }
  };

  const handleToggleSaveProperty = (id: string) => setSavedPropertyIds((prev) => prev.includes(id) ? prev.filter((propertyId) => propertyId !== id) : [...prev, id]);

  const handleApplySubmit = (property: Property, formData: any) => {
    const now = new Date().toISOString();
    const newApp: Application = {
      id: `app-${Date.now()}`, property_id: property.id, renter_id: currentUser?.id || "", status: "submitted",
      proposed_move_in_date: formData.moveInDate, occupants_count: Number(formData.occupants) || 1,
      annual_income: Number(formData.income) || 0, employment_status: formData.employment || "not_provided",
      has_pets: Boolean(formData.hasPets), background_check_consent: Boolean(formData.backgroundCheckConsent),
      document_paths: [], notes: "Submitted via HomiFind", created_at: now, updated_at: now, property,
    };
    setApplications((prev) => [newApp, ...prev]); triggerToast(`Application submitted for ${property.title}.`);
  };

  const handleCreateMaintenance = (ticketData: any) => {
    const now = new Date().toISOString();
    const newTicket: MaintenanceTicket = {
      id: `maint-${Date.now()}`, property_id: ticketData.property_id, renter_id: currentUser?.id || "",
      title: ticketData.title, description: ticketData.description, priority: ticketData.priority, status: "open",
      attachment_paths: [], created_at: now, updated_at: now,
      property: properties.find((property) => property.id === ticketData.property_id),
    };
    setMaintenanceTickets((prev) => [newTicket, ...prev]); triggerToast("Maintenance request created.");
  };

  const handleSendMessage = (text: string) => {
    if (!currentUser?.id || !text.trim()) return;
    const newMsg: Message = { id: `msg-${Date.now()}`, conversation_id: "conv-1", sender_id: currentUser.id, content: text.trim(), created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleCreateProperty = (newProp: Partial<Property>) => {
    const now = new Date().toISOString();
    const fullProp: Property = {
      id: `prop-${Date.now()}`, title: newProp.title || "New Property Unit", description: newProp.description || "",
      property_type: newProp.property_type || "apartment", status: "available", rent_price: newProp.rent_price || 0,
      deposit_amount: newProp.deposit_amount || 0, utilities_included: newProp.utilities_included ?? false,
      bedrooms: newProp.bedrooms || 0, bathrooms: newProp.bathrooms || 0, square_feet: newProp.square_feet,
      is_pet_friendly: newProp.is_pet_friendly ?? false, is_furnished: newProp.is_furnished ?? false,
      amenities: newProp.amenities || [], address_line1: newProp.address_line1 || "", city: newProp.city || "",
      state: newProp.state || "", zip_code: newProp.zip_code || "", country: newProp.country || "India",
      featured: false, view_count: 0, primary_image_url: newProp.primary_image_url, owner_id: currentUser?.id || "",
      created_at: now, updated_at: now,
    };
    setProperties((prev) => [fullProp, ...prev]); triggerToast(`Listing created: ${fullProp.title}`);
  };

  const handleUpdateApplicationStatus = (appId: string, newStatus: Application["status"]) => {
    setApplications((prev) => prev.map((app) => app.id === appId ? { ...app, status: newStatus } : app));
    triggerToast(`Application status updated to ${newStatus}.`);
  };

  const handleUpdateTicketStatus = (ticketId: string, newStatus: MaintenanceTicket["status"]) => {
    setMaintenanceTickets((prev) => prev.map((ticket) => ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket));
    triggerToast(`Ticket status updated to ${newStatus}.`);
  };

  const value = useMemo<AppContextType>(() => ({
    currentRole, setCurrentRole, currentUser, setCurrentUser, userPreferences, saveUserPreferences,
    hasCompletedOnboarding, properties, savedPropertyIds, applications, leases, maintenanceTickets, messages,
    isLoadingDb, toastMessage, triggerToast, handleToggleSaveProperty, handleApplySubmit, handleCreateMaintenance,
    handleSendMessage, handleCreateProperty, handleUpdateApplicationStatus, handleUpdateTicketStatus,
    isNotificationsOpen, setIsNotificationsOpen, isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode,
    handleOpenAuth, logout,
  }), [currentRole, currentUser, userPreferences, hasCompletedOnboarding, properties, savedPropertyIds, applications, leases,
      maintenanceTickets, messages, isLoadingDb, toastMessage, isNotificationsOpen, isAuthModalOpen, authMode]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
