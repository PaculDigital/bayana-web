// route.ts (/api/buku/nilai) — menyimpan penilaian pembeli.
//
// Syarat: nomor pesanan harus ADA di database, dan buku itu memang
// dibeli dalam pesanan tersebut. Dua pagar ini yang membuat ulasan
// tidak bisa diisi sembarang orang.

import { NextResponse } from "next/server";
import { ambilPesanan, simpanPenilaian, ringkasPenilaian } from "@/lib/db";

export async function POST(req: Request) {
  let isi: {
    no_order?: string;
    slug_buku?: string;
    bintang?: number;
    komentar?: string;
    nama?: string;
  };
  try {
    isi = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, pesan: "Permintaan tidak terbaca." },
      { status: 400 }
    );
  }

  const nomor = String(isi.no_order ?? "").trim().toUpperCase();
  const slug = String(isi.slug_buku ?? "").trim();
  const bintang = Math.round(Number(isi.bintang ?? 0));

  if (!nomor || !slug) {
    return NextResponse.json(
      { ok: false, pesan: "Nomor pesanan atau buku tidak dikenali." },
      { status: 400 }
    );
  }
  if (bintang < 1 || bintang > 5) {
    return NextResponse.json(
      { ok: false, pesan: "Bintang harus antara 1 sampai 5." },
      { status: 400 }
    );
  }

  const data = ambilPesanan(nomor);
  if (!data) {
    return NextResponse.json(
      { ok: false, pesan: "Nomor pesanan tidak ditemukan." },
      { status: 404 }
    );
  }

  // pagar: buku itu harus benar-benar ada di pesanan ini
  const dibeli = data.butir.some((b) => b.slug_buku === slug);
  if (!dibeli) {
    return NextResponse.json(
      {
        ok: false,
        pesan: "Buku itu tidak ada di pesanan ini, jadi belum bisa dinilai.",
      },
      { status: 403 }
    );
  }

  const tersimpan = simpanPenilaian({
    no_order: nomor,
    slug_buku: slug,
    bintang,
    komentar: String(isi.komentar ?? "").trim() || undefined,
    nama: data.pesanan.nama_penerima,
  });

  if (!tersimpan) {
    return NextResponse.json({
      ok: true,
      sudah: true,
      pesan: "Buku ini sudah pernah kamu nilai — terima kasih.",
    });
  }

  return NextResponse.json({
    ok: true,
    pesan: "Ulasan tersimpan.",
    ringkas: ringkasPenilaian(slug),
  });
}
