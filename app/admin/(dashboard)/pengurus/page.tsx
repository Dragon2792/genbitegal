import Link from "next/link";
import { Edit2, PlusCircle, User } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";
import { getStorageUrl } from "@/lib/storageUrl";
import { getAllPengurus, KELOMPOK_OPTIONS, type Pengurus } from "@/lib/pengurus";
import { deletePengurus } from "./actions";

export const dynamic = "force-dynamic";

export default async function PengurusAdminPage() {
  const all = await getAllPengurus();

  const sections = KELOMPOK_OPTIONS.map((k) => ({
    ...k,
    items: all.filter((p) => p.pengurus_kelompok === k.value),
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Struktur Pengurus</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Total: <span className="font-semibold text-blue-600">{all.length}</span> pengurus · tampil di halaman{" "}
            <Link href="/struktur" target="_blank" className="text-blue-600 hover:underline">/struktur</Link>
          </p>
        </div>
        <Link
          href="/admin/pengurus/tambah"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
        >
          <PlusCircle size={16} /> Tambah Pengurus
        </Link>
      </div>

      {sections.map((section) => (
        <div key={section.value} className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800">{section.label}</h2>
            <span className="text-xs text-gray-500">{section.items.length} orang</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Foto</th>
                  <th className="px-6 py-3">Nama</th>
                  <th className="px-6 py-3">Jabatan</th>
                  {section.value === "kementrian" && <th className="px-6 py-3">Kementrian</th>}
                  <th className="px-6 py-3">Urutan</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {section.items.map((p: Pengurus) => (
                  <tr key={p.pengurus_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        {p.pengurus_foto ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={getStorageUrl(p.pengurus_foto)} alt={p.pengurus_nama || ""} className="w-full h-full object-cover" />
                        ) : (
                          <User size={18} className="text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-800">{p.pengurus_nama}</td>
                    <td className="px-6 py-3 text-gray-600">
                      {p.pengurus_is_ketua === 1 ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">Mentri</span>
                      ) : (
                        p.pengurus_jabatan
                      )}
                    </td>
                    {section.value === "kementrian" && <td className="px-6 py-3 text-gray-600">{p.pengurus_divisi}</td>}
                    <td className="px-6 py-3 text-gray-600">{p.pengurus_urutan}</td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/admin/pengurus/edit/${p.pengurus_id}`}
                          className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <DeleteButton
                          action={async () => {
                            "use server";
                            await deletePengurus(p.pengurus_id);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                {section.items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Belum ada data.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
