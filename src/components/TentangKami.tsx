// =============================================================
// TENTANG KAMI — PT Bayana Hasana Duna
// (revisi Perpusnas 20Oct26)
//
// Profil penerbit + visi/misi + pernyataan komitmen menyebarluaskan
// ilmu pengetahuan — menjawab catatan Perpusnas butir 3.
// Palet template 2: gading #faf7f0, token acad-*.
// =============================================================

const MISI = [
  "Menyediakan layanan penerbitan buku akademik yang mudah, cepat, dan andal.",
  "Menjaga standar tinggi dalam seleksi naskah, penyuntingan, desain, dan produksi setiap karya.",
  "Mendampingi penulis dan akademisi hingga karyanya terbit dan terdistribusi luas.",
  "Berkomitmen menyebarluaskan ilmu pengetahuan melalui buku-buku yang berkualitas dan mudah diakses masyarakat.",
];

export default function TentangKami() {
  return (
    <section id="tentang" className="w-full bg-[#faf7f0]">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-acad-gold">
            Tentang Kami
          </p>
          <h2 className="font-display-serif text-3xl font-semibold leading-tight text-acad-ink md:text-4xl">
            Penerbit buku akademik berbadan hukum resmi.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-acad-ink-soft">
            PT Bayana Hasana Duna adalah penerbit buku akademik yang mendampingi
            dosen dan penulis dari naskah hingga terbit. Kami percaya setiap
            gagasan layak dibukukan — dan setiap buku yang terbit adalah
            sumbangsih bagi penyebaran ilmu pengetahuan di Indonesia.
          </p>
        </div>

        {/* Pernyataan komitmen */}
        <blockquote className="mx-auto mt-10 max-w-3xl rounded-2xl border border-acad-gold/40 bg-white p-8 text-center shadow-[0_8px_30px_rgba(35,39,47,0.06)]">
          <p className="font-display-serif text-lg italic leading-relaxed text-acad-ink md:text-xl">
            &ldquo;Kami berkomitmen menyebarluaskan ilmu pengetahuan melalui
            penerbitan buku akademik yang berkualitas, terkurasi, dan dapat
            diakses luas oleh masyarakat.&rdquo;
          </p>
        </blockquote>

        <div className="mt-10 grid gap-6 md:grid-cols-5">
          <div className="rounded-2xl border border-acad-line bg-white p-8 md:col-span-2">
            <span className="inline-flex h-9 items-center rounded-full bg-acad-gold/12 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-acad-gold">
              Visi
            </span>
            <p className="mt-4 text-base leading-relaxed text-acad-ink">
              Menjadi penerbit terpercaya yang mengangkat karya akademik
              Indonesia — buku referensi, monograf, dan buku ajar — agar
              tersebar luas dan memberi manfaat nyata bagi masyarakat.
            </p>
          </div>
          <div className="rounded-2xl border border-acad-line bg-white p-8 md:col-span-3">
            <span className="inline-flex h-9 items-center rounded-full bg-acad-gold/12 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-acad-gold">
              Misi
            </span>
            <ol className="mt-4 space-y-3">
              {MISI.map((m, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-acad-gold/40 font-display-serif text-xs font-semibold text-acad-gold">
                    {i + 1}
                  </span>
                  <span className="text-[15px] leading-relaxed text-acad-ink">{m}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
