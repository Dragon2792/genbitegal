import { prisma } from "@/lib/prisma";
import { CheckCircle, XCircle } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";
import { deleteKomentar, toggleStatus } from "./actions";

export default async function KomentarPage() {
  const komentarList = await prisma.tbl_komentar.findMany({
    orderBy: { komentar_tanggal: "desc" },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Komentar</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Komentar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {komentarList.map((komentar, idx) => (
              <tr key={komentar.komentar_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {komentar.komentar_nama}
                  <div className="text-xs text-gray-400">{komentar.komentar_email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">{komentar.komentar_isi}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {komentar.komentar_tanggal ? new Date(komentar.komentar_tanggal).toLocaleDateString("id-ID") : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {komentar.komentar_status === "1" ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Aktif</span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3 items-center mt-3">
                  <form action={async () => {
                    "use server";
                    await toggleStatus(komentar.komentar_id, komentar.komentar_status || "0");
                  }}>
                    <button
                    suppressHydrationWarning type="submit" className="text-blue-600 hover:text-blue-900">
                      {komentar.komentar_status === "1" ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                  </form>
                  <DeleteButton action={async () => {
                    "use server";
                    await deleteKomentar(komentar.komentar_id);
                  }} />
                </td>
              </tr>
            ))}
            {komentarList.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Belum ada data komentar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
