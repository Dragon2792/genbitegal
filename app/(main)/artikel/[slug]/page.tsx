import { getStorageUrl } from "@/lib/storageUrl";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Pen, Calendar, Eye, Newspaper, ArrowLeft, Inbox } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.tbl_tulisan.findFirst({
    where: { tulisan_slug: slug }
  });
  
  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan",
    };
  }

  return {
    title: article.tulisan_judul || "Artikel",
    description: article.tulisan_isi?.substring(0, 160) || "Artikel dari GenBI Tegal",
  };
}

export const dynamic = "force-dynamic";

export default async function ArtikelDetailPage({ params }: Props) {
  const { slug } = await params;
  
  const article = await prisma.tbl_tulisan.findFirst({
    where: { tulisan_slug: slug }
  });

  if (!article) {
    notFound();
  }

  // Update view count (fire and forget for performance)
  prisma.tbl_tulisan.update({
    where: { tulisan_id: article.tulisan_id },
    data: { tulisan_views: { increment: 1 } }
  }).catch(console.error);

  const relatedArticles = await prisma.tbl_tulisan.findMany({
    where: { 
      tulisan_id: { not: article.tulisan_id },
      tulisan_kategori_id: article.tulisan_kategori_id 
    },
    take: 3,
    orderBy: { tulisan_tanggal: "desc" }
  }).then(res => res.length > 0 ? res : prisma.tbl_tulisan.findMany({
    where: { tulisan_id: { not: article.tulisan_id } },
    take: 3,
    orderBy: { tulisan_tanggal: "desc" }
  }));

  // Create paragraphs and fix non-breaking spaces from copy-pasting MS Word
  // &nbsp; makes the browser treat the whole paragraph as one long word, causing overflow.
  const content = (article.tulisan_isi || "").replace(/&nbsp;/g, ' ');

  return (

    <>
      {/* Article Header */}
      <section
        style={{
          paddingTop: "130px",
          paddingBottom: "80px",
          background: "linear-gradient(135deg, #041C3F 0%, #11418B 60%, #1a5cb8 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 70% 40%, rgba(232,164,0,0.08) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "13px" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
            <Link href="/artikel" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "13px" }}>Blog</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
            <span style={{ color: "#E8A400", fontSize: "13px" }}>{article.tulisan_kategori_nama || "Artikel"}</span>
          </div>

          <span className="badge-genbi" style={{ marginBottom: "16px", display: "inline-block" }}>
            {article.tulisan_kategori_nama || "Artikel"}
          </span>

          <h1
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              fontWeight: "900",
              color: "white",
              marginBottom: "20px",
              lineHeight: "1.25",
              fontFamily: "'Lora', serif",
            }}
          >
            {article.tulisan_judul}
          </h1>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: "rgba(232,164,0,0.2)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                <Pen size={16} />
              </div>
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>{article.tulisan_author || "Admin GenBI"}</span>
            </div>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
              <Calendar size={14} /> {article.tulisan_tanggal ? format(new Date(article.tulisan_tanggal), "dd MMMM yyyy", { locale: id }) : ""}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.6)", fontSize: "14px" }}><Eye size={14} /> {article.tulisan_views || 0} kali dibaca</span>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section style={{ padding: "60px 24px 100px", background: "#f8fafc" }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: "48px",
            alignItems: "start",
          }}
          className="article-layout"
        >
          {/* Main Content */}
          <div>
            {/* Featured image */}
            {article.tulisan_gambar ? (
              <div
                style={{
                  borderRadius: "16px",
                  height: "400px",
                  width: "100%",
                  position: "relative",
                  marginBottom: "40px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <Image
                  src={getStorageUrl(article.tulisan_gambar) || ''}
                  alt={article.tulisan_judul || ""}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  sizes="(max-width: 900px) 100vw, 860px"
                />
              </div>
            ) : (
              <div
                style={{
                  background: `linear-gradient(135deg, #041C3F, #11418B)`,
                  borderRadius: "16px",
                  height: "320px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "80px",
                  marginBottom: "40px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                }}
              >
                <Newspaper size={40} color="white" />
              </div>
            )}

            <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "40px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  border: "1px solid #e2e8f0",
                  overflow: "hidden",
                  minWidth: 0,
                }}
              >
                <div
                  className="article-content"
                  style={{
                    color: "#475569",
                    lineHeight: "1.9",
                    fontSize: "16px",
                    fontFamily: "'Lora', serif",
                    overflowX: "hidden",
                    overflowWrap: "anywhere",
                    wordBreak: "normal",
                    hyphens: "none",
                    WebkitHyphens: "none" as any,
                    maxWidth: "100%",
                  }}
                  dangerouslySetInnerHTML={{ __html: content }}
                />

              {/* Share */}
              <hr style={{ borderColor: "#e2e8f0", margin: "32px 0" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <span style={{ color: "#64748b", fontSize: "14px", fontWeight: "600" }}>
                  Bagikan:
                </span>
                {["Facebook", "Twitter", "WhatsApp"].map((s) => (
                  <button
                    suppressHydrationWarning
                    key={s}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      background: "white",
                      color: "#64748b",
                      fontSize: "13px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Back button */}
            <div style={{ marginTop: "32px" }}>
              <Link
                href="/artikel"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#11418B",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                <ArrowLeft size={16} /> Kembali ke Blog
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "28px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                border: "1px solid #e2e8f0",
                marginBottom: "24px",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#041C3F",
                  marginBottom: "20px",
                  paddingBottom: "12px",
                  borderBottom: "2px solid #E8A400",
                }}
              >
                Artikel Terkait
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.tulisan_slug}
                    href={`/artikel/${rel.tulisan_slug}`}
                    style={{
                      display: "flex",
                      gap: "12px",
                      textDecoration: "none",
                      padding: "12px",
                      borderRadius: "10px",
                      transition: "background 0.2s ease",
                    }}
                  >
                    {rel.tulisan_gambar ? (
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          position: "relative",
                          borderRadius: "8px",
                          overflow: "hidden",
                          flexShrink: 0
                        }}
                      >
                         <Image
                            src={getStorageUrl(rel.tulisan_gambar) || ''}
                            alt={rel.tulisan_judul || ""}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          background: "linear-gradient(135deg, #041C3F, #11418B)",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "22px",
                          flexShrink: 0,
                        }}
                      >
                        <Newspaper size={24} color="white" />
                      </div>
                    )}
                    <div>
                      <p
                        style={{
                          color: "#1e293b",
                          fontSize: "13px",
                          fontWeight: "600",
                          lineHeight: "1.4",
                          marginBottom: "4px",
                        }}
                      >
                        {rel.tulisan_judul}
                      </p>
                      <p style={{ color: "#94a3b8", fontSize: "11px" }}>
                        {rel.tulisan_tanggal ? format(new Date(rel.tulisan_tanggal), "dd MMM yyyy", { locale: id }) : ""}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #041C3F, #11418B)",
                borderRadius: "16px",
                padding: "28px",
                color: "white",
                textAlign: "center",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}><Inbox size={40} color="#E8A400" strokeWidth={1.5} /></div>
              <h3 style={{ fontWeight: "700", marginBottom: "8px" }}>Ikuti Update Kami</h3>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", marginBottom: "16px", lineHeight: "1.6" }}>
                Dapatkan artikel terbaru langsung ke email Anda.
              </p>
              <Link
                href="/contact"
                style={{
                  display: "block",
                  background: "#E8A400",
                  color: "#041C3F",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "700",
                  fontSize: "13px",
                }}
              >
                Hubungi Kami
              </Link>
            </div>
          </aside>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .article-layout {
              grid-template-columns: 1fr !important;
            }
          }
          /* Fix HTML content overflow from Quill editor */
          .article-content {
            overflow: hidden;
            overflow-x: hidden;
          }
          .article-content * {
            max-width: 100% !important;
            word-break: normal !important;
            overflow-wrap: break-word !important;
            hyphens: none !important;
            -webkit-hyphens: none !important;
            box-sizing: border-box !important;
          }
          .article-content p {
            margin-bottom: 1.5em;
            word-break: normal !important;
            overflow-wrap: break-word !important;
            hyphens: none !important;
          }
          .article-content span,
          .article-content strong,
          .article-content em {
            white-space: normal !important;
          }
          .article-content img {
            max-width: 100% !important;
            width: auto !important;
            height: auto !important;
            border-radius: 8px;
            margin: 20px auto;
            display: block;
          }
          .article-content table {
            width: 100% !important;
            border-collapse: collapse;
            overflow-x: auto;
            display: block;
          }
          .article-content iframe,
          .article-content video,
          .article-content embed {
            max-width: 100% !important;
          }
          .article-content pre,
          .article-content code {
            white-space: pre-wrap;
            word-break: normal;
            overflow-wrap: break-word;
            overflow-x: auto;
          }
          /* article layout image fix */
          .article-layout img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 20px 0;
          }
        `}</style>
      </section>
    </>
  );
}

