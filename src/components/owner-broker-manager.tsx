import { useEffect, useMemo, useState } from "react";
import { Search, UserRound, ShieldCheck, UserPlus, X, BriefcaseBusiness } from "lucide-react";
import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import type { Property } from "../types/database";
import {
  assignBroker,
  fetchBrokerDirectory,
  fetchOwnerBrokerAssignments,
  revokeBrokerAssignment,
  type BrokerAssignment,
  type BrokerDirectoryEntry,
} from "../services/broker-service";

interface OwnerBrokerManagerProps {
  properties: Property[];
}

export function OwnerBrokerManager({ properties }: OwnerBrokerManagerProps) {
  const [assignments, setAssignments] = useState<BrokerAssignment[]>([]);
  const [brokers, setBrokers] = useState<BrokerDirectoryEntry[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedBroker, setSelectedBroker] = useState<BrokerDirectoryEntry | null>(null);
  const [role, setRole] = useState<"agent" | "manager">("agent");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadAssignments() {
    setLoading(true);
    try {
      setAssignments(await fetchOwnerBrokerAssignments());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load broker assignments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAssignments();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const result = await fetchBrokerDirectory(search);
        if (!cancelled) setBrokers(result);
      } catch {
        if (!cancelled) setBrokers([]);
      }
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [search]);

  const activeAssignments = useMemo(
    () => assignments.filter((assignment) => assignment.status === "active"),
    [assignments],
  );

  async function handleAssign() {
    if (!selectedProperty || !selectedBroker) return;
    setSaving(true);
    setError(null);
    try {
      await assignBroker(selectedProperty.id, selectedBroker.id, null, role);
      await loadAssignments();
      setSelectedProperty(null);
      setSelectedBroker(null);
      setSearch("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to assign broker.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRevoke(id: string) {
    try {
      await revokeBrokerAssignment(id);
      await loadAssignments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to revoke assignment.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Broker Management</h3>
          <p className="mt-1 text-sm text-slate-500">Assign verified brokers to properties you own without transferring ownership.</p>
        </div>
        <div className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700">
          {activeAssignments.length} active assignment{activeAssignments.length === 1 ? "" : "s"}
        </div>
      </div>

      {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        {properties.map((property) => {
          const assignment = activeAssignments.find((item) => item.property_id === property.id);
          return (
            <div key={property.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <BriefcaseBusiness className="h-4 w-4 text-indigo-500" />
                    <h4 className="truncate font-semibold text-slate-900">{property.title}</h4>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{property.city}, {property.state}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase text-slate-600">{property.status}</span>
              </div>

              {assignment ? (
                <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700"><UserRound className="h-4 w-4" /></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{assignment.broker_name || "Assigned broker"}</p>
                      <p className="text-xs text-slate-500">{assignment.role_in_listing === "manager" ? "Listing manager" : "Agent"}</p>
                    </div>
                  </div>
                  <button onClick={() => void handleRevoke(assignment.id)} className="text-xs font-semibold text-red-600 hover:text-red-700">Revoke</button>
                </div>
              ) : (
                <Button onClick={() => setSelectedProperty(property)} className="mt-5 w-full rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">
                  <UserPlus className="mr-2 h-4 w-4" /> Assign Broker
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {!loading && properties.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">Add a property first, then you can assign a broker.</div>
      )}

      <Dialog
        isOpen={Boolean(selectedProperty)}
        onClose={() => { setSelectedProperty(null); setSelectedBroker(null); setSearch(""); }}
        title="Assign a broker"
        description={selectedProperty ? `Choose who should represent ${selectedProperty.title}.` : undefined}
        maxWidth="xl"
      >
        <div className="space-y-5">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search verified brokers by name or email" className="pl-9" />
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto">
            {brokers.map((broker) => (
              <button
                key={broker.id}
                onClick={() => setSelectedBroker(broker)}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${selectedBroker?.id === broker.id ? "border-indigo-300 bg-indigo-50" : "border-slate-200 hover:border-slate-300"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100"><UserRound className="h-5 w-5 text-slate-500" /></div>
                  <div>
                    <p className="font-semibold text-slate-900">{broker.full_name}</p>
                    <p className="text-xs text-slate-500">{broker.email}{broker.company_name ? ` · ${broker.company_name}` : ""}</p>
                  </div>
                </div>
                {broker.is_verified && <ShieldCheck className="h-5 w-5 text-emerald-600" />}
              </button>
            ))}
            {brokers.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No verified brokers found.</p>}
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">Listing access</p>
            <div className="grid grid-cols-2 gap-2">
              {(["agent", "manager"] as const).map((value) => (
                <button key={value} onClick={() => setRole(value)} className={`rounded-xl border p-3 text-left ${role === value ? "border-indigo-300 bg-indigo-50" : "border-slate-200"}`}>
                  <p className="text-sm font-semibold capitalize text-slate-900">{value}</p>
                  <p className="mt-1 text-xs text-slate-500">{value === "manager" ? "Manage listing workflow and leads" : "Represent the property and handle leads"}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button variant="outline" onClick={() => setSelectedProperty(null)}><X className="mr-1.5 h-4 w-4" /> Cancel</Button>
            <Button disabled={!selectedBroker || saving} onClick={() => void handleAssign()} className="bg-indigo-600 text-white hover:bg-indigo-700">
              {saving ? "Assigning…" : "Assign broker"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
