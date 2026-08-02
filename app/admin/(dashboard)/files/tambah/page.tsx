import { addFile } from "../actions";
import Link from "next/link";

export default function TambahFilePage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tambah File Dokumen</h1>
        <Link href="/admin/files" className="text-gray-500 hover:text-gray-700">
          &larr; Kembali
        </Link>
      </div>

      <form action={addFile} className="space-y-6">
        <div>
          <label htmlFor="judul" className="block text-sm font-medium text-gray-700">Judul File</label>
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
          <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea
              suppressHydrationWarning 
            name="deskripsi" 
            id="deskripsi" 
            rows={3} 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          ></textarea>
        </div>

        <div>
          <label htmlFor="file_data" className="block text-sm font-medium text-gray-700">File Dokumen</label>
          <input
              suppressHydrationWarning 
            type="file" 
            name="file_data" 
            id="file_data"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-gray-50"
          />
        </div>

        <div>
          <label htmlFor="oleh" className="block text-sm font-medium text-gray-700">Oleh</label>
          <input
              suppressHydrationWarning 
            type="text" 
            name="oleh" 
            id="oleh" 
            defaultValue="Admin"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>

        <div className="flex justify-end">
          <button
                    suppressHydrationWarning 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors"
          >
            Simpan File
          </button>
        </div>
      </form>
    </div>
  );
}
