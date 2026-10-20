import { NextResponse } from "next/server";

// =============================================================
// WEBMAIL — POST /api/mail/auth/login
// Kerangka infrastruktur. Belum aktif sampai email routing
// bayana.id hidup & Google OAuth Client dikonfigurasi.
//
// Nanti (saat aktif):
//   - redirect ke Google OAuth consent:
//     https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=https://pub.bikinaja.id/api/mail/auth/callback&response_type=code&scope=...&access_type=offline
//   - butuh env: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, MAIL_REDIRECT_URI
// =============================================================

export async function POST() {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Autentikasi email belum aktif. Menunggu email routing bayana.id & konfigurasi Google OAuth. Infrastruktur sudah siap.",
      },
      { status: 501 }
    );
  }

  // TODO (saat aktif): bangun Google OAuth consent URL
  // const redirectUri = process.env.MAIL_REDIRECT_URI;
  // const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?...`;
  return NextResponse.json({ ok: false, message: "Belum dikonfigurasi" }, { status: 501 });
}
