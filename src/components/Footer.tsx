import Image from "next/image";

// =============================================================
// FOOTER 4 KOLOM — Bayana Publishing (revisi dokumen butir 15)
// Kolom 1: logo + nama PT + teks + legalitas (SK AHU / NIB / NPWP)
// Kolom 2: Kontak redaksi (tombol WA — nomor TIDAK ditampilkan, koreksi Bos 30Sep26)
// Kolom 3: Paket harga + marketplace
// Kolom 4: Menu
// =============================================================

const MENU = [
  { href: "#beranda", label: "Beranda" },
  { href: "#paket", label: "Paket Harga" },
  { href: "#katalog", label: "Katalog" },
  { href: "#kontak", label: "Kontak" },
];

const TEKS = "Mitra para dosen dalam meningkatkan kinerja dan menyebarkan gagasan melalui penerbitan buku ber-ISBN yang berbasis pada PO PAK dan regulasi terbaru";

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

export default function Footer() {
  return (
    <footer className="border-t border-acad-line bg-[#f6f1e6]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* ── KOLOM 1: identitas PT + legalitas ── */}
          <div>
            <Image src="/logo-bayana.png" alt="Bayana Publishing" width={180} height={40} className="h-10 w-auto" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-acad-ink">
              PT. Bayana Hasana Duna
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
                    nilai
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

          {/* ── KOLOM 3: paket harga + marketplace ── */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-acad-ink">
              Paket Harga
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

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-acad-line pt-6 sm:flex-row">
          <p className="text-xs text-acad-ink-soft">
            © {new Date().getFullYear()} PT Bayana Hasana Duna. Hak cipta dilindungi.
          </p>
          <p className="font-display-serif text-xs text-acad-gold">
            bayana.id · Bayana Publishing
          </p>
        </div>
      </div>
    </footer>
  );
}