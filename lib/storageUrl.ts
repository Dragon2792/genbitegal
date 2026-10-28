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

  // Jika fileName masih berupa URL Cloudinary (akun sudah disabled),
  // otomatis alihkan ke file lokal di VPS: /assets/images/<nama-file>
  if (fileName.includes('cloudinary.com')) {
    const cleanName = fileName.split('/').pop()?.split('?')[0];
    return cleanName ? `/assets/${type}/${cleanName}` : (type === 'images' ? '/assets/images/placeholder.jpg' : '#');
  }

  // Jika fileName berupa URL eksternal lainnya
  if (fileName.startsWith('http://') || fileName.startsWith('https://')) {
    return fileName;
  }

  // Jika fileName sudah berupa relative path (misal: /assets/images/...)
  if (fileName.startsWith('/')) {
    return fileName;
  }

  // Default: ambil dari folder static lokal VPS (/assets/images/ atau /assets/files/)
  return `/assets/${type}/${fileName}`;
}

