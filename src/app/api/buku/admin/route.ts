// route.ts (/api/buku/admin) — masuk & keluar admin.

import { NextResponse } from "next/server";
import { periksaPassword, setelCookieAdmin, buangCookieAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  let isi: { password?: string };
  try {
    isi = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, pesan: "Permintaan tidak terbaca." },
      { status: 400 }
    );
  }

  const sandi = String(isi.password ?? "");
  if (!sandi) {
    return NextResponse.json(
      { ok: false, pesan: "Password masih kosong." },
      { status: 400 }
    );
  }

  const cocok = await periksaPassword(sandi);
  if (!cocok) {
    return NextResponse.json(
      { ok: false, pesan: "Password belum cocok. Coba lagi ya." },
      { status: 401 }
    );
  }

  const jawab = NextResponse.json({ ok: true });
  setelCookieAdmin(jawab);
  // tunggu sebentar supaya cookie dipastikan sudah terpasang
  await new Promise((r) => setTimeout(r, 30));
  return jawab;
}

export async function DELETE() {
  const jawab = NextResponse.json({ ok: true });
  buangCookieAdmin(jawab);
  return jawab;
}
