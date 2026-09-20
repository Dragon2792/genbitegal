import { NextRequest, NextResponse } from "next/server";
import { uploadFileLocal } from "@/lib/uploadHelper";

/**
 * POST /api/upload
 * Menerima file upload dari client (FormData) dan menyimpannya ke server.
 * 
 * Body: FormData dengan field:
 *   - file: File (required)
 *   - type: "images" | "files" (optional, default: "images")
 * 
 * Response: { fileName: string, url: string }
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "images";

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Tidak ada file yang dikirim" }, { status: 400 });
    }

    const validTypes = ["images", "files"];
    const uploadType = validTypes.includes(type) ? (type as "images" | "files") : "images";

    const fileName = await uploadFileLocal(file, uploadType);

    if (!fileName) {
      return NextResponse.json({ error: "Gagal menyimpan file" }, { status: 500 });
    }

    // uploadFileLocal sekarang mengembalikan full URL dari Cloudinary
    const url = fileName.startsWith("http") ? fileName : `/assets/${uploadType}/${fileName}`;
    return NextResponse.json({ fileName, url }, { status: 200 });
  } catch (err) {
    console.error("Upload API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
