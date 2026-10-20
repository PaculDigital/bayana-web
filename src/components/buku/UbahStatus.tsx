// UbahStatus.tsx — admin mengubah status pesanan.
//
// Alur status: Belum Bayar → Dikemas → Dikirim → Beri Penilaian.
// Nomor resi diisi saat menandai "Dikirim".

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PILIHAN = [
  { nilai: "belum_bayar", label: "Belum Bayar" },
  { nilai: "dikemas", label: "Dikemas" },
  { nilai: "dikirim", label: "Dikirim" },
  { nilai: "selesai", label: "Selesai" },
] as const;

export default function UbahStatus({
  noOrder,
  status,
  resi,
}: {
  noOrder: string;
  status: string;
  resi: string | null;
}) {
  const router = useRouter();
  const [pilih, setPilih] = useState(status);
  const [nomorResi, setNomorResi] = useState(resi ?? "");
  const [kirim, setKirim] = useState(false);
  const [pesan, setPesan] = useState("");

  async function simpan() {
    setPesan("");
    setKirim(true);
    try {
      const r = await fetch("/api/buku/admin/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          no_order: noOrder,
          status: pilih,
          // ⚠️ Kirim resi SELALU (walau kosong) supaya server tahu
          //    maksud admin. Server sendiri yang menjaga: resi kosong
          //    tidak akan menghapus resi lama.
          resi: nomorResi,
        }),
      });
      const j = await r.json();
      if (!j.ok) {
        setPesan(j.pesan ?? "Status belum berubah.");
        setKirim(false);
        return;
      }
      router.refresh();
      setKirim(false);
    } catch {
      setPesan("Sambungan terputus.");
      setKirim(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6,
      minWidth: 150 }}>
      <select
        value={pilih}
        onChange={(e) => setPilih(e.target.value)}
        style={{ fontFamily: "inherit", fontSize: 13, padding: "7px 9px",
                 border: "1px solid var(--buku-line)", borderRadius: 8 }}
        aria-label={`Status pesanan ${noOrder}`}
      >
        {PILIHAN.map((p) => (
          <option key={p.nilai} value={p.nilai}>{p.label}</option>
        ))}
      </select>

      {pilih === "dikirim" && (
        <input
          value={nomorResi}
          onChange={(e) => setNomorResi(e.target.value)}
          placeholder="Nomor resi (mis. JNE…)"
          style={{ fontFamily: "inherit", fontSize: 12.5, padding: "7px 9px",
                   border: "1px solid var(--buku-line)", borderRadius: 8 }}
          aria-label="Nomor resi"
        />
      )}

      <button
        type="button"
        className="toko-btn toko-btn-utama toko-btn-kecil"
        onClick={simpan}
        disabled={kirim || pilih === status}
      >
        {kirim ? "Menyimpan…" : pilih === status ? "Sama" : "Simpan"}
      </button>

      {pesan && (
        <span style={{ fontSize: 11.5, color: "#8f2626" }}>{pesan}</span>
      )}
    </div>
  );
}
