// =============================================================
// TESTIMONI PENULIS — Bayana Publishing (placeholder, mudah ganti)
// =============================================================

const ITEMS = [
  {
    q: "Prosesnya sangat jelas dan komunikatif. Dari naskah skripsi jadi buku yang rapi dan layak jual.",
    n: "Dr. Andini Rahmawati, M.Pd.",
    r: "Penulis · Bidang Pendidikan",
  },
  {
    q: "Tim Bayana membantu kami mengelola jurnal hingga terindeks. Sangat profesional dan tepat waktu.",
    n: "Prof. Bambang Sutrisno",
    r: "Pengelola Jurnal · Ekonomi",
  },
  {
    q: "Kualitas desain dan editing-nya premium. Buku pertama saya terbit dan cepat tersebar.",
    n: "Rizki Maulana",
    r: "Penulis · Bidang Manajemen",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full bg-[#f6f1e6]">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-acad-gold">
            Testimoni
          </p>
          <h2 className="font-display-serif text-3xl font-semibold leading-tight text-acad-ink md:text-4xl">
            Mereka telah mempercayakan karyanya.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ITEMS.map((t) => (
            <figure
              key={t.n}
              className="flex flex-col rounded-2xl border border-acad-line bg-white p-7 shadow-[0_8px_25px_rgba(35,39,47,0.05)]"
            >
              {/* tanda kutip */}
              <span className="font-display-serif text-5xl leading-none text-acad-gold/40">“</span>
              <blockquote className="mt-1 flex-1 text-[15px] leading-relaxed text-acad-ink">
                {t.q}
              </blockquote>
              <figcaption className="mt-6 border-t border-acad-line pt-4">
                <p className="font-display-serif text-[15px] font-semibold text-acad-ink">{t.n}</p>
                <p className="text-xs text-acad-ink-soft">{t.r}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
