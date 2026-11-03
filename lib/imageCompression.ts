import imageCompression from "browser-image-compression";

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.7, // Maks 700 KB agar aman melewati batas default 1MB Nginx di VPS
    maxWidthOrHeight: 1600,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Image compression error:", error);
    return file; // Return original if compression fails
  }
}
