// layout.tsx (bagian /buku) — kerangka halaman toko buku.
//
// Semua halaman di bawah /buku memakai kerangka ini: pita atas, navbar,
// lalu isi halaman. Tema SOFT GREEN (putusan Bos) — berbeda dari beranda
// bayana.id yang bernuansa gelap-emas.
//
// ⚠️ PERBAIKAN 22Sep26 (laporan Bos: "ikon keranjang tidak muncul tanda
//    angka setelah produk dimasukkan ke keranjang"):
//    Penyebabnya — <TokoNav /> dipanggil TANPA jumlah, sehingga
//    `jumlahKeranjang` selalu 0 dan lencana angka TIDAK PERNAH muncul.
//    Fungsi penghitungnya (`jumlahDiKeranjang`) sudah ada di lib/keranjang.ts
//    tetapi tidak pernah disambungkan → fitur mati senyap.
//
//    Sekarang jumlah dibaca di SERVER setiap kali halaman toko dibuka,
//    memakai tanda-browser yang sama dengan yang dipakai keranjang.
//    Karena Next.js merender ulang di server untuk tiap permintaan,
//    angka lencana ikut berubah begitu isi keranjang berubah.

import type { Metadata } from "next";
import "./buku.css";
import TokoNav from "@/components/buku/TokoNav";
import { ambilTanda } from "@/lib/tanda-browser";
import { jumlahDiKeranjang } from "@/lib/keranjang";

export const metadata: Metadata = {
  title: "Katalog Buku — PT Bayana Hasana Duna",
  description:
    "Katalog buku PT Bayana Hasana Duna: buku akademik, referensi, dan praktik untuk mahasiswa, dosen, dan praktisi.",
};

export default async function BukuLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // ── Hitung isi keranjang untuk lencana di navbar ──────────────────────
  // Tanda-browser dibaca dari cookie (tanpa login, sesuai keputusan Bos).
  // ⚠️ Kalau pembeli BELUM punya cookie tanda, JANGAN buat baru di sini —
  //    Server Component tidak boleh menulis cookie, dan kalau dipaksa
  //    lencana akan menunjuk keranjang yang salah. Cukup tampilkan 0.
  // Kalau gagal membaca (mis. DB belum siap), halaman toko TIDAK boleh
  //    ikut rusak — lencana cukup tidak muncul.
  let jumlahKeranjang = 0;
  try {
    const { tanda, baru } = await ambilTanda();
    if (!baru) {
      jumlahKeranjang = jumlahDiKeranjang(tanda);
    }
  } catch {
    jumlahKeranjang = 0;
  }

  return (
    <div className="toko">
      <div className="toko-pita">PT Bayana Hasana Duna &middot; Toko Buku</div>
      <TokoNav jumlahKeranjang={jumlahKeranjang} />
      {children}
    </div>
  );
}
