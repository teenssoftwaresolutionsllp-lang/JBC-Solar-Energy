import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { updateProject, deleteProject } from "@/lib/admin-store";
import { revalidatePath } from "next/cache";

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
    const body = await request.json();
    const updated = await updateProject(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, message: "Project not found." }, { status: 404 });
    }

    try {
      revalidatePath("/projects");
      revalidatePath("/");
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: "Project updated successfully.",
      project: updated,
    });
  } catch (error) {
    console.error("Update project error:", error);
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

    const { id } = await props.params;
    const deleted = await deleteProject(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Project not found." }, { status: 404 });
    }

    try {
      revalidatePath("/projects");
      revalidatePath("/");
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: "Project removed successfully.",
    });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}

