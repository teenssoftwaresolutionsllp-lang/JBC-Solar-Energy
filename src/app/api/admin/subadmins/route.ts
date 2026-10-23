import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { getAllAdminUsers, createSubadmin } from "@/lib/admin-store";
import { AdminRole } from "@/lib/admin-types";

export async function GET() {
  try {
    const current = await getCurrentAdmin();
    if (!current) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const users = getAllAdminUsers();
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Fetch subadmins error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch subadmins." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const current = await getCurrentAdmin();
    if (!current) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    // Check permissions
    const hasPermission =
      current.role === "super_admin" ||
      current.permissions.includes("*") ||
      current.permissions.includes("subadmins:manage");

    if (!hasPermission) {
      return NextResponse.json(
        { success: false, message: "Forbidden: You lack permission to create subadmins." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password, role, permissions, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const validRoles: AdminRole[] = ["super_admin", "operations", "solar_consultant", "support"];
    const assignedRole: AdminRole = validRoles.includes(role) ? role : "solar_consultant";

    const result = createSubadmin({
      name,
      email,
      password,
      role: assignedRole,
      permissions: Array.isArray(permissions) ? permissions : undefined,
      phone,
      creatorAdminName: current.name,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Subadmin ${name} created successfully.`,
      user: result.user,
    });
  } catch (error) {
    console.error("Create subadmin error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create subadmin." },
      { status: 500 }
    );
  }
}
