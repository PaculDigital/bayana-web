// tanda-browser.ts — penanda pembeli TANPA login (putusan Bos:
// "tidak perlu login atau jadi member, sederhana saja").
//
// CARA KERJA: server memberi satu kode acak yang disimpan di cookie
// browser pembeli. Kode itu dipakai untuk mengenali keranjang miliknya.
//
// ⚠️ BATAS JUJUR (bukan bug):
//   • Keranjang tidak ikut kalau pembeli ganti HP / ganti browser.
//   • Karena itu, NOMOR PESANAN-lah yang jadi kunci pelacakan — bukan
//     kode ini. Kode ini hanya untuk memudahkan sebelum memesan.

import { cookies } from "next/headers";

export const NAMA_COOKIE = "bayana_tanda";

/** Kode acak pendek yang aman dipakai sebagai tanda browser. */
function kodeAcak(): string {
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Ambil tanda browser yang ada. Kalau belum ada, KEMBALIKAN kode baru
 * supaya pemanggil bisa menyimpannya (Server Component tidak bisa
 * menulis cookie — penulisan dilakukan di Route Handler).
 */
export async function ambilTanda(): Promise<{
  tanda: string;
  baru: boolean;
}> {
  const c = await cookies();
  const ada = c.get(NAMA_COOKIE)?.value;
  if (ada && /^[0-9a-f]{32}$/.test(ada)) {
    return { tanda: ada, baru: false };
  }
  return { tanda: kodeAcak(), baru: true };
}
