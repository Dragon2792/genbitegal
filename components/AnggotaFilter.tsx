"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function AnggotaFilter({ komisariatList, initialSearch, initialFilter }: { komisariatList: string[], initialSearch: string, initialFilter: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState(initialFilter);

  // Use debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("search", search);
      else params.delete("search");
      
      if (filter && filter !== "Semua") params.set("komisariat", filter);
      else params.delete("komisariat");
      
      router.push(`/anggota?${params.toString()}`, { scroll: false });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [search, filter, router, searchParams]);

  return (
    <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "20px 24px", position: "sticky", top: "70px", zIndex: 100 }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", display: "flex", alignItems: "center" }}><Search size={16} /></span>
          <input
              suppressHydrationWarning
            type="text"
            placeholder="Cari nama atau prodi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px 10px 36px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
              color: "#1e293b",
              background: "#f8fafc",
            }}
          />
        </div>
        {/* Filter */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {komisariatList.map((k) => (
            <button
              suppressHydrationWarning
              key={k}
              onClick={() => setFilter(k)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "1px solid",
                borderColor: filter === k ? "#11418B" : "#e2e8f0",
                background: filter === k ? "#11418B" : "transparent",
                color: filter === k ? "white" : "#64748b",
                fontWeight: filter === k ? "600" : "400",
                fontSize: "13px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
              }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
