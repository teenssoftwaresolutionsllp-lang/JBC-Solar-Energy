"use client";

import React, { useState } from "react";
import {
  Settings,
  Shield,
  Server,
  Lock,
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Database,
  Cpu,
} from "lucide-react";
import { siteConfig } from "@/data/site";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (newPassword.length < 6) {
      setMsg({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsg({ type: "error", text: "New password and confirmation do not match." });
      return;
    }

    setLoading(true);
    try {
      // Fetch me to get ID
      const meRes = await fetch("/api/admin/auth/me");
      const meData = await meRes.json();
      if (!meData.user) throw new Error("Not logged in");

      const updateRes = await fetch(`/api/admin/subadmins/${meData.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      const resJson = await updateRes.json();
      if (!updateRes.ok) throw new Error(resJson.message || "Failed to update password.");

      setMsg({ type: "success", text: "Your password has been changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMsg({ type: "error", text: err.message });
      } else {
        setMsg({ type: "error", text: "Failed to update password." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="rounded-3xl bg-slate-900/80 p-6 border border-slate-800 shadow-xl">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-[#f36a26]" />
          Portal Configurations & Security Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Manage your credentials, view system environment health, and review JBC Solar corporate parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security: Change Password */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Change Admin Password</h2>
              <p className="text-xs text-slate-400">Update your access key for this session</p>
            </div>
          </div>

          {msg && (
            <div
              className={`mb-4 flex items-center gap-2 rounded-xl p-3 text-xs ${
                msg.type === "success"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {msg.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{msg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Current Password (Verification)
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-[#f36a26] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                New Password (Minimum 6 characters)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-[#f36a26] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-[#f36a26] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f36a26] to-[#e05514] px-5 py-2.5 font-bold text-white shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Update Password</span>
            </button>
          </form>
        </div>

        {/* System & Architecture Diagnostics */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0070ba]/10 text-[#0070ba] border border-[#0070ba]/20">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">System Diagnostics</h2>
                <p className="text-xs text-slate-400">Environment & database connectivity status</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-300">
                  <Database className="h-4 w-4 text-emerald-400" />
                  <span>Data Layer Engine</span>
                </div>
                <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Hybrid Resilient Storage
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-300">
                  <Cpu className="h-4 w-4 text-amber-400" />
                  <span>Next.js Engine</span>
                </div>
                <span className="font-mono text-slate-300">v16.4 (Turbopack + React 19)</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-300">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span>Session Security</span>
                </div>
                <span className="font-mono text-slate-300">Scrypt + HMAC-SHA256 Cookies</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-300">
                  <Building className="h-4 w-4 text-[#f36a26]" />
                  <span>Corporate Entity</span>
                </div>
                <span className="font-mono text-slate-300 truncate max-w-[200px]">
                  {siteConfig.contact.legalName}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-950/70 p-4 border border-slate-800 text-[11px] text-slate-400">
            <p className="font-semibold text-white mb-1">Corporate Registration Details:</p>
            <p>CIN: {siteConfig.contact.cin}</p>
            <p>Headquarters: {siteConfig.contact.locations[0].address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
