// keranjang.ts — operasi keranjang belanja (per tanda-browser).
//
// Alur yang diminta Bos:
//   halaman buku → [+ Keranjang] → keranjang → CENTANG yang mau dibeli
//   → isi alamat → pesanan dibuat.
//
// ⚠️ Buku yang TIDAK dicentang tetap tersimpan di keranjang (tidak
//    terhapus) — pembeli bisa memilih belakangan.

import { db, sekarang } from "./db";

export interface ButirKeranjang {
  id: number;
  slug_buku: string;
  jumlah: number;
}

/** Semua isi keranjang milik satu tanda-browser. */
export function isiKeranjang(tanda: string): ButirKeranjang[] {
  return db()
    .prepare(
      `SELECT id, slug_buku, jumlah FROM keranjang
        WHERE tanda_browser = ? ORDER BY id`
    )
    .all(tanda) as ButirKeranjang[];
}

/** Tambah buku ke keranjang (kalau sudah ada → jumlahnya ditambah). */
export function tambahKeranjang(tanda: string, slug: string,
                                jumlah = 1): void {
  const d = db();
  const ada = d
    .prepare(
      "SELECT id, jumlah FROM keranjang WHERE tanda_browser = ? AND slug_buku = ?"
    )
    .get(tanda, slug) as { id: number; jumlah: number } | undefined;

  if (ada) {
    d.prepare("UPDATE keranjang SET jumlah = ? WHERE id = ?")
      .run(ada.jumlah + jumlah, ada.id);
    return;
  }
  d.prepare(
    `INSERT INTO keranjang (tanda_browser, slug_buku, jumlah, ditambahkan_pada)
     VALUES (?, ?, ?, ?)`
  ).run(tanda, slug, jumlah, sekarang());
}

/** Ubah jumlah satu butir. Jumlah < 1 → butir dihapus. */
export function ubahJumlah(tanda: string, id: number, jumlah: number): void {
  const d = db();
  if (jumlah < 1) {
    d.prepare("DELETE FROM keranjang WHERE id = ? AND tanda_browser = ?")
      .run(id, tanda);
    return;
  }
  d.prepare("UPDATE keranjang SET jumlah = ? WHERE id = ? AND tanda_browser = ?")
    .run(jumlah, id, tanda);
}

/** Buang satu butir dari keranjang. */
export function buangButir(tanda: string, id: number): void {
  db().prepare("DELETE FROM keranjang WHERE id = ? AND tanda_browser = ?")
    .run(id, tanda);
}

/** Kosongkan keranjang (dipakai setelah pesanan berhasil dibuat). */
export function kosongkanKeranjang(tanda: string, slugSaja?: string[]): void {
  const d = db();
  if (slugSaja && slugSaja.length > 0) {
    const tandaTanya = slugSaja.map(() => "?").join(",");
    d.prepare(
      `DELETE FROM keranjang WHERE tanda_browser = ? AND slug_buku IN (${tandaTanya})`
    ).run(tanda, ...slugSaja);
    return;
  }
  d.prepare("DELETE FROM keranjang WHERE tanda_browser = ?").run(tanda);
}

/** Jumlah buku (total keping) di keranjang — untuk lencana di navbar. */
export function jumlahDiKeranjang(tanda: string): number {
  const r = db()
    .prepare(
      "SELECT COALESCE(SUM(jumlah), 0) AS n FROM keranjang WHERE tanda_browser = ?"
    )
    .get(tanda) as { n: number };
  return r.n ?? 0;
}
