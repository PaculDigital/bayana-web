// CoverBuku.tsx — cover buku yang digambar dengan kode (SVG).
//
// KENAPA DIGAMBAR, BUKAN GAMBAR JPG:
//   • ringan (tidak ada berkas gambar), tajam di HP maupun laptop
//   • bebas masalah hak cipta
//   • warna otomatis berbeda tiap buku (lihat `warna` di buku.ts)
//
// Bentuknya dibuat seperti buku sungguhan: ada PUNGGUNG (spine) di kiri,
// kilau cahaya dari kiri atas, bingkai emas, judul, penulis, dan pita
// "SAMPLE" miring untuk buku contoh.

import { Buku } from "@/data/buku";

/**
 * CoverBuku hanya benar-benar MEMAKAI lima hal dari data buku.
 * Dengan menyebutkan yang dipakai saja, komponen ini bisa dipanggil
 * dari mana pun (galeri depan, toko, keranjang) TANPA memaksa
 * mengisi seluruh isi Buku atau menipu TypeScript dengan `as never`.
 */
export type CoverRingkas = Pick<
  Buku, "slug" | "judul" | "penulis" | "warna" | "sample"
>;

function pecahJudul(judul: string, maks: number, barisMaks: number): string[] {
  const kata = judul.split(/\s+/);
  const hasil: string[] = [];
  let buf = "";
  for (const k of kata) {
    if (buf && (buf + " " + k).length > maks) {
      hasil.push(buf);
      buf = k;
    } else {
      buf = buf ? buf + " " + k : k;
    }
  }
  if (buf) hasil.push(buf);
  if (hasil.length > barisMaks) {
    const sisa = hasil.splice(barisMaks - 1);
    hasil.push(sisa.join(" "));
  }
  return hasil;
}

export default function CoverBuku({
  buku,
  className = "",
  kunci = "0",
}: {
  buku: CoverRingkas;
  className?: string;
  /** pembeda supaya `id` tetap UNIK bila cover dipakai berkali-kali
   *  dalam satu halaman (mis. galeri berisi 16 kartu). */
  kunci?: string | number;
}) {
  const [gelap, terang, pekat] = buku.warna;
  const baris = pecahJudul(buku.judul, 13, 3);
  const ukuran =
    baris.length >= 3 ? 17 : baris.length === 2 ? 19 : 21;
  const yAwal = 122 - (baris.length - 1) * 13;
  const yGaris = yAwal + (baris.length - 1) * 24 + 20;
  // ⚠️ Di beranda, buku yang sama muncul DUA KALI (marquee digandakan
  //    supaya mulus) → id dari slug saja akan TABRAKAN. Karena itu
  //    `kunci` ikut masuk ke dalam id. (Terbukti 22Sep26: id gradasi
  //    `g-manajemen-strategi` muncul 2× dalam satu halaman.)
  const id = kunci === "0" ? buku.slug : `${buku.slug}-${kunci}`;
  const idPita = `pita-sample-${id}`;

  return (
    <svg
      viewBox="0 0 190 285"
      className={className}
      role="img"
      aria-label={`Cover buku ${buku.judul}`}
    >
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={terang} />
          <stop offset="45%" stopColor={gelap} />
          <stop offset="100%" stopColor={pekat} />
        </linearGradient>
        <linearGradient id={`s-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`k-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="190" height="285" rx="4" fill={`url(#g-${id})`} />
      {/* punggung buku (spine) */}
      <rect width="17" height="285" fill={`url(#s-${id})`} />
      <line x1="17" y1="0" x2="17" y2="285" stroke="#000" strokeOpacity="0.3" />
      <line x1="20" y1="0" x2="20" y2="285" stroke="#fff" strokeOpacity="0.1" />
      {/* kilau */}
      <rect width="190" height="285" rx="4" fill={`url(#k-${id})`} />
      {/* bingkai emas */}
      <rect
        x="28" y="24" width="146" height="237" rx="2"
        fill="none" stroke="#e6cd8b" strokeOpacity="0.45"
      />
      <circle cx="101" cy="50" r="8" fill="none" stroke="#e6cd8b" strokeOpacity="0.6" />
      <circle cx="101" cy="50" r="2.6" fill="#e6cd8b" fillOpacity="0.7" />

      {/* judul */}
      <text
        x="101" y={yAwal} textAnchor="middle" fill="#fdfbf5"
        fontFamily="var(--font-heading), Georgia, serif"
        fontSize={ukuran} fontWeight="700"
      >
        {baris.map((t, i) => (
          <tspan key={i} x="101" dy={i === 0 ? 0 : 24}>
            {t}
          </tspan>
        ))}
      </text>

      <line
        x1="70" y1={yGaris} x2="132" y2={yGaris}
        stroke="#e6cd8b" strokeOpacity="0.75"
      />

      {/* penulis — kotaknya y 228..241; pita SAMPLE mulai y 250
          → JARAK 9px, tidak menempel (diukur, bukan ditebak) */}
      <text
        x="101" y="239" textAnchor="middle" fill="#e6cd8b"
        fontFamily="var(--font-body), sans-serif" fontSize="8.5"
      >
        {buku.penulis.length > 34
          ? buku.penulis.slice(0, 33) + "…"
          : buku.penulis}
      </text>

      {/* pita SAMPLE — hanya untuk buku contoh.
          ⚠️ Pakai id, BUKAN className: className pada <g> SVG tidak ikut
             ter-render ke HTML (terbukti 22Sep26, kelas hilang). id AMAN.
          ⚠️ id WAJIB UNIK (perbaikan 22Sep26): cover ini dipanggil 16×
             di halaman depan → kalau id-nya sama semua, HTML-nya TIDAK
             SAH dan bisa bikin perilaku aneh di browser. Karena itu id
             diberi akhiran pembeda dari prop `kunci` bila ada. */}
      {buku.sample && (
        <g id={idPita}
           transform="translate(101,258) rotate(-7)">
          <rect
            x="-36" y="-8.5" width="72" height="17" rx="3" fill="#000"
            fillOpacity="0.42" stroke="#e6cd8b" strokeOpacity="0.6"
            strokeDasharray="3 2"
          />
          <text
            x="0" y="3.6" textAnchor="middle" fill="#e6cd8b"
            fontFamily="var(--font-body), sans-serif" fontSize="8.6"
            fontWeight="700" letterSpacing="1.5"
          >
            SAMPLE
          </text>
        </g>
      )}
    </svg>
  );
}
