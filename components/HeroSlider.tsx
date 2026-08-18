"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function HeroSlider() {
  const slides = [
    { src: "/theme/images/bankindonesiabg.webp", title: "Bank Indonesia Tegal" },
    { src: "/theme/images/upstegal.jpeg", title: "Komisariat Universitas Pancasakti Tegal" },
    { src: "/theme/images/unikal.jpg", title: "Komisariat Universitas Pekalongan" },
    { src: "/theme/images/uingusdur.jpg", title: "Komisariat UIN KH. Abdurrahman Wahid Pekalongan" },
    { src: "/theme/images/ibn.jpg", title: "Komisariat Universitas Islam Bakti Negara Tegal" },
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div
      style={{
        borderRadius: "12px",
        height: "220px",
        marginBottom: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {slides.map((slide, idx) => (
        <div
          key={slide.src}
          style={{
            position: "absolute",
            inset: 0,
            opacity: idx === currentIndex ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        >
          <Image
            src={slide.src}
            alt={`Slide ${idx + 1}`}
            fill
            style={{ objectFit: "cover" }}
            priority={idx === 0}
          />
        </div>
      ))}
      {/* Overlay gradient */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,28,63,0.85) 0%, transparent 60%)", pointerEvents: "none" }} />
      
      {/* Text Info */}
      <div style={{ position: "absolute", bottom: "14px", left: "16px", zIndex: 10 }}>
        <p style={{ color: "white", fontSize: "14px", fontWeight: "600", margin: 0, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
          {slides[currentIndex].title}
        </p>
      </div>
      
      {/* Dots Indicator */}
      <div style={{ position: "absolute", bottom: "18px", right: "16px", display: "flex", gap: "6px", zIndex: 10 }}>
        {slides.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: idx === currentIndex ? "20px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background: idx === currentIndex ? "#E8A400" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
            }}
          />
        ))}
      </div>
    </div>
  );
}
