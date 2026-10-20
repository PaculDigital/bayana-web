// page.tsx (/buku/alamat) — Form pengiriman + tombol "Buat pesanan".
//
// Masuk dari keranjang dengan alamat:
//   /buku/alamat?beli=slug1,slug2
//
// Buku yang dibeli diambil dari keranjang (jumlahnya ikut), lalu
// pembeli mengisi nama, HP, dan alamat. Setelah ditekan "Buat pesanan",
// server menerbitkan NOMOR PESANAN dan mengarahkan ke halaman QRIS.

import Link from "next/link";
import { cookies } from "next/headers";
import { ambilBuku, ONGKIR_FLAT } from "@/data/buku";
import { isiKeranjang } from "@/lib/keranjang";
import { NAMA_COOKIE } from "@/lib/tanda-browser";
import { rupiah } from "@/components/buku/KartuBuku";
import FormAlamat from "@/components/buku/FormAlamat";

export const dynamic = "force-dynamic";

export default async function HalamanAlamat({
  searchParams,
}: {
  searchParams: Promise<{ beli?: string }>;
}) {
  const sp = await searchParams;
  const slugDipilih = (sp.beli ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const c = await cookies();
  const tanda = c.get(NAMA_COOKIE)?.value ?? "";
  const isi = tanda ? isiKeranjang(tanda) : [];

  const baris = isi
    .filter((b) => slugDipilih.includes(b.slug_buku))
    .map((b) => {
      const buku = ambilBuku(b.slug_buku);
      return buku
        ? { slug: buku.slug, judul: buku.judul, harga: buku.harga,
            jumlah: b.jumlah }
        : null;
    })
    .filter((x) => x !== null);

  if (baris.length === 0) {
    return (
      <main className="toko-wadah">
        <p className="toko-crumbs">
          <Link href="/buku">Katalog</Link>
          <span>/</span>
          <Link href="/buku/keranjang">Keranjang</Link>
          <span>/</span>
          Alamat
        </p>
        <h1 className="toko-h1">Alamat pengiriman</h1>
        <div className="toko-pesan toko-pesan-gagal">
          Belum ada buku yang dipilih. Buka keranjang, centang buku yang
          mau dibeli, lalu tekan &ldquo;Lanjut isi alamat&rdquo;.
        </div>
        <Link href="/buku/keranjang" className="toko-btn toko-btn-utama">
          Buka keranjang
        </Link>
      </main>
    );
  }

  const subtotal = baris.reduce((t, b) => t + b.harga * b.jumlah, 0);
  const total = subtotal + ONGKIR_FLAT;

  return (
    <main className="toko-wadah">
      <p className="toko-crumbs">
        <Link href="/buku">Katalog</Link>
        <span>/</span>
        <Link href="/buku/keranjang">Keranjang</Link>
        <span>/</span>
        Alamat pengiriman
      </p>
      <h1 className="toko-h1">Alamat pengiriman</h1>
      <p className="toko-ket" style={{ marginBottom: 22 }}>
        Isi data penerima. Nomor HP dipakai kurir untuk menghubungi kamu,
        jadi mohon ditulis dengan benar.
      </p>

      <div className="dua-kolom">
        <FormAlamat
          baris={baris}
          subtotal={subtotal}
          ongkir={ONGKIR_FLAT}
          total={total}
        />

        <div className="toko-panel ringkas-belanja">
          <h2 className="toko-h2" style={{ fontSize: 16 }}>
            Pesanan kamu
          </h2>
          {baris.map((b) => (
            <div className="baris-hitung" key={b.slug}>
              <span>
                {b.judul} &times; {b.jumlah}
              </span>
              <b>{rupiah(b.harga * b.jumlah)}</b>
            </div>
          ))}
          <div className="baris-hitung">
            <span>Ongkir seluruh Indonesia</span>
            <b>{rupiah(ONGKIR_FLAT)}</b>
          </div>
          <div className="baris-hitung total">
            <span>Total</span>
            <span>{rupiah(total)}</span>
          </div>
          <p className="toko-kecil" style={{ marginTop: 12 }}>
            Setelah menekan &ldquo;Buat pesanan&rdquo;, kamu akan menerima
            nomor pesanan dan cara pembayaran QRIS.
          </p>
        </div>
      </div>
    </main>
  );
}
