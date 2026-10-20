// route.ts (/api/buku/kontak) — pesan dari form Hubungi Penerbit.

import { NextResponse } from "next/server";
import { simpanPesan } from "@/lib/db";

export async function POST(req: Request) {
  let isi: { nama?: string; email?: string; subjek?: string; pesan?: string };
  try {
    isi = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, pesan: "Permintaan tidak terbaca." },
      { status: 400 }
    );
  }

  const nama = String(isi.nama ?? "").trim();
  const email = String(isi.email ?? "").trim();
  const pesan = String(isi.pesan ?? "").trim();
  const subjek = String(isi.subjek ?? "").trim() || "(tanpa subjek)";

  if (!nama || !email || !pesan) {
    return NextResponse.json(
      { ok: false, pesan: "Masih ada kolom yang perlu diisi ya." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, pesan: "Alamat emailnya belum benar." },
      { status: 400 }
    );
  }

  try {
    simpanPesan({ nama, email, subjek, pesan });
  } catch (e) {
    console.error("Gagal menyimpan pesan:", e);
    return NextResponse.json(
      { ok: false, pesan: "Pesan belum tersimpan. Coba sekali lagi ya." },
      { status: 500 }
    );
  }

  // ── KIRIM EMAIL ke MAIL_TO (default admin@bayana.id; diteruskan Cloudflare
  //    Email Routing ke Gmail) ──
  // Best-effort: pesan SUDAH tersimpan di DB, jadi kalau SMTP gagal pun
  // pesan tidak hilang — hanya status emailnya yang dilaporkan jujur.
  let statusEmail: "terkirim" | "gagal" | "belum-disetel" = "belum-disetel";
  if (process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS) {
    try {
      const nodemailer = await import("nodemailer");
      const transport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT || 587),
        secure: process.env.MAIL_SECURE === "true",
        auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
      });
      await transport.sendMail({
        from: `"Formulir bayana.id" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
        to: process.env.MAIL_TO || "admin@bayana.id",
        replyTo: `${nama} <${email}>`,
        subject: `[bayana.id] ${subjek}`.replace(/[\r\n]+/g, " "),
        text: `Pesan masuk dari formulir kontak bayana.id\n\nNama : ${nama}\nEmail: ${email}\nSubjek: ${subjek}\n\n${pesan}\n`,
      });
      statusEmail = "terkirim";
    } catch (e) {
      console.error("Gagal kirim email (pesan tetap tersimpan di DB):", e);
      statusEmail = "gagal";
    }
  }

  return NextResponse.json({
    ok: true,
    pesan: "Pesan terkirim.",
    email: statusEmail,
  });
}
