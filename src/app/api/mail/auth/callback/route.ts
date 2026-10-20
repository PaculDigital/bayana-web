import { NextResponse } from "next/server";

// =============================================================
// WEBMAIL — GET /api/mail/auth/callback
// Callback Google OAuth (stub). Belum aktif.
// Nanti: tukar `code` dengan access token via Google token endpoint,
// simpan session, redirect ke halaman inbox.
// =============================================================

export async function GET() {
  return NextResponse.json(
    { ok: false, message: "Callback OAuth belum aktif — menunggu email routing & konfigurasi Google." },
    { status: 501 }
  );
}
