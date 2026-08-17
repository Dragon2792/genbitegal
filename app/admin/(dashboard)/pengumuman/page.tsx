import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deletePengumuman } from "./actions";

export default async function PengumumanPage() {
  const pengumumanList = await prisma.tbl_pengumuman.findMany({
    orderBy: { pengumuman_tanggal: "desc" },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengumuman</h1>
        <Link 
          href="/admin/pengumuman/tambah" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          + Tambah Pengumuman
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pengumumanList.map((item, idx) => (
              <tr key={item.pengumuman_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.pengumuman_judul}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.pengumuman_tanggal ? new Date(item.pengumuman_tanggal).toLocaleDateString("id-ID") : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.pengumuman_author}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3">
                  <Link href={`/admin/pengumuman/edit/${item.pengumuman_id}`} className="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </Link>
                  <DeleteButton action={async () => {
                    "use server";
                    await deletePengumuman(item.pengumuman_id);
                  }} />
                </td>
              </tr>
            ))}
            {pengumumanList.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Belum ada data pengumuman.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
