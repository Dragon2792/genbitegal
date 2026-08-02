import { addGaleri } from "../actions";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function TambahGaleriPage() {
  const albums = await prisma.tbl_album.findMany();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tambah Foto Galeri</h1>
        <Link href="/admin/galeri" className="text-gray-500 hover:text-gray-700">
          &larr; Kembali
        </Link>
      </div>

      <form action={addGaleri} className="space-y-6">
        <div>
          <label htmlFor="judul" className="block text-sm font-medium text-gray-700">Judul Foto</label>
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
          <label htmlFor="album_id" className="block text-sm font-medium text-gray-700">Pilih Album</label>
          <select
              suppressHydrationWarning 
            name="album_id" 
            id="album_id" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          >
            <option value="">Tidak ada album</option>
            {albums.map((album) => (
              <option key={album.album_id} value={album.album_id}>
                {album.album_nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="gambar" className="block text-sm font-medium text-gray-700">File Gambar</label>
          <input
              suppressHydrationWarning 
            type="file" 
            name="gambar" 
            id="gambar"
            accept="image/*"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-gray-50"
          />
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
          <button
                    suppressHydrationWarning 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors"
          >
            Simpan Foto
          </button>
        </div>
      </form>
    </div>
  );
}
