// =============================================================
// LAYANAN — PT Bayana Hasana Duna (palet terang akademis)
// (revisi Perpusnas 20Oct26: janji ISBN/Scholar dinetralkan —
//  komponen cadangan, tidak dirender template 2 aktif)
// Menerbitkan BUKU dan JURNAL ILMIAH.
// Kartu minimal premium: putih bersih + aksen emas tipis + ikon garis halus.
// =============================================================

// data kartu layanan buku & jurnal. desc opsional, konsisten & mudah dibaca.
const LAYANAN_BUKU = [
  {
    t: "Terbitkan Buku",
    d: "Dari naskah utuh hingga terbit — kami pandu seluruh prosesnya dengan standar penerbitan yang benar.",
    i: "M12 3l1.9 5.6 5.6 1.9-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9z",
  },
  {
    t: "Konversi Skripsi → Buku",
    d: "Ubah skripsi, tesis, atau disertasi menjadi buku yang layak jual dan kredibel.",
    i: "M4 5a2 2 0 012-2h8l6 6v10a2 2 0 01-2 2H6a2 2 0 01-2-2zM14 3v6h6",
  },
  {
    t: "Editing & Layout",
    d: "Naskah dirapikan editor dan ditata profesional hingga siap cetak.",
    i: "M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z",
  },
  {
    t: "Desain Cover",
    d: "Sampul yang memikat dan sesuai genre, dari fiksi hingga akademik.",
    i: "M3 5h18M3 12h18M3 19h18",
  },
  {
    t: "Legalitas & Ebook",
    d: "Pendampingan administrasi penerbitan, pencatatan HKI, dan versi digital agar karya tersebar luas.",
    i: "M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1",
  },
];

const LAYANAN_JURNAL = [
  {
    t: "Kelola Jurnal Ilmiah",
    d: "Platform jurnal online yang rapi (OJS), siap terbit berkala dan profesional.",
    i: "M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 016.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z",
  },
  {
    t: "Penerbitan Artikel",
    d: "Bantu naskah artikel akademik lolos hingga diterbitkan di jurnal kredibel.",
    i: "M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.42M12 14v8M6.16 10.58L12 14",
  },
  {
    t: "ISSN, DOI & Indeksasi",
    d: "Layanan pengajuan ISSN, pendaftaran DOI, dan optimasi keterlihatan artikel ilmiah.",
    i: "M21 12a9 9 0 11-9-9M21 3l-9 9M15 3h6v6",
  },
  {
    t: "Akreditasi SINTA",
    d: "Dampingan menuju akreditasi SINTA dengan standar kelola yang benar.",
    i: "M12 8v4l3 3M12 22a10 10 0 100-20 10 10 0 000 20z",
  },
];

export default function Services() {
  return (
    <section id="layanan" className="relative w-full bg-[#f6f1e6]">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-acad-gold">
            Layanan Penerbitan
          </p>
          <h2 className="font-display-serif text-3xl font-semibold leading-tight text-acad-ink md:text-[2.6rem] md:leading-[1.15]">
            Terbitkan buku, atau kelola{" "}
            <span className="gold-gradient-light font-display-serif italic">jurnal ilmiah</span>{" "}
            Anda.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-acad-ink-soft md:text-lg">
            Bayana melayani dua jalur penerbitan — karya nonfiksi/fiksi yang layak terbit,
            dan jurnal ilmiah yang kredibel. Satu tim, standar tinggi, proses jelas.
          </p>
        </div>

        {/* Dua kolom layanan: BUKU (kiri) & JURNAL ILMIAH (kanan) di desktop */}
        <div className="mt-14 grid gap-x-10 gap-y-14 lg:mt-16 lg:grid-cols-2 lg:items-start">
          <SubSection no="01" label="Penerbitan Buku" items={LAYANAN_BUKU} />
          <SubSection no="02" label="Penerbitan Jurnal Ilmiah" items={LAYANAN_JURNAL} />
        </div>
      </div>
    </section>
  );
}

function SubSection({
  no,
  label,
  items,
}: {
  no: string;
  label: string;
  items: { t: string; d: string; i: string }[];
}) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <span className="font-display-serif text-sm font-semibold tracking-wide text-acad-gold">
          {no}
        </span>
        <h3 className="text-lg font-semibold text-acad-ink">{label}</h3>
        <span className="h-px flex-1 bg-acad-line" />
      </div>

      <div className="grid gap-4">
        {items.map((s) => (
          <article
            key={s.t}
            className="group relative flex gap-4 rounded-xl border border-acad-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-acad-gold/60 hover:shadow-[0_12px_30px_rgba(35,39,47,0.08)]"
          >
            <div className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-acad-gold/25 text-acad-gold transition-colors group-hover:bg-acad-gold group-hover:text-white">
              <svg
                viewBox="0 0 24 24"
                className="h-[22px] w-[22px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={s.i} />
              </svg>
            </div>
            <div>
              <h4 className="text-[15px] font-semibold leading-snug text-acad-ink md:text-base">
                {s.t}
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-acad-ink-soft">{s.d}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
