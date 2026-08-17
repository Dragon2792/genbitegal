import { getStorageUrl } from "@/lib/storageUrl";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteGaleri } from "./actions";

export default async function GaleriPage() {
  const galeriList = await prisma.tbl_galeri.findMany({
    orderBy: { galeri_tanggal: "desc" },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Galeri</h1>
        <Link 
          href="/admin/galeri/tambah" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          + Tambah Foto
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {galeriList.map((galeri, idx) => (
              <tr key={galeri.galeri_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getStorageUrl(galeri.galeri_gambar) || ''} alt={galeri.galeri_judul || "Foto"} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{galeri.galeri_judul}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {galeri.galeri_tanggal ? new Date(galeri.galeri_tanggal).toLocaleDateString("id-ID") : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3 items-center mt-3">
                  <form action={async () => {
                    "use server";
                    await deleteGaleri(galeri.galeri_id);
                  }}>
                    <button
                    suppressHydrationWarning type="submit" className="text-red-600 hover:text-red-900">Hapus</button>
                  </form>
                </td>
              </tr>
            ))}
            {galeriList.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Belum ada data galeri.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
