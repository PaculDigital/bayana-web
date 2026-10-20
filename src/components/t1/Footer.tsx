// =============================================================
// FOOTER LENGKAP — Bayana Publishing
// Brand + menu + layanan + kontak + sosmed + copyright.
// =============================================================

const NAV = [
  { href: "#beranda", label: "Beranda" },
  { href: "#tentang", label: "Tentang" },
  { href: "#layanan", label: "Layanan" },
  { href: "#paket", label: "Paket" },
  { href: "#katalog", label: "Katalog" },
  { href: "#kontak", label: "Kontak" },
];

const LAYANAN = [
  "Penerbitan Buku",
  "Konversi Skripsi → Buku",
  "Pengelolaan Jurnal (OJS)",
  "ISSN, DOI & Indeksasi",
  "Akreditasi SINTA",
];

export default function Footer() {
  return (
    <footer className="border-t border-acad-line bg-[#f6f1e6]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <a href="#beranda" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-acad-gold/50 font-display-serif text-base font-bold text-acad-gold">
                B
              </span>
              <span className="font-display-serif text-lg font-semibold text-acad-ink">
                Bayana<span className="text-acad-gold">.Publishing</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-acad-ink-soft">
              Penerbit yang mendampingi Akademisi dan Penulis menerbitkan Jurnal
              Ilmiah dan Buku — dari naskah hingga dikenal luas.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-acad-ink">Menu</h4>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-sm text-acad-ink-soft transition-colors hover:text-acad-gold">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-acad-ink">Layanan</h4>
            <ul className="mt-4 space-y-2.5">
              {LAYANAN.map((l) => (
                <li key={l} className="text-sm text-acad-ink-soft">{l}</li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-acad-ink">Kontak</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-acad-ink-soft">
              <li>
                <a href="mailto:admin@bayana.id" className="hover:text-acad-gold">admin@bayana.id</a>
              </li>
              <li>
                <a href="mailto:support@bayana.id" className="hover:text-acad-gold">support@bayana.id</a>
              </li>
              <li className="pt-1">
                <p className="font-medium text-acad-ink">PT Bayana Hasana Duna</p>
                <p>Jl. Palem Raya 21, Kota Bekasi</p>
              </li>
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
