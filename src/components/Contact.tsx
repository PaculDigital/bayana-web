"use client";

import { useState } from "react";

// =============================================================
// KONTAK — Bayana Publishing (revisi dokumen butir 14, 30Sep2026)
//
// • Teks/email/telp/alamat lama DIHAPUS → diganti teks dokumen.
// • Formulir kirim pesan TIDAK dihapus (tetap), sekarang BENAR-BENAR
//   tersimpan via POST /api/buku/kontak → tabel pesan_masuk →
//   terlihat di halaman admin. Tujuan akhir: admin@bayana.id
//   (diteruskan Cloudflare Email Routing ke Gmail; SMTP menyusul —
//   data sudah tersimpan dulu, tidak hilang).
// • Tombol WA → 085111555248.
// =============================================================

const NOMOR_WA = "6285111555248"; // 085111555248

const TEKS_DOKUMEN =
  "Prosesnya tidak akan rumit. Tidak harus mengirim naskah sempurna. " +
  "Bahkan cukup dengan beritahu kami gagasan anda. Kami siap menemani " +
  "dari nol hingga terbit buku ber-ISBN yang sesuai PO PAK dan regulasi " +
  "terbaru untuk kelancaran BKD dan Jafung anda.";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState("");
  const [form, setForm] = useState({ nama: "", email: "", pesan: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.email || !form.pesan || sibuk) return;
    setSibuk(true);
    setGalat("");
    try {
      const res = await fetch("/api/buku/kontak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: form.nama,
          email: form.email,
          subjek: "Formulir bayana.id",
          pesan: form.pesan,
        }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) {
        setGalat(data.pesan || "Pesan belum terkirim. Coba sekali lagi ya.");
        return;
      }
      setSent(true);
    } catch {
      setGalat("Jaringan bermasalah. Coba sekali lagi ya.");
    } finally {
      setSibuk(false);
    }
  };

  return (
    <section id="kontak" className="w-full bg-[#faf7f0]">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Kiri: teks sesuai dokumen butir 14 */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-acad-gold">
              Hubungi Kami
            </p>
            <h2 className="font-display-serif text-3xl font-semibold leading-tight text-acad-ink md:text-4xl">
              Mari wujudkan karya Anda menjadi nyata.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-acad-ink-soft">
              {TEKS_DOKUMEN}
            </p>

            <p className="mt-7 text-[15px] font-semibold text-acad-ink">
              Yuk, Kirim Pesan atau klik tombol WA
            </p>
            <a
              href={`https://wa.me/${NOMOR_WA}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2.5 rounded-full bg-[#0E7A3F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0b6834]"
            >
              <svg viewBox="0 0 32 32" className="h-5 w-5" fill="currentColor" aria-hidden>
                <path d="M16.04 3C9.4 3 4 8.4 4 15.03c0 2.12.56 4.19 1.62 6.02L4 29l8.13-1.58a12.1 12.1 0 0 0 3.9.64h.01c6.64 0 12.04-5.4 12.04-12.03C28.08 8.4 22.68 3 16.04 3zm0 21.98h-.01a10 10 0 0 1-3.6-.68l-.26-.1-4.82.94.95-4.7-.17-.28a9.9 9.9 0 0 1-1.53-5.34c0-5.5 4.48-9.97 10-9.97 2.66 0 5.17 1.04 7.05 2.92a9.9 9.9 0 0 1 2.94 7.06c0 5.5-4.48 9.98-9.95 9.98zm5.47-7.46c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.09 3.2 5.07 4.48.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
              </svg>
              Chat WhatsApp
            </a>
          </div>

          {/* Kanan: formulir (tetap, sesuai dokumen) */}
          <div className="rounded-2xl border border-acad-line bg-white p-8 shadow-[0_12px_35px_rgba(35,39,47,0.06)]">
            {sent ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-acad-gold/15 text-acad-gold">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display-serif text-xl font-semibold text-acad-ink">Pesan Terkirim</h3>
                <p className="mt-2 max-w-xs text-sm text-acad-ink-soft">
                  Terima kasih, {form.nama || "Bos"}! Tim kami akan menghubungi Anda segera.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ nama: "", email: "", pesan: "" }); }}
                  className="mt-6 text-sm font-medium text-acad-gold hover:underline"
                >
                  Kirim pesan lain
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <h3 className="font-display-serif text-lg font-semibold text-acad-ink">
                  Kirim pesan
                </h3>
                <Field label="Nama" required>
                  <input
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    placeholder="Nama lengkap"
                    required
                    className="w-full rounded-lg border border-acad-line bg-[#faf7f0] px-4 py-3 text-[15px] text-acad-ink outline-none transition-colors focus:border-acad-gold"
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@contoh.com"
                    required
                    className="w-full rounded-lg border border-acad-line bg-[#faf7f0] px-4 py-3 text-[15px] text-acad-ink outline-none transition-colors focus:border-acad-gold"
                  />
                </Field>
                <Field label="Pesan" required>
                  <textarea
                    rows={4}
                    value={form.pesan}
                    onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                    placeholder="Ceritakan naskah / kebutuhan Anda..."
                    required
                    className="w-full resize-none rounded-lg border border-acad-line bg-[#faf7f0] px-4 py-3 text-[15px] text-acad-ink outline-none transition-colors focus:border-acad-gold"
                  />
                </Field>
                {galat && (
                  <p className="rounded-lg border border-[#e3b7b0] bg-[#fdf3f1] px-4 py-2.5 text-sm font-medium text-[#a03b2c]">
                    {galat}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sibuk}
                  className="w-full rounded-full bg-acad-gold py-3.5 text-sm font-semibold text-white transition-colors hover:bg-acad-gold/90 disabled:opacity-60"
                >
                  {sibuk ? "Mengirim..." : "Kirim Pesan"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-acad-ink">
        {label} {required && <span className="text-acad-gold">*</span>}
      </span>
      {children}
    </label>
  );
}
