"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FolderHeart, ChevronLeft, ChevronRight, X, Camera, Calendar } from "lucide-react";

export type AlbumType = {
  id: number;
  title: string;
  date: string;
  cover: string;
  images: string[];
};

export default function GaleriClient({ albumsData }: { albumsData: AlbumType[] }) {
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumType | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Buka Lightbox Modal
  const openLightbox = (album: AlbumType) => {
    // Hanya buka jika album memiliki array gambar
    if (album.images && album.images.length > 0) {
      setSelectedAlbum(album);
      setCurrentImageIndex(0);
      
      if (typeof window !== "undefined") {
        document.body.style.overflow = "hidden";
      }
    } else {
      alert("Album ini belum memiliki foto.");
    }
  };

  // Tutup Lightbox Modal
  const closeLightbox = () => {
    setSelectedAlbum(null);
    if (typeof window !== "undefined") {
      document.body.style.overflow = "auto";
    }
  };

  // Geser foto selanjutnya
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedAlbum && selectedAlbum.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedAlbum.images.length);
    }
  };

  // Geser foto sebelumnya
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedAlbum && selectedAlbum.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedAlbum.images.length) % selectedAlbum.images.length);
    }
  };

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
        {albumsData.map((album, i) => {
          const photoCount = album.images ? album.images.length : 0;
          
          return (
            <div
              key={album.id}
              onClick={() => openLightbox(album)}
              className="card-album"
              style={{
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                border: "1px solid #e2e8f0",
                cursor: photoCount > 0 ? "pointer" : "default",
                transition: "all 0.3s ease",
              }}
            >
              {album.cover ? (
                <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
                  <Image
                    src={`/assets/images/${album.cover}`}
                    alt={album.title || "Album Cover"}
                    fill
                    style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
                    className="album-cover-img"
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      right: "12px",
                      background: "rgba(0,0,0,0.75)",
                      backdropFilter: "blur(4px)",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "700",
                      zIndex: 10,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Camera size={14} /> {photoCount} foto</span>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    height: "220px",
                    background: `linear-gradient(135deg, ${["#041C3F", "#11418B", "#0a2a5e", "#1a3a6e", "#041C3F", "#0d3570"][i % 6]}, ${["#11418B", "#1a5cb8", "#11418B", "#11418B", "#1a5cb8", "#11418B"][i % 6]})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <FolderHeart size={60} color="rgba(255,255,255,0.7)" />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      right: "12px",
                      background: "rgba(0,0,0,0.5)",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Camera size={14} /> {photoCount} foto</span>
                  </div>
                </div>
              )}
              <div style={{ padding: "20px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#1e293b", marginBottom: "8px", lineHeight: "1.4" }}>
                  {album.title}
                </h3>
                <div style={{ display: "flex", gap: "12px", fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Calendar size={14} /> {album.date}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {albumsData.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
          Belum ada album galeri.
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {selectedAlbum && (
        <div
          onClick={closeLightbox}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            backdropFilter: "blur(8px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <button
              suppressHydrationWarning
            onClick={closeLightbox}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 100,
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.8)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          >
            <X size={28} />
          </button>

          {selectedAlbum.images.length > 1 && (
            <button
              suppressHydrationWarning
              onClick={prevImage}
              style={{
                position: "absolute",
                left: "24px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                borderRadius: "50%",
                width: "56px",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 100,
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; e.currentTarget.style.transform = "translateY(-50%) scale(1.1)"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.5)"; e.currentTarget.style.transform = "translateY(-50%) scale(1)"; }}
            >
              <ChevronLeft size={32} />
            </button>
          )}

          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              position: "relative", 
              width: "100%", 
              maxWidth: "1000px", 
              height: "85vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image
                src={`/assets/images/${selectedAlbum.images[currentImageIndex]}`}
                alt={`Foto ${currentImageIndex + 1}`}
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>

            <div 
              style={{
                position: "absolute",
                bottom: "-40px",
                left: "0",
                width: "100%",
                textAlign: "center",
                color: "rgba(255,255,255,0.8)",
                fontSize: "15px",
                fontWeight: "500",
                letterSpacing: "0.5px"
              }}
            >
              {currentImageIndex + 1} / {selectedAlbum.images.length} &nbsp;—&nbsp; <span style={{ color: "white", fontWeight: "700" }}>{selectedAlbum.title}</span>
            </div>
          </div>

          {selectedAlbum.images.length > 1 && (
            <button
              suppressHydrationWarning
              onClick={nextImage}
              style={{
                position: "absolute",
                right: "24px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                borderRadius: "50%",
                width: "56px",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 100,
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; e.currentTarget.style.transform = "translateY(-50%) scale(1.1)"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.5)"; e.currentTarget.style.transform = "translateY(-50%) scale(1)"; }}
            >
              <ChevronRight size={32} />
            </button>
          )}
        </div>
      )}
      
      <style>{`
        .card-album:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.12) !important;
          border-color: #cbd5e1 !important;
        }
        .card-album:hover .album-cover-img {
          transform: scale(1.08);
        }
      `}</style>
    </>
  );
}
