import { NextResponse } from "next/server";
import { destroyAdminSession, getCurrentAdmin } from "@/lib/admin-auth";
import { logAuditEvent } from "@/lib/admin-store";

export async function POST() {
  try {
    const current = await getCurrentAdmin();
    if (current) {
      logAuditEvent(current.id, current.name, "LOGOUT", `Admin logged out (${current.email}).`);
    }

    await destroyAdminSession();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json(
      { success: false, message: "Error during logout." },
      { status: 500 }
    );
  }
}
