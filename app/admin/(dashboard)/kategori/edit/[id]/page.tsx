import { prisma } from "@/lib/prisma";
import { editKategori } from "../../actions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditKategoriPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const kategori = await prisma.tbl_kategori.findUnique({
    where: { kategori_id: id },
  });

  if (!kategori) {
    notFound();
  }

  const editKategoriWithId = editKategori.bind(null, id);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Kategori</h1>
        <Link href="/admin/kategori" className="text-gray-600 hover:text-gray-900">
          Kembali
        </Link>
      </div>

      <form action={editKategoriWithId} className="space-y-6">
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
            Nama Kategori
          </label>
          <input
              suppressHydrationWarning
            type="text"
            id="nama"
            name="nama"
            defaultValue={kategori.kategori_nama || ""}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Masukkan nama kategori"
          />
        </div>

        <div className="flex justify-end">
          <button
                    suppressHydrationWarning
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Update Kategori
          </button>
        </div>
      </form>
    </div>
  );
}
