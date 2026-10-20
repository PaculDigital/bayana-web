// page.tsx (/buku/kontak) — Hubungi penerbit.
//
// Bentuknya mengikuti permintaan Bos: KARTU berisi alamat email
// penerbit + tombol kirim. Pesan yang masuk tersimpan di database
// dan bisa dibaca lewat halaman admin.

import Link from "next/link";
import FormKontak from "@/components/buku/FormKontak";

export const metadata = {
  title: "Hubungi Penerbit — Bayana Publishing",
};

function IkonSurat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="m3 6.8 8.1 5.4a1.6 1.6 0 0 0 1.8 0L21 6.8" />
    </svg>
  );
}

export default function HalamanKontak() {
  return (
    <main className="toko-wadah">
      <p className="toko-crumbs">
        <Link href="/buku">Katalog</Link>
        <span>/</span>
        Hubungi Penerbit
      </p>

      <h1 className="toko-h1">Hubungi Penerbit</h1>
      <p className="toko-ket" style={{ marginBottom: 22 }}>
        Ada pertanyaan tentang pesanan, kerja sama penerbitan, atau
        pengiriman naskah? Kirim pesan lewat formulir di bawah.
      </p>

      <div className="dua-kolom">
        <div className="kartu-email">
          <div className="lingkaran">
            <IkonSurat />
          </div>
          <h3>Email Penerbit</h3>
          <p className="alamat">buku@bayana.id</p>
          <p className="ket">
            Cara tercepat untuk urusan pesanan: sebutkan{" "}
            <b>nomor pesanan</b> (BYN-…) di dalam pesan.
          </p>
          <table>
            <tbody>
              <tr>
                <td>Penerbit</td>
                <td>Bayana Publishing</td>
              </tr>
              <tr>
                <td>Kirim naskah</td>
                <td>naskah@bayana.id</td>
              </tr>
              <tr>
                <td>Jam balas</td>
                <td>Senin–Jumat, 08.00–16.00 WIB</td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>Malang, Jawa Timur</td>
              </tr>
            </tbody>
          </table>
        </div>

        <FormKontak />
      </div>
    </main>
  );
}
