import { TEMPLATE_AKTIF } from "@/lib/template-saklar";

// ── TEMPLATE 2 — versi dokumen "Revisi Web desain" 15 butir ──
import Navbar from "@/components/Navbar";
import HeroFormal from "@/components/HeroFormal";
import Introduction from "@/components/Introduction";
import TentangKami from "@/components/TentangKami";
import Pricing from "@/components/Pricing";
import AlurPenerbitan from "@/components/AlurPenerbitan";
import BookGallery from "@/components/BookGallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

// ── TEMPLATE 1 — versi LIVE produksi lama (utuh dari backup) ──
import Navbar1 from "@/components/t1/Navbar";
import Hero1 from "@/components/Hero";
import VisiMisi from "@/components/VisiMisi";
import TrustBar from "@/components/TrustBar";
import Services from "@/components/Services";
import Pricing1 from "@/components/t1/Pricing";
import Process from "@/components/Process";
import WhyUs from "@/components/WhyUs";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Contact1 from "@/components/t1/Contact";
import Footer1 from "@/components/t1/Footer";

// ── kedua template ──
import TombolWa from "@/components/TombolWa";

// =============================================================
// BERANDA — Bayana Publishing
//
// SAKLAR: src/lib/template-saklar.ts → TEMPLATE_AKTIF
//   "1" = versi live produksi lama (hero cinematic, menu lama,
//         paket Kolaborasi/Reguler/Eksklusif, ISBN tampil, dst.)
//   "2" = versi dokumen 15 butir (hero formal, menu 5 butir,
//         paket Buku Referensi/Monograf/Buku Ajar, ISBN disembunyikan)
// Ganti satu kata → rebuild → selesai.
//
// Tombol WA melayang = fitur tambahan (butir 1) → tampil di KEDUA.
// =============================================================

export default function Home() {
  if (TEMPLATE_AKTIF === "1") {
    return (
      <main className="min-h-screen w-full bg-[#0a0705] text-cream">
        <Navbar1 />

        {/* HERO SCROLL CINEMATIC (gelap, hanya bagian ini) */}
        <Hero1 />

        <VisiMisi />
        <TrustBar />
        <Services />
        <Pricing1 />
        <Process />
        <WhyUs />
        <BookGallery />
        <Testimonials />
        <Faq />
        <Contact1 />
        <Footer1 />

        {/* TOMBOL WA MELAYANG — fitur baru, ikut kedua template */}
        <TombolWa />
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#faf7f0] text-[#23272f]">
      <Navbar />

      {/* HERO FORMAL (banner kompak, 220px) */}
      <HeroFormal />

      {/* PENGANTAR — kalimat pengantar + tanda tangan resmi (01Oct26) */}
      <Introduction />

      {/* TENTANG KAMI — profil + visi/misi + komitmen ilmu (revisi Perpusnas 20Oct26) */}
      <TentangKami />

      {/* LAYANAN (nama: Buku Referensi · Monograf · Buku Ajar) */}
      <Pricing />

      {/* ALUR PENERBITAN — 5 langkah kurasi (revisi Perpusnas 20Oct26) */}
      <AlurPenerbitan />

      {/* GALERI BUKU (klik → buku.bayana.id) */}
      <BookGallery />

      {/* KONTAK (teks dokumen + formulir tersimpan ke database) */}
      <Contact />

      {/* FOOTER 4 KOLOM (legalitas + kontak redaksi + paket + menu) */}
      <Footer />

      {/* TOMBOL WA MELAYANG — fitur baru, ikut kedua template */}
      <TombolWa />
    </main>
  );
}
