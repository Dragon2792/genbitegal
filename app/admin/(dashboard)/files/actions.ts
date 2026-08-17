"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export async function addFile(formData: FormData) {
  const judul = formData.get("judul") as string;
  const deskripsi = formData.get("deskripsi") as string;
  const oleh = formData.get("oleh") as string;
  const fileData = formData.get("file_data") as File;
  
  let fileName = "";

  if (fileData && fileData.size > 0) {
    const bytes = await fileData.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = fileData.name.split('.').pop()?.toLowerCase() || 'pdf';
    fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    
    const { error } = await supabase.storage
      .from("genbi-asset")
      .upload(`files/${fileName}`, buffer, { cacheControl: '3600', upsert: false, contentType: fileData.type });
      
    if (error) {
      console.error("Failed to upload file:", error);
      fileName = "";
    }
  }

  await prisma.tbl_files.create({
    data: {
      file_judul: judul,
      file_deskripsi: deskripsi,
      file_oleh: oleh,
      file_data: fileName,
      file_tanggal: new Date(),
    }
  });

  revalidatePath("/admin/files");
  redirect("/admin/files");
}

export async function deleteFile(id: number) {
  const file = await prisma.tbl_files.findUnique({ where: { file_id: id } });
  if (file?.file_data) {
    try {
      await supabase.storage.from("genbi-asset").remove([`files/${file.file_data}`]);
    } catch (e) {
      console.log("File not found or cannot be deleted:", e);
    }
  }

  await prisma.tbl_files.delete({
    where: { file_id: id },
  });
  
  revalidatePath("/admin/files");
}
