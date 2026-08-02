"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addPengumuman(formData: FormData) {
  const judul = formData.get("judul") as string;
  const deskripsi = formData.get("deskripsi") as string;
  const author = formData.get("author") as string;

  await prisma.tbl_pengumuman.create({
    data: {
      pengumuman_judul: judul,
      pengumuman_deskripsi: deskripsi,
      pengumuman_author: author,
      pengumuman_tanggal: new Date(),
    }
  });

  revalidatePath("/admin/pengumuman");
  revalidatePath("/pengumuman");
}

export async function editPengumuman(id: number, formData: FormData) {
  const judul = formData.get("judul") as string;
  const deskripsi = formData.get("deskripsi") as string;

  await prisma.tbl_pengumuman.update({
    where: { pengumuman_id: id },
    data: {
      pengumuman_judul: judul,
      pengumuman_deskripsi: deskripsi,
    }
  });

  revalidatePath("/admin/pengumuman");
  revalidatePath("/pengumuman");
}

export async function deletePengumuman(id: number) {
  await prisma.tbl_pengumuman.delete({
    where: { pengumuman_id: id },
  });
  
  revalidatePath("/admin/pengumuman");
  revalidatePath("/pengumuman");
}
