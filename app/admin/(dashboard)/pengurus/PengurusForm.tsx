"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, Loader2, Trash2, User } from "lucide-react";
import SubmitButton from "@/components/SubmitButton";
import { compressImage } from "@/lib/imageCompression";
import { getStorageUrl } from "@/lib/storageUrl";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  kelompokOptions: readonly { value: string; label: string }[];
  divisiOptions: string[];
  initial?: {
    pengurus_nama?: string | null;
    pengurus_jabatan?: string | null;
    pengurus_kelompok?: string | null;
    pengurus_divisi?: string | null;
    pengurus_is_ketua?: number;
    pengurus_foto?: string | null;
    pengurus_urutan?: number;
  };
};

const inputCls =
  "w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all";

export default function PengurusForm({ action, kelompokOptions, divisiOptions, initial = {} }: Props) {
  const [kelompok, setKelompok] = useState(initial.pengurus_kelompok || "kementrian");
  const [foto, setFoto] = useState(initial.pengurus_foto || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const fd = new FormData();
      fd.append("file", new File([compressed], file.name, { type: compressed.type || file.type }));
      fd.append("type", "images");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload gagal");
      setFoto(json.fileName);
    } catch (err: any) {
      setError(err.message || "Upload gagal");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <form action={action} className="space-y-6 p-6">
      <input type="hidden" name="pengurus_foto" value={foto} />

      {/* Foto */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md flex items-center justify-center flex-shrink-0 relative">
          {foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={getStorageUrl(foto)} alt="Foto pengurus" className="w-full h-full object-cover" />
          ) : (
            <User size={40} className="text-gray-400" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 className="animate-spin text-white" size={28} />
            </div>
          )}
        </div>
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex gap-2 justify-center sm:justify-start">
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-semibold cursor-pointer transition-colors">
              <Camera size={16} />
              {foto ? "Ganti Foto" : "Upload Foto"}
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
            </label>
            {foto && (
              <button
                type="button"
                onClick={() => setFoto("")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors"
              >
                <Trash2 size={16} /> Hapus
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500">Disarankan foto persegi (1:1). Otomatis dikompres maks. 1 MB.</p>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
          <input type="text" name="pengurus_nama" required defaultValue={initial.pengurus_nama || ""} className={inputCls} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Kelompok</label>
          <select name="pengurus_kelompok" value={kelompok} onChange={(e) => setKelompok(e.target.value)} className={inputCls}>
            {kelompokOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {kelompok === "kementrian" && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Kementrian</label>
              <input
                type="text"
                name="pengurus_divisi"
                list="divisi-list"
                required
                defaultValue={initial.pengurus_divisi || divisiOptions[0]}
                className={inputCls}
              />
              <datalist id="divisi-list">
                {divisiOptions.map((d) => <option key={d} value={d} />)}
              </datalist>
              <p className="text-xs text-gray-500">Pilih yang ada atau ketik nama kementrian baru.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Posisi</label>
              <label className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-gray-200 cursor-pointer">
                <input type="checkbox" name="pengurus_is_ketua" value="1" defaultChecked={initial.pengurus_is_ketua === 1} className="w-4 h-4" />
                <span className="text-sm text-gray-700">Jadikan <b>Mentri</b> (kepala kementrian)</span>
              </label>
            </div>
          </>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {kelompok === "komisariat" ? "Nama Komisariat" : "Jabatan"}
          </label>
          <input
            type="text"
            name="pengurus_jabatan"
            required
            placeholder={
              kelompok === "komisariat" ? "cth: Komisariat UPS" : kelompok === "kementrian" ? "cth: S.A Website" : kelompok === "dewan" ? "Dewan Pengawas" : "Presiden GenBI Tegal"
            }
            defaultValue={initial.pengurus_jabatan || ""}
            className={inputCls}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Urutan Tampil</label>
          <input type="number" name="pengurus_urutan" defaultValue={initial.pengurus_urutan ?? 0} className={inputCls} />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
        <Link href="/admin/pengurus" className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors">
          Batal
        </Link>
        {uploading ? (
          <button type="button" disabled className="bg-blue-600 text-white font-bold py-2.5 px-8 rounded-lg opacity-70">Mengupload foto...</button>
        ) : (
          <SubmitButton text="Simpan" loadingText="Menyimpan..." />
        )}
      </div>
    </form>
  );
}
