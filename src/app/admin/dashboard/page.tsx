"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Inbox,
  Users,
  SunMedium,
  Clock,
  ArrowUpRight,
  UserPlus,
  PlusCircle,
  Download,
  Building,
  MapPin,
  Calendar,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  DashboardStats,
  ConsultationLeadRecord,
  SafeAdminUser,
  LeadStatus,
} from "@/lib/admin-types";
import { LeadModal } from "@/components/admin/LeadModal";
import { SubadminModal } from "@/components/admin/SubadminModal";
import { NewLeadModal } from "@/components/admin/NewLeadModal";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [subadmins, setSubadmins] = useState<SafeAdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedLead, setSelectedLead] = useState<ConsultationLeadRecord | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isSubadminModalOpen, setIsSubadminModalOpen] = useState(false);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, subRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/subadmins"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      if (subRes.ok) {
        const subData = await subRes.json();
        setSubadmins(subData.users || []);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleQuickStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Quick status update error:", err);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (!data.leads) return;

      const headers = [
        "ID",
        "Full Name",
        "Phone",
        "Email",
        "Location",
        "Property Type",
        "Interested In",
        "Avg Bill",
        "Status",
        "Created At",
      ];
      const rows = data.leads.map((l: ConsultationLeadRecord) => [
        l.id,
        `"${l.fullName.replace(/"/g, '""')}"`,
        `"${l.phone}"`,
        `"${l.email}"`,
        `"${l.location.replace(/"/g, '""')}"`,
        `"${l.propertyType}"`,
        `"${l.interestedIn.replace(/"/g, '""')}"`,
        `"${l.averageElectricityBill}"`,
        `"${l.status}"`,
        `"${new Date(l.createdAt).toLocaleDateString()}"`,
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e: string[]) => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `jbc_solar_leads_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("CSV export error:", err);
    }
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

  if (loading && !stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#f36a26]" />
          <p className="text-xs text-slate-400">Loading Solar Operations Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-[#0070ba]/20 p-6 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Solar Operations Command
            </h2>
            <span className="rounded-full bg-[#f36a26]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#f36a26] border border-[#f36a26]/30">
              India Network
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time pipeline monitoring, consultation inquiries, rooftop solar surveys, and subadmin access control.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsSubadminModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0070ba] to-[#005c9a] px-3.5 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            <UserPlus className="h-4 w-4" />
            <span>Create Subadmin</span>
          </button>

          <button
            onClick={() => setIsNewLeadModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f36a26] to-[#e05514] px-3.5 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Record Lead</span>
          </button>

          <button
            onClick={fetchDashboardData}
            title="Refresh statistics"
            className="rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Leads */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Solar Inquiries</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f36a26]/10 text-[#f36a26]">
              <Inbox className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats?.totalLeads || 0}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-400">
              <ArrowUpRight className="h-3.5 w-3.5" /> +28%
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">From website forms & phone calls</p>
        </div>

        {/* Card 2: Subadmins & Team */}
        <Link
          href="/admin/subadmins"
          className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg backdrop-blur-md hover:border-amber-500/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Subadmins</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats?.activeSubadmins || 0}
            </span>
            <span className="text-xs text-slate-400">
              / {stats?.totalSubadmins || 0} Total
            </span>
          </div>
          <p className="mt-2 text-[11px] text-amber-400/80 font-medium flex items-center gap-1">
            <span>Manage accounts & roles</span>
            <ArrowUpRight className="h-3 w-3" />
          </p>
        </Link>

        {/* Card 3: Pending Action */}
        <Link
          href="/admin/leads?status=pending"
          className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg backdrop-blur-md hover:border-[#f36a26]/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pending Review</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats?.pendingLeads || 0}
            </span>
            <span className="text-xs font-medium text-amber-400">Needs survey</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">New customer inquiries</p>
        </Link>

        {/* Card 4: Total Installed Capacity */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Portfolio Capacity</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0070ba]/10 text-[#0070ba]">
              <SunMedium className="h-4 w-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats?.totalCapacityMW || "52+ MW"}
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              {stats?.totalProjects || 6} Projects
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">Residential, Commercial & Agri</p>
        </div>
      </div>

      {/* Charts & Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Visualizer (2 Cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Monthly Inquiry Trends</h3>
              <p className="text-xs text-slate-400">Consultation requests over the last 6 months</p>
            </div>
            <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              Peak Season
            </span>
          </div>

          {/* Interactive CSS Bar Chart */}
          <div className="pt-8 pb-2">
            <div className="grid grid-cols-6 gap-2 sm:gap-6 items-end h-44 border-b border-slate-800 pb-2">
              {stats?.monthlyLeads?.map((item) => {
                const maxCount = Math.max(...(stats?.monthlyLeads?.map((m) => m.count) || [30]));
                const heightPercent = Math.max(15, Math.min(100, (item.count / maxCount) * 100));

                return (
                  <div key={item.month} className="flex flex-col items-center gap-2 group h-full justify-end">
                    <span className="text-[11px] font-mono font-bold text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count}
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[38px] rounded-t-xl bg-gradient-to-t from-[#0070ba] to-[#f36a26] transition-all duration-300 group-hover:brightness-125 shadow-lg group-hover:shadow-orange-500/30"
                    />
                    <span className="text-xs font-medium text-slate-400 pt-1">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Inquiries by Property Type (1 Col) */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Property Distribution</h3>
              <Building className="h-4 w-4 text-slate-400" />
            </div>

            <div className="mt-5 space-y-4">
              {stats?.leadsByPropertyType?.map((prop) => {
                const total = stats.totalLeads || 1;
                const percent = Math.round((prop.count / total) * 100);

                return (
                  <div key={prop.type} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">{prop.type}</span>
                      <span className="text-slate-400 font-mono">
                        {prop.count} ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className={`h-full rounded-full ${
                          prop.type === "Residential"
                            ? "bg-[#f36a26]"
                            : prop.type === "Commercial"
                            ? "bg-[#0070ba]"
                            : prop.type === "Industrial"
                            ? "bg-purple-500"
                            : "bg-emerald-500"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4 text-[11px] text-slate-400 flex items-center justify-between">
            <span>DISCOM Net-Metering</span>
            <span className="text-emerald-400 font-semibold">100% Compliant</span>
          </div>
        </div>
      </div>

      {/* Recent Leads Table & Management */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Inbox className="h-4 w-4 text-[#f36a26]" />
              Recent Consultation Inquiries
            </h3>
            <p className="text-xs text-slate-400">
              Showing newest incoming client leads for solar assessment
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>

            <Link
              href="/admin/leads"
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
            >
              <span>View All Leads</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Leads Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/40 text-slate-400 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">Est. Bill</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stats?.recentLeads && stats.recentLeads.length > 0 ? (
                stats.recentLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => {
                      setSelectedLead(lead);
                      setIsLeadModalOpen(true);
                    }}
                  >
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div>{lead.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{lead.phone}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        <span>{lead.location}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {lead.propertyType}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-amber-400">
                      {lead.averageElectricityBill}
                    </td>

                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.status}
                        onChange={(e) => handleQuickStatusChange(lead.id, e.target.value as LeadStatus)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border ${getStatusBadge(
                          lead.status
                        )} bg-slate-900 focus:outline-hidden cursor-pointer`}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="quoted">Quoted</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="installed">Installed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                          setIsLeadModalOpen(true);
                        }}
                        className="rounded-lg bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-200 hover:bg-[#f36a26] hover:text-white transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No consultation inquiries received yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subadmin Audit Trail */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#0070ba]" />
              Recent Operations & Audit Log
            </h3>
            <p className="text-xs text-slate-400">Security history and subadmin administrative activities</p>
          </div>
          <Link
            href="/admin/activity"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300"
          >
            View Full Trail →
          </Link>
        </div>

        <div className="mt-4 divide-y divide-slate-800/60">
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-amber-400 uppercase font-semibold">
                    {log.action}
                  </span>
                  <span className="text-slate-300">{log.details}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 shrink-0 font-mono text-[11px]">
                  <span>By {log.adminName}</span>
                  <span>·</span>
                  <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="py-4 text-xs text-slate-500">No activity logged.</p>
          )}
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
        onUpdated={fetchDashboardData}
      />

      <SubadminModal
        isOpen={isSubadminModalOpen}
        onClose={() => setIsSubadminModalOpen(false)}
        onSuccess={fetchDashboardData}
      />

      <NewLeadModal
        isOpen={isNewLeadModalOpen}
        onClose={() => setIsNewLeadModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
}
