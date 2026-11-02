"use client";

import React, { useState, useEffect } from "react";
import { X, Shield, Lock, Mail, User, Phone, CheckSquare, Square, AlertCircle, Loader2 } from "lucide-react";
import { SafeAdminUser, AdminRole } from "@/lib/admin-types";

interface SubadminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subadminToEdit?: SafeAdminUser | null;
}

const AVAILABLE_PERMISSIONS = [
  { key: "leads:read", label: "View Solar Inquiries & Leads", group: "Leads" },
  { key: "leads:write", label: "Update Status, Notes & Add Inquiries", group: "Leads" },
  { key: "subadmins:manage", label: "Create, Edit & Delete Subadmins", group: "Admin" },
  { key: "projects:manage", label: "Add & Manage Solar Portfolio Projects", group: "Projects" },
  { key: "analytics:view", label: "Access Analytics & Financial Pipeline", group: "Analytics" },
  { key: "settings:manage", label: "Manage System & Company Settings", group: "System" },
];

export function SubadminModal({
  isOpen,
  onClose,
  onSuccess,
  subadminToEdit,
}: SubadminModalProps) {
  const isEditing = !!subadminToEdit;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("solar_consultant");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subadminToEdit) {
      setName(subadminToEdit.name);
      setEmail(subadminToEdit.email);
      setPhone(subadminToEdit.phone || "");
      setRole(subadminToEdit.role);
      setPermissions(subadminToEdit.permissions || []);
      setStatus(subadminToEdit.status);
      setPassword("");
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("solar_consultant");
      setPermissions(["leads:read", "leads:write", "analytics:view"]);
      setStatus("active");
    }
    setError(null);
  }, [subadminToEdit, isOpen]);

  // Adjust default permissions when role changes in create mode
  const handleRoleChange = (newRole: AdminRole) => {
    setRole(newRole);
    if (!isEditing) {
      if (newRole === "super_admin") {
        setPermissions(["*"]);
      } else if (newRole === "operations") {
        setPermissions(["leads:read", "leads:write", "projects:manage", "analytics:view"]);
      } else if (newRole === "solar_consultant") {
        setPermissions(["leads:read", "leads:write", "analytics:view"]);
      } else {
        setPermissions(["leads:read"]);
      }
    }
  };

  const togglePermission = (permKey: string) => {
    if (permissions.includes("*")) {
      // If was wildcard, expand to all except the untoggled one
      const all = AVAILABLE_PERMISSIONS.map((p) => p.key).filter((k) => k !== permKey);
      setPermissions(all);
      return;
    }

    if (permissions.includes(permKey)) {
      setPermissions(permissions.filter((p) => p !== permKey));
    } else {
      setPermissions([...permissions, permKey]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    if (!isEditing && (!password || password.length < 6)) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (isEditing && password && password.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const url = isEditing
        ? `/api/admin/subadmins/${subadminToEdit.id}`
        : "/api/admin/subadmins";
      const method = isEditing ? "PUT" : "POST";

      const payload: Record<string, unknown> = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
        permissions,
        status,
      };

      if (password) {
        payload.password = password;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save subadmin.");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-2xl p-6 text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f36a26]/10 text-[#f36a26] border border-[#f36a26]/20">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditing ? "Edit Subadmin Account" : "Create New Subadmin"}
              </h2>
              <p className="text-xs text-slate-300">
                Configure role, solar portal access & specific permissions.
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

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f36a26] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f36a26] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Email & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@jbcsolar.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f36a26] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isEditing ? "Change Password (leave blank to keep)" : "Password *"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isEditing ? "••••••••" : "Min 6 characters"}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f36a26] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Role & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Assigned Role
              </label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as AdminRole)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-[#f36a26] focus:outline-hidden"
              >
                <option value="super_admin">Super Admin (Full Root Access)</option>
                <option value="operations">Operations Manager (Leads & Projects)</option>
                <option value="solar_consultant">Solar Technical Consultant (Leads Only)</option>
                <option value="support">Customer Support Agent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Account Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-[#f36a26] focus:outline-hidden"
              >
                <option value="active">Active (Can Log In)</option>
                <option value="inactive">Suspended / Inactive</option>
              </select>
            </div>
          </div>

          {/* Granular Permissions Section */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Granular Portal Permissions
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-xl border border-slate-800 bg-slate-900/50 p-3.5">
              {AVAILABLE_PERMISSIONS.map((perm) => {
                const isChecked = permissions.includes("*") || permissions.includes(perm.key);
                return (
                  <button
                    type="button"
                    key={perm.key}
                    onClick={() => togglePermission(perm.key)}
                    className={`flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors ${
                      isChecked
                        ? "bg-[#f36a26]/10 text-white border border-[#f36a26]/30"
                        : "bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="h-4 w-4 text-[#f36a26] shrink-0 mt-0.5" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-xs font-medium leading-snug">{perm.label}</p>
                      <span className="text-[10px] text-slate-300 font-mono">
                        {perm.group}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f36a26] to-[#e05514] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isEditing ? "Save Changes" : "Create Subadmin"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
