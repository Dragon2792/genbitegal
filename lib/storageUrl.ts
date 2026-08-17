export function getStorageUrl(filename: string | null | undefined, type: 'images' | 'files' = 'images') {
  if (!filename) return null;
  
  // Jika filename sudah berupa URL lengkap (misal http://...), kembalikan langsung
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const bucket = "genbi-asset"; // Nama bucket di Supabase
  
  // Mengembalikan public URL
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${type}/${filename}`;
}
