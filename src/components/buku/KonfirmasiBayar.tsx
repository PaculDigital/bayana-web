// KonfirmasiBayar.tsx — kotak "Saya sudah bayar".
//
// Alur yang diminta Bos: tekan tombolnya → MUNCUL kotak untuk mengisi
// nomor pesanan → kalau nomornya benar, pembeli diarahkan ke halaman
// status pesanan (biar pembeli merasa aman).
//
// Tombol & kotak ini SAMA dengan yang ada di halaman "Lacak pesanan",
// supaya pembeli bisa memakainya dari mana saja.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function KonfirmasiBayar({
  noOrder,
  sudah,
  nama,
}: {
  noOrder: string;
  sudah: boolean;
  nama?: string;
}) {
  const router = useRouter();
  const [terbuka, setTerbuka] = useState(false);
  const [nomor, setNomor] = useState(noOrder);
  const [sedangKirim, setSedangKirim] = useState(false);
  const [pesan, setPesan] = useState("");
  const [berhasil, setBerhasil] = useState(sudah);

  async function kirim(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPesan("");
    const bersih = nomor.trim().toUpperCase();
    if (!bersih) {
      setPesan("Nomor pesanan masih kosong. Tulis nomornya dulu ya.");
      return;
    }
    setSedangKirim(true);
    try {
      const r = await fetch("/api/buku/bayar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ no_order: bersih, nama }),
      });
      const j = await r.json();
      if (!j.ok) {
        setPesan(j.pesan ?? "Nomor pesanan belum cocok. Periksa lagi ya.");
        setSedangKirim(false);
        return;
      }
      setBerhasil(true);
      // ke halaman status pesanan — pembeli bisa melihat sendiri
      router.push(`/buku/lacak?no=${encodeURIComponent(bersih)}`);
    } catch {
      setPesan("Sambungan terputus. Coba tekan sekali lagi ya.");
      setSedangKirim(false);
    }
  }

  if (berhasil) {
    return (
      <div className="toko-panel">
        <p className="toko-pesan toko-pesan-berhasil" style={{ margin: 0 }}>
          Terima kasih! Konfirmasi pembayaran sudah tercatat. Status
          pesanan akan diperbarui penerbit setelah dana dipastikan masuk.
        </p>
        <a
          href={`/buku/lacak?no=${encodeURIComponent(noOrder)}`}
          className="toko-btn toko-btn-utama toko-btn-kecil"
          style={{ marginTop: 12 }}
        >
          Lihat status pesanan
        </a>
      </div>
    );
  }

  return (
    <div className="toko-panel" style={{ marginTop: 18 }}>
      <h3 className="toko-h2" style={{ fontSize: 14 }}>
        Sudah membayar?
      </h3>
      <p className="toko-kecil" style={{ marginBottom: 12 }}>
        Tekan tombol di bawah, lalu masukkan nomor pesananmu. Kami
        akan menampilkan status pesanan supaya kamu bisa memantau.
      </p>

      {!terbuka ? (
        <button
          type="button"
          className="toko-btn toko-btn-utama toko-btn-lebar"
          onClick={() => setTerbuka(true)}
        >
          Saya sudah bayar
        </button>
      ) : (
        <form onSubmit={kirim} noValidate>
          {pesan && <p className="toko-pesan toko-pesan-gagal">{pesan}</p>}
          <div className="toko-bidang">
            <label htmlFor="no_order_bayar">Nomor pesanan</label>
            <input
              id="no_order_bayar"
              value={nomor}
              onChange={(e) => setNomor(e.target.value)}
              placeholder="BYN-XXXXXXXX"
              autoCapitalize="characters"
              autoComplete="off"
              style={{ fontFamily: "ui-monospace, monospace",
                       letterSpacing: "0.06em" }}
            />
          </div>
          <button
            type="submit"
            className="toko-btn toko-btn-utama toko-btn-lebar"
            disabled={sedangKirim}
          >
            {sedangKirim ? "Memeriksa…" : "Konfirmasi pembayaran"}
          </button>
          <button
            type="button"
            className="toko-btn toko-btn-garis toko-btn-lebar"
            style={{ marginTop: 8 }}
            onClick={() => {
              setTerbuka(false);
              setPesan("");
            }}
          >
            Batal
          </button>
        </form>
      )}
    </div>
  );
}
