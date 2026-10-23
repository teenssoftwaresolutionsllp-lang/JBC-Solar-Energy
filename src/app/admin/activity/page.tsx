"use client";

import React, { useState, useEffect, useCallback } from "react";
import { History, RefreshCw, Loader2, Calendar } from "lucide-react";
import { AuditLogRecord } from "@/lib/admin-types";

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/audit-logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Fetch audit logs error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getActionBadgeColor = (action: string) => {
    if (action.includes("CREATE")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (action.includes("UPDATE")) return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (action.includes("DELETE")) return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    if (action.includes("LOGIN")) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-slate-800 text-slate-300 border-slate-700";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-slate-900/80 p-6 border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <History className="h-6 w-6 text-[#f36a26]" />
            Administrative Security Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Immutable log of subadmin creation, role permissions updates, and solar lead modifications.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          title="Refresh audit logs"
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Trail</span>
        </button>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md">
        {loading && logs.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-[#f36a26] mx-auto mb-2" />
            <span>Fetching security audit records...</span>
          </div>
        ) : logs.length > 0 ? (
          <div className="divide-y divide-slate-800/60">
            {logs.map((log) => (
              <div
                key={log.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-800/30 px-3 rounded-xl transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span
                    className={`rounded-md border px-2.5 py-1 text-[10px] font-mono font-bold uppercase shrink-0 ${getActionBadgeColor(
                      log.action
                    )}`}
                  >
                    {log.action}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-slate-200">{log.details}</p>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Logged by {log.adminName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] shrink-0 self-end sm:self-auto">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(log.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">No audit events recorded yet.</div>
        )}
      </div>
    </div>
  );
}
