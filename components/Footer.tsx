"use client";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Phone } from "lucide-react";


const footerLinks = [
  {
    title: "Menu Utama",
    links: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/artikel", label: "Blog" },
      { href: "/galeri", label: "Gallery" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Link Terkait",
    links: [
      { href: "https://www.bi.go.id/", label: "Bank Indonesia" },
      { href: "https://www.uingusdur.ac.id/", label: "UIN KH. Abdurrahman Wahid Pekalongan" },
      { href: "https://upstegal.ac.id/", label: "Universitas Pancasakti Tegal" },
      { href: "https://unikal.ac.id/", label: "Universitas Pekalongan" },
      { href: "https://uibntegal.ac.id/", label: "Universitas Islam Bakti Negara Tegal" },
    ],
  },
];

const socialLinks = [
  {
    href: "https://open.spotify.com/show/7wMbKKR9nFoyT0aKkkQc72?si=6dd928d348ed484f",
    icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.621.539.3.719 1.02.419 1.56-.299.54-1.02.72-1.559.42z"/></svg>,
    label: "Spotify",
    color: "#1DB954",
  },
  {
    href: "https://www.instagram.com/genbi_tegal/",
    icon: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
    label: "Instagram",
    color: "#e1306c",
  },
  {
    href: "https://www.youtube.com/channel/UCKXvZT2yMsCWCyDJxWxeF7A",
    icon: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2.5 7.1 2.3 5.3 3.1 4.5 4.1 3.5 5.3 3.5 5.8 3.4 10.3 3 12 3 12 3s1.7 0 6.2.4c.6.1 1.7.1 2.7 1.1.8.8 1 2.6 1 2.6s.2 2.1.2 4.2v2.4c0 2.1-.2 4.2-.2 4.2s-.2 1.8-1 2.6c-1 1-2.3 1-2.9 1.1-3.6.4-6.3.4-6.3.4s-1.7 0-6.2-.4c-.6-.1-1.7-.1-2.7-1.1-.8-.8-1-2.6-1-2.6S2 15 2 12.9V10.5c0-2.1.2-4.2.2-4.2z"></path><polygon points="9.8 15 15.8 12 9.8 9 9.8 15"></polygon></svg>,
    label: "YouTube",
    color: "#ff0000",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #020f22 0%, #041C3F 50%, #0a2a5e 100%)",
        color: "white",
        paddingTop: "60px",
        paddingBottom: "0",
        marginTop: "80px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "40px",
            paddingBottom: "48px",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <Image 
                src="/theme/images/icon_genbi.png" 
                alt="GenBI Tegal Logo" 
                width={48}
                height={48}
                style={{ objectFit: "contain" }} 
              />
              <div>
                <div
                  style={{
                    fontWeight: "800",
                    fontSize: "20px",
                    fontFamily: "'Lora', serif",
                    color: "white",
                  }}
                >
                  GenBI Tegal
                </div>
                <div
                  style={{
                    color: "#E8A400",
                    fontSize: "10px",
                    letterSpacing: "1px",
                    fontWeight: "500",
                  }}
                >
                  ENERGI UNTUK NEGERI
                </div>
              </div>
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "14px",
                lineHeight: "1.7",
                marginBottom: "20px",
              }}
            >
              Generasi Baru Indonesia Tegal — komunitas penerima beasiswa Bank
              Indonesia yang berkomitmen menjadi agen perubahan bagi bangsa dan
              negara.
            </p>

            {/* Contact Info */}
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "2" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}><MapPin size={16} style={{ flexShrink: 0, marginTop: "4px" }} /> <span>Jl. Dr. Soetomo No.55, Kota Tegal, Jawa Tengah</span></div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}><Mail size={16} /> <span>genbitegal@gmail.com</span></div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}><Phone size={16} /> <span>0895422831777</span></div>
            </div>
          </div>

          {/* Nav Columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h3
                style={{
                  color: "white",
                  fontWeight: "700",
                  fontSize: "16px",
                  marginBottom: "16px",
                  paddingBottom: "10px",
                  borderBottom: "2px solid #E8A400",
                  display: "inline-block",
                }}
              >
                {col.title}
              </h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {col.links.map((link) => (
                  <li key={link.label} style={{ marginBottom: "10px" }}>
                    <Link
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      style={{
                        color: "rgba(255,255,255,0.65)",
                        textDecoration: "none",
                        fontSize: "14px",
                        transition: "color 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color = "#E8A400")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.65)")
                      }
                    >
                      <span style={{ color: "#E8A400", fontSize: "10px" }}>▶</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social */}
          <div>
            <h3
              style={{
                color: "white",
                fontWeight: "700",
                fontSize: "16px",
                marginBottom: "16px",
                paddingBottom: "10px",
                borderBottom: "2px solid #E8A400",
                display: "inline-block",
              }}
            >
              Ikuti Kami
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{
                    width: "42px",
                    height: "42px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    textDecoration: "none",
                    fontSize: "12px",
                    fontWeight: "700",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = social.color;
                    el.style.border = `1px solid ${social.color}`;
                    el.style.transform = "translateY(-3px)";
                    el.style.boxShadow = `0 8px 20px ${social.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(255,255,255,0.08)";
                    el.style.border = "1px solid rgba(255,255,255,0.12)";
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "none";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: "1.6" }}>
              Ikuti media sosial kami untuk update terbaru kegiatan GenBI Tegal.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "20px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px" }}>
            {year} © GenBI Tegal. Hak cipta dilindungi.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "rgba(255,255,255,0.45)",
              fontSize: "13px",
            }}
          >
            <span>Dikembangkan oleh</span>
            <a
              href="https://genbitegal.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#E8A400", textDecoration: "none", fontWeight: "600" }}
            >
              Kominfo GenBI Tegal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
