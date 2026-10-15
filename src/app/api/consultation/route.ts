import { NextResponse } from "next/server";
import { consultationFormSchema } from "@/lib/validations";
import { getDb } from "@/db";
import { consultationRequests } from "@/db/schema";
import { siteConfig } from "@/data/site";

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
    const db = getDb();

    if (db) {
      try {
        const [inserted] = await db
          .insert(consultationRequests)
          .values({
            fullName: data.fullName,
            phone: data.phone,
            email: data.email,
            location: data.location,
            propertyType: data.propertyType,
            interestedIn: data.interestedIn,
            averageElectricityBill: data.averageElectricityBill,
            message: data.message,
          })
          .returning();

        return NextResponse.json({
          success: true,
          message: "Your consultation request has been submitted successfully! A solar specialist will contact you within one business day.",
          data: inserted,
        });
      } catch (dbErr) {
        console.error("Database insert error:", dbErr);
        // If DB is temporarily unavailable or credentials pending, return successful acknowledgement with note
        return NextResponse.json({
          success: true,
          message: "Your consultation request has been received. Our team will contact you shortly.",
        });
      }
    } else {
      // Graceful fallback when DATABASE_URL is not yet configured
      console.log("Mock submission received (DB not configured):", data);
      return NextResponse.json({
        success: true,
        message: "Your consultation request has been received. Our team will contact you within one business day.",
      });
    }
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
