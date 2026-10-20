// db.ts — Database kecil Bayana Buku (SQLite).
//
// KENAPA SQLITE: 1 berkas, tanpa server tambahan, cukup untuk ribuan pesanan.
// Berkasnya disimpan di folder yang di-mount volume supaya pesanan
// TIDAK HILANG saat deploy ulang.
//
// 6 TABEL:
//   pesanan         — satu baris per pesanan (pembeli, alamat, total, status)
//   butir_pesanan   — buku apa saja di pesanan itu
//   riwayat_status  — perjalanan status (pembeli bisa lihat, jadi merasa aman)
//   penilaian       — rating + komentar pembeli
//   pesan_masuk     — pesan dari form "Hubungi Penerbit"
//   keranjang       — buku yang belum jadi pesanan (per tanda-browser)

import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const FOLDER_DATA = process.env.BAYANA_DATA_DIR || "/app/data";
const BERKAS_DB = path.join(FOLDER_DATA, "bayana.db");

let _db: Database.Database | null = null;

/** Buka (dan siapkan) database. Dipanggil sekali per proses. */
export function db(): Database.Database {
  if (_db) return _db;

  fs.mkdirSync(FOLDER_DATA, { recursive: true });
  const d = new Database(BERKAS_DB);
  d.pragma("journal_mode = WAL");   // tulis tidak bentrok dengan baca
  d.pragma("foreign_keys = ON");
  siapkan(d);
  _db = d;
  return d;
}

/** Buat tabel kalau belum ada. Aman dijalankan berulang kali. */
function siapkan(d: Database.Database): void {
  d.exec(`
    CREATE TABLE IF NOT EXISTS pesanan (
      no_order        TEXT PRIMARY KEY,
      nama_penerima   TEXT NOT NULL,
      hp              TEXT NOT NULL,
      alamat          TEXT NOT NULL,
      kelurahan       TEXT,
      kecamatan       TEXT,
      kota            TEXT NOT NULL,
      provinsi        TEXT NOT NULL,
      kode_pos        TEXT,
      catatan         TEXT,
      ongkir          INTEGER NOT NULL DEFAULT 15000,
      subtotal        INTEGER NOT NULL,
      total           INTEGER NOT NULL,
      status          TEXT NOT NULL DEFAULT 'belum_bayar',
      sudah_bayar_at  TEXT,
      resi            TEXT,
      dibuat_pada     TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS butir_pesanan (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      no_order        TEXT NOT NULL,
      slug_buku       TEXT NOT NULL,
      judul_buku      TEXT NOT NULL,
      harga_saat_beli INTEGER NOT NULL,
      jumlah          INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (no_order) REFERENCES pesanan(no_order) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS riwayat_status (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      no_order    TEXT NOT NULL,
      status      TEXT NOT NULL,
      catatan     TEXT,
      waktu       TEXT NOT NULL,
      FOREIGN KEY (no_order) REFERENCES pesanan(no_order) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS penilaian (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      no_order      TEXT NOT NULL,
      slug_buku     TEXT NOT NULL,
      bintang       INTEGER NOT NULL,
      komentar      TEXT,
      nama_penilai  TEXT,
      waktu         TEXT NOT NULL,
      FOREIGN KEY (no_order) REFERENCES pesanan(no_order) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS pesan_masuk (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      nama          TEXT NOT NULL,
      email         TEXT NOT NULL,
      subjek        TEXT NOT NULL,
      pesan         TEXT NOT NULL,
      sudah_dibaca  INTEGER NOT NULL DEFAULT 0,
      waktu         TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS keranjang (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      tanda_browser   TEXT NOT NULL,
      slug_buku       TEXT NOT NULL,
      jumlah          INTEGER NOT NULL DEFAULT 1,
      ditambahkan_pada TEXT NOT NULL,
      UNIQUE (tanda_browser, slug_buku)
    );

    CREATE INDEX IF NOT EXISTS idx_butir_order   ON butir_pesanan (no_order);
    CREATE INDEX IF NOT EXISTS idx_riwayat_order ON riwayat_status (no_order);
    CREATE INDEX IF NOT EXISTS idx_nilai_order   ON penilaian (no_order);
    CREATE INDEX IF NOT EXISTS idx_nilai_buku    ON penilaian (slug_buku);
    CREATE INDEX IF NOT EXISTS idx_keranjang_tb  ON keranjang (tanda_browser);

    -- pesanan yang pernah dibuka di sebuah browser (untuk "Pesanan Saya"
    -- tanpa login). Dibuat TERPISAH dari riwayat_status supaya catatan
    -- pesanan tetap bersih untuk pembeli.
    CREATE TABLE IF NOT EXISTS pesanan_dibuka (
      tanda_browser TEXT NOT NULL,
      no_order      TEXT NOT NULL,
      waktu         TEXT NOT NULL,
      PRIMARY KEY (tanda_browser, no_order),
      FOREIGN KEY (no_order) REFERENCES pesanan(no_order) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_dibuka_tb ON pesanan_dibuka (tanda_browser);
  `);

  // ── MIGRASI database LAMA ────────────────────────────────────────────
  // ⚠️ `CREATE TABLE IF NOT EXISTS` TIDAK menambah kolom ke tabel yang
  //    SUDAH ADA. Karena itu database yang dibuat sebelum 22Sep26 belum
  //    punya kolom kecamatan & kelurahan. Tanpa langkah ini, kolom baru
  //    di form akan MENGIRIM data yang lalu DIBUANG diam-diam oleh
  //    SQLite (INSERT gagal / kolom tidak ada) — cacat senyap.
  tambahKolomKalauBelumAda(d, "pesanan", "kecamatan", "TEXT");
  tambahKolomKalauBelumAda(d, "pesanan", "kelurahan", "TEXT");
}

/** Tambah satu kolom ke tabel kalau kolomnya belum ada (aman diulang). */
function tambahKolomKalauBelumAda(
  d: Database.Database,
  tabel: string,
  kolom: string,
  tipe: string
): void {
  const ada = (d.pragma(`table_info(${tabel})`) as { name: string }[])
    .some((k) => k.name === kolom);
  if (!ada) {
    d.exec(`ALTER TABLE ${tabel} ADD COLUMN ${kolom} ${tipe}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// STATUS PESANAN — 4 tahap tetap (sesuai putusan Bos)
// belum_bayar → dikemas → dikirim → selesai
// ─────────────────────────────────────────────────────────────────────────

export const STATUS = ["belum_bayar", "dikemas", "dikirim", "selesai"] as const;
export type Status = (typeof STATUS)[number];

export const LABEL_STATUS: Record<Status, string> = {
  belum_bayar: "Belum Bayar",
  dikemas: "Dikemas",
  dikirim: "Dikirim",
  selesai: "Beri Penilaian",
};

/** Waktu sekarang (ISO, waktu server). */
export function sekarang(): string {
  return new Date().toISOString();
}

// ─────────────────────────────────────────────────────────────────────────
// NOMOR PESANAN — "BYN-" + 8 huruf/angka acak
// Dipakai huruf yang tidak mudah tertukar saat dibaca/diucapkan:
// tanpa I, O, 0, 1 (mirip satu sama lain).
// ─────────────────────────────────────────────────────────────────────────

const HURUF_AMAN = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function buatNomorOrder(): string {
  const d = db();
  const cek = d.prepare("SELECT 1 FROM pesanan WHERE no_order = ?");
  for (let coba = 0; coba < 12; coba++) {
    let acak = "";
    const buf = new Uint8Array(8);
    crypto.getRandomValues(buf);
    for (let i = 0; i < 8; i++) {
      acak += HURUF_AMAN[buf[i] % HURUF_AMAN.length];
    }
    const no = `BYN-${acak}`;
    if (!cek.get(no)) return no;   // belum dipakai → pakai ini
  }
  // Praktis tidak akan terjadi: 32^8 ≈ 1,1 triliun kemungkinan.
  throw new Error("Gagal membuat nomor pesanan unik setelah 12 percobaan");
}

/** Rapikan nomor order dari ketikan user (huruf besar, buang spasi). */
export function rapikanNomorOrder(teks: string): string {
  return teks.trim().toUpperCase().replace(/\s+/g, "");
}

// ─────────────────────────────────────────────────────────────────────────
// BACA / TULIS
// ─────────────────────────────────────────────────────────────────────────

export interface BarisPesanan {
  no_order: string;
  nama_penerima: string;
  hp: string;
  alamat: string;
  kota: string;
  provinsi: string;
  kode_pos: string | null;
  catatan: string | null;
  ongkir: number;
  subtotal: number;
  total: number;
  status: Status;
  sudah_bayar_at: string | null;
  resi: string | null;
  dibuat_pada: string;
}

export interface ButirPesanan {
  id: number;
  no_order: string;
  slug_buku: string;
  judul_buku: string;
  harga_saat_beli: number;
  jumlah: number;
}

export interface BarisRiwayat {
  id: number;
  no_order: string;
  status: Status;
  catatan: string | null;
  waktu: string;
}

export interface BarisPenilaian {
  id: number;
  no_order: string;
  slug_buku: string;
  bintang: number;
  komentar: string | null;
  nama_penilai: string | null;
  waktu: string;
}

/** Cari pesanan lengkap dengan butir + riwayat. null kalau tidak ada. */
export function ambilPesanan(noOrder: string) {
  const d = db();
  const p = d
    .prepare("SELECT * FROM pesanan WHERE no_order = ?")
    .get(noOrder) as BarisPesanan | undefined;
  if (!p) return null;
  const butir = d
    .prepare("SELECT * FROM butir_pesanan WHERE no_order = ? ORDER BY id")
    .all(noOrder) as ButirPesanan[];
  const riwayat = d
    .prepare("SELECT * FROM riwayat_status WHERE no_order = ? ORDER BY id")
    .all(noOrder) as BarisRiwayat[];
  return { pesanan: p, butir, riwayat };
}

/** Simpan pesanan baru + butir + riwayat awal. Semua dalam 1 transaksi. */
export function simpanPesanan(isi: {
  no_order: string;
  nama_penerima: string;
  hp: string;
  alamat: string;
  kelurahan?: string;
  kecamatan?: string;
  kota: string;
  provinsi: string;
  kode_pos?: string;
  catatan?: string;
  ongkir: number;
  subtotal: number;
  total: number;
  butir: { slug: string; judul: string; harga: number; jumlah: number }[];
}): void {
  const d = db();
  const jalankan = d.transaction(() => {
    d.prepare(
      `INSERT INTO pesanan (no_order, nama_penerima, hp, alamat, kelurahan,
         kecamatan, kota, provinsi, kode_pos, catatan, ongkir, subtotal,
         total, status, dibuat_pada)
       VALUES (@no_order, @nama_penerima, @hp, @alamat, @kelurahan,
         @kecamatan, @kota, @provinsi, @kode_pos, @catatan, @ongkir,
         @subtotal, @total, 'belum_bayar', @dibuat_pada)`
    ).run({
      no_order: isi.no_order,
      nama_penerima: isi.nama_penerima,
      hp: isi.hp,
      alamat: isi.alamat,
      kelurahan: isi.kelurahan ?? null,
      kecamatan: isi.kecamatan ?? null,
      kota: isi.kota,
      provinsi: isi.provinsi,
      kode_pos: isi.kode_pos ?? null,
      catatan: isi.catatan ?? null,
      ongkir: isi.ongkir,
      subtotal: isi.subtotal,
      total: isi.total,
      dibuat_pada: sekarang(),
    });

    const tambahButir = d.prepare(
      `INSERT INTO butir_pesanan (no_order, slug_buku, judul_buku,
         harga_saat_beli, jumlah)
       VALUES (?, ?, ?, ?, ?)`
    );
    for (const b of isi.butir) {
      tambahButir.run(isi.no_order, b.slug, b.judul, b.harga, b.jumlah);
    }

    d.prepare(
      `INSERT INTO riwayat_status (no_order, status, catatan, waktu)
       VALUES (?, 'belum_bayar', ?, ?)`
    ).run(isi.no_order, "Pesanan dibuat", sekarang());
  });
  jalankan();
}

/** Tandai pembeli sudah bayar. Mengembalikan false kalau nomor tak ada. */
export function tandaiSudahBayar(noOrder: string, nama: string): boolean {
  const d = db();
  const ada = d
    .prepare("SELECT status FROM pesanan WHERE no_order = ?")
    .get(noOrder) as { status: Status } | undefined;
  if (!ada) return false;
  if (ada.status !== "belum_bayar") return true;  // sudah pernah ditandai
  const jalankan = d.transaction(() => {
    d.prepare(
      "UPDATE pesanan SET sudah_bayar_at = ? WHERE no_order = ?"
    ).run(sekarang(), noOrder);
    d.prepare(
      `INSERT INTO riwayat_status (no_order, status, catatan, waktu)
       VALUES (?, 'belum_bayar', ?, ?)`
    ).run(noOrder, `${nama || "Pembeli"} menandai sudah bayar`, sekarang());
  });
  jalankan();
  return true;
}

/** Ubah status pesanan (dipakai admin). */
export function ubahStatus(noOrder: string, status: Status,
                           catatan?: string, resi?: string): boolean {
  const d = db();
  const ada = d
    .prepare("SELECT 1 FROM pesanan WHERE no_order = ?")
    .get(noOrder);
  if (!ada) return false;
  const jalankan = d.transaction(() => {
    d.prepare("UPDATE pesanan SET status = ? WHERE no_order = ?")
      .run(status, noOrder);
    // ⚠️ Simpan resi HANYA kalau memang ada isinya. Kalau admin
    //    mengosongkan kolomnya, resi lama JANGAN terhapus.
    const resiBersih = (resi ?? "").trim();
    if (resiBersih) {
      d.prepare("UPDATE pesanan SET resi = ? WHERE no_order = ?")
        .run(resiBersih, noOrder);
    }
    d.prepare(
      `INSERT INTO riwayat_status (no_order, status, catatan, waktu)
       VALUES (?, ?, ?, ?)`
    ).run(noOrder, status, catatan ?? null, sekarang());
  });
  jalankan();
  return true;
}

/** Semua pesanan (untuk admin). */
export function daftarPesanan(): BarisPesanan[] {
  return db()
    .prepare("SELECT * FROM pesanan ORDER BY dibuat_pada DESC")
    .all() as BarisPesanan[];
}

/** Jumlah pesanan per status (untuk lencana angka). */
export function hitungPerStatus(tandaBrowser?: string) {
  const d = db();
  const hasil: Record<string, number> = {
    belum_bayar: 0, dikemas: 0, dikirim: 0, selesai: 0,
  };
  if (tandaBrowser) {
    // hanya pesanan milik browser ini (pembeli melihat pesanannya sendiri)
    const baris = d
      .prepare(
        `SELECT p.status AS status, COUNT(*) AS n
           FROM pesanan p
          WHERE p.hp IN (SELECT hp FROM pesanan WHERE no_order IN
                (SELECT no_order FROM riwayat_status WHERE catatan LIKE ?))
          GROUP BY p.status`
      )
      .all(`%${tandaBrowser}%`) as { status: string; n: number }[];
    for (const b of baris) hasil[b.status] = b.n;
    return hasil;
  }
  const baris = d
    .prepare("SELECT status, COUNT(*) AS n FROM pesanan GROUP BY status")
    .all() as { status: string; n: number }[];
  for (const b of baris) hasil[b.status] = b.n;
  return hasil;
}

/** Simpan penilaian. Hanya boleh sekali per (no_order, slug_buku). */
export function simpanPenilaian(isi: {
  no_order: string; slug_buku: string; bintang: number;
  komentar?: string; nama?: string;
}): boolean {
  const d = db();
  const ada = d
    .prepare("SELECT 1 FROM pesanan WHERE no_order = ?")
    .get(isi.no_order);
  if (!ada) return false;
  const sudah = d
    .prepare("SELECT 1 FROM penilaian WHERE no_order = ? AND slug_buku = ?")
    .get(isi.no_order, isi.slug_buku);
  if (sudah) return false;
  d.prepare(
    `INSERT INTO penilaian (no_order, slug_buku, bintang, komentar,
       nama_penilai, waktu)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(isi.no_order, isi.slug_buku, isi.bintang, isi.komentar ?? null,
        isi.nama ?? null, sekarang());
  return true;
}

/** Ringkasan penilaian satu buku: rata-rata + jumlah. */
export function ringkasPenilaian(slug: string): { rata: number; jumlah: number } {
  const r = db()
    .prepare(
      "SELECT AVG(bintang) AS rata, COUNT(*) AS jumlah FROM penilaian WHERE slug_buku = ?"
    )
    .get(slug) as { rata: number | null; jumlah: number };
  return { rata: r.rata ?? 0, jumlah: r.jumlah ?? 0 };
}

// ─────────────────────────────────────────────────────────────────────────
// PESANAN YANG PERNAH DIBUKA DI BROWSER INI
//
// ⚠️ KENAPA BUKAN `riwayat_status.catatan LIKE ?` (cara pertama Wulan):
//    catatan TIDAK PERNAH memuat tanda browser → pencarian SELALU kosong,
//    jadi halaman "Pesanan Saya" mati tanpa galat apa pun.
//    (Cacat ketemu dari uji 22Sep26 — bukan dari membaca kode.)
//
// CARA YANG BENAR: simpan sendiri daftar nomor pesanan yang pernah
// dibuka. Halaman /buku/lacak dan /buku/bayar mencatatnya.
// ─────────────────────────────────────────────────────────────────────────

/** Catat bahwa nomor pesanan ini pernah dibuka di browser tertentu. */
export function catatPesananDibuka(tanda: string, noOrder: string): void {
  if (!tanda) return;
  db().prepare(
    `INSERT OR IGNORE INTO pesanan_dibuka (tanda_browser, no_order, waktu)
     VALUES (?, ?, ?)`
  ).run(tanda, noOrder, sekarang());
}

/** Pesanan yang pernah dibuka di browser ini (terbaru dulu). */
export function pesananDibuka(tanda: string): BarisPesanan[] {
  if (!tanda) return [];
  return db()
    .prepare(
      `SELECT p.* FROM pesanan p
         JOIN pesanan_dibuka d ON d.no_order = p.no_order
        WHERE d.tanda_browser = ?
        ORDER BY p.dibuat_pada DESC`
    )
    .all(tanda) as BarisPesanan[];
}

/** Simpan pesan dari form Hubungi Penerbit. */
export function simpanPesan(isi: {
  nama: string; email: string; subjek: string; pesan: string;
}): void {
  db().prepare(
    `INSERT INTO pesan_masuk (nama, email, subjek, pesan, waktu)
     VALUES (?, ?, ?, ?, ?)`
  ).run(isi.nama, isi.email, isi.subjek, isi.pesan, sekarang());
}

/** Semua pesan masuk (untuk admin). */
export function daftarPesan() {
  return db()
    .prepare("SELECT * FROM pesan_masuk ORDER BY waktu DESC")
    .all() as {
      id: number; nama: string; email: string; subjek: string;
      pesan: string; sudah_dibaca: number; waktu: string;
    }[];
}
