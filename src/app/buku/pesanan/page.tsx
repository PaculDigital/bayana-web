// page.tsx (/buku/pesanan) — "Pesanan Saya".
//
// Bentuknya mengikuti gambar yang dikirim Bos:
//   4 ikon kategori + LENCANA MERAH berisi jumlah
//   (Belum Bayar · Dikemas · Dikirim · Beri Penilaian)
//   di bawahnya: daftar kartu pesanan.
//
// ⚠️ Tanpa login, halaman ini hanya bisa menampilkan pesanan yang
//    nomor pesanannya pernah dibuka di browser ini (disimpan di
//    cookie). Itu batas jujurnya.
//    Kalau pembeli ganti HP, dia tetap bisa membuka pesanannya lewat
//    menu "Lacak pesanan" dengan memasukkan nomor pesanan.

import Link from "next/link";
import { cookies } from "next/headers";
import { db, pesananDibuka } from "@/lib/db";
import type { BarisPesanan, Status } from "@/lib/db";
import { NAMA_COOKIE } from "@/lib/tanda-browser";
import { rupiah } from "@/components/buku/KartuBuku";

export const dynamic = "force-dynamic";

/** Kartu kategori dengan lencana angka. */
function Kategori({
  href,
  label,
  angka,
  ikon,
}: {
  href: string;
  label: string;
  angka: number;
  ikon: React.ReactNode;
}) {
  return (
    <Link href={href} className="kategori">
      <span className="kategori-ikon">
        {ikon}
        {angka > 0 && <b className="lencana-angka">{angka}</b>}
      </span>
      <p>{label}</p>
    </Link>
  );
}

function IkonDompet() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6H18a3 3 0 0 1 3 3v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M3 9.5h16" />
      <circle cx="16.5" cy="13" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IkonKardus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M21 8.2v7.6a1.5 1.5 0 0 1-.8 1.3l-7.5 4a1.5 1.5 0 0 1-1.4 0l-7.5-4A1.5 1.5 0 0 1 3 15.8V8.2" />
      <path d="m3.4 7.6 7.9-4.2a1.5 1.5 0 0 1 1.4 0l7.9 4.2-8.6 4.6z" />
      <path d="M12 12.2V21" />
    </svg>
  );
}

function IkonTruk() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M2 6.5A1.5 1.5 0 0 1 3.5 5h8A1.5 1.5 0 0 1 13 6.5V17H2z" />
      <path d="M13 9h4.2a1.5 1.5 0 0 1 1.3.8L21 13v4h-8z" />
      <circle cx="6" cy="18.5" r="1.8" />
      <circle cx="17" cy="18.5" r="1.8" />
    </svg>
  );
}

function IkonBintang() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="m12 3.5 2.7 5.6 6.1.8-4.5 4.2 1.1 6.05L12 17.2l-5.4 2.95 1.1-6.05-4.5-4.2 6.1-.8z" />
    </svg>
  );
}

export default async function HalamanPesananSaya() {
  const c = await cookies();
  const tanda = c.get(NAMA_COOKIE)?.value ?? "";

  // Tanpa penanda → halaman kosong dengan jalan keluar
  let daftar: BarisPesanan[] = [];
  if (tanda) {
    // Pesanan yang nomornya PERNAH DIBUKA di browser ini (baik dari
    // halaman pembayaran maupun halaman lacak). Cara ini benar untuk
    // pembeli tanpa login — server tidak perlu tahu siapa dia.
    daftar = pesananDibuka(tanda);
  }

  // Hitung jumlah untuk lencana. Karena tanpa login, angka di bawah
  // ini dihitung dari SEMUA pesanan yang nomornya pernah dibuka di
  // browser ini — bukan seluruh pesanan toko. (Admin punya angkanya
  // sendiri di halaman admin.)
  const salah = (s: Status) => daftar.filter((p) => p.status === s).length;
  const hitung = {
    belum_bayar: salah("belum_bayar"),
    dikemas: salah("dikemas"),
    dikirim: salah("dikirim"),
    selesai: salah("selesai"),
  };

  return (
    <main className="toko-wadah">
      <p className="toko-crumbs">
        <Link href="/buku">Katalog</Link>
        <span>/</span>
        Pesanan Saya
      </p>

      <h1 className="toko-h1">Pesanan Saya</h1>

      <div className="pesanan-saya">
        <div className="pesanan-saya-kepala">
          <h2>Pesanan Saya</h2>
          <Link href="/buku/lacak">Cari pesanan lain</Link>
        </div>

        <div className="baris-kategori">
          <Kategori href="/buku/pesanan?status=belum_bayar"
            label="Belum Bayar" angka={hitung.belum_bayar}
            ikon={<IkonDompet />} />
          <Kategori href="/buku/pesanan?status=dikemas"
            label="Dikemas" angka={hitung.dikemas}
            ikon={<IkonKardus />} />
          <Kategori href="/buku/pesanan?status=dikirim"
            label="Dikirim" angka={hitung.dikirim}
            ikon={<IkonTruk />} />
          <Kategori href="/buku/pesanan?status=selesai"
            label="Beri Penilaian" angka={hitung.selesai}
            ikon={<IkonBintang />} />
        </div>

        {daftar.length === 0 ? (
          <div className="toko-kosong">
            <h3>Belum ada pesanan di perangkat ini</h3>
            <p className="toko-ket" style={{ maxWidth: 430,
              margin: "8px auto 0" }}>
              Kamu tidak perlu membuat akun. Kalau sudah pernah memesan,
              buka <b>Lacak pesanan</b> dan masukkan nomor pesananmu —
              setelah itu pesanan akan muncul di sini.
            </p>
            <Link href="/buku/lacak" className="toko-btn toko-btn-utama"
              style={{ marginTop: 18 }}>
              Lacak dengan nomor pesanan
            </Link>
          </div>
        ) : (
          <div>
            {daftar.map((p) => (
              <div className="kartu-pesanan" key={p.no_order}>
                <div>
                  <p className="no-pesanan">{p.no_order}</p>
                  <p className="tgl-pesanan">
                    {new Date(p.dibuat_pada).toLocaleDateString("id-ID", {
                      day: "2-digit", month: "long", year: "numeric",
                    })}
                  </p>
                  <p className="judul-pesanan">
                    {p.status === "belum_bayar" && "Menunggu pembayaran"}
                    {p.status === "dikemas" && "Sedang disiapkan"}
                    {p.status === "dikirim" && "Sedang dikirim"}
                    {p.status === "selesai" && "Sudah diterima"}
                  </p>
                  <p className="ket-pesanan">
                    {p.kota}, {p.provinsi}
                    {p.resi ? ` · Resi ${p.resi}` : ""}
                  </p>
                </div>
                <div className="kanan-pesanan">
                  <span className={`lencana-status lencana-${p.status}`}>
                    {p.status === "belum_bayar" && "Belum Bayar"}
                    {p.status === "dikemas" && "Dikemas"}
                    {p.status === "dikirim" && "Dikirim"}
                    {p.status === "selesai" && "Beri Penilaian"}
                  </span>
                  <p className="harga-pesanan">{rupiah(p.total)}</p>
                  <Link
                    href={`/buku/lacak?no=${encodeURIComponent(p.no_order)}`}
                    className="toko-btn toko-btn-garis toko-btn-kecil"
                  >
                    Lihat detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
