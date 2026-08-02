"use server";
import { prisma } from "@/lib/prisma";

export async function submitContact(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string; // We map this or ignore it, tbl_inbox doesn't have subject except maybe inbox_kontak could be phone.
  const message = formData.get("message") as string;

  try {
    await prisma.tbl_inbox.create({
      data: {
        inbox_nama: name,
        inbox_email: email,
        inbox_kontak: subject, // Using subject as kontak or we can rename to phone
        inbox_pesan: message,
        inbox_status: 1
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, error: "Gagal mengirim pesan" };
  }
}
