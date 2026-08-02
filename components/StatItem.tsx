"use client";

import React, { useState, useEffect, useRef } from "react";

export default function StatItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  // Extract the numeric part and the suffix (e.g., "506" and "+")
  const numValue = parseInt(value.toString().replace(/[^0-9]/g, '')) || 0;
  const suffix = value.toString().replace(/[0-9]/g, '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          const duration = 2000; // 2 seconds animation
          const startTime = performance.now();
          
          const updateCount = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime < duration) {
              // Easing function (easeOutExpo) for a smoother finish
              const progress = 1 - Math.pow(1 - elapsedTime / duration, 3);
              setCount(Math.min(numValue, Math.floor(progress * numValue)));
              requestAnimationFrame(updateCount);
            } else {
              setCount(numValue);
            }
          };
          
          requestAnimationFrame(updateCount);
        }
      },
      { threshold: 0.3 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, numValue]);

  return (
    <div
      ref={itemRef}
      style={{
        textAlign: "center",
        padding: "32px 20px",
        background: "rgba(255,255,255,0.08)",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.12)",
        transition: "all 0.3s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          "rgba(255,255,255,0.15)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          "rgba(255,255,255,0.08)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      <div style={{ fontSize: "36px", marginBottom: "8px" }}>{icon}</div>
      <div
        style={{
          fontSize: "2.5rem",
          fontWeight: "900",
          color: "#E8A400",
          lineHeight: 1,
          marginBottom: "6px",
        }}
      >
        {count}{suffix}
      </div>
      <div
        style={{
          color: "rgba(255,255,255,0.85)",
          fontWeight: "600",
          fontSize: "14px",
        }}
      >
        {label}
      </div>
    </div>
  );
}
