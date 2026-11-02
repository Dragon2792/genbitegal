import { prisma } from "@/lib/prisma";

export const KELOMPOK_OPTIONS = [
  { value: "presiden", label: "Presiden" },
  { value: "dewan", label: "Dewan Pengawas" },
  { value: "kementrian", label: "Kementrian (Mentri & Staf Ahli)" },
  { value: "komisariat", label: "Ketua Komisariat" },
] as const;

export const DIVISI_OPTIONS = ["Mentri Komunikasi", "Mentri Keuangan", "Mentri SDM"];

export type Pengurus = {
  pengurus_id: number;
  pengurus_nama: string | null;
  pengurus_jabatan: string | null;
  pengurus_kelompok: string | null;
  pengurus_divisi: string | null;
  pengurus_is_ketua: number;
  pengurus_foto: string | null;
  pengurus_urutan: number;
};

const db = prisma as any;
let ensured = false;

// Data awal (sebelumnya hardcode di halaman /struktur)
const SEED: Omit<Pengurus, "pengurus_id" | "pengurus_foto">[] = [
  { pengurus_nama: "Kristono", pengurus_jabatan: "Presiden GenBI Tegal", pengurus_kelompok: "presiden", pengurus_divisi: null, pengurus_is_ketua: 0, pengurus_urutan: 1 },
  { pengurus_nama: "Riema Ainun Nissa", pengurus_jabatan: "Dewan Pengawas", pengurus_kelompok: "dewan", pengurus_divisi: null, pengurus_is_ketua: 0, pengurus_urutan: 1 },
  { pengurus_nama: "M. Rifqi Al Khadziq", pengurus_jabatan: "Dewan Pengawas", pengurus_kelompok: "dewan", pengurus_divisi: null, pengurus_is_ketua: 0, pengurus_urutan: 2 },
  { pengurus_nama: "Navis Mughni V.", pengurus_jabatan: "Dewan Pengawas", pengurus_kelompok: "dewan", pengurus_divisi: null, pengurus_is_ketua: 0, pengurus_urutan: 3 },

  { pengurus_nama: "Irgi Akhmad Farrery", pengurus_jabatan: "Mentri", pengurus_kelompok: "kementrian", pengurus_divisi: "Mentri Komunikasi", pengurus_is_ketua: 1, pengurus_urutan: 1 },
  { pengurus_nama: "Nur Muhammad Arya N", pengurus_jabatan: "S.A Website", pengurus_kelompok: "kementrian", pengurus_divisi: "Mentri Komunikasi", pengurus_is_ketua: 0, pengurus_urutan: 2 },
  { pengurus_nama: "Wulan Lailatur R.", pengurus_jabatan: "S.A Media Sosial & Podcast", pengurus_kelompok: "kementrian", pengurus_divisi: "Mentri Komunikasi", pengurus_is_ketua: 0, pengurus_urutan: 3 },
  { pengurus_nama: "Slamet Arofah", pengurus_jabatan: "S.A Media Sosial & Podcast", pengurus_kelompok: "kementrian", pengurus_divisi: "Mentri Komunikasi", pengurus_is_ketua: 0, pengurus_urutan: 4 },

  { pengurus_nama: "Riska Putri Yuniar", pengurus_jabatan: "Mentri", pengurus_kelompok: "kementrian", pengurus_divisi: "Mentri Keuangan", pengurus_is_ketua: 1, pengurus_urutan: 1 },
  { pengurus_nama: "Dewi Nurul Alfianah", pengurus_jabatan: "S.A Kebendaharan", pengurus_kelompok: "kementrian", pengurus_divisi: "Mentri Keuangan", pengurus_is_ketua: 0, pengurus_urutan: 2 },
  { pengurus_nama: "Amelia Nur Sajidah", pengurus_jabatan: "S.A Kesekretariatan", pengurus_kelompok: "kementrian", pengurus_divisi: "Mentri Keuangan", pengurus_is_ketua: 0, pengurus_urutan: 3 },
  { pengurus_nama: "Ainun Ana Nabilah", pengurus_jabatan: "S.A Kesekretariatan", pengurus_kelompok: "kementrian", pengurus_divisi: "Mentri Keuangan", pengurus_is_ketua: 0, pengurus_urutan: 4 },

  { pengurus_nama: "Prahesta Pramudya Jaya Wardhana", pengurus_jabatan: "Mentri", pengurus_kelompok: "kementrian", pengurus_divisi: "Mentri SDM", pengurus_is_ketua: 1, pengurus_urutan: 1 },
  { pengurus_nama: "Riska Dwi Arini", pengurus_jabatan: "S.A Seni dan Olahraga", pengurus_kelompok: "kementrian", pengurus_divisi: "Mentri SDM", pengurus_is_ketua: 0, pengurus_urutan: 2 },
  { pengurus_nama: "Bayu Nabilatul A.", pengurus_jabatan: "S.A Seni dan Olahraga", pengurus_kelompok: "kementrian", pengurus_divisi: "Mentri SDM", pengurus_is_ketua: 0, pengurus_urutan: 3 },
  { pengurus_nama: "Aulia Binta Emira", pengurus_jabatan: "S.A Kepenulisan", pengurus_kelompok: "kementrian", pengurus_divisi: "Mentri SDM", pengurus_is_ketua: 0, pengurus_urutan: 4 },

  { pengurus_nama: "Erna Sundari", pengurus_jabatan: "Komisariat UPS", pengurus_kelompok: "komisariat", pengurus_divisi: null, pengurus_is_ketua: 0, pengurus_urutan: 1 },
  { pengurus_nama: "Fadila Arifatu Khasanah", pengurus_jabatan: "Komisariat UIN GUSDUR", pengurus_kelompok: "komisariat", pengurus_divisi: null, pengurus_is_ketua: 0, pengurus_urutan: 2 },
  { pengurus_nama: "Retno Dwitasari", pengurus_jabatan: "Komisariat UNIKAL", pengurus_kelompok: "komisariat", pengurus_divisi: null, pengurus_is_ketua: 0, pengurus_urutan: 3 },
  { pengurus_nama: "Rizky Dwi Baybakti", pengurus_jabatan: "Komisariat UIBN", pengurus_kelompok: "komisariat", pengurus_divisi: null, pengurus_is_ketua: 0, pengurus_urutan: 4 },
];

/**
 * Membuat tabel tbl_pengurus jika belum ada, lalu mengisi data awal jika kosong.
 * Dengan ini tidak perlu menjalankan migrasi manual di lokal maupun VPS.
 */
export async function ensurePengurusTable() {
  if (ensured) return;
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS tbl_pengurus (
      pengurus_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      pengurus_nama VARCHAR(100) NULL,
      pengurus_jabatan VARCHAR(100) NULL,
      pengurus_kelompok VARCHAR(20) NULL,
      pengurus_divisi VARCHAR(100) NULL,
      pengurus_is_ketua INT NOT NULL DEFAULT 0,
      pengurus_foto TEXT NULL,
      pengurus_urutan INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  const count = await db.tbl_pengurus.count();
  if (count === 0) {
    await db.tbl_pengurus.createMany({ data: SEED });
  }
  ensured = true;
}

export async function getAllPengurus(): Promise<Pengurus[]> {
  await ensurePengurusTable();
  return db.tbl_pengurus.findMany({
    orderBy: [{ pengurus_kelompok: "asc" }, { pengurus_divisi: "asc" }, { pengurus_is_ketua: "desc" }, { pengurus_urutan: "asc" }],
  });
}
