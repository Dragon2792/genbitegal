import { addTestimoni } from "../actions";
import Link from "next/link";

export default function TambahTestimoniPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tambah Testimoni</h1>
        <Link href="/admin/testimoni" className="text-gray-500 hover:text-gray-700">
          &larr; Kembali
        </Link>
      </div>

      <form action={addTestimoni} className="space-y-6">
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama</label>
          <input
              suppressHydrationWarning 
            type="text" 
            name="nama" 
            id="nama" 
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
              suppressHydrationWarning 
            type="email" 
            name="email" 
            id="email" 
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>

        <div>
          <label htmlFor="isi" className="block text-sm font-medium text-gray-700">Isi Testimoni</label>
          <textarea
              suppressHydrationWarning 
            name="isi" 
            id="isi" 
            rows={5} 
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <SubmitButton text="Simpan Testimoni" loadingText="Menyimpan..." />
        </div>
      </form>
    </div>
  );
}
