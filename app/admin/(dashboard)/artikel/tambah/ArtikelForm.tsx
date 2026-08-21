"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
const ReactQuillAny = ReactQuill as any;

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ["clean"],
  ],
};

import { compressImage } from "@/lib/imageCompression";
import { supabase } from "@/lib/supabase";

export default function ArtikelForm({
  categories,
  action,
}: {
  categories: any[];
  action: (formData: FormData) => void;
}) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [quillRef, setQuillRef] = useState<any>(null);

  // Custom image handler: upload to Supabase, insert URL (not base64)
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const compressed = await compressImage(file);
        const ext = compressed.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `content/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        const { error } = await supabase.storage
          .from("genbi-asset")
          .upload(fileName, compressed, { cacheControl: "3600", upsert: false });

        if (error) {
          alert("Gagal mengupload gambar: " + error.message);
          return;
        }

        const { data } = supabase.storage.from("genbi-asset").getPublicUrl(fileName);
        const url = data.publicUrl;

        // Insert image URL into Quill editor
        const editor = quillRef?.getEditor();
        if (editor) {
          const range = editor.getSelection(true);
          editor.insertEmbed(range.index, "image", url);
          editor.setSelection(range.index + 1);
        }
      } catch (e) {
        console.error(e);
        alert("Terjadi kesalahan saat upload gambar.");
      } finally {
        setIsUploading(false);
      }
    };
  };

  const modules = {
    ...quillModules,
    toolbar: {
      container: quillModules.toolbar,
      handlers: { image: imageHandler },
    },
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      formData.set("isi", content);
      
      const file = formData.get("gambar") as File;
      if (file && file.size > 0 && file.type.startsWith('image/')) {
        // Compress
        const compressedFile = await compressImage(file);
        
        // Generate name
        const ext = compressedFile.name.split('.').pop()?.toLowerCase() || 'jpg';
        const photoName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        
        // Upload directly from client
        const { error } = await supabase.storage
          .from("genbi-asset")
          .upload(`images/${photoName}`, compressedFile, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (error) {
          console.error("Client upload error:", error);
          alert("Gagal mengupload gambar. Silakan coba lagi.");
          setIsUploading(false);
          return;
        }
        
        // Remove file from formData to avoid sending it to Server Action
        formData.delete("gambar");
        // Pass only the generated file name
        formData.set("gambar_name", photoName);
      }
      
      startTransition(async () => {
        const result = await action(formData) as any;
        if (result && result.error) {
          alert("Gagal menyimpan ke database: " + result.error);
          setIsUploading(false);
        }
      });
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Judul - full width hero style */}
      <div className="mb-4">
        <input
              suppressHydrationWarning
          type="text"
          name="judul"
          id="judul"
          required
          placeholder="Judul berita atau artikel..."
          className="w-full text-2xl font-bold border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none py-3 px-1 placeholder-gray-300 transition-colors bg-transparent"
        />
      </div>

      {/* Rich Text Editor */}
      <div className="mb-6">
        {isUploading && (
          <div className="flex items-center gap-2 mb-2 text-sm text-blue-600 bg-blue-50 rounded px-3 py-1.5">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Mengupload gambar ke server...
          </div>
        )}
        <div className="border border-gray-200 rounded-lg bg-white">
          <style dangerouslySetInnerHTML={{__html: `
            .ql-toolbar.ql-snow {
              position: sticky;
              top: 0;
              z-index: 50;
              background-color: #f8fafc;
              border-top-left-radius: 0.5rem;
              border-top-right-radius: 0.5rem;
            }
            .ql-container.ql-snow {
              min-height: 400px;
              border-bottom-left-radius: 0.5rem;
              border-bottom-right-radius: 0.5rem;
            }
          `}} />
          <ReactQuillAny
            ref={setQuillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            placeholder="Tulis isi artikel di sini..."
          />
        </div>
      </div>

      {/* Pengaturan Lainnya */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Pengaturan Lainnya</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="kategori_id" className="block text-sm font-medium text-gray-700 mb-1.5">
              Kategori
            </label>
            <select
              suppressHydrationWarning
              name="kategori_id"
              id="kategori_id"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border bg-white"
            >
              <option value="">— Pilih —</option>
              {categories.map((cat) => (
                <option key={cat.kategori_id} value={cat.kategori_id}>
                  {cat.kategori_nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1.5">
              Author
            </label>
            <input
              suppressHydrationWarning
              type="text"
              name="author"
              id="author"
              defaultValue="Admin"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="gambar" className="block text-sm font-medium text-gray-700 mb-1.5">
              Gambar Cover
            </label>
            <input
              suppressHydrationWarning
              type="file"
              name="gambar"
              id="gambar"
              accept="image/gif,image/jpeg,image/png,image/bmp"
              className="w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-2.5 border bg-white file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
                    suppressHydrationWarning
          type="submit"
          disabled={isPending || isUploading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 px-8 rounded-lg transition-colors"
        >
          {isPending ? "Menyimpan..." : isUploading ? "Mengupload..." : "Simpan Artikel"}
        </button>
      </div>
    </form>
  );
}
