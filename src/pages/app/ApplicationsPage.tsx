import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ApplicationCard } from "../../components/application-card";
import { LeaseViewer } from "../../components/lease-viewer";
import { ShieldCheck } from "lucide-react";

export function ApplicationsPage() {
  const { applications, leases } = useApp();
  const [selectedLeaseId, setSelectedLeaseId] = useState<string | null>(null);

  const activeLease = leases.find((l) => l.id === selectedLeaseId) || leases[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Your Rental Applications & Leases</h3>
          <p className="text-xs text-slate-500">Track application statuses and sign digital rental contracts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {applications.map((app) => (
          <ApplicationCard
            key={app.id}
            application={app}
            onViewDetails={() => setSelectedLeaseId(leases[0]?.id || "lease-1")}
          />
        ))}
      </div>

      {/* Digital Lease Contract Preview */}
      {activeLease && (
        <div className="pt-6 border-t border-slate-200">
          <div className="flex items-center space-x-2 mb-4">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h4 className="text-base font-bold text-slate-900">Active Lease Contract Agreement</h4>
          </div>
          <LeaseViewer lease={activeLease} currentUserRole="renter" />
        </div>
      )}
    </div>
  );
}
