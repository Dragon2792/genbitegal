import fs from "fs";
import path from "path";

import { v2 as cloudinary } from 'cloudinary';

// Cloudinary v2 SDK secara otomatis akan membaca process.env.CLOUDINARY_URL
// Jadi kita tidak perlu melakukan cloudinary.config() secara manual asalkan CLOUDINARY_URL ada di .env

export async function uploadFileLocal(file: File, type: "images" | "files" = "images"): Promise<string | null> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Kita menggunakan upload_stream untuk mengirim buffer langsung ke Cloudinary
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `genbi/${type}`,
          resource_type: "auto", // otomatis mendeteksi image/raw file
        },
        (error, result) => {
          if (error) {
            console.error("Error upload ke Cloudinary:", error);
            reject(null);
          } else if (result) {
            // Mengembalikan secure_url dari Cloudinary
            resolve(result.secure_url);
          } else {
            reject(null);
          }
        }
      );
      
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Gagal memproses file untuk upload Cloudinary:", error);
    return null;
  }
}

export async function deleteFileLocal(fileName: string, type: "images" | "files" = "images"): Promise<boolean> {
  try {
    // Di Cloudinary, untuk menghapus kita butuh public_id.
    // Jika kita menyimpan full URL (https://res.cloudinary.com/...), kita perlu mengekstrak public_id-nya.
    // Namun untuk sementara, jika public_id rumit, bisa diabaikan atau gunakan fungsi extract.
    // Asumsi: jika fileName berupa URL Cloudinary, kita ekstrak public_id-nya.
    
    if (fileName.includes("cloudinary.com")) {
      const parts = fileName.split("/");
      const lastPart = parts[parts.length - 1];
      const publicIdWithExtension = lastPart;
      const publicId = publicIdWithExtension.split(".")[0];
      const fullPublicId = `genbi/${type}/${publicId}`;
      
      await cloudinary.uploader.destroy(fullPublicId);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error menghapus file di Cloudinary:", error);
    return false;
  }
}
