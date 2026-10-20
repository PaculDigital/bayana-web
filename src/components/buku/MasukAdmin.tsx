// MasukAdmin.tsx — kotak password admin / tombol keluar.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MasukAdmin({ keluar = false }: { keluar?: boolean }) {
  const router = useRouter();
  const [sandi, setSandi] = useState("");
  const [kirim, setKirim] = useState(false);
  const [pesan, setPesan] = useState("");

  async function masuk(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPesan("");
    if (!sandi) {
      setPesan("Password masih kosong.");
      return;
    }
    setKirim(true);
    try {
      const r = await fetch("/api/buku/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: sandi }),
      });
      const j = await r.json();
      if (!j.ok) {
        setPesan(j.pesan ?? "Password belum cocok.");
        setKirim(false);
        return;
      }
      setSandi("");
      router.refresh();
    } catch {
      setPesan("Sambungan terputus. Coba sekali lagi ya.");
      setKirim(false);
    }
  }

  async function keluarSekarang() {
    await fetch("/api/buku/admin", { method: "DELETE" });
    router.refresh();
  }

  if (keluar) {
    return (
      <button type="button" className="toko-btn toko-btn-garis toko-btn-kecil"
        onClick={keluarSekarang}>
        Keluar dari admin
      </button>
    );
  }

  return (
    <form className="toko-panel" onSubmit={masuk} noValidate>
      {pesan && <p className="toko-pesan toko-pesan-gagal">{pesan}</p>}
      <div className="toko-bidang">
        <label htmlFor="sandi">Password admin</label>
        <input id="sandi" type="password" value={sandi}
          onChange={(e) => setSandi(e.target.value)}
          autoComplete="current-password" />
      </div>
      <button type="submit" className="toko-btn toko-btn-utama toko-btn-lebar"
        disabled={kirim}>
        {kirim ? "Memeriksa…" : "Masuk"}
      </button>
    </form>
  );
}
