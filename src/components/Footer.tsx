import Image from "next/image";

// =============================================================
// FOOTER 4 KOLOM — PT Bayana Hasana Duna
// (revisi dokumen butir 15; revisi Perpusnas 20Oct26:
//  nama diseragamkan, janji ISBN dihapus, "Paket Harga" → "Layanan",
//  tambah Media Sosial placeholder, logo resmi baru)
// Kolom 1: logo + nama PT + teks + legalitas (SK AHU / NIB / NPWP)
// Kolom 2: Kontak redaksi (tombol WA — nomor TIDAK ditampilkan, koreksi Bos 30Sep26)
// Kolom 3: Layanan + marketplace
// Kolom 4: Menu
// =============================================================

const MENU = [
  { href: "#beranda", label: "Beranda" },
  { href: "#paket", label: "Layanan" },
  { href: "#katalog", label: "Katalog" },
  { href: "#kontak", label: "Kontak" },
];

const TEKS = "Mitra anda dalam menyebarkan ilmu pengetahuan melalui buku";

const LEGALITAS: [string, string][] = [
  ["", "SK.AHU-0074567.AH.01.01."],
  ["NIB", "1709260023459"],
  ["NPWP", "1000000011174122"],
];

const REDAKSI: [string, string[]][] = [
  ["Telepon", ["081317107179", "085111555246"]],
  ['Email', ['bayanahasanaduna@gmail.com', 'bayanapublishing@gmail.com']],
  ["Office", [
    "Jl. Palem Raya No.21 Kelurahan Jatimekar, Kecamatan Jatiasih, Kota Bekasi, Provinsi Jawa Barat, 17422",
  ]],
];

const PAKET = ["Buku Referensi", "Monograf", "Buku Ajar"];
const MARKETPLACE = ["Shopee", "Tokopedia"];

// Media sosial — PLACEHOLDER (20Oct26): URL asli menyusul dari Bos.
// Ikon kecil, warna emas, aria-label untuk aksesibilitas.
const SOSMED: { nama: string; href: string; path: string }[] = [
  {
    nama: "Instagram",
    href: "#",
    path: "M12 2.2c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.7 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85C2.42 3.92 3.94 2.38 7.19 2.23 8.46 2.21 8.84 2.2 12 2.2zm0 3.68a6.12 6.12 0 1 0 0 12.24 6.12 6.12 0 0 0 0-12.24zm0 10.1a3.98 3.98 0 1 1 0-7.96 3.98 3.98 0 0 1 0 7.96zm6.36-10.85a1.43 1.43 0 1 0 0 2.86 1.43 1.43 0 0 0 0-2.86z",
  },
  {
    nama: "Facebook",
    href: "#",
    path: "M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V11H8.2v3h2.5v7h2.8z",
  },
  {
    nama: "YouTube",
    href: "#",
    path: "M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z",
  },
  {
    nama: "LinkedIn",
    href: "#",
    path: "M6.94 8.5v12H3.06v-12h3.88zM5 2a2.25 2.25 0 1 1 0 4.5A2.25 2.25 0 0 1 5 2zm5.5 6.5h3.72v1.64h.05c.52-.98 1.79-2.02 3.68-2.02 3.94 0 4.67 2.6 4.67 5.97v6.91h-3.88v-6.13c0-1.46-.03-3.34-2.04-3.34-2.04 0-2.35 1.6-2.35 3.24v6.23H10.5v-12z",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-acad-line bg-[#f6f1e6]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* ── KOLOM 1: identitas PT + legalitas ── */}
          <div>
            {/* ACC Bos 20Oct26: footer ikut turun 10% proporsional (48px → 43px) */}
            <Image src="/logo-bayana-hd.png" alt="PT Bayana Hasana Duna" width={1189} height={176} className="h-[43px] w-auto" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-acad-ink">
              PT Bayana Hasana Duna
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-acad-ink-soft">
              {TEKS}
            </p>
            <ul className="mt-4 space-y-1.5">
              {LEGALITAS.map(([label, nilai]) => (
                <li key={nilai} className="text-[13px] text-acad-ink-soft">
                  {label ? (
                    <>
                      <span className="font-semibold text-acad-ink">{label}:</span> {nilai}
                    </>
                  ) : (
                    // SK AHU: tanpa label + BOLD (usulan kawan REVISI_WEB_8, ACC Bos 20Oct26)
                    <strong>{nilai}</strong>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ── KOLOM 2: kontak redaksi ── */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-acad-ink">
              Kontak Redaksi
            </h4>
            <ul className="mt-4 space-y-3">
              {REDAKSI.map(([label, nilai]) => (
                <li key={label}>
                  <p className="text-xs font-medium uppercase tracking-wide text-acad-gold">{label}</p>
                  {nilai.map((v) => (
                    <p key={v} className="text-sm text-acad-ink-soft">{v}</p>
                  ))}
                </li>
              ))}
            </ul>
            {/* Tombol WA */}
            <a
              href="https://wa.me/628511555248"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0E7A3F] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#0b6834]"
            >
              <svg viewBox="0 0 32 32" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M16.04 3C9.4 3 4 8.4 4 15.03c0 2.12.56 4.19 1.62 6.02L4 29l8.13-1.58a12.1 12.1 0 0 0 3.9.64h.01c6.64 0 12.04-5.4 12.04-12.03C28.08 8.4 22.68 3 16.04 3zm0 21.98h-.01a10 10 0 0 1-3.6-.68l-.26-.1-4.82.94.95-4.7-.17-.28a9.9 9.9 0 0 1-1.53-5.34c0-5.5 4.48-9.97 10-9.97 2.66 0 5.17 1.04 7.05 2.92a9.9 9.9 0 0 1 2.94 7.06c0 5.5-4.48 9.98-9.95 9.98zm5.47-7.46c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.09 3.2 5.07 4.48.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
              </svg>
              WhatsApp
            </a>
          </div>

          {/* ── KOLOM 3: layanan + marketplace ── */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-acad-ink">
              Layanan
            </h4>
            <ul className="mt-4 space-y-1.5">
              {PAKET.map((p) => (
                <li key={p}>
                  <a href="#paket" className="text-sm text-acad-ink-soft transition-colors hover:text-acad-gold">
                    {p}
                  </a>
                </li>
              ))}
            </ul>
            <h4 className="mt-6 text-sm font-semibold uppercase tracking-wider text-acad-ink">
              Marketplace
            </h4>
            <ul className="mt-3 space-y-1.5">
              {MARKETPLACE.map((m) => (
                <li key={m} className="text-sm text-acad-ink-soft">{m}</li>
              ))}
            </ul>
          </div>

          {/* ── KOLOM 4: menu ── */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-acad-ink">Menu</h4>
            <ul className="mt-4 space-y-2.5">
              {MENU.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-sm text-acad-ink-soft transition-colors hover:text-acad-gold">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── MEDIA SOSIAL (placeholder 20Oct26, URL menyusul) ── */}
        <div className="mt-12 border-t border-acad-line pt-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-acad-ink">
            Media Sosial
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            {SOSMED.map((s) => (
              <a
                key={s.nama}
                href={s.href}
                aria-label={s.nama}
                title={s.nama}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-acad-gold/40 text-acad-gold transition-colors hover:bg-acad-gold hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-acad-line pt-6 sm:flex-row">
          <p className="text-xs text-acad-ink-soft">
            © {new Date().getFullYear()} PT Bayana Hasana Duna. Hak cipta dilindungi.
          </p>
          <p className="font-display-serif text-xs text-acad-gold">
            bayana.id · PT Bayana Hasana Duna
          </p>
        </div>
      </div>
    </footer>
  );
}