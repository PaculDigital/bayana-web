// route.ts (/api/buku/pesanan/cek) — cek status pesanan dari POPUP.
//
// Dipakai oleh tombol "Cek Pesanan" di menu atas toko. Pembeli cukup
// memasukkan nomor pesanan, lalu statusnya muncul di dalam popup —
// TANPA berpindah halaman.
//
// ⚠️ Sengaja HANYA mengembalikan data yang memang perlu ditampilkan:
//    nomor, nama penerima, status, total, tanggal, dan daftar buku.
//    Alamat lengkap & nomor HP TIDAK dikirim balik, karena siapa pun
//    yang tahu nomor pesanan bisa memanggil alamat ini — jadi jangan
//    sampai alamat rumah ikut terbaca dari sini. Alamat lengkap tetap
//    bisa dilihat di halaman /buku/lacak sesudah nomor diverifikasi.
//
// Tanpa login, sesuai keputusan lama: cukup nomor pesanan.

import { NextRequest, NextResponse } from "next/server";
import { ambilPesanan, LABEL_STATUS } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const no = (req.nextUrl.searchParams.get("no") ?? "").trim().toUpperCase();

  if (!no) {
    return NextResponse.json(
      { ok: false, pesan: "Masukkan nomor pesanan dulu ya." },
      { status: 400 }
    );
  }

  const data = ambilPesanan(no);

  if (!data) {
    return NextResponse.json({
      ok: false,
      pesan: `Nomor ${no} tidak ditemukan. Periksa lagi hurufnya ya — biasanya berbentuk BYN- lalu 8 huruf, contoh: BYN-K7X2M9QP.`,
    });
  }

  const p = data.pesanan;
  return NextResponse.json({
    ok: true,
    no_order: p.no_order,
    nama: p.nama_penerima,
    status: p.status,
    status_label: LABEL_STATUS[p.status] ?? p.status,
    total: p.total,
    dibuat_pada: p.dibuat_pada,
    butir: data.butir.map((b) => ({
      judul: b.judul_buku,
      jumlah: b.jumlah,
    })),
  });
}
