"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, unlink } from "fs/promises";
import path from "path";

export async function addAlbum(formData: FormData) {
  const nama = formData.get("nama") as string;
  const coverFile = formData.get("cover") as File;
  
  let cover = "default.jpg";

  if (coverFile && coverFile.size > 0) {
    const bytes = await coverFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    cover = Date.now() + "-" + coverFile.name.replace(/\s+/g, '-');
    const uploadPath = path.join(process.cwd(), "public", "assets", "images", cover);
    await writeFile(uploadPath, buffer);
  }

  // Assuming session info is handled elsewhere or hardcoded author for now
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
    const bytes = await coverFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const cover = Date.now() + "-" + coverFile.name.replace(/\s+/g, '-');
    const uploadPath = path.join(process.cwd(), "public", "assets", "images", cover);
    await writeFile(uploadPath, buffer);
    dataToUpdate.album_cover = cover;

    // Remove old cover if necessary
    const oldAlbum = await prisma.tbl_album.findUnique({ where: { album_id: id }});
    if (oldAlbum?.album_cover && oldAlbum.album_cover !== 'default.jpg' && oldAlbum.album_cover !== 'blank.png') {
      await unlink(path.join(process.cwd(), "public", "assets", "images", oldAlbum.album_cover)).catch(() => {});
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
      await supabase.storage.from("genbi-asset").remove([`images/${"public", "assets", "images", album.album_cover}`]);
    } catch (e) {
      console.log("File not found or cannot be deleted:", e);
    }
  }

  // Also might want to delete all photos in this album, or set them to null.
  // For now, let's just delete the album itself to match CodeIgniter behavior 
  // (which usually cascaded or just deleted the album).
  
  await prisma.tbl_album.delete({
    where: { album_id: id },
  });
  
  revalidatePath("/admin/album");
  revalidatePath("/admin/galeri"); // update gallery just in case
}
