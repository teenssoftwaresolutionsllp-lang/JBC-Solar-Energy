"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SafeAdminUser } from "@/lib/admin-types";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

interface AdminShellClientProps {
  children: React.ReactNode;
  user: SafeAdminUser | null;
}

export function AdminShellClient({ children, user }: AdminShellClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // If not on login page and not authenticated, route to login
    if (!isLoginPage && !user) {
      router.push("/admin/login");
    }
  }, [isLoginPage, user, router]);

  // If on login page, display standalone login UI
  if (isLoginPage) {
    return <div className="min-h-screen w-full bg-[#070b13] text-slate-100">{children}</div>;
  }

  // If checking authentication, show clean dark loader
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b13] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-[#f36a26]" />
          <p className="text-xs text-slate-400 font-medium">Verifying Administrator Session...</p>
        </div>
      </div>
    );
  }

  const getPageInfo = () => {
    if (pathname.includes("/admin/subadmins")) {
      return { title: "Subadmins & Team", subtitle: "Manage administrator access, roles & security" };
    }
    if (pathname.includes("/admin/leads")) {
      return { title: "Consultation Inquiries", subtitle: "Solar customer pipeline & site survey leads" };
    }
    if (pathname.includes("/admin/projects")) {
      return { title: "Solar Portfolio", subtitle: "Live residential, commercial & industrial projects" };
    }
    if (pathname.includes("/admin/activity")) {
      return { title: "System Audit Logs", subtitle: "Security trail & administrative operations history" };
    }
    if (pathname.includes("/admin/settings")) {
      return { title: "Admin Settings", subtitle: "System configurations, solar tariffs & company profile" };
    }
    return { title: "Executive Dashboard", subtitle: "Real-time solar operations, inquiries & pipeline" };
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100">
      <AdminSidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-col lg:pl-72 transition-all duration-300">
        <AdminHeader
          user={user}
          onOpenSidebar={() => setSidebarOpen(true)}
          title={title}
          subtitle={subtitle}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
