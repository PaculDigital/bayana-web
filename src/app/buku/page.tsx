// page.tsx (/buku) — Katalog buku (etalase).
//
// Bisa disaring per genre lewat alamat: /buku?genre=Hukum
// Tanpa saringan → tampil semua buku.

import Link from "next/link";
import { buku } from "@/data/buku";
import KartuBuku from "@/components/buku/KartuBuku";

export default async function Katalog({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const sp = await searchParams;
  const genreDipilih = sp.genre ?? "";

  // daftar genre unik — dihitung dari data, jadi ikut sendiri kalau
  // Bos menambah buku bergenre baru nanti
  const genre = Array.from(new Set(buku.map((b) => b.genre)))
    .sort((a, b) => a.localeCompare(b, "id"));

  const tampil = genreDipilih
    ? buku.filter((b) => b.genre === genreDipilih)
    : buku;

  return (
    <main className="toko-wadah">
      <h1 className="toko-h1">Katalog Buku</h1>
      <p className="toko-ket">
        {buku.length} judul buku akademik, referensi, dan praktik — semua
        buku di bawah ini masih <b>contoh</b>, lengkap dengan halaman detail,
        harga, dan cara pesan.
      </p>

      <div className="toko-saring">
        <Link href="/buku" className={genreDipilih ? "" : "aktif"}>
          Semua ({buku.length})
        </Link>
        {genre.map((g) => {
          const n = buku.filter((b) => b.genre === g).length;
          return (
            <Link
              key={g}
              href={`/buku?genre=${encodeURIComponent(g)}`}
              className={genreDipilih === g ? "aktif" : ""}
            >
              {g} ({n})
            </Link>
          );
        })}
      </div>

      {tampil.length === 0 ? (
        <div className="toko-kosong">
          <h3>Belum ada buku di kategori ini</h3>
          <p className="toko-ket">
            Coba pilih kategori lain, atau lihat semua buku.
          </p>
          <Link href="/buku" className="toko-btn toko-btn-utama"
            style={{ marginTop: 18 }}>
            Lihat semua buku
          </Link>
        </div>
      ) : (
        <div className="etalase">
          {tampil.map((b) => (
            <KartuBuku key={b.slug} buku={b} />
          ))}
        </div>
      )}
    </main>
  );
}
