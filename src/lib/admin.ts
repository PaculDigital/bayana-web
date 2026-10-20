// admin.ts — pintu masuk halaman admin.
//
// Putusan Bos: "Admin sederhana (1 password)".
//
// ⚠️ Password diambil dari variabel lingkungan BAYANA_ADMIN_PASSWORD.
//    TIDAK ditulis di dalam kode (aturan keras: kredensial hanya di
//    .env / vault).
//
// CARA KERJA: setelah password benar, server memberi cookie bertanda
// tangan. Cookie itu yang membuat admin tidak perlu mengetik ulang.

import { cookies } from "next/headers";
import crypto from "node:crypto";

const NAMA_COOKIE_ADMIN = "bayana_admin";
const UMUR_DETIK = 60 * 60 * 12;   // 12 jam

function passwordBenar(): string {
  return process.env.BAYANA_ADMIN_PASSWORD ?? "";
}

/** Apakah admin sudah pernah login di browser ini? */
export async function adminMasuk(): Promise<boolean> {
  const c = await cookies();
  const nilai = c.get(NAMA_COOKIE_ADMIN)?.value;
  if (!nilai) return false;
  return nilai === (await tandaTangan());
}

/** Cocokkan password yang diketik dengan yang ada di .env. */
export async function periksaPassword(diketik: string): Promise<boolean> {
  const benar = passwordBenar();
  if (!benar) return false;   // belum dipasang → tidak ada yang bisa masuk
  const a = Buffer.from(diketik);
  const b = Buffer.from(benar);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Tanda tangan sesi admin. Dihitung dari password + tanggal, jadi
 * otomatis kedaluwarsa sendiri dan tidak bisa dipalsukan tanpa tahu
 * passwordnya.
 */
async function tandaTangan(): Promise<string> {
  const hari = new Date().toISOString().slice(0, 10);
  return crypto
    .createHash("sha256")
    .update(`${passwordBenar()}::bayana::${hari}`)
    .digest("hex");
}

/** Simpan tanda masuk admin (dipanggil dari Route Handler). */
export function setelCookieAdmin(
  jawab: import("next/server").NextResponse
): void {
  void tandaTangan().then((t) => {
    jawab.cookies.set(NAMA_COOKIE_ADMIN, t, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: UMUR_DETIK,
    });
  });
}

/** Buang tanda masuk (keluar). */
export function buangCookieAdmin(
  jawab: import("next/server").NextResponse
): void {
  jawab.cookies.set(NAMA_COOKIE_ADMIN, "", { path: "/", maxAge: 0 });
}

export { NAMA_COOKIE_ADMIN };
