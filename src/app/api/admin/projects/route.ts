import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { getAllProjects, addProject } from "@/lib/admin-store";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error("Fetch projects error:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
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
      title,
      category,
      capacity,
      location,
      client,
      completionYear,
      status,
      image,
      description,
      impact,
    } = body;

    if (!title || !category || !capacity || !location) {
      return NextResponse.json(
        { success: false, message: "Title, category, capacity, and location are required." },
        { status: 400 }
      );
    }

    const newProject = await addProject({
      title,
      category,
      capacity,
      location,
      client: client || "JBC Client",
      completionYear: completionYear || new Date().getFullYear().toString(),
      status: status || "Completed",
      image: image || "/images/image 7.png",
      description: description || "High performance solar installation engineered by JBC.",
      impact,
    });

    try {
      revalidatePath("/projects");
      revalidatePath("/");
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: "Solar project added successfully.",
      project: newProject,
    });
  } catch (error) {
    console.error("Add project error:", error);
    return NextResponse.json({ success: false, message: "Failed to add project." }, { status: 500 });
  }
}

