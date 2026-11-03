"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, Loader2, Trash2, User } from "lucide-react";
import SubmitButton from "@/components/SubmitButton";
import { compressImage } from "@/lib/imageCompression";
import { getStorageUrl } from "@/lib/storageUrl";

interface KelasItem {
  kelas_id: number;
  kelas_nama: string | null;
}

interface AnggotaFormProps {
  action: (formData: FormData) => void | Promise<void>;
  kelasList: KelasItem[];
  submitText?: string;
  loadingText?: string;
  initial?: {
    siswa_nis?: string | null;
    siswa_nama?: string | null;
    siswa_jenkel?: string | null;
    siswa_kelas_id?: number | null;
    siswa_photo?: string | null;
  };
}

export default function AnggotaForm({
  action,
  kelasList,
  submitText = "Simpan Anggota",
  loadingText = "Menyimpan...",
  initial = {},
}: AnggotaFormProps) {
  const initialPhoto =
    initial.siswa_photo &&
    initial.siswa_photo !== "default.jpg" &&
    initial.siswa_photo !== "blank.png"
      ? initial.siswa_photo
      : "";

  const [photo, setPhoto] = useState(initialPhoto);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("File yang dipilih harus berupa gambar (JPG, PNG, WEBP).");
      return;
    }

    setError("");
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const fd = new FormData();
      fd.append(
        "file",
        new File([compressed], file.name, {
          type: compressed.type || file.type,
        })
      );
      fd.append("type", "images");

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const text = await res.text();
      let json: { fileName?: string; error?: string } = {};
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(
          res.status === 413
            ? "Ukuran foto terlalu besar untuk server (413). Coba pilih foto dengan ukuran lebih kecil."
            : `Gagal mengupload foto (Status ${res.status}).`
        );
      }

      if (!res.ok || !json.fileName) {
        throw new Error(json.error || "Upload foto gagal.");
      }

      setPhoto(json.fileName);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal mengupload foto.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="siswa_photo" value={photo} />

      {/* Upload Foto dengan Preview & Kompresi Otomatis */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
        <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md flex items-center justify-center flex-shrink-0 relative">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getStorageUrl(photo)}
              alt="Foto anggota"
              className="w-full h-full object-cover"
            />
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
          <label className="block text-sm font-semibold text-gray-700">
            Pas Foto Anggota (Opsional)
          </label>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-semibold cursor-pointer transition-colors">
              <Camera size={16} />
              {photo ? "Ganti Foto" : "Pilih / Upload Foto"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
            {photo && (
              <button
                type="button"
                onClick={() => setPhoto("")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              >
                <Trash2 size={16} /> Hapus Foto
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Foto otomatis dikompresi sebelum dikirim ke server agar cepat dan tidak gagal di HP.
          </p>
          {error && (
            <p className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-md border border-red-200">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="nis"
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            NIS / NIM (Nomor Induk)
          </label>
          <input
            suppressHydrationWarning
            type="text"
            name="nis"
            id="nis"
            required
            defaultValue={initial.siswa_nis || ""}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
          />
        </div>

        <div>
          <label
            htmlFor="nama"
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            Nama Lengkap
          </label>
          <input
            suppressHydrationWarning
            type="text"
            name="nama"
            id="nama"
            required
            defaultValue={initial.siswa_nama || ""}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
          />
        </div>

        <div>
          <label
            htmlFor="jenkel"
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            Jenis Kelamin
          </label>
          <select
            suppressHydrationWarning
            name="jenkel"
            id="jenkel"
            required
            defaultValue={initial.siswa_jenkel || ""}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-white"
          >
            <option value="">— Pilih —</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="kelas_id"
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            Komisariat / Kelas
          </label>
          <select
            suppressHydrationWarning
            name="kelas_id"
            id="kelas_id"
            required
            defaultValue={initial.siswa_kelas_id || ""}
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

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Link
          href="/admin/anggota"
          className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Batal
        </Link>
        {uploading ? (
          <button
            type="button"
            disabled
            className="bg-blue-600 text-white text-sm font-semibold py-2.5 px-6 rounded-lg opacity-70"
          >
            Mengupload foto...
          </button>
        ) : (
          <SubmitButton text={submitText} loadingText={loadingText} />
        )}
      </div>
    </form>
  );
}

