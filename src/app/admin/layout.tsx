import React from "react";
import { connection } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { AdminShellClient } from "./AdminShellClient";


export const metadata = {
  title: "Admin Portal | JBC Solar Energy",
  description: "Enterprise administration portal for JBC Solar Energy operations.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const currentAdmin = await getCurrentAdmin();

  return (
    <AdminShellClient user={currentAdmin}>
      {children}
    </AdminShellClient>
  );
}
