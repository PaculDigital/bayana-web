// =============================================================
// SAKLAR HERO — Bayana Publishing
//
// 🚫⚠️ JANGAN HAPUS BERKAS INI, `Hero.tsx`, ATAU `public/frames/` ⚠️🚫
//    Hero "sinematik" = CADANGAN RESMI + DOKUMENTASI (putusan Bos 15 Okt 2026:
//    "jangan di hapus hero itu termasuk Dokumentasi untuk membuatnya").
//    Alasan tidak aktif: audit Perpustakaan Nasional (Perpusnas) → produksi
//    memakai hero FORMAL. JANGAN ubah produksi selama audit berlaku.
//    Rincian lengkap: DOKUMENTASI_HERO_SINEMATIK.md (akar proyek).
//
// Dua hero tersedia di repo:
//   • "formal"   → HeroFormal.tsx  (banner kompak, untuk audit Perpusnas)
//   • "sinematik" → Hero.tsx        (scroll-story lama — JANGAN dihapus)
//
// CARA GANTI: ubah satu kata di bawah, lalu rebuild (saklar dibaca saat BUILD).
//   "formal"   → hero formal (default, aktif sejak 30Sep2026)
//   "sinematik" → hero cinematic scroll lama
// =============================================================

export type ModeHero = "formal" | "sinematik";

export const HERO_AKTIF: ModeHero = "formal";
