// route.ts (/api/buku/keranjang) — urusan keranjang dari sisi server.
//
// TINDAKAN yang diterima (pakai `aksi`):
//   "tambah"  { slug, jumlah }  → masukkan buku ke keranjang
//   "jumlah"  { id, jumlah }    → ubah banyaknya
//   "buang"   { id }            → keluarkan satu butir
//
// ⚠️ Tanda-browser WAJIB diset di sini (Route Handler boleh menulis
//    cookie; Server Component tidak boleh).

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { NAMA_COOKIE } from "@/lib/tanda-browser";
import {
  tambahKeranjang,
  ubahJumlah,
  buangButir,
  jumlahDiKeranjang,
} from "@/lib/keranjang";
import { ambilBuku } from "@/data/buku";

function tandaBaru(): string {
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: Request) {
  let isi: {
    aksi?: string;
    slug?: string;
    id?: number;
    jumlah?: number;
  };
  try {
    isi = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, pesan: "Permintaan tidak terbaca." },
      { status: 400 }
    );
  }

  const c = await cookies();
  let tanda = c.get(NAMA_COOKIE)?.value ?? "";
  let perluSetel = false;
  if (!/^[0-9a-f]{32}$/.test(tanda)) {
    tanda = tandaBaru();
    perluSetel = true;
  }

  let hasil: { ok: boolean; pesan: string; jumlah?: number };

  switch (isi.aksi) {
    case "tambah": {
      const buku = isi.slug ? ambilBuku(isi.slug) : undefined;
      if (!buku) {
        hasil = { ok: false, pesan: "Buku tidak ditemukan di katalog." };
        break;
      }
      tambahKeranjang(tanda, buku.slug, Math.max(1, isi.jumlah ?? 1));
      hasil = { ok: true, pesan: `${buku.judul} masuk keranjang.` };
      break;
    }
    case "jumlah": {
      if (typeof isi.id !== "number") {
        hasil = { ok: false, pesan: "Butir keranjang tidak dikenali." };
        break;
      }
      ubahJumlah(tanda, isi.id, Math.max(1, isi.jumlah ?? 1));
      hasil = { ok: true, pesan: "Jumlah diperbarui." };
      break;
    }
    case "buang": {
      if (typeof isi.id !== "number") {
        hasil = { ok: false, pesan: "Butir keranjang tidak dikenali." };
        break;
      }
      buangButir(tanda, isi.id);
      hasil = { ok: true, pesan: "Buku dikeluarkan dari keranjang." };
      break;
    }
    default:
      hasil = { ok: false, pesan: "Tindakan tidak dikenal." };
  }

  hasil.jumlah = jumlahDiKeranjang(tanda);

  const jawab = NextResponse.json(hasil, { status: hasil.ok ? 200 : 400 });
  if (perluSetel) {
    jawab.cookies.set(NAMA_COOKIE, tanda, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 120,   // 120 hari
    });
  }
  return jawab;
}

/** Jumlah keping di keranjang — dipakai lencana navbar. */
export async function GET() {
  const c = await cookies();
  const tanda = c.get(NAMA_COOKIE)?.value ?? "";
  return NextResponse.json({
    ok: true,
    jumlah: tanda ? jumlahDiKeranjang(tanda) : 0,
  });
}
