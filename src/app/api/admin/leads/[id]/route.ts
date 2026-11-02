import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { getLeadById, updateLead, deleteLead } from "@/lib/admin-store";

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
    const lead = getLeadById(id);
    if (!lead) {
      return NextResponse.json({ success: false, message: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Fetch lead error:", error);
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
    const body = await request.json();

    const updated = updateLead(id, body, current.name);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Lead updated successfully.",
      lead: updated,
    });
  } catch (error) {
    console.error("Update lead error:", error);
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
    const deleted = deleteLead(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Lead removed successfully.",
    });
  } catch (error) {
    console.error("Delete lead error:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
