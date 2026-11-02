import { getStorageUrl } from "@/lib/storageUrl";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { User, ShieldCheck, Megaphone, Wallet, GraduationCap, Building } from "lucide-react";
import { getAllPengurus, type Pengurus } from "@/lib/pengurus";

export const metadata: Metadata = {
  title: "Struktur Kepengurusan | GenBI Tegal",
  description: "Struktur Kepengurusan Generasi Baru Indonesia Wilayah Tegal.",
};

// Data diambil dari database; selalu render terbaru setelah admin mengubah
export const dynamic = "force-dynamic";

const DEFAULT_AVATAR = "/assets/images/dummy-avatar.jpg";
const foto = (p?: Pengurus | null) => (p?.pengurus_foto ? getStorageUrl(p.pengurus_foto) : DEFAULT_AVATAR);

const divisiIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("komunikasi")) return Megaphone;
  if (t.includes("keuangan")) return Wallet;
  if (t.includes("sdm")) return GraduationCap;
  return Building;
};

// Reusable card component for organizational roles
const OrgCard = ({ title, name, icon: Icon, image, colorClass = "bg-[#f0f4ff] border-[#dbeafe] text-[#11418b]" }: any) => (
  <div className={`p-7 rounded-2xl border-2 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-all duration-300 card-hover ${colorClass}`}>
    {image ? (
      <div className="w-40 h-40 md:w-44 md:h-44 rounded-full border-4 border-white shadow-lg mb-5 overflow-hidden relative">
        <Image src={image} alt={name} fill style={{ objectFit: "cover" }} />
      </div>
    ) : (
      <div className="w-36 h-36 rounded-2xl bg-white flex items-center justify-center mb-5 shadow-sm">
        <Icon size={52} className="text-[#11418b]" />
      </div>
    )}
    <h3 className="font-bold text-[15px] md:text-[16px] mb-2 uppercase tracking-widest text-[#041C3F]">{title}</h3>
    <p className="text-slate-700 font-semibold text-[16px] md:text-[17px] whitespace-pre-line leading-relaxed">{name}</p>
  </div>
);

export default async function StrukturPage() {
  const all = await getAllPengurus();
  const presiden = all.find((p) => p.pengurus_kelompok === "presiden");
  const dewan = all.filter((p) => p.pengurus_kelompok === "dewan");
  const komisariatData = all
    .filter((p) => p.pengurus_kelompok === "komisariat")
    .map((p) => ({ role: p.pengurus_jabatan || "", name: p.pengurus_nama || "", image: foto(p) }));

  const kementrianMembers = all.filter((p) => p.pengurus_kelompok === "kementrian");
  const divisiList = Array.from(new Set(kementrianMembers.map((p) => p.pengurus_divisi || "Kementrian")));
  const kementrianData = divisiList.map((title) => {
    const members = kementrianMembers.filter((p) => (p.pengurus_divisi || "Kementrian") === title);
    const mentri = members.find((p) => p.pengurus_is_ketua === 1);
    return {
      title,
      icon: divisiIcon(title),
      mentri: { name: mentri?.pengurus_nama || "-", image: mentri ? foto(mentri) : DEFAULT_AVATAR },
      staf: members
        .filter((p) => p !== mentri)
        .map((p) => ({ role: p.pengurus_jabatan || "", name: p.pengurus_nama || "", image: foto(p) })),
    };
  });

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
            textAlign: "center"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
            <span style={{ color: "#E8A400", fontSize: "14px", fontWeight: "600" }}>Struktur Kepengurusan</span>
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: "900",
              color: "white",
              marginBottom: "16px",
              fontFamily: "'Lora', serif",
            }}
          >
            Struktur <span style={{ color: "#E8A400" }}>Kepengurusan</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto", lineHeight: "1.7" }}>
            Susunan kepengurusan Generasi Baru Indonesia Wilayah Tegal
          </p>
        </div>
      </section>

      <section style={{ padding: "80px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* Top Level: Presiden & Dewan Pengawas */}
          <div className="flex flex-col items-center mb-16 relative">
            {presiden && (
            <div className="w-full max-w-[340px] mx-auto z-10 relative">
              <ScrollReveal direction="up">
                <OrgCard title={presiden.pengurus_jabatan || "Presiden GenBI Tegal"} name={presiden.pengurus_nama} image={foto(presiden)} icon={User} colorClass="bg-white border-[#E8A400] shadow-[0_8px_30px_rgba(232,164,0,0.15)]" />
              </ScrollReveal>
            </div>
            )}
            
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block w-0.5 h-12 bg-slate-300 my-0"></div>

            <div className="w-full max-w-[940px] mx-auto px-2 md:px-4 z-10 relative mt-8 md:mt-0">
              <ScrollReveal direction="up" delay={0.2}>
                <div className="flex flex-col md:flex-row justify-center gap-6">
                  {dewan.map((d) => (
                    <div key={d.pengurus_id} className="w-full md:w-[300px]">
                      <OrgCard title={d.pengurus_jabatan || "Dewan Pengawas"} name={d.pengurus_nama} image={foto(d)} icon={ShieldCheck} colorClass="bg-white border-slate-300 shadow-md" />
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>

          <div className="hidden md:block w-full h-0.5 bg-slate-300 max-w-[800px] mx-auto mb-8 relative">
            {/* Vertical connector to the horizontal line */}
            <div className="absolute top-[-32px] left-1/2 w-0.5 h-8 bg-slate-300 -translate-x-1/2"></div>
            {/* 3 vertical drop downs for kementrian */}
            <div className="absolute top-0 left-[16.66%] w-0.5 h-8 bg-slate-300"></div>
            <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-slate-300 -translate-x-1/2"></div>
            <div className="absolute top-0 right-[16.66%] w-0.5 h-8 bg-slate-300"></div>
          </div>

          {/* Kementrian Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-20 relative pt-4 md:pt-0">
            {kementrianData.map((kementrian, idx) => (
              <ScrollReveal key={kementrian.title} direction="up" delay={idx * 0.2}>
                <div className="flex flex-col h-full bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100">
                  <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-slate-100">
                    {kementrian.mentri.image ? (
                      <div className="w-36 h-36 rounded-full border-4 border-[#f0f4ff] overflow-hidden relative flex-shrink-0 shadow-md mb-4">
                        <Image src={kementrian.mentri.image} alt={kementrian.mentri.name} fill style={{ objectFit: "cover" }} />
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-2xl bg-[#f0f4ff] flex items-center justify-center flex-shrink-0 mb-4">
                        <kementrian.icon size={42} className="text-[#11418b]" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-extrabold text-[#041C3F] text-lg uppercase tracking-wide">{kementrian.title}</h3>
                      <p className="text-slate-500 text-sm mt-1">Mentri: <span className="font-bold text-[#11418b] text-[15px]">{kementrian.mentri.name}</span></p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 flex-1">
                    {kementrian.staf.map((staf, sIdx) => (
                      <div key={sIdx} className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4 border border-slate-100 hover:border-[#11418b]/30 transition-colors">
                        {staf.image ? (
                          <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden relative flex-shrink-0 border-2 border-white shadow-md">
                            <Image src={staf.image} alt={staf.name} fill style={{ objectFit: "cover" }} />
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-[#11418b]/10 flex items-center justify-center flex-shrink-0 text-[#11418b]">
                            <User size={34} />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-[#11418b] uppercase tracking-wider mb-1">{staf.role}</span>
                          <span className="text-slate-800 font-semibold text-[15px] whitespace-pre-line leading-relaxed">{staf.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Komisariat Section */}
          <div className="mt-24">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#041C3F] mb-4 relative inline-block">
                Ketua Komisariat
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#E8A400] rounded-full"></div>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {komisariatData.map((komisariat, idx) => (
                <ScrollReveal key={`${komisariat.role}-${idx}`} direction="up" delay={idx * 0.1}>
                  <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center">
                    {komisariat.image ? (
                      <div className="w-36 h-36 rounded-full border-4 border-[#f0f4ff] shadow-md mb-4 overflow-hidden relative">
                        <Image src={komisariat.image} alt={komisariat.name} fill style={{ objectFit: "cover" }} />
                      </div>
                    ) : (
                      <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <Building size={32} className="text-[#64748b]" />
                      </div>
                    )}
                    <h4 className="text-[15px] font-bold text-[#041C3F] uppercase tracking-wider mb-2">{komisariat.role}</h4>
                    <p className="text-[#11418b] font-semibold text-[16px]">{komisariat.name}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
          
        </div>
      </section>
    </>
  );
}
