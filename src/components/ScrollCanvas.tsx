"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ScrollCanvas — pinned canvas hero.
// Container setinggi SCROLL_VH * viewport; viewport child melekat (sticky) di layar
// selama scroll, menampilkan frame video yang berubah mengikuti progress scroll.
//
// Frame: 150 gambar statis (/frames/frame-0001.webp .. frame-0150.webp)
// Tiap frame di-preload ringan; hanya frame aktif + tetangga dimuat.

const FRAME_COUNT = 150;
const SCROLL_VH = 420; // total tinggi gulir (dalam unit viewport-height)

function framePath(i: number): string {
  return `/frames/frame-${String(i).padStart(4, "0")}.webp`;
}

export default function ScrollCanvas({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFrame, setActiveFrame] = useState(1);
  const [ready, setReady] = useState(false);

  // hitung frame aktif dari scroll posisi container
  const onScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = el.offsetHeight - window.innerHeight;
    if (total <= 0) return;
    const progress = Math.min(1, Math.max(0, -rect.top / total));
    const frame = Math.max(1, Math.min(FRAME_COUNT, Math.round(progress * (FRAME_COUNT - 1)) + 1));
    setActiveFrame(frame);
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const t = setTimeout(() => setReady(true), 60);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(t);
    };
  }, [onScroll]);

  return (
    <section
      ref={containerRef}
      style={{ height: `${SCROLL_VH}vh` }}
      className={`relative w-full ${className}`}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0a0705]">
        {/* Frame aktif */}
        {ready && (
          <img
            key={activeFrame}
            src={framePath(activeFrame)}
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
            draggable={false}
          />
        )}

        {/* Vignette gelap halus biar teks overlay tetap terbaca */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

        {/* Overlay kata-kata (dari parent via children) */}
        <div className="absolute inset-0">{children}</div>
      </div>
    </section>
  );
}

// Preload semua frame secara bertahap setelah halaman interaktif.
// Dipanggil sekali dari Hero via useEffect.
export function preloadFrames() {
  if (typeof window === "undefined") return;
  let i = 1;
  const step = () => {
    for (let k = 0; k < 6 && i <= FRAME_COUNT; k++, i++) {
      const img = new Image();
      img.src = framePath(i);
    }
    if (i <= FRAME_COUNT) requestIdleCallback ? requestIdleCallback(step) : setTimeout(step, 80);
  };
  step();
}
