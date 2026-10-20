// FormPenilaian.tsx — form bintang + komentar, dibuka dengan nomor pesanan.
//
// Sesuai putusan Bos: "kasih place holder rating dan komentar juga".
// Hanya pembeli yang punya nomor pesanan bisa menilai — jadi ulasan
// di halaman buku bisa dipercaya.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormPenilaian({
  noOrder,
  buku,
  sudahDinilai,
}: {
  noOrder: string;
  buku: { slug: string; judul: string }[];
  sudahDinilai?: string[];
}) {
  const router = useRouter();
  const [bintang, setBintang] = useState<Record<string, number>>({});
  const [komentar, setKomentar] = useState<Record<string, string>>({});
  const [kirim, setKirim] = useState(false);
  const [pesan, setPesan] = useState("");
  const [berhasil, setBerhasil] = useState(false);

  const sudah = sudahDinilai ?? [];
  const belum = buku.filter((b) => !sudah.includes(b.slug));

  if (belum.length === 0) {
    return (
      <div className="toko-panel">
        <p className="toko-pesan toko-pesan-berhasil" style={{ margin: 0 }}>
          Terima kasih — semua buku di pesanan ini sudah kamu nilai.
        </p>
      </div>
    );
  }

  const adaBintang = belum.some((b) => (bintang[b.slug] ?? 0) > 0);

  async function kirimSemua(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPesan("");
    if (!adaBintang) {
      setPesan("Pilih dulu berapa bintang untuk bukunya ya.");
      return;
    }
    setKirim(true);
    try {
      for (const b of belum) {
        if (!bintang[b.slug]) continue;
        await fetch("/api/buku/nilai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            no_order: noOrder,
            slug_buku: b.slug,
            bintang: bintang[b.slug],
            komentar: komentar[b.slug] ?? "",
          }),
        });
      }
      setBerhasil(true);
      router.refresh();
    } catch {
      setPesan("Ulasan belum tersimpan. Coba tekan sekali lagi ya.");
      setKirim(false);
    }
  }

  if (berhasil) {
    return (
      <div className="toko-panel">
        <p className="toko-pesan toko-pesan-berhasil" style={{ margin: 0 }}>
          Terima kasih! Ulasanmu sudah tersimpan dan tampil di halaman
          buku — membantu pembaca lain memilih.
        </p>
      </div>
    );
  }

  return (
    <form className="toko-panel" onSubmit={kirimSemua} noValidate>
      <h2 className="toko-h2" style={{ fontSize: 16 }}>
        Beri penilaian
      </h2>
      <p className="toko-kecil" style={{ marginBottom: 16 }}>
        Berapa bintang untuk buku di pesanan ini?
      </p>

      {pesan && <p className="toko-pesan toko-pesan-gagal">{pesan}</p>}

      {belum.map((b) => (
        <div key={b.slug} style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px" }}>
            {b.judul}
          </p>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() =>
                  setBintang((s) => ({ ...s, [b.slug]: n }))
                }
                aria-label={`${n} bintang untuk ${b.judul}`}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 26,
                  lineHeight: 1,
                  padding: 2,
                  color:
                    (bintang[b.slug] ?? 0) >= n
                      ? "var(--buku-emas)"
                      : "#cfd8d3",
                }}
              >
                ★
              </button>
            ))}
          </div>
          <div className="toko-bidang" style={{ marginBottom: 0 }}>
            <label htmlFor={`komen-${b.slug}`}>
              Komentar (opsional)
            </label>
            <textarea
              id={`komen-${b.slug}`}
              value={komentar[b.slug] ?? ""}
              onChange={(e) =>
                setKomentar((s) => ({ ...s, [b.slug]: e.target.value }))
              }
              placeholder="Bagaimana bukunya menurutmu? Kertasnya, isinya, pengirimannya…"
              style={{ minHeight: 78 }}
            />
          </div>
        </div>
      ))}

      <button
        type="submit"
        className="toko-btn toko-btn-utama toko-btn-lebar"
        disabled={kirim}
      >
        {kirim ? "Menyimpan…" : "Kirim penilaian"}
      </button>
    </form>
  );
}
