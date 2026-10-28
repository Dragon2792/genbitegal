import fs from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Menyimpan file yang di-upload langsung ke storage lokal VPS.
 * Disimpan di: public/assets/images/ atau public/assets/files/
 * 
 * @param file - File object dari client / server action
 * @param type - "images" | "files"
 * @returns string nama file unik (misal: "1730101234-a1b2c3d4.jpg")
 */
export async function uploadFileLocal(file: File, type: "images" | "files" = "images"): Promise<string | null> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Folder tujuan di dalam folder public VPS
    const uploadDir = path.join(process.cwd(), "public", "assets", type);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Ekstrak ekstensi asli
    const ext = path.extname(file.name) || (type === "images" ? ".jpg" : "");
    // Format nama file: timestamp-randomHex.ext (unik & bebas karakter aneh)
    const randomHex = crypto.randomBytes(4).toString("hex");
    const uniqueFileName = `${Date.now()}-${randomHex}${ext.toLowerCase()}`;
    const targetFilePath = path.join(uploadDir, uniqueFileName);

    await fs.promises.writeFile(targetFilePath, buffer);

    console.log(`[Upload Success] File tersimpan: ${targetFilePath}`);
    // Mengembalikan nama file saja untuk disimpan di database
    return uniqueFileName;
  } catch (error: any) {
    console.error("Gagal menyimpan file ke storage lokal VPS:", error);
    throw new Error(`Gagal menyimpan file: ${error.message || String(error)}`);
  }
}

/**
 * Menghapus file dari storage lokal VPS.
 * 
 * @param fileName - nama file atau path/URL file yang akan dihapus
 * @param type - "images" | "files"
 */
export async function deleteFileLocal(fileName: string, type: "images" | "files" = "images"): Promise<boolean> {
  try {
    if (!fileName) return false;

    // Bersihkan nama file jika berupa URL Cloudinary atau path lengkap
    const cleanName = path.basename(fileName.split("?")[0]);

    // Lindungi file bawaan sistem / placeholder agar tidak terhapus
    const protectedFiles = [
      "placeholder.jpg",
      "blank.png",
      "logogenbi.png",
      "logo_genbi_tegal.png",
      "user_blank.png",
      "default.jpg"
    ];
    if (protectedFiles.includes(cleanName)) {
      return false;
    }

    const filePath = path.join(process.cwd(), "public", "assets", type, cleanName);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error menghapus file di storage lokal VPS:", error);
    return false;
  }
}

