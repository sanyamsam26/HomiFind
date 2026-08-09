import React from "react";
import { useApp } from "../../context/AppContext";
import { MaintenanceTicketCard } from "../../components/maintenance-ticket-card";

export function OwnerMaintenancePage() {
  const { maintenanceTickets, handleUpdateTicketStatus } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Tenant Maintenance Requests</h3>
        <p className="text-xs text-slate-500">Assign vendor dispatch and track repair status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {maintenanceTickets.map((ticket) => (
          <MaintenanceTicketCard
            key={ticket.id}
            ticket={ticket}
            isManager={true}
            onUpdateStatus={(id, newStatus) => handleUpdateTicketStatus(id, newStatus)}
          />
        ))}
      </div>
    </div>
  );
}
