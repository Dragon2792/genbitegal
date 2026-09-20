/**
 * Mengembalikan URL publik untuk file yang disimpan di server lokal.
 * 
 * File disimpan di: public/uploads/images/ atau public/uploads/files/
 * Diakses browser via: /uploads/images/nama-file.jpg
 * 
 * @param filename  - nama file (misal: "1234567-abc123.jpg") atau URL lengkap
 * @param type      - "images" atau "files"
 */
// Karena Cloudinary mengembalikan full URL (https://res.cloudinary.com/...),
// kita tidak perlu lagi menambahkan prefix "/uploads/"
export function getStorageUrl(fileName: string | null | undefined, type: 'images' | 'files' = 'images'): string {
  if (!fileName) {
    return type === 'images' ? '/assets/images/placeholder.jpg' : '#';
  }

  // Jika fileName sudah berupa URL lengkap (HTTP/HTTPS dari Cloudinary atau Supabase lama)
  if (fileName.startsWith('http://') || fileName.startsWith('https://')) {
    return fileName;
  }

  // Fallback ke penyimpanan lokal lama jika fotonya masih ada di server lokal
  return `/assets/${type}/${fileName}`;
}
