import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteKategori } from "./actions";

export default async function KategoriPage() {
  const categories = await prisma.tbl_kategori.findMany({
    orderBy: { kategori_tanggal: "desc" },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Kategori</h1>
        <Link 
          href="/admin/kategori/tambah" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          + Tambah Kategori
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((kategori, idx) => (
              <tr key={kategori.kategori_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{kategori.kategori_nama}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {kategori.kategori_tanggal ? new Date(kategori.kategori_tanggal).toLocaleDateString("id-ID") : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3">
                  <Link href={`/admin/kategori/edit/${kategori.kategori_id}`} className="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </Link>
                  <form action={async () => {
                    "use server";
                    await deleteKategori(kategori.kategori_id);
                  }}>
                    <button
                    suppressHydrationWarning type="submit" className="text-red-600 hover:text-red-900">Hapus</button>
                  </form>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Belum ada data kategori.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
