import { getStorageUrl } from "@/lib/storageUrl";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { User, Camera, Globe } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Komisariat - GenBI Tegal",
  description: "Daftar komisariat Generasi Baru Indonesia Tegal di berbagai perguruan tinggi.",
};

export default async function KomisariatPage() {
  const komisariatList = await (prisma as any).tbl_komisariat.findMany({
    orderBy: { komisariat_urutan: "asc" },
  });

  return (
    <>
      {/* Header Section */}
      <section
        style={{
          paddingTop: "130px",
          paddingBottom: "80px",
          background: "linear-gradient(135deg, #041C3F 0%, #11418b 100%)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: "url('/assets/images/pattern.png')", backgroundSize: "cover" }}></div>
        <div className="container relative z-10 text-center">
          <ScrollReveal direction="down">
            <h1 className="text-white font-bold" style={{ fontSize: "3.5rem", marginBottom: "20px", textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
              Komisariat GenBI <span style={{ color: "#E8A400" }}>Tegal</span>
            </h1>
            <p className="text-white" style={{ fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto", opacity: 0.9 }}>
              Mengenal lebih dekat perwakilan Generasi Baru Indonesia di berbagai universitas dan institut di Tegal dan sekitarnya.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Komisariat List Section */}
      <section style={{ padding: "100px 0", background: "#f8fafc" }}>
        <div className="container">
          <div className="space-y-16">
            {komisariatList.map((item: any, index: number) => (
              <ScrollReveal key={item.komisariat_id} direction={index % 2 === 0 ? "left" : "right"}>
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row">
                    {/* Left Side - Identity */}
                    <div className="lg:w-1/3 bg-[#041C3F] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)", backgroundSize: "20px 20px" }}></div>
                      
                      <div className="w-28 h-28 bg-white rounded-full p-2 mb-6 relative z-10 shadow-lg transform group-hover:scale-105 transition-transform duration-500">
                        <div className="w-full h-full relative rounded-full overflow-hidden">
                          <Image
                            src={getStorageUrl(item.komisariat_logo || "default.jpg") || ""}
                            alt={`Logo ${item.komisariat_short}`}
                            fill
                            style={{ objectFit: "contain" }}
                            className="p-2"
                          />
                        </div>
                      </div>
                      <h3 className="text-white text-3xl font-bold mb-2 relative z-10">{item.komisariat_short}</h3>
                      <div className="inline-block px-4 py-1 border border-[#E8A400] text-[#E8A400] rounded-full text-sm font-medium relative z-10">
                        Komisariat
                      </div>
                    </div>

                    {/* Right Side - Info */}
                    <div className="lg:w-2/3 p-8 lg:p-10">
                      <h4 className="text-2xl font-bold text-[#041C3F] mb-4">{item.komisariat_nama}</h4>
                      
                      {item.komisariat_ketua && (
                        <div className="flex items-center gap-2 mb-6">
                          <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium">
                            <User size={16} />
                            {item.komisariat_ketua} (Ketua Komisariat)
                          </div>
                        </div>
                      )}

                      <p className="text-gray-600 leading-relaxed mb-8">
                        {item.komisariat_desc}
                      </p>

                      <div className="grid grid-cols-3 gap-6 mb-8 bg-gray-50 p-6 rounded-2xl">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[#041C3F] mb-1">{item.komisariat_members || "0"}</div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Anggota</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[#11418b] mb-1">{item.komisariat_proker || "0"}</div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Program Kerja</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[#E8A400] mb-1">{item.komisariat_awards || "0"}</div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Penghargaan</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        {item.komisariat_ig && (
                          <Link href={`https://instagram.com/${item.komisariat_ig.replace('@', '')}`} target="_blank" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors border border-gray-200 px-4 py-2 rounded-xl hover:border-blue-200 hover:bg-blue-50">
                            <Camera size={16} />
                            {item.komisariat_ig}
                          </Link>
                        )}
                        {item.komisariat_web && (
                          <Link href={item.komisariat_web.startsWith('http') ? item.komisariat_web : `https://${item.komisariat_web}`} target="_blank" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors border border-gray-200 px-4 py-2 rounded-xl hover:border-blue-200 hover:bg-blue-50">
                            <Globe size={16} />
                            Website
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
            {komisariatList.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                Data komisariat belum tersedia.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
