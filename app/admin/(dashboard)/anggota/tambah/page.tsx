import { addAnggota } from "../actions";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SubmitButton from "@/components/SubmitButton";

export default async function TambahAnggotaPage() {
  const kelasList = await prisma.tbl_kelas.findMany();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-800">Anggota</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <Link href="/admin/dashboard" className="hover:text-blue-600">Home</Link>
          <span>›</span>
          <Link href="/admin/anggota" className="hover:text-blue-600">Anggota</Link>
          <span>›</span>
          <span className="text-gray-700">Tambah Anggota</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="mb-5 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Tambah Data Anggota</h2>
        </div>

        <form action={addAnggota} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="nis" className="block text-sm font-semibold text-gray-700 mb-1.5">NIS (Nomor Induk Siswa)</label>
              <input
              suppressHydrationWarning 
                type="text" 
                name="nis" 
                id="nis" 
                required 
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
              />
            </div>
            
            <div>
              <label htmlFor="nama" className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
              <input
              suppressHydrationWarning 
                type="text" 
                name="nama" 
                id="nama" 
                required 
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
              />
            </div>

            <div>
              <label htmlFor="jenkel" className="block text-sm font-semibold text-gray-700 mb-1.5">Jenis Kelamin</label>
              <select
              suppressHydrationWarning 
                name="jenkel" 
                id="jenkel" 
                required
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-white"
              >
                <option value="">— Pilih —</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div>
              <label htmlFor="kelas_id" className="block text-sm font-semibold text-gray-700 mb-1.5">Kelas</label>
              <select
              suppressHydrationWarning 
                name="kelas_id" 
                id="kelas_id" 
                required
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-white"
              >
                <option value="">— Pilih —</option>
                {kelasList.map((kelas) => (
                  <option key={kelas.kelas_id} value={kelas.kelas_id}>
                    {kelas.kelas_nama}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="photo" className="block text-sm font-semibold text-gray-700 mb-1.5">Pas Foto (Wajib)</label>
            <input
              suppressHydrationWarning 
              type="file" 
              name="photo" 
              id="photo"
              required
              accept="image/gif,image/jpeg,image/png,image/bmp"
              className="w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-2.5 border bg-white file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SubmitButton text="Simpan Anggota" />
          </div>
        </form>
      </div>
    </div>
  );
}
