import { getStorageUrl } from "@/lib/storageUrl";
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Newspaper, Calendar, Camera, 
  GraduationCap, Megaphone, Inbox, LogOut, Tags, 
  Users, FileText, MessageSquare, MessageCircle, ChevronDown, ChevronRight 
} from "lucide-react";

export default function AdminSidebar({ session }: { session: any }) {
  const pathname = usePathname();
  const router = useRouter();

  // State to track open dropdowns
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const menuGroups = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: "Berita",
      icon: <Newspaper size={18} />,
      children: [
        { label: "List Berita", href: "/admin/artikel", icon: <Newspaper size={16} /> },
        { label: "Kategori", href: "/admin/kategori", icon: <Tags size={16} /> },
      ]
    },
    {
      label: "Informasi",
      icon: <Megaphone size={18} />,
      children: [
        { label: "Agenda", href: "/admin/agenda", icon: <Calendar size={16} /> },
        { label: "Pengumuman", href: "/admin/pengumuman", icon: <Megaphone size={16} /> },
      ]
    },
    {
      label: "Galeri & File",
      icon: <Camera size={18} />,
      children: [
        { label: "Album", href: "/admin/album", icon: <Camera size={16} /> },
        { label: "Galeri Foto", href: "/admin/galeri", icon: <Camera size={16} /> },
        { label: "Download", href: "/admin/files", icon: <FileText size={16} /> },
      ]
    },
    {
      label: "Keanggotaan",
      icon: <Users size={18} />,
      children: [
        { label: "Data Anggota", href: "/admin/anggota", icon: <GraduationCap size={16} /> },
        { label: "Pengguna (Admin)", href: "/admin/pengguna", icon: <Users size={16} /> },
      ]
    },
    {
      label: "Interaksi",
      icon: <MessageCircle size={18} />,
      children: [
        { label: "Inbox", href: "/admin/inbox", icon: <Inbox size={16} /> },
        { label: "Komentar", href: "/admin/komentar", icon: <MessageCircle size={16} /> },
        { label: "Testimoni", href: "/admin/testimoni", icon: <MessageSquare size={16} /> },
      ]
    },
  ];

  // Auto-open groups that have active links
  useEffect(() => {
    const newOpenGroups = { ...openGroups };
    menuGroups.forEach((group) => {
      if (group.children) {
        const hasActiveChild = group.children.some(child => pathname.startsWith(child.href));
        if (hasActiveChild) {
          newOpenGroups[group.label] = true;
        }
      }
    });
    setOpenGroups(newOpenGroups);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside style={{
      width: "260px",
      background: "#041C3F",
      color: "white",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      position: "sticky",
      top: 0,
      borderRight: "1px solid rgba(255,255,255,0.1)",
    }}>
      {/* Header / Logo */}
      <div style={{ padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <h1 style={{ fontSize: "18px", fontWeight: "900", color: "white", margin: 0, display: "flex", alignItems: "center", gap: "12px" }}>
            <Image src={getStorageUrl('47068785c61b3f0ada39c664e1e18b11.png') || ''} alt="GenBI Logo" width={36} height={36} style={{ objectFit: "contain" }} />
            <div>
              GenBI <span style={{ color: "#E8A400" }}>Admin</span>
            </div>
          </h1>
        </Link>
      </div>

      {/* Navigation */}
      <div style={{ padding: "24px", flex: 1, overflowY: "auto" }}>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: "600", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "1px" }}>
          Menu Utama
        </p>
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {menuGroups.map((group) => {
            if (group.children) {
              const isOpen = openGroups[group.label];
              const hasActiveChild = group.children.some(child => pathname.startsWith(child.href));

              return (
                <div key={group.label} className="flex flex-col gap-1">
                  <button
              suppressHydrationWarning
                    onClick={() => toggleGroup(group.label)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      color: hasActiveChild || isOpen ? "white" : "rgba(255,255,255,0.7)",
                      background: hasActiveChild && !isOpen ? "rgba(255,255,255,0.1)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: hasActiveChild ? "600" : "500",
                      transition: "all 0.2s",
                      width: "100%",
                      textAlign: "left"
                    }}
                    onMouseEnter={(e) => {
                      if (!hasActiveChild && !isOpen) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      if (!hasActiveChild && !isOpen) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span>{group.icon}</span>
                      {group.label}
                    </div>
                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  
                  {isOpen && (
                    <div style={{ 
                      display: "flex", 
                      flexDirection: "column", 
                      gap: "4px", 
                      paddingLeft: "42px",
                      marginTop: "4px",
                      marginBottom: "4px" 
                    }}>
                      {group.children.map(child => {
                        const isActive = pathname.startsWith(child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "10px 12px",
                              borderRadius: "8px",
                              color: isActive ? "white" : "rgba(255,255,255,0.6)",
                              background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                              textDecoration: "none",
                              fontSize: "13px",
                              fontWeight: isActive ? "600" : "400",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) e.currentTarget.style.color = "white";
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                            }}
                          >
                            <span style={{ opacity: isActive ? 1 : 0.7 }}>{child.icon}</span>
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Single link
            const isActive = pathname.startsWith(group.href!);
            return (
              <Link
                key={group.label}
                href={group.href!}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  color: isActive ? "white" : "rgba(255,255,255,0.7)",
                  background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: isActive ? "600" : "500",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>{group.icon}</span>
                {group.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Profile */}
      <div style={{ padding: "24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        {session && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#E8A400", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "#041C3F", fontSize: "16px" }}>
              {(session.name || "A")[0].toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "white", margin: 0, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                {session.name}
              </p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: 0 }}>
                Admin
              </p>
            </div>
          </div>
        )}
        <button
              suppressHydrationWarning
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "10px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.8)",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "rgba(255,255,255,0.8)";
          }}
        >
          <span style={{ display: "flex", alignItems: "center" }}><LogOut size={16} /></span> Logout
        </button>
      </div>
    </aside>
  );
}
