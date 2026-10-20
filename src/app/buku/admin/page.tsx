// page.tsx (/buku/admin) — Halaman admin (1 password).
//
// Isinya (putusan Bos):
//   • daftar pesanan masuk + tombol ubah status
//   • daftar pesan dari form Hubungi Penerbit
//
// Keamanan sederhana tapi nyata:
//   • password dari .env (tidak ada di kode)
//   • cookie bertanda tangan, otomatis kedaluwarsa tiap ganti hari

import Link from "next/link";
import { adminMasuk } from "@/lib/admin";
import { daftarPesanan, daftarPesan, LABEL_STATUS } from "@/lib/db";
import { rupiah } from "@/components/buku/KartuBuku";
import MasukAdmin from "@/components/buku/MasukAdmin";
import UbahStatus from "@/components/buku/UbahStatus";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  const masuk = await adminMasuk();

  if (!masuk) {
    return (
      <main className="toko-wadah" style={{ maxWidth: 520 }}>
        <h1 className="toko-h1">Masuk Admin</h1>
        <p className="toko-ket" style={{ marginBottom: 20 }}>
          Halaman ini untuk pengelola toko: melihat pesanan masuk dan
          memperbarui statusnya.
        </p>
        <MasukAdmin />
      </main>
    );
  }

  const pesanan = daftarPesanan();
  const pesan = daftarPesan();
  const belumDibaca = pesan.filter((p) => !p.sudah_dibaca).length;

  return (
    <main className="toko-wadah">
      <div className="kepala-lacak">
        <div>
          <h1 className="toko-h1">Admin Toko</h1>
          <p className="toko-ket">
            {pesanan.length} pesanan · {pesan.length} pesan masuk
            {belumDibaca > 0 ? ` (${belumDibaca} belum dibaca)` : ""}
          </p>
        </div>
        <MasukAdmin keluar />
      </div>

      <section className="toko-blok">
        <h2 className="toko-h2">Pesanan masuk</h2>
        {pesanan.length === 0 ? (
          <div className="toko-panel toko-kosong">
            <h3>Belum ada pesanan</h3>
            <p className="toko-ket">
              Pesanan akan muncul di sini begitu ada yang memesan.
            </p>
          </div>
        ) : (
          <div className="toko-panel tabel-admin-bungkus"
            style={{ padding: "10px 14px" }}>
            <table className="tabel-admin">
              <thead>
                <tr>
                  <th>Nomor</th>
                  <th>Pembeli</th>
                  <th>Buku</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Sudah bayar</th>
                  <th>Ubah status</th>
                </tr>
              </thead>
              <tbody>
                {pesanan.map((p) => (
                  <tr key={p.no_order}>
                    <td>
                      <Link href={`/buku/lacak?no=${encodeURIComponent(p.no_order)}`}
                        className="no-pesanan" style={{ fontSize: 12 }}>
                        {p.no_order}
                      </Link>
                      <br />
                      <span className="tgl-pesanan">
                        {new Date(p.dibuat_pada).toLocaleDateString("id-ID", {
                          day: "2-digit", month: "short", year: "2-digit",
                        })}
                      </span>
                    </td>
                    <td>
                      {p.nama_penerima}
                      <br />
                      <span className="tgl-pesanan">{p.hp}</span>
                      <br />
                      <span className="tgl-pesanan">
                        {p.kota}, {p.provinsi}
                      </span>
                    </td>
                    <td style={{ maxWidth: 200 }}>
                      {/* subtotal = total − ongkir. Ditulis apa adanya
                          supaya tidak ada hitungan aneh yang bikin bingung. */}
                      {rupiah(p.total - p.ongkir)}
                    </td>
                    <td><b>{rupiah(p.total)}</b></td>
                    <td>
                      <span className={`lencana-status lencana-${p.status}`}>
                        {LABEL_STATUS[p.status]}
                      </span>
                    </td>
                    <td>
                      {p.sudah_bayar_at ? (
                        <span style={{ color: "var(--hijau)", fontWeight: 600 }}>
                          Ya
                        </span>
                      ) : (
                        <span className="tgl-pesanan">Belum</span>
                      )}
                    </td>
                    <td><UbahStatus noOrder={p.no_order}
                      status={p.status} resi={p.resi} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="toko-blok">
        <h2 className="toko-h2">Pesan dari Hubungi Penerbit</h2>
        {pesan.length === 0 ? (
          <div className="toko-panel toko-kosong">
            <h3>Belum ada pesan</h3>
            <p className="toko-ket">
              Pesan dari formulir akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="toko-panel">
            {pesan.map((m) => (
              <div className="riwayat-baris" key={m.id}>
                <span className="waktu">
                  {new Date(m.waktu).toLocaleString("id-ID", {
                    day: "2-digit", month: "short",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </span>
                <span className="apa" style={{ flex: 1 }}>
                  <b>{m.subjek}</b>
                  <br />
                  <span className="tgl-pesanan">
                    {m.nama} · {m.email}
                  </span>
                  <br />
                  {m.pesan}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
