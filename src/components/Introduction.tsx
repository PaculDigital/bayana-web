import Image from "next/image";

/**
 * Introduction — kalimat pengantar PT Bayana Hasana Duna.
 * URUTAN PERSIS mengikuti gambar yang di-ACC Bos (01Oct26):
 *   1. Sub-header emas
 *   2. Hook baris 1 (hitam)
 *   3. Hook baris 2 (emas, berkutip)
 *   4. GARIS PEMISAH
 *   5. Paragraf (diawali "Fakta :")
 *   6. GARIS PEMISAH
 *   7. Tagline tebal
 *   8. Salam + TANDA TANGAN RESMI (public/tanda-tangan-bayana.svg) + PT Bayana Hasana Duna
 *
 * Revisi Perpusnas 20Oct26: nama diseragamkan; janji ISBN & Google Scholar dihapus.
 */
export default function Introduction() {
  return (
    <section
      id="introduction"
      className="w-full bg-[#faf7f0] px-5 pt-12 pb-6 sm:px-8 sm:pt-16 sm:pb-8"
    >
      <div className="mx-auto max-w-3xl">
        {/* 1. Sub-header emas */}
        <p className="font-bitter text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a6b1f]">
          Penerbit Buku Akademik &middot; Berbadan Hukum Resmi
        </p>

        {/* 2 & 3. Hook dua baris */}
        <h2 className="mt-3 font-bitter text-[26px] font-bold leading-[1.35] text-[#23272f] sm:text-[30px]">
          Naskah Anda Mengendap di Laptop.
          <br />
          <span className="text-[#8a6b1f]">
            &ldquo;Padahal Itu Bisa Jadi Poin KUM Anda.&rdquo;
          </span>
        </h2>

        {/* 4. Garis pemisah pendek emas */}
        <div className="mt-4 h-[3px] w-24 bg-[#8a6b1f]" />

        {/* 5. Paragraf — GAYA SURAT TERBUKA: tanpa "Fakta :", teks agak samar */}
        <p
          className="mt-5 font-bitter text-[15.5px] leading-[1.95] text-[#5c6068] opacity-[0.82] sm:text-[17px]"
          style={{ textAlign: "justify" }}
        >
          Bapak dan Ibu Dosen yang kami hormati, kita semua tahu bahwa setiap
          dosen pasti memiliki naskah yang belum selesai &ndash; entah itu
          laporan hasil penelitian, draf bahan ajar, atau catatan kuliah yang
          telah terkumpul bertahun-tahun. Di sisi lain, setiap tahunnya angka
          kredit (KUM) Anda terus menunggu untuk dipenuhi.{" "}
          <strong>
            Sebenarnya, tantangan kita hari ini bukan lagi soal menulis dari
            awal, melainkan bagaimana menerbitkannya secara resmi dan aman.
          </strong>{" "}
          Di sinilah{" "}
          <strong>PT Bayana Hasana Duna</strong> berperan
          sebagai mitra resmi berbadan hukum yang memastikan naskah Anda
          menempuh jalur yang benar sejak awal. Naskah Anda akan disunting
          secara profesional hingga <strong>bebas plagiarisme</strong>,{" "}
          diterbitkan secara resmi dengan administrasi penerbitan yang lengkap,
          dan{" "}<em>berkasnya siap diunggah ke Sister</em>. Mari bersama kami.
        </p>

        {/* 5b. Poin KUM (dipisah — tautan PO PAK terbaru tetap buka tab baru)
             02Okt26: tautan dialihkan ke SALINAN LOKAL (Opsi 1, ACC Bos) karena
             server LLDIKTI3 sertifikatnya cacat (self-signed, ganti 1 Okt 10:16)
             → pengunjung kena peringatan "Koneksi tidak aman".
             Berkas: public/dokumen/KEPMEN-39-M-KEP-2026-Juknis-PAK-Dosen.pdf
             (salinan ASLI & utuh, 116 hlm, 12.636.145 byte, md5 b480357efa276c2bbad156742014ccd7). */}
        <p className="mt-3 font-bitter text-[14px] italic leading-[1.9] text-[#565b63]">
          40 poin untuk Buku Referensi, 20 poin untuk Monograf dan Buku Ajar,
          sesuai{" "}
          <a
            href="/dokumen/KEPMEN-39-M-KEP-2026-Juknis-PAK-Dosen.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap underline decoration-dotted underline-offset-4 hover:text-[#8a6b1f]"
          >
            PO PAK terbaru
          </a>
          .
        </p>

        {/* 6. Salam + TANDA TANGAN RESMI (di ATAS garis emas, agak maju ke tengah) */}
        <div className="mt-1 text-right sm:pr-[12%]">
          <p className="font-bitter text-[16px] font-semibold text-[#3a3f47]">
            Salam,
          </p>
          <Image
            src="/tanda-tangan-bayana.svg"
            alt="Tanda tangan PT Bayana Hasana Duna"
            width={259}
            height={180}
            className="ml-auto mt-1 h-[92px] w-auto opacity-60"
          />
          {/* PT menempel tanda tangan: tarik naik (margin negatif) */}
          <p className="-mt-4 font-bitter text-[12.5px] tracking-[0.06em] text-[#565b63]">
            PT Bayana Hasana Duna
          </p>
        </div>

        {/* 7. Garis pemisah (DI BAWAH tanda tangan) */}
        <div className="mt-5 h-px w-full bg-[#e4dccb]" />

        {/* 8. Tagline tebal (SETELAH tanda tangan) */}
        <p className="mt-7 font-bitter text-[15.5px] font-bold leading-[1.7] text-[#23272f] sm:text-[17px]">
          Anda fokus mengajar, kami urus naskahnya &mdash; sampai terbit.
        </p>
      </div>
    </section>
  );
}
