import React from "react";
import { useApp } from "../../context/AppContext";
import { LeaseViewer } from "../../components/lease-viewer";

export function OwnerLeasesPage() {
  const { leases } = useApp();
  const activeLease = leases[0];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Digital Lease Management</h3>
        <p className="text-xs text-slate-500">Automated lease agreements and e-signature tracking</p>
      </div>

      {activeLease ? (
        <LeaseViewer lease={activeLease} currentUserRole="owner" />
      ) : (
        <div className="p-8 text-center text-xs text-slate-500">No active leases found.</div>
      )}
    </div>
  );
}
