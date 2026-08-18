import { getStorageUrl } from "@/lib/storageUrl";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deletePengguna } from "./actions";
import DeleteButton from "@/components/DeleteButton";
import Image from "next/image";

export default async function PenggunaPage() {
  const users = await prisma.tbl_pengguna.findMany({
    orderBy: { pengguna_register: "desc" },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
        <Link 
          href="/admin/pengguna/tambah" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          + Tambah Pengguna
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.pengguna_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.pengguna_photo ? (
                    <div className="h-10 w-10 relative rounded-full overflow-hidden">
                      <img src={getStorageUrl(user.pengguna_photo) || ''} alt={user.pengguna_nama || "User"} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {user.pengguna_nama?.charAt(0) || "U"}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.pengguna_nama}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.pengguna_username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.pengguna_level === "1" ? "Administrator" : "Author"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3 mt-1">
                  <Link href={`/admin/pengguna/edit/${user.pengguna_id}`} className="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </Link>
                  <DeleteButton action={async () => {
                    "use server";
                    await deletePengguna(user.pengguna_id);
                  }} />
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Belum ada data pengguna.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
