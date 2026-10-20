// FormKontak.tsx — formulir kirim pesan ke penerbit.

"use client";

import { useState } from "react";

export default function FormKontak() {
  const [kirim, setKirim] = useState(false);
  const [pesan, setPesan] = useState("");
  const [berhasil, setBerhasil] = useState(false);
  const [kurang, setKurang] = useState<string[]>([]);

  async function kirimPesan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPesan("");
    setKurang([]);

    const f = new FormData(e.currentTarget);
    const isi = {
      nama: String(f.get("nama") ?? "").trim(),
      email: String(f.get("email") ?? "").trim(),
      subjek: String(f.get("subjek") ?? "").trim(),
      pesan: String(f.get("pesan") ?? "").trim(),
    };

    const k: string[] = [];
    if (!isi.nama) k.push("nama");
    if (!isi.email) k.push("email");
    if (!isi.pesan) k.push("pesan");
    if (k.length > 0) {
      setKurang(k);
      setPesan("Masih ada kolom yang perlu diisi ya — lihat yang ditandai.");
      return;
    }
    // periksa bentuk email secara sederhana
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(isi.email)) {
      setKurang(["email"]);
      setPesan("Alamat emailnya belum benar. Contoh: nama@email.com");
      return;
    }

    setKirim(true);
    try {
      const r = await fetch("/api/buku/kontak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isi),
      });
      const j = await r.json();
      if (!j.ok) {
        setPesan(j.pesan ?? "Pesan belum terkirim. Coba sekali lagi ya.");
        setKirim(false);
        return;
      }
      setBerhasil(true);
    } catch {
      setPesan("Sambungan terputus. Coba tekan sekali lagi ya.");
      setKirim(false);
    }
  }

  const tanda = (n: string) => (kurang.includes(n) ? "⚠" : "");

  if (berhasil) {
    return (
      <div className="toko-form-email">
        <p className="toko-pesan toko-pesan-berhasil" style={{ margin: 0 }}>
          Terima kasih! Pesanmu sudah masuk ke penerbit. Kami balas
          lewat email yang kamu tulis, biasanya dalam 1×24 jam kerja.
        </p>
      </div>
    );
  }

  return (
    <form className="toko-form-email" onSubmit={kirimPesan} noValidate>
      <h2 className="toko-h2" style={{ fontSize: 16 }}>
        Kirim pesan
      </h2>
      <p className="toko-kecil" style={{ marginBottom: 16 }}>
        Tulis di sini — pesan langsung masuk ke penerbit, tidak perlu
        membuka aplikasi email.
      </p>

      {pesan && <p className="toko-pesan toko-pesan-gagal">{pesan}</p>}

      <div className="toko-baris-bidang">
        <div className="toko-bidang">
          <label htmlFor="k-nama">Nama {tanda("nama")}</label>
          <input id="k-nama" name="nama" autoComplete="name" />
        </div>
        <div className="toko-bidang">
          <label htmlFor="k-email">Email {tanda("email")}</label>
          <input id="k-email" name="email" type="email"
            autoComplete="email" placeholder="nama@email.com" />
        </div>
      </div>

      <div className="toko-bidang">
        <label htmlFor="k-subjek">Subjek (opsional)</label>
        <input id="k-subjek" name="subjek"
          placeholder="Mis. Pertanyaan pesanan BYN-XXXXXXXX" />
      </div>

      <div className="toko-bidang">
        <label htmlFor="k-pesan">Pesan {tanda("pesan")}</label>
        <textarea id="k-pesan" name="pesan"
          placeholder="Tulis pertanyaan atau keperluanmu di sini…" />
      </div>

      <button
        type="submit"
        className="toko-btn toko-btn-utama toko-btn-lebar"
        disabled={kirim}
      >
        {kirim ? "Mengirim…" : "Kirim pesan"}
      </button>
    </form>
  );
}
