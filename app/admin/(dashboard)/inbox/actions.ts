"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteInbox(id: number) {
  await prisma.tbl_inbox.delete({
    where: { inbox_id: id },
  });
  
  revalidatePath("/admin/inbox");
}
