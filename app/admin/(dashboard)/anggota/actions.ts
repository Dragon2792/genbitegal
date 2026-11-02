"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { uploadFileLocal, deleteFileLocal } from "@/lib/uploadHelper";

export type DuplicateStrategy = "skip" | "update" | "insert";

export interface ImportAnggotaRowInput {
  nis: string;
  nama: string;
  jenkel: "L" | "P";
  kelas_id: number;
  photo?: string | null;
}

export interface ImportAnggotaResult {
  success: boolean;
  insertedCount: number;
  updatedCount: number;
  skippedCount: number;
  errors: string[];
  message: string;
}

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

export async function importAnggota(
  rows: ImportAnggotaRowInput[],
  duplicateStrategy: DuplicateStrategy = "skip"
): Promise<ImportAnggotaResult> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("genbi_admin_session");
    if (!sessionCookie?.value) {
      return {
        success: false,
        insertedCount: 0,
        updatedCount: 0,
        skippedCount: 0,
        errors: ["Sesi admin berakhir. Silakan login kembali."],
        message: "Sesi admin berakhir. Silakan login kembali.",
      };
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return {
        success: false,
        insertedCount: 0,
        updatedCount: 0,
        skippedCount: 0,
        errors: ["Tidak ada data anggota untuk diimport."],
        message: "Tidak ada data anggota untuk diimport.",
      };
    }

    const kelasList = await prisma.tbl_kelas.findMany({
      select: { kelas_id: true },
    });
    const validKelasIds = new Set(kelasList.map((k) => k.kelas_id));

    const sanitizedRows: ImportAnggotaRowInput[] = [];
    const errors: string[] = [];

    rows.forEach((raw, idx) => {
      const nis = (raw.nis ?? "").toString().trim().slice(0, 20);
      const nama = (raw.nama ?? "").toString().trim().slice(0, 70);
      const jenkel = raw.jenkel === "L" || raw.jenkel === "P" ? raw.jenkel : null;
      const kelasId = Number(raw.kelas_id) || 0;
      const photo = raw.photo ? raw.photo.toString().trim() || null : null;

      if (!nis) {
        errors.push(`Data #${idx + 1}: NIS/NIM kosong.`);
        return;
      }
      if (!nama) {
        errors.push(`Data #${idx + 1} (NIS ${nis}): Nama lengkap kosong.`);
        return;
      }
      if (!jenkel) {
        errors.push(`Data #${idx + 1} (${nama}): Jenis kelamin harus L atau P.`);
        return;
      }
      if (!validKelasIds.has(kelasId)) {
        errors.push(`Data #${idx + 1} (${nama}): Komisariat/Kelas tidak valid.`);
        return;
      }

      sanitizedRows.push({
        nis,
        nama,
        jenkel,
        kelas_id: kelasId,
        photo,
      });
    });

    if (sanitizedRows.length === 0) {
      return {
        success: false,
        insertedCount: 0,
        updatedCount: 0,
        skippedCount: 0,
        errors,
        message: "Tidak ada baris data yang valid untuk diimport.",
      };
    }

    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    if (duplicateStrategy === "insert") {
      const dataToCreate = sanitizedRows.map((r) => ({
        siswa_nis: r.nis,
        siswa_nama: r.nama,
        siswa_jenkel: r.jenkel,
        siswa_kelas_id: r.kelas_id,
        siswa_photo: r.photo ?? null,
      }));

      for (let i = 0; i < dataToCreate.length; i += 500) {
        const chunk = dataToCreate.slice(i, i + 500);
        const res = await prisma.tbl_siswa.createMany({ data: chunk });
        insertedCount += res.count;
      }
    } else {
      const uniqueNis = Array.from(new Set(sanitizedRows.map((r) => r.nis)));
      const existingRecords = await prisma.tbl_siswa.findMany({
        where: { siswa_nis: { in: uniqueNis } },
        select: { siswa_id: true, siswa_nis: true },
        orderBy: { siswa_id: "desc" },
      });

      const existingMap = new Map<string, number>();
      for (const rec of existingRecords) {
        if (rec.siswa_nis) {
          const key = rec.siswa_nis.trim().toLowerCase();
          if (!existingMap.has(key)) {
            existingMap.set(key, rec.siswa_id);
          }
        }
      }

      if (duplicateStrategy === "skip") {
        const seenInBatch = new Set<string>();
        const dataToCreate: {
          siswa_nis: string;
          siswa_nama: string;
          siswa_jenkel: string;
          siswa_kelas_id: number;
          siswa_photo: string | null;
        }[] = [];

        for (const r of sanitizedRows) {
          const key = r.nis.toLowerCase();
          if (existingMap.has(key) || seenInBatch.has(key)) {
            skippedCount++;
            continue;
          }
          seenInBatch.add(key);
          dataToCreate.push({
            siswa_nis: r.nis,
            siswa_nama: r.nama,
            siswa_jenkel: r.jenkel,
            siswa_kelas_id: r.kelas_id,
            siswa_photo: r.photo ?? null,
          });
        }

        for (let i = 0; i < dataToCreate.length; i += 500) {
          const chunk = dataToCreate.slice(i, i + 500);
          const res = await prisma.tbl_siswa.createMany({ data: chunk });
          insertedCount += res.count;
        }
      } else if (duplicateStrategy === "update") {
        // Deduplicate within file: last occurrence wins
        const dedupedByNis = new Map<string, ImportAnggotaRowInput>();
        for (const r of sanitizedRows) {
          const key = r.nis.toLowerCase();
          if (dedupedByNis.has(key)) {
            skippedCount++;
          }
          dedupedByNis.set(key, r);
        }

        const dataToCreate: {
          siswa_nis: string;
          siswa_nama: string;
          siswa_jenkel: string;
          siswa_kelas_id: number;
          siswa_photo: string | null;
        }[] = [];
        const updatesToRun: { id: number; data: Record<string, unknown> }[] = [];

        for (const [key, r] of dedupedByNis.entries()) {
          const existingId = existingMap.get(key);
          if (existingId !== undefined) {
            const updateData: Record<string, unknown> = {
              siswa_nis: r.nis,
              siswa_nama: r.nama,
              siswa_jenkel: r.jenkel,
              siswa_kelas_id: r.kelas_id,
            };
            if (r.photo) {
              updateData.siswa_photo = r.photo;
            }
            updatesToRun.push({ id: existingId, data: updateData });
          } else {
            dataToCreate.push({
              siswa_nis: r.nis,
              siswa_nama: r.nama,
              siswa_jenkel: r.jenkel,
              siswa_kelas_id: r.kelas_id,
              siswa_photo: r.photo ?? null,
            });
          }
        }

        for (let i = 0; i < dataToCreate.length; i += 500) {
          const chunk = dataToCreate.slice(i, i + 500);
          const res = await prisma.tbl_siswa.createMany({ data: chunk });
          insertedCount += res.count;
        }

        for (let i = 0; i < updatesToRun.length; i += 50) {
          const chunk = updatesToRun.slice(i, i + 50);
          await prisma.$transaction(
            chunk.map((u) =>
              prisma.tbl_siswa.update({
                where: { siswa_id: u.id },
                data: u.data,
              })
            )
          );
          updatedCount += chunk.length;
        }
      }
    }

    revalidatePath("/admin/anggota");
    revalidatePath("/anggota");
    revalidatePath("/");

    const summaryParts: string[] = [];
    if (insertedCount > 0) summaryParts.push(`${insertedCount} anggota baru ditambahkan`);
    if (updatedCount > 0) summaryParts.push(`${updatedCount} data anggota diperbarui`);
    if (skippedCount > 0) summaryParts.push(`${skippedCount} duplikat dilewati`);

    return {
      success: true,
      insertedCount,
      updatedCount,
      skippedCount,
      errors,
      message:
        summaryParts.length > 0
          ? `Import selesai: ${summaryParts.join(", ")}.`
          : "Import selesai, tidak ada perubahan data.",
    };
  } catch (error: unknown) {
    console.error("Import anggota error:", error);
    const errMsg = error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan data ke database.";
    return {
      success: false,
      insertedCount: 0,
      updatedCount: 0,
      skippedCount: 0,
      errors: [errMsg],
      message: `Gagal mengimport data: ${errMsg}`,
    };
  }
}
