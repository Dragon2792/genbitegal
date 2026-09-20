/**
 * @deprecated Supabase Storage sudah tidak digunakan.
 * Upload file sekarang menggunakan lib/uploadHelper.ts (local storage).
 * File ini dipertahankan agar tidak ada import error selama masa transisi.
 *
 * Jika kamu melihat file ini masih diimport di suatu tempat,
 * ganti dengan: import { uploadFileLocal, deleteFileLocal } from "@/lib/uploadHelper";
 */

// Ekspor dummy agar import lama tidak crash
export const supabase = {
  storage: {
    from: () => ({
      upload: async () => ({ error: new Error("Supabase sudah dinonaktifkan. Gunakan uploadHelper.ts") }),
      remove: async () => ({ error: null }),
    }),
  },
};
