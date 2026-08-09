import React from "react";
import { useApp } from "../../context/AppContext";
import { ApplicationCard } from "../../components/application-card";

export function OwnerApplicationsPage() {
  const { applications, handleUpdateApplicationStatus } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Tenant Applications ({applications.length})</h3>
        <p className="text-xs text-slate-500">Review verified background checks, income documentation, and approve tenants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {applications.map((app) => (
          <ApplicationCard
            key={app.id}
            application={app}
            isOwnerOrBrokerView={true}
            onUpdateStatus={(id, status) => handleUpdateApplicationStatus(id, status)}
          />
        ))}
      </div>
    </div>
  );
}
