"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadFileLocal, deleteFileLocal } from "@/lib/uploadHelper";

export async function addAnggota(formData: FormData) {
  const nis = formData.get("nis") as string;
  const nama = formData.get("nama") as string;
  const jenkel = formData.get("jenkel") as string;
  const kelas_id = parseInt(formData.get("kelas_id") as string) || 0;
  const photoFile = formData.get("photo") as File;
  
  let photo = "default.jpg";

  if (photoFile && photoFile.size > 0) {
    const uploaded = await uploadFileLocal(photoFile, "images");
    if (uploaded) photo = uploaded;
  }

  await prisma.tbl_siswa.create({
    data: {
      siswa_nis: nis,
      siswa_nama: nama,
      siswa_jenkel: jenkel,
      siswa_kelas_id: kelas_id,
      siswa_photo: photo,
    }
  });

  revalidatePath("/admin/anggota");
  revalidatePath("/anggota");
  redirect("/admin/anggota");
}

export async function editAnggota(id: number, formData: FormData) {
  const nis = formData.get("nis") as string;
  const nama = formData.get("nama") as string;
  const jenkel = formData.get("jenkel") as string;
  const kelas_id = parseInt(formData.get("kelas_id") as string) || 0;
  const photoFile = formData.get("photo") as File;

  const dataToUpdate: any = {
    siswa_nis: nis,
    siswa_nama: nama,
    siswa_jenkel: jenkel,
    siswa_kelas_id: kelas_id,
  };

  if (photoFile && photoFile.size > 0) {
    const uploaded = await uploadFileLocal(photoFile, "images");
    if (uploaded) {
      dataToUpdate.siswa_photo = uploaded;
    }
  }

  await prisma.tbl_siswa.update({
    where: { siswa_id: id },
    data: dataToUpdate
  });

  revalidatePath("/admin/anggota");
  revalidatePath("/anggota");
  redirect("/admin/anggota");
}

export async function deleteAnggota(id: number) {
  const anggota = await prisma.tbl_siswa.findUnique({ where: { siswa_id: id } });
  
  if (anggota?.siswa_photo && anggota.siswa_photo !== 'default.jpg' && anggota.siswa_photo !== 'blank.png') {
    deleteFileLocal(anggota.siswa_photo, "images");
  }

  await prisma.tbl_siswa.delete({
    where: { siswa_id: id },
  });
  
  revalidatePath("/admin/anggota");
  revalidatePath("/anggota");
}
