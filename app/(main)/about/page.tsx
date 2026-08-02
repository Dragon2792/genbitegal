import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Trophy, Lightbulb, Users, ShieldCheck, Target, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Tentang GenBI Tegal - Generasi Baru Indonesia Tegal, komunitas penerima beasiswa Bank Indonesia.",
};

const misi = [
  "Mengembangkan potensi anggota GenBI Tegal melalui program pelatihan, kompetisi, dan pengembangan kapasitas diri untuk mencetak generasi muda unggul di bidang akademik dan non-akademik.",
  "Menciptakan inovasi untuk mendorong anggota GenBI Tegal dalam mengembangkan ide kreatif melalui program kerja yang memberikan manfaat bagi mahasiswa, masyarakat, dan generasi muda Indonesia.",
  "Membangun kolaborasi dalam mengimplementasikan program pengabdian masyarakat dan menjadi agen perubahan yang memberikan dampak positif nyata bagi pembangunan bangsa.",
];

const values = [
  { icon: <Trophy size={48} color="#041C3F" />, title: "Prestasi", desc: "Unggul dalam akademik dan non-akademik di tingkat regional, nasional, dan internasional." },
  { icon: <Lightbulb size={48} color="#041C3F" />, title: "Inovasi", desc: "Mendorong ide-ide kreatif yang memberikan solusi nyata bagi masyarakat." },
  { icon: <Users size={48} color="#041C3F" />, title: "Kolaborasi", desc: "Membangun sinergi antar komisariat dan mitra strategis untuk dampak lebih besar." },
  { icon: <ShieldCheck size={48} color="#041C3F" />, title: "Integritas", desc: "Menjunjung tinggi kejujuran dan tanggung jawab dalam setiap tindakan." },
];

const komisariat = [
  { name: "Universitas Pancasakti Tegal", short: "UPS", logo: "/assets/images/logo-ups.png" },
  { name: "Universitas Pekalongan", short: "UNIKAL", logo: "/assets/images/logo-unikal.png" },
  { name: "UIN KH. Abdurrahman Wahid Pekalongan", short: "UIN GUSDUR", logo: "/assets/images/logo-uingusdur.jpg" },
  { name: "IAI Bakti Negara Tegal", short: "IBN", logo: "/assets/images/logo-ibn.png" },
];

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
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
              "radial-gradient(circle at 20% 50%, rgba(232,164,0,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(26,92,184,0.3) 0%, transparent 40%)",
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
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
            <span style={{ color: "#E8A400", fontSize: "14px", fontWeight: "600" }}>About</span>
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
            Tentang <span style={{ color: "#E8A400" }}>GenBI Tegal</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "1.1rem", maxWidth: "600px", lineHeight: "1.7" }}>
            Mengenal lebih dekat komunitas penerima beasiswa Bank Indonesia yang berkomitmen menjadi energi untuk negeri.
          </p>
        </div>
      </section>

      {/* Welcome Section */}
      <section style={{ padding: "100px 24px", background: "#fff" }}>
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
          <div>
            <span className="badge-genbi" style={{ marginBottom: "16px", display: "inline-block" }}>Selamat Datang</span>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                fontWeight: "800",
                color: "#041C3F",
                marginBottom: "20px",
                lineHeight: 1.2,
              }}
            >
              Generasi Baru Indonesia <span className="text-gradient">Tegal</span>
            </h2>
            <p style={{ color: "#475569", lineHeight: "1.8", marginBottom: "16px" }}>
              Generasi Baru Indonesia Tegal ialah sebuah komunitas yang terdiri dari mahasiswa-mahasiswa
              terpilih Se-Eks Karesidenan Pekalongan yang berasal dari beragam latar disiplin ilmu dan
              keahlian, yang diyakini akan menjadi energi baru yang mampu memberikan kontribusi bagi
              bangsa dan negara.
            </p>
            <p style={{ color: "#475569", lineHeight: "1.8" }}>
              GenBI Tegal berkolaborasi dengan Bank Indonesia, turut aktif menyelenggarakan kegiatan sosial
              kemasyarakatan. Dengan program kerja yang produktif, harapannya GenBI Tegal bisa lebih
              bermanfaat untuk masyarakat Indonesia khususnya di Eks Karesidenan Pekalongan.
            </p>
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #f0f4ff, #e8f0fe)",
              borderRadius: "20px",
              padding: "48px",
              textAlign: "center",
              border: "1px solid #dbeafe",
            }}
          >
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
              <Image src="/assets/images/logogenbi.png" alt="GenBI Tegal Logo" width={100} height={100} style={{ objectFit: "contain" }} />
            </div>
            <h3 style={{ fontSize: "1.8rem", fontWeight: "900", color: "#041C3F", marginBottom: "8px", fontFamily: "'Lora', serif" }}>
              GenBI Tegal
            </h3>
            <p style={{ color: "#64748b", fontSize: "14px" }}>Est. 2019</p>
            <hr className="divider-gradient" style={{ margin: "20px 0" }} />
            <div style={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" }}>
              {[{ val: "5", label: "Komisariat" }, { val: "150+", label: "Anggota" }].map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", fontWeight: "900", color: "#11418B" }}>{s.val}</div>
                  <div style={{ fontSize: "13px", color: "#64748b" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 768px) { .two-col-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
      </section>

      {/* Visi & Misi */}
      <section style={{ padding: "100px 24px", background: "linear-gradient(135deg, #041C3F 0%, #11418B 100%)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: "800", color: "white" }}>
              Visi & Misi Kami
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }} className="two-col-grid">
            {/* Visi */}
            <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "20px", padding: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #E8A400, #f59e0b)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Eye size={24} color="white" />
                </div>
                <h3 style={{ color: "#E8A400", fontWeight: "800", fontSize: "1.4rem" }}>Visi</h3>
              </div>
              <blockquote style={{ color: "rgba(255,255,255,0.88)", lineHeight: "1.8", fontSize: "15px", borderLeft: "3px solid #E8A400", paddingLeft: "16px", margin: 0, fontStyle: "italic" }}>
                Menjadikan GenBI Tegal sebagai garda terdepan generasi muda Indonesia yang unggul dalam
                prestasi, pelopor inovasi dan kuat dalam kolaborasi untuk berkontribusi nyata membangun
                peradaban bangsa.
              </blockquote>
            </div>
            {/* Misi */}
            <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "20px", padding: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #E8A400, #f59e0b)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Target size={24} color="white" />
                </div>
                <h3 style={{ color: "#E8A400", fontWeight: "800", fontSize: "1.4rem" }}>Misi</h3>
              </div>
              <ol style={{ color: "rgba(255,255,255,0.85)", lineHeight: "1.8", paddingLeft: "20px" }}>
                {misi.map((m, i) => (
                  <li key={i} style={{ marginBottom: "14px", fontSize: "14px" }}>{m}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "100px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 className="section-title" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: "800", color: "#041C3F" }}>
              Pilar Utama GenBI Tegal
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
            {values.map((v) => (
              <div key={v.title} className="card-hover" style={{ background: "white", borderRadius: "16px", padding: "32px 24px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>{v.icon}</div>
                <h3 style={{ color: "#041C3F", fontWeight: "800", fontSize: "1.1rem", marginBottom: "10px" }}>{v.title}</h3>
                <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.6" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Komisariat */}
      <section style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 className="section-title" style={{ fontSize: "2rem", fontWeight: "800", color: "#041C3F" }}>
              Komisariat GenBI Tegal
            </h2>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
            {komisariat.map((k) => (
              <div key={k.short} className="card-hover" style={{ background: "linear-gradient(135deg, #f0f4ff, #e8f0fe)", border: "1px solid #dbeafe", borderRadius: "14px", padding: "24px 28px", textAlign: "center", minWidth: "180px", flex: "1", maxWidth: "220px" }}>
                <div style={{ marginBottom: "16px", display: "flex", justifyContent: "center" }}>
                  <div style={{ width: "100px", height: "100px", position: "relative" }}>
                    <Image src={k.logo} alt={k.short} fill style={{ objectFit: "contain" }} sizes="100px" />
                  </div>
                </div>
                <div style={{ fontWeight: "800", color: "#11418B", fontSize: "15px", marginBottom: "6px" }}>{k.short}</div>
                <div style={{ color: "#64748b", fontSize: "12px", lineHeight: "1.4" }}>{k.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
