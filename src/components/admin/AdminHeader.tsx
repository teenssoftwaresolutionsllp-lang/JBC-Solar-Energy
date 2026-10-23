"use client";

import React from "react";
import { Menu, Bell, Search, Shield, Sparkles } from "lucide-react";
import { SafeAdminUser } from "@/lib/admin-types";
import Link from "next/link";

interface AdminHeaderProps {
  user: SafeAdminUser | null;
  onOpenSidebar: () => void;
  title?: string;
  subtitle?: string;
}

export function AdminHeader({
  user,
  onOpenSidebar,
  title = "Dashboard",
  subtitle = "Overview & System Control",
}: AdminHeaderProps) {
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

      {/* Right: Quick Search, Notifications, User Badge */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Search trigger (hidden on smallest screens) */}
        <Link
          href="/admin/leads"
          className="hidden md:flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
        >
          <Search className="h-3.5 w-3.5 text-slate-300" />
          <span>Search solar leads & clients...</span>
          <kbd className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-300">
            /
          </kbd>
        </Link>

        {/* Notifications Icon with simulated lead ping */}
        <Link
          href="/admin/leads"
          className="relative rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="View recent leads"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#f36a26] text-[9px] font-bold text-white shadow-sm">
            !
          </span>
        </Link>

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
