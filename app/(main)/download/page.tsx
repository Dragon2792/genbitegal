import { getStorageUrl } from "@/lib/storageUrl";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { FileText, Download, Eye, File, FileArchive, FileImage, Presentation, Calendar, Inbox } from "lucide-react";

export const metadata: Metadata = {
  title: "Karya Tulis & Download",
  description: "Download karya tulis ilmiah dan materi dari GenBI Tegal.",
};

export const dynamic = "force-dynamic";

export default async function DownloadPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const searchQuery = typeof searchParams?.search === "string" ? searchParams.search : "";
  const typeFilter = typeof searchParams?.type === "string" ? searchParams.type : "Semua";

  const whereClause: any = {};
  if (searchQuery) {
    whereClause.file_judul = { contains: searchQuery };
  }
  if (typeFilter !== "Semua") {
    if (typeFilter === "PDF") {
      whereClause.file_data = { endsWith: ".pdf" };
    } else if (typeFilter === "Dokumen") {
      whereClause.OR = [
        { file_data: { endsWith: ".doc" } },
        { file_data: { endsWith: ".docx" } },
      ];
    } else if (typeFilter === "Presentasi") {
      whereClause.OR = [
        { file_data: { endsWith: ".ppt" } },
        { file_data: { endsWith: ".pptx" } },
      ];
    }
  }

  const [files, totalStats] = await Promise.all([
    prisma.tbl_files.findMany({
      where: whereClause,
      orderBy: { file_tanggal: "desc" },
    }),
    prisma.tbl_files.count()
  ]);

  const categories = ["Semua", "PDF", "Dokumen", "Presentasi"];

  const getFileIcon = (filename: string) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText size={32} color="#ef4444" />;
    if (['doc', 'docx'].includes(ext || '')) return <File size={32} color="#3b82f6" />;
    if (['ppt', 'pptx'].includes(ext || '')) return <Presentation size={32} color="#f97316" />;
    if (['zip', 'rar'].includes(ext || '')) return <FileArchive size={32} color="#ca8a04" />;
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) return <FileImage size={32} color="#22c55e" />;
    return <File size={32} color="#64748b" />;
  }

  return (
    <>
      <section className="hero-section">
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 70%, rgba(232,164,0,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />
        
        <div className="hero-container">
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "14px" }}>Home</Link>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
              <span style={{ color: "#E8A400", fontSize: "14px", fontWeight: "600" }}>Karya Tulis</span>
            </div>
            
            <h1 style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: "900", color: "white", marginBottom: "16px", fontFamily: "'Lora', serif", lineHeight: "1.2" }}>
              <Download size={48} /> <span>Karya Tulis & <span style={{ color: "#E8A400" }}>Download</span></span>
            </h1>
            
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.1rem", maxWidth: "600px", lineHeight: "1.7", margin: 0 }}>
              Unduh karya tulis, materi seminar, laporan, dan dokumen resmi dari komunitas GenBI Tegal.
            </p>
          </div>
          
          <div className="stats-badge">
            <span style={{ fontSize: "2.5rem", fontWeight: "900", color: "#E8A400", lineHeight: "1", marginBottom: "4px" }}>
              {totalStats}
            </span>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>
              Total File
            </span>
          </div>
        </div>
      </section>

      <section style={{ padding: "50px 24px 100px", background: "#f8fafc", minHeight: "60vh" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          
          <div className="search-card">
            <form method="GET" action="/download" className="search-form">
              {typeFilter !== "Semua" && <input
              suppressHydrationWarning type="hidden" name="type" value={typeFilter} />}
              <input
              suppressHydrationWarning 
                type="text" 
                name="search"
                defaultValue={searchQuery}
                placeholder="Cari judul dokumen..." 
                className="search-input"
              />
              <button
                    suppressHydrationWarning type="submit" className="search-btn">
                Cari File
              </button>
            </form>

            <div className="filter-container">
              {categories.map((cat) => {
                const isActive = typeFilter === cat;
                return (
                  <Link
                    key={cat}
                    href={`/download?type=${cat}${searchQuery ? `&search=${searchQuery}` : ''}`}
                    className={`filter-btn ${isActive ? 'active' : ''}`}
                  >
                    {cat}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid-container">
            {files.map((file) => {
              const fileExt = file.file_data?.split('.').pop()?.toUpperCase() || "FILE";
              
              return (
                <div key={file.file_id} className="file-card">
                  <div className="card-header">
                    <div className="icon-box">
                       {getFileIcon(file.file_data || '')}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div className="badges">
                        <span className="badge-ext">{fileExt}</span>
                        <span className="badge-date" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Calendar size={14} /> {file.file_tanggal ? format(new Date(file.file_tanggal), "dd MMM yyyy", { locale: id }) : ""}
                        </span>
                      </div>
                      <h3 className="card-title">
                        {file.file_judul}
                      </h3>
                    </div>
                  </div>

                  <p className="card-desc">
                    {file.file_deskripsi || "Tidak ada deskripsi untuk dokumen ini."}
                  </p>

                  <div className="card-footer">
                    <div className="author">
                      Oleh: <span>{file.file_oleh || "Admin"}</span>
                    </div>
                    
                    <div className="actions">
                      <a
                        href={getStorageUrl(file.file_data, 'files') || ''}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-preview"
                        title="Preview"
                      >
                        <Eye size={18} />
                      </a>
                      <a
                        href={getStorageUrl(file.file_data, 'files') || ''}
                        download={file.file_data || "download"}
                        className="btn-download"
                      >
                        <Download size={18} />
                        Unduh
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {files.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 24px", background: "white", borderRadius: "16px", border: "1px dashed #cbd5e1", marginTop: "24px" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                 <Inbox size={56} color="#94a3b8" strokeWidth={1.5} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#334155", marginBottom: "8px" }}>Dokumen Tidak Ditemukan</h3>
              <p style={{ color: "#64748b" }}>Coba ubah kata kunci pencarian atau filter kategori lainnya.</p>
            </div>
          )}
          
        </div>
      </section>

      <style>{`
        .hero-section {
          background: linear-gradient(135deg, #041C3F 0%, #11418B 60%, #1a5cb8 100%);
          padding: 140px 24px 80px;
          position: relative;
          overflow: hidden;
        }
        .hero-container {
          max-width: 1280px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        @media (min-width: 768px) {
          .hero-container {
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
          }
        }
        
        .stats-badge {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          padding: 20px 32px;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .search-card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid #f1f5f9;
          margin-bottom: 32px;
        }
        .search-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }
        @media (min-width: 768px) {
          .search-form { flex-direction: row; }
        }
        .search-input {
          flex: 1;
          padding: 14px 20px;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          outline: none;
          background: #f8fafc;
          font-size: 15px;
          transition: all 0.2s ease;
        }
        .search-input:focus {
          border-color: #11418B;
          background: white;
          box-shadow: 0 0 0 3px rgba(17,65,139,0.1);
        }
        .search-btn {
          padding: 14px 32px;
          background: #11418B;
          color: white;
          border: none;
          border-radius: 14px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .search-btn:hover {
          background: #0d326b;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(17,65,139,0.2);
        }
        
        .filter-container {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .filter-container::-webkit-scrollbar {
          height: 4px;
        }
        .filter-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .filter-btn {
          padding: 8px 24px;
          border-radius: 24px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          border: 1px solid #e2e8f0;
          color: #64748b;
          white-space: nowrap;
          transition: all 0.2s ease;
          background: transparent;
        }
        .filter-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #334155;
        }
        .filter-btn.active {
          background: #11418B;
          color: white;
          border-color: #11418B;
          box-shadow: 0 4px 10px rgba(17,65,139,0.2);
        }
        
        .grid-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 768px) {
          .grid-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        .file-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .file-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.08);
          border-color: #e2e8f0;
        }
        
        .card-header {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .icon-box {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid #f1f5f9;
          transition: transform 0.3s ease;
        }
        .file-card:hover .icon-box {
          transform: scale(1.08) rotate(-3deg);
        }
        
        .badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 8px;
        }
        .badge-ext {
          background: #eff6ff;
          color: #1d4ed8;
          padding: 2px 10px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 800;
          border: 1px solid #dbeafe;
        }
        .badge-date {
          color: #94a3b8;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
        }
        
        .card-title {
          font-size: 17px;
          font-weight: 800;
          color: #1e293b;
          line-height: 1.4;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.2s ease;
        }
        .file-card:hover .card-title {
          color: #11418B;
        }
        
        .card-desc {
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 24px;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
        }
        .author {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
        }
        .author span {
          color: #475569;
          font-weight: 600;
        }
        
        .actions {
          display: flex;
          gap: 10px;
        }
        .btn-preview {
          padding: 10px 12px;
          background: #f1f5f9;
          color: #475569;
          border-radius: 12px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-preview:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        .btn-download {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: linear-gradient(135deg, #11418B, #1a5cb8);
          color: white;
          font-weight: 600;
          font-size: 13px;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 10px rgba(17,65,139,0.2);
        }
        .btn-download:hover {
          box-shadow: 0 6px 15px rgba(17,65,139,0.3);
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
}
