"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadFileLocal, deleteFileLocal } from "@/lib/uploadHelper";

export async function addAlbum(formData: FormData) {
  const nama = formData.get("nama") as string;
  const coverFile = formData.get("cover") as File;
  
  let cover = "default.jpg";

  if (coverFile && coverFile.size > 0) {
    const uploaded = await uploadFileLocal(coverFile, "images");
    if (uploaded) cover = uploaded;
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
    const uploaded = await uploadFileLocal(coverFile, "images");
    if (uploaded) {
      dataToUpdate.album_cover = uploaded;
      // Hapus cover lama dari server
      const oldAlbum = await prisma.tbl_album.findUnique({ where: { album_id: id } });
      if (oldAlbum?.album_cover) {
        deleteFileLocal(oldAlbum.album_cover, "images");
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
  
  if (album?.album_cover) {
    deleteFileLocal(album.album_cover, "images");
  }
  
  await prisma.tbl_album.delete({
    where: { album_id: id },
  });
  
  revalidatePath("/admin/album");
  revalidatePath("/admin/galeri");
}
