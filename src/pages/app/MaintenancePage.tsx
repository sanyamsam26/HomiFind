import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { MaintenanceTicketCard } from "../../components/maintenance-ticket-card";
import { Button } from "../../components/ui/button";
import { Dialog } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Wrench, PlusCircle } from "lucide-react";

export function MaintenancePage() {
  const { maintenanceTickets, properties, handleCreateMaintenance } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    handleCreateMaintenance({
      property_id: properties[0]?.id || "prop-1",
      title,
      description,
      priority,
    });
    setTitle("");
    setDescription("");
    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Maintenance & Repair Requests</h3>
          <p className="text-xs text-slate-500">Report property issues directly to your landlord or building management</p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs rounded-xl text-white cursor-pointer"
        >
          <PlusCircle className="mr-1.5 h-4 w-4" /> New Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {maintenanceTickets.map((ticket) => (
          <MaintenanceTicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>

      {/* New Ticket Modal */}
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Submit Maintenance Ticket"
        description="Provide details regarding the issue in your unit."
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Issue Headline</label>
            <Input
              type="text"
              required
              placeholder="e.g. Bathroom Faucet Leaking"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Urgency Level</label>
            <select
              value={priority}
              onChange={(e: any) => setPriority(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="low">Low - Routine</option>
              <option value="medium">Medium - Standard Repair</option>
              <option value="high">High - High Priority</option>
              <option value="urgent">Urgent - Emergency Water/Power</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              required
              rows={3}
              placeholder="Describe the problem, location in unit, and best access times..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
              Submit Ticket
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
