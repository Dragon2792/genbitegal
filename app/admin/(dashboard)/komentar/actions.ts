"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteKomentar(id: number) {
  await prisma.tbl_komentar.delete({
    where: { komentar_id: id },
  });
  
  revalidatePath("/admin/komentar");
}

export async function toggleStatus(id: number, currentStatus: string) {
  const newStatus = currentStatus === "1" ? "0" : "1";
  await prisma.tbl_komentar.update({
    where: { komentar_id: id },
    data: { komentar_status: newStatus }
  });
  
  revalidatePath("/admin/komentar");
}
