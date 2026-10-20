# 🎬 HERO SINEMATIK BAYANA — DOKUMENTASI & CADANGAN (JANGAN DIHAPUS)

> **Status:** CADANGAN AKTIF — **tidak dipakai di produksi**, tapi **WAJIB DIPELIHARA**.
> **Putusan Bos:** 15 Okt 2026 — *"jangan di hapus, hero itu termasuk Dokumentasi untuk
> membuatnya"*.
> **Alasan tidak dipakai:** audit Perpustakaan Nasional (Perpusnas) → beranda memakai
> **hero formal** yang kompak (putusan Bos, masih berlaku).
> **JANGAN ubah produksi.** Dokumen ini hanya untuk memelihara aset cadangan.

---

## 1. APA ITU HERO SINEMATIK

Hero beranda berupa **kumpulan gambar bergerak yang mengikuti scroll** — efeknya
**seperti memutar video**, padahal hanya pergantian gambar.

Istilah di kode: **scroll-story** / **cinematic scroll hero** / **switch section hero**.

**Cara kerjanya:**
1. User masuk beranda → viewport **sticky** (menempel, tidak ikut naik)
2. Wadah hero **420vh** tinggi → memberi ruang scroll
3. Scroll user → **progress 0–100%** → menentukan **frame aktif**
4. **150 frame** `.webp` berganti mengikuti progress (`frame-0001` → `frame-0150`)
5. **Kata-kata emas** (`overlayStory`) muncul–hilang mengikuti tahap tertentu
6. Habis 420vh → lanjut ke section berikutnya

---

## 2. LOKASI ASET (SEMUA UTUH — jangan hapus)

| Berkas | Isi | Jumlah |
|---|---|---|
| `src/components/Hero.tsx` | Komponen hero sinematik | 217 baris |
| `public/frames/frame-*.webp` | Gambar tiap frame | **150 berkas**, 4,7 MB |
| `src/lib/hero-saklar.ts` | **SAKLAR** pemilih hero | 15 baris |
| `src/lib/design-tokens.ts` | `overlayStory` (kata emas) | — |

**Pembanding:** `src/components/HeroFormal.tsx` = hero yang **dipakai produksi**.

---

## 3. SAKLAR (`src/lib/hero-saklar.ts`)

```ts
export type ModeHero = "formal" | "sinematik";
export const HERO_AKTIF: ModeHero = "formal";
```

* `"formal"` → `HeroFormal.tsx` — **aktif sekarang** (sejak 30 Sep 2026, untuk audit Perpusnas)
* `"sinematik"` → `Hero.tsx` — hero gambar bergerak (cadangan ini)

**Cara mengganti:** ubah satu kata `HERO_AKTIF`, lalu **build ulang**.
⚠️ Saklar dibaca **saat BUILD**, bukan saat jalan → wajib rebuild, bukan cukup restart.

---

## 4. RINCIAN TEKNIS (untuk membangun ulang)

| Setelan | Nilai | Letak |
|---|---|---|
| Jumlah frame | `FRAME_COUNT = 150` | `Hero.tsx` |
| Tinggi wadah | `SCROLL_VH = 420` (vh) | `Hero.tsx` |
| Nama berkas frame | `frame-0001.webp` … `frame-0150.webp` (4 digit, `padStart`) | `framePath()` |
| Pelembut transisi | `smooth()` — *smoothstep* `x·x·(3−2x)` | `Hero.tsx` |
| Peralihan antar-kata | *crossfade overlap* (`activeBeats()`) — kata lama menudar keluar, kata baru menudar masuk | `Hero.tsx` |
| Ukuran judul per tahap | `SIZE_CLASS` — `sm`/`md`/`lg`/`xl` | `Hero.tsx` |
| Durasi tiap kata | `startFrame` / `endFrame` per *beat* | `overlayStory` |

**Jendela pudar:** `winIn`/`winOut` = **maks(6, 28% × rentang frame)** → transisi tegas tapi halus.

### Cara membuat frame (bila perlu dibuat ulang)
1. Siapkan video sumber.
2. Pecah jadi **150 gambar** berurutan.
3. Format **`.webp`**, nama `frame-0001.webp` … `frame-0150.webp`.
4. Simpan di `public/frames/`.
5. Ukuran: *frame*-1 ≈ 25 KB · *frame*-150 ≈ 46 KB → total ± **4,7 MB**.

---

## 5. PAGAR — ATURAN YANG WAJIB DIPATUHI

1. 🚫 **JANGAN HAPUS** `Hero.tsx`, `public/frames/`, `hero-saklar.ts`, atau `overlayStory`.
2. 🚫 **JANGAN ubah produksi** — `HERO_AKTIF` tetap `"formal"` selama audit Perpusnas berlaku.
3. ✅ Boleh **melihat / menyalin** aset ini untuk keperluan lain (mis. proyek baru).
4. ✅ Boleh **mengaktifkan** — **hanya setelah Bos menyatakan audit Perpusnas tidak lagi berlaku**.

---

## 6. SEJARAH

| Tanggal | Kejadian |
|---|---|
| ± 9 Sep 2026 | Frame dibuat (`frame-*.webp`, 150 berkas) |
| 30 Sep 2026 | Hero diganti **sinematik → formal** (alasan: audit Perpusnas). Saklar dibuat. |
| 1–2 Okt 2026 | Proyek web Bayana dinyatakan **ditutup** (bukan dihapus) |
| **15 Okt 2026** | Bos menanyakan hero ini → **dicek, ditemukan UTUH** · putusan: **"jangan dihapus, jadikan dokumentasi"** |

---

*Berkas ini adalah dokumentasi resmi aset cadangan. Ditemukan & diverifikasi 15 Okt 2026 —
seluruh aset terbukti UTUH: 150/150 frame ada, `Hero.tsx` 217 baris, saklar berfungsi.*
