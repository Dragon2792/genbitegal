import { addAlbum } from "../actions";
import Link from "next/link";

export default function TambahAlbumPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-800">Album</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <Link href="/admin/dashboard" className="hover:text-blue-600">Home</Link>
          <span>›</span>
          <Link href="/admin/album" className="hover:text-blue-600">Album</Link>
          <span>›</span>
          <span className="text-gray-700">Tambah Album</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="mb-5 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Tambah Album Baru</h2>
        </div>

        <form action={addAlbum} className="space-y-6">
          <div>
            <label htmlFor="nama" className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Album</label>
            <input
              suppressHydrationWarning 
              type="text" 
              name="nama" 
              id="nama" 
              required 
              placeholder="Contoh: Kegiatan GenBI 2024"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
            />
          </div>

          <div>
            <label htmlFor="cover" className="block text-sm font-semibold text-gray-700 mb-1.5">Cover Album (Wajib)</label>
            <input
              suppressHydrationWarning 
              type="file" 
              name="cover" 
              id="cover"
              required
              accept="image/gif,image/jpeg,image/png,image/bmp"
              className="w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-2.5 border bg-white file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SubmitButton text="Simpan Album" loadingText="Menyimpan..." />
          </div>
        </form>
      </div>
    </div>
  );
}
