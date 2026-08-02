import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { User, Camera, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Komisariat - GenBI Tegal",
  description: "Daftar komisariat Generasi Baru Indonesia Tegal di berbagai perguruan tinggi.",
};

const komisariatData = [
  {
    name: "Universitas Pancasakti Tegal",
    short: "UPS",
    logo: "/assets/images/8b9758201bcbd888894c0c9a6c21fdb3.png",
    ketua: "Ardyan Muhammad Ramadhan",
    desc: "GenBI Komisariat UPS aktif dalam kegiatan pelestarian lingkungan dan pendidikan. Berlokasi di kampus pusat Tegal, komisariat ini telah menyelenggarakan berbagai seminar nasional dan pengabdian masyarakat.",
    stats: { members: "45+", proker: "12", awards: "3" },
    social: { ig: "@genbi_ups", web: "upstegal.ac.id" },
  },
  {
    name: "Universitas Pekalongan",
    short: "UNIKAL",
    logo: "/assets/images/1a8ddb5eefe3a5e39d1eb3f36694adbe.jpg",
    ketua: "Muhammad Fazri",
    desc: "Berbasis di Kota Pekalongan, GenBI Komisariat UNIKAL memfokuskan program kerjanya pada pemberdayaan UMKM lokal dan literasi keuangan digital bagi masyarakat pesisir.",
    stats: { members: "38+", proker: "15", awards: "5" },
    social: { ig: "@genbi_unikal", web: "unikal.ac.id" },
  },
  {
    name: "UIN KH. Abdurrahman Wahid Pekalongan",
    short: "UIN GUSDUR",
    logo: "/assets/images/logo-uingusdur.jpg",
    ketua: "Dimas Adi Pangestu",
    desc: "Komisariat yang unggul dalam integrasi nilai-nilai keislaman dengan literasi kebanksentralan. Aktif melakukan sosialisasi QRIS di lingkungan pondok pesantren.",
    stats: { members: "50+", proker: "18", awards: "4" },
    social: { ig: "@genbi_uingusdur", web: "uingusdur.ac.id" },
  },
  {
    name: "IAI Bakti Negara Tegal",
    short: "IBN",
    logo: "/assets/images/logo-ibn.png",
    ketua: "Yanuar Eko Bahari",
    desc: "GenBI IBN menitikberatkan pada pengembangan ekonomi kreatif mahasiswa dan pendampingan sertifikasi halal bagi pelaku usaha mikro di Kabupaten Tegal.",
    stats: { members: "30+", proker: "10", awards: "2" },
    social: { ig: "@genbi_ibn", web: "ibntegal.ac.id" },
  },

];

export default function KomisariatPage() {
  return (
    <>
      {/* Header Section */}
      <section
        style={{
          paddingTop: "130px",
          paddingBottom: "80px",
          background: "linear-gradient(135deg, #041C3F 0%, #11418B 60%, #1a5cb8 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Patterns */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(232,164,0,0.15) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 40%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            position: "relative",
            zIndex: 2,
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
            <span style={{ color: "#E8A400", fontSize: "14px", fontWeight: "600" }}>Komisariat</span>
          </div>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: "900",
              color: "white",
              marginBottom: "20px",
              fontFamily: "'Lora', serif",
              lineHeight: 1.1,
            }}
          >
            Komisariat <span style={{ color: "#E8A400" }}>GenBI Tegal</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.1rem", maxWidth: "700px", margin: "0 auto", lineHeight: "1.7" }}>
            Kenali lebih dekat jejaring komisariat Generasi Baru Indonesia yang tersebar di perguruan tinggi unggulan se-Eks Karesidenan Pekalongan.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: "80px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px" }}>
          {komisariatData.map((k, index) => (
            <div
              key={k.short}
              className="komisariat-card"
              style={{
                background: "white",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 10px 40px rgba(4, 28, 63, 0.05)",
                display: "grid",
                gridTemplateColumns: index % 2 === 0 ? "350px 1fr" : "1fr 350px",
                border: "1px solid #e2e8f0",
              }}
            >
              {/* Left/Right Visual Area */}
              <div
                style={{
                  background: "linear-gradient(135deg, #041C3F, #11418B)",
                  padding: "40px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  order: index % 2 === 0 ? 1 : 2,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Ccircle cx=\"2\" cy=\"2\" r=\"2\" fill=\"%23ffffff\"/%3E%3C/svg%3E')", backgroundSize: "20px 20px" }}></div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ width: "100px", height: "100px", position: "relative", borderRadius: "50%", overflow: "hidden", background: "#fff", border: "4px solid rgba(255,255,255,0.2)", margin: "0 auto" }}>
                      <Image src={k.logo} alt={k.short} fill style={{ objectFit: "cover" }} sizes="100px" />
                    </div>
                  </div>
                  <h2 style={{ color: "white", fontSize: "2rem", fontWeight: "900", marginBottom: "8px" }}>{k.short}</h2>
                  <div style={{ background: "rgba(232,164,0,0.2)", color: "#E8A400", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", border: "1px solid rgba(232,164,0,0.4)" }}>
                    {k.short === "KORDA" ? "Koordinator" : "Komisariat"}
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div
                style={{
                  padding: "40px 48px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  order: index % 2 === 0 ? 2 : 1,
                }}
              >
                <h3 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#041C3F", marginBottom: "12px", lineHeight: "1.3" }}>
                  {k.name}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f0f4ff", color: "#11418B", padding: "6px 14px", borderRadius: "20px", fontSize: "14px", fontWeight: "600", border: "1px solid #dbeafe" }}>
                    <User size={16} /> {k.ketua} (Ketua Komisariat)
                  </span>
                </div>
                <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.8", marginBottom: "30px" }}>
                  {k.desc}
                </p>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px", padding: "24px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                  <div>
                    <div style={{ fontSize: "24px", fontWeight: "800", color: "#11418B", marginBottom: "4px" }}>{k.stats.members}</div>
                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Anggota</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "24px", fontWeight: "800", color: "#11418B", marginBottom: "4px" }}>{k.stats.proker}</div>
                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Program Kerja</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "24px", fontWeight: "800", color: "#E8A400", marginBottom: "4px" }}>{k.stats.awards}</div>
                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Penghargaan</div>
                  </div>
                </div>

                {/* Social Links */}
                <div style={{ display: "flex", gap: "16px" }}>
                  <Link href={`https://instagram.com/${k.social.ig.replace('@', '')}`} target="_blank"
                    className="btn-outline"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 20px",
                      borderRadius: "12px",
                      border: "1px solid #dbeafe",
                      color: "#11418B",
                      fontSize: "14px",
                      fontWeight: "600",
                      textDecoration: "none",
                      transition: "all 0.2s",
                      background: "white"
                    }}
                  >
                    <Camera size={16} /> {k.social.ig}
                  </Link>
                  <Link href={`https://${k.social.web}`} target="_blank"
                    className="btn-outline"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 20px",
                      borderRadius: "12px",
                      border: "1px solid #dbeafe",
                      color: "#11418B",
                      fontSize: "14px",
                      fontWeight: "600",
                      textDecoration: "none",
                      transition: "all 0.2s",
                      background: "white"
                    }}
                  >
                    <Globe size={16} /> Website
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <style>{`
          .btn-outline:hover { background: #f0f4ff !important; border-color: #11418B !important; }
          @media (max-width: 992px) {
            .komisariat-card { grid-template-columns: 1fr !important; }
            .komisariat-card > div:nth-child(1) { order: 1 !important; padding: 40px 20px !important; }
            .komisariat-card > div:nth-child(2) { order: 2 !important; padding: 30px 24px !important; }
          }
        `}</style>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "80px 24px", background: "white", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", background: "linear-gradient(135deg, #041C3F, #11418B)", borderRadius: "24px", padding: "60px 40px", color: "white", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.1, backgroundImage: "radial-gradient(circle at center, #ffffff 0%, transparent 70%)" }}></div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "16px" }}>Ingin Bergabung dengan GenBI?</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px", marginBottom: "30px", maxWidth: "600px", margin: "0 auto 30px" }}>
              Pendaftaran GenBI dibuka setiap awal tahun melalui seleksi di masing-masing perguruan tinggi. Persiapkan dirimu untuk menjadi energi untuk negeri!
            </p>
            <Link href="/pengumuman" style={{ display: "inline-block", background: "#E8A400", color: "#041C3F", padding: "14px 32px", borderRadius: "12px", fontWeight: "700", textDecoration: "none", fontSize: "15px", boxShadow: "0 4px 15px rgba(232,164,0,0.3)", transition: "all 0.2s" }}>
              Cek Info Pendaftaran
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
