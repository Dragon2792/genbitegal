import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Megaphone, Info, Target, Star, FileText, Calendar, Pen, ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Pengumuman",
  description: "Informasi penting dan pengumuman resmi dari GenBI Tegal.",
};

export const dynamic = "force-dynamic";

export default async function PengumumanPage() {
  const pengumuman = await prisma.tbl_pengumuman.findMany({
    orderBy: { pengumuman_tanggal: "desc" }
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
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 70% 30%, rgba(232,164,0,0.1) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
            <span style={{ color: "#E8A400", fontSize: "14px", fontWeight: "600" }}>Pengumuman</span>
          </div>
          <h1 style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: "900", color: "white", marginBottom: "16px", fontFamily: "'Lora', serif" }}>
            <Megaphone size={48} /> <span><span style={{ color: "#E8A400" }}>Pengumuman</span></span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "1.1rem", maxWidth: "500px", lineHeight: "1.7" }}>
            Informasi penting dan pengumuman resmi dari GenBI Tegal.
          </p>
        </div>
      </section>

      {/* Announcements */}
      <section style={{ padding: "80px 24px 100px", background: "#f8fafc", minHeight: "60vh" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          {/* Important Notice Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, #fef3c7, #fde68a)",
              border: "1px solid #fbbf24",
              borderRadius: "12px",
              padding: "16px 20px",
              display: "flex",
              gap: "12px",
              alignItems: "center",
              marginBottom: "32px",
            }}
          >
            <Info size={24} color="#92400e" />
            <p style={{ color: "#92400e", fontSize: "14px", fontWeight: "600", margin: 0 }}>
              Klik pada pengumuman untuk melihat detail selengkapnya.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {pengumuman.map((item, i) => (
              <details
                key={item.pengumuman_id}
                className="pengumuman-details"
                style={{
                  background: "white",
                  borderRadius: "14px",
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  border: `1px solid #e2e8f0`,
                }}
              >
                <summary
                  style={{ 
                    padding: "24px", 
                    cursor: "pointer", 
                    listStyle: "none",
                    outline: "none",
                    display: "flex",
                  }}
                >
                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", width: "100%" }}>
                    {/* Icon */}
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        background: `rgba(4, 28, 63, 0.08)`,
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "22px",
                        flexShrink: 0,
                      }}
                    >
                      {[<Megaphone size={24} key="1"/>, <Info size={24} key="2"/>, <Target size={24} key="3"/>, <Star size={24} key="4"/>, <FileText size={24} key="5"/>][i % 5]}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px", flexWrap: "wrap" }}>
                        <span
                          style={{
                            background: `rgba(4, 28, 63, 0.1)`,
                            color: "#041C3F",
                            padding: "3px 10px",
                            borderRadius: "10px",
                            fontSize: "11px",
                            fontWeight: "700",
                          }}
                        >
                          Pengumuman
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#94a3b8" }}>
                          <Calendar size={14} /> {item.pengumuman_tanggal ? format(new Date(item.pengumuman_tanggal), "dd MMM yyyy", { locale: id }) : ""}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#94a3b8" }}>
                          <Pen size={14} /> {item.pengumuman_author || "Admin"}
                        </span>
                      </div>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", lineHeight: "1.4", margin: 0 }}>
                        {item.pengumuman_judul}
                      </h3>
                    </div>

                    {/* Expand icon (CSS will rotate it) */}
                    <div
                      className="expand-icon"
                      style={{
                        width: "28px",
                        height: "28px",
                        background: "#f1f5f9",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        flexShrink: 0,
                        transition: "transform 0.3s ease",
                      }}
                    >
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </summary>

                {/* Expandable content */}
                <div
                  style={{
                    padding: "0 24px 24px",
                    borderTop: "1px solid #f1f5f9",
                  }}
                >
                  <div style={{ height: "1px", marginBottom: "16px" }} />
                  <div 
                    style={{ color: "#475569", fontSize: "15px", lineHeight: "1.8" }}
                    dangerouslySetInnerHTML={{ __html: item.pengumuman_deskripsi || "" }}
                  />
                </div>
              </details>
            ))}

            {pengumuman.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                Tidak ada pengumuman saat ini.
              </div>
            )}
          </div>
          
          <style>{`
            .pengumuman-details summary::-webkit-details-marker {
              display: none;
            }
            .pengumuman-details[open] .expand-icon {
              transform: rotate(180deg) !important;
            }
          `}</style>
        </div>
      </section>
    </>
  );
}
