"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export async function addAnggota(formData: FormData) {
  const nis = formData.get("nis") as string;
  const nama = formData.get("nama") as string;
  const jenkel = formData.get("jenkel") as string;
  const kelas_id = parseInt(formData.get("kelas_id") as string) || 0;
  const photoFile = formData.get("photo") as File;
  
  let photo = "default.jpg";

  if (photoFile && photoFile.size > 0) {
    const bytes = await photoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = photoFile.name.split('.').pop()?.toLowerCase() || 'jpg';
    photo = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    
    const { error } = await supabase.storage
      .from("genbi-asset")
      .upload(`images/${photo}`, buffer, { cacheControl: '3600', upsert: false, contentType: photoFile.type });
      
    if (error) {
      console.error("Failed to upload photo:", error);
      photo = "default.jpg";
    }
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
    const bytes = await photoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = photoFile.name.split('.').pop()?.toLowerCase() || 'jpg';
    const photo = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    
    const { error } = await supabase.storage
      .from("genbi-asset")
      .upload(`images/${photo}`, buffer, { cacheControl: '3600', upsert: false, contentType: photoFile.type });
      
    if (!error) {
      dataToUpdate.siswa_photo = photo;
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
    try {
      await supabase.storage.from("genbi-asset").remove([`images/${anggota.siswa_photo}`]);
    } catch (e) {
      console.log("File not found or cannot be deleted:", e);
    }
  }

  await prisma.tbl_siswa.delete({
    where: { siswa_id: id },
  });
  
  revalidatePath("/admin/anggota");
  revalidatePath("/anggota");
}
