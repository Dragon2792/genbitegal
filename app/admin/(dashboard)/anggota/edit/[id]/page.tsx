import { editAnggota } from "../../actions";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AnggotaForm from "../../AnggotaForm";

export default async function EditAnggotaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  const anggota = await prisma.tbl_siswa.findUnique({
    where: { siswa_id: id },
  });

  if (!anggota) {
    redirect("/admin/anggota");
  }

  const kelasList = await prisma.tbl_kelas.findMany({
    orderBy: { kelas_id: "asc" },
  });

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-800">Anggota</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <Link href="/admin/dashboard" className="hover:text-blue-600">
            Home
          </Link>
          <span>›</span>
          <Link href="/admin/anggota" className="hover:text-blue-600">
            Anggota
          </Link>
          <span>›</span>
          <span className="text-gray-700">Edit Anggota</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="mb-5 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Edit Data Anggota</h2>
        </div>

        <AnggotaForm
          action={async (formData) => {
            "use server";
            await editAnggota(id, formData);
          }}
          kelasList={kelasList}
          initial={anggota}
          submitText="Update Anggota"
          loadingText="Mengupdate..."
        />
      </div>
    </div>
  );
}
