import { getStorageUrl } from "@/lib/storageUrl";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteArtikel } from "./actions";
import { Eye, Edit2, Trash2, PlusCircle } from "lucide-react";

export default async function ArtikelPage({
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
          { tulisan_judul: { contains: q } },
          { tulisan_author: { contains: q } },
          { tulisan_kategori_nama: { contains: q } },
        ],
      }
    : {};

  const [articles, total] = await Promise.all([
    prisma.tbl_tulisan.findMany({
      where,
      orderBy: { tulisan_tanggal: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.tbl_tulisan.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Manajemen Berita / Artikel</h1>
          <p className="text-sm text-gray-500 mt-0.5">Total: <span className="font-semibold text-blue-600">{total}</span> artikel</p>
        </div>
        <Link
          href="/admin/artikel/tambah"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
        >
          <PlusCircle size={16} />
          Tambah Artikel
        </Link>
      </div>

      {/* Search */}
      <div className="px-6 py-4 border-b border-gray-50">
        <form method="GET" className="flex gap-2">
          <input
              suppressHydrationWarning
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cari judul, author, atau kategori..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
                    suppressHydrationWarning
            type="submit"
            className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
          >
            Cari
          </button>
          {q && (
            <Link
              href="/admin/artikel"
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Gambar</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Judul</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span className="flex items-center gap-1"><Eye size={12} /> Views</span>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {articles.map((artikel, idx) => (
              <tr key={artikel.tulisan_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-500">{(page - 1) * perPage + idx + 1}</td>
                <td className="px-6 py-4">
                  {artikel.tulisan_gambar ? (
                    <img
                      src={getStorageUrl(artikel.tulisan_gambar) || ''}
                      alt={artikel.tulisan_judul || ""}
                      className="w-16 h-12 object-cover rounded-lg border border-gray-100"
                    />
                  ) : (
                    <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-300 text-xs">No img</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2 max-w-sm">
                    {artikel.tulisan_judul}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">by {artikel.tulisan_author}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    {artikel.tulisan_kategori_nama || "-"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {artikel.tulisan_tanggal
                    ? new Date(artikel.tulisan_tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                  {artikel.tulisan_views?.toLocaleString() || 0}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/artikel/edit/${artikel.tulisan_id}`}
                      className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      <Edit2 size={14} /> Edit
                    </Link>
                    <form action={async () => {
                      "use server";
                      await deleteArtikel(artikel.tulisan_id);
                    }}>
                      <button
                    suppressHydrationWarning
                        type="submit"
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        <Trash2 size={14} /> Hapus
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  {q ? `Tidak ada artikel dengan kata kunci "${q}"` : "Belum ada data artikel."}
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
            Menampilkan {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} dari {total} artikel
          </p>
          <div className="flex gap-1">
            {page > 1 && (
              <Link
                href={`/admin/artikel?page=${page - 1}${q ? `&q=${q}` : ""}`}
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
                  href={`/admin/artikel?page=${p}${q ? `&q=${q}` : ""}`}
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
                href={`/admin/artikel?page=${page + 1}${q ? `&q=${q}` : ""}`}
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
