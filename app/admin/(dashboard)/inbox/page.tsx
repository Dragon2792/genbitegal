import { prisma } from "@/lib/prisma";
import { deleteInbox } from "./actions";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";


export default async function InboxPage({
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
          { inbox_nama: { contains: q } },
          { inbox_email: { contains: q } },
          { inbox_pesan: { contains: q } },
        ],
      }
    : {};

  const [inboxList, total] = await Promise.all([
    prisma.tbl_inbox.findMany({
      where,
      orderBy: { inbox_tanggal: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.tbl_inbox.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Inbox</h1>
          <p className="text-sm text-gray-500 mt-0.5">Total: <span className="font-semibold text-blue-600">{total}</span> pesan masuk</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-4 border-b border-gray-50">
        <form method="GET" className="flex gap-2">
          <input
              suppressHydrationWarning
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cari nama, email, atau isi pesan..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
                    suppressHydrationWarning type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors">
            Cari
          </button>
          {q && (
            <Link href="/admin/inbox" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">#</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pesan</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {inboxList.map((msg, idx) => (
              <tr key={msg.inbox_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-400">{(page - 1) * perPage + idx + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {msg.inbox_tanggal
                    ? new Date(msg.inbox_tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-800">{msg.inbox_nama}</p>
                  {msg.inbox_kontak && (
                    <p className="text-xs text-gray-400 mt-0.5">{msg.inbox_kontak}</p>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-blue-600">{msg.inbox_email}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                  <p className="line-clamp-2">{msg.inbox_pesan}</p>
                </td>
                <td className="px-6 py-4">
                  <DeleteButton action={async () => {
                    "use server";
                    await deleteInbox(msg.inbox_id);
                  }} />
                </td>

              </tr>
            ))}
            {inboxList.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  {q ? `Tidak ada pesan dengan kata kunci "${q}"` : "Belum ada pesan masuk."}
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
            Menampilkan {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} dari {total} pesan
          </p>
          <div className="flex gap-1">
            {page > 1 && (
              <Link
                href={`/admin/inbox?page=${page - 1}${q ? `&q=${q}` : ""}`}
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
                  href={`/admin/inbox?page=${p}${q ? `&q=${q}` : ""}`}
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
                href={`/admin/inbox?page=${page + 1}${q ? `&q=${q}` : ""}`}
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
