import { addArtikel } from "../actions";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ArtikelForm from "./ArtikelForm";

export default async function TambahArtikelPage() {
  const categories = await prisma.tbl_kategori.findMany();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-800">Berita</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <Link href="/admin/dashboard" className="hover:text-blue-600">Home</Link>
          <span>›</span>
          <Link href="/admin/artikel" className="hover:text-blue-600">Berita</Link>
          <span>›</span>
          <span className="text-gray-700">Add Berita</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-5 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Post Berita</h2>
        </div>
        <ArtikelForm categories={categories} action={addArtikel} />
      </div>
    </div>
  );
}
