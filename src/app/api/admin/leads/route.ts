import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { getAllLeads, addLead } from "@/lib/admin-store";
import { LeadStatus } from "@/lib/admin-types";

export async function GET(request: Request) {
  try {
    const current = await getCurrentAdmin();
    if (!current) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const propertyType = searchParams.get("propertyType") || undefined;
    const search = searchParams.get("search") || undefined;

    const leads = getAllLeads({ status, propertyType, search });
    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error("Fetch leads error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch leads." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const current = await getCurrentAdmin();
    if (!current) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const {
      fullName,
      phone,
      email,
      location,
      propertyType,
      interestedIn,
      averageElectricityBill,
      message,
      status,
      estimatedKw,
    } = body;

    if (!fullName || !phone || !email || !location) {
      return NextResponse.json(
        { success: false, message: "Name, phone, email, and location are required." },
        { status: 400 }
      );
    }

    const newLead = addLead({
      fullName,
      phone,
      email,
      location,
      propertyType: propertyType || "Residential",
      interestedIn: interestedIn || "Solar Consultation",
      averageElectricityBill: averageElectricityBill || "N/A",
      message: message || "Direct lead entered from admin console.",
      status: (status as LeadStatus) || "pending",
      estimatedKw,
    });

    return NextResponse.json({
      success: true,
      message: "Lead added successfully.",
      lead: newLead,
    });
  } catch (error) {
    console.error("Create lead error:", error);
    return NextResponse.json({ success: false, message: "Failed to create lead." }, { status: 500 });
  }
}
