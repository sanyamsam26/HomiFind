export type WorkspaceType = "renter" | "owner" | "broker";

export interface WorkspaceOption {
  id: WorkspaceType;
  title: string;
  description: string;
  route: string;
}

export const WORKSPACE_OPTIONS: WorkspaceOption[] = [
  {
    id: "renter",
    title: "Find a Home",
    description: "Get AI-powered recommendations based on your budget, lifestyle, location and preferences.",
    route: "/app/explore",
  },
  {
    id: "owner",
    title: "List a Property",
    description: "List and manage your properties, receive leads and handle visits and applications.",
    route: "/owner/dashboard",
  },
  {
    id: "broker",
    title: "Manage Properties as a Broker",
    description: "Manage listings, clients, applications and conversations from a broker workspace.",
    route: "/broker/overview",
  },
];
