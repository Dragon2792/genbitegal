import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".zip": "application/zip",
};

/**
 * Route handler dinamis untuk menyajikan file dari public/assets/
 * Sangat penting di Next.js production agar file yang di-upload saat runtime
 * (setelah npm run build) tetap bisa diakses langsung tanpa error 404.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const pathSegments = resolvedParams.path || [];

    // Keamanan: cegah path traversal
    const safeSegments = pathSegments.filter(p => !p.includes("..") && !p.includes("/") && !p.includes("\\"));
    const filePath = path.join(process.cwd(), "public", "assets", ...safeSegments);

    if (!fs.existsSync(filePath)) {
      // Jika file gambar tidak ditemukan, coba kembalikan placeholder
      if (safeSegments[0] === "images") {
        const placeholderPath = path.join(process.cwd(), "public", "assets", "images", "placeholder.jpg");
        if (fs.existsSync(placeholderPath)) {
          const buffer = await fs.promises.readFile(placeholderPath);
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              "Content-Type": "image/jpeg",
              "Cache-Control": "public, max-age=60",
            },
          });
        }
      }
      return new NextResponse("File Not Found", { status: 404 });
    }

    const stat = await fs.promises.stat(filePath);
    if (!stat.isFile()) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const fileBuffer = await fs.promises.readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": stat.size.toString(),
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("Error serving asset:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
