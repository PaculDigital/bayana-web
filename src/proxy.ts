// proxy.ts — PENJAGA PINTU: memisahkan PENERBIT dan TOKO berdasarkan
// nama domain yang diakses pengunjung.
//
// ⚠️ CATATAN VERSI (22Sep26): Next.js 16 mengganti nama aturan berkas
//    `middleware` menjadi `proxy` (middleware sudah USANG). Nama fungsi
//    yang diekspor juga `proxy`, bukan `middleware`. Wulan sempat
//    memakai nama lama dan build memberi peringatan usang — sudah
//    dibetulkan mengikuti dokumen resmi di
//    node_modules/next/dist/docs/…/proxy.md
//
// MASALAH YANG DIPERBAIKI (laporan Bos 22Sep26):
//   "Kok halaman harusnya di buku.bayana.id jadi di bayana.id/buku?"
//
//   Sebabnya: kedua domain (bayana.id dan buku.bayana.id) melayani
//   aplikasi yang SAMA, dan aplikasi itu hanya punya SATU halaman depan.
//   Jadi buku.bayana.id ikut menampilkan halaman jasa penerbitan —
//   padahal seharusnya toko.
//
// CARA KERJA:
//   • Dilihat dari DOMAIN (host), bukan dari perubahan halaman.
//     - buku.bayana.id  → semua alamat dianggap berada di dalam toko.
//     - selain itu      → seperti biasa (bayana.id = jasa penerbitan).
//
//   • Permintaan  buku.bayana.id/keranjang  → dilayani oleh /buku/keranjang
//     Permintaan  buku.bayana.id/bayar/xxx  → dilayani oleh /buku/bayar/xxx
//
//   Perhatikan: HALAMANNYA TIDAK DIPINDAHKAN (bukan pengalihan/redirect).
//   Yang dipakai adalah penulisan-ulang di dalam server (rewrite), jadi
//   alamat yang dilihat pengunjung tetap bersih: buku.bayana.id/keranjang
//
//   • Permintaan  buku.bayana.id/  → ditampilkan sebagai /buku
//     (beranda toko, bukan beranda penerbitan)
//
// ATURAN YANG DIPATUHI:
//   • TIDAK ada halaman yang diubah — halaman /buku/* tetap apa adanya.
//   • Halaman yang sudah punya awalan /buku tidak ditulis ulang dua kali.
//   • Kalau nama domain tidak dikenali, aplikasi berjalan seperti biasa
//     (jadi bayana.id TIDAK mungkin ikut berubah jadi toko).

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Domain yang melayani TOKO BUKU. */
const DOMAIN_TOKO = ["buku.bayana.id"];

export function proxy(req: NextRequest) {
  // ── 1. Domain apa yang diakses? ────────────────────────────────────────
  //    `host` bisa memuat port (mis. localhost:3021) → buang portnya.
  const host = (req.headers.get("host") ?? "").split(":")[0].toLowerCase();

  const iniToko = DOMAIN_TOKO.includes(host);

  // ── 2. Bukan domain toko → jalankan seperti biasa ──────────────────────
  if (!iniToko) {
    return NextResponse.next();
  }

  // ── 3. Di domain toko ─────────────────────────────────────────────────
  const jalur = req.nextUrl.pathname;

  // Kalau pengunjung sudah mengetik /buku/... sendiri, biarkan apa adanya.
  if (jalur === "/buku" || jalur.startsWith("/buku/")) {
    return NextResponse.next();
  }

  // Beranda toko: buku.bayana.id/  →  isi halaman /buku
  if (jalur === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/buku";
    return NextResponse.rewrite(url);
  }

  // Alamat toko lain: /keranjang, /alamat, /pesanan, /lacak, /kontak,
  // /admin, /bayar/xxx, dan /<nama-buku> → dilayani oleh /buku/…
  const url = req.nextUrl.clone();
  url.pathname = `/buku${jalur}`;
  return NextResponse.rewrite(url);
}

// ⚠️ Jangan jalankan penjaga ini untuk berkas bawaan Next.js (/_next),
//    gambar, favicon, dan berkas API — biar tidak ada yang terganggu.
export const config = {
  matcher: ["/((?!_next/|api/|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)"],
};
