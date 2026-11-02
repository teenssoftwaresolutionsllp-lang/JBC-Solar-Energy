import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { getDashboardStats } from "@/lib/admin-store";

export async function GET() {
  try {
    const current = await getCurrentAdmin();
    if (!current) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const stats = getDashboardStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("Fetch stats error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch stats." }, { status: 500 });
  }
}
