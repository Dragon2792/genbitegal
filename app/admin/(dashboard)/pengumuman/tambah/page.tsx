import { addPengumuman } from "../actions";
import Link from "next/link";

export default function TambahPengumumanPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tambah Pengumuman</h1>
        <Link href="/admin/pengumuman" className="text-gray-500 hover:text-gray-700">
          &larr; Kembali
        </Link>
      </div>

      <form action={addPengumuman} className="space-y-6">
        <div>
          <label htmlFor="judul" className="block text-sm font-medium text-gray-700">Judul Pengumuman</label>
          <input
              suppressHydrationWarning 
            type="text" 
            name="judul" 
            id="judul" 
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>

        <div>
          <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Isi Pengumuman</label>
          <textarea
              suppressHydrationWarning 
            name="deskripsi" 
            id="deskripsi" 
            rows={8} 
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          ></textarea>
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
          <input
              suppressHydrationWarning 
            type="text" 
            name="author" 
            id="author" 
            defaultValue="Admin"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>

        <div className="flex justify-end">
          <SubmitButton text="Simpan Pengumuman" loadingText="Menyimpan..." />
        </div>
      </form>
    </div>
  );
}
