"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Inbox,
  FolderGit2,
  History,
  Settings,
  ExternalLink,
  LogOut,
  ShieldCheck,
  ChevronRight,
  SunMedium,
  X,
} from "lucide-react";
import { SafeAdminUser } from "@/lib/admin-types";

interface AdminSidebarProps {
  user: SafeAdminUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ user, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout failed:", e);
      router.push("/admin/login");
    }
  };

  const navLinks = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: "Subadmins",
      href: "/admin/subadmins",
      icon: Users,
      badge: "Team",
    },
    {
      label: "Solar Leads",
      href: "/admin/leads",
      icon: Inbox,
      badge: "Inquiries",
    },
    {
      label: "Solar Projects",
      href: "/admin/projects",
      icon: FolderGit2,
      badge: null,
    },
    {
      label: "Audit Logs",
      href: "/admin/activity",
      icon: History,
      badge: null,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
      badge: null,
    },
  ];

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "super_admin":
        return "Super Admin";
      case "operations":
        return "Operations Lead";
      case "solar_consultant":
        return "Solar Consultant";
      case "support":
        return "Customer Support";
      default:
        return "Administrator";
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col bg-[#0b0f19] border-r border-slate-800 text-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-800/80 bg-[#090d16]">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="relative flex h-10 w-28 items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="JBC Solar Energy"
                width={120}
                height={40}
                className="h-8 w-auto object-contain brightness-110"
                priority
              />
            </div>
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-400 border border-amber-500/20 uppercase">
              Admin
            </span>
          </Link>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live System Indicator */}
        <div className="px-6 py-3 border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-slate-300 font-medium text-[11px]">JBC Solar Portal</span>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded font-mono">
            v2.4
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-5 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
            Navigation Menu
          </div>

          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-gradient-to-r from-[#f36a26] to-[#e05514] text-white shadow-lg shadow-orange-500/20 font-semibold"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-amber-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-800 text-amber-300 border border-slate-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="h-4 w-4 text-white" />}
                </div>
              </Link>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
            Quick Actions
          </div>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <SunMedium className="h-4 w-4 text-amber-400" />
              <span>View Live Website</span>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-slate-300" />
          </Link>
        </nav>

        {/* Current Admin User Profile Footer */}
        <div className="border-t border-slate-800 bg-[#090d16] p-4">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-900/80 p-3 border border-slate-800/80">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#f36a26] to-[#0070ba] text-white font-bold text-sm shadow-md">
                {user?.avatar || user?.name?.slice(0, 2).toUpperCase() || "AD"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">
                  {user?.name || "Solar Admin"}
                </p>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
                  <p className="truncate text-[10px] text-amber-300 font-medium">
                    {getRoleLabel(user?.role)}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout from dashboard"
              className="rounded-lg p-2 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
