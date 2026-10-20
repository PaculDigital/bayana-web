// page.tsx (/buku/keranjang) — Keranjang belanja.
//
// Bentuknya: daftar buku dengan KOTAK CENTANG (putusan Bos).
// Yang dicentang saja yang dihitung & dibeli. Ada "Pilih semua".
// Total = subtotal + ongkir Rp15.000 (satu tarif seluruh Indonesia).

import Link from "next/link";
import { cookies } from "next/headers";
import { ambilBuku, ONGKIR_FLAT } from "@/data/buku";
import { isiKeranjang } from "@/lib/keranjang";
import { NAMA_COOKIE } from "@/lib/tanda-browser";
import CoverBuku from "@/components/buku/CoverBuku";
import { rupiah } from "@/components/buku/KartuBuku";
import KeranjangKlien from "@/components/buku/KeranjangKlien";

export const dynamic = "force-dynamic";

export default async function HalamanKeranjang() {
  const c = await cookies();
  const tanda = c.get(NAMA_COOKIE)?.value ?? "";

  const isi = tanda ? isiKeranjang(tanda) : [];

  // gabungkan dengan data buku; buang yang bukunya sudah tidak ada
  const baris = isi
    .map((b) => {
      const buku = ambilBuku(b.slug_buku);
      if (!buku) return null;
      return {
        id: b.id,
        slug: buku.slug,
        judul: buku.judul,
        penulis: buku.penulis,
        harga: buku.harga,
        jumlah: b.jumlah,
        buku,
      };
    })
    .filter((x) => x !== null);

  if (baris.length === 0) {
    return (
      <main className="toko-wadah">
        <p className="toko-crumbs">
          <Link href="/buku">Katalog</Link>
          <span>/</span>
          Keranjang
        </p>
        <h1 className="toko-h1">Keranjang</h1>
        <div className="toko-panel toko-kosong">
          <h3>Keranjang masih kosong</h3>
          <p className="toko-ket">
            Pilih buku dulu dari katalog — nanti muncul di sini.
          </p>
          <Link href="/buku" className="toko-btn toko-btn-utama"
            style={{ marginTop: 18 }}>
            Lihat katalog buku
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="toko-wadah">
      <p className="toko-crumbs">
        <Link href="/buku">Katalog</Link>
        <span>/</span>
        Keranjang
      </p>
      <h1 className="toko-h1">Keranjang</h1>
      <p className="toko-ket" style={{ marginBottom: 22 }}>
        Centang buku yang mau dibeli sekarang. Buku yang tidak dicentang
        tetap tersimpan di keranjang.
      </p>

      <KeranjangKlien baris={baris} ongkir={ONGKIR_FLAT} />
    </main>
  );
}

/** Dipakai komponen klien untuk gambar mini. */
export function MiniCover({ slug }: { slug: string }) {
  const buku = ambilBuku(slug);
  if (!buku) return null;
  return <CoverBuku buku={buku} className="w-full h-auto block" />;
}

export { rupiah };
