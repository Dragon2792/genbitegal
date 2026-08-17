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
  const gambar = formData.get("gambar") as File;
  
  // Get kategori_nama
  let kategori_nama = "";
  if (kategori_id > 0) {
    const kat = await prisma.tbl_kategori.findUnique({ where: { kategori_id } });
    if (kat) kategori_nama = kat.kategori_nama || "";
  }

  let photoName = "";
  if (gambar && gambar.size > 0) {
    // Generate short unique name that fits VarChar(40) in DB
    const ext = gambar.name.split('.').pop()?.toLowerCase() || 'jpg';
    photoName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    
    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from("genbi-asset")
      .upload(`images/${photoName}`, gambar, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error("Failed to upload image:", error);
    }
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
  const gambar = formData.get("gambar") as File;
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

  if (gambar && gambar.size > 0) {
    // Generate short unique name that fits VarChar(40) in DB
    const ext = gambar.name.split('.').pop()?.toLowerCase() || 'jpg';
    const photoName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    
    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from("genbi-asset")
      .upload(`images/${photoName}`, gambar, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error("Failed to upload image:", error);
    } else {
      dataToUpdate.tulisan_gambar = photoName;
    }
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
