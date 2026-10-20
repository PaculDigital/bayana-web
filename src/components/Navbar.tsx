"use client";

import { useEffect, useState } from "react";
import { HERO_AKTIF } from "@/lib/hero-saklar";

// =============================================================
// NAVBAR — Bayana Publishing (revisi dokumen butir 4, 30Sep2026)
//
// MENU FINAL = HANYA 5 butir (dokumen verbatim):
//   Beranda · Paket Harga · Katalog · Kontak · CTA (Lihat Promo)
// Menu lama (Tentang, Layanan, Beli Buku) DILARANG dikembalikan
// tanpa perintah Bos — dokumen: "Menunya dihapus, dirubah menjadi
// hanya : Beranda, Paket Harga, Kataloq, Kontak, CTA".
//
// Logo = gambar (public/logo-bayana.png, versi dipangkas & transparan).
// Mode: hero formal (terang) → navbar SELALU solid gading;
//       hero sinematik (gelap) → transparan di atas, solid setelah scroll.
// =============================================================

const LINKS = [
  { href: "#beranda", label: "Beranda" },
  { href: "#paket", label: "Paket Harga" },
  { href: "#katalog", label: "Katalog" },
  { href: "#kontak", label: "Kontak" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const sinematik = HERO_AKTIF === "sinematik";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hero formal = latar terang → navbar solid sejak awal.
  const solid = !sinematik || scrolled;
  const linkColor = solid
    ? "text-acad-ink hover:text-acad-gold"
    : "text-cream/85 hover:text-[#ffd97a]";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "border-b border-acad-line bg-[#faf7f0]/95 shadow-[0_2px_16px_rgba(35,39,47,0.08)] backdrop-blur"
          : "border-b border-white/10 bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2.5">
        {/* Logo (gambar — sesuai dokumen butir 3) */}
        <a href="#beranda" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-bayana.png" alt="Bayana Publishing" className="h-10 w-auto md:h-11" />
        </a>

        {/* Menu desktop — 4 tautan + CTA */}
        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className={`text-sm font-medium transition-colors ${linkColor}`}>
              {l.label}
            </a>
          ))}
          <a
            href="#paket"
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              solid
                ? "bg-acad-ink text-white hover:bg-[#1e3a5f]"
                : "bg-[#ffd97a] text-[#24170c] hover:bg-[#ffe49a]"
            }`}
          >
            Lihat Promo
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

      {/* Menu mobile — isinya SAMA dengan desktop */}
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
            <a
              href="#paket"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-acad-ink px-3 py-2.5 text-[15px] font-semibold text-white"
            >
              Lihat Promo
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
