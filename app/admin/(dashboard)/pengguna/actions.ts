"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { writeFile } from "fs/promises";
import path from "path";

export async function addPengguna(formData: FormData) {
  const nama = formData.get("nama") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const jenkel = formData.get("jenkel") as string;
  const email = formData.get("email") as string;
  const nohp = formData.get("nohp") as string;
  const level = formData.get("level") as string;
  const filefoto = formData.get("filefoto") as File;

  let photoName = "";

  if (filefoto && filefoto.size > 0) {
    const bytes = await filefoto.arrayBuffer();
    const buffer = Buffer.from(bytes);
    photoName = Date.now() + "-" + filefoto.name.replace(/\s+/g, '-');
    const uploadPath = path.join(process.cwd(), "public", "assets", "images", photoName);
    await writeFile(uploadPath, buffer);
  }

  // Hash password using MD5 to maintain compatibility with old CI3 system
  const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

  await prisma.tbl_pengguna.create({
    data: {
      pengguna_nama: nama,
      pengguna_username: username,
      pengguna_password: hashedPassword,
      pengguna_jenkel: jenkel,
      pengguna_email: email,
      pengguna_nohp: nohp,
      pengguna_level: level,
      pengguna_photo: photoName,
      pengguna_register: new Date(),
      pengguna_status: 1
    }
  });

  revalidatePath("/admin/pengguna");
  redirect("/admin/pengguna");
}

export async function editPengguna(id: number, formData: FormData) {
  const nama = formData.get("nama") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const jenkel = formData.get("jenkel") as string;
  const email = formData.get("email") as string;
  const nohp = formData.get("nohp") as string;
  const level = formData.get("level") as string;
  const filefoto = formData.get("filefoto") as File;

  const dataToUpdate: any = {
    pengguna_nama: nama,
    pengguna_username: username,
    pengguna_jenkel: jenkel,
    pengguna_email: email,
    pengguna_nohp: nohp,
    pengguna_level: level,
  };

  if (password) {
    dataToUpdate.pengguna_password = crypto.createHash('md5').update(password).digest('hex');
  }

  if (filefoto && filefoto.size > 0) {
    const bytes = await filefoto.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const photoName = Date.now() + "-" + filefoto.name.replace(/\s+/g, '-');
    const uploadPath = path.join(process.cwd(), "public", "assets", "images", photoName);
    await writeFile(uploadPath, buffer);
    dataToUpdate.pengguna_photo = photoName;
  }

  await prisma.tbl_pengguna.update({
    where: { pengguna_id: id },
    data: dataToUpdate
  });

  revalidatePath("/admin/pengguna");
  redirect("/admin/pengguna");
}

export async function deletePengguna(id: number) {
  await prisma.tbl_pengguna.delete({
    where: { pengguna_id: id },
  });
  
  revalidatePath("/admin/pengguna");
}
