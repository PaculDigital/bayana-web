// TombolBeli.tsx — tombol "Beli Sekarang" & "+ Keranjang" di halaman buku.
//
// ⚠️ CACAT YANG DIPERBAIKI (22Sep26): tombol versi pertama hanya
//    BERUPA TAUTAN ke /buku/keranjang?tambah=..., tetapi halaman
//    keranjang TIDAK PERNAH memproses parameter itu → tombol tidak
//    melakukan apa pun (halaman tetap kosong, tanpa galat).
//    Sekarang tombol ini benar-benar mengirim ke API.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TombolBeli({ slug }: { slug: string }) {
  const router = useRouter();
  const [sedang, setSedang] = useState(false);
  const [pesan, setPesan] = useState("");
  const [berhasil, setBerhasil] = useState(false);

  async function tambah(keKeranjangSaja: boolean) {
    setPesan("");
    setSedang(true);
    try {
      const r = await fetch("/api/buku/keranjang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aksi: "tambah", slug, jumlah: 1 }),
      });
      const j = await r.json();
      if (!j.ok) {
        setPesan(j.pesan ?? "Buku belum masuk keranjang. Coba sekali lagi ya.");
        setSedang(false);
        return;
      }
      if (keKeranjangSaja) {
        setBerhasil(true);
        router.refresh();          // lencana navbar ikut naik
        setSedang(false);
      } else {
        // Beli Sekarang → langsung masuk keranjang & lanjut isi alamat
        router.push(`/buku/keranjang`);
      }
    } catch {
      setPesan("Sambungan terputus. Coba tekan sekali lagi ya.");
      setSedang(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          type="button"
          className="toko-btn toko-btn-utama"
          onClick={() => tambah(false)}
          disabled={sedang}
        >
          {sedang ? "Menambahkan…" : "Beli Sekarang"}
        </button>
        <button
          type="button"
          className="toko-btn toko-btn-garis"
          onClick={() => tambah(true)}
          disabled={sedang}
        >
          Masukkan keranjang
        </button>
      </div>

      {pesan && (
        <p className="toko-pesan toko-pesan-gagal" style={{ marginTop: 12 }}>
          {pesan}
        </p>
      )}
      {berhasil && (
        <p className="toko-pesan toko-pesan-berhasil" style={{ marginTop: 12 }}>
          Buku sudah masuk keranjang.{" "}
          <a href="/buku/keranjang" style={{ textDecoration: "underline" }}>
            Buka keranjang
          </a>
        </p>
      )}
    </div>
  );
}
