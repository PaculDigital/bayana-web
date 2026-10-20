// page.tsx (/buku/[slug]) — Halaman detail buku.
//
// URUTAN BAGIAN (mengikuti contoh penerbit akademik, ditambah):
//   1. Breadcrumb
//   2. Cover (kiri, menempel saat digulir) + judul/penulis/harga/tombol
//   3. Identitas buku (tabel detail: ISBN, halaman, kertas, berat, dll)
//   4. Sinopsis
//   5. Daftar isi
//   6. Buku terkait
//   7. ULASAN + komentar  ← paling bawah (putusan Bos)
//
// Tombol "Beli Sekarang" & "Keranjang" baru bekerja setelah halaman
// keranjang selesai (langkah berikutnya).

import Link from "next/link";
import { notFound } from "next/navigation";
import { buku, ambilBuku, ulasanBuku, ONGKIR_FLAT } from "@/data/buku";
import CoverBuku from "@/components/buku/CoverBuku";
import KartuBuku, { Bintang, rupiah } from "@/components/buku/KartuBuku";
import TombolBeli from "@/components/buku/TombolBeli";
import { TEMPLATE_AKTIF } from "@/lib/template-saklar";

export function generateStaticParams() {
  return buku.map((b) => ({ slug: b.slug }));
}

export default async function HalamanBuku({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const b = ambilBuku(slug);
  if (!b) notFound();

  const ulasan = ulasanBuku(slug);
  const terkait = buku.filter((x) => x.genre === b.genre && x.slug !== slug)
    .slice(0, 4);

  const identitas: [string, string][] = [
    ["Penulis", b.penulis],
    // ISBN & e-ISBN: template 1 (live lama) TAMPIL, template 2 (dokumen butir 11) DISIMPAN
    ...(TEMPLATE_AKTIF === "1"
      ? ([
          ["ISBN", b.detail.isbn],
          ...(b.detail.e_isbn
            ? [["e-ISBN", b.detail.e_isbn] as [string, string]]
            : []),
        ] as [string, string][])
      : []),
    ["Halaman", b.detail.halaman],
    ["Ukuran", b.detail.ukuran],
    ["Tahun Terbit", b.detail.tahun],
    ["Editor", b.detail.editor],
    ["Layout", b.detail.layout],
    ["Kertas", b.detail.kertas],
    ["Berat", b.detail.berat],
    ["Cetakan", b.detail.cetakan],
  ];

  return (
    <main className="toko-wadah">
      <p className="toko-crumbs">
        <Link href="/buku">Katalog</Link>
        <span>/</span>
        <Link href={`/buku?genre=${encodeURIComponent(b.genre)}`}>
          {b.genre}
        </Link>
        <span>/</span>
        {b.judul}
      </p>

      {/* ── 1. ATAS: cover + ringkasan ─────────────────────────────── */}
      <div className="detail-atas">
        <div className="kiri">
          <div className="detail-cover">
            <CoverBuku buku={b} className="w-full h-auto block" />
          </div>
          <p className="toko-kecil" style={{ marginTop: 12 }}>
            {b.sample
              ? "Cover contoh — buku ini belum terbit, gambar dibuat otomatis."
              : "Cover buku."}
          </p>
        </div>

        <div>
          <p className="detail-kdt">{b.kdt}</p>
          <h1 className="toko-h1">{b.judul}</h1>
          {b.subjudul && <p className="detail-sub">{b.subjudul}</p>}
          <p className="detail-penulis">{b.penulis}</p>
          {b.afiliasi && <p className="detail-afiliasi">{b.afiliasi}</p>}

          <div className="kartu-buku-rating" style={{ marginTop: 6 }}>
            <Bintang nilai={b.rating} ukuran={16} />
            <b style={{ fontSize: 14 }}>
              {b.rating.toFixed(1).replace(".", ",")}
            </b>
            <span>({b.jumlah_ulasan} ulasan)</span>
          </div>

          <div className="detail-harga-bar">
            <div>
              <p className="detail-harga">{rupiah(b.harga)}</p>
              <p className="detail-harga-ket">
                Belum termasuk ongkir {rupiah(ONGKIR_FLAT)} seluruh Indonesia
              </p>
            </div>
            <TombolBeli slug={b.slug} />
          </div>

          <p className="toko-kecil">
            Buku dikirim dari Malang. Setelah memesan, simpan nomor pesanan
            untuk melacak status — tidak perlu membuat akun.
          </p>
        </div>
      </div>

      {/* ── 2. IDENTITAS BUKU ──────────────────────────────────────── */}
      <section className="toko-blok">
        <h2 className="toko-h2">Identitas Buku</h2>
        <table className="tabel-identitas">
          <tbody>
            {identitas.map(([k, v]) => (
              <tr key={k}>
                <th scope="row">{k}</th>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ── 3. SINOPSIS ────────────────────────────────────────────── */}
      <section className="toko-blok">
        <h2 className="toko-h2">Sinopsis</h2>
        {b.sinopsis.map((p, i) => (
          <p key={i} className="toko-ayat">{p}</p>
        ))}
      </section>

      {/* ── 4. DAFTAR ISI ──────────────────────────────────────────── */}
      <section className="toko-blok">
        <h2 className="toko-h2">Daftar Isi</h2>
        <ol className="toko-daun">
          {b.daftar_isi.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ol>
      </section>

      {/* ── 5. BUKU TERKAIT ────────────────────────────────────────── */}
      {terkait.length > 0 && (
        <section className="toko-blok">
          <h2 className="toko-h2">Buku Terkait</h2>
          <div className="etalase">
            {terkait.map((t) => (
              <KartuBuku key={t.slug} buku={t} />
            ))}
          </div>
        </section>
      )}

      {/* ── 6. ULASAN & KOMENTAR (paling bawah) ────────────────────── */}
      <section className="toko-blok" id="ulasan">
        <h2 className="toko-h2">Ulasan &amp; Komentar</h2>

        {ulasan.length === 0 ? (
          <div className="toko-panel toko-kosong">
            <h3>Belum ada ulasan</h3>
            <p className="toko-ket">
              Jadi yang pertama mengulas buku ini setelah membacanya.
            </p>
          </div>
        ) : (
          <>
            <div className="ringkas-ulasan">
              <div>
                <p className="angka-ulasan">
                  {b.rating.toFixed(1).replace(".", ",")}
                </p>
                <p className="toko-kecil" style={{ margin: "6px 0 0" }}>
                  dari {b.jumlah_ulasan} ulasan
                </p>
              </div>
              <div>
                <Bintang nilai={b.rating} ukuran={22} />
                <p className="toko-kecil" style={{ margin: "8px 0 0" }}>
                  Ulasan di bawah masih <b>contoh</b> — belum dari pembeli
                  sungguhan.
                </p>
              </div>
            </div>

            <div className="toko-panel" style={{ marginTop: 16 }}>
              {ulasan.map((u, i) => (
                <div className="satu-ulasan" key={i}>
                  <div className="ulasan-kepala">
                    <Bintang nilai={u.bintang} ukuran={15} />
                    <span className="tanda-contoh">contoh ulasan</span>
                  </div>
                  <p className="ulasan-isi">{u.isi}</p>
                  <p className="ulasan-nama">{u.nama}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="toko-form-email" style={{ marginTop: 16 }}>
          <h3 className="toko-h2" style={{ fontSize: 15 }}>
            Tulis ulasan kamu
          </h3>
          <p className="toko-kecil" style={{ marginBottom: 15 }}>
            Ulasan hanya bisa ditulis pembeli, memakai nomor pesanan.
            Jadi ulasan di halaman ini bisa dipercaya.
          </p>
          <Link
            href="/buku/lacak?dari=ulasan"
            className="toko-btn toko-btn-utama toko-btn-kecil"
          >
            Tulis ulasan lewat nomor pesanan
          </Link>
        </div>
      </section>
    </main>
  );
}
