import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { getAuditLogs } from "@/lib/admin-store";

export async function GET() {
  try {
    const current = await getCurrentAdmin();
    if (!current) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const logs = getAuditLogs(50);
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error("Fetch audit logs error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch audit logs." },
      { status: 500 }
    );
  }
}
