"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      setLoading(false);

      if (data.error) {
        setError(data.error);
      } else if (data.success) {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (e) {
      setLoading(false);
      setError("Gagal terhubung ke server");
    }
  };

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
      <div style={{ width: "100%", maxWidth: "420px", padding: "40px", background: "white", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}><ShieldCheck size={48} color="#11418B" /></div>
          <h1 style={{ fontSize: "24px", fontWeight: "900", color: "#041C3F", margin: 0 }}>GenBI <span style={{ color: "#E8A400" }}>Admin</span></h1>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "8px" }}>Silakan login untuk mengakses panel admin</p>
        </div>

        {error && (
          <div style={{ padding: "12px 16px", background: "#fef2f2", color: "#b91c1c", borderRadius: "8px", fontSize: "14px", marginBottom: "20px", border: "1px solid #fecaca", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>Username</label>
            <input
              suppressHydrationWarning
              type="text"
              name="username"
              placeholder="Masukkan username"
              required
              style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", transition: "border-color 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = "#11418B"}
              onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>Password</label>
            <input
              suppressHydrationWarning
              type="password"
              name="password"
              placeholder="••••••••"
              required
              style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", transition: "border-color 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = "#11418B"}
              onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
            />
          </div>
          
          <button
            suppressHydrationWarning
            type="submit"
            disabled={loading}
            style={{
              marginTop: "8px",
              padding: "14px",
              background: "linear-gradient(135deg, #041C3F, #11418B)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.2s"
            }}
          >
            {loading ? "Memproses..." : "Masuk ke Panel Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
