// =============================================================
// PAKET & HARGA PENERBITAN BUKU — Bayana Publishing
// Paket placeholder mengikuti pasar; Bos bisa sesuaikan nominal.
// =============================================================

// Nomor WA tujuan (sama dengan tombol WA di halaman): 085111555248.
const NOMOR_WA = "6285111555248";

// Pesan siap-kirim per paket (ACC Bos 02Okt26) — diawali "Hallo Kak,".
function pesanWa(namaPaket: string, tagline: string, harga: string, satuan: string): string {
  const hargaTeks = satuan ? `Rp ${harga} ${satuan}` : `Rp ${harga}`;
  return (
    `Hallo Kak, saya ingin bertanya mengenai paket ${namaPaket} ` +
    `(${hargaTeks}). Mohon dijelaskan prosedur, syarat, dan estimasi waktunya. Terima kasih.`
  );
}

const PLANS = [
  {
    name: "Kolaborasi",
    tagline: "Cocok untuk penulis yang ingin menekan biaya awal.",
    price: "1.5",
    priceNote: "jutaan / paket*",
    features: [
      "ISBN + Penerbit Bayana",
      "Editing ringan",
      "Layout dasar",
      "Cetak sesuai pemesanan (POD)",
      "Distribusi marketplace dasar",
    ],
    highlight: false,
    cta: "Pilih Kolaborasi",
  },
  {
    name: "Reguler",
    tagline: "Pilihan paling seimbang untuk penulis mandiri.",
    price: "3",
    priceNote: "jutaan / paket*",
    features: [
      "ISBN + HKI",
      "Editing menyeluruh",
      "Layout & desain cover",
      "Cetak + distribusi luas",
      "Buku fisik + versi ebook",
      "Pendampingan hingga terbit",
    ],
    highlight: true,
    cta: "Pilih Reguler",
  },
  {
    name: "Eksklusif",
    tagline: "Full-service untuk hasil premium & layanan maksimal.",
    price: "5",
    priceNote: "jutaan / paket*",
    features: [
      "Semua fitur Reguler",
      "Penyunting ahli per bidang",
      "Cover & layout premium",
      "Prioritas & timeline cepat",
      "Strategi pemasaran & promosi",
      "Laporan penjualan berkala",
    ],
    highlight: false,
    cta: "Pilih Eksklusif",
  },
];

export default function Pricing() {
  return (
    <section id="paket" className="w-full bg-[#faf7f0]">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-acad-gold">
            Paket Penerbitan Buku
          </p>
          <h2 className="font-display-serif text-3xl font-semibold leading-tight text-acad-ink md:text-4xl">
            Pilih paket yang sesuai kebutuhan Anda.
          </h2>
          <p className="mt-4 text-base text-acad-ink-soft">
            Setiap paket bisa disesuaikan. Konsultasi dulu, kami bantu pilih yang paling tepat.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <article
              key={p.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-7 transition-transform duration-300 hover:-translate-y-1 ${
                p.highlight
                  ? "border-acad-gold shadow-[0_16px_40px_rgba(168,133,44,0.18)]"
                  : "border-acad-line shadow-[0_8px_25px_rgba(35,39,47,0.05)]"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-acad-gold px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  Paling Populer
                </span>
              )}
              <h3 className="font-display-serif text-xl font-semibold text-acad-ink">{p.name}</h3>
              <p className="mt-1 text-sm text-acad-ink-soft">{p.tagline}</p>

              <div className="mt-5 flex flex-wrap items-end gap-x-1 gap-y-0">
                <span className="whitespace-nowrap font-display-serif text-3xl font-semibold text-acad-gold sm:text-4xl">
                  Rp {p.price}
                </span>
                <span className="mb-1 text-xs text-acad-ink-soft">{p.priceNote}</span>
              </div>

              <ul className="mt-6 flex-1 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-acad-ink">
                    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-acad-gold" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={`https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(
                  pesanWa(p.name, p.tagline, p.price, p.priceNote)
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-7 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                  p.highlight
                    ? "bg-acad-gold text-white hover:bg-acad-gold/90"
                    : "border border-acad-gold/50 text-acad-ink hover:bg-acad-gold hover:text-white"
                }`}
              >
                {p.cta}
              </a>
            </article>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-acad-ink-soft">
          *Harga indikatif dan dapat berubah. Hubungi kami untuk penawaran jurnal ilmiah & paket kampus.
        </p>
      </div>
    </section>
  );
}
