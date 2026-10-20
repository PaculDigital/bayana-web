"use client";

// =============================================================
// GALERI BUKU — Bayana Publishing (halaman depan bayana.id)
//
// PERBAIKAN 22Sep26 (putusan Bos):
//   • Kartu coklat gelap polos → DIGANTI cover buku bergambar
//     (memakai CoverBuku yang sama dengan toko, warna soft green).
//   • Harga SEKARANG TAMPIL dan dibuat jelas/terbaca (kapsul emas).
//   • Kartu bisa DIKLIK → menuju buku.bayana.id/<nama-buku>.
//   • Sumber data DISATUKAN ke src/data/buku.ts — dulu daftar di
//     sini terpisah dan judulnya berbeda dari katalog toko.
//
// ⚠️ YANG TIDAK DIUBAH: animasi marquee, kecepatan, arah, efek hover
//    berhenti, gradasi tepi, dan judul bagian. Bos: "tetap hanya
//    animasi buku saja" — jadi TIDAK ada grid/katalog di bawahnya.
// =============================================================

import Link from "next/link";
import { buku } from "@/data/buku";
import CoverBuku from "@/components/buku/CoverBuku";
import { rupiah } from "@/components/buku/KartuBuku";

// ── ALAMAT TOKO ─────────────────────────────────────────────────────────
// ⚠️ PERBAIKAN 22Sep26 (permintaan Bos): "galeri klik harus ke
//    buku.bayana.id, bukan bayana.id/buku".
//
//    Sebelumnya tautannya `/buku/<slug>` (alamat relatif). Secara teknis
//    itu MEMANG sampai ke toko karena proxy.ts memindahkannya, TETAPI
//    alamat yang terlihat pembeli menjadi `bayana.id/buku/...` — toko
//    jadi tampak menumpang di alamat penerbit.
//
//    Sekarang tautannya LANGSUNG ke subdomain toko, jadi begitu diklik
//    alamat di peramban pembeli berubah sendiri menjadi
//    `buku.bayana.id/<nama-buku>`.
export const ALAMAT_TOKO = "https://buku.bayana.id";

// kartu buku untuk galeri berjalan
function BookCard({
  slug, judul, penulis, genre, harga, bintang, jumlahUlasan, warna, idx,
}: {
  slug: string;
  judul: string;
  penulis: string;
  genre: string;
  harga: number;
  bintang: number;
  jumlahUlasan: number;
  warna: [string, string, string];
  idx: number;
}) {
  return (
    <Link
      href={`${ALAMAT_TOKO}/buku/${slug}`}
      className="group/kartu flex w-40 shrink-0 flex-col"
      aria-label={`${judul} — ${rupiah(harga)}`}
    >
      {/* cover buku: digambar dengan kode, warna asli, ada pita SAMPLE */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-md shadow-[0_10px_25px_rgba(35,39,47,0.18)] transition-transform duration-300 group-hover/kartu:-translate-y-1">
        <CoverBuku
          buku={{ slug, judul, penulis, warna, sample: true }}
          kunci={`galeri-${idx}`}
          className="w-full h-auto block"
        />

        {/* kapsul harga — dibuat JELAS & TERBACA (putusan Bos) */}
        <span className="absolute bottom-2 left-2 rounded-full border border-[#c8a24a]/70 bg-[#fffaf0]/95 px-2.5 py-1 text-[11px] font-bold text-[#2f5d50] shadow-sm">
          {rupiah(harga)}
        </span>
      </div>

      {/* judul & penulis di bawah kartu */}
      <p className="mt-2 truncate text-center text-xs font-semibold text-acad-ink">
        {judul}
      </p>
      <p className="truncate text-center text-[11px] text-acad-ink-soft">
        {penulis}
      </p>
      <p className="mt-0.5 text-center text-[10.5px] text-acad-ink-soft">
        ★ {bintang.toFixed(1)} · {jumlahUlasan} ulasan
      </p>
    </Link>
  );
}

export default function BookGallery() {
  // Ambil dari data buku yang SAMA dengan toko, urutkan seperti di
  // katalog toko (buku paling laris/unggulan sudah ditaruh di depan
  // oleh pemilik katalog). TIDAK ada urutan baru buatan sini.
  const strip = [...buku, ...buku]; // duplikasi utk infinite seamless

  return (
    <section id="katalog" className="w-full bg-[#f6f1e6] py-14 md:py-20">
      <div className="mx-auto mb-8 max-w-6xl px-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-acad-gold">
          Katalog Buku
        </p>
        <h2 className="font-display-serif text-2xl font-semibold leading-tight text-acad-ink md:text-4xl">
          Karya yang telah kami terbitkan.
        </h2>
        <p className="mt-3 max-w-xl text-sm text-acad-ink-soft">
          Sentuh atau klik buku untuk melihat isinya, harga, dan cara
          memesannya.
        </p>
      </div>

      {/* Marquee container — ANIMASI TIDAK DIUBAH SAMA SEKALI */}
      <div className="book-gallery group relative overflow-hidden py-2">
        {/* fade ujung kiri-kanan */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#f6f1e6] to-transparent md:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#f6f1e6] to-transparent md:w-28" />

        <div className="book-gallery-track flex w-max gap-5 pl-5">
          {strip.map((b, i) => (
            <BookCard
              key={`${b.slug}-${i}`}
              slug={b.slug}
              judul={b.judul}
              penulis={b.penulis}
              genre={b.genre}
              harga={b.harga}
              bintang={b.rating ?? 0}
              jumlahUlasan={b.jumlah_ulasan ?? 0}
              warna={b.warna}
              idx={i}
            />
          ))}
        </div>
      </div>

      {/* CTA kecil */}
      <div className="mx-auto mt-10 max-w-6xl px-6 text-center">
        <a
          href="#kontak"
          className="inline-flex items-center gap-2 rounded-full border border-acad-gold/40 px-6 py-3 text-sm font-medium text-acad-ink transition-colors hover:bg-acad-gold hover:text-white"
        >
          Terbitkan Buku Anda →
        </a>
      </div>
    </section>
  );
}
