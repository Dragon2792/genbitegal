import { getStorageUrl } from "@/lib/storageUrl";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import { Newspaper, Calendar, Pen, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Hasil Pencarian",
  description: "Hasil pencarian artikel dan informasi dari GenBI Tegal.",
};

export const dynamic = "force-dynamic";

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const limit = 9;
  const skip = (currentPage - 1) * limit;
  const searchQuery = typeof searchParams?.q === 'string' ? searchParams.q : "";

  // If no search query, return empty state early
  if (!searchQuery) {
    return (
      <div style={{ paddingTop: "150px", paddingBottom: "100px", textAlign: "center", minHeight: "60vh" }}>
        <h1 style={{ fontSize: "2rem", color: "#041C3F", marginBottom: "16px" }}>Masukkan Kata Kunci</h1>
        <p style={{ color: "#64748b", marginBottom: "24px" }}>Silakan ketikkan sesuatu di kotak pencarian untuk mulai mencari.</p>
        <Link href="/" className="btn-primary-genbi">Kembali ke Beranda</Link>
      </div>
    );
  }

  // Fetch articles based on query
  const whereClause: any = {
    OR: [
      { tulisan_judul: { contains: searchQuery } },
      { tulisan_isi: { contains: searchQuery } }
    ]
  };
  
  const [articles, totalArticles] = await Promise.all([
    prisma.tbl_tulisan.findMany({
      where: whereClause,
      orderBy: { tulisan_tanggal: "desc" },
      skip,
      take: limit,
    }),
    prisma.tbl_tulisan.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(totalArticles / limit);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 30% 60%, rgba(232,164,0,0.1) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
            <span style={{ color: "#E8A400", fontSize: "14px", fontWeight: "600" }}>Pencarian</span>
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: "900",
              color: "white",
              marginBottom: "16px",
              fontFamily: "'Lora', serif",
            }}
          >
            Hasil <span style={{ color: "#E8A400" }}>Pencarian</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "1.1rem", maxWidth: "600px", lineHeight: "1.7", display: "flex", alignItems: "center", gap: "8px" }}>
            <Search size={18} /> Menampilkan hasil untuk: <strong>"{searchQuery}"</strong>
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section style={{ padding: "60px 24px", background: "#f8fafc", minHeight: "50vh" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          
          <div style={{ marginBottom: "32px", fontSize: "1.1rem", color: "#475569" }}>
            Ditemukan <strong>{totalArticles}</strong> hasil pencarian
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "28px",
            }}
          >
            {articles.map((art, i) => (
              <article
                key={art.tulisan_id}
                className="card-hover"
                style={{
                  background: "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {art.tulisan_gambar ? (
                  <div style={{ position: "relative", height: "200px" }}>
                    <Image
                      src={getStorageUrl(art.tulisan_gambar) || ''}
                      alt={art.tulisan_judul || ""}
                      width={500}
                      height={300}
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        zIndex: 10
                      }}
                    >
                      <span className="badge-genbi" style={{ fontSize: "11px", background: "rgba(255,255,255,0.9)", color: "#11418B", fontWeight: "700", padding: "4px 12px", borderRadius: "20px" }}>
                        {art.tulisan_kategori_nama || "Artikel"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      height: "200px",
                      background: `linear-gradient(135deg, ${[
                        "#041C3F", "#11418B", "#0a2a5e", "#1a3a6e", "#041C3F", "#0d3570"
                      ][i % 6]}, ${["#11418B", "#1a5cb8", "#11418B", "#11418B", "#1a5cb8", "#11418B"][i % 6]})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Newspaper size={60} color="rgba(255,255,255,0.9)" />
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                      }}
                    >
                      <span className="badge-genbi" style={{ fontSize: "11px", background: "rgba(255,255,255,0.9)", color: "#11418B", fontWeight: "700", padding: "4px 12px", borderRadius: "20px" }}>
                        {art.tulisan_kategori_nama || "Artikel"}
                      </span>
                    </div>
                  </div>
                )}

                <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      marginBottom: "12px",
                      fontSize: "12px",
                      color: "#94a3b8",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Calendar size={14} /> {art.tulisan_tanggal ? format(new Date(art.tulisan_tanggal), "dd MMM yyyy", { locale: id }) : ""}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Pen size={14} /> {art.tulisan_author || "Admin"}</span>
                  </div>

                  <Link href={`/artikel/${art.tulisan_slug}`} style={{ textDecoration: "none" }}>
                    <h2
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#1e293b",
                        marginBottom: "10px",
                        lineHeight: "1.4",
                        transition: "color 0.2s ease",
                      }}
                      className="hover:text-blue-800"
                    >
                      {art.tulisan_judul}
                    </h2>
                  </Link>

                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                      lineHeight: "1.6",
                      marginBottom: "20px",
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical"
                    }}
                    dangerouslySetInnerHTML={{ __html: (art.tulisan_isi || "").replace(/<[^>]*>?/gm, '').substring(0, 150) + "..." }}
                  />

                  <Link
                    href={`/artikel/${art.tulisan_slug}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "white",
                      background: "linear-gradient(135deg, #11418B, #1a5cb8)",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: "600",
                      transition: "all 0.2s ease",
                      alignSelf: "flex-start",
                    }}
                  >
                    Baca Selengkapnya →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {articles.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#64748b", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Search size={64} color="#cbd5e1" style={{ marginBottom: "16px" }} />
              <h3 style={{ fontSize: "1.5rem", color: "#041C3F", marginBottom: "8px" }}>Tidak ada hasil ditemukan</h3>
              <p>Maaf, kami tidak dapat menemukan artikel yang sesuai dengan "{searchQuery}". Coba kata kunci yang lain.</p>
              <Link href="/artikel" className="btn-outline-genbi" style={{ marginTop: "24px" }}>Jelajahi Semua Artikel</Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                marginTop: "60px",
              }}
            >
              {pageNumbers.map((page) => (
                <Link
                  key={page}
                  href={`/search?q=${searchQuery}&page=${page}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: page === currentPage ? "#11418B" : "#e2e8f0",
                    background: page === currentPage ? "#11418B" : "white",
                    color: page === currentPage ? "white" : "#64748b",
                    fontWeight: page === currentPage ? "700" : "400",
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "all 0.2s ease",
                  }}
                >
                  {page}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
