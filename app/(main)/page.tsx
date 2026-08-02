import Link from "next/link";
import StatsCounter from "@/components/StatsCounter";
import StatItem from "@/components/StatItem";
import HeroSlider from "@/components/HeroSlider";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import { Landmark, Users, BookOpen, Trophy, Megaphone, Building2, Sparkles, MapPin, Clock } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch actual data from database
  // Fetch actual data from database sequentially to avoid connection/thread pool limits
  const komisariatCount = await prisma.tbl_kelas.count();
  const anggotaCount = await prisma.tbl_siswa.count();
  const karyaCount = await prisma.tbl_files.count();
  const latestNews = await prisma.tbl_tulisan.findMany({
    take: 4,
    orderBy: { tulisan_tanggal: "desc" },
  });
  
  let upcomingAgenda = await prisma.tbl_agenda.findMany({
    take: 3,
    where: {
      agenda_mulai: { gte: new Date() }
    },
    orderBy: { agenda_mulai: "asc" },
  });
  
  if (upcomingAgenda.length === 0) {
    upcomingAgenda = await prisma.tbl_agenda.findMany({ take: 3, orderBy: { agenda_mulai: "desc" } });
  }

  const stats = [
    { value: komisariatCount.toString(), label: "Komisariat", icon: <Landmark size={40} color="#041C3F" /> },
    { value: anggotaCount.toString() + "+", label: "Anggota Aktif", icon: <Users size={40} color="#041C3F" /> },
    { value: karyaCount.toString() + "+", label: "Karya Tulis", icon: <BookOpen size={40} color="#041C3F" /> },
    { value: "30+", label: "Prestasi", icon: <Trophy size={40} color="#041C3F" /> },
  ];

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #041C3F 0%, #11418B 55%, #1a5cb8 100%)",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          paddingTop: "70px",
        }}
      >
        {/* Animated background blobs */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {[
            { top: "10%", left: "5%", size: 350, color: "rgba(26,92,184,0.25)" },
            { top: "60%", right: "5%", size: 400, color: "rgba(232,164,0,0.1)" },
            { top: "30%", right: "30%", size: 200, color: "rgba(255,255,255,0.04)" },
          ].map((blob, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: blob.top,
                left: (blob as any).left,
                right: (blob as any).right,
                width: blob.size,
                height: blob.size,
                background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
                borderRadius: "50%",
                animation: `float ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "80px 24px",
            width: "100%",
            position: "relative",
            zIndex: 2,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "center",
          }}
          className="hero-grid"
        >
          <div className="animate-fadeInLeft">
            <div style={{ marginBottom: "32px", display: "flex", justifyContent: "center" }}>
              <Image 
                src="/theme/images/logo_genbi_tegal.png" 
                alt="GenBI Tegal Logo" 
                width={360} 
                height={360} 
                style={{ 
                  width: "auto", 
                  height: "260px", 
                  objectFit: "contain",
                  filter: "drop-shadow(0px 2px 12px rgba(255, 255, 255, 0.85))"
                }}
                priority
              />
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(232,164,0,0.15)",
                border: "1px solid rgba(232,164,0,0.3)",
                borderRadius: "20px",
                padding: "6px 16px",
                fontSize: "13px",
                color: "#E8A400",
                fontWeight: "600",
                marginBottom: "20px",
                letterSpacing: "0.5px",
              }}
            >
              <Building2 size={16} style={{ marginRight: "4px" }} /> Penerima Beasiswa Bank Indonesia
            </span>



            <p
              style={{
                color: "rgba(255,255,255,0.78)",
                fontSize: "1.1rem",
                lineHeight: "1.8",
                marginBottom: "36px",
                maxWidth: "480px",
              }}
            >
              Kami hadir sebagai komunitas mahasiswa terpilih se-Eks Karesidenan
              Pekalongan yang berkomitmen menjadi{" "}
              <strong style={{ color: "#E8A400" }}>Energi Untuk Negeri</strong>.
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Link href="/about" className="btn-primary-genbi">
                Tentang Kami →
              </Link>
              <Link href="/artikel" className="btn-outline-genbi" style={{ color: "white", borderColor: "rgba(255,255,255,0.4)" }}>
                Baca Blog
              </Link>
            </div>
          </div>

          {/* Right: Card */}
          <div className="animate-fadeInRight" style={{ position: "relative" }}>
            {/* Floating card */}
            <div
              style={{
                background: "rgba(255,255,255,0.95)",
                borderRadius: "20px",
                padding: "28px",
                boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
                animation: "float 4s ease-in-out infinite",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      fontStyle: "italic",
                    }}
                  >
                    Generasi Baru Indonesia
                  </p>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      color: "#041C3F",
                    }}
                  >
                    GenBI Tegal
                  </h3>
                </div>
                <Image
                  src="/assets/images/logogenbi.png"
                  alt="GenBI Logo"
                  width={36}
                  height={36}
                  style={{ objectFit: "contain" }}
                />
              </div>

              {/* Hero Banner Image Slider */}
              <HeroSlider />

              {/* Stats inside card */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                {[
                  { icon: <Landmark size={24} color="#E8A400" />, val: komisariatCount.toString(), label: "Komisariat" },
                  { icon: <Users size={24} color="#E8A400" />, val: anggotaCount.toString() + "+", label: "Anggota" },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                      borderRadius: "10px",
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "20px", marginBottom: "4px" }}>
                      {s.icon}
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "800",
                        color: "#11418B",
                      }}
                    >
                      {s.val}
                    </div>
                    <div
                      style={{ fontSize: "11px", color: "#64748b" }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                background: "linear-gradient(135deg, #E8A400, #f59e0b)",
                borderRadius: "12px",
                padding: "12px 16px",
                color: "#041C3F",
                fontWeight: "800",
                fontSize: "13px",
                boxShadow: "0 8px 24px rgba(232,164,0,0.4)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><Sparkles size={16} /> Est. 2019</div>
            </div>
          </div>
        </div>

      </section>

      {/* ===== STATS SECTION ===== */}
      <ScrollReveal direction="up" delay={0.2}>
        <StatsCounter>
          {stats.map((stat, i) => (
            <StatItem key={stat.label} icon={stat.icon} value={stat.value} label={stat.label} />
          ))}
        </StatsCounter>
      </ScrollReveal>

      {/* ===== ABOUT SNIPPET ===== */}
      <section style={{ padding: "100px 24px", background: "#f8fafc" }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "center",
          }}
          className="two-col-grid"
        >
          <ScrollReveal direction="right">
            <div>
              <span className="badge-genbi" style={{ marginBottom: "16px", display: "inline-block" }}>
                Tentang Kami
              </span>
              <h2
                style={{
                  fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                  fontWeight: "800",
                  color: "#041C3F",
                  marginBottom: "20px",
                  lineHeight: 1.2,
                }}
              >
                Siapa{" "}
                <span className="text-gradient">GenBI Tegal?</span>
              </h2>
              <p
                style={{
                  color: "#475569",
                  lineHeight: "1.8",
                  fontSize: "1rem",
                  marginBottom: "20px",
                }}
              >
                Generasi Baru Indonesia Tegal adalah komunitas mahasiswa terpilih
                se-Eks Karesidenan Pekalongan yang menerima beasiswa Bank
                Indonesia. Kami berasal dari beragam disiplin ilmu dan diyakini
                akan menjadi energi baru bagi bangsa.
              </p>
              <p
                style={{
                  color: "#475569",
                  lineHeight: "1.8",
                  fontSize: "1rem",
                  marginBottom: "32px",
                }}
              >
                GenBI Tegal berkolaborasi dengan Bank Indonesia untuk
                menyelenggarakan kegiatan sosial, edukasi, dan pemberdayaan
                masyarakat di wilayah Eks Karesidenan Pekalongan.
              </p>
              <Link href="/about" className="btn-primary-genbi">
                Pelajari Lebih Lanjut →
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.2}>
            <div style={{ position: "relative" }}>
              {/* Decorative boxes */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #041C3F 0%, #11418B 100%)",
                  borderRadius: "20px",
                  padding: "40px",
                  color: "white",
                  boxShadow: "0 20px 40px rgba(17,65,139,0.2)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "800",
                    marginBottom: "16px",
                    color: "#E8A400",
                    fontFamily: "'Lora', serif",
                  }}
                >
                  Visi Kami
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    lineHeight: "1.7",
                    fontSize: "14px",
                    marginBottom: "24px",
                  }}
                >
                  Menjadikan GenBI Tegal sebagai garda terdepan generasi muda
                  Indonesia yang unggul dalam prestasi, pelopor inovasi dan kuat
                  dalam kolaborasi untuk berkontribusi nyata membangun peradaban
                  bangsa.
                </p>
  
                <div
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.15)",
                    paddingTop: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    {["Prestasi", "Inovasi", "Kolaborasi", "Integritas"].map(
                      (tag) => (
                        <span
                          key={tag}
                          style={{
                            background: "rgba(232,164,0,0.15)",
                            border: "1px solid rgba(232,164,0,0.3)",
                            color: "#E8A400",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
  
              {/* Floating accent */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "-20px",
                    left: "-20px",
                    background: "#E8A400",
                    borderRadius: "12px",
                    width: "80px",
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 24px rgba(232,164,0,0.4)",
                    overflow: "hidden"
                  }}
                >
                  <Image src="/theme/images/badge-icon.png" alt="Badge" width={50} height={50} style={{ objectFit: "contain" }} />
                </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== LATEST NEWS ===== */}
      <section style={{ padding: "100px 24px", background: "white" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <ScrollReveal direction="up">
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <span
                className="badge-genbi"
                style={{ marginBottom: "16px", display: "inline-block" }}
              >
                Berita Terbaru
              </span>
              <h2
                className="section-title"
                style={{
                  fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                  fontWeight: "800",
                  color: "#041C3F",
                }}
              >
                Blog & Artikel
              </h2>
            </div>
          </ScrollReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "28px",
              marginBottom: "48px",
            }}
          >
            {latestNews.map((news, i) => (
              <ScrollReveal key={news.tulisan_id} direction="up" delay={i * 0.1}>
                <article
                  className="card-hover"
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%"
                  }}
                >
                  {/* Image placeholder or real image */}
                  {news.tulisan_gambar ? (
                    <div style={{ position: "relative", height: "180px" }}>
                      <Image
                        src={`/assets/images/${news.tulisan_gambar}`}
                        alt={news.tulisan_judul || ""}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        height: "180px",
                        background: `linear-gradient(135deg, ${
                          ["#041C3F", "#11418B", "#0a2a5e", "#1a3a6e"][i % 4]
                        } 0%, ${["#11418B", "#1a5cb8", "#11418B", "#11418B"][i % 4]} 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Megaphone size={48} color="white" />
                    </div>
                  )}
  
                  <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <span className="badge-genbi" style={{ fontSize: "11px" }}>
                        {news.tulisan_kategori_nama || "Artikel"}
                      </span>
                      <span
                        style={{ fontSize: "12px", color: "#94a3b8" }}
                      >
                        {news.tulisan_tanggal ? format(new Date(news.tulisan_tanggal), "dd MMM yyyy", { locale: id }) : ""}
                      </span>
                    </div>
  
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#1e293b",
                        marginBottom: "10px",
                        lineHeight: "1.4",
                      }}
                    >
                      {news.tulisan_judul}
                    </h3>
  
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
                      dangerouslySetInnerHTML={{ __html: (news.tulisan_isi || "").replace(/<[^>]*>?/gm, '').substring(0, 120) + "..." }}
                    />
  
                    <Link
                      href={`/artikel/${news.tulisan_slug}`}
                      style={{
                        color: "#11418B",
                        fontWeight: "600",
                        fontSize: "13px",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "gap 0.2s ease",
                      }}
                    >
                      Baca Selengkapnya →
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/artikel" className="btn-outline-genbi">
              Lihat Semua Artikel
            </Link>
          </div>
        </div>
      </section>

      {/* ===== AGENDA SECTION ===== */}
      <section
        style={{
          padding: "100px 24px",
          background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.5fr",
              gap: "60px",
              alignItems: "start",
            }}
            className="two-col-grid"
          >
            <ScrollReveal direction="right">
              <div>
                <span
                  className="badge-genbi"
                  style={{ marginBottom: "16px", display: "inline-block" }}
                >
                  Agenda
                </span>
                <h2
                  style={{
                    fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                    fontWeight: "800",
                    color: "#041C3F",
                    marginBottom: "16px",
                    lineHeight: 1.2,
                  }}
                >
                  Kegiatan{" "}
                  <span className="text-gradient">Mendatang</span>
                </h2>
                <p
                  style={{
                    color: "#475569",
                    lineHeight: "1.8",
                    marginBottom: "32px",
                  }}
                >
                  Ikuti berbagai kegiatan produktif yang diselenggarakan GenBI
                  Tegal, mulai dari seminar, workshop, hingga kegiatan sosial di
                  masyarakat.
                </p>
                <Link href="/agenda" className="btn-primary-genbi">
                  Lihat Seluruh Agenda →
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.2}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {upcomingAgenda.map((agenda) => (
                  <div
                    key={agenda.agenda_id}
                    className="card-hover"
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      padding: "24px",
                      display: "flex",
                      gap: "24px",
                      alignItems: "center",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                      border: "1px solid rgba(17,65,139,0.1)",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(232,164,0,0.1)",
                        borderRadius: "12px",
                        minWidth: "80px",
                        height: "80px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#E8A400",
                        border: "1px solid rgba(232,164,0,0.2)",
                      }}
                    >
                      <div style={{ fontSize: "24px", fontWeight: "900", lineHeight: 1 }}>
                        {agenda.agenda_mulai ? format(new Date(agenda.agenda_mulai), "dd") : "00"}
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>
                        {agenda.agenda_mulai ? format(new Date(agenda.agenda_mulai), "MMM", { locale: id }) : "MMM"}
                      </div>
                    </div>
  
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontSize: "18px",
                          fontWeight: "700",
                          color: "#041C3F",
                          marginBottom: "8px",
                        }}
                      >
                        {agenda.agenda_nama}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          color: "#64748b",
                          fontSize: "13px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <MapPin size={14} /> {agenda.agenda_tempat || "TBA"}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Clock size={14} /> {agenda.agenda_waktu || "TBA"}
                        </span>
                      </div>
                    </div>
  
                    <div className="agenda-arrow">
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "#f1f5f9",
                          color: "#11418B",
                          fontSize: "18px",
                        }}
                      >
                        →
                      </span>
                    </div>
                  </div>
                ))}
                
                {upcomingAgenda.length === 0 && (
                  <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                    Belum ada agenda terdekat.
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== CALL TO ACTION ===== */}
      <section
        style={{
          background: "linear-gradient(135deg, #041C3F 0%, #0a2a5e 100%)",
          padding: "80px 24px",
          textAlign: "center",
          color: "white",
        }}
      >
        <ScrollReveal direction="up">
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                fontWeight: "800",
                marginBottom: "20px",
              }}
            >
              Mari Berkolaborasi Bersama Kami
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "1.1rem",
                lineHeight: "1.8",
                marginBottom: "40px",
              }}
            >
              GenBI Tegal senantiasa membuka pintu kolaborasi untuk setiap
              kegiatan yang berdampak positif bagi masyarakat.
            </p>
            <Link href="/contact" className="btn-primary-genbi">
              Hubungi Kami Sekarang
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
