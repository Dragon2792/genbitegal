import { getStorageUrl } from "@/lib/storageUrl";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteFile } from "./actions";
import DeleteButton from "@/components/DeleteButton";

export default async function FilesPage() {
  const filesList = await prisma.tbl_files.findMany({
    orderBy: { file_tanggal: "desc" },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen File / Dokumen</h1>
        <Link 
          href="/admin/files/tambah" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          + Tambah File
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filesList.map((file, idx) => (
              <tr key={file.file_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{file.file_judul}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <a href={getStorageUrl(file.file_data, 'files') || ''} target="_blank" rel="noreferrer">Download</a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {file.file_tanggal ? new Date(file.file_tanggal).toLocaleDateString("id-ID") : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3 items-center">
                  <DeleteButton action={async () => {
                    "use server";
                    await deleteFile(file.file_id);
                  }} />
                </td>
              </tr>
            ))}
            {filesList.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Belum ada data file.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
