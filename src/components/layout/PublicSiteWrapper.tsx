"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { NavigationLoader } from "./NavigationLoader";

export function PublicSiteWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // For admin pages, do NOT show the marketing Header, WhatsApp floating button, or public Footer
    return <div className="min-h-screen w-full bg-slate-950 text-slate-100">{children}</div>;
  }

  return (
    <>
      <Header />
      <NavigationLoader />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </>
  );
}
