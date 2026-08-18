import { addKomisariat } from "../actions";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function TambahKomisariatPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Komisariat</h1>
        <div className="flex items-center gap-2 mt-2 text-sm">
          <Link href="/admin/komisariat" className="hover:text-blue-600">Komisariat</Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-700">Tambah Komisariat</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Tambah Data Komisariat</h2>
        </div>
        
        <form action={addKomisariat} className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nama Komisariat</label>
              <input
                type="text"
                name="komisariat_nama"
                required
                placeholder="Contoh: Universitas Pancasakti Tegal"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Singkatan (Short)</label>
              <input
                type="text"
                name="komisariat_short"
                required
                placeholder="Contoh: UPS"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ketua Komisariat</label>
              <input
                type="text"
                name="komisariat_ketua"
                placeholder="Nama Ketua"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">File Logo (Path/URL)</label>
              <input
                type="text"
                name="komisariat_logo"
                placeholder="/assets/images/logo.png"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Jumlah Anggota</label>
              <input
                type="text"
                name="komisariat_members"
                placeholder="Contoh: 45+"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Jumlah Program Kerja</label>
              <input
                type="text"
                name="komisariat_proker"
                placeholder="Contoh: 12"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Penghargaan</label>
              <input
                type="text"
                name="komisariat_awards"
                placeholder="Contoh: 3"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Instagram</label>
              <input
                type="text"
                name="komisariat_ig"
                placeholder="Contoh: @genbi_ups"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Website</label>
              <input
                type="text"
                name="komisariat_web"
                placeholder="Contoh: upstegal.ac.id"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Urutan Tampil (Angka)</label>
              <input
                type="number"
                name="komisariat_urutan"
                defaultValue={0}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Deskripsi / Profil Singkat</label>
            <textarea
              name="komisariat_desc"
              rows={4}
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
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Simpan Komisariat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
