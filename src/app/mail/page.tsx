"use client";

import { useState } from "react";
import Link from "next/link";

// =============================================================
// WEBMAIL BAYANA — Halaman Login (pub.bikinaja.id/mail)
// Infrastruktur UI. Koneksi Gmail/OAuth akan disambung nanti
// saat email routing bayana.id aktif.
// =============================================================

export default function MailLogin() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const loginGoogle = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/mail/auth/login", { method: "POST" });
      const data = await res.json();
      if (data.redirect) {
        window.location.href = data.redirect;
      } else {
        setErr(data.message || "Autentikasi belum aktif.");
        setLoading(false);
      }
    } catch {
      setErr("Gagal terhubung ke server. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#0a0705] px-6 py-12 text-cream">
      {/* bokeh emas lembut di belakang */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#d4af37]/10 blur-[90px]" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#d4af37]/10 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#d4af37]/50 font-display-serif text-2xl font-bold text-[#d4af37]">
            B
          </div>
          <h1 className="font-display-serif text-2xl font-semibold text-cream">
            Bayana<span className="text-[#d4af37]">.Mail</span>
          </h1>
          <p className="mt-1 text-sm text-cream/60">Webmail Bayana Publishing</p>
        </div>

        {/* Kartu login */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur">
          {/* tombol Google */}
          <button
            onClick={loginGoogle}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white py-3 text-[15px] font-semibold text-[#24170c] transition-colors hover:bg-cream/95 disabled:opacity-60"
          >
            <GoogleIcon />
            {loading ? "Menghubungkan..." : "Masuk dengan Google"}
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-cream/40">
            <span className="h-px flex-1 bg-white/10" />
            atau
            <span className="h-px flex-1 bg-white/10" />
          </div>

          {/* form alamat email bayana */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setErr(
                "Login manual belum aktif. Gunakan tombol 'Masuk dengan Google' — akan tersambung saat email routing bayana.id aktif."
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-cream/80">
                Alamat Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@bayana.id"
                className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-[15px] text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-[#d4af37]/60"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl border border-[#d4af37]/50 py-3 text-sm font-semibold text-[#ffd97a] transition-colors hover:bg-[#d4af37]/15"
            >
              Masuk
            </button>
          </form>

          {err && (
            <p className="mt-4 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-center text-xs leading-relaxed text-red-300">
              {err}
            </p>
          )}

          <p className="mt-5 text-center text-[11px] leading-relaxed text-cream/40">
            Akses untuk staf & admin Bayana Publishing.
            <br />
            Butuh bantuan? Hubungi <span className="text-cream/60">support@bayana.id</span>
          </p>
        </div>

        <p className="mt-6 text-center">
          <Link href="/" className="text-xs text-cream/40 transition-colors hover:text-[#d4af37]">
            ← Kembali ke beranda
          </Link>
        </p>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 010-4.2V7.06H2.18a11 11 0 000 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 002.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}
