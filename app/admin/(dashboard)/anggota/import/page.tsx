import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ImportAnggotaClient from "./ImportAnggotaClient";

export const dynamic = "force-dynamic";

export default async function ImportAnggotaPage() {
  const [kelasList, existingRows] = await Promise.all([
    prisma.tbl_kelas.findMany({
      orderBy: { kelas_id: "asc" },
    }),
    prisma.tbl_siswa.findMany({
      select: { siswa_nis: true },
    }),
  ]);

  const existingNisList = Array.from(
    new Set(
      existingRows
        .map((r) => (r.siswa_nis || "").trim())
        .filter((nis) => nis.length > 0)
    )
  );

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-800">Import Anggota (Excel)</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <Link href="/admin/dashboard" className="hover:text-blue-600">
            Home
          </Link>
          <span>›</span>
          <Link href="/admin/anggota" className="hover:text-blue-600">
            Anggota
          </Link>
          <span>›</span>
          <span className="text-gray-700">Import Excel</span>
        </div>
      </div>

      <ImportAnggotaClient
        kelasList={kelasList.map((k) => ({
          kelas_id: k.kelas_id,
          kelas_nama: k.kelas_nama || `Kelas #${k.kelas_id}`,
        }))}
        existingNisList={existingNisList}
      />
    </div>
  );
}

