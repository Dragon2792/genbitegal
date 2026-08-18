"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addKomisariat(formData: FormData) {
  const data = {
    komisariat_nama: formData.get("komisariat_nama") as string,
    komisariat_short: formData.get("komisariat_short") as string,
    komisariat_ketua: formData.get("komisariat_ketua") as string,
    komisariat_desc: formData.get("komisariat_desc") as string,
    komisariat_members: formData.get("komisariat_members") as string,
    komisariat_proker: formData.get("komisariat_proker") as string,
    komisariat_awards: formData.get("komisariat_awards") as string,
    komisariat_ig: formData.get("komisariat_ig") as string,
    komisariat_web: formData.get("komisariat_web") as string,
    komisariat_urutan: Number(formData.get("komisariat_urutan")) || 0,
    komisariat_logo: formData.get("komisariat_logo") as string,
  };

  await prisma.tbl_komisariat.create({
    data,
  });

  revalidatePath("/admin/komisariat");
  revalidatePath("/komisariat");
  revalidatePath("/");
  revalidatePath("/about");
  redirect("/admin/komisariat");
}

export async function editKomisariat(id: number, formData: FormData) {
  const data = {
    komisariat_nama: formData.get("komisariat_nama") as string,
    komisariat_short: formData.get("komisariat_short") as string,
    komisariat_ketua: formData.get("komisariat_ketua") as string,
    komisariat_desc: formData.get("komisariat_desc") as string,
    komisariat_members: formData.get("komisariat_members") as string,
    komisariat_proker: formData.get("komisariat_proker") as string,
    komisariat_awards: formData.get("komisariat_awards") as string,
    komisariat_ig: formData.get("komisariat_ig") as string,
    komisariat_web: formData.get("komisariat_web") as string,
    komisariat_urutan: Number(formData.get("komisariat_urutan")) || 0,
    komisariat_logo: formData.get("komisariat_logo") as string,
  };

  await prisma.tbl_komisariat.update({
    where: { komisariat_id: id },
    data,
  });

  revalidatePath("/admin/komisariat");
  revalidatePath("/komisariat");
  revalidatePath("/");
  revalidatePath("/about");
  redirect("/admin/komisariat");
}

export async function deleteKomisariat(id: number) {
  await prisma.tbl_komisariat.delete({
    where: { komisariat_id: id },
  });

  revalidatePath("/admin/komisariat");
  revalidatePath("/komisariat");
  revalidatePath("/");
  revalidatePath("/about");
}
