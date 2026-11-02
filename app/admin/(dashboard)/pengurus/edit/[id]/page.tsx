import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { DIVISI_OPTIONS, KELOMPOK_OPTIONS, getAllPengurus } from "@/lib/pengurus";
import { editPengurus } from "../../actions";
import PengurusForm from "../../PengurusForm";

export default async function EditPengurusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = parseInt(idStr);
  const all = await getAllPengurus();
  const pengurus = all.find((p) => p.pengurus_id === id);
  if (!pengurus) redirect("/admin/pengurus");

  const divisi = Array.from(new Set([...DIVISI_OPTIONS, ...all.map((p) => p.pengurus_divisi).filter(Boolean) as string[]]));

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Struktur Pengurus</h1>
        <div className="flex items-center gap-2 mt-2 text-sm">
          <Link href="/admin/pengurus" className="hover:text-blue-600">Struktur Pengurus</Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-700">Edit</span>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Edit Pengurus</h2>
        </div>
        <PengurusForm
          action={editPengurus.bind(null, id)}
          kelompokOptions={KELOMPOK_OPTIONS}
          divisiOptions={divisi}
          initial={pengurus}
        />
      </div>
    </div>
  );
}
