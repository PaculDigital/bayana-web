"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { overlayStory, type OverlayBeat } from "@/lib/design-tokens";

// =============================================================
// HERO — cinematic scroll hero Bayana Publishing
//
// 🚫⚠️ JANGAN HAPUS BERKAS INI ⚠️🚫
//    Ini CADANGAN RESMI + DOKUMENTASI (putusan Bos 15 Okt 2026: "jangan di
//    hapus hero itu termasuk Dokumentasi untuk membuatnya").
//    Tidak dipakai produksi karena audit Perpustakaan Nasional (Perpusnas) —
//    produksi memakai HeroFormal.tsx. JANGAN ubah produksi.
//    Mengaktifkan: ubah HERO_AKTIF di src/lib/hero-saklar.ts → rebuild.
//    Rincian lengkap: DOKUMENTASI_HERO_SINEMATIK.md (akar proyek).
//
// - Container tinggi (SCROLL_VH vh), viewport sticky di layar
// - Frame video berubah mengikuti progress scroll (150 frame)
// - Overlay kata-kata (emas/gold) muncul mengikuti tahap video
// =============================================================

const FRAME_COUNT = 150;
const SCROLL_VH = 420;

function framePath(i: number): string {
  return `/frames/frame-${String(i).padStart(4, "0")}.webp`;
}

// ukuran heading tiap beat
const SIZE_CLASS: Record<NonNullable<OverlayBeat["size"]>, string> = {
  sm: "text-xl md:text-3xl",
  md: "text-2xl md:text-4xl",
  lg: "text-3xl md:text-5xl",
  xl: "text-4xl md:text-6xl",
};

// easing smoothstep biar transisi tegas tp halus (tanpa sentakan)
function smooth(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

// Hitung beat-beat yang sedang aktif pada satu frame beserta opacity masing-masing.
// Bisa >1 saat transisi antar beat (crossfade overlap: beat lama fade-out & beat
// baru fade-in bersamaan) — bikin pergantian bercerita, tanpa momen kosong.
function activeBeats(frame: number): { beat: OverlayBeat; opacity: number }[] {
  const out: { beat: OverlayBeat; opacity: number }[] = [];
  for (const b of overlayStory) {
    if (frame < b.startFrame || frame > b.endFrame) continue;
    const span = Math.max(1, b.endFrame - b.startFrame);
    const winIn = Math.max(6, Math.round(span * 0.28));
    const winOut = Math.max(6, Math.round(span * 0.28));
    const fadeIn = smooth((frame - b.startFrame) / winIn);
    const fadeOut = smooth((b.endFrame - frame) / winOut);
    const opacity = fadeIn * fadeOut;
    if (opacity > 0.012) out.push({ beat: b, opacity });
  }
  return out;
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFrame, setActiveFrame] = useState(1);
  const [interactive, setInteractive] = useState(false);

  const onScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    if (total <= 0) return;
    const progress = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total));
    const frame = Math.max(1, Math.min(FRAME_COUNT, Math.round(progress * (FRAME_COUNT - 1)) + 1));
    setActiveFrame(frame);
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const t = setTimeout(() => setInteractive(true), 80);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(t);
    };
  }, [onScroll]);

  // preload frame setelah interaktif
  useEffect(() => {
    if (!interactive) return;
    let i = 1;
    let cancelled = false;
    const step = () => {
      if (cancelled) return;
      for (let k = 0; k < 8 && i <= FRAME_COUNT; k++, i++) {
        const im = new Image();
        im.src = framePath(i);
      }
      if (i <= FRAME_COUNT) setTimeout(step, 60);
    };
    step();
    return () => {
      cancelled = true;
    };
  }, [interactive]);

  // beat-beat yang sedang aktif (1 saat tenang, 2 saat transisi crossfade)
  const beats = activeBeats(activeFrame);

  // --- Render helper untuk satu beat pada posisi/opacity/drift-nya sendiri ---
  // (di bawah, di-map dari `beats` sehingga beat lama & baru bisa overlap)

  const alignClassOf = (beat: OverlayBeat) =>
    beat?.align === "center"
      ? "items-center text-center"
      : beat?.align === "right"
        ? "items-end text-right"
        : "items-start text-left";

  return (
    <section ref={containerRef} id="beranda" style={{ height: `${SCROLL_VH}vh` }} className="relative w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0a0705]">
        {/* Frame aktif */}
        {interactive && (
          <img
            key={activeFrame}
            src={framePath(activeFrame)}
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
            draggable={false}
          />
        )}

        {/* Vignette kiri utk keterbacaan overlay (tipis) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />

        {/* Overlay kata-kata: loop per beat aktif (bisa 2 saat crossfade) */}
        {beats.map(({ beat, opacity: opv }, bi) => {
          const alignClass = alignClassOf(beat);
          const xPos = beat.pos?.x ?? 7;
          const yPos = beat.pos?.y ?? 26;
          // drift naik: bangkit dari bawah saat masuk, lalu naik pelan sepanjang beat
          const span = Math.max(1, beat.endFrame - beat.startFrame);
          const winIn = Math.max(6, Math.round(span * 0.28));
          const fadeIn = smooth((activeFrame - beat.startFrame) / winIn);
          const spanP = (activeFrame - beat.startFrame) / span;
          const drift = 16 * (1 - fadeIn) + 10 * (1 - spanP);
          return (
            <div
              key={bi}
              className="pointer-events-none absolute inset-0 will-change-transform"
              style={{
                opacity: Math.round(opv * 1000) / 1000,
                transform: `translate3d(0, ${drift.toFixed(1)}px, 0)`,
                transition: "opacity 0.55s ease, transform 0.55s ease",
              }}
            >
              <div
                className={`absolute flex max-w-xl flex-col ${alignClass}`}
                style={{ left: `${xPos}%`, top: `${yPos}%`, maxWidth: "min(600px, 88vw)" }}
              >
                {/* Backdrop gradient gelap TIPIS di belakang teks biar kontras tapi tidak menutup video */}
                <div
                  className={`pointer-events-none absolute -inset-x-4 -inset-y-2 ${
                    alignClass === "items-end text-right"
                      ? "bg-gradient-to-l"
                      : "bg-gradient-to-r"
                  } from-black/45 via-black/15 to-transparent`}
                  style={{
                    maskImage: "linear-gradient(to right, black 0%, black 55%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to right, black 0%, black 55%, transparent 100%)",
                  }}
                />
                {beat.kicker && (
                  <span className="mb-3 text-[11px] font-medium uppercase tracking-[0.35em] text-gold-light/90 md:mb-4 md:text-xs">
                    {beat.kicker}
                  </span>
                )}
                <div className="relative flex flex-col gap-1 md:gap-2">
                  {beat.lines.map((segs, i) => (
                    <span
                      key={i}
                      className={`${SIZE_CLASS[beat.size ?? "lg"]} font-heading leading-[1.08] font-semibold text-cream`}
                      style={{ textShadow: "0 2px 18px rgba(0,0,0,0.85)" }}
                    >
                      {segs.map((s, j) => {
                        const isScript = !!s.script;
                        const scriptCls =
                          s.script === "caveat"
                            ? "font-script-caveat"
                            : s.script === "dancing"
                              ? "font-script-dancing"
                              : "";
                        // teks script = tulisan tangan emas/aksen, 2x lebih besar utk penegasan jelas
                        return isScript ? (
                          <em
                            key={j}
                            className={`${scriptCls} gold-accent-text not-italic inline-block ${
                              beat.size === "xl" ? "text-[2em]" : "text-[1.9em]"
                            } -mb-[0.14em] align-baseline`}
                          >
                            {s.t}
                          </em>
                        ) : (
                          <span key={j}>{s.t}</span>
                        );
                      })}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* indikator scroll bawah */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-gold-light/70">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="h-8 w-px bg-gold-light/50" />
        </div>
      </div>
    </section>
  );
}
