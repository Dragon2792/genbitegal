import { addKategori } from "../actions";
import Link from "next/link";

export default function TambahKategoriPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tambah Kategori</h1>
        <Link href="/admin/kategori" className="text-gray-600 hover:text-gray-900">
          Kembali
        </Link>
      </div>

      <form action={addKategori} className="space-y-6">
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
            Nama Kategori
          </label>
          <input
              suppressHydrationWarning
            type="text"
            id="nama"
            name="nama"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Masukkan nama kategori"
          />
        </div>

        <div className="flex justify-end">
          <SubmitButton text="Simpan Kategori" loadingText="Menyimpan..." />
        </div>
      </form>
    </div>
  );
}
