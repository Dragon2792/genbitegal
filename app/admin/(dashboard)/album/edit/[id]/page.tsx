import { getStorageUrl } from "@/lib/storageUrl";
import { editAlbum } from "../../actions";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function EditAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  
  const album = await prisma.tbl_album.findUnique({
    where: { album_id: id }
  });

  if (!album) {
    redirect("/admin/album");
  }

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
          <span className="text-gray-700">Edit Album</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="mb-5 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Edit Data Album</h2>
        </div>

        <form action={async (formData) => {
          "use server";
          await editAlbum(id, formData);
        }} className="space-y-6">
          <div>
            <label htmlFor="nama" className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Album</label>
            <input
              suppressHydrationWarning 
              type="text" 
              name="nama" 
              id="nama" 
              required 
              defaultValue={album.album_nama || ""}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
            />
          </div>

          <div>
            <label htmlFor="cover" className="block text-sm font-semibold text-gray-700 mb-1.5">Ganti Cover Album (Opsional)</label>
            {album.album_cover && album.album_cover !== 'default.jpg' && album.album_cover !== 'blank.png' && (
              <div className="mb-3">
                <Image
                  src={getStorageUrl(album.album_cover) || ''}
                  alt="Cover saat ini"
                  width={160}
                  height={100}
                  className="object-cover rounded-lg border border-gray-200"
                />
                <p className="text-xs text-gray-400 mt-1">Cover saat ini</p>
              </div>
            )}
            <input
              suppressHydrationWarning 
              type="file" 
              name="cover" 
              id="cover"
              accept="image/gif,image/jpeg,image/png,image/bmp"
              className="w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-2.5 border bg-white file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SubmitButton text="Update Album" loadingText="Mengupdate..." />
          </div>
        </form>
      </div>
    </div>
  );
}
