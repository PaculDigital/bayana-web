// route.ts (/api/buku/pesanan) — membuat pesanan baru.
//
// Alur: periksa data → hitung ulang harga di SERVER (jangan percaya
// angka dari browser) → terbitkan nomor pesanan BYN-XXXXXXXX →
// simpan → kosongkan buku yang dibeli dari keranjang.
//
// ⚠️ HARGA DIHITUNG ULANG DI SINI. Kalau harga hanya percaya dari
//    browser, orang bisa mengubah harga di komputernya sendiri.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ambilBuku, ONGKIR_FLAT } from "@/data/buku";
import { isiKeranjang, kosongkanKeranjang } from "@/lib/keranjang";
import { NAMA_COOKIE } from "@/lib/tanda-browser";
import { buatNomorOrder, simpanPesanan } from "@/lib/db";

export async function POST(req: Request) {
  let isi: {
    nama_penerima?: string;
    hp?: string;
    alamat?: string;
    kelurahan?: string;
    kecamatan?: string;
    kota?: string;
    provinsi?: string;
    kode_pos?: string;
    catatan?: string;
    beli?: string[];
  };
  try {
    isi = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, pesan: "Permintaan tidak terbaca." },
      { status: 400 }
    );
  }

  // Kolom WAJIB (perbaikan 22Sep26: kecamatan & kelurahan ikut wajib,
  // menyesuaikan permintaan Bos).
  const kurang = ([
    "nama_penerima", "hp", "alamat", "kelurahan", "kecamatan",
    "kota", "provinsi",
  ] as const)
    .filter((k) => !String(isi[k] ?? "").trim());
  if (kurang.length > 0) {
    return NextResponse.json(
      { ok: false, pesan: "Masih ada kolom yang perlu diisi ya." },
      { status: 400 }
    );
  }

  const c = await cookies();
  const tanda = c.get(NAMA_COOKIE)?.value ?? "";
  if (!tanda) {
    return NextResponse.json(
      {
        ok: false,
        pesan: "Keranjang tidak dikenali di server. Buka keranjang sekali lagi, lalu ulangi.",
      },
      { status: 400 }
    );
  }

  const dipilih = isi.beli ?? [];
  if (dipilih.length === 0) {
    return NextResponse.json(
      { ok: false, pesan: "Belum ada buku yang dipilih." },
      { status: 400 }
    );
  }

  // ambil jumlah dari keranjang (sumber kebenaran), harga dari katalog
  const isiK = isiKeranjang(tanda).filter((b) => dipilih.includes(b.slug_buku));
  if (isiK.length === 0) {
    return NextResponse.json(
      { ok: false, pesan: "Buku yang dipilih tidak ada di keranjang." },
      { status: 400 }
    );
  }

  const butirPesan: {
    slug: string; judul: string; harga: number; jumlah: number;
  }[] = [];
  for (const b of isiK) {
    const buku = ambilBuku(b.slug_buku);
    if (!buku) continue;
    butirPesan.push({
      slug: buku.slug,
      judul: buku.judul,
      harga: buku.harga,      // ← harga DARI KATALOG, bukan dari browser
      jumlah: Math.max(1, b.jumlah),
    });
  }
  if (butirPesan.length === 0) {
    return NextResponse.json(
      { ok: false, pesan: "Buku yang dipilih sudah tidak tersedia." },
      { status: 400 }
    );
  }

  const subtotal = butirPesan.reduce((t, b) => t + b.harga * b.jumlah, 0);
  const total = subtotal + ONGKIR_FLAT;
  const noOrder = buatNomorOrder();

  try {
    simpanPesanan({
      no_order: noOrder,
      nama_penerima: String(isi.nama_penerima).trim(),
      hp: String(isi.hp).trim(),
      alamat: String(isi.alamat).trim(),
      kelurahan: String(isi.kelurahan).trim(),
      kecamatan: String(isi.kecamatan).trim(),
      kota: String(isi.kota).trim(),
      provinsi: String(isi.provinsi).trim(),
      kode_pos: String(isi.kode_pos ?? "").trim() || undefined,
      catatan: String(isi.catatan ?? "").trim() || undefined,
      ongkir: ONGKIR_FLAT,
      subtotal,
      total,
      butir: butirPesan,
    });
  } catch (e) {
    console.error("Gagal menyimpan pesanan:", e);
    return NextResponse.json(
      {
        ok: false,
        pesan: "Pesanan belum tersimpan di server. Coba tekan sekali lagi ya.",
      },
      { status: 500 }
    );
  }

  // buang buku yang sudah dipesan dari keranjang
  kosongkanKeranjang(tanda, butirPesan.map((b) => b.slug));

  return NextResponse.json({ ok: true, no_order: noOrder, total });
}
