import { editAgenda } from "../../actions";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";

export default async function EditAgendaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const agenda = await prisma.tbl_agenda.findUnique({
    where: { agenda_id: id }
  });

  if (!agenda) {
    redirect("/admin/agenda");
  }

  // Format dates for input type="date"
  const mulaiDate = agenda.agenda_mulai ? new Date(agenda.agenda_mulai).toISOString().split('T')[0] : "";
  const selesaiDate = agenda.agenda_selesai ? new Date(agenda.agenda_selesai).toISOString().split('T')[0] : "";

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Agenda</h1>
        <Link href="/admin/agenda" className="text-gray-500 hover:text-gray-700">
          &larr; Kembali
        </Link>
      </div>

      <form action={async (formData) => {
        "use server";
        await editAgenda(id, formData);
      }} className="space-y-6">
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Agenda</label>
          <input
              suppressHydrationWarning 
            type="text" 
            name="nama" 
            id="nama" 
            required 
            defaultValue={agenda.agenda_nama || ""}
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
              defaultValue={mulaiDate}
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
              defaultValue={selesaiDate}
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
            defaultValue={agenda.agenda_tempat || ""}
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
            defaultValue={agenda.agenda_waktu || ""}
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
            defaultValue={agenda.agenda_keterangan || ""}
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
            defaultValue={agenda.agenda_deskripsi || ""}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <SubmitButton text="Update Agenda" loadingText="Mengupdate..." />
        </div>
      </form>
    </div>
  );
}
