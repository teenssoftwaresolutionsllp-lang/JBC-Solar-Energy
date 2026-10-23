import { NextResponse } from "next/server";
import { consultationFormSchema } from "@/lib/validations";
import { getDb } from "@/db";
import { consultationRequests } from "@/db/schema";
import { siteConfig } from "@/data/site";
import { addLead } from "@/lib/admin-store";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parseResult = consultationFormSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parseResult.error.flatten().fieldErrors,
          message: "Please check the form for errors.",
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Save into persistent admin store so it immediately displays on the Admin Dashboard
    const savedLead = addLead({
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      location: data.location,
      propertyType: data.propertyType,
      interestedIn: data.interestedIn,
      averageElectricityBill: data.averageElectricityBill,
      message: data.message,
      status: "pending",
    });

    // Also attempt Drizzle/Postgres write if database connection is available
    const db = getDb();
    if (db) {
      try {
        await db.insert(consultationRequests).values({
          id: savedLead.id,
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          location: data.location,
          propertyType: data.propertyType,
          interestedIn: data.interestedIn,
          averageElectricityBill: data.averageElectricityBill,
          message: data.message,
          status: "pending",
        });
      } catch (dbErr) {
        console.warn("Postgres insert skipped/failed, admin-store persisted:", dbErr);
      }
    }


    return NextResponse.json({
      success: true,
      message:
        "Your consultation request has been submitted successfully! A solar specialist will contact you within one business day.",
      data: savedLead,
    });
  } catch (error) {
    console.error("Consultation submission error:", error);
    return NextResponse.json(
      {
        success: false,
        message: `An unexpected error occurred. Please try again or call ${siteConfig.contact.phone}.`,
      },
      { status: 500 }
    );
  }
}
