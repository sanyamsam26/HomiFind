import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole, Property, Application, Lease, MaintenanceTicket, Message, UserPreferences } from "../types/database";
import {
  INITIAL_PROPERTIES,
  MOCK_APPLICATIONS,
  MOCK_LEASES,
  MOCK_MAINTENANCE_TICKETS,
  MOCK_MESSAGES,
} from "../data/mock-properties";
import { dbService } from "../services/api";

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
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>("renter");
  const [currentUser, setCurrentStateUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem("homifind_active_user");
      return saved ? JSON.parse(saved) : {
        id: "user-sanyam-samm25",
        name: "sanyam.samm25",
        email: "sanyam.samm25@gmail.com",
        role: "renter",
        verified: true,
      };
    } catch {
      return null;
    }
  });

  const setCurrentUser = (user: UserProfile | null) => {
    setCurrentStateUser(user);
    if (user) {
      localStorage.setItem("homifind_active_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("homifind_active_user");
    }
  };

  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(["prop-1", "prop-2"]);
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [leases, setLeases] = useState<Lease[]>(MOCK_LEASES);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(MOCK_MAINTENANCE_TICKETS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [isLoadingDb, setIsLoadingDb] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");

  // Load preferences dynamically on user load or switch
  useEffect(() => {
    async function loadPreferences() {
      if (!currentUser?.id) {
        setUserPreferences(null);
        return;
      }
      const prefs = await dbService.fetchUserPreferences(currentUser.id);
      setUserPreferences(prefs);
    }
    loadPreferences();
  }, [currentUser]);

  // Sync properties and calculate dynamic match scores when preferences change
  useEffect(() => {
    async function syncDatabaseData() {
      setIsLoadingDb(true);
      try {
        const fetchedProps = await dbService.fetchProperties();
        const rawProps = fetchedProps && fetchedProps.length > 0 ? fetchedProps : INITIAL_PROPERTIES;
        
        if (currentUser?.id) {
          const personalized = await dbService.fetchPersonalizedProperties(
            currentUser.id,
            userPreferences,
            rawProps
          );
          setProperties(personalized);
        } else {
          setProperties(rawProps);
        }

        const fetchedApps = await dbService.fetchApplications();
        if (fetchedApps && fetchedApps.length > 0) {
          setApplications(fetchedApps);
        }
      } catch (e) {
        console.log("Supabase/API fetch fallback activated:", e);
      } finally {
        setIsLoadingDb(false);
      }
    }
    syncDatabaseData();
  }, [currentUser, userPreferences]);

  const saveUserPreferences = async (newPrefs: UserPreferences): Promise<boolean> => {
    const userId = currentUser?.id || "user-renter-1";
    const fullPrefs: UserPreferences = {
      ...newPrefs,
      hasCompletedOnboarding: true,
    };
    setUserPreferences(fullPrefs);
    const success = await dbService.saveUserPreferences(userId, fullPrefs);
    if (success) {
      triggerToast("AI Preferences saved to your profile!");
    }
    return success;
  };

  const hasCompletedOnboarding = Boolean(
    userPreferences?.hasCompletedOnboarding || userPreferences?.profileType
  );

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenAuth = (mode: "signup" | "signin" = "signup") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const logout = () => {
    setCurrentUser(null);
    setUserPreferences(null);
    localStorage.removeItem("homifind_active_user");
    triggerToast("Signed out successfully");
  };

  const handleToggleSaveProperty = (id: string) => {
    setSavedPropertyIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
    const isSavedNow = !savedPropertyIds.includes(id);
    triggerToast(
      isSavedNow ? "Property saved to wishlist" : "Removed property from wishlist"
    );
  };

  const handleApplySubmit = (property: Property, formData: any) => {
    const newApp: Application = {
      id: `app-${Date.now()}`,
      property_id: property.id,
      renter_id: currentUser?.id || "user-renter-1",
      status: "submitted",
      proposed_move_in_date: formData.moveInDate,
      occupants_count: formData.occupants,
      annual_income: formData.income,
      employment_status: formData.employment,
      has_pets: true,
      background_check_consent: true,
      document_paths: [],
      notes: "Submitted via HomiFind AI Application portal",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      property,
      renter: {
        id: currentUser?.id || "user-renter-1",
        role: "renter",
        full_name: currentUser?.name || "Alex Rivera",
        email: currentUser?.email || "alex.rivera@example.com",
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
    setApplications((prev) => [newApp, ...prev]);
    triggerToast(`Application submitted for ${property.title}!`);
  };

  const handleCreateMaintenance = (ticketData: any) => {
    const newTicket: MaintenanceTicket = {
      id: `maint-${Date.now()}`,
      property_id: ticketData.property_id,
      renter_id: currentUser?.id || "user-renter-1",
      title: ticketData.title,
      description: ticketData.description,
      priority: ticketData.priority,
      status: "open",
      attachment_paths: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      property: properties[0],
    };
    setMaintenanceTickets((prev) => [newTicket, ...prev]);
    triggerToast("Maintenance request submitted to property owner");
  };

  const handleSendMessage = (text: string) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: "conv-1",
      sender_id: currentUser?.id || "user-renter-1",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleCreateProperty = (newProp: Partial<Property>) => {
    const fullProp: Property = {
      id: `prop-${Date.now()}`,
      title: newProp.title || "New Property Unit",
      description: newProp.description || "Spacious urban residence",
      property_type: newProp.property_type || "apartment",
      status: "available",
      rent_price: newProp.rent_price || 2500,
      deposit_amount: newProp.deposit_amount || 2500,
      utilities_included: true,
      bedrooms: newProp.bedrooms || 2,
      bathrooms: newProp.bathrooms || 1.5,
      square_feet: newProp.square_feet || 900,
      is_pet_friendly: true,
      is_furnished: false,
      amenities: newProp.amenities || ["In-unit Washer", "Pet Friendly", "Balcony"],
      address_line1: newProp.address_line1 || "100 Prime Street",
      city: newProp.city || "New York",
      state: newProp.state || "NY",
      zip_code: newProp.zip_code || "10001",
      country: "USA",
      featured: true,
      view_count: 12,
      primary_image_url: newProp.primary_image_url || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      owner_id: currentUser?.id || "owner-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setProperties((prev) => [fullProp, ...prev]);
    triggerToast(`Listing created & live: ${fullProp.title}`);
  };

  const handleUpdateApplicationStatus = (appId: string, newStatus: Application["status"]) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
    triggerToast(`Application status updated to ${newStatus.toUpperCase()}`);
  };

  const handleUpdateTicketStatus = (ticketId: string, newStatus: MaintenanceTicket["status"]) => {
    setMaintenanceTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
    triggerToast(`Ticket status updated to ${newStatus.toUpperCase()}`);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        setCurrentUser,
        userPreferences,
        saveUserPreferences,
        hasCompletedOnboarding,
        properties,
        savedPropertyIds,
        applications,
        leases,
        maintenanceTickets,
        messages,
        isLoadingDb,
        toastMessage,
        triggerToast,
        handleToggleSaveProperty,
        handleApplySubmit,
        handleCreateMaintenance,
        handleSendMessage,
        handleCreateProperty,
        handleUpdateApplicationStatus,
        handleUpdateTicketStatus,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        handleOpenAuth,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
