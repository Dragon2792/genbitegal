import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import GaleriClient, { AlbumType } from "@/components/GaleriClient";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Galeri foto kegiatan GenBI Tegal - Dokumentasi berbagai program dan acara komunitas.",
};

export const dynamic = "force-dynamic";

export default async function GaleriPage() {
  const albumsDb = await prisma.tbl_album.findMany({
    orderBy: { album_id: "desc" }
  });

  const photosDb = await prisma.tbl_galeri.findMany({
    orderBy: { galeri_id: "desc" }
  });

  const albumsData: AlbumType[] = albumsDb.map(album => {
    const albumPhotos = photosDb.filter(p => p.galeri_album_id === album.album_id);
    const images = albumPhotos.map(p => p.galeri_gambar).filter(Boolean) as string[];

    return {
      id: album.album_id,
      title: album.album_nama || "Album",
      date: album.album_tanggal ? format(new Date(album.album_tanggal), "dd MMM yyyy", { locale: id }) : "",
      cover: album.album_cover || "",
      images: images
    };
  });

  return (
    <>
      {/* Header */}
      <section
        style={{
          paddingTop: "130px",
          paddingBottom: "80px",
          background: "linear-gradient(135deg, #041C3F 0%, #11418B 60%, #1a5cb8 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 80% 30%, rgba(232,164,0,0.1) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
            <span style={{ color: "#E8A400", fontSize: "14px", fontWeight: "600" }}>Galeri</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: "900", color: "white", marginBottom: "16px", fontFamily: "'Lora', serif" }}>
            Galeri <span style={{ color: "#E8A400" }}>Foto</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "1.1rem", maxWidth: "500px", lineHeight: "1.7" }}>
            Dokumentasi kegiatan dan momen berharga perjalanan GenBI Tegal.
          </p>
        </div>
      </section>

      {/* Albums Component */}
      <section style={{ padding: "80px 24px", background: "white", minHeight: "60vh" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#041C3F", marginBottom: "4px" }}>Album Kegiatan</h2>
              <p style={{ color: "#64748b", fontSize: "14px" }}>Klik album untuk melihat koleksi foto</p>
            </div>
          </div>
          
          <GaleriClient albumsData={albumsData} />

        </div>
      </section>
    </>
  );
}
