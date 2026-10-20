// =============================================================
// KENAPA PILIH KAMI — Bayana Publishing (value props)
// 4 pembeda utama dari penerbit lain.
// =============================================================

const POINTS = [
  {
    t: "Buku & Jurnal dalam Satu Atap",
    d: "Layanan lengkap untuk penulis buku maupun pengelola jurnal ilmiah.",
    i: "M12 3l1.9 5.6 5.6 1.9-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9z",
  },
  {
    t: "Standar Akademik Tinggi",
    d: "Dari penyunting ahli hingga format SINTA, kualitas jadi prioritas.",
    i: "M9 12l2 2 4-4M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z",
  },
  {
    t: "Proses Transparan & Jelas",
    d: "Timeline & biaya dijelaskan sejak awal — tanpa biaya tersembunyi.",
    i: "M12 8v4l3 3M12 2a10 10 0 100 20 10 10 0 000-20z",
  },
  {
    t: "Pendampingan Hingga Terbit",
    d: "Bukan sekadar menerbitkan — kami dampingi hingga karyamu dikenal.",
    i: "M17 8a5 5 0 00-5-5 5 5 0 00-5 5M17 8a2 2 0 012 2v3a2 2 0 01-2 2h-1M17 8H7m-2 0a2 2 0 00-2 2v3a2 2 0 002 2h1m10 0v3a2 2 0 01-2 2h-4a2 2 0 01-2-2v-3",
  },
];

export default function WhyUs() {
  return (
    <section className="w-full bg-[#faf7f0]">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-acad-gold">
            Mengapa Bayana
          </p>
          <h2 className="font-display-serif text-3xl font-semibold leading-tight text-acad-ink md:text-4xl">
            Partner penerbitan yang Anda percaya.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((p) => (
            <div
              key={p.t}
              className="rounded-2xl border border-acad-line bg-white p-6 transition-transform duration-300 hover:-translate-y-1 hover:border-acad-gold/50"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-acad-gold/25 text-acad-gold">
                <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d={p.i} />
                </svg>
              </div>
              <h3 className="text-[15px] font-semibold leading-snug text-acad-ink md:text-base">
                {p.t}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-acad-ink-soft">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
