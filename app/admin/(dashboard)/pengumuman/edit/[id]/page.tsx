import { editPengumuman } from "../../actions";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function EditPengumumanPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const pengumuman = await prisma.tbl_pengumuman.findUnique({
    where: { pengumuman_id: id }
  });

  if (!pengumuman) {
    redirect("/admin/pengumuman");
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Pengumuman</h1>
        <Link href="/admin/pengumuman" className="text-gray-500 hover:text-gray-700">
          &larr; Kembali
        </Link>
      </div>

      <form action={async (formData) => {
        "use server";
        await editPengumuman(id, formData);
      }} className="space-y-6">
        <div>
          <label htmlFor="judul" className="block text-sm font-medium text-gray-700">Judul Pengumuman</label>
          <input
              suppressHydrationWarning 
            type="text" 
            name="judul" 
            id="judul" 
            required 
            defaultValue={pengumuman.pengumuman_judul || ""}
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
            defaultValue={pengumuman.pengumuman_deskripsi || ""}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
                    suppressHydrationWarning 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors"
          >
            Update Pengumuman
          </button>
        </div>
      </form>
    </div>
  );
}
