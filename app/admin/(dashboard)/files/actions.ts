"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadFileLocal, deleteFileLocal } from "@/lib/uploadHelper";

export async function addFile(formData: FormData) {
  const judul = formData.get("judul") as string;
  const deskripsi = formData.get("deskripsi") as string;
  const oleh = formData.get("oleh") as string;
  const fileData = formData.get("file_data") as File;
  
  let fileName = "";

  if (fileData && fileData.size > 0) {
    const uploaded = await uploadFileLocal(fileData, "files");
    if (uploaded) fileName = uploaded;
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
    deleteFileLocal(file.file_data, "files");
  }

  await prisma.tbl_files.delete({
    where: { file_id: id },
  });
  
  revalidatePath("/admin/files");
}
