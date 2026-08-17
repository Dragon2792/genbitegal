"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export async function addAlbum(formData: FormData) {
  const nama = formData.get("nama") as string;
  const coverFile = formData.get("cover") as File;
  
  let cover = "default.jpg";

  if (coverFile && coverFile.size > 0) {
    const ext = coverFile.name.split('.').pop()?.toLowerCase() || 'jpg';
    cover = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    
    const { error } = await supabase.storage
      .from("genbi-asset")
      .upload(`images/${cover}`, coverFile, { cacheControl: '3600', upsert: false });
      
    if (error) {
      console.error("Failed to upload cover:", error);
      cover = "default.jpg";
    }
  }

  const author = "Admin"; 

  await prisma.tbl_album.create({
    data: {
      album_nama: nama,
      album_cover: cover,
      album_author: author,
      album_tanggal: new Date(),
      album_count: 0
    }
  });

  revalidatePath("/admin/album");
  redirect("/admin/album");
}

export async function editAlbum(id: number, formData: FormData) {
  const nama = formData.get("nama") as string;
  const coverFile = formData.get("cover") as File;

  const dataToUpdate: any = {
    album_nama: nama,
  };

  if (coverFile && coverFile.size > 0) {
    const ext = coverFile.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cover = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    
    const { error } = await supabase.storage
      .from("genbi-asset")
      .upload(`images/${cover}`, coverFile, { cacheControl: '3600', upsert: false });
      
    if (!error) {
      dataToUpdate.album_cover = cover;
      
      // Hapus cover lama dari Supabase
      const oldAlbum = await prisma.tbl_album.findUnique({ where: { album_id: id }});
      if (oldAlbum?.album_cover && oldAlbum.album_cover !== 'default.jpg' && oldAlbum.album_cover !== 'blank.png') {
        await supabase.storage.from("genbi-asset").remove([`images/${oldAlbum.album_cover}`]).catch(() => {});
      }
    }
  }

  await prisma.tbl_album.update({
    where: { album_id: id },
    data: dataToUpdate
  });

  revalidatePath("/admin/album");
  redirect("/admin/album");
}

export async function deleteAlbum(id: number) {
  const album = await prisma.tbl_album.findUnique({ where: { album_id: id } });
  
  if (album?.album_cover && album.album_cover !== 'default.jpg' && album.album_cover !== 'blank.png') {
    try {
      await supabase.storage.from("genbi-asset").remove([`images/${album.album_cover}`]);
    } catch (e) {
      console.log("File not found or cannot be deleted:", e);
    }
  }
  
  await prisma.tbl_album.delete({
    where: { album_id: id },
  });
  
  revalidatePath("/admin/album");
  revalidatePath("/admin/galeri");
}
