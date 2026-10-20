// page.tsx (/buku/lacak) — Lacak pesanan + tulis ulasan.
//
// Cukup memasukkan NOMOR PESANAN — tanpa login, tanpa member.
//
// Kalau nomor ditemukan → tampil:
//   • 4 langkah status (Belum Bayar → Dikemas → Dikirim → Penilaian)
//   • rincian buku, alamat kirim, dan riwayat waktu
//   • tombol "Saya sudah bayar" (kalau belum bayar)
//   • form penilaian (kalau status sudah Dikirim/Selesai)

import Link from "next/link";
import { cookies } from "next/headers";
import {
  ambilPesanan, rapikanNomorOrder, LABEL_STATUS, catatPesananDibuka,
} from "@/lib/db";
import { NAMA_COOKIE } from "@/lib/tanda-browser";
import { rupiah } from "@/components/buku/KartuBuku";
import PitaStatus from "@/components/buku/PitaStatus";
import KonfirmasiBayar from "@/components/buku/KonfirmasiBayar";
import FormPenilaian from "@/components/buku/FormPenilaian";

export const dynamic = "force-dynamic";

function waktuIndah(iso: string): string {
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default async function HalamanLacak({
  searchParams,
}: {
  searchParams: Promise<{ no?: string }>;
}) {
  const sp = await searchParams;
  const diketik = (sp.no ?? "").trim();
  const nomor = rapikanNomorOrder(diketik);
  const data = nomor ? ambilPesanan(nomor) : null;

  // Catat supaya pesanan ini muncul di "Pesanan Saya" pada browser yang
  // sama (tanpa login). Kalau nomornya tidak ada, jangan dicatat.
  if (nomor && data) {
    const c = await cookies();
    const tanda = c.get(NAMA_COOKIE)?.value ?? "";
    if (tanda) catatPesananDibuka(tanda, nomor);
  }

  return (
    <main className="toko-wadah">
      <p className="toko-crumbs">
        <Link href="/buku">Katalog</Link>
        <span>/</span>
        Cek pesanan
      </p>

      {/* Judul diganti dari "Lacak pesanan" menjadi "Cek Pesanan" supaya
          SAMA dengan tombol yang diklik pembeli di menu atas (permintaan
          Bos 22Sep26) — pembeli tidak perlu menebak apakah sudah masuk
          halaman yang benar. */}
      <h1 className="toko-h1">Cek Pesanan</h1>
      <p className="toko-ket" style={{ marginBottom: 20 }}>
        Masukkan nomor pesanan yang kamu terima setelah memesan, lalu
        tekan <b>Lihat Status</b>. Status pesanan akan langsung terlihat:
        Belum Bayar, Dikemas, atau Dikirim. Tidak perlu login, tidak
        perlu jadi member.
      </p>

      {/* form pencarian — metode GET, jadi nomor muncul di alamat dan
          pembeli bisa menyimpan tautannya */}
      <form className="toko-cari" method="get" action="/buku/lacak">
        <input
          name="no"
          defaultValue={diketik}
          placeholder="BYN-XXXXXXXX"
          autoCapitalize="characters"
          autoComplete="off"
          aria-label="Nomor pesanan"
          style={{ fontFamily: "ui-monospace, monospace",
                   letterSpacing: "0.06em" }}
        />
        <button type="submit" className="toko-btn toko-btn-cek-pesanan">
          Lihat Status
        </button>
      </form>

      {nomor && !data && (
        <div className="toko-pesan toko-pesan-gagal">
          Nomor pesanan <b>{nomor}</b> tidak ditemukan. Periksa lagi
          huruf-hurufnya ya — biasanya berbentuk BYK&#8203;N- lalu 8 huruf,
          contoh: BYN-K7X2M9QP.
        </div>
      )}

      {data && (
        <>
          <div className="kepala-lacak">
            <div>
              <p className="no-pesanan" style={{ fontSize: 17 }}>
                {data.pesanan.no_order}
              </p>
              <p className="tgl-pesanan">
                Dipesan {waktuIndah(data.pesanan.dibuat_pada)}
              </p>
            </div>
            <span className={`lencana-status lencana-${data.pesanan.status}`}>
              {LABEL_STATUS[data.pesanan.status]}
            </span>
          </div>

          <div className="toko-panel" style={{ marginTop: 18 }}>
            <PitaStatus status={data.pesanan.status} />
            <p className="toko-kecil" style={{ textAlign: "center",
              margin: "4px 0 0" }}>
              {data.pesanan.status === "belum_bayar" &&
                "Menunggu pembayaran — kode QRIS ada di halaman pembayaran."}
              {data.pesanan.status === "dikemas" &&
                "Pembayaran sudah diterima. Buku sedang kami siapkan."}
              {data.pesanan.status === "dikirim" &&
                "Buku sedang dalam perjalanan ke alamatmu."}
              {data.pesanan.status === "selesai" &&
                "Pesanan selesai. Terima kasih — ulasanmu sangat membantu."}
            </p>
          </div>

          <div className="dua-kolom">
            <div className="toko-panel">
              <h2 className="toko-h2" style={{ fontSize: 16 }}>
                Buku yang dipesan
              </h2>
              {data.butir.map((b) => (
                <div className="baris-hitung" key={b.id}>
                  <span>
                    <Link href={`/buku/${b.slug_buku}`}>{b.judul_buku}</Link>
                    {" "}&times; {b.jumlah}
                  </span>
                  <b>{rupiah(b.harga_saat_beli * b.jumlah)}</b>
                </div>
              ))}
              <div className="baris-hitung">
                <span>Ongkir</span>
                <b>{rupiah(data.pesanan.ongkir)}</b>
              </div>
              <div className="baris-hitung total">
                <span>Total</span>
                <span>{rupiah(data.pesanan.total)}</span>
              </div>

              <h2 className="toko-h2" style={{ fontSize: 16, marginTop: 24 }}>
                Dikirim ke
              </h2>
              <p className="toko-ket">
                <b>{data.pesanan.nama_penerima}</b>
                <br />
                {data.pesanan.hp}
                <br />
                {data.pesanan.alamat}
                <br />
                {data.pesanan.kota}, {data.pesanan.provinsi}
                {data.pesanan.kode_pos ? " " + data.pesanan.kode_pos : ""}
              </p>
              {data.pesanan.resi && (
                <p className="toko-ket" style={{ marginTop: 10 }}>
                  Nomor resi: <b>{data.pesanan.resi}</b>
                </p>
              )}
            </div>

            <div>
              <div className="toko-panel">
                <h2 className="toko-h2" style={{ fontSize: 16 }}>
                  Perjalanan pesanan
                </h2>
                {data.riwayat.map((r) => (
                  <div className="riwayat-baris" key={r.id}>
                    <span className="waktu">{waktuIndah(r.waktu)}</span>
                    <span className="apa">
                      {LABEL_STATUS[r.status]}
                      {r.catatan ? ` — ${r.catatan}` : ""}
                    </span>
                  </div>
                ))}
              </div>

              {data.pesanan.status === "belum_bayar" && (
                <KonfirmasiBayar
                  noOrder={data.pesanan.no_order}
                  sudah={false}
                  nama={data.pesanan.nama_penerima}
                />
              )}

              {(data.pesanan.status === "dikirim" ||
                data.pesanan.status === "selesai") && (
                <FormPenilaian
                  noOrder={data.pesanan.no_order}
                  buku={data.butir.map((b) => ({
                    slug: b.slug_buku,
                    judul: b.judul_buku,
                  }))}
                />
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
