import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DIVISI_OPTIONS, KELOMPOK_OPTIONS, getAllPengurus } from "@/lib/pengurus";
import { addPengurus } from "../actions";
import PengurusForm from "../PengurusForm";

export default async function TambahPengurusPage() {
  const all = await getAllPengurus();
  const divisi = Array.from(new Set([...DIVISI_OPTIONS, ...all.map((p) => p.pengurus_divisi).filter(Boolean) as string[]]));

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Struktur Pengurus</h1>
        <div className="flex items-center gap-2 mt-2 text-sm">
          <Link href="/admin/pengurus" className="hover:text-blue-600">Struktur Pengurus</Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-700">Tambah</span>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Tambah Pengurus</h2>
        </div>
        <PengurusForm action={addPengurus} kelompokOptions={KELOMPOK_OPTIONS} divisiOptions={divisi} />
      </div>
    </div>
  );
}
