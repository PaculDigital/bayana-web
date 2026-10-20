// KeranjangKlien.tsx — bagian keranjang yang butuh interaksi pembeli.
//
// KENAPA JADI KOMPONEN KLIEN: centang, tombol +/-, dan total harus
// berubah SEGERA tanpa memuat ulang halaman.
//
// ⚠️ Tombol "Lanjut isi alamat" menyimpan pilihan centang di alamat
//    tujuan (?pilih=slug1,slug2) supaya halaman alamat tahu buku mana
//    yang mau dibeli. Tidak perlu simpan di server untuk hal sesaat ini.

"use client";

import { useState } from "react";
import Link from "next/link";
import type { Buku } from "@/data/buku";
import CoverBuku from "./CoverBuku";
import { rupiah } from "./KartuBuku";

interface Baris {
  id: number;
  slug: string;
  judul: string;
  penulis: string;
  harga: number;
  jumlah: number;
  buku: Buku;
}

export default function KeranjangKlien({
  baris,
  ongkir,
}: {
  baris: Baris[];
  ongkir: number;
}) {
  const [jumlah, setJumlah] = useState<Record<number, number>>(
    Object.fromEntries(baris.map((b) => [b.id, b.jumlah]))
  );
  const [dicentang, setDicentang] = useState<Record<number, boolean>>(
    Object.fromEntries(baris.map((b) => [b.id, true]))
  );
  const [sedangKirim, setSedangKirim] = useState(false);
  const [pesan, setPesan] = useState("");

  const semuaDicentang = baris.every((b) => dicentang[b.id]);

  const subtotal = baris.reduce(
    (t, b) => (dicentang[b.id] ? t + b.harga * (jumlah[b.id] ?? b.jumlah) : t),
    0
  );
  const adaPilihan = subtotal > 0;
  const total = subtotal + (adaPilihan ? ongkir : 0);

  async function ubah(id: number, nilai: number) {
    if (nilai < 1) return;
    setJumlah((s) => ({ ...s, [id]: nilai }));
    try {
      await fetch("/api/buku/keranjang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aksi: "jumlah", id, jumlah: nilai }),
      });
    } catch {
      setPesan("Perubahan jumlah belum tersimpan. Coba sekali lagi ya.");
    }
  }

  async function buang(id: number) {
    setSedangKirim(true);
    try {
      await fetch("/api/buku/keranjang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aksi: "buang", id }),
      });
      window.location.reload();
    } catch {
      setPesan("Buku belum terbuang. Coba sekali lagi ya.");
      setSedangKirim(false);
    }
  }

  const dipilih = baris.filter((b) => dicentang[b.id]).map((b) => b.slug);

  return (
    <div className="dua-kolom">
      <div className="toko-panel" style={{ padding: "8px 26px 20px" }}>
        {baris.map((b) => (
          <div className="butir-keranjang" key={b.id}>
            <input
              type="checkbox"
              className="centang"
              checked={!!dicentang[b.id]}
              onChange={(e) =>
                setDicentang((s) => ({ ...s, [b.id]: e.target.checked }))
              }
              aria-label={`Pilih ${b.judul}`}
            />
            <Link href={`/buku/${b.slug}`} className="mini-cover">
              <CoverBuku buku={b.buku} className="w-full h-auto block" />
            </Link>
            <div className="info">
              <h4>
                <Link href={`/buku/${b.slug}`}>{b.judul}</Link>
              </h4>
              <p>{b.penulis}</p>
              <p style={{ marginTop: 4 }}>{rupiah(b.harga)} / buku</p>
            </div>
            <div className="kanan">
              <div className="atur-jumlah">
                <button
                  type="button"
                  onClick={() => ubah(b.id, (jumlah[b.id] ?? 1) - 1)}
                  aria-label="Kurangi jumlah"
                >
                  −
                </button>
                <span>{jumlah[b.id] ?? b.jumlah}</span>
                <button
                  type="button"
                  onClick={() => ubah(b.id, (jumlah[b.id] ?? 1) + 1)}
                  aria-label="Tambah jumlah"
                >
                  +
                </button>
              </div>
              <p className="harga-baris">
                {rupiah(b.harga * (jumlah[b.id] ?? b.jumlah))}
              </p>
              <button
                type="button"
                className="hapus-butir"
                onClick={() => buang(b.id)}
                disabled={sedangKirim}
              >
                Buang
              </button>
            </div>
          </div>
        ))}

        <div className="paut-keranjang">
          <label style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <input
              type="checkbox"
              className="centang"
              checked={semuaDicentang}
              onChange={(e) =>
                setDicentang(
                  Object.fromEntries(baris.map((b) => [b.id, e.target.checked]))
                )
              }
            />
            <span style={{ fontSize: 13.5 }}>Pilih semua</span>
          </label>
          <Link href="/buku" className="toko-btn toko-btn-garis toko-btn-kecil">
            Tambah buku lain
          </Link>
        </div>
      </div>

      <div>
        <div className="toko-panel ringkas-belanja">
          <h2 className="toko-h2" style={{ fontSize: 16 }}>
            Ringkasan
          </h2>
          <div className="baris-hitung">
            <span>Subtotal ({dipilih.length} buku)</span>
            <b>{rupiah(subtotal)}</b>
          </div>
          <div className="baris-hitung">
            <span>Ongkir seluruh Indonesia</span>
            <b>{adaPilihan ? rupiah(ongkir) : "—"}</b>
          </div>
          <div className="baris-hitung total">
            <span>Total</span>
            <span>{rupiah(total)}</span>
          </div>

          {pesan && (
            <p className="toko-pesan toko-pesan-gagal" style={{ marginTop: 14 }}>
              {pesan}
            </p>
          )}

          {adaPilihan ? (
            <Link
              href={`/buku/alamat?beli=${dipilih.join(",")}`}
              className="toko-btn toko-btn-utama toko-btn-lebar"
              style={{ marginTop: 16 }}
            >
              Lanjut isi alamat
            </Link>
          ) : (
            <button
              type="button"
              className="toko-btn toko-btn-utama toko-btn-lebar"
              style={{ marginTop: 16 }}
              disabled
            >
              Centang buku dulu
            </button>
          )}

          <p className="toko-kecil" style={{ marginTop: 12 }}>
            Tidak perlu membuat akun. Setelah memesan, kamu dapat nomor
            pesanan untuk melacak statusnya.
          </p>
        </div>
      </div>
    </div>
  );
}
