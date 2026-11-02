"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteFileLocal } from "@/lib/uploadHelper";
import { ensurePengurusTable } from "@/lib/pengurus";

const db = prisma as any;

function parseForm(formData: FormData) {
  const kelompok = (formData.get("pengurus_kelompok") as string) || "kementrian";
  return {
    pengurus_nama: ((formData.get("pengurus_nama") as string) || "").trim(),
    pengurus_jabatan: ((formData.get("pengurus_jabatan") as string) || "").trim(),
    pengurus_kelompok: kelompok,
    pengurus_divisi: kelompok === "kementrian" ? ((formData.get("pengurus_divisi") as string) || "").trim() || null : null,
    pengurus_is_ketua: kelompok === "kementrian" && formData.get("pengurus_is_ketua") === "1" ? 1 : 0,
    pengurus_foto: ((formData.get("pengurus_foto") as string) || "").trim() || null,
    pengurus_urutan: Number(formData.get("pengurus_urutan")) || 0,
  };
}

function revalidateAll() {
  revalidatePath("/admin/pengurus");
  revalidatePath("/struktur");
}

export async function addPengurus(formData: FormData) {
  await ensurePengurusTable();
  await db.tbl_pengurus.create({ data: parseForm(formData) });
  revalidateAll();
  redirect("/admin/pengurus");
}

export async function editPengurus(id: number, formData: FormData) {
  await ensurePengurusTable();
  const data = parseForm(formData);
  const old = await db.tbl_pengurus.findUnique({ where: { pengurus_id: id } });

  await db.tbl_pengurus.update({ where: { pengurus_id: id }, data });

  // Hapus foto lama dari server jika diganti / dihapus
  if (old?.pengurus_foto && old.pengurus_foto !== data.pengurus_foto) {
    await deleteFileLocal(old.pengurus_foto, "images");
  }

  revalidateAll();
  redirect("/admin/pengurus");
}

export async function deletePengurus(id: number) {
  const old = await db.tbl_pengurus.findUnique({ where: { pengurus_id: id } });
  await db.tbl_pengurus.delete({ where: { pengurus_id: id } });
  if (old?.pengurus_foto) {
    await deleteFileLocal(old.pengurus_foto, "images");
  }
  revalidateAll();
}
