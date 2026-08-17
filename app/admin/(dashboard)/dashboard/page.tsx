import { prisma } from "@/lib/prisma";
import {
  Newspaper, Calendar, Image as ImageIcon, GraduationCap,
  Megaphone, Inbox, Eye, FileText, MessageSquare, Users, MessageCircle, Monitor
} from "lucide-react";
import Link from "next/link";
import VisitorChart from "./VisitorChart";

// Browser icon colors map
const browserConfig: Record<string, { color: string; bg: string; label: string }> = {
  Chrome:             { color: "#fff", bg: "#1da1f2", label: "Chrome" },
  Mozilla:            { color: "#fff", bg: "#e53e3e", label: "Mozilla Firefox" },
  Firefox:            { color: "#fff", bg: "#e53e3e", label: "Firefox" },
  Googlebot:          { color: "#fff", bg: "#48bb78", label: "Googlebot" },
  Opera:              { color: "#fff", bg: "#ed8936", label: "Opera" },
  Safari:             { color: "#fff", bg: "#667eea", label: "Safari" },
  Bing:               { color: "#fff", bg: "#0078d4", label: "Bing Bot" },
  YandexBot:          { color: "#fff", bg: "#fc8001", label: "Yandex Bot" },
  "Internet Explorer":{ color: "#fff", bg: "#0078d4", label: "Internet Explorer" },
  Other:              { color: "#fff", bg: "#718096", label: "Lainnya" },
};

export default async function DashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const totalArtikel = await prisma.tbl_tulisan.count();
  const totalAgenda = await prisma.tbl_agenda.count();
  const totalGaleri = await prisma.tbl_galeri.count();
  const totalAnggota = await prisma.tbl_siswa.count();
  const totalPengumuman = await prisma.tbl_pengumuman.count();
  const totalInbox = await prisma.tbl_inbox.count();
  const totalFiles = await prisma.tbl_files.count();
  const totalTestimoni = await prisma.tbl_testimoni.count();
  const totalKomentar = await prisma.tbl_komentar.count();
  const totalPengguna = await prisma.tbl_pengguna.count();
  const popularPosts = await prisma.tbl_tulisan.findMany({
    orderBy: { tulisan_views: "desc" },
    take: 10,
    select: { tulisan_id: true, tulisan_judul: true, tulisan_views: true, tulisan_tanggal: true },
  });
  const latestInbox = await prisma.tbl_inbox.findMany({
    orderBy: { inbox_tanggal: "desc" },
    take: 5,
  });
  const browserStats = await prisma.tbl_pengunjung.groupBy({
    by: ["pengunjung_perangkat"],
    _count: { pengunjung_id: true },
    orderBy: { _count: { pengunjung_id: "desc" } },
    take: 4,
  });
  const dailyRaw = await prisma.tbl_pengunjung.findMany({
    where: { pengunjung_tanggal: { gte: startOfMonth, lte: endOfMonth } },
    select: { pengunjung_tanggal: true },
  });

  // Build daily visitor chart data
  const dailyMap: Record<string, number> = {};
  for (const v of dailyRaw) {
    if (!v.pengunjung_tanggal) continue;
    const key = new Date(v.pengunjung_tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
    dailyMap[key] = (dailyMap[key] || 0) + 1;
  }
  // Fill all days in current month
  const daysInMonth = endOfMonth.getDate();
  const chartData = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), i + 1);
    const key = d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
    return { tanggal: `${i + 1}`, pengunjung: dailyMap[key] || 0 };
  });

  const monthLabel = now.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  const stats = [
    { label: "Artikel", value: totalArtikel, icon: <Newspaper size={22} />, color: "#3b82f6", bg: "#eff6ff", href: "/admin/artikel" },
    { label: "Agenda", value: totalAgenda, icon: <Calendar size={22} />, color: "#10b981", bg: "#f0fdf4", href: "/admin/agenda" },
    { label: "Galeri", value: totalGaleri, icon: <ImageIcon size={22} />, color: "#8b5cf6", bg: "#f5f3ff", href: "/admin/galeri" },
    { label: "Anggota", value: totalAnggota, icon: <GraduationCap size={22} />, color: "#f59e0b", bg: "#fffbeb", href: "/admin/anggota" },
    { label: "Pengumuman", value: totalPengumuman, icon: <Megaphone size={22} />, color: "#ef4444", bg: "#fef2f2", href: "/admin/pengumuman" },
    { label: "Inbox", value: totalInbox, icon: <Inbox size={22} />, color: "#0ea5e9", bg: "#f0f9ff", href: "/admin/inbox" },
    { label: "Files", value: totalFiles, icon: <FileText size={22} />, color: "#6366f1", bg: "#eef2ff", href: "/admin/files" },
    { label: "Testimoni", value: totalTestimoni, icon: <MessageSquare size={22} />, color: "#ec4899", bg: "#fdf2f8", href: "/admin/testimoni" },
    { label: "Komentar", value: totalKomentar, icon: <MessageCircle size={22} />, color: "#14b8a6", bg: "#f0fdfa", href: "/admin/komentar" },
    { label: "Pengguna", value: totalPengguna, icon: <Users size={22} />, color: "#f97316", bg: "#fff7ed", href: "/admin/pengguna" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
          <span>Home</span>
          <span>›</span>
          <span className="text-gray-700">Dashboard</span>
        </div>
      </div>

      {/* Browser / Device Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {browserStats.map((b) => {
          const perangkat = b.pengunjung_perangkat || "Other";
          const cfg = browserConfig[perangkat] || browserConfig["Other"];
          const count = b._count.pengunjung_id;
          return (
            <div
              key={perangkat}
              className="rounded-xl overflow-hidden flex items-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div
                className="w-20 h-20 flex-shrink-0 flex items-center justify-center"
                style={{ background: cfg.bg }}
              >
                <Monitor size={32} color={cfg.color} />
              </div>
              <div className="px-4 py-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{cfg.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-0.5">{count.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visitor Chart */}
      <VisitorChart data={chartData} month={monthLabel} />

      {/* Stats Grid */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Ringkasan Konten</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, i) => (
            <Link key={i} href={stat.href} style={{ textDecoration: "none" }}>
              <div
                className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
                style={{ borderLeft: `4px solid ${stat.color}` }}
              >
                <div
                  className="rounded-lg p-2 w-fit mb-2"
                  style={{ background: stat.bg, color: stat.color }}
                >
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-gray-800">{stat.value.toLocaleString()}</p>
                <p className="text-xs font-medium text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Two-column: Popular Posts + Recent Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Popular Posts */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800">Posting Populer</h2>
            <Link href="/admin/artikel" className="text-xs text-blue-600 hover:underline">Lihat semua</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {popularPosts.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-gray-400">Belum ada data artikel.</div>
            ) : (
              popularPosts.map((post, i) => (
                <div key={post.tulisan_id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <span className="text-lg font-bold text-gray-200 w-6 text-center flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <Link href={`/admin/artikel/edit/${post.tulisan_id}`} className="text-sm font-medium text-gray-800 hover:text-blue-600 line-clamp-1">
                      {post.tulisan_judul}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {post.tulisan_tanggal ? new Date(post.tulisan_tanggal).toLocaleDateString("id-ID") : "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-600 whitespace-nowrap flex-shrink-0">
                    <Eye size={13} className="text-gray-400" />
                    {post.tulisan_views?.toLocaleString() || 0}
                    <span className="text-xs text-gray-400 font-normal ml-0.5">Views</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Inbox */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800">Pesan Terbaru</h2>
            <Link href="/admin/inbox" className="text-xs text-blue-600 hover:underline">Lihat semua</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {latestInbox.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-gray-400">Belum ada pesan masuk.</div>
            ) : (
              latestInbox.map((msg) => (
                <div key={msg.inbox_id} className="px-6 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {(msg.inbox_nama || "?")[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800">{msg.inbox_nama}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{msg.inbox_pesan}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {msg.inbox_tanggal ? new Date(msg.inbox_tanggal).toLocaleDateString("id-ID") : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
