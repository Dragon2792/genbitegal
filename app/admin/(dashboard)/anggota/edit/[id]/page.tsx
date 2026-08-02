import { editAnggota } from "../../actions";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function EditAnggotaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const anggota = await prisma.tbl_siswa.findUnique({
    where: { siswa_id: id }
  });

  if (!anggota) {
    redirect("/admin/anggota");
  }

  const kelasList = await prisma.tbl_kelas.findMany();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-800">Anggota</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <Link href="/admin/dashboard" className="hover:text-blue-600">Home</Link>
          <span>›</span>
          <Link href="/admin/anggota" className="hover:text-blue-600">Anggota</Link>
          <span>›</span>
          <span className="text-gray-700">Edit Anggota</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="mb-5 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Edit Data Anggota</h2>
        </div>

        <form action={async (formData) => {
          "use server";
          await editAnggota(id, formData);
        }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="nis" className="block text-sm font-semibold text-gray-700 mb-1.5">NIS (Nomor Induk Siswa)</label>
              <input
              suppressHydrationWarning 
                type="text" 
                name="nis" 
                id="nis" 
                required 
                defaultValue={anggota.siswa_nis || ""}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
              />
            </div>
            
            <div>
              <label htmlFor="nama" className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
              <input
              suppressHydrationWarning 
                type="text" 
                name="nama" 
                id="nama" 
                required 
                defaultValue={anggota.siswa_nama || ""}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
              />
            </div>

            <div>
              <label htmlFor="jenkel" className="block text-sm font-semibold text-gray-700 mb-1.5">Jenis Kelamin</label>
              <select
              suppressHydrationWarning 
                name="jenkel" 
                id="jenkel" 
                required
                defaultValue={anggota.siswa_jenkel || ""}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-white"
              >
                <option value="">— Pilih —</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div>
              <label htmlFor="kelas_id" className="block text-sm font-semibold text-gray-700 mb-1.5">Kelas</label>
              <select
              suppressHydrationWarning 
                name="kelas_id" 
                id="kelas_id" 
                required
                defaultValue={anggota.siswa_kelas_id || ""}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-white"
              >
                <option value="">— Pilih —</option>
                {kelasList.map((kelas) => (
                  <option key={kelas.kelas_id} value={kelas.kelas_id}>
                    {kelas.kelas_nama}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="photo" className="block text-sm font-semibold text-gray-700 mb-1.5">Ganti Pas Foto (Opsional)</label>
            {anggota.siswa_photo && anggota.siswa_photo !== 'default.jpg' && anggota.siswa_photo !== 'blank.png' && (
              <div className="mb-3">
                <Image
                  src={`/assets/images/${anggota.siswa_photo}`}
                  alt="Foto saat ini"
                  width={80}
                  height={80}
                  className="object-cover rounded-lg border border-gray-200"
                />
                <p className="text-xs text-gray-400 mt-1">Foto saat ini</p>
              </div>
            )}
            <input
              suppressHydrationWarning 
              type="file" 
              name="photo" 
              id="photo"
              accept="image/gif,image/jpeg,image/png,image/bmp"
              className="w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-2.5 border bg-white file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
                    suppressHydrationWarning 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-lg transition-colors"
            >
              Update Anggota
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
