// =============================================================
// HERO FORMAL — PT Bayana Hasana Duna (revisi dokumen butir 5;
//              revisi Perpusnas 20Oct26: hook tanpa janji ISBN)
//
// Banner panjang-pendek ala tridarma.id: teks kiri (eyebrow → hook
// besar → baris kedua → garis emas → kalimat penutup), foto rak buku
// kanan menyatu lewat gradasi, frame abstrak segitiga navy + garis emas.
//
// SKETSA DISETUJUI BOS (30Sep2026): _sketsa_hero_v2.html
//   • tinggi banner terukur 220px (bukan full-screen)
//   • TANPA background putih — palet gading #faf7f0 + navy + emas
//   • teks hook & penutup = tulisan persis Bos
//
// ⚠️ Hero lama (Hero.tsx) TIDAK disentuh — lihat src/lib/hero-saklar.ts
// =============================================================

const EYEBROW = "Berbasis PO PAK Dosen dan Regulasi Terbaru";
const HOOK = "Kapan Buku Anda Terbit?";
const KATA = "Dari Gagasan Terbitlah Buku Referensi, Buku Monograf, dan Buku Ajar";
const PENUTUP = "Beritahu idenya, kami dampingi hingga terbit. BKD dan Jafung jadi aman";

export default function HeroFormal() {
  return (
    <section id="beranda" className="w-full bg-[#faf7f0]">
      <div className="mx-auto max-w-6xl px-5 pt-[76px] md:pt-[84px]">
        <div className="relative grid min-h-[220px] overflow-hidden border border-[#e4dccb] bg-[#faf7f0] md:grid-cols-[1.15fr_.85fr]">
          {/* ── TEKS KIRI ── */}
          <div className="relative z-[3] flex flex-col justify-center px-6 py-5 md:px-10 md:py-4">
            {/* eyebrow — emas #8a6b1f: kontras 4,67 di atas gading (lolos WCAG 4,5) */}
            <span className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#8a6b1f]">
              <span className="inline-block h-[2px] w-[22px] bg-[#8a6b1f]" aria-hidden />
              {EYEBROW}
            </span>

            {/* hook — font terbesar & jelas */}
            <h1 className="mt-3 font-display-serif text-[clamp(27px,2.9vw,37px)] font-bold leading-[1.1] tracking-tight text-[#23272f]">
              {HOOK}
            </h1>

            {/* baris kedua — sedikit lebih kecil */}
            <p className="mt-2 max-w-[34ch] text-[clamp(16px,1.7vw,22px)] font-semibold leading-[1.32] text-[#1e3a5f]">
              {KATA}
            </p>

            {/* garis emas + kalimat penutup kecil tapi terlihat */}
            <div className="mt-[13px] h-[2px] w-[46px] bg-gradient-to-r from-[#a8852c] to-[#c8a24a]" aria-hidden />
            <p className="mt-2 max-w-[52ch] text-[13.5px] font-medium leading-[1.4] text-[#565b63]">
              {PENUTUP}
            </p>
          </div>

          {/* ── FOTO KANAN (absolut supaya TIDAK menentukan tinggi banner) ── */}
          <div className="relative order-last min-h-[130px] overflow-hidden bg-[#101b2e] md:order-none md:min-h-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-rak-buku.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[60%_45%]"
            />
            {/* gradasi penyatu: vertikal di mobile, horizontal di desktop */}
            <div
              aria-hidden
              className="absolute inset-0 z-[2] bg-gradient-to-b from-[#faf7f0] to-transparent md:hidden"
            />
            <div
              aria-hidden
              className="absolute inset-0 z-[2] hidden md:block"
              style={{
                background:
                  "linear-gradient(90deg,#faf7f0 0%,rgba(250,247,240,.55) 12%,rgba(250,247,240,0) 34%)",
              }}
            />
          </div>

          {/* ── FRAME ABSTRAK: segitiga navy + garis emas (ala tridarma) ── */}
          <svg
            className="pointer-events-none absolute inset-0 z-[4] h-full w-full"
            viewBox="0 0 1200 220"
            preserveAspectRatio="none"
            aria-hidden
          >
            {/* kiri atas: lipatan segitiga */}
            <polygon points="0,0 132,0 0,44" fill="#1e3a5f" />
            <polygon points="0,0 78,0 0,26" fill="#23272f" />
            <path d="M0,44 L132,0" stroke="#c8a24a" strokeWidth="1.6" fill="none" />
            <path d="M0,26 L78,0" stroke="#c8a24a" strokeWidth="1.2" fill="none" />
            {/* pinstripe diagonal tipis di margin kiri */}
            <path
              d="M6,62 L60,36 M6,76 L78,42 M6,90 L60,64"
              stroke="#c8a24a"
              strokeWidth="1"
              opacity=".65"
              fill="none"
            />
            {/* kanan atas: lipatan segitiga */}
            <polygon points="1200,0 1076,0 1200,40" fill="#1e3a5f" />
            <polygon points="1200,0 1134,0 1200,24" fill="#23272f" />
            <path d="M1076,0 L1200,40" stroke="#c8a24a" strokeWidth="1.6" fill="none" />
            <path d="M1134,0 L1200,24" stroke="#c8a24a" strokeWidth="1.2" fill="none" />
            {/* garis emas tipis di tepi bawah banner */}
            <path d="M0,218.5 L1200,218.5" stroke="#c8a24a" strokeWidth="1.4" opacity=".8" />
          </svg>
        </div>
      </div>
    </section>
  );
}
