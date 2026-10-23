import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized or session expired." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: admin,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { success: false, message: "Session verification error." },
      { status: 500 }
    );
  }
}
