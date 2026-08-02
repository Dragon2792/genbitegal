"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addAgenda(formData: FormData) {
  const nama = formData.get("nama") as string;
  const deskripsi = formData.get("deskripsi") as string;
  const tempat = formData.get("tempat") as string;
  const waktu = formData.get("waktu") as string;
  const keterangan = formData.get("keterangan") as string;
  const mulai = formData.get("mulai") ? new Date(formData.get("mulai") as string) : new Date();
  const selesai = formData.get("selesai") ? new Date(formData.get("selesai") as string) : new Date();
  const author = formData.get("author") as string;

  await prisma.tbl_agenda.create({
    data: {
      agenda_nama: nama,
      agenda_deskripsi: deskripsi,
      agenda_tempat: tempat,
      agenda_waktu: waktu,
      agenda_keterangan: keterangan,
      agenda_mulai: mulai,
      agenda_selesai: selesai,
      agenda_author: author,
      agenda_tanggal: new Date(),
    }
  });

  revalidatePath("/admin/agenda");
  revalidatePath("/agenda");
}

export async function editAgenda(id: number, formData: FormData) {
  const nama = formData.get("nama") as string;
  const deskripsi = formData.get("deskripsi") as string;
  const tempat = formData.get("tempat") as string;
  const waktu = formData.get("waktu") as string;
  const keterangan = formData.get("keterangan") as string;
  const mulai = formData.get("mulai") ? new Date(formData.get("mulai") as string) : new Date();
  const selesai = formData.get("selesai") ? new Date(formData.get("selesai") as string) : new Date();

  await prisma.tbl_agenda.update({
    where: { agenda_id: id },
    data: {
      agenda_nama: nama,
      agenda_deskripsi: deskripsi,
      agenda_tempat: tempat,
      agenda_waktu: waktu,
      agenda_keterangan: keterangan,
      agenda_mulai: mulai,
      agenda_selesai: selesai,
    }
  });

  revalidatePath("/admin/agenda");
  revalidatePath("/agenda");
}

export async function deleteAgenda(id: number) {
  await prisma.tbl_agenda.delete({
    where: { agenda_id: id },
  });
  
  revalidatePath("/admin/agenda");
  revalidatePath("/agenda");
}
