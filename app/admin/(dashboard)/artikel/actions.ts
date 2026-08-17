"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { supabase } from "@/lib/supabase";

export async function addArtikel(formData: FormData) {
  const judul = formData.get("judul") as string;
  const isi = formData.get("isi") as string;
  const author = formData.get("author") as string;
  const kategori_id = parseInt(formData.get("kategori_id") as string) || 0;
  const photoName = formData.get("gambar_name") as string || "";
  
  // Get kategori_nama
  let kategori_nama = "";
  if (kategori_id > 0) {
    const kat = await prisma.tbl_kategori.findUnique({ where: { kategori_id } });
    if (kat) kategori_nama = kat.kategori_nama || "";
  }

  // Create slug from judul
  const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  await prisma.tbl_tulisan.create({
    data: {
      tulisan_judul: judul,
      tulisan_isi: isi,
      tulisan_author: author,
      tulisan_kategori_id: kategori_id,
      tulisan_kategori_nama: kategori_nama,
      tulisan_gambar: photoName,
      tulisan_slug: slug,
      tulisan_tanggal: new Date(),
    }
  });

  revalidatePath("/admin/artikel");
  redirect("/admin/artikel");
}

export async function editArtikel(id: number, formData: FormData) {
  const judul = formData.get("judul") as string;
  const isi = formData.get("isi") as string;
  const kategori_id = parseInt(formData.get("kategori_id") as string) || 0;
  const photoName = formData.get("gambar_name") as string || "";
  const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  let kategori_nama = "";
  if (kategori_id > 0) {
    const kat = await prisma.tbl_kategori.findUnique({ where: { kategori_id } });
    if (kat) kategori_nama = kat.kategori_nama || "";
  }

  const dataToUpdate: any = {
    tulisan_judul: judul,
    tulisan_isi: isi,
    tulisan_kategori_id: kategori_id,
    tulisan_kategori_nama: kategori_nama,
    tulisan_slug: slug,
  };

  if (photoName) {
    dataToUpdate.tulisan_gambar = photoName;
  }

  await prisma.tbl_tulisan.update({
    where: { tulisan_id: id },
    data: dataToUpdate
  });

  revalidatePath("/admin/artikel");
  redirect("/admin/artikel");
}

export async function deleteArtikel(id: number) {
  const artikel = await prisma.tbl_tulisan.findUnique({ where: { tulisan_id: id } });
  
  if (artikel?.tulisan_gambar) {
    try {
      await supabase.storage
        .from("genbi-asset")
        .remove([`images/${artikel.tulisan_gambar}`]);
    } catch (e) {
      console.log("File not found or cannot be deleted:", e);
    }
  }

  await prisma.tbl_tulisan.delete({
    where: { tulisan_id: id },
  });
  
  revalidatePath("/admin/artikel");
}
