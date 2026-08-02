"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addTestimoni(formData: FormData) {
  const nama = formData.get("nama") as string;
  const email = formData.get("email") as string;
  const isi = formData.get("isi") as string;
  
  await prisma.tbl_testimoni.create({
    data: {
      testimoni_nama: nama,
      testimoni_email: email,
      testimoni_isi: isi,
      testimoni_tanggal: new Date(),
    }
  });

  revalidatePath("/admin/testimoni");
  redirect("/admin/testimoni");
}

export async function deleteTestimoni(id: number) {
  await prisma.tbl_testimoni.delete({
    where: { testimoni_id: id },
  });
  
  revalidatePath("/admin/testimoni");
}
