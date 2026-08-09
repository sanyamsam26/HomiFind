import React from "react";
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  UserCheck,
  Building,
  Paperclip,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { MaintenanceTicket, TicketPriority, TicketStatus } from "../types/database";
import { formatDate } from "../lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export interface MaintenanceTicketCardProps {
  key?: React.Key;
  ticket: MaintenanceTicket;
  onUpdateStatus?: (ticketId: string, status: TicketStatus) => void;
  isManager?: boolean;
}

export function MaintenanceTicketCard({
  ticket,
  onUpdateStatus,
  isManager = false,
}: MaintenanceTicketCardProps) {
  const priorityBadges: Record<
    TicketPriority,
    { variant: "default" | "warning" | "destructive" | "secondary"; label: string }
  > = {
    low: { variant: "secondary", label: "Low Priority" },
    medium: { variant: "warning", label: "Medium Priority" },
    high: { variant: "warning", label: "High Priority" },
    urgent: { variant: "destructive", label: "URGENT" },
  };

  const statusBadges: Record<
    TicketStatus,
    { variant: "default" | "warning" | "destructive" | "secondary"; label: string }
  > = {
    open: { variant: "warning", label: "Open Ticket" },
    in_progress: { variant: "secondary", label: "In Progress" },
    pending_vendor: { variant: "warning", label: "Vendor Assigned" },
    resolved: { variant: "default", label: "Resolved" },
    closed: { variant: "secondary", label: "Closed" },
  };

  const priorityInfo = priorityBadges[ticket.priority] || priorityBadges.medium;
  const statusInfo = statusBadges[ticket.status] || statusBadges.open;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-all space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 font-bold border border-amber-100">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{ticket.title}</h4>
            <p className="text-xs text-slate-500">
              {ticket.property?.title || "Rental Residence"} • {ticket.property?.city || "Austin"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
        {ticket.description}
      </p>

      {/* Ticket Footer Meta & Actions */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-400">
          Created on {formatDate(ticket.created_at || "2026-08-05")}
        </span>

        {isManager && ticket.status !== "resolved" && onUpdateStatus && (
          <div className="flex items-center space-x-2">
            {ticket.status === "open" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus(ticket.id, "in_progress")}
                className="text-xs text-slate-700"
              >
                Start Progress
              </Button>
            )}
            <Button
              size="sm"
              variant="default"
              onClick={() => onUpdateStatus(ticket.id, "resolved")}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 font-bold"
            >
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Mark Resolved
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
