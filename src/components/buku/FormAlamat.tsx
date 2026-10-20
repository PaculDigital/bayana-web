// FormAlamat.tsx — form data penerima + tombol "Buat pesanan".
//
// ⚠️ Tanda-browser: kalau pembeli BELUM punya cookie (mis. langsung
//    buka /buku/alamat), pembuatan pesanan tetap berhasil karena
//    Route Handler yang menyetel cookie-nya.
//
// ── PERBAIKAN 22Sep26 (3 keluhan Bos) ─────────────────────────────────
// 1. "Kota/Kabupaten, Provinsi" → sekarang DROPDOWN, tidak diketik lagi.
// 2. Ditambah kolom WAJIB: Kecamatan dan Kelurahan/Desa.
// 3. Setiap kolom wajib diberi tanda bintang merah (*) supaya pembeli
//    tahu sejak awal — bukan baru tahu setelah menekan tombol.
// 4. Kode pos & catatan tetap OPSIONAL (jujur: kurir tidak selalu
//    memerlukan kode pos, dan catatan memang tidak wajib).

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { rupiah } from "./KartuBuku";
import { PROVINSI, KOTA } from "@/lib/data-wilayah";

interface Baris {
  slug: string;
  judul: string;
  harga: number;
  jumlah: number;
}

/** Penanda "wajib diisi" — dipakai di sebelah label. */
function Wajib() {
  return <span className="toko-wajib" aria-hidden="true"> *</span>;
}

export default function FormAlamat({
  baris,
  subtotal,
  ongkir,
  total,
}: {
  baris: Baris[];
  subtotal: number;
  ongkir: number;
  total: number;
}) {
  const router = useRouter();
  const [sedangKirim, setSedangKirim] = useState(false);
  const [pesan, setPesan] = useState("");
  const [bidangKurang, setBidangKurang] = useState<string[]>([]);

  // Provinsi & kota dipilih pembeli. Kota bergantung pada provinsi.
  const [provinsi, setProvinsi] = useState("");
  const [kota, setKota] = useState("");
  // Beberapa kabupaten belum ada di daftar → pembeli boleh mengetik.
  const [kotaLain, setKotaLain] = useState("");

  const daftarKota = provinsi ? KOTA[provinsi] ?? [] : [];

  /** Nilai kota yang benar-benar dikirim: pilihan atau ketikan. */
  function kotaTerpilih(): string {
    return kota === "__lain__" ? kotaLain.trim() : kota;
  }

  async function kirim(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPesan("");
    setBidangKurang([]);
    setSedangKirim(true);

    const f = new FormData(e.currentTarget);
    const isi = {
      nama_penerima: String(f.get("nama") ?? "").trim(),
      hp: String(f.get("hp") ?? "").trim(),
      alamat: String(f.get("alamat") ?? "").trim(),
      kelurahan: String(f.get("kelurahan") ?? "").trim(),
      kecamatan: String(f.get("kecamatan") ?? "").trim(),
      kota: kotaTerpilih(),
      provinsi,
      kode_pos: String(f.get("kode_pos") ?? "").trim(),
      catatan: String(f.get("catatan") ?? "").trim(),
      beli: baris.map((b) => b.slug),
    };

    // periksa di sisi tampilan dulu supaya pembeli cepat tahu
    const kurang: string[] = [];
    if (!isi.nama_penerima) kurang.push("nama");
    if (!isi.hp) kurang.push("hp");
    if (!isi.alamat) kurang.push("alamat");
    if (!isi.kelurahan) kurang.push("kelurahan");
    if (!isi.kecamatan) kurang.push("kecamatan");
    if (!isi.kota) kurang.push("kota");
    if (!isi.provinsi) kurang.push("provinsi");
    if (kurang.length > 0) {
      setBidangKurang(kurang);
      setPesan("Masih ada kolom bertanda * yang perlu diisi ya — lihat yang ditandai merah.");
      setSedangKirim(false);
      // arahkan mata pembeli ke kolom pertama yang kurang
      const el = document.getElementById(kurang[0]);
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      el?.focus();
      return;
    }

    try {
      const r = await fetch("/api/buku/pesanan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isi),
      });
      const j = await r.json();
      if (!j.ok) {
        setPesan(j.pesan ?? "Pesanan belum bisa dibuat. Coba sekali lagi ya.");
        setSedangKirim(false);
        return;
      }
      // berhasil → ke halaman QRIS dengan nomor pesanan
      router.push(`/buku/bayar/${encodeURIComponent(j.no_order)}`);
    } catch {
      setPesan("Sambungan terputus. Coba tekan sekali lagi ya.");
      setSedangKirim(false);
    }
  }

  const kurang = (n: string) => (bidangKurang.includes(n) ? " ⚠" : "");

  return (
    <form className="toko-panel" onSubmit={kirim} noValidate>
      <h2 className="toko-h2" style={{ fontSize: 16 }}>
        Data penerima
      </h2>
      <p className="toko-kecil" style={{ marginTop: -4, marginBottom: 14 }}>
        Kolom bertanda <span className="toko-wajib">*</span> wajib diisi.
      </p>

      {pesan && (
        <p className="toko-pesan toko-pesan-gagal">{pesan}</p>
      )}

      <div className="toko-bidang">
        <label htmlFor="nama">
          Nama penerima<Wajib />
          {kurang("nama")}
        </label>
        <input id="nama" name="nama" autoComplete="name"
          placeholder="Mis. Dewi Anggraini"
          className={bidangKurang.includes("nama") ? "toko-kurang" : ""}
        />
      </div>

      <div className="toko-bidang">
        <label htmlFor="hp">
          Nomor HP / WhatsApp<Wajib />
          {kurang("hp")}
        </label>
        <input id="hp" name="hp" inputMode="tel" autoComplete="tel"
          placeholder="Mis. 081234567890"
          className={bidangKurang.includes("hp") ? "toko-kurang" : ""}
        />
      </div>

      <div className="toko-bidang">
        <label htmlFor="alamat">
          Alamat lengkap (jalan, nomor rumah, RT/RW)<Wajib />
          {kurang("alamat")}
        </label>
        <textarea id="alamat" name="alamat" autoComplete="street-address"
          rows={3}
          placeholder="Mis. Jl. Merdeka No. 12, RT 03 / RW 05"
          className={bidangKurang.includes("alamat") ? "toko-kurang" : ""}
        />
      </div>

      {/* ── PROVINSI (dropdown) ───────────────────────────────────────── */}
      <div className="toko-bidang">
        <label htmlFor="provinsi">
          Provinsi<Wajib />
          {kurang("provinsi")}
        </label>
        <select id="provinsi" name="provinsi"
          value={provinsi}
          onChange={(e) => {
            setProvinsi(e.target.value);
            setKota("");       // kota ikut direset kalau provinsi berganti
            setKotaLain("");
          }}
          className={bidangKurang.includes("provinsi") ? "toko-kurang" : ""}
        >
          <option value="">— Pilih provinsi —</option>
          {PROVINSI.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* ── KOTA / KABUPATEN (dropdown, bergantung provinsi) ───────────── */}
      <div className="toko-bidang">
        <label htmlFor="kota">
          Kota / Kabupaten<Wajib />
          {kurang("kota")}
        </label>
        <select id="kota" name="kota"
          value={kota}
          onChange={(e) => setKota(e.target.value)}
          disabled={!provinsi}
          className={bidangKurang.includes("kota") ? "toko-kurang" : ""}
        >
          <option value="">
            {provinsi ? "— Pilih kota / kabupaten —" : "— Pilih provinsi dulu —"}
          </option>
          {daftarKota.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
          {/* Jalan keluar untuk kabupaten yang belum tercantum di daftar */}
          {provinsi && <option value="__lain__">Kota/Kabupaten lain…</option>}
        </select>
        {kota === "__lain__" && (
          <input id="kota-lain" name="kota_lain" style={{ marginTop: 8 }}
            placeholder="Tulis nama kota / kabupaten kamu"
            value={kotaLain}
            onChange={(e) => setKotaLain(e.target.value)}
          />
        )}
      </div>

      <div className="toko-baris-2">
        <div className="toko-bidang">
          <label htmlFor="kecamatan">
            Kecamatan<Wajib />
            {kurang("kecamatan")}
          </label>
          <input id="kecamatan" name="kecamatan"
            placeholder="Mis. Coblong"
            className={bidangKurang.includes("kecamatan") ? "toko-kurang" : ""}
          />
        </div>
        <div className="toko-bidang">
          <label htmlFor="kelurahan">
            Kelurahan / Desa<Wajib />
            {kurang("kelurahan")}
          </label>
          <input id="kelurahan" name="kelurahan"
            placeholder="Mis. Dago"
            className={bidangKurang.includes("kelurahan") ? "toko-kurang" : ""}
          />
        </div>
      </div>

      <div className="toko-baris-2">
        <div className="toko-bidang">
          <label htmlFor="kode_pos">Kode pos (opsional)</label>
          <input id="kode_pos" name="kode_pos" inputMode="numeric"
            placeholder="Mis. 40135" />
        </div>
        <div className="toko-bidang">
          <label htmlFor="catatan">Catatan (opsional)</label>
          <input id="catatan" name="catatan"
            placeholder="Mis. rumah pagar hijau" />
        </div>
      </div>

      <div className="baris-hitung" style={{ marginTop: 4 }}>
        <span>Subtotal</span>
        <b>{rupiah(subtotal)}</b>
      </div>
      <div className="baris-hitung">
        <span>Ongkir</span>
        <b>{rupiah(ongkir)}</b>
      </div>
      <div className="baris-hitung total">
        <span>Total bayar</span>
        <span>{rupiah(total)}</span>
      </div>

      {/* ⚠️ Tulisan tombol WAJIB putih di atas hijau (keluhan Bos 22Sep26:
          "tulisan hitam, harusnya putih"). Warna diatur lewat kelas
          .toko-btn-utama + penegasan inline supaya tidak mungkin
          tertimpa aturan lain. */}
      <button
        type="submit"
        className="toko-btn toko-btn-utama toko-btn-lebar"
        style={{ marginTop: 16, color: "#ffffff" }}
        disabled={sedangKirim}
      >
        {sedangKirim ? "Membuat pesanan…" : "Buat pesanan"}
      </button>

      <p className="toko-kecil" style={{ marginTop: 12 }}>
        Tidak perlu membuat akun. Setelah pesanan dibuat, simpan nomor
        pesanan untuk melacak status.
      </p>
    </form>
  );
}
