import { prisma } from "@/lib/prisma";
import { editPengguna } from "../../actions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditPenggunaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const user = await prisma.tbl_pengguna.findUnique({
    where: { pengguna_id: id },
  });

  if (!user) {
    notFound();
  }

  const editPenggunaWithId = editPengguna.bind(null, id);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Pengguna</h1>
        <Link href="/admin/pengguna" className="text-gray-600 hover:text-gray-900">
          Kembali
        </Link>
      </div>

      <form action={editPenggunaWithId} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <input
              suppressHydrationWarning type="text" name="nama" defaultValue={user.pengguna_nama || ""} required className="w-full px-4 py-2 border rounded-md" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
          <select
              suppressHydrationWarning name="jenkel" defaultValue={user.pengguna_jenkel || "L"} required className="w-full px-4 py-2 border rounded-md">
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
              suppressHydrationWarning type="text" name="username" defaultValue={user.pengguna_username || ""} required className="w-full px-4 py-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru (Biarkan kosong jika tidak diganti)</label>
          <input
              suppressHydrationWarning type="password" name="password" className="w-full px-4 py-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
              suppressHydrationWarning type="email" name="email" defaultValue={user.pengguna_email || ""} required className="w-full px-4 py-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">No HP</label>
          <input
              suppressHydrationWarning type="text" name="nohp" defaultValue={user.pengguna_nohp || ""} required className="w-full px-4 py-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Level Akses</label>
          <select
              suppressHydrationWarning name="level" defaultValue={user.pengguna_level || "1"} required className="w-full px-4 py-2 border rounded-md">
            <option value="1">Administrator</option>
            <option value="2">Author</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ganti Foto Avatar (Opsional)</label>
          <input
              suppressHydrationWarning type="file" name="filefoto" accept="image/*" className="w-full px-4 py-2 border rounded-md bg-gray-50" />
        </div>

        <div className="flex justify-end pt-4">
          <SubmitButton text="Update Pengguna" loadingText="Mengupdate..." />
        </div>
      </form>
    </div>
  );
}
