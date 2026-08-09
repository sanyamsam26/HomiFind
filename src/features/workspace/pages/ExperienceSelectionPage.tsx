import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Check, Home, PlusCircle, Sparkles } from "lucide-react";
import { useApp } from "../../../context/AppContext";
import { workspaceService } from "../api/workspace-service";
import { WORKSPACE_OPTIONS, WorkspaceType } from "../types";

export function ExperienceSelectionPage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentRole, triggerToast } = useApp();
  const [isSaving, setIsSaving] = useState(false);

  const selectWorkspace = async (workspace: WorkspaceType) => {
    if (!currentUser) return;

    setIsSaving(true);
    try {
      const persisted = await workspaceService.enable(currentUser.id, workspace);
      if (persisted) {
        triggerToast("Workspace saved to your HomiFind account.");
      }

      setCurrentRole(workspace);
      localStorage.setItem("homifind_workspace_selected", "true");
      localStorage.setItem("homifind_active_workspace", workspace);

      const option = WORKSPACE_OPTIONS.find((item) => item.id === workspace);
      if (!option) return;

      if (workspace === "renter") {
        navigate("/app/onboarding");
        return;
      }

      if (workspace === "owner") {
        navigate("/owner/onboarding");
        return;
      }

      navigate(option.route);
    } finally {
      setIsSaving(false);
    }
  };

  const chooseBoth = async () => {
    if (!currentUser) return;

    setIsSaving(true);
    try {
      await Promise.all([
        workspaceService.enable(currentUser.id, "renter"),
        workspaceService.enable(currentUser.id, "owner"),
      ]);
      localStorage.setItem("homifind_workspace_selected", "true");
      localStorage.setItem("homifind_has_owner_workspace", "true");
      localStorage.setItem("homifind_active_workspace", "renter");
      setCurrentRole("renter");
      triggerToast("Both renter and owner experiences are enabled for this account.");
      navigate("/app/onboarding");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-10">
          <div className="mx-auto mb-5 h-12 w-12 rounded-2xl bg-[#1b206b] text-white flex items-center justify-center shadow-lg">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700 mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Personalize HomiFind
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            What would you like to do today?
          </h1>
          <p className="mt-3 text-sm text-slate-500 max-w-xl mx-auto">
            One account can support multiple experiences. Choose where you want to start—we can enable another workspace later.
          </p>
          {currentUser && (
            <p className="mt-2 text-xs text-slate-400">Signed in as {currentUser.email}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <WorkspaceCard
            icon={<Home className="h-6 w-6" />}
            title="Find a Home"
            description="Browse properties and let HomiFind rank the best matches for you."
            onClick={() => void selectWorkspace("renter")}
            disabled={isSaving}
          />
          <WorkspaceCard
            icon={<PlusCircle className="h-6 w-6" />}
            title="List a Property"
            description="Upload a property, use AI-assisted listing tools and manage leads."
            onClick={() => void selectWorkspace("owner")}
            disabled={isSaving}
          />
          <WorkspaceCard
            icon={<Building2 className="h-6 w-6" />}
            title="Broker Workspace"
            description="Manage listings, clients, applications and conversations as a broker."
            onClick={() => void selectWorkspace("broker")}
            disabled={isSaving}
          />
        </div>

        <button
          type="button"
          onClick={() => void chooseBoth()}
          disabled={isSaving}
          className="mx-auto mt-6 flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-5 py-3 text-xs font-bold text-[#1b206b] shadow-sm hover:bg-indigo-50 transition-colors disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          I want to find a home and list a property
        </button>
      </div>
    </div>
  );
}

function WorkspaceCard({
  icon,
  title,
  description,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group text-left bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300 transition-all disabled:opacity-60 disabled:hover:translate-y-0"
    >
      <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-[#1b206b] flex items-center justify-center mb-6 group-hover:bg-[#1b206b] group-hover:text-white transition-colors">
        {icon}
      </div>
      <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      <span className="inline-flex mt-6 text-xs font-bold text-[#1b206b]">Continue →</span>
    </button>
  );
}
