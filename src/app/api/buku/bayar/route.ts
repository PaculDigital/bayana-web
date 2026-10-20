// route.ts (/api/buku/bayar) — konfirmasi "Saya sudah bayar".
//
// ⚠️ HANYA MENCATAT niat pembeli; TIDAK menaikkan status pesanan.
//    Status naik kalau ADMIN di halaman admin sudah memastikan dana
//    masuk. Ini putusan Bos (Opsi A: admin sederhana, aman dari
//    klaim bayar palsu).

import { NextResponse } from "next/server";
import { ambilPesanan, rapikanNomorOrder, tandaiSudahBayar } from "@/lib/db";

export async function POST(req: Request) {
  let isi: { no_order?: string; nama?: string };
  try {
    isi = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, pesan: "Permintaan tidak terbaca." },
      { status: 400 }
    );
  }

  const nomor = rapikanNomorOrder(String(isi.no_order ?? ""));
  if (!nomor) {
    return NextResponse.json(
      { ok: false, pesan: "Nomor pesanan masih kosong." },
      { status: 400 }
    );
  }

  const data = ambilPesanan(nomor);
  if (!data) {
    return NextResponse.json(
      {
        ok: false,
        pesan:
          "Nomor pesanan itu tidak ditemukan. Periksa lagi ya — biasanya berbentuk BYN- lalu 8 huruf.",
      },
      { status: 404 }
    );
  }

  tandaiSudahBayar(nomor, String(isi.nama ?? "").trim());

  return NextResponse.json({
    ok: true,
    no_order: nomor,
    status: data.pesanan.status,
    pesan: "Konfirmasi pembayaran sudah tercatat.",
  });
}
