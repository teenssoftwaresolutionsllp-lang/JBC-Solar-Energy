import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No image file provided." },
        { status: 400 }
      );
    }

    // Validate mime type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid image format. Supported formats: JPG, PNG, WEBP, AVIF, GIF, and SVG.",
        },
        { status: 400 }
      );
    }

    // Limit size to 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "Image exceeds 10MB limit." },
        { status: 400 }
      );
    }

    // Determine extension
    const originalExt = path.extname(file.name).toLowerCase();
    const mimeToExt: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/avif": ".avif",
      "image/gif": ".gif",
      "image/svg+xml": ".svg",
    };
    const ext = originalExt && [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"].includes(originalExt)
      ? originalExt
      : mimeToExt[file.type] || ".jpg";

    // Setup upload directory: public/uploads/projects
    const uploadDir = path.join(process.cwd(), "public", "uploads", "projects");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const cleanBaseName = path
      .basename(file.name, originalExt)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const randomSuffix = crypto.randomBytes(6).toString("hex");
    const fileName = `proj_${Date.now()}_${cleanBaseName || "img"}_${randomSuffix}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/projects/${fileName}`;

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully.",
      url: publicUrl,
      fileName,
      size: file.size,
    });
  } catch (error) {
    console.error("Project image upload error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload image. Please try again." },
      { status: 500 }
    );
  }
}
