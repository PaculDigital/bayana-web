// =============================================================
// PEMBUKA + VISI & MISI — Bayana Publishing
// Palet TERANG akademis (putih-gading), heading serif.
// Transisi halus dari hero gelap (gradasi gading di atas).
// =============================================================

const MISI = [
  "Menyediakan layanan penerbitan buku dan jurnal ilmiah yang mudah, cepat, dan andal.",
  "Menjaga standar tinggi dalam konten, desain, dan produksi setiap karya.",
  "Mendampingi penulis dan akademisi hingga karyanya dikenal dan terdistribusi luas.",
];

export default function VisiMisi() {
  return (
    <section
      id="tentang"
      className="relative w-full"
      style={{
        // Judul pembuka (terang) duduk di area GELAP atas (sambung hero);
        // setelahnya cepat ke gading terang untuk deskripsi & kartu.
        background:
          "linear-gradient(180deg, #0a0705 0%, #24170c 12%, #3b2a17 34%, #6b5430 52%, #b9a066 66%, #efe7d4 78%, #faf7f0 90%, #faf7f0 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
        {/* Pembuka singkat */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-[#d9c488]">
            Bayana Publishing
          </p>
          <h2 className="font-display-serif text-3xl font-semibold leading-tight text-[#ece4d2] md:text-[2.7rem] md:leading-[1.15]">
            Penerbit yang mendampingi Akademisi dan Penulis — menerbitkan{" "}
            <span className="font-display-serif italic text-[#ffd97a]">jurnal ilmiah</span> dan{" "}
            <span className="font-display-serif italic text-[#ffd97a]">buku</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#f2ecdd]/85 md:text-lg">
            Kami meyakini setiap gagasan layak diwujudkan. Dari naskah pertama hingga
            karya yang tersebar luas, Bayana menyediakan penerbitan profesional yang
            jujur, kreatif, dan terpercaya.
          </p>
        </div>

        {/* VISI & MISI */}
        <div className="mt-16 grid gap-6 md:mt-20 md:grid-cols-5">
          {/* VISI */}
          <div className="rounded-2xl border border-acad-line bg-white p-8 shadow-[0_8px_30px_rgba(35,39,47,0.06)] md:col-span-2">
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-flex h-9 items-center rounded-full bg-acad-gold/12 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-acad-gold">
                Visi
              </span>
            </div>
            <p className="text-base leading-relaxed text-acad-ink md:text-[17px]">
              Menjadi penerbit terpercaya yang mengangkat karya berkualitas — buku dan
              jurnal ilmiah Indonesia — ke panggung nasional dan internasional melalui
              inovasi, inklusivitas, dan distribusi yang luas.
            </p>
          </div>

          {/* MISI */}
          <div className="rounded-2xl border border-acad-line bg-white p-8 shadow-[0_8px_30px_rgba(35,39,47,0.06)] md:col-span-3">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex h-9 items-center rounded-full bg-acad-gold/12 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-acad-gold">
                Misi
              </span>
            </div>
            <ol className="space-y-3">
              {MISI.map((m, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-acad-gold/40 font-display-serif text-xs font-semibold text-acad-gold">
                    {i + 1}
                  </span>
                  <span className="text-[15px] leading-relaxed text-acad-ink md:text-base">
                    {m}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
