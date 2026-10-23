"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import {
  Inbox,
  Search,
  Filter,
  Download,
  PlusCircle,
  MapPin,
  Send,
  Phone,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { ConsultationLeadRecord, LeadStatus, SafeAdminUser } from "@/lib/admin-types";
import { LeadModal } from "@/components/admin/LeadModal";
import { NewLeadModal } from "@/components/admin/NewLeadModal";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default function LeadsPage(props: PageProps) {
  const searchParams = use(props.searchParams);
  const initialStatus = searchParams?.status || "all";

  const [leads, setLeads] = useState<ConsultationLeadRecord[]>([]);
  const [subadmins, setSubadmins] = useState<SafeAdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState<string>(initialStatus);
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedLead, setSelectedLead] = useState<ConsultationLeadRecord | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeTab !== "all") params.set("status", activeTab);
      if (propertyFilter !== "all") params.set("propertyType", propertyFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const [leadsRes, subRes] = await Promise.all([
        fetch(`/api/admin/leads?${params.toString()}`),
        fetch("/api/admin/subadmins"),
      ]);

      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data.leads || []);
      }

      if (subRes.ok) {
        const subData = await subRes.json();
        setSubadmins(subData.users || []);
      }
    } catch (err) {
      console.error("Fetch leads error:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, propertyFilter, searchQuery]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleQuickStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchLeads();
      }
    } catch (err) {
      console.error("Quick status update error:", err);
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = [
      "Lead ID",
      "Customer Name",
      "Phone",
      "Email",
      "Location",
      "Property Type",
      "Interested In",
      "Monthly Bill",
      "Status",
      "Assigned To",
      "Inquiry Date",
    ];

    const rows = leads.map((l) => [
      l.id,
      `"${l.fullName.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.location.replace(/"/g, '""')}"`,
      `"${l.propertyType}"`,
      `"${l.interestedIn.replace(/"/g, '""')}"`,
      `"${l.averageElectricityBill}"`,
      `"${l.status}"`,
      `"${l.assignedAdminName || "Unassigned"}"`,
      `"${new Date(l.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `jbc_solar_inquiries_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "contacted":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "quoted":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "scheduled":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "installed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "rejected":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const tabs = [
    { key: "all", label: "All Inquiries" },
    { key: "pending", label: "Pending Review" },
    { key: "contacted", label: "Contacted" },
    { key: "quoted", label: "Proposal Sent" },
    { key: "scheduled", label: "Survey Scheduled" },
    { key: "installed", label: "Installed (Won)" },
    { key: "rejected", label: "Ineligible / Lost" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-slate-900/80 p-6 border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Inbox className="h-6 w-6 text-[#f36a26]" />
            Consultation Inquiries & Leads CRM
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Track incoming property assessments, assign consultations to subadmins, and manage solar EPC conversions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsNewLeadModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f36a26] to-[#e05514] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Record New Lead</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#f36a26] text-white shadow-md shadow-orange-500/20"
                  : "bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search & Property Type Filter */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, email, or city..."
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f36a26] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-[#f36a26] focus:outline-hidden"
            >
              <option value="all">All Property Types</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Agricultural">Agricultural</option>
            </select>
          </div>

          <button
            onClick={fetchLeads}
            title="Refresh leads"
            className="rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 shadow-xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Customer & Contact</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Property & System</th>
                <th className="py-3.5 px-4">Monthly Bill</th>
                <th className="py-3.5 px-4">Pipeline Status</th>
                <th className="py-3.5 px-4">Assigned Subadmin</th>
                <th className="py-3.5 px-5 text-right">Quick Contact & Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading && leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin text-[#f36a26] mx-auto mb-2" />
                    <span>Loading consultation inquiries...</span>
                  </td>
                </tr>
              ) : leads.length > 0 ? (
                leads.map((lead) => {
                  const cleanPhone = lead.phone.replace(/[^0-9]/g, "");

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => {
                        setSelectedLead(lead);
                        setIsLeadModalOpen(true);
                      }}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    >
                      {/* Customer */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-white text-sm">{lead.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {lead.phone}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                          {lead.email}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span>{lead.location}</span>
                        </div>
                      </td>

                      {/* Property Type & System */}
                      <td className="py-4 px-4">
                        <span className="font-semibold text-white block">
                          {lead.propertyType}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate max-w-[180px]">
                          {lead.interestedIn}
                        </span>
                      </td>

                      {/* Bill */}
                      <td className="py-4 px-4 font-mono font-semibold text-amber-400">
                        {lead.averageElectricityBill}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleQuickStatusChange(lead.id, e.target.value as LeadStatus)
                          }
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border ${getStatusBadge(
                            lead.status
                          )} bg-slate-900 focus:outline-hidden cursor-pointer`}
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="quoted">Proposal Sent</option>
                          <option value="scheduled">Survey Scheduled</option>
                          <option value="installed">Installed (Won)</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>

                      {/* Assigned */}
                      <td className="py-4 px-4 text-slate-400 font-medium">
                        {lead.assignedAdminName ? (
                          <span className="rounded bg-blue-500/10 text-blue-400 px-2 py-0.5 text-[11px] border border-blue-500/20 font-semibold">
                            {lead.assignedAdminName}
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">Unassigned</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Chat on WhatsApp"
                            className="rounded-lg p-1.5 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                          >
                            <Send className="h-4 w-4" />
                          </a>

                          <a
                            href={`tel:${lead.phone}`}
                            title="Call customer"
                            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <Phone className="h-4 w-4" />
                          </a>

                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setIsLeadModalOpen(true);
                            }}
                            className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:bg-[#f36a26] hover:text-white transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No inquiries found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <LeadModal
        isOpen={isLeadModalOpen}
        lead={selectedLead}
        subadmins={subadmins}
        onClose={() => {
          setIsLeadModalOpen(false);
          setSelectedLead(null);
        }}
        onUpdated={fetchLeads}
      />

      <NewLeadModal
        isOpen={isNewLeadModalOpen}
        onClose={() => setIsNewLeadModalOpen(false)}
        onSuccess={fetchLeads}
      />
    </div>
  );
}
