import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import { Newspaper, Calendar, Pen } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Blog & Artikel",
  description: "Baca artikel terbaru dari GenBI Tegal tentang kegiatan, prestasi, dan program kerja.",
};

export const dynamic = "force-dynamic";

export default async function ArtikelPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const limit = 9;
  const skip = (currentPage - 1) * limit;
  const categoryFilter = typeof searchParams?.category === 'string' ? searchParams.category : "Semua";
  const searchQuery = typeof searchParams?.search === 'string' ? searchParams.search : "";

  // Fetch categories
  const categories = await prisma.tbl_kategori.findMany();
  const categoryNames = ["Semua", ...categories.map((c) => c.kategori_nama || "")].filter(Boolean);

  // Fetch articles
  const whereClause: any = {};
  if (categoryFilter !== "Semua") {
    whereClause.tulisan_kategori_nama = categoryFilter;
  }
  if (searchQuery) {
    whereClause.tulisan_judul = { contains: searchQuery };
  }
  
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
            <span style={{ color: "#E8A400", fontSize: "14px", fontWeight: "600" }}>Blog</span>
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
            Blog & <span style={{ color: "#E8A400" }}>Artikel</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "1.1rem", maxWidth: "500px", lineHeight: "1.7" }}>
            Cerita, prestasi, dan pemikiran dari komunitas GenBI Tegal.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid #e2e8f0",
          position: "sticky",
          top: "70px",
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "16px 24px",
          }}
        >
          <form method="GET" action="/artikel" style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            {categoryFilter !== "Semua" && <input
              suppressHydrationWarning type="hidden" name="category" value={categoryFilter} />}
            <input
              suppressHydrationWarning 
              type="text" 
              name="search"
              defaultValue={searchQuery}
              placeholder="Cari judul artikel..." 
              style={{ flex: 1, padding: "12px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "15px" }}
            />
            <button
                    suppressHydrationWarning type="submit" style={{ padding: "0 24px", background: "#11418B", color: "white", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "14px", transition: "background 0.2s" }} className="hover:bg-blue-900">
              Cari
            </button>
          </form>

          <div
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
            }}
          >
            {categoryNames.map((cat, i) => (
              <Link
                key={cat}
                href={`/artikel?category=${cat}${searchQuery ? `&search=${searchQuery}` : ''}`}
                style={{
                  padding: "8px 20px",
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: categoryFilter === cat ? "#11418B" : "#e2e8f0",
                  background: categoryFilter === cat ? "#11418B" : "transparent",
                  color: categoryFilter === cat ? "white" : "#64748b",
                  fontWeight: categoryFilter === cat ? "600" : "400",
                  fontSize: "13px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  textDecoration: "none"
                }}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <section style={{ padding: "60px 24px", background: "#f8fafc", minHeight: "50vh" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "28px",
            }}
          >
            {articles.map((art, i) => (
              <ScrollReveal key={art.tulisan_id} direction="up" delay={i * 0.1}>
                <article
                  className="card-hover"
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  {art.tulisan_gambar ? (
                    <div style={{ position: "relative", height: "200px" }}>
                      <Image
                        src={`/assets/images/${art.tulisan_gambar}`}
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
              </ScrollReveal>
            ))}
          </div>

          {articles.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#64748b" }}>
              Belum ada artikel di kategori ini.
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
                  href={`/artikel?category=${categoryFilter}&page=${page}${searchQuery ? `&search=${searchQuery}` : ''}`}
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
