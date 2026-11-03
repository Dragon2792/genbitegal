import { getStorageUrl } from "@/lib/storageUrl";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteAnggota } from "./actions";
import { Building2, Edit2, FileSpreadsheet, PlusCircle, Search } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";

export default async function AnggotaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; kelas_id?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q || "").trim();
  const kelasIdParam = params.kelas_id ? parseInt(params.kelas_id, 10) || 0 : 0;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const perPage = 10;

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { siswa_nama: { contains: q } },
      { siswa_nis: { contains: q } },
    ];
  }
  if (kelasIdParam > 0) {
    where.siswa_kelas_id = kelasIdParam;
  }

  const [anggotaList, total, kelasList, countsByKelas, totalAll] = await Promise.all([
    prisma.tbl_siswa.findMany({
      where,
      orderBy: { siswa_nama: "asc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.tbl_siswa.count({ where }),
    prisma.tbl_kelas.findMany({ orderBy: { kelas_id: "asc" } }),
    prisma.tbl_siswa.groupBy({
      by: ["siswa_kelas_id"],
      _count: { siswa_id: true },
    }),
    prisma.tbl_siswa.count(),
  ]);

  const kelasMap = kelasList.reduce((acc, curr) => {
    acc[curr.kelas_id] = curr.kelas_nama || "-";
    return acc;
  }, {} as Record<number, string>);

  const countMap = countsByKelas.reduce((acc, curr) => {
    if (curr.siswa_kelas_id !== null) {
      acc[curr.siswa_kelas_id] = curr._count.siswa_id;
    }
    return acc;
  }, {} as Record<number, number>);

  const totalPages = Math.ceil(total / perPage);
  const activeKomisariatName = kelasIdParam > 0 ? kelasMap[kelasIdParam] : null;

  const buildUrl = (
    targetPage: number,
    targetQ: string = q,
    targetKelasId: number = kelasIdParam
  ) => {
    const sp = new URLSearchParams();
    if (targetPage > 1) sp.set("page", String(targetPage));
    if (targetQ) sp.set("q", targetQ);
    if (targetKelasId > 0) sp.set("kelas_id", String(targetKelasId));
    const qs = sp.toString();
    return qs ? `/admin/anggota?${qs}` : "/admin/anggota";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Manajemen Anggota</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {activeKomisariatName ? (
              <>
                Komisariat <span className="font-semibold text-gray-700">{activeKomisariatName}</span>:{" "}
                <span className="font-semibold text-blue-600">{total}</span> anggota
              </>
            ) : (
              <>
                Total: <span className="font-semibold text-blue-600">{total}</span> anggota
              </>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/anggota/import"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
          >
            <FileSpreadsheet size={16} />
            Import Excel
          </Link>
          <Link
            href="/admin/anggota/tambah"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
          >
            <PlusCircle size={16} />
            Tambah Anggota
          </Link>
        </div>
      </div>

      {/* Filter Komisariat Pills & Search */}
      <div className="px-6 py-4 border-b border-gray-100 space-y-4">
        {/* Quick Filter Pills per Komisariat */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">
            <Building2 size={14} /> Komisariat:
          </span>
          <Link
            href={buildUrl(1, q, 0)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${kelasIdParam === 0
                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
          >
            Semua
            <span
              className={`px-1.5 py-0.2 rounded-full text-[11px] ${kelasIdParam === 0
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200/80 text-gray-600"
                }`}
            >
              {totalAll}
            </span>
          </Link>

          {kelasList.map((kelas) => {
            const isActive = kelasIdParam === kelas.kelas_id;
            const count = countMap[kelas.kelas_id] || 0;
            return (
              <Link
                key={kelas.kelas_id}
                href={buildUrl(1, q, kelas.kelas_id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${isActive
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
              >
                {kelas.kelas_nama}
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[11px] ${isActive
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200/80 text-gray-600"
                    }`}
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Search & Komisariat Dropdown Form */}
        <form method="GET" className="flex flex-col sm:flex-row gap-2 max-w-2xl">
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
          <select
            suppressHydrationWarning
            name="kelas_id"
            defaultValue={kelasIdParam > 0 ? String(kelasIdParam) : ""}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Semua Komisariat</option>
            {kelasList.map((kelas) => (
              <option key={kelas.kelas_id} value={kelas.kelas_id}>
                {kelas.kelas_nama}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              suppressHydrationWarning
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Filter
            </button>
            {(q || kelasIdParam > 0) && (
              <Link
                href="/admin/anggota"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Reset
              </Link>
            )}
          </div>
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Komisariat</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {anggotaList.map((anggota, idx) => (
              <tr key={anggota.siswa_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-500">{(page - 1) * perPage + idx + 1}</td>
                <td className="px-6 py-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
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
                <td className="px-6 py-4 text-sm text-gray-600">
                  {anggota.siswa_kelas_id ? (
                    <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold">
                      {kelasMap[anggota.siswa_kelas_id] || "-"}
                    </span>
                  ) : (
                    "-"
                  )}
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
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  {q || activeKomisariatName
                    ? `Tidak ada anggota yang sesuai dengan filter${activeKomisariatName ? ` Komisariat "${activeKomisariatName}"` : ""}${q ? ` dan kata kunci "${q}"` : ""}.`
                    : "Belum ada data anggota."}
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
                href={buildUrl(page - 1)}
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
                  href={buildUrl(p)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${p === page
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
                href={buildUrl(page + 1)}
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
