"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  {
    label: "Tentang Kami",
    dropdown: [
      { href: "/about", label: "About", desc: "Visi & misi organisasi" },
      { href: "/komisariat", label: "Komisariat", desc: "Daftar komisariat aktif" },
      { href: "/anggota", label: "Anggota", desc: "Direktori anggota GenBI" },
    ],
  },
  {
    label: "Publikasi",
    dropdown: [
      { href: "/artikel", label: "Blog", desc: "Artikel & opini terbaru" },
      { href: "/download", label: "Karya Tulis", desc: "Download karya ilmiah" },
      { href: "/galeri", label: "Gallery", desc: "Dokumentasi kegiatan" },
    ],
  },
  { href: "/contact", label: "Contact" },
  { href: "/agenda", label: "Agenda" },
  { href: "/pengumuman", label: "Pengumuman" },
  { href: "https://data.genbitegal.com/", label: "Data Mahasiswa", external: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const toggleMobileDropdown = (label: string) => {
    setOpenMobileDropdown(openMobileDropdown === label ? null : label);
  };

  const toggleDesktopDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenMobileDropdown(null);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (isSearchOpen) searchRef.current?.focus();
  }, [isSearchOpen]);

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] p-4 md:p-0 transition-all duration-300 pointer-events-none">
        <div 
          ref={navRef} 
          className={`pointer-events-auto w-full px-5 md:px-8 xl:px-12 h-[70px] md:h-[80px] flex items-center justify-between gap-6 transition-all duration-300 rounded-2xl md:rounded-none ${
            scrolled
              ? "bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-200 md:border-slate-100 md:border-t-0 md:border-x-0"
              : "bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] md:shadow-none border border-slate-200 md:border-slate-100/50 md:border-b md:border-t-0 md:border-x-0"
          }`}
        >

          {/* ---- LOGO ---- */}
          <Link href="/" className="flex-shrink-0 flex items-center no-underline">
            <Image
              src="/theme/images/logo_genbi.png"
              alt="GenBI Tegal"
              width={150}
              height={75}
              style={{ width: "auto", height: "50px", objectFit: "contain" }}
              className="md:h-[60px]"
              priority
            />
          </Link>

          {/* ---- DESKTOP NAV ---- */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-center">
            {navLinks.map((link) => {
              const isActive = link.href ? pathname === link.href : false;

              if (link.dropdown) {
                const isDropActive = link.dropdown.some((d) => pathname === d.href);
                return (
                <div
                    key={link.label}
                    className="relative"
                  >
                    <button
                      suppressHydrationWarning
                      onClick={() => toggleDesktopDropdown(link.label)}
                      className={`flex items-center gap-1.5 rounded-xl text-[14.5px] font-semibold transition-all duration-[250ms] focus:outline-none tracking-wide focus-visible:ring-2 focus-visible:ring-[#11418b]/40 px-[10px] py-[6px] select-none ${
                        isDropActive || activeDropdown === link.label
                          ? "text-[#11418b] bg-blue-50"
                          : "text-slate-600 hover:text-[#11418b] hover:bg-blue-50/60"
                      }`}
                    >
                      {link.label}
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === link.label ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Panel */}
                    <div
                      className={`absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2 w-[300px] bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-[250ms] ease-out origin-top ${
                        activeDropdown === link.label
                          ? "opacity-100 scale-100 pointer-events-auto translate-y-0"
                          : "opacity-0 scale-95 pointer-events-none -translate-y-[8px]"
                      }`}
                      style={{ boxShadow: "0 12px 32px rgba(15,23,42,.10), 0 4px 12px rgba(15,23,42,.06)" }}
                    >
                      {/* Arrow tip */}
                      <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-slate-100/80 rotate-45" />

                      <div className="p-2">
                        {link.dropdown.map((drop, idx) => {
                          const isDropItemActive = pathname === drop.href;
                          return (
                            <Link
                              key={drop.href}
                              href={drop.href}
                              className={`group/item flex items-start gap-4 px-4 py-[14px] rounded-[10px] no-underline transition-all duration-[250ms] ease-out ${
                                isDropItemActive
                                  ? "bg-[#11418b] text-white"
                                  : "text-slate-700 hover:bg-blue-50 hover:translate-x-1"
                              } ${idx < link.dropdown.length - 1 ? "mb-0.5" : ""}`}
                            >
                              {/* Icon circle */}
                              <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-[15px] font-bold transition-all duration-[250ms] ${
                                isDropItemActive ? "bg-white/20 text-white" : "bg-[#11418b]/10 text-[#11418b]"
                              }`}>
                                {drop.label.charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                <span className={`text-[17px] font-semibold leading-tight ${
                                  isDropItemActive ? "text-white" : "text-slate-800 group-hover/item:text-[#11418b]"
                                }`}>{drop.label}</span>
                                <span className={`text-[14px] mt-1.5 leading-[1.5] ${
                                  isDropItemActive ? "text-white/75" : "text-[#64748b]"
                                }`}>{drop.desc}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              if (link.external) {
                return (
                  <a
                    key={link.href}
                    href={link.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: '6px 10px' }}
                    className="rounded-xl text-[14.5px] font-semibold transition-all duration-[250ms] no-underline tracking-wide focus-visible:ring-2 focus-visible:ring-[#11418b]/40 text-slate-600 hover:text-[#11418b] hover:bg-blue-50/60 flex items-center gap-1"
                  >
                    {link.label}
                    <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href!}
                  style={{ padding: '6px 10px' }}
                  className={`rounded-xl text-[14.5px] font-semibold transition-all duration-[250ms] no-underline tracking-wide focus-visible:ring-2 focus-visible:ring-[#11418b]/40 ${
                    isActive
                      ? "text-[#11418b] bg-blue-50"
                      : "text-slate-600 hover:text-[#11418b] hover:bg-blue-50/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* ---- DESKTOP RIGHT: Search ---- */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0 ml-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                }
              }}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 focus-within:bg-white rounded-full pl-4 pr-1.5 py-1.5 border border-slate-200 focus-within:border-[#11418b]/30 focus-within:ring-2 focus-within:ring-[#11418b]/10 w-[240px] transition-all duration-[250ms]"
            >
              <input
                suppressHydrationWarning
                type="text"
                placeholder="Cari sesuatu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-slate-700 placeholder-slate-400 outline-none border-none text-[13.5px] w-full"
              />
              <button
                suppressHydrationWarning
                type="submit"
                className="p-1.5 bg-[#11418b] text-white rounded-full hover:bg-[#0d3470] transition-colors flex-shrink-0"
                aria-label="Cari"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="px-6 py-2.5 bg-[#11418b] hover:bg-[#0d3470] text-white text-[14px] font-semibold rounded-xl no-underline transition-all duration-[250ms] shadow-[0_2px_8px_rgba(17,65,139,0.3)] hover:shadow-[0_4px_16px_rgba(17,65,139,0.4)] hover:-translate-y-0.5"
            >
              Hubungi Kami
            </Link>
          </div>

          {/* ---- MOBILE HAMBURGER ---- */}
          <button
              suppressHydrationWarning
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-[10px] rounded-[12px] bg-[#11418b] text-white hover:bg-[#0d3470] transition-all duration-[250ms] focus:outline-none shadow-[0_4px_12px_rgba(17,65,139,0.25)] active:scale-95"
            aria-label="Toggle Menu"
          >
            <div className="relative w-[20px] h-[16px]">
              <span className={`absolute left-0 w-full h-[2.5px] bg-white rounded-full transition-all duration-[300ms] ease-out origin-center ${isOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2.5px] bg-white rounded-full transition-all duration-[200ms] ease-out ${isOpen ? "opacity-0 scale-x-0" : "opacity-100"}`} />
              <span className={`absolute left-0 w-full h-[2.5px] bg-white rounded-full transition-all duration-[300ms] ease-out origin-center ${isOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* ===== MOBILE DRAWER ===== */}
      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 top-[102px] z-[998] transition-all duration-300 ${
          isOpen ? "bg-black/40 backdrop-blur-sm pointer-events-auto" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`md:hidden fixed top-[102px] right-0 bottom-0 w-[85vw] max-w-[340px] z-[999] bg-white shadow-[-8px_0_40px_rgba(0,0,0,0.15)] rounded-tl-3xl transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                setIsOpen(false);
              }
            }}
            className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200"
          >
            <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              suppressHydrationWarning
              type="text"
              placeholder="Cari sesuatu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-slate-700 placeholder-slate-400 outline-none border-none text-[14px]"
            />
          </form>
        </div>

        {/* Drawer Links */}
        <div className="px-4 py-4">
          {navLinks.map((item) => {
            const isActive = item.href ? pathname === item.href : false;

            if (item.dropdown) {
              const isDropdownOpen = openMobileDropdown === item.label;
              const isAnyDropActive = item.dropdown.some((d) => pathname === d.href);

              return (
                <div key={item.label}>
                  <button
              suppressHydrationWarning
                    onClick={() => toggleMobileDropdown(item.label)}
                    className={`w-full flex items-center justify-between px-4 py-4 rounded-xl mb-1 text-[15px] font-semibold transition-all ${
                      isAnyDropActive
                        ? "text-[#11418b] bg-blue-50"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-[#11418b]" : "text-slate-400"}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isDropdownOpen ? "max-h-[300px] mb-2" : "max-h-0"}`}>
                    <div className="ml-4 pl-4 border-l-2 border-slate-100 flex flex-col gap-0.5">
                      {item.dropdown.map((drop) => {
                        const isDropActive = pathname === drop.href;
                        return (
                          <Link
                            key={drop.href}
                            href={drop.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex flex-col px-3 py-3 rounded-lg no-underline transition-all ${
                              isDropActive
                                ? "text-[#11418b] bg-blue-50"
                                : "text-slate-600 hover:bg-slate-50 hover:text-[#11418b]"
                            }`}
                          >
                            <span className="text-[14px] font-semibold">{drop.label}</span>
                            <span className="text-[11px] text-slate-400">{drop.desc}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            if (item.external) {
              return (
                <a
                  key={item.href}
                  href={item.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-4 rounded-xl mb-1 text-[15px] font-semibold no-underline transition-all text-slate-700 hover:bg-slate-50 hover:text-[#11418b]"
                >
                  {item.label}
                  <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-4 rounded-xl mb-1 text-[15px] font-semibold no-underline transition-all ${
                  isActive
                    ? "text-[#11418b] bg-blue-50"
                    : "text-slate-700 hover:bg-slate-50 hover:text-[#11418b]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Mobile CTA */}
          <div className="mt-6 px-1">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#11418b] hover:bg-[#0d3470] text-white text-[14px] font-semibold rounded-xl no-underline transition-all shadow-[0_2px_8px_rgba(17,65,139,0.3)]"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
