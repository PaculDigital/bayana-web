// =============================================================
// SAKLAR TEMPLATE — Bayana Publishing (permintaan Bos 30Sep2026)
//
//   "template 1" = versi yang SEDANG LIVE di produksi (jangan dihapus)
//   "template 2" = versi baru sesuai dokumen "Revisi Web desain" 15 butir
//
// CARA GANTI: ubah SATU kata di bawah → rebuild (`npx next build`
// atau `bash jalankan.sh`) → selesai. Tidak perlu sentuh komponen.
//
//   "2"  → versi dokumen (default aktif sejak 30Sep2026)
//   "1"  → versi live produksi lama (hero scroll cinematic, menu lama,
//          paket Kolaborasi/Reguler/Eksklusif, ISBN tampil, dst.)
//
// Peta komponen:
//   T1 = src/components/t1/* (salinan utuh dari backup
//        _arsip/pre-revisi15butir-30sep26/) + section lama
//        (VisiMisi/TrustBar/Services/Process/WhyUs/Testimonials/Faq)
//        + Hero.tsx (cinematic scroll — TIDAK pernah dihapus)
//   T2 = Navbar/Pricing/Contact/Footer versi baru + HeroFormal
//
// Catatan: tombol WA melayang (TombolWa) TAMPIL DI KEDUA template —
// itu fitur tambahan yang diminta Bos (butir 1), bukan bagian template.
// =============================================================

export type ModeTemplate = "1" | "2";

export const TEMPLATE_AKTIF: ModeTemplate = "2";
