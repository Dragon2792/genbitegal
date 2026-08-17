import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteAgenda } from "./actions";
import DeleteButton from "@/components/DeleteButton";

export default async function AgendaPage() {
  const agendaList = await prisma.tbl_agenda.findMany({
    orderBy: { agenda_mulai: "desc" },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Agenda</h1>
        <Link 
          href="/admin/agenda/tambah" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          + Tambah Agenda
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Agenda</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Pelaksanaan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tempat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {agendaList.map((agenda, idx) => (
              <tr key={agenda.agenda_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{agenda.agenda_nama}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {agenda.agenda_mulai ? new Date(agenda.agenda_mulai).toLocaleDateString("id-ID") : "-"}
                  {" s/d "}
                  {agenda.agenda_selesai ? new Date(agenda.agenda_selesai).toLocaleDateString("id-ID") : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agenda.agenda_tempat}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3">
                  <Link href={`/admin/agenda/edit/${agenda.agenda_id}`} className="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </Link>
                  <DeleteButton action={async () => {
                    "use server";
                    await deleteAgenda(agenda.agenda_id);
                  }} />

                </td>
              </tr>
            ))}
            {agendaList.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Belum ada data agenda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
