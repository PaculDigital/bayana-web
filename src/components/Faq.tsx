"use client";

import { useState } from "react";

// =============================================================
// FAQ — PT Bayana Hasana Duna (accordion ringkas)
// (revisi Perpusnas 20Oct26: janji ISBN dinetralkan —
//  komponen cadangan, tidak dirender template 2 aktif)
// =============================================================

const QA = [
  {
    q: "Berapa lama proses penerbitan buku?",
    a: "Rata-rata 4–8 minggu tergantung paket & panjang naskah. Paket Eksklusif punya prioritas timeline lebih cepat.",
  },
  {
    q: "Apakah Bayana menerima naskah skripsi/tesis untuk dijadikan buku?",
    a: "Ya. Layanan konversi skripsi/tesis/disertasi menjadi buku adalah salah satu layanan utama kami.",
  },
  {
    q: "Apakah bisa menerbitkan jurnal ilmiah?",
    a: "Bisa. Kami membantu kelola jurnal online (OJS), penerbitan artikel, hingga pendaftaran ISSN, DOI, dan akreditasi SINTA.",
  },
  {
    q: "Bagaimana dengan hak cipta dan administrasi penerbitan?",
    a: "Administrasi penerbitan (termasuk pengajuan ISBN sesuai prosedur resmi) dan pendaftaran HKI kami dampingi. Penulis tetap pemegang hak cipta atas karyanya.",
  },
];

export default function Faq() {
  const [openIdx, setOpenIdx] = useState<number>(0);

  return (
    <section id="faq" className="w-full bg-[#faf7f0]">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
        <div className="text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-acad-gold">
            Pertanyaan Umum
          </p>
          <h2 className="font-display-serif text-3xl font-semibold leading-tight text-acad-ink md:text-4xl">
            Sering ditanyakan.
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {QA.map((item, i) => {
            const open = openIdx === i;
            return (
              <div
                key={item.q}
                className={`overflow-hidden rounded-xl border transition-colors ${
                  open ? "border-acad-gold/60 bg-white" : "border-acad-line bg-white"
                }`}
              >
                <button
                  onClick={() => setOpenIdx(open ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span className="text-[15px] font-semibold text-acad-ink md:text-base">
                    {item.q}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className={`h-5 w-5 shrink-0 text-acad-gold transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div
                  className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-acad-ink-soft">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
