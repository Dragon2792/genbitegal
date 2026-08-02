"use client";
import { useState } from "react";
import Link from "next/link";
import { MapPin, Mail, Phone, Clock, CheckCircle2, Send } from "lucide-react";

import { submitContact } from "./actions";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("subject", form.subject);
    formData.append("message", form.message);

    const result = await submitContact(formData);
    
    setLoading(false);
    if (result.success) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setForm({ name: "", email: "", subject: "", message: "" });
    } else {
      alert(result.error);
    }
  };

  const contactInfo = [
    { icon: <MapPin size={20} />, label: "Alamat", value: "Jl. Dr. Soetomo No.55, Pekauman, Kec. Tegal Bar., Kota Tegal, Jawa Tengah 52112" },
    { icon: <Mail size={20} />, label: "Email", value: "genbitegal@gmail.com" },
    { icon: <Phone size={20} />, label: "Telepon", value: "0895422831777" },
    { icon: <Clock size={20} />, label: "Jam Kerja", value: "Senin - Jumat, 08.00 - 17.00 WIB" },
  ];

  const socialLinks = [
    { 
      icon: <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>, 
      label: "Facebook", href: "https://www.facebook.com/genbitegal.official/", color: "#1877f2" 
    },
    { 
      icon: <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>, 
      label: "Instagram", href: "https://www.instagram.com/genbi_tegal/", color: "#e1306c" 
    },
    { 
      icon: <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>, 
      label: "Twitter", href: "https://twitter.com/genbitegal", color: "#1da1f2" 
    },
    { 
      icon: <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>, 
      label: "YouTube", href: "https://www.youtube.com/channel/UCKXvZT2yMsCWCyDJxWxeF7A", color: "#ff0000" 
    },
  ];

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
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 50% 50%, rgba(232,164,0,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
            <span style={{ color: "#E8A400", fontSize: "14px", fontWeight: "600" }}>Contact</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: "900", color: "white", marginBottom: "16px", fontFamily: "'Lora', serif" }}>
            Hubungi <span style={{ color: "#E8A400" }}>Kami</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "1.1rem", maxWidth: "500px", lineHeight: "1.7" }}>
            Ada pertanyaan, kolaborasi, atau ingin bergabung? Kami siap mendengar Anda.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ padding: "80px 24px 100px", background: "#f8fafc" }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "400px 1fr",
            gap: "48px",
            alignItems: "start",
          }}
          className="contact-grid"
        >
          {/* Left: Info */}
          <div>
            <div
              style={{
                background: "linear-gradient(135deg, #041C3F, #11418B)",
                borderRadius: "20px",
                padding: "36px",
                color: "white",
                marginBottom: "24px",
              }}
            >
              <h2 style={{ fontSize: "1.4rem", fontWeight: "800", marginBottom: "8px" }}>
                Informasi Kontak
              </h2>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", marginBottom: "28px", lineHeight: "1.6" }}>
                Jangan ragu untuk menghubungi kami. Tim kami siap membantu Anda.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {contactInfo.map((info) => (
                  <div key={info.label} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "rgba(232,164,0,0.15)",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        flexShrink: 0,
                      }}
                    >
                      {info.icon}
                    </div>
                    <div>
                      <p style={{ color: "#E8A400", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "3px" }}>
                        {info.label}
                      </p>
                      <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px", lineHeight: "1.5" }}>
                        {info.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", marginTop: "28px", paddingTop: "24px" }}>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", marginBottom: "14px" }}>Ikuti kami di media sosial:</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.label}
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = s.color + "30";
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      }}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "40px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              border: "1px solid #e2e8f0",
            }}
          >
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#041C3F", marginBottom: "8px" }}>
              Kirim Pesan
            </h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "28px" }}>
              Isi formulir di bawah ini dan kami akan membalas dalam 1-2 hari kerja.
            </p>

            {submitted && (
              <div
                style={{
                  background: "#dcfce7",
                  border: "1px solid #bbf7d0",
                  borderRadius: "10px",
                  padding: "14px 18px",
                  marginBottom: "24px",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <CheckCircle2 size={24} color="#15803d" />
                <p style={{ color: "#15803d", fontWeight: "600", fontSize: "14px", margin: 0 }}>
                  Pesan berhasil dikirim! Kami akan segera menghubungi Anda.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                {[
                  { key: "name", label: "Nama Lengkap", placeholder: "Masukkan nama Anda", type: "text" },
                  { key: "email", label: "Email", placeholder: "email@contoh.com", type: "email" },
                ].map((f) => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                      {f.label} <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
              suppressHydrationWarning
                      type={f.type}
                      placeholder={f.placeholder}
                      value={(form as any)[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      required
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "14px",
                        color: "#1e293b",
                        transition: "border-color 0.2s ease",
                        background: "#f8fafc",
                      }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Subjek <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
              suppressHydrationWarning
                  type="text"
                  placeholder="Subjek pesan Anda"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "14px",
                    color: "#1e293b",
                    background: "#f8fafc",
                  }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Pesan <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <textarea
              suppressHydrationWarning
                  rows={5}
                  placeholder="Tuliskan pesan Anda di sini..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "14px",
                    color: "#1e293b",
                    resize: "vertical",
                    background: "#f8fafc",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <button
                    suppressHydrationWarning
                type="submit"
                className="btn-primary-genbi"
                disabled={loading}
                style={{ width: "100%", justifyContent: "center", fontSize: "15px", padding: "14px", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Mengirim..." : <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><Send size={16} /> Kirim Pesan</span>}
              </button>
            </form>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .contact-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>
    </>
  );
}
