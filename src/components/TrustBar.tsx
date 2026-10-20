// =============================================================
// TRUST BAR — angka kredibilitas (placeholder, mudah diganti)
// Strip tipis & kompak agar tidak menambah tinggi halaman berlebih.
// =============================================================

const STATS = [
  { n: "40+", l: "Buku Terbit" },
  { n: "20+", l: "Jurnal Dikelola" },
  { n: "100+", l: "Penulis & Peneliti" },
  { n: "5", l: "Bidang Ilmu" },
];

export default function TrustBar() {
  return (
    <section className="w-full bg-[#faf7f0]">
      <div className="mx-auto max-w-6xl px-6 pb-2">
        <div className="grid grid-cols-2 gap-6 rounded-2xl border border-acad-line bg-white px-6 py-8 text-center shadow-[0_8px_25px_rgba(35,39,47,0.05)] sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.l}>
              <p className="font-display-serif text-3xl font-semibold text-acad-gold md:text-4xl">
                {s.n}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-acad-ink-soft md:text-[13px]">
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
