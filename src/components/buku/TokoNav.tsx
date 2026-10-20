// TokoNav.tsx — menu atas toko buku (tanda merek, tautan, cek pesanan,
// keranjang dengan lencana angka).
//
// ⚠️ RIWAYAT PERBAIKAN (penting, jangan diulang kesalahannya):
//
// 1. 22Sep26 (permintaan Bos): ikon kaca pembesar bulat TANPA tulisan
//    diganti tombol bertulisan "Cek Pesanan" warna soft orange.
//
// 2. 22Sep26 (TEGURAN Bos — Wulan melakukan kesalahan): di CSS, Wulan
//    SENDIRI menyembunyikan tulisan tombol pada layar ≤700px dengan
//    alasan "menu atas di HP kepadatan". Akibatnya di HP tombolnya
//    kembali menjadi LINGKARAN BERIKON saja — persis ikon search yang
//    Bos minta dibuang. Bos: "Kok masih ikon search… membingungkan."
//    ⇒ TULISAN "Cek Pesanan" SEKARANG SELALU TAMPIL di semua ukuran
//      layar. Aturan CSS yang menyembunyikannya SUDAH DIHAPUS.
//
// 3. 22Sep26 (permintaan Bos): tombol TIDAK lagi membuka halaman penuh,
//    tetapi memunculkan POPUP (lihat TombolCekPesanan.tsx).

import Link from "next/link";
import TombolCekPesanan from "@/components/buku/TombolCekPesanan";

/** Ikon keranjang — garis PUTIH agar kontras di lingkaran hijau. */
function IkonKeranjang() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3h2.2l2.4 11.2a1.6 1.6 0 0 0 1.6 1.3h9.1a1.6 1.6 0 0 0 1.6-1.3L21.4 7H6.1" />
      <circle cx="10" cy="20" r="1.7" fill="#fff" stroke="none" />
      <circle cx="18" cy="20" r="1.7" fill="#fff" stroke="none" />
    </svg>
  );
}

export default function TokoNav({ jumlahKeranjang = 0 }: {
  jumlahKeranjang?: number;
}) {
  return (
    <header className="toko-nav">
      <div className="toko-nav-dalam">
        <Link href="/buku" className="toko-merek">
          <b>BAYANA</b>
          <span>Buku</span>
        </Link>
        <nav className="toko-menu">
          {/* 🚨 PERBAIKAN 22Sep26 (teguran Bos): hapus "Katalog".
              Bos: "Kok masih ada tulisan Katalog, hapus siapa yang suruh
              buat? Kalau mau pindah ke depan tinggal klik tulisan BAYANA
              BUKU saja. Tidak perlu tulisan Katalog."
              ⇒ Menu = merek "BAYANA BUKU" (yang bisa diklik ke depan) +
                tombol "Cek Pesanan" + keranjang. TIDAK ADA menu lain. */}
          <TombolCekPesanan />

          <Link href="/buku/keranjang" className="toko-keranjang"
            aria-label="Keranjang belanja">
            <IkonKeranjang />
            {jumlahKeranjang > 0 && (
              <b className="lencana">{jumlahKeranjang}</b>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
