import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteTestimoni } from "./actions";

export default async function TestimoniPage() {
  const testimoniList = await prisma.tbl_testimoni.findMany({
    orderBy: { testimoni_tanggal: "desc" },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Testimoni</h1>
        <Link 
          href="/admin/testimoni/tambah" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          + Tambah Testimoni
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Isi Testimoni</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {testimoniList.map((testimoni, idx) => (
              <tr key={testimoni.testimoni_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{testimoni.testimoni_nama}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{testimoni.testimoni_email}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">{testimoni.testimoni_isi}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3 items-center mt-2">
                  <form action={async () => {
                    "use server";
                    await deleteTestimoni(testimoni.testimoni_id);
                  }}>
                    <button
                    suppressHydrationWarning type="submit" className="text-red-600 hover:text-red-900">Hapus</button>
                  </form>
                </td>
              </tr>
            ))}
            {testimoniList.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Belum ada data testimoni.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
