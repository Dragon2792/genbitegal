import { addAnggota } from "../actions";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AnggotaForm from "../AnggotaForm";

export default async function TambahAnggotaPage() {
  const kelasList = await prisma.tbl_kelas.findMany({
    orderBy: { kelas_id: "asc" },
  });

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-800">Anggota</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <Link href="/admin/dashboard" className="hover:text-blue-600">
            Home
          </Link>
          <span>›</span>
          <Link href="/admin/anggota" className="hover:text-blue-600">
            Anggota
          </Link>
          <span>›</span>
          <span className="text-gray-700">Tambah Anggota</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="mb-5 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Tambah Data Anggota</h2>
        </div>

        <AnggotaForm
          action={addAnggota}
          kelasList={kelasList}
          submitText="Simpan Anggota"
          loadingText="Menyimpan..."
        />
      </div>
    </div>
  );
}
