import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { User, ShieldCheck, Megaphone, Wallet, GraduationCap, Building } from "lucide-react";

export const metadata: Metadata = {
  title: "Struktur Kepengurusan | GenBI Tegal",
  description: "Struktur Kepengurusan Generasi Baru Indonesia Wilayah Tegal.",
};

// Reusable card component for organizational roles
const OrgCard = ({ title, name, icon: Icon, image, colorClass = "bg-[#f0f4ff] border-[#dbeafe] text-[#11418b]" }: any) => (
  <div className={`p-6 rounded-2xl border-2 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-all duration-300 card-hover ${colorClass}`}>
    {image ? (
      <div className="w-20 h-20 rounded-full border-4 border-white shadow-md mb-4 overflow-hidden relative">
        <Image src={image} alt={name} fill style={{ objectFit: "cover" }} />
      </div>
    ) : (
      <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm">
        <Icon size={28} className="text-[#11418b]" />
      </div>
    )}
    <h3 className="font-bold text-[14px] md:text-[15px] mb-2 uppercase tracking-widest text-[#041C3F]">{title}</h3>
    <p className="text-slate-600 font-medium text-[15px]">{name}</p>
  </div>
);

const kementrianData = [
  {
    title: "Kementrian Komunikasi",
    icon: Megaphone,
    mentri: { name: "[Nama Mentri Komunikasi]", image: "/assets/images/dummy-avatar.jpg" },
    staf: [
      { role: "Staf Ahli Sosmed", name: "[Nama Staf]", image: "/assets/images/dummy-avatar.jpg" },
      { role: "Staf Ahli Podcast", name: "[Nama Staf]", image: "/assets/images/dummy-avatar.jpg" },
      { role: "Staf Ahli Website", name: "[Nama Staf]", image: "/assets/images/dummy-avatar.jpg" },
    ]
  },
  {
    title: "Kementrian Keuangan",
    icon: Wallet,
    mentri: { name: "[Nama Mentri Keuangan]", image: "/assets/images/dummy-avatar.jpg" },
    staf: [
      { role: "Staf Ahli Kesekertariatan", name: "[Nama Staf]", image: "/assets/images/dummy-avatar.jpg" },
      { role: "Staf Ahli Kesekertariatan", name: "[Nama Staf]", image: "/assets/images/dummy-avatar.jpg" },
      { role: "Staf Ahli Kebendaharaan", name: "[Nama Staf]", image: "/assets/images/dummy-avatar.jpg" },
    ]
  },
  {
    title: "Kementrian SDM",
    icon: GraduationCap,
    mentri: { name: "[Nama Mentri SDM]", image: "/assets/images/dummy-avatar.jpg" },
    staf: [
      { role: "Staf Ahli Kesenian", name: "[Nama Staf]", image: "/assets/images/dummy-avatar.jpg" },
      { role: "Staf Ahli Kepenulisan", name: "[Nama Staf]", image: "/assets/images/dummy-avatar.jpg" },
      { role: "Staf Ahli Olahraga", name: "[Nama Staf]", image: "/assets/images/dummy-avatar.jpg" },
    ]
  }
];

const komisariatData = [
  { role: "Komisariat UPS", name: "[Nama Ketua]", image: "/assets/images/dummy-avatar.jpg" },
  { role: "Komisariat UIN", name: "[Nama Ketua]", image: "/assets/images/dummy-avatar.jpg" },
  { role: "Komisariat UNIKAL", name: "[Nama Ketua]", image: "/assets/images/dummy-avatar.jpg" },
  { role: "Komisariat UIBN", name: "[Nama Ketua]", image: "/assets/images/dummy-avatar.jpg" },
];

export default function StrukturPage() {
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
            <ScrollReveal direction="up">
              <div className="w-full max-w-[320px] mx-auto z-10 relative">
                <OrgCard title="Presiden GenBI Tegal" name="[Nama Presiden]" image="/assets/images/dummy-avatar.jpg" icon={User} colorClass="bg-white border-[#E8A400] shadow-[0_8px_30px_rgba(232,164,0,0.15)]" />
              </div>
            </ScrollReveal>
            
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block w-0.5 h-12 bg-slate-300 my-0"></div>

            <ScrollReveal direction="up" delay={0.2}>
              <div className="w-full max-w-[320px] mx-auto z-10 relative mt-8 md:mt-0">
                <OrgCard title="Dewan Pengawas" name="[Nama Pengawas]" image="/assets/images/dummy-avatar.jpg" icon={ShieldCheck} colorClass="bg-white border-slate-300 shadow-md" />
              </div>
            </ScrollReveal>
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
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    {kementrian.mentri.image ? (
                      <div className="w-14 h-14 rounded-full border-2 border-slate-200 overflow-hidden relative flex-shrink-0 shadow-sm">
                        <Image src={kementrian.mentri.image} alt={kementrian.mentri.name} fill style={{ objectFit: "cover" }} />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-[#f0f4ff] flex items-center justify-center flex-shrink-0">
                        <kementrian.icon size={24} className="text-[#11418b]" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-[#041C3F] text-lg uppercase tracking-wide">{kementrian.title}</h3>
                      <p className="text-slate-500 text-sm mt-1">Mentri: <span className="font-semibold text-slate-700">{kementrian.mentri.name}</span></p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 flex-1">
                    {kementrian.staf.map((staf, sIdx) => (
                      <div key={sIdx} className="bg-slate-50 rounded-xl p-3.5 flex items-center gap-3 border border-slate-100 hover:border-[#11418b]/30 transition-colors">
                        {staf.image ? (
                          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden relative flex-shrink-0 border border-slate-300">
                            <Image src={staf.image} alt={staf.name} fill style={{ objectFit: "cover" }} />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#11418b]/10 flex items-center justify-center flex-shrink-0 text-[#11418b]">
                            <User size={16} />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-[12px] font-bold text-[#11418b] uppercase tracking-wider mb-0.5">{staf.role}</span>
                          <span className="text-slate-700 font-medium text-sm">{staf.name}</span>
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
                <ScrollReveal key={komisariat.role} direction="up" delay={idx * 0.1}>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center">
                    {komisariat.image ? (
                      <div className="w-16 h-16 rounded-full border-4 border-slate-100 shadow-sm mb-4 overflow-hidden relative">
                        <Image src={komisariat.image} alt={komisariat.name} fill style={{ objectFit: "cover" }} />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <Building size={20} className="text-[#64748b]" />
                      </div>
                    )}
                    <h4 className="text-[14px] font-bold text-[#041C3F] uppercase tracking-wider mb-2">{komisariat.role}</h4>
                    <p className="text-[#11418b] font-medium">{komisariat.name}</p>
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
