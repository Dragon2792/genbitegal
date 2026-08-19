import { editKomisariat } from "../../actions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";

export default async function EditKomisariatPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const komisariat = await (prisma as any).tbl_komisariat.findUnique({
    where: { komisariat_id: id }
  });

  if (!komisariat) {
    redirect("/admin/komisariat");
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Komisariat</h1>
        <div className="flex items-center gap-2 mt-2 text-sm">
          <Link href="/admin/komisariat" className="hover:text-blue-600">Komisariat</Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-700">Edit Komisariat</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Edit Data Komisariat</h2>
        </div>
        
        <form action={async (formData) => {
          "use server";
          await editKomisariat(id, formData);
        }} className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nama Komisariat</label>
              <input
                type="text"
                name="komisariat_nama"
                required
                defaultValue={komisariat.komisariat_nama || ""}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Singkatan (Short)</label>
              <input
                type="text"
                name="komisariat_short"
                required
                defaultValue={komisariat.komisariat_short || ""}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ketua Komisariat</label>
              <input
                type="text"
                name="komisariat_ketua"
                defaultValue={komisariat.komisariat_ketua || ""}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">File Logo (Path/URL)</label>
              <input
                type="text"
                name="komisariat_logo"
                defaultValue={komisariat.komisariat_logo || ""}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Jumlah Anggota</label>
              <input
                type="text"
                name="komisariat_members"
                defaultValue={komisariat.komisariat_members || ""}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Jumlah Program Kerja</label>
              <input
                type="text"
                name="komisariat_proker"
                defaultValue={komisariat.komisariat_proker || ""}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Penghargaan</label>
              <input
                type="text"
                name="komisariat_awards"
                defaultValue={komisariat.komisariat_awards || ""}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Instagram</label>
              <input
                type="text"
                name="komisariat_ig"
                defaultValue={komisariat.komisariat_ig || ""}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Website</label>
              <input
                type="text"
                name="komisariat_web"
                defaultValue={komisariat.komisariat_web || ""}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Urutan Tampil (Angka)</label>
              <input
                type="number"
                name="komisariat_urutan"
                defaultValue={komisariat.komisariat_urutan || 0}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Deskripsi / Profil Singkat</label>
            <textarea
              name="komisariat_desc"
              rows={4}
              defaultValue={komisariat.komisariat_desc || ""}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Link
              href="/admin/komisariat"
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Batal
            </Link>
            <SubmitButton text="Simpan Perubahan" loadingText="Menyimpan..." />
          </div>
        </form>
      </div>
    </div>
  );
}
