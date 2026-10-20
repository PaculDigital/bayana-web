// route.ts (/api/buku/admin/status) — admin mengubah status pesanan.
//
// ⚠️ Pintu ini WAJIB memeriksa tanda masuk admin. Tanpa pemeriksaan
//    itu, siapa pun bisa mengubah status pesanan orang.

import { NextResponse } from "next/server";
import { adminMasuk } from "@/lib/admin";
import { ubahStatus, STATUS, type Status } from "@/lib/db";

export async function POST(req: Request) {
  if (!(await adminMasuk())) {
    return NextResponse.json(
      { ok: false, pesan: "Sesi admin sudah berakhir. Masuk lagi ya." },
      { status: 401 }
    );
  }

  let isi: { no_order?: string; status?: string; resi?: string };
  try {
    isi = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, pesan: "Permintaan tidak terbaca." },
      { status: 400 }
    );
  }

  const nomor = String(isi.no_order ?? "").trim().toUpperCase();
  const status = String(isi.status ?? "") as Status;

  if (!nomor) {
    return NextResponse.json(
      { ok: false, pesan: "Nomor pesanan tidak dikenali." },
      { status: 400 }
    );
  }
  if (!STATUS.includes(status)) {
    return NextResponse.json(
      { ok: false, pesan: "Status itu tidak dikenal." },
      { status: 400 }
    );
  }

  const berhasil = ubahStatus(
    nomor,
    status,
    `Diubah admin menjadi ${status}`,
    isi.resi !== undefined ? String(isi.resi).trim() : undefined
  );

  if (!berhasil) {
    return NextResponse.json(
      { ok: false, pesan: "Pesanan itu tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}
