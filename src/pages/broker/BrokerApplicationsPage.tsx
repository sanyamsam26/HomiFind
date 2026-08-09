import React from "react";
import { useApp } from "../../context/AppContext";
import { ApplicationCard } from "../../components/application-card";

export function BrokerApplicationsPage() {
  const { applications } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Represented Client Applications</h3>
        <p className="text-xs text-slate-500">Track client progress from initial submission to lease signing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {applications.map((app) => (
          <ApplicationCard key={app.id} application={app} isOwnerOrBrokerView={true} />
        ))}
      </div>
    </div>
  );
}
