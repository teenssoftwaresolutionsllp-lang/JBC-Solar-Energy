"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Menu, Bell, Shield, Sparkles, CheckCheck, Clock, MapPin, ExternalLink, X } from "lucide-react";
import { SafeAdminUser, ConsultationLeadRecord } from "@/lib/admin-types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminHeaderProps {
  user: SafeAdminUser | null;
  onOpenSidebar: () => void;
  title?: string;
  subtitle?: string;
}

function timeAgo(dateString: string): string {
  try {
    const now = Date.now();
    const past = new Date(dateString).getTime();
    const diffSec = Math.floor((now - past) / 1000);

    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 7) return `${diffDay}d ago`;
    return new Date(dateString).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  } catch {
    return "Recent";
  }
}

export function AdminHeader({
  user,
  onOpenSidebar,
  title = "Dashboard",
  subtitle = "Overview & System Control",
}: AdminHeaderProps) {
  const pathname = usePathname();
  const [leads, setLeads] = useState<ConsultationLeadRecord[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/leads");
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        const allLeads: ConsultationLeadRecord[] = data.leads;
        setLeads(allLeads);

        // Check seen lead IDs / timestamp in localStorage
        const storedSeenIdsRaw = typeof window !== "undefined" ? localStorage.getItem("jbc_admin_seen_lead_ids") : null;
        const storedSeenTimeRaw = typeof window !== "undefined" ? localStorage.getItem("jbc_admin_last_seen_leads_time") : null;

        let seenIds: string[] = [];
        try {
          if (storedSeenIdsRaw) seenIds = JSON.parse(storedSeenIdsRaw);
        } catch {
          seenIds = [];
        }

        const lastSeenTime = storedSeenTimeRaw ? parseInt(storedSeenTimeRaw, 10) : null;

        // A lead is considered new if its ID is not in seenIds, or created after lastSeenTime
        const newUnread = allLeads.filter((l) => {
          if (seenIds.includes(l.id)) return false;
          if (lastSeenTime) {
            return new Date(l.createdAt).getTime() > lastSeenTime;
          }
          // Default initial state: only pending leads count as new
          return l.status === "pending";
        });

        // If currently viewing /admin/leads, automatically clear unread
        if (pathname === "/admin/leads") {
          setUnreadCount(0);
        } else {
          setUnreadCount(newUnread.length);
        }
      }
    } catch (err) {
      console.error("Failed to fetch leads for notification bell:", err);
    }
  }, [pathname]);

  // Initial fetch + 30-second background polling for new incoming leads
  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 30000);
    return () => clearInterval(interval);
  }, [fetchLeads]);

  // If user visits /admin/leads directly, clear unread badge
  useEffect(() => {
    if (pathname === "/admin/leads") {
      setUnreadCount(0);
      if (typeof window !== "undefined" && leads.length > 0) {
        localStorage.setItem("jbc_admin_last_seen_leads_time", Date.now().toString());
        localStorage.setItem("jbc_admin_seen_lead_ids", JSON.stringify(leads.map((l) => l.id)));
      }
    }
  }, [pathname, leads]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    if (isNotificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationsOpen]);

  // Handle clicking the notification bell
  const handleToggleNotifications = () => {
    const nextState = !isNotificationsOpen;
    setIsNotificationsOpen(nextState);

    // If opening, remove badge count and mark all current leads as seen
    if (nextState) {
      setUnreadCount(0);
      if (typeof window !== "undefined") {
        localStorage.setItem("jbc_admin_last_seen_leads_time", Date.now().toString());
        if (leads.length > 0) {
          localStorage.setItem("jbc_admin_seen_lead_ids", JSON.stringify(leads.map((l) => l.id)));
        }
      }
    }
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUnreadCount(0);
    if (typeof window !== "undefined") {
      localStorage.setItem("jbc_admin_last_seen_leads_time", Date.now().toString());
      if (leads.length > 0) {
        localStorage.setItem("jbc_admin_seen_lead_ids", JSON.stringify(leads.map((l) => l.id)));
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-800 bg-[#090d16]/95 px-4 sm:px-8 backdrop-blur-md">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-300 hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              {title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
          <p className="hidden text-xs text-slate-300 sm:block">{subtitle}</p>
        </div>
      </div>

      {/* Right: Notifications, User Badge, Action Button */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notifications Icon with Dynamic Number Badge & Popup */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleToggleNotifications}
            className={`relative rounded-xl border p-2.5 transition-all ${
              isNotificationsOpen
                ? "border-[#f36a26]/60 bg-slate-800 text-white"
                : "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
            title={unreadCount > 0 ? `${unreadCount} new solar leads` : "Notifications"}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {/* Dynamic number badge: only shown when unreadCount > 0, removed once opened */}
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[18px] px-1 items-center justify-center rounded-full bg-gradient-to-r from-[#f36a26] to-[#e05514] text-[10px] font-extrabold text-white shadow-md shadow-orange-500/30 animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Card */}
          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-200">
              {/* Dropdown Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Solar Lead Inquiries</span>
                  <span className="rounded-full bg-[#f36a26]/15 border border-[#f36a26]/30 px-2 py-0.5 text-[10px] font-semibold text-[#f36a26]">
                    Real-Time
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleMarkAllRead}
                    title="Mark all as read"
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
                  >
                    <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Clear</span>
                  </button>
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Leads List */}
              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                {leads.length > 0 ? (
                  leads.slice(0, 5).map((lead) => (
                    <Link
                      key={lead.id}
                      href="/admin/leads"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="group flex flex-col gap-1 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 hover:border-slate-700 hover:bg-slate-900 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                          {lead.fullName}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 shrink-0 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5 text-slate-500" />
                          {timeAgo(lead.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-300">
                        <span className="font-medium text-[#f36a26]">{lead.propertyType}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-400 truncate">
                          <MapPin className="h-2.5 w-2.5 text-slate-500 shrink-0" />
                          {lead.location}
                        </span>
                      </div>

                      {lead.interestedIn && (
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {lead.interestedIn}
                        </p>
                      )}

                      <div className="mt-1 flex items-center justify-between">
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                            lead.status === "pending"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : lead.status === "contacted"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : lead.status === "installed"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {lead.status}
                        </span>
                        <span className="text-[10px] text-slate-400 group-hover:text-[#f36a26] flex items-center gap-0.5">
                          <span>View Details</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No new lead notifications.
                  </div>
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="mt-3 pt-3 border-t border-slate-800 text-center">
                <Link
                  href="/admin/leads"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-slate-800/80 hover:bg-slate-800 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
                >
                  <span>Open Solar Leads CRM</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Card Pill */}
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 py-1.5 pl-2.5 pr-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#f36a26] to-amber-500 text-white font-bold text-xs shadow-xs">
            {user?.avatar || user?.name?.slice(0, 2).toUpperCase() || "AD"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">
              {user?.name || "Administrator"}
            </p>
            <p className="text-[10px] text-amber-400 font-medium leading-none flex items-center gap-1 mt-0.5">
              <Shield className="h-2.5 w-2.5" />
              {user?.role === "super_admin"
                ? "Super Admin"
                : user?.role === "operations"
                ? "Operations"
                : "Sub-Admin"}
            </p>
          </div>
        </div>

        {/* Quick Add Subadmin Shortcut */}
        <Link
          href="/admin/subadmins"
          className="hidden xl:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0070ba] to-[#005c9a] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:brightness-110 transition-all"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Manage Team</span>
        </Link>
      </div>
    </header>
  );
}
