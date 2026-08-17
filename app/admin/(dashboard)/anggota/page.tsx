import { getStorageUrl } from "@/lib/storageUrl";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteAnggota } from "./actions";
import { Edit2, PlusCircle, Search } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";

import Image from "next/image";

export default async function AnggotaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const page = parseInt(params.page || "1");
  const perPage = 10;

  const where = q
    ? {
        OR: [
          { siswa_nama: { contains: q } },
          { siswa_nis: { contains: q } },
        ],
      }
    : {};

  const [anggotaList, total] = await Promise.all([
    prisma.tbl_siswa.findMany({
      where,
      orderBy: { siswa_nama: "asc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.tbl_siswa.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Manajemen Anggota</h1>
          <p className="text-sm text-gray-500 mt-0.5">Total: <span className="font-semibold text-blue-600">{total}</span> anggota</p>
        </div>
        <Link
          href="/admin/anggota/tambah"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
        >
          <PlusCircle size={16} />
          Tambah Anggota
        </Link>
      </div>

      {/* Search */}
      <div className="px-6 py-4 border-b border-gray-50">
        <form method="GET" className="flex gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              suppressHydrationWarning
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Cari berdasarkan Nama atau NIS..."
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
                    suppressHydrationWarning
            type="submit"
            className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
          >
            Cari
          </button>
          {q && (
            <Link
              href="/admin/anggota"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              Reset
            </Link>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">No</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Foto</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">NIS</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">L/P</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {anggotaList.map((anggota, idx) => (
              <tr key={anggota.siswa_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-500">{(page - 1) * perPage + idx + 1}</td>
                <td className="px-6 py-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getStorageUrl(anggota.siswa_photo || 'blank.png') || ''}
                      alt={anggota.siswa_nama || "Foto"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                  {anggota.siswa_nis}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {anggota.siswa_nama}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${anggota.siswa_jenkel === "L" ? "bg-blue-50 text-blue-700" : "bg-pink-50 text-pink-700"}`}>
                    {anggota.siswa_jenkel === "L" ? "Laki-laki" : "Perempuan"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/anggota/edit/${anggota.siswa_id}`}
                      className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      <Edit2 size={14} /> Edit
                    </Link>
                    <DeleteButton action={async () => {
                      "use server";
                      await deleteAnggota(anggota.siswa_id);
                    }} />

                  </div>
                </td>
              </tr>
            ))}
            {anggotaList.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  {q ? `Tidak ada anggota dengan kata kunci "${q}"` : "Belum ada data anggota."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Menampilkan {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} dari {total} anggota
          </p>
          <div className="flex gap-1">
            {page > 1 && (
              <Link
                href={`/admin/anggota?page=${page - 1}${q ? `&q=${q}` : ""}`}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                ‹ Prev
              </Link>
            )}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = page <= 3 ? i + 1 : page - 2 + i;
              if (p < 1 || p > totalPages) return null;
              return (
                <Link
                  key={p}
                  href={`/admin/anggota?page=${p}${q ? `&q=${q}` : ""}`}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                    p === page
                      ? "bg-blue-600 border-blue-600 text-white font-semibold"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </Link>
              );
            })}
            {page < totalPages && (
              <Link
                href={`/admin/anggota?page=${page + 1}${q ? `&q=${q}` : ""}`}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Next ›
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
