"use client";

import { useEffect, useRef } from "react";

export default function StatsCounter({ children }: { children: React.ReactNode }) {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll<HTMLElement>("[data-count]");
            counters.forEach((counter) => {
              counter.style.animation = "count-up 0.6s ease-out forwards";
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={statsRef}
      style={{
        background: "linear-gradient(135deg, #11418B, #1a5cb8)",
        padding: "60px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "24px",
        }}
      >
        {children}
      </div>
    </section>
  );
}
