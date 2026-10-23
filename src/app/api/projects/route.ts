import { NextResponse } from "next/server";
import { getAllProjects } from "@/lib/admin-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const allProjects = await getAllProjects();

    const projects =
      category && category !== "All"
        ? allProjects.filter((p) => p.category.toLowerCase() === category.toLowerCase())
        : allProjects;

    return NextResponse.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Public projects API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects." },
      { status: 500 }
    );
  }
}
