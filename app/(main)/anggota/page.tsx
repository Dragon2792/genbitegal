import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import AnggotaFilter from "@/components/AnggotaFilter";
import { Search } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export const dynamic = "force-dynamic";

export default async function AnggotaPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams?.search === 'string' ? searchParams.search : "";
  const filter = typeof searchParams?.komisariat === 'string' ? searchParams.komisariat : "Semua";

  // Fetch data
  const [kelas, siswaList] = await Promise.all([
    prisma.tbl_kelas.findMany(),
    prisma.tbl_siswa.findMany({ orderBy: { siswa_id: "desc" } })
  ]);

  const kelasMap = kelas.reduce((acc, curr) => {
    acc[curr.kelas_id] = curr.kelas_nama || "Unknown";
    return acc;
  }, {} as Record<number, string>);

  const komisariatList = ["Semua", ...kelas.map(k => k.kelas_nama).filter(Boolean) as string[]];

  const anggota = siswaList.map(s => ({
    id: s.siswa_id,
    name: s.siswa_nama || "Tanpa Nama",
    nis: s.siswa_nis || "-",
    jenkel: s.siswa_jenkel === "L" ? "Laki-laki" : s.siswa_jenkel === "P" ? "Perempuan" : "-",
    komisariat: s.siswa_kelas_id ? kelasMap[s.siswa_kelas_id] : "Unknown",
    photo: s.siswa_photo
  }));

  const filtered = anggota.filter((a) =>
    (filter === "Semua" || a.komisariat === filter) &&
    (a.name.toLowerCase().includes(search.toLowerCase()) || a.nis.toLowerCase().includes(search.toLowerCase()))
  );

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
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 40% 60%, rgba(232,164,0,0.08) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
            <span style={{ color: "#E8A400", fontSize: "14px", fontWeight: "600" }}>Anggota</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: "900", color: "white", marginBottom: "16px", fontFamily: "'Lora', serif" }}>
            Daftar <span style={{ color: "#E8A400" }}>Anggota</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "1.1rem", maxWidth: "500px", lineHeight: "1.7" }}>
            Kenali para generasi muda terbaik yang menjadi anggota GenBI Tegal.
          </p>
        </div>
      </section>

      {/* Filter & Search */}
      <AnggotaFilter komisariatList={komisariatList} initialSearch={search} initialFilter={filter} />
      
      <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "10px 24px" }}>
         <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "flex-end" }}>
           <span style={{ fontSize: "13px", color: "#94a3b8", whiteSpace: "nowrap" }}>
              Menampilkan {filtered.length} anggota
            </span>
         </div>
      </div>

      {/* Members Grid */}
      <section style={{ padding: "60px 24px 100px", background: "#f8fafc", minHeight: "50vh" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
            {filtered.map((member, i) => (
              <ScrollReveal key={member.id} direction="up" delay={i * 0.05}>
                <div
                  className="card-hover"
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "28px 20px",
                    textAlign: "center",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                    border: "1px solid #e2e8f0",
                    height: "100%",
                  }}
                >
                  {/* Avatar */}
                  {member.photo ? (
                    <div
                      style={{
                        width: "72px",
                        height: "72px",
                        position: "relative",
                        borderRadius: "50%",
                        margin: "0 auto 16px",
                        boxShadow: "0 4px 16px rgba(17,65,139,0.25)",
                        overflow: "hidden"
                      }}
                    >
                      <Image
                        src={`/assets/images/${member.photo}`}
                        alt={member.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: "72px",
                        height: "72px",
                        position: "relative",
                        borderRadius: "50%",
                        margin: "0 auto 16px",
                        background: "linear-gradient(135deg, #f0f4ff, #e8f0fe)",
                        overflow: "hidden"
                      }}
                    >
                      <Image
                        src={member.jenkel === "Laki-laki" ? "/theme/images/student-1.png" : "/theme/images/student-2.png"}
                        alt={member.name}
                        fill
                        style={{ objectFit: "cover", padding: "10px" }}
                      />
                    </div>
                  )}
  
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>
                    {member.name}
                  </h3>
                  <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "12px" }}>
                    NIS: {member.nis}
                  </p>
  
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
                    <span
                      style={{
                        background: "rgba(17,65,139,0.08)",
                        color: "#11418B",
                        padding: "3px 10px",
                        borderRadius: "10px",
                        fontSize: "11px",
                        fontWeight: "600",
                      }}
                    >
                      {member.komisariat}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 24px", color: "#64748b" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <Search size={64} color="#94a3b8" strokeWidth={1.5} />
              </div>
              <p style={{ fontSize: "16px" }}>Tidak ada anggota yang sesuai pencarian.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
