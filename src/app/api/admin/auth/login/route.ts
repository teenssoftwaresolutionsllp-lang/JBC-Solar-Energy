import { NextResponse } from "next/server";
import { getAdminUserByEmailWithPassword, recordUserLogin, logAuditEvent } from "@/lib/admin-store";
import { verifyPassword } from "@/lib/admin-crypto";
import { createAdminSession } from "@/lib/admin-auth";
import { SafeAdminUser } from "@/lib/admin-types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, remember } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide both email and password." },
        { status: 400 }
      );
    }

    const user = getAdminUserByEmailWithPassword(email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (user.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          message: "This account has been deactivated. Please contact your Super Admin.",
        },
        { status: 403 }
      );
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;

    await createAdminSession(safeUser as SafeAdminUser, !!remember);
    recordUserLogin(user.id);
    logAuditEvent(
      user.id,
      user.name,
      "LOGIN_SUCCESS",
      `Admin logged in successfully (${user.email}).`
    );

    return NextResponse.json({
      success: true,
      message: "Authentication successful.",
      user: safeUser,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
