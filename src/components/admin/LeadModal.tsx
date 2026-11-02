"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  Zap,
  MessageSquare,
  FileText,
  Trash2,
  Loader2,
  CheckCircle2,
  Clock,
  Send,
} from "lucide-react";
import { ConsultationLeadRecord, LeadStatus, SafeAdminUser } from "@/lib/admin-types";

interface LeadModalProps {
  isOpen: boolean;
  lead: ConsultationLeadRecord | null;
  subadmins: SafeAdminUser[];
  onClose: () => void;
  onUpdated: () => void;
}

export function LeadModal({
  isOpen,
  lead,
  subadmins,
  onClose,
  onUpdated,
}: LeadModalProps) {
  const [status, setStatus] = useState<LeadStatus>("pending");
  const [adminNotes, setAdminNotes] = useState("");
  const [estimatedKw, setEstimatedKw] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setStatus(lead.status);
      setAdminNotes(lead.adminNotes || "");
      setEstimatedKw(lead.estimatedKw || "");
      setAssignedTo(lead.assignedTo || "");
    }
  }, [lead]);

  if (!isOpen || !lead) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      const assignedUser = subadmins.find((u) => u.id === assignedTo);
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          adminNotes,
          estimatedKw,
          assignedTo: assignedTo || null,
          assignedAdminName: assignedUser ? assignedUser.name : null,
        }),
      });

      if (res.ok) {
        onUpdated();
        onClose();
      }
    } catch (err) {
      console.error("Save lead error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete inquiry from ${lead.fullName}?`)) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, { method: "DELETE" });
      if (res.ok) {
        onUpdated();
        onClose();
      }
    } catch (err) {
      console.error("Delete lead error:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const cleanPhone = lead.phone.replace(/[^0-9]/g, "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-2xl p-6 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0070ba]/20 text-[#0070ba] border border-[#0070ba]/30">
              <Zap className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {lead.fullName}
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-slate-300" />
                {lead.location} · {lead.propertyType}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Customer Action Buttons */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <a
            href={`tel:${lead.phone}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 p-2.5 text-xs font-semibold text-white transition-colors"
          >
            <Phone className="h-3.5 w-3.5 text-emerald-400" />
            <span>Call Customer</span>
          </a>

          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Hello ${lead.fullName}, this is JBC Solar Energy following up on your consultation request for ${lead.interestedIn}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 p-2.5 text-xs font-semibold text-emerald-400 transition-colors"
          >
            <Send className="h-3.5 w-3.5 text-emerald-400" />
            <span>WhatsApp</span>
          </a>

          <a
            href={`mailto:${lead.email}?subject=${encodeURIComponent("JBC Solar Energy - Your Consultation Request")}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 p-2.5 text-xs font-semibold text-blue-400 transition-colors"
          >
            <Mail className="h-3.5 w-3.5 text-blue-400" />
            <span>Email</span>
          </a>
        </div>

        {/* Lead Information Grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs">
          <div>
            <span className="text-slate-300 block mb-0.5">Contact Number</span>
            <span className="font-semibold text-white">{lead.phone}</span>
          </div>
          <div>
            <span className="text-slate-300 block mb-0.5">Email</span>
            <span className="font-semibold text-white truncate block">{lead.email}</span>
          </div>
          <div>
            <span className="text-slate-300 block mb-0.5">Property Type</span>
            <span className="font-semibold text-white flex items-center gap-1">
              <Building className="h-3.5 w-3.5 text-[#f36a26]" />
              {lead.propertyType}
            </span>
          </div>
          <div>
            <span className="text-slate-300 block mb-0.5">Average Monthly Bill</span>
            <span className="font-semibold text-amber-400">{lead.averageElectricityBill}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-slate-300 block mb-0.5">Solar Solution Interested In</span>
            <span className="font-semibold text-white">{lead.interestedIn}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-slate-300 block mb-0.5 flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Customer Inquired Note
            </span>
            <p className="mt-1 rounded-lg bg-slate-800/80 p-2.5 text-slate-200 leading-relaxed italic border border-slate-700/50">
              &quot;{lead.message}&quot;
            </p>
          </div>
          <div>
            <span className="text-slate-300 block mb-0.5 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Inquiry Received
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              {new Date(lead.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Lead Management Controls */}
        <div className="mt-5 space-y-4 border-t border-slate-800 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Status Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Pipeline Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-[#f36a26] focus:outline-hidden"
              >
                <option value="pending">Pending Review</option>
                <option value="contacted">Customer Contacted</option>
                <option value="quoted">Proposal / Quote Sent</option>
                <option value="scheduled">Site Survey Scheduled</option>
                <option value="installed">Solar Plant Installed</option>
                <option value="rejected">Rejected / Ineligible</option>
              </select>
            </div>

            {/* Estimated kW */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                Estimated System
              </label>
              <input
                type="text"
                value={estimatedKw}
                onChange={(e) => setEstimatedKw(e.target.value)}
                placeholder="e.g. 10 kW / 150 kW"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f36a26] focus:outline-hidden"
              />
            </div>

            {/* Assigned Subadmin */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-blue-400" />
                Assigned Subadmin
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-[#f36a26] focus:outline-hidden"
              >
                <option value="">Unassigned</option>
                {subadmins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.name} ({admin.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Internal Consultation Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-[#f36a26]" />
              Internal Engineering & Follow-up Notes
            </label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Record survey findings, quote revisions, customer preferences, or solar subsidy application notes..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f36a26] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-800 mt-5">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteLoading}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
          >
            {deleteLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            <span>Delete Lead</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f36a26] to-[#e05514] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Save & Update</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
