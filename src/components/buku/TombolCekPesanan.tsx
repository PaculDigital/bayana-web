// TombolCekPesanan.tsx — TOMBOL "CEK PESANAN" dengan POPUP.
//
// ⚠️ PERBAIKAN 22Sep26 — WULAN SALAH (teguran Bos, verbatim):
//   "Kok masih ikon search, saya suruh ganti menjadi 'CEK PESANAN' jadi
//    user jelas dia itu buat cek pesanan saya, bukan ikon search gitu
//    membingungkan. Kalo bisa waktu di klik muncul popup saja, tidak
//    perlu satu halaman penuh."
//
//   CACAT SEBELUMNYA: di CSS, Wulan sendiri menyembunyikan tulisan pada
//   layar ≤700px (`.toko-cek-pesanan span { clip: ... }`) dengan alasan
//   "menu atas di HP kepadatan". Akibatnya di HP tombolnya kembali
//   menjadi LINGKARAN BERIKON saja — persis ikon search yang Bos
//   minta dibuang. Wulan menuruti kekhawatiran sendiri, bukan perintah
//   Bos. Sekarang tulisan SELALU tampil di semua ukuran layar.
//
//   PERUBAHAN KEDUA (permintaan Bos): tombol TIDAK lagi membuka halaman
//   penuh, tetapi memunculkan POPUP berisi kolom nomor pesanan. Begitu
//   nomor dimasukkan, popup langsung menampilkan statusnya — tanpa
//   berpindah halaman. Halaman penuh /buku/lacak TETAP ADA (tidak
//   dihapus) karena pembeli yang membuka tautan simpanan bisa saja
//   mendarat di sana, dan tombol "Buka halaman penuh" disediakan untuk
//   yang menginginkan alamat yang bisa disimpan.

"use client";

import { useEffect, useRef, useState } from "react";

type HasilCek = {
  ok: boolean;
  pesan?: string;
  no_order?: string;
  nama?: string;
  status?: string;
  status_label?: string;
  total?: number;
  dibuat_pada?: string;
  butir?: { judul: string; jumlah: number }[];
};

export default function TombolCekPesanan() {
  const [buka, setBuka] = useState(false);
  const [no, setNo] = useState("");
  const [sedang, setSedang] = useState(false);
  const [hasil, setHasil] = useState<HasilCek | null>(null);
  const kotak = useRef<HTMLInputElement>(null);

  // Fokus otomatis ke kolom nomor begitu popup terbuka — supaya pembeli
  // bisa langsung mengetik, tidak perlu mencari kolomnya dulu.
  useEffect(() => {
    if (buka) setTimeout(() => kotak.current?.focus(), 60);
  }, [buka]);

  // Tombol Esc menutup popup (kebiasaan peramban yang diharapkan user).
  useEffect(() => {
    function tombol(e: KeyboardEvent) {
      if (e.key === "Escape") setBuka(false);
    }
    if (buka) window.addEventListener("keydown", tombol);
    return () => window.removeEventListener("keydown", tombol);
  }, [buka]);

  async function cek(e: React.FormEvent) {
    e.preventDefault();
    const bersih = no.trim().toUpperCase();
    if (!bersih) return;
    setSedang(true);
    setHasil(null);
    try {
      const r = await fetch(
        `/api/buku/pesanan/cek?no=${encodeURIComponent(bersih)}`,
        { cache: "no-store" }
      );
      setHasil(await r.json());
    } catch {
      setHasil({ ok: false, pesan: "Sambungan gagal. Coba lagi ya." });
    } finally {
      setSedang(false);
    }
  }

  return (
    <>
      {/* ⚠️ Tulisan SELALU tampil — juga di HP. Di layar sangat sempit
          (≤380px) didekan jadi "Cek", TIDAK disembunyikan. */}
      <button
        type="button"
        className="toko-cek-pesanan"
        onClick={() => { setBuka(true); setHasil(null); }}
        aria-label="Cek pesanan"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="10.6" cy="10.6" r="6.4" />
          <path d="M15.4 15.4 21 21" />
        </svg>
        <span className="teks-panjang">Cek Pesanan</span>
        <span className="teks-pendek">Cek</span>
      </button>

      {buka && (
        <div className="popup-lapis" onClick={() => setBuka(false)}>
          <div
            className="popup-kotak"
            role="dialog"
            aria-modal="true"
            aria-label="Cek pesanan"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-kepala">
              <b>Cek Pesanan</b>
              <button
                type="button"
                className="popup-tutup"
                onClick={() => setBuka(false)}
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <p className="popup-ket">
              Masukkan nomor pesanan kamu (contoh: <b>BYN-K7X2M9QP</b>).
              Tidak perlu login.
            </p>

            <form onSubmit={cek} className="popup-form">
              <input
                ref={kotak}
                value={no}
                onChange={(e) => setNo(e.target.value.toUpperCase())}
                placeholder="BYN-XXXXXXXX"
                autoCapitalize="characters"
                autoComplete="off"
                aria-label="Nomor pesanan"
                className="popup-input"
              />
              <button type="submit" className="toko-btn toko-btn-cek-pesanan"
                disabled={sedang}>
                {sedang ? "Mencari…" : "Lihat Status"}
              </button>
            </form>

            {hasil && !hasil.ok && (
              <div className="popup-hasil popup-gagal">
                {hasil.pesan ??
                  `Nomor ${no} tidak ditemukan. Periksa lagi hurufnya ya.`}
              </div>
            )}

            {hasil?.ok && (
              <div className="popup-hasil popup-berhasil">
                <p className="popup-no">{hasil.no_order}</p>
                <p className="popup-status">{hasil.status_label}</p>
                {hasil.nama && (
                  <p className="popup-baris">Penerima: <b>{hasil.nama}</b></p>
                )}
                {hasil.butir && hasil.butir.length > 0 && (
                  <p className="popup-baris">
                    {hasil.butir
                      .map((b) => `${b.judul} × ${b.jumlah}`)
                      .join(", ")}
                  </p>
                )}
                <a
                  className="popup-tautan"
                  href={`/buku/lacak?no=${encodeURIComponent(hasil.no_order ?? "")}`}
                >
                  Lihat rincian lengkap pesanan ini
                </a>
                <a className="popup-tautan" href="/buku/pesanan">
                  Semua pesanan dari perangkat ini
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
