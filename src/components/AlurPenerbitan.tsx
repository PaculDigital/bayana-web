// =============================================================
// ALUR PENERBITAN — PT Bayana Hasana Duna
// (revisi Perpusnas 20Oct26)
//
// 5 langkah kurasi naskah hingga terbit. Bahasa administratif netral:
// ISBN disebut sebagai tahapan prosedur resmi, BUKAN janji/jualan.
// Palet template 2: gading #faf7f0, token acad-*.
// =============================================================

const STEPS = [
  {
    n: "01",
    t: "Seleksi Naskah",
    d: "Tim redaksi meninjau kelayakan naskah: orisinalitas, kesesuaian bidang ilmu, dan kelengkapan struktur buku.",
  },
  {
    n: "02",
    t: "Penyuntingan",
    d: "Naskah disunting secara profesional — bahasa, konsistensi istilah, dan pemeriksaan plagiarisme.",
  },
  {
    n: "03",
    t: "Desain & Layout",
    d: "Tata letak isi dan desain cover dikerjakan hingga siap produksi cetak maupun digital.",
  },
  {
    n: "04",
    t: "Administrasi Penerbitan",
    d: "Pengajuan ISBN mengikuti prosedur resmi Perpustakaan Nasional; pencatatan HKI bila diperlukan.",
  },
  {
    n: "05",
    t: "Terbit & Distribusi",
    d: "Buku resmi terbit, masuk katalog penerbit, dan didistribusikan melalui toko serta marketplace.",
  },
];

export default function AlurPenerbitan() {
  return (
    <section id="alur" className="w-full bg-[#f6f1e6]">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-acad-gold">
            Alur Penerbitan
          </p>
          <h2 className="font-display-serif text-3xl font-semibold leading-tight text-acad-ink md:text-4xl">
            Dari naskah hingga terbit, dalam 5 langkah.
          </h2>
          <p className="mt-4 text-base text-acad-ink-soft">
            Setiap naskah melewati kurasi redaksi sebelum diterbitkan.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-5">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative">
              {i < STEPS.length - 1 && (
                <span className="absolute left-[calc(50%+28px)] top-7 hidden h-px w-[calc(100%-56px)] bg-acad-gold/30 md:block" />
              )}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-acad-gold bg-white font-display-serif text-base font-semibold text-acad-gold shadow-[0_6px_18px_rgba(168,133,44,0.18)]">
                  {s.n}
                </div>
                <h3 className="mt-4 text-base font-semibold text-acad-ink">{s.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-acad-ink-soft">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
