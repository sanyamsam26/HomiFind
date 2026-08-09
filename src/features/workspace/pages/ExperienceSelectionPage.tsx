import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Check, Home, PlusCircle, Sparkles } from "lucide-react";
import { useApp } from "../../../context/AppContext";
import { enableWorkspace, listWorkspaces, workspaceHome } from "../../../services/workspace-service";
import { WORKSPACE_OPTIONS, WorkspaceType } from "../types";

export function ExperienceSelectionPage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentRole, triggerToast } = useApp();
  const [isSaving, setIsSaving] = useState(false);
  const [enabled, setEnabled] = useState<WorkspaceType[]>([]);

  useEffect(() => {
    let active = true;
    void listWorkspaces()
      .then((records) => {
        if (active) setEnabled(records.filter((record) => record.is_active).map((record) => record.workspace));
      })
      .catch(() => {
        if (active) setEnabled([]);
      });
    return () => { active = false; };
  }, []);

  const selectWorkspace = async (workspace: WorkspaceType) => {
    if (!currentUser || isSaving) return;
    setIsSaving(true);
    try {
      await enableWorkspace(workspace);
      setEnabled((previous) => previous.includes(workspace) ? previous : [...previous, workspace]);
      setCurrentRole(workspace);
      triggerToast(`${workspace[0].toUpperCase()}${workspace.slice(1)} workspace enabled.`);

      if (workspace === "renter") {
        navigate("/app/onboarding");
        return;
      }
      if (workspace === "owner") {
        navigate("/owner/onboarding");
        return;
      }
      navigate(workspaceHome(workspace));
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : "Unable to enable this workspace.");
    } finally {
      setIsSaving(false);
    }
  };

  const chooseBoth = async () => {
    if (!currentUser || isSaving) return;
    setIsSaving(true);
    try {
      await Promise.all([enableWorkspace("renter"), enableWorkspace("owner")]);
      setEnabled((previous) => Array.from(new Set([...previous, "renter", "owner"])));
      setCurrentRole("renter");
      triggerToast("Renter and owner workspaces are enabled.");
      navigate("/app/onboarding");
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : "Unable to enable both workspaces.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-10">
          <div className="mx-auto mb-5 h-12 w-12 rounded-2xl bg-[#1b206b] text-white flex items-center justify-center shadow-lg"><Building2 className="h-6 w-6" /></div>
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700 mb-3"><Sparkles className="h-3.5 w-3.5" /> Personalize HomiFind</div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">What would you like to do today?</h1>
          <p className="mt-3 text-sm text-slate-500 max-w-xl mx-auto">One account can support multiple experiences. Choose where you want to start—we can enable another workspace later.</p>
          {currentUser && <p className="mt-2 text-xs text-slate-400">Signed in as {currentUser.email}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <WorkspaceCard icon={<Home className="h-6 w-6" />} title="Find a Home" description="Browse properties and let HomiFind rank the best matches for you." selected={enabled.includes("renter")} onClick={() => void selectWorkspace("renter")} disabled={isSaving} />
          <WorkspaceCard icon={<PlusCircle className="h-6 w-6" />} title="List a Property" description="Upload a property, use AI-assisted listing tools and manage leads." selected={enabled.includes("owner")} onClick={() => void selectWorkspace("owner")} disabled={isSaving} />
          <WorkspaceCard icon={<Building2 className="h-6 w-6" />} title="Broker Workspace" description="Manage listings, clients, applications and conversations as a broker." selected={enabled.includes("broker")} onClick={() => void selectWorkspace("broker")} disabled={isSaving} />
        </div>

        <button type="button" onClick={() => void chooseBoth()} disabled={isSaving} className="mx-auto mt-6 flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-5 py-3 text-xs font-bold text-[#1b206b] shadow-sm hover:bg-indigo-50 transition-colors disabled:opacity-50">
          <Check className="h-4 w-4" /> I want to find a home and list a property
        </button>
      </div>
    </div>
  );
}

function WorkspaceCard({ icon, title, description, selected, onClick, disabled }: { icon: React.ReactNode; title: string; description: string; selected: boolean; onClick: () => void; disabled: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="group text-left bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300 transition-all disabled:opacity-60 disabled:hover:translate-y-0">
      <div className="flex items-center justify-between">
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-[#1b206b] flex items-center justify-center group-hover:bg-[#1b206b] group-hover:text-white transition-colors">{icon}</div>
        {selected && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700"><Check className="h-3 w-3" /> Enabled</span>}
      </div>
      <h2 className="text-lg font-extrabold text-slate-900 mt-6">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      <span className="inline-flex mt-6 text-xs font-bold text-[#1b206b]">{selected ? "Open workspace →" : "Continue →"}</span>
    </button>
  );
}
