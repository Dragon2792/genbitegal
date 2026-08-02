"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addKategori(formData: FormData) {
  const nama = formData.get("nama") as string;

  await prisma.tbl_kategori.create({
    data: {
      kategori_nama: nama,
      kategori_tanggal: new Date(),
    }
  });

  revalidatePath("/admin/kategori");
  redirect("/admin/kategori");
}

export async function editKategori(id: number, formData: FormData) {
  const nama = formData.get("nama") as string;

  await prisma.tbl_kategori.update({
    where: { kategori_id: id },
    data: {
      kategori_nama: nama,
    }
  });

  revalidatePath("/admin/kategori");
  redirect("/admin/kategori");
}

export async function deleteKategori(id: number) {
  await prisma.tbl_kategori.delete({
    where: { kategori_id: id },
  });
  
  revalidatePath("/admin/kategori");
}
