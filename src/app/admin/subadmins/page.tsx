"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  UserPlus,
  Shield,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Clock,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { SafeAdminUser, AdminRole } from "@/lib/admin-types";
import { SubadminModal } from "@/components/admin/SubadminModal";

export default function SubadminsPage() {
  const [subadmins, setSubadmins] = useState<SafeAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subadminToEdit, setSubadminToEdit] = useState<SafeAdminUser | null>(null);

  const fetchSubadmins = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/subadmins");
      if (res.ok) {
        const data = await res.json();
        setSubadmins(data.users || []);
      }
    } catch (err) {
      console.error("Fetch subadmins error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubadmins();
  }, [fetchSubadmins]);

  const handleToggleStatus = async (user: SafeAdminUser) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`/api/admin/subadmins/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to update subadmin status.");
        return;
      }
      fetchSubadmins();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDelete = async (user: SafeAdminUser) => {
    if (
      !confirm(
        `Are you sure you want to permanently remove subadmin access for ${user.name} (${user.email})?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/subadmins/${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to delete subadmin.");
        return;
      }
      fetchSubadmins();
    } catch (err) {
      console.error("Delete subadmin error:", err);
    }
  };

  // Filtering
  const filteredSubadmins = subadmins.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));

    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case "super_admin":
        return {
          label: "Super Admin",
          className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        };
      case "operations":
        return {
          label: "Operations Lead",
          className: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        };
      case "solar_consultant":
        return {
          label: "Solar Consultant",
          className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        };
      case "support":
        return {
          label: "Customer Support",
          className: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        };
      default:
        return {
          label: role,
          className: "bg-slate-800 text-slate-300 border-slate-700",
        };
    }
  };

  const totalActive = subadmins.filter((u) => u.status === "active").length;
  const totalOps = subadmins.filter((u) => u.role === "operations").length;
  const totalConsultants = subadmins.filter((u) => u.role === "solar_consultant").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 p-6 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Subadmin & Access Management
            </h1>
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-400 border border-amber-500/30">
              Role-Based Access
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Create, monitor, and regulate subadministrators. Grant granular permissions for managing solar inquiries, system settings, and engineering quotes.
          </p>
        </div>

        <button
          onClick={() => {
            setSubadminToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f36a26] to-[#e05514] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto"
        >
          <UserPlus className="h-4 w-4" />
          <span>Create New Subadmin</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-[11px] font-medium text-slate-400 block">Total Team Accounts</span>
          <span className="text-2xl font-black text-white mt-1 block">{subadmins.length}</span>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-[11px] font-medium text-slate-400 block">Active Status</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">{totalActive}</span>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-[11px] font-medium text-slate-400 block">Operations Leads</span>
          <span className="text-2xl font-black text-blue-400 mt-1 block">{totalOps}</span>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-[11px] font-medium text-slate-400 block">Solar Consultants</span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">{totalConsultants}</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subadmin by name, email, or phone..."
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f36a26] focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-[#f36a26] focus:outline-hidden"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="operations">Operations Lead</option>
              <option value="solar_consultant">Solar Consultant</option>
              <option value="support">Support</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-[#f36a26] focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          <button
            onClick={fetchSubadmins}
            title="Refresh subadmins list"
            className="rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Subadmins Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 shadow-xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Subadmin Profile</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Key Permissions</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading && subadmins.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin text-[#f36a26] mx-auto mb-2" />
                    <span>Loading subadmins...</span>
                  </td>
                </tr>
              ) : filteredSubadmins.length > 0 ? (
                filteredSubadmins.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  const isSuper = user.role === "super_admin";

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Subadmin Profile */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#f36a26] to-[#0070ba] text-white font-bold text-sm shadow-md">
                            {user.avatar || user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm flex items-center gap-1.5">
                              {user.name}
                              {isSuper && (
                                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 font-mono">
                              ID: {user.id.slice(0, 10)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Mail className="h-3 w-3 text-slate-500" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                              <Phone className="h-3 w-3 text-slate-500" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${roleBadge.className}`}
                        >
                          <Shield className="h-3 w-3" />
                          {roleBadge.label}
                        </span>
                      </td>

                      {/* Permissions Pills */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {user.permissions.includes("*") ? (
                            <span className="rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 text-[10px] font-mono font-semibold">
                              FULL_ACCESS (*)
                            </span>
                          ) : (
                            user.permissions.slice(0, 3).map((p) => (
                              <span
                                key={p}
                                className="rounded bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.5 text-[10px] font-mono"
                              >
                                {p.replace(":", " ")}
                              </span>
                            ))
                          )}
                          {!user.permissions.includes("*") && user.permissions.length > 3 && (
                            <span className="rounded bg-slate-800 text-slate-500 px-1.5 py-0.5 text-[10px]">
                              +{user.permissions.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          title="Click to toggle account status"
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                            user.status === "active"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
                          }`}
                        >
                          {user.status === "active" ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3" />
                              <span>Suspended</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Last Active */}
                      <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                        {user.lastLogin ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-500" />
                            <span>{new Date(user.lastLogin).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          <span className="text-slate-600">Never</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSubadminToEdit(user);
                              setIsModalOpen(true);
                            }}
                            title="Edit subadmin details or change password"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(user)}
                            title="Delete subadmin account"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No subadmins found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roles & Security Matrix Info Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-400" />
          Security Roles & Permissions Architecture
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          JBC Solar Admin Portal enforces strict role segregation to ensure customer data integrity and secure dispatching.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="font-bold text-amber-400 block mb-1">Super Admin</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Full root access. Can create/delete subadmins, change system tariffs, and view complete audit records.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="font-bold text-blue-400 block mb-1">Operations Lead</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Manages lead pipelines, assigns inquiries to engineers, coordinates rooftop surveys, and maintains project portfolio.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="font-bold text-emerald-400 block mb-1">Solar Consultant</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Field technical specialist. Follows up with customers, updates proposal quotes, and records engineering estimates.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <span className="font-bold text-purple-400 block mb-1">Customer Support</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Assists with initial inquiries, verifies client address/bills, and answers preliminary subsidy queries.
            </p>
          </div>
        </div>
      </div>

      {/* Subadmin Create/Edit Modal */}
      <SubadminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSubadminToEdit(null);
        }}
        onSuccess={fetchSubadmins}
        subadminToEdit={subadminToEdit}
      />
    </div>
  );
}
