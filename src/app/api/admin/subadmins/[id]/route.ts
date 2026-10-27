import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { getAdminUserById, updateSubadmin, deleteSubadmin } from "@/lib/admin-store";

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const current = await getCurrentAdmin();
    if (!current) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await props.params;
    const user = getAdminUserById(id);
    if (!user) {
      return NextResponse.json({ success: false, message: "Subadmin not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Fetch subadmin error:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const current = await getCurrentAdmin();
    if (!current) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await props.params;
    const isSelf = current.id === id;
    const canManageSubadmins =
      current.role === "super_admin" ||
      current.permissions.includes("*") ||
      current.permissions.includes("subadmins:manage");

    if (!isSelf && !canManageSubadmins) {
      return NextResponse.json(
        { success: false, message: "Forbidden: You cannot modify other subadmins." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = await updateSubadmin(id, body, current.name);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Subadmin updated successfully.",
      user: result.user,
    });
  } catch (error) {
    console.error("Update subadmin error:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const current = await getCurrentAdmin();
    if (!current) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const canManageSubadmins =
      current.role === "super_admin" ||
      current.permissions.includes("*") ||
      current.permissions.includes("subadmins:manage");

    if (!canManageSubadmins) {
      return NextResponse.json(
        { success: false, message: "Forbidden: You cannot delete subadmins." },
        { status: 403 }
      );
    }

    const { id } = await props.params;
    if (id === current.id) {
      return NextResponse.json(
        { success: false, message: "You cannot delete your own logged-in account." },
        { status: 400 }
      );
    }

    const result = await deleteSubadmin(id, current.name);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Subadmin account deleted successfully.",
    });
  } catch (error) {
    console.error("Delete subadmin error:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
