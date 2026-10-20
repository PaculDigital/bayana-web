// KartuBuku.tsx — kartu buku untuk etalase (katalog).
//
// Isinya: cover + genre + judul + RATING (bintang, angka, jumlah ulasan)
// + harga. Seluruh kartu bisa diklik menuju halaman detail buku.
//
// MOBILE FRIENDLY: lebar kartu ikut kolom grid di halaman pemanggil,
// teks memakai ukuran relatif — tidak pecah di layar HP.

import Link from "next/link";
import CoverBuku from "./CoverBuku";
import type { Buku } from "@/data/buku";

export function Bintang({
  nilai,
  ukuran = 14,
}: {
  nilai: number;
  ukuran?: number;
}) {
  const penuh = Math.round(nilai);
  return (
    <span
      className="inline-flex whitespace-nowrap leading-none"
      style={{ fontSize: ukuran, color: "var(--buku-emas)" }}
      aria-label={`Rating ${nilai.toFixed(1)} dari 5`}
    >
      {"★".repeat(penuh)}
      <span style={{ opacity: 0.32 }}>{"★".repeat(5 - penuh)}</span>
    </span>
  );
}

export function rupiah(n: number): string {
  return "Rp" + n.toLocaleString("id-ID");
}

export default function KartuBuku({ buku }: { buku: Buku }) {
  return (
    <Link href={`/buku/${buku.slug}`} className="kartu-buku">
      <div className="kartu-buku-cover">
        <CoverBuku buku={buku} className="w-full h-auto block" />
      </div>
      <p className="kartu-buku-genre">{buku.genre}</p>
      <h3 className="kartu-buku-judul">{buku.judul}</h3>
      <div className="kartu-buku-rating">
        <Bintang nilai={buku.rating} ukuran={13} />
        <b>{buku.rating.toFixed(1).replace(".", ",")}</b>
        <span>({buku.jumlah_ulasan} ulasan)</span>
      </div>
      <p className="kartu-buku-harga">{rupiah(buku.harga)}</p>
    </Link>
  );
}
