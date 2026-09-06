import { addAgenda } from "../actions";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";

export default function TambahAgendaPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tambah Agenda Baru</h1>
        <Link href="/admin/agenda" className="text-gray-500 hover:text-gray-700">
          &larr; Kembali
        </Link>
      </div>

      <form action={addAgenda} className="space-y-6">
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Agenda</label>
          <input
              suppressHydrationWarning 
            type="text" 
            name="nama" 
            id="nama" 
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="mulai" className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
            <input
              suppressHydrationWarning 
              type="date" 
              name="mulai" 
              id="mulai" 
              required 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label htmlFor="selesai" className="block text-sm font-medium text-gray-700">Tanggal Selesai</label>
            <input
              suppressHydrationWarning 
              type="date" 
              name="selesai" 
              id="selesai" 
              required 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
        </div>

        <div>
          <label htmlFor="tempat" className="block text-sm font-medium text-gray-700">Tempat Pelaksanaan</label>
          <input
              suppressHydrationWarning 
            type="text" 
            name="tempat" 
            id="tempat" 
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>

        <div>
          <label htmlFor="waktu" className="block text-sm font-medium text-gray-700">Waktu Pelaksanaan</label>
          <input
              suppressHydrationWarning 
            type="text" 
            name="waktu" 
            id="waktu"
            placeholder="08:00 - Selesai" 
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>

        <div>
          <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700">Keterangan</label>
          <input
              suppressHydrationWarning 
            type="text" 
            name="keterangan" 
            id="keterangan" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>

        <div>
          <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Deskripsi Agenda</label>
          <textarea
              suppressHydrationWarning 
            name="deskripsi" 
            id="deskripsi" 
            rows={5} 
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
          <SubmitButton text="Simpan Agenda" loadingText="Menyimpan..." />
        </div>
      </form>
    </div>
  );
}
