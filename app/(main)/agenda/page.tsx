import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format, isAfter, startOfDay } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import { Calendar, Briefcase, Lightbulb, Mic, CalendarDays, MapPin, Clock } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Agenda",
  description: "Agenda kegiatan GenBI Tegal - Jadwal program dan acara terbaru.",
};

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const agendas = await prisma.tbl_agenda.findMany({
    orderBy: { agenda_mulai: "desc" }
  });

  const today = startOfDay(new Date());

  const upcoming = agendas
    .filter(a => a.agenda_mulai && isAfter(new Date(a.agenda_mulai), today) || (a.agenda_mulai && new Date(a.agenda_mulai).getTime() === today.getTime()))
    .sort((a, b) => new Date(a.agenda_mulai!).getTime() - new Date(b.agenda_mulai!).getTime());
    
  const done = agendas
    .filter(a => a.agenda_mulai && !isAfter(new Date(a.agenda_mulai), today) && new Date(a.agenda_mulai).getTime() !== today.getTime());

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
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 60% 40%, rgba(232,164,0,0.08) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
            <span style={{ color: "#E8A400", fontSize: "14px", fontWeight: "600" }}>Agenda</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: "900", color: "white", marginBottom: "16px", fontFamily: "'Lora', serif" }}>
            Agenda <span style={{ color: "#E8A400" }}>Kegiatan</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "1.1rem", maxWidth: "500px", lineHeight: "1.7" }}>
            Jadwal program dan kegiatan GenBI Tegal — jangan sampai terlewat!
          </p>
        </div>
      </section>

      {/* Upcoming */}
      <section style={{ padding: "80px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #11418B, #1a5cb8)",
                borderRadius: "10px",
                padding: "8px",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <CalendarDays size={20} color="white" />
            </div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#041C3F" }}>Agenda Mendatang</h2>
            <span
              style={{
                background: "#11418B",
                color: "white",
                borderRadius: "20px",
                padding: "4px 12px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              {upcoming.length} kegiatan
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {upcoming.map((agenda, index) => {
              const agendaDate = agenda.agenda_mulai ? new Date(agenda.agenda_mulai) : new Date();
              return (
              <ScrollReveal key={agenda.agenda_id} direction="up" delay={index * 0.1}>
                <div
                  className="card-hover"
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "28px",
                    display: "flex",
                    gap: "24px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    border: "1px solid #e2e8f0",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Date */}
                  <div
                    style={{
                      background: "linear-gradient(135deg, #041C3F, #11418B)",
                      borderRadius: "14px",
                      padding: "16px",
                      textAlign: "center",
                      flexShrink: 0,
                      minWidth: "80px",
                    }}
                  >
                    <div style={{ fontSize: "28px", fontWeight: "900", color: "#E8A400", lineHeight: 1 }}>
                      {format(agendaDate, "dd")}
                    </div>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", fontWeight: "600", textTransform: "uppercase" }}>
                      {format(agendaDate, "MMM", { locale: id })}
                    </div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                      {format(agendaDate, "yyyy")}
                    </div>
                  </div>
  
                  {/* Icon */}
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      background: `rgba(232,164,0,0.15)`,
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {[
                      <Calendar size={28} color="#d97706" key="1" />,
                      <Briefcase size={28} color="#d97706" key="2" />,
                      <Lightbulb size={28} color="#d97706" key="3" />,
                      <Mic size={28} color="#d97706" key="4" />
                    ][index % 4]}
                  </div>
  
                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px", flexWrap: "wrap" }}>
                      <span
                        style={{
                          background: `rgba(232,164,0,0.15)`,
                          color: "#d97706",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: "700",
                        }}
                      >
                        Kegiatan
                      </span>
                      <span
                        style={{
                          background: "#dcfce7",
                          color: "#16a34a",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: "600",
                        }}
                      >
                        ✓ Upcoming
                      </span>
                    </div>
                    <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>
                      {agenda.agenda_nama}
                    </h3>
                    <p style={{ color: "#64748b", fontSize: "13px", lineHeight: "1.6", marginBottom: "12px" }}>
                      {agenda.agenda_deskripsi || agenda.agenda_keterangan}
                    </p>
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#64748b" }}><MapPin size={14} /> {agenda.agenda_tempat || "TBA"}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#64748b" }}><Clock size={14} /> {agenda.agenda_waktu || "TBA"}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )})}
            
            {upcoming.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                Tidak ada agenda mendatang.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Past Agenda */}
      {done.length > 0 && (
      <section style={{ padding: "60px 24px 100px", background: "white" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#475569" }}>Agenda Selesai</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {done.map((agenda, index) => {
              const agendaDate = agenda.agenda_mulai ? new Date(agenda.agenda_mulai) : new Date();
              return (
              <ScrollReveal key={agenda.agenda_id} direction="up" delay={index * 0.1}>
                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    gap: "16px",
                    border: "1px solid #e2e8f0",
                    opacity: 0.75,
                  }}
                >
                  <div
                    style={{
                      background: "#e2e8f0",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ fontSize: "18px", fontWeight: "800", color: "#64748b", lineHeight: 1 }}>{format(agendaDate, "dd")}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase" }}>{format(agendaDate, "MMM", { locale: id })}</div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>{agenda.agenda_nama}</h4>
                    <p style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#94a3b8" }}><MapPin size={12} /> {agenda.agenda_tempat || "TBA"}</p>
                  </div>
                </div>
              </ScrollReveal>
            )})}
          </div>
        </div>
      </section>
      )}
    </>
  );
}
