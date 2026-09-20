"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadFileLocal, deleteFileLocal } from "@/lib/uploadHelper";

export async function deleteGaleri(id: number) {
  const galeri = await prisma.tbl_galeri.findUnique({ where: { galeri_id: id } });
  if (galeri?.galeri_gambar) {
    deleteFileLocal(galeri.galeri_gambar, "images");
  }

  if (galeri?.galeri_album_id && galeri.galeri_album_id > 0) {
    await prisma.tbl_album.updateMany({
      where: { album_id: galeri.galeri_album_id },
      data: { album_count: { decrement: 1 } }
    });
  }

  await prisma.tbl_galeri.delete({
    where: { galeri_id: id },
  });
  
  revalidatePath("/admin/album");
  revalidatePath("/admin/galeri");
}

export async function addGaleri(formData: FormData) {
  const judul = formData.get("judul") as string;
  const album_id = parseInt(formData.get("album_id") as string) || 0;
  const author = formData.get("author") as string;
  const fileGambar = formData.get("gambar") as File;
  
  let gambar = "default.jpg";

  if (fileGambar && fileGambar.size > 0) {
    const uploaded = await uploadFileLocal(fileGambar, "images");
    if (uploaded) {
      gambar = uploaded;
    }
  }

  await prisma.tbl_galeri.create({
    data: {
      galeri_judul: judul,
      galeri_album_id: album_id,
      galeri_author: author,
      galeri_gambar: gambar,
      galeri_tanggal: new Date(),
    }
  });

  if (album_id > 0) {
    await prisma.tbl_album.updateMany({
      where: { album_id: album_id },
      data: { album_count: { increment: 1 } }
    });
  }

  revalidatePath("/admin/album");
  revalidatePath("/admin/galeri");
  redirect("/admin/galeri");
}
