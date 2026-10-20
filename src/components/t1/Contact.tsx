"use client";

import { useState } from "react";

// =============================================================
// KONTAK / CTA — Bayana Publishing
// Email admin@bayana.id & support@bayana.id; WA placeholder;
// form kontak ringkas (non-persist, tampilkan pesan terkirim).
// =============================================================

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nama: "", email: "", pesan: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.email || !form.pesan) return;
    setSent(true);
  };

  return (
    <section id="kontak" className="w-full bg-[#faf7f0]">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Kiri: info kontak */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-acad-gold">
              Hubungi Kami
            </p>
            <h2 className="font-display-serif text-3xl font-semibold leading-tight text-acad-ink md:text-4xl">
              Mari wujudkan karya Anda menjadi nyata.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-acad-ink-soft">
              Tim kami siap membantu mulai dari konsultasi naskah, memilih paket, hingga
              pengelolaan jurnal ilmiah.
            </p>

            <ul className="mt-8 space-y-5">
              <ContactRow
                icon="M4 4h16v16H4zM4 6l8 6 8-6"
                label="Email"
                value={["admin@bayana.id", "support@bayana.id"]}
                href="mailto:admin@bayana.id"
              />
              <ContactRow
                icon="M20 15v3a1 1 0 01-1.1 1 18 18 0 01-7.9-2.8 17.7 17.7 0 01-5.2-5.2A18 18 0 012 3.1 1 1 0 013 2h3a1 1 0 011 .7c.3 1.2.7 2.4 1.2 3.4a1 1 0 01-.2 1.1L6.5 8.6a14.5 14.5 0 005.9 5.9l1.4-1.5a1 1 0 011.1-.2c1 .5 2.2.9 3.4 1.2a1 1 0 01.7 1z"
                label="WhatsApp"
                value={["+62 812-XXXX-XXXX (placeholder)"]}
                href="#"
              />
              <ContactRow
                icon="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zM12 12a3 3 0 100-6 3 3 0 000 6z"
                label="Kantor"
                value={["PT Bayana Hasana Duna", "Jl. Palem Raya 21, Kota Bekasi"]}
              />
            </ul>
          </div>

          {/* Kanan: form */}
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
                <button
                  type="submit"
                  className="w-full rounded-full bg-acad-gold py-3.5 text-sm font-semibold text-white transition-colors hover:bg-acad-gold/90"
                >
                  Kirim Pesan
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

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: string;
  label: string;
  value: string[];
  href?: string;
}) {
  return (
    <li className="flex items-start gap-4">
      <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-acad-gold/25 text-acad-gold">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d={icon} />
        </svg>
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-acad-ink-soft">{label}</p>
        {value.map((v, i) =>
          href && i === 0 ? (
            <a key={v} href={href} className="block text-[15px] font-medium text-acad-ink hover:text-acad-gold">
              {v}
            </a>
          ) : (
            <p key={v} className="text-[15px] font-medium text-acad-ink">{v}</p>
          )
        )}
      </div>
    </li>
  );
}
