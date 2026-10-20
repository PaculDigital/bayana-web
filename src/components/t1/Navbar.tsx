"use client";

import { useEffect, useState } from "react";
import { ALAMAT_TOKO } from "@/components/BookGallery";

// =============================================================
// NAVBAR — Bayana Publishing
// Sticky. Di atas (hero gelap): transparan, teks terang.
// Setelah scroll melewati hero: solid gading, teks navy.
// Mobile: hamburger menu.
//
// ⚠️ PERBAIKAN 22Sep26 (permintaan Bos): ditambah tombol "Beli Buku"
//    yang menuju toko buku.bayana.id. Sebelumnya pengunjung beranda
//    penerbit TIDAK punya jalan menuju toko dari menu atas.
//    Alamat toko diambil dari satu tempat (ALAMAT_TOKO) supaya kalau
//    kelak berubah, cukup diubah di SATU berkas.
// =============================================================

const LINKS = [
  { href: "#beranda", label: "Beranda" },
  { href: "#tentang", label: "Tentang" },
  { href: "#layanan", label: "Layanan" },
  { href: "#paket", label: "Paket" },
  { href: "#katalog", label: "Katalog" },
  { href: "#kontak", label: "Kontak" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled; // mode terang setelah scroll
  const linkColor = solid ? "text-acad-ink hover:text-acad-gold" : "text-cream/85 hover:text-[#ffd97a]";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "border-b border-acad-line bg-[#faf7f0]/95 shadow-[0_2px_16px_rgba(35,39,47,0.08)] backdrop-blur"
          : "border-b border-white/10 bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <a href="#beranda" className="flex items-center gap-2">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full border font-display-serif text-sm font-bold ${
              solid ? "border-acad-gold/50 text-acad-gold" : "border-[#ffd97a]/60 text-[#ffd97a]"
            }`}
          >
            B
          </span>
          <span className={`font-display-serif text-lg font-semibold tracking-wide ${solid ? "text-acad-ink" : "text-cream"}`}>
            Bayana<span className={solid ? "text-acad-gold" : "text-[#ffd97a]"}>.Publishing</span>
          </span>
        </a>

        {/* Menu desktop */}
        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className={`text-sm font-medium transition-colors ${linkColor}`}>
              {l.label}
            </a>
          ))}
          <a
            href={ALAMAT_TOKO}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
              solid
                ? "border-acad-gold text-acad-gold hover:bg-acad-gold hover:text-white"
                : "border-[#ffd97a]/70 text-[#ffd97a] hover:bg-[#ffd97a] hover:text-[#24170c]"
            }`}
          >
            Beli Buku
          </a>
          <a
            href="#kontak"
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              solid
                ? "bg-acad-gold text-white hover:bg-acad-gold/90"
                : "bg-[#ffd97a] text-[#24170c] hover:bg-[#ffe49a]"
            }`}
          >
            Terbitkan Buku
          </a>
        </div>

        {/* Hamburger mobile */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          className={`flex h-9 w-9 items-center justify-center rounded-lg md:hidden ${
            solid ? "text-acad-ink" : "text-cream"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </nav>

      {/* Menu mobile */}
      {open && (
        <div className="border-t border-acad-line bg-[#faf7f0] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-acad-ink hover:bg-acad-soft"
              >
                {l.label}
              </a>
            ))}
            {/* Jalan menuju toko dari menu HP (permintaan Bos 22Sep26) */}
            <a
              href={ALAMAT_TOKO}
              onClick={() => setOpen(false)}
              className="rounded-lg bg-acad-gold px-3 py-2.5 text-[15px] font-semibold text-white"
            >
              Beli Buku
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
