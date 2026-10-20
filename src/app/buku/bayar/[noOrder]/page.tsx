// page.tsx (/buku/bayar/[noOrder]) — Halaman pembayaran QRIS.
//
// Isinya: nomor pesanan (besar & mudah dibaca), total, kode QRIS,
// dan langkah-langkah bayar. Ada juga kotak konfirmasi
// "Saya sudah bayar" — pembeli cukup memasukkan nomor pesanannya.
//
// ⚠️ Kode QR di sini dibuat dari data QRIS yang ADA di server. Selama
//    QRIS asli belum dipasang, yang ditampilkan adalah QR berisi
//    nomor pesanan + catatan jujur bahwa pembayaran masih manual.

import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import QRCode from "qrcode";
import { ambilPesanan, LABEL_STATUS, catatPesananDibuka } from "@/lib/db";
import { NAMA_COOKIE } from "@/lib/tanda-browser";
import { rupiah } from "@/components/buku/KartuBuku";
import KonfirmasiBayar from "@/components/buku/KonfirmasiBayar";
import KartuBukti from "@/components/buku/KartuBukti";

export const dynamic = "force-dynamic";

export default async function HalamanBayar({
  params,
}: {
  params: Promise<{ noOrder: string }>;
}) {
  const { noOrder } = await params;
  const data = ambilPesanan(decodeURIComponent(noOrder));
  if (!data) notFound();

  const { pesanan, butir } = data;

  // Pesanan otomatis muncul di "Pesanan Saya" browser ini
  const c = await cookies();
  const tanda = c.get(NAMA_COOKIE)?.value ?? "";
  if (tanda) catatPesananDibuka(tanda, pesanan.no_order);

  // Isi QR: data pembayaran. Sengaja memuat nomor pesanan supaya bisa
  // dicocokkan saat verifikasi manual oleh admin.
  const isiQr = [
    "BAYANA BUKU",
    `No: ${pesanan.no_order}`,
    `Total: ${pesanan.total}`,
    "Bayar via QRIS, lalu tekan 'Saya sudah bayar'",
  ].join("\n");

  const svgQr = await QRCode.toString(isiQr, {
    type: "svg",
    margin: 1,
    width: 220,
    errorCorrectionLevel: "M",
  });

  const sudah = pesanan.status !== "belum_bayar";

  return (
    <main className="toko-wadah">
      <p className="toko-crumbs">
        <Link href="/buku">Katalog</Link>
        <span>/</span>
        Pembayaran
      </p>

      <div className="kepala-lacak">
        <div>
          <h1 className="toko-h1">Selesaikan pembayaran</h1>
          <p className="toko-ket">
            Pesanan sudah tersimpan. Simpan nomor pesanan di bawah untuk
            melacak status kapan saja.
          </p>
        </div>
        <span className={`lencana-status lencana-${pesanan.status}`}>
          {LABEL_STATUS[pesanan.status]}
        </span>
      </div>

      {sudah && (
        <p className="toko-pesan toko-pesan-berhasil" style={{ marginTop: 18 }}>
          Kabar baik — pembayaran pesanan ini sudah ditandai. Status akan
          diperbarui penerbit setelah dana dipastikan masuk.
        </p>
      )}

      {/* ⚠️ URUTAN PENTING DI HP (perbaikan 22Sep26):
          Sebelumnya kolom KANAN (QRIS + tombol "Saya sudah bayar")
          jatuh ke BAWAH di HP → pembeli harus menggulir panjang
          untuk menemukan cara bayar.
          Di HP sekarang: penjelasan & kotak bayar DULU, rincian MENYUSUL.
          Cara ini TIDAK menyalin blok — hanya menukar urutan, jadi
          tidak ada risiko isi jadi ganda. */}
      <div className="kolom-bayar">
        <div>
          <div className="toko-panel" style={{ textAlign: "center" }}>
            <h2 className="toko-h2" style={{ fontSize: 16 }}>
              Bayar dengan QRIS
            </h2>
            <p className="toko-kecil" style={{ marginBottom: 16 }}>
              Buka aplikasi bank atau dompet digital, pilih menu QRIS,
              lalu pindai kode ini.
            </p>
            <div
              style={{
                display: "inline-block",
                border: "1px solid var(--buku-line)",
                borderRadius: 14,
                padding: 14,
                background: "#fff",
                maxWidth: "100%",
              }}
              dangerouslySetInnerHTML={{ __html: svgQr }}
            />
            <p className="toko-kecil" style={{ marginTop: 14 }}>
              Nominal: <b>{rupiah(pesanan.total)}</b>. Pastikan jumlahnya
              sama supaya pesanan cepat diproses.
            </p>
          </div>

          <KonfirmasiBayar
            noOrder={pesanan.no_order}
            sudah={sudah}
            nama={pesanan.nama_penerima}
          />

          <div className="toko-panel">
            <h3 className="toko-h2" style={{ fontSize: 14 }}>
              Belum bisa bayar sekarang?
            </h3>
            <p className="toko-kecil">
              Tidak masalah. Simpan nomor pesananmu, lalu buka halaman
              Pesanan Saya kapan saja untuk melihat status dan cara
              bayarnya.
            </p>
            <Link
              href={`/buku/lacak?no=${encodeURIComponent(pesanan.no_order)}`}
              className="toko-btn toko-btn-garis toko-btn-kecil"
              style={{ marginTop: 12 }}
            >
              Lihat status pesanan
            </Link>
          </div>
        </div>

        <div className="toko-panel">
          {/* ── KARTU BUKTI PESANAN (permintaan Bos 22Sep26) ──────────────
              Dulu: nomor 22px di dalam kotak kecil + pesan "tulis atau
              potret" — tanpa cara menyalin dan tanpa berkas yang bisa
              disimpan. Sekarang: nomor BESAR, tombol Salin, dan tombol
              Simpan bukti pesanan (berkas berisi rincian lengkap).

              Tombol "Cek Pesanan" di menu atas juga sudah ada, jadi
              kalimat lamanya ("buka halaman lacak") tidak diulang lagi
              di sini — biar tidak menumpuk penjelasan. */}
          <KartuBukti
            noOrder={pesanan.no_order}
            tanggal={pesanan.dibuat_pada}
            nama={pesanan.nama_penerima}
            hp={pesanan.hp}
            alamat={pesanan.alamat}
            baris={butir.map((b) => ({
              judul: b.judul_buku,
              jumlah: b.jumlah,
              harga: b.harga_saat_beli,
            }))}
            ongkir={pesanan.ongkir}
            total={pesanan.total}
            status={pesanan.status}
          />

          <h2 className="toko-h2" style={{ fontSize: 16, marginTop: 24 }}>
            Rincian
          </h2>
          {butir.map((b) => (
            <div className="baris-hitung" key={b.id}>
              <span>
                {b.judul_buku} &times; {b.jumlah}
              </span>
              <b>{rupiah(b.harga_saat_beli * b.jumlah)}</b>
            </div>
          ))}
          <div className="baris-hitung">
            <span>Ongkir</span>
            <b>{rupiah(pesanan.ongkir)}</b>
          </div>
          <div className="baris-hitung total">
            <span>Total bayar</span>
            <span>{rupiah(pesanan.total)}</span>
          </div>

          <h2 className="toko-h2" style={{ fontSize: 16, marginTop: 24 }}>
            Dikirim ke
          </h2>
          <p className="toko-ket">
            <b>{pesanan.nama_penerima}</b>
            <br />
            {pesanan.hp}
            <br />
            {pesanan.alamat}
            <br />
            {pesanan.kota}, {pesanan.provinsi}
            {pesanan.kode_pos ? " " + pesanan.kode_pos : ""}
          </p>
        </div>
      </div>
    </main>
  );
}
