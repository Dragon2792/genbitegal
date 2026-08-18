import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteKomisariat } from "./actions";
import { Edit2, PlusCircle, Search } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";

export default async function KomisariatPage({
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
          { komisariat_nama: { contains: q } },
          { komisariat_short: { contains: q } },
          { komisariat_ketua: { contains: q } },
        ],
      }
    : {};

  const [komisariatList, total] = await Promise.all([
    (prisma as any).tbl_komisariat.findMany({
      where,
      orderBy: { komisariat_urutan: "asc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    (prisma as any).tbl_komisariat.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Manajemen Komisariat</h1>
          <p className="text-sm text-gray-500 mt-0.5">Total: <span className="font-semibold text-blue-600">{total}</span> komisariat</p>
        </div>
        <Link
          href="/admin/komisariat/tambah"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
        >
          <PlusCircle size={16} />
          Tambah Komisariat
        </Link>
      </div>

      <div className="px-6 py-4 border-b border-gray-50">
        <form method="GET" className="flex gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Cari nama, singkatan, ketua..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Cari
          </button>
          {q && (
            <Link
              href="/admin/komisariat"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-medium transition-colors"
            >
              Reset
            </Link>
          )}
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">No</th>
              <th className="px-6 py-4">Nama Komisariat</th>
              <th className="px-6 py-4">Ketua</th>
              <th className="px-6 py-4">Urutan</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {komisariatList.map((item: any, idx: number) => (
              <tr key={item.komisariat_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-500">
                  {(page - 1) * perPage + idx + 1}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">{item.komisariat_nama}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{item.komisariat_short}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{item.komisariat_ketua || '-'}</td>
                <td className="px-6 py-4 text-gray-600">{item.komisariat_urutan}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/admin/komisariat/edit/${item.komisariat_id}`}
                      className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <DeleteButton action={async () => {
                      "use server";
                      await deleteKomisariat(item.komisariat_id);
                    }} />
                  </div>
                </td>
              </tr>
            ))}

            {komisariatList.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-3">
                    <Search className="text-gray-400" size={24} />
                  </div>
                  <p className="text-gray-500 font-medium">
                    {q ? `Tidak ada komisariat dengan kata kunci "${q}"` : "Belum ada data komisariat."}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Menampilkan {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} dari {total} komisariat
          </p>
          <div className="flex gap-1">
            {page > 1 && (
              <Link
                href={`/admin/komisariat?page=${page - 1}${q ? `&q=${q}` : ""}`}
                className="px-3 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50 text-gray-600"
              >
                Prev
              </Link>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/admin/komisariat?page=${p}${q ? `&q=${q}` : ""}`}
                className={`px-3 py-1 border rounded text-sm ${
                  p === page 
                    ? "bg-blue-600 border-blue-600 text-white" 
                    : "border-gray-200 hover:bg-gray-50 text-gray-600"
                }`}
              >
                {p}
              </Link>
            ))}

            {page < totalPages && (
              <Link
                href={`/admin/komisariat?page=${page + 1}${q ? `&q=${q}` : ""}`}
                className="px-3 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50 text-gray-600"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
