import React, { useState } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  Download,
  PenTool,
  ShieldCheck,
  Building,
  User,
  Calendar,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { Lease } from "../types/database";
import { formatCurrency, formatDate } from "../lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface LeaseViewerProps {
  lease: Lease;
  onSignLease?: (leaseId: string) => void;
  currentUserRole?: string;
}

export function LeaseViewer({
  lease,
  onSignLease,
  currentUserRole = "renter",
}: LeaseViewerProps) {
  const [isSigned, setIsSigned] = useState(
    currentUserRole === "renter" ? !!lease.renter_signed_at : !!lease.owner_signed_at
  );

  const handleSign = () => {
    setIsSigned(true);
    if (onSignLease) onSignLease(lease.id);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md space-y-6">
      {/* Lease Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold border border-teal-100">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-slate-900">
                Residential Lease Agreement
              </h3>
              <Badge variant={lease.status === "active" ? "default" : "warning"}>
                {lease.status === "active" ? "Active Lease" : "Pending Signature"}
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              Contract ID: {lease.id.substring(0, 8).toUpperCase()} • Verified on PostgreSQL
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" className="rounded-xl text-xs">
          <Download className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
          Download PDF
        </Button>
      </div>

      {/* Property & Parties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
            <Building className="h-4 w-4 text-emerald-600" />
            <span>Property Location</span>
          </div>
          <p className="text-sm font-bold text-slate-900 pt-1">
            {lease.property?.title || "Luxury Modern Residence"}
          </p>
          <p className="text-xs text-slate-500">
            {lease.property?.address_line1}, {lease.property?.city}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            <span>Financial Terms</span>
          </div>
          <p className="text-sm font-bold text-slate-900 pt-1">
            {formatCurrency(lease.rent_amount)} <span className="text-xs font-normal text-slate-500">/month</span>
          </p>
          <p className="text-xs text-slate-500">
            Deposit: {formatCurrency(lease.security_deposit)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
            <Calendar className="h-4 w-4 text-emerald-600" />
            <span>Term Duration</span>
          </div>
          <p className="text-sm font-bold text-slate-900 pt-1">
            {formatDate(lease.start_date || "2026-09-01")} – {formatDate(lease.end_date || "2027-08-31")}
          </p>
          <p className="text-xs text-slate-500">12 Month Fixed Term Lease</p>
        </div>
      </div>

      {/* Signature Verification Box */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Digital E-Signatures & Verification
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Tenant Signature */}
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Tenant</span>
              <span className="text-sm font-bold text-slate-800">
                {lease.renter?.full_name || "Alex Rivera"}
              </span>
            </div>
            {lease.renter_signed_at || (currentUserRole === "renter" && isSigned) ? (
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <CheckCircle className="mr-1 h-3.5 w-3.5" /> Signed
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <Clock className="mr-1 h-3.5 w-3.5" /> Pending
              </span>
            )}
          </div>

          {/* Owner Signature */}
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Property Owner</span>
              <span className="text-sm font-bold text-slate-800">
                {lease.owner?.full_name || "Sarah Jenkins"}
              </span>
            </div>
            {lease.owner_signed_at || (currentUserRole === "owner" && isSigned) ? (
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <CheckCircle className="mr-1 h-3.5 w-3.5" /> Signed
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <Clock className="mr-1 h-3.5 w-3.5" /> Pending
              </span>
            )}
          </div>
        </div>

        {!isSigned && (
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Sign legally binding contract using HomiFind e-Sign</span>
            </div>
            <Button
              onClick={handleSign}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs rounded-xl"
            >
              <PenTool className="mr-1.5 h-3.5 w-3.5" /> Sign Lease Agreement
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
