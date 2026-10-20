// KartuBukti.tsx — KARTU BUKTI PESANAN (permintaan Bos 22Sep26).
//
// MASALAH YANG DIPERBAIKI (temuan Bos, verbatim):
//   "Saya bingung mengirimkan no pesanan ke user lewat apa? Kalo cuma
//    muncul di web habis itu hilang, nanti bagaimana caranya user cek
//    pesanan kalo lupa nomor pesanannya kalo tidak dikirim ke user.
//    User harus punya dokumentasi pesanannya."
//
// Jawaban Wulan: pembeli diberi TIGA jalan menyimpan nomornya.
//   1. Nomor ditampilkan BESAR dan mudah dibaca (bisa dipotret).
//   2. Tombol "Salin nomor" — sekali tekan, masuk ke papan klip HP.
//   3. Tombol "Simpan bukti pesanan" — mengunduh BERKAS berisi seluruh
//      rincian pesanan (nomor, tanggal, buku, total, alamat, status).
//      Berkas ini bisa disimpan di HP atau dikirim ke diri sendiri.
//
// ⚠️ CATATAN JUJUR (penting, jangan disembunyikan dari pembeli):
//   Pengiriman OTOMATIS lewat WhatsApp/email BELUM dikerjakan. Pemilik
//   toko sudah diberi tahu dan ini menunggu keputusan lanjutan. Karena
//   itu ketiga jalan di atas dibuat — supaya pembeli TIDAK kehilangan
//   nomor pesanannya sejak sekarang, tanpa menunggu apa pun.
//
// ⚠️ Berkas unduhan dibuat SEPENUHNYA di peramban pembeli (tanpa server,
//    tanpa internet) — jadi tetap bisa disimpan walau sambungan putus.

"use client";

import { useState } from "react";

export default function KartuBukti({
  noOrder,
  tanggal,
  nama,
  hp,
  alamat,
  baris,
  ongkir,
  total,
  status,
}: {
  noOrder: string;
  tanggal: string;
  nama: string;
  hp: string;
  alamat: string;
  baris: { judul: string; jumlah: number; harga: number }[];
  ongkir: number;
  total: number;
  status: string;
}) {
  const [tersalin, setTersalin] = useState(false);
  const [tersimpan, setTersimpan] = useState(false);

  /** Tekan 1× → nomor pesanan masuk papan klip. */
  async function salin() {
    try {
      await navigator.clipboard.writeText(noOrder);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 2500);
    } catch {
      // Peramban lama / bukan HTTPS → beri tahu apa adanya, jangan diam.
      setTersalin(false);
      alert("Tidak bisa menyalin otomatis. Tulis manual: " + noOrder);
    }
  }

  /** Buat & unduh berkas bukti pesanan (.txt) — tanpa server. */
  function simpan() {
    const rp = (n: number) =>
      "Rp" + n.toLocaleString("id-ID", { maximumFractionDigits: 0 });

    const isi = [
      "================================================",
      "        BUKTI PESANAN — BAYANA PUBLISHING",
      "================================================",
      "",
      "NOMOR PESANAN : " + noOrder,
      "TANGGAL       : " + tanggal,
      "STATUS        : " + status,
      "",
      "------------------------------------------------",
      "  KIRIM KE",
      "------------------------------------------------",
      nama,
      hp,
      alamat,
      "",
      "------------------------------------------------",
      "  PESANAN",
      "------------------------------------------------",
      ...baris.map(
        (b) => `${b.judul} x ${b.jumlah}   ${rp(b.harga * b.jumlah)}`
      ),
      "",
      `Ongkos kirim               ${rp(ongkir)}`,
      `TOTAL BAYAR                ${rp(total)}`,
      "",
      "================================================",
      "  CARA CEK STATUS PESANAN",
      "================================================",
      "1. Buka https://buku.bayana.id",
      "2. Klik tombol oranye 'Cek Pesanan' di kanan atas",
      "3. Masukkan nomor pesanan di atas, lalu tekan 'Lihat Status'",
      "",
      "Tanpa login, tanpa jadi member. Simpan berkas ini baik-baik.",
      "",
    ].join("\n");

    const blob = new Blob([isi], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Bukti-Pesanan-${noOrder}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setTersimpan(true);
    setTimeout(() => setTersimpan(false), 3000);
  }

  return (
    <div className="kartu-bukti">
      <p className="kartu-bukti-label">NOMOR PESANAN KAMU</p>

      {/* ⚠️ Nomor ditampilkan SANGAT BESAR (permintaan Bos: "Buat nomor
          pesanan terlihat Besar dan mudah dilihat") — ukurannya menyesuaikan
          lebar layar, jadi tetap MUAT di HP sempit dan tetap besar di
          laptop. Ditulis monospace supaya hurufnya tidak mudah tertukar. */}
      <p className="kartu-bukti-no">{noOrder}</p>

      <p className="kartu-bukti-hint">
        Potret layar ini, atau salin/simpan berkasnya. Nomor ini dipakai
        untuk melihat status pesanan kapan saja — tanpa login.
      </p>

      <div className="kartu-bukti-tombol">
        <button type="button" onClick={salin} className="toko-btn toko-btn-salin">
          {tersalin ? "✓ Tersalin" : "Salin nomor"}
        </button>
        <button type="button" onClick={simpan} className="toko-btn toko-btn-simpan">
          {tersimpan ? "✓ Tersimpan" : "Simpan bukti pesanan"}
        </button>
      </div>

      <p className="kartu-bukti-cara">
        Cara cek nanti: buka <b>buku.bayana.id</b> → tekan{" "}
        <b>Cek Pesanan</b> (tombol oranye di kanan atas) → masukkan nomor
        di atas.
      </p>

      <p className="toko-kecil" style={{ marginTop: 10 }}>
        Nomor pesanan ini juga otomatis tersimpan di halaman{" "}
        <b>Pesanan Saya</b> selama kamu memakai peramban yang sama.
      </p>
    </div>
  );
}
