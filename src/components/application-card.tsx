import React from "react";
import {
  CheckCircle2,
  Clock,
  XCircle,
  FileCheck,
  Building,
  User,
  DollarSign,
  Calendar,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Application } from "../types/database";
import { formatCurrency, formatDate } from "../lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export interface ApplicationCardProps {
  key?: React.Key;
  application: Application;
  onViewDetails?: (application: Application) => void;
  onUpdateStatus?: (applicationId: string, status: any) => void;
  isOwnerOrBrokerView?: boolean;
}

export function ApplicationCard({
  application,
  onViewDetails,
  onUpdateStatus,
  isOwnerOrBrokerView = false,
}: ApplicationCardProps) {
  const statusBadgeVariants: Record<
    string,
    { variant: "default" | "warning" | "destructive" | "secondary"; label: string }
  > = {
    submitted: { variant: "secondary", label: "Submitted" },
    under_review: { variant: "warning", label: "Under Review" },
    approved: { variant: "default", label: "Approved" },
    rejected: { variant: "destructive", label: "Rejected" },
    cancelled: { variant: "secondary", label: "Cancelled" },
  };

  const statusInfo =
    statusBadgeVariants[application.status] || {
      variant: "secondary",
      label: application.status,
    };

  const steps = ["Submitted", "Under Review", "Decision", "Lease Signed"];
  const getStepIndex = (status: string) => {
    switch (status) {
      case "submitted":
        return 0;
      case "under_review":
        return 1;
      case "approved":
        return 2;
      case "rejected":
        return 2;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(application.status);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:shadow-md space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {application.property?.title || "Rental Property Application"}
            </h4>
            <p className="text-xs text-slate-500">
              {application.property?.address_line1}, {application.property?.city}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant={statusInfo.variant} className="capitalize">
            {statusInfo.label}
          </Badge>
        </div>
      </div>

      {/* Renter Details Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div>
          <span className="text-slate-400 font-medium block">Applicant</span>
          <span className="font-bold text-slate-800">
            {application.renter?.full_name || "Alex Rivera"}
          </span>
        </div>

        <div>
          <span className="text-slate-400 font-medium block">Annual Income</span>
          <span className="font-bold text-slate-800">
            {formatCurrency(application.annual_income || 115000)}/yr
          </span>
        </div>

        <div>
          <span className="text-slate-400 font-medium block">Move-In Date</span>
          <span className="font-bold text-slate-800">
            {formatDate(application.proposed_move_in_date || "2026-09-01")}
          </span>
        </div>

        <div>
          <span className="text-slate-400 font-medium block">Occupants</span>
          <span className="font-bold text-slate-800">
            {application.occupants_count} Adult(s)
          </span>
        </div>
      </div>

      {/* Process Step Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-bold text-slate-500">
          <span>Application Pipeline Progress</span>
          <span>
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div key={step} className="flex flex-col space-y-1">
                <div
                  className={`h-2 rounded-full transition-all ${
                    isCompleted
                      ? application.status === "rejected" && idx === 2
                        ? "bg-rose-500"
                        : "bg-emerald-500"
                      : "bg-slate-200"
                  }`}
                />
                <span
                  className={`text-[10px] font-medium text-center truncate ${
                    isCurrent ? "text-slate-900 font-bold" : "text-slate-400"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] text-slate-400">
          Submitted on {formatDate(application.created_at || "2026-08-01")}
        </span>

        <div className="flex items-center space-x-2">
          {isOwnerOrBrokerView && application.status === "submitted" && onUpdateStatus && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus(application.id, "rejected")}
                className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                Reject
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={() => onUpdateStatus(application.id, "approved")}
                className="text-xs bg-emerald-600 hover:bg-emerald-700"
              >
                Approve & Draft Lease
              </Button>
            </>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewDetails && onViewDetails(application)}
            className="text-xs text-slate-600"
          >
            Details <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
