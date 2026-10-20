# 🏁 FLAG BAYANA-WEB — TITIK HENTI 02Okt26 03:50 UTC (perintah Bos: *"Ok cukup project web bayana sampai disini, kamu update semua Dokumentasi, script, skill, catatan dan memori"*)

> **Cara balik:** Bos bilang *"lanjut bayana"* → baca berkas ini berurutan → **konfirmasi ke Bos sebelum menyentuh kode**.
> Sumber kebenaran = **KODE DI DISK**; kalau ragu → ukur ulang.
> Pendukung: skill `bayana-publishing-web` (SKILL.md + references/) · `fact_store` · `_arsip/`.

---

## 🆕 SESI 02Okt26 — 6 PERUBAHAN (semua LIVE, semua diuji)

**Image LIVE: `web-bayana:20261002_034415-sot`** · 4 domain 200 · gerbang **80 LULUS / 0 GAGAL**.

Rangkaian sesi ini (semua di `Introduction.tsx`, `Pricing.tsx`, `t1/Pricing.tsx`, `Footer.tsx`):

| # | Minta Bos (verbatim) | Yang dikerjakan | Bukti |
|---|---|---|---|
| 1 | *"Ganti Fakta: Setiap dosen.. dengan kata kata versi 2"* | Paragraf "Fakta :" → isi **versi 2** dari `Fakta.docx` (satu paragraf mengalir, font Bitter) | `bapakIbu:true`, `mariBersama:true` |
| 2 | *"...tandatangan jangan di buat tebal agak samar samar"* | Tanda tangan → `opacity-60` (samar) | `ttdTampil:true`, opacity 0.6 |
| 3 | *"Hapus 'Fakta:'. Dan tulisan paragraf di buat agak sedikit tidak kelihatan / kabur. Model seperti Surat Terbuka"* | Label "Fakta :" **dihapus**; paragraf jadi `text-[#5c6068]` + `opacity-[0.82]` (kabur lembut, gaya surat terbuka) | "Fakta" muncul **0×** di HTML; MATA: *"abu-abu sedang, seperti surat terbuka"* |
| 4 | *"Bagian footer naikkan telepon ke atas email"* + *"kata 'SK AHU:' dihapus"* | Footer: urutan **Telepon → Email → Office**; label `SK AHU:` **dihapus** (NIB & NPWP tetap berlabel) | MATA + HTML: `SK.AHU-0074567.AH.01.01.` tanpa label |
| 5 | *"saat di klik PO PAK terbaru kok keluar peringatan?"* + *"tidak sebaris dia pindah ke bawah di pc"* | Tautan dialihkan ke **SALINAN LOKAL** (Opsi 1, ACC Bos) + batas `max-w-[68%]` dihapus | PDF lokal HTTP 200 (12,6 MB); tinggi paragraf **53→27 px** (satu baris) |
| 6 | *"kalo paket di klik masuknya ke wa, dengan kata-kata yang sudah siap... user tinggal send saja"* | Tombol 3 paket → `wa.me/6285111555248?text=...` pesan siap-kirim diawali **"Hallo Kak,"** | 3/3 pesan benar; gerbang **+4 asersi baru** |

### 🔍 AKAR "peringatan PDF" (temuan penting, bukan salah web kita)
Server `lldikti3.kemdiktisaintek.go.id` **sertifikatnya cacat** = **self-signed** (`subject=CN=www.example.org`, `issuer=CN=www.example.org`). Terukur dari `openssl s_client`: **`notBefore = 1 Okt 2026 10:16:36`** → sertifikat BARU DIPASANG 1 Okt pagi.
⇒ Itu sebabnya *"kemarin aman, sekarang peringatan"* — **bukan kebijakan, bukan salah link kita**; server LLDIKTI3 yang salah saat perbarui sertifikat.
Pembanding terukur: `lldikti4` → HTTP 200 (sehat) · `lldikti1` → 401 · `lldikti3` → self-signed (rusak).

**Jalan keluar dipilih (Opsi 1, ACC Bos):** Pakai PDF yang SUDAH ADA di server (`/opt/data/profiles/riset-jurnal/kepmen39-2026-juknis-dosen.pdf`, **byte identik** dengan yang diunduh — md5 `b480357efa276c2bbad156742014ccd7`, 12.636.145 byte, 116 hlm) → disalin ke `public/dokumen/KEPMEN-39-M-KEP-2026-Juknis-PAK-Dosen.pdf` → tautan `/dokumen/...` (relatif, tab baru).
⇒ **Tidak perlu unduh ulang** (perintah Bos), isi tetap dokumen ASLI Kementerian, dan **selamanya tanpa peringatan**.

### 🔍 AKAR "harga paket seperti turun"
**Bukan** nominal yang berubah — kode & dokumen "Paket Harga.pdf" **sama persis** (500.000 / 1.000.000 / 300.000). Yang terjadi: `text-4xl` (36 px) terlalu besar untuk kartu HP sempit → browser **memotong baris di spasi "Rp 500.000"** sehingga terbaca *seperti* angka hilang.
Perbaikan: `whitespace-nowrap` + ukuran menyesuaikan (`text-3xl` di HP → `sm:text-4xl` di PC). Terukur di 3 lebar: HP 360 → **baris 1**, HP 390 → **baris 1**, PC 1440 → **baris 1**.

### 💾 KEJADIAN SISI SERVER: disk 100% penuh
Saat kerja, disk `/opt/data` penuh (`0` tersisa) → muncul galat `No space left on device`.
Penyebab: gambar Docker lama menahan **27,3 GB**. Tindakan: `docker image prune -f` + hapus gambar eduai/statlab lama (yang SEDANG DIPAKAI & tag `cadangan-pra-*` TIDAK disentuh) → **3,1 GB lega**.
⚠️ Masih ada ~27 GB reclaimable. Kalau perlu: periksa dulu `docker images`, JANGAN hapus image yang dipakai container hidup + `cadangan-pra-sot`.

### 🧾 Catatan MATA yang BELUM ditindak (dilaporkan, menunggu Bos)
- `© 2026` di footer (kemungkinan harus tahun berjalan).
- Teks `bayana.id · Bayana P…` di sub-footer terpotong + tertutup tombol WA (layar sempit).
- Tanda tangan sedikit menimpa `PT. Bayana Hasana Duna` — **sengaja** (`-mt-4` permintaan Bos dulu). JANGAN ubah tanpa izin.
- Bagian `#kontak` kini **tidak lagi ditarik** tombol paket (tombol pindah ke WA). Bos belum menjawab apakah ini dikehendaki.

### 🧠 PELAJARAN BARU (JANGAN ULANG)
- **`grep -E` ≠ `grep -F`.** Pola `\{` / `\(` di `grep -E` (POSIX) artinya beda → asersi gerbang **GAGAL PALSU/SELALU LULUS**. Untuk cek teks harfiah pakai `grep -qF 'href="#kontak"'` (ulang dua kali untuk dua varian), JANGAN regex.
- **Jangan pakai `sed` untuk menyuntik kerusakan ke `.tsx`** — `sed` merusak berkas di tempat; backup `cp` harus dibuat SEBELUM sed, jangan sesudah (Wulan sempat kehilangan berkas benar; dipulihkan dengan patch balik).
- **Asersi gerbang harus menyebut BERKAS**, bukan seluruh halaman: `#kontak` MASIH SAH dipakai Navbar & Galeri Buku; melarangnya global = gagal palsu.
- **`LULUS`/`GAGAL` di `_gerbang_revisi15.sh` itu VARIABEL, bukan fungsi** (pola benar: `echo "GAGAL : ..."; G=$((G+1))`).

---

# (RIWAYAT) FLAG BAYANA-WEB — TITIK HENTI 01Okt26 09:08 UTC (perintah Bos: "sudah selesai sampai disini dulu project web bayana")

> **Cara balik:** Bos bilang *"lanjut bayana"* → baca berkas ini berurutan → **konfirmasi ke Bos sebelum menyentuh kode**.
> Sumber kebenaran = **KODE DI DISK**; kalau ragu → ukur ulang.
> Pendukung: skill `bayana-publishing-web` (SKILL.md + references/) · `fact_store` · `_arsip/`.

## ✅ POSISI PRODUKSI SAAT DIJEDA (semua hijau)
- **Image** `web-bayana:20261002_034415-sot` ← posisi TERBARU (02Okt26). Sebelumnya 01Okt26 = `web-bayana:20261001_090839-sot`.
- **4 domain balas 200:** bayana.id · www.bayana.id · pub.bikinaja.id · buku.bayana.id
- **Saklar:** `template-saklar.ts` = "2" · `hero-saklar.ts` = "formal".
- **Gerbang:** `_gerbang_revisi15.sh` **80 LULUS / 0 GAGAL** (02Okt26) · `_gerbang_template1.sh` **15/0** (T1 diuji dengan `_arsip/uji_t1_build.sh`).

## 📦 YANG SUDAH LIVE (3 perubahan terakhir, 01Okt26)
1. **Section Pengantar** (`src/components/Introduction.tsx`) — antara HeroFormal & Pricing: sub-header emas · hook 2 baris (baris 2 emas berkutip) · garis emas · paragraf "Fakta :" (font **Bitter**) · tanda tangan resmi · tagline. Link "PO PAK terbaru" → tab baru ke PDF Juknis KEPMEN 39/M/KEP/2026.
2. **Tanda tangan RESMI** — `public/tanda-tangan-bayana.svg` SAJA (MD5 `da33bac8c906e0f3b7c402c9988cdd31`), bintang outline 16px, miring 3°. Lihat `references/tanda-tangan-resmi-01okt2026.md`.
3. **Footer legalitas** — `SK AHU: SK.AHU-0074567.AH.01.01.` · `NIB: 1709260023459` · `NPWP: 1000000011174122` (titik dua disamakan semua).

## ⚠️ ATURAN KERAS PROYEK INI (dari teguran Bos, JANGAN ULANG)
- **JANGAN ubah yang tidak diminta.** Bos beberapa kali menegur karena Wulan mengganti/menghapus elemen yang sudah di-ACC (sub-header emas, gaya tebal/miring, tanda tangan). **Kalau contoh sudah di-ACC → samakan PERSIS**, hanya ubah yang disebut.
- **Satu sumber tanda tangan** — kalau butuh tanda tangan, pakai `public/tanda-tangan-bayana.svg` SAJA.
- **Saklar template dibaca SAAT BUILD**, bukan env runtime → uji T1 wajib salinan proyek + ubah saklar + `npx next build` (`_arsip/uji_t1_build.sh`; hapus `.t1-uji` sesudahnya).
- **Gerbang harus bergigi** — sebelum percaya gerbang, suntik kerusakan ke salinan, gerbang HARUS GAGAL.
- **HTML React menyisipkan `<!-- -->`** antara label dan `:` → asersi gerbang pakai `cari_bersih` (buang penanda dulu), JANGAN pola mentah.
- **Deploy wajib izin Bos** + backup (`bash _arsip/backup_sebelum_deploy.sh`).

## 🧰 SKRIP OPERASIONAL
| Skrip | Guna |
|---|---|
| `bash jalankan.sh` | DEPLOY (build image + ganti container + ingress) |
| `bash _gerbang_revisi15.sh` | gerbang Template 2 (72 asersi) |
| `bash _gerbang_template1.sh` | gerbang Template 1 (15 asersi, `BASE=` bila port lain) |
| `bash _arsip/uji_t1_build.sh` | uji T1 (salinan + ubah saklar + build) |
| `bash _arsip/backup_sebelum_deploy.sh` | backup + MD5 sebelum deploy |
| `/opt/data/.venv/bin/python3 _arsip/cek_ingress.py` | cek ingress Cloudflare |
| `/opt/data/.venv/bin/python3 _arsip/cek_footer_sk.py` | cek baris legalitas footer |
| `/opt/data/.venv/bin/python3 _arsip/cek_produksi_intro.py` | cek section pengantar di PRODUKSI |
| `/opt/data/.venv/bin/python3 _arsip/buat_ttd_resmi.py` | buat ulang tanda tangan resmi |

## ⏳ SISA MENUNGGU BOS (belum dikerjakan)
1. Verifikasi Gmail tujuan Cloudflare → 2 rule forward.
2. App password SMTP (SMTP mati: `535-5.7.8`).
3. Kicker emas kontras 3,24 (ambang 4,5).
4. Kosmetik: garis bawah link "PO PAK terbaru" agak mepet huruf.
5. Keputusan kecil lain dari revisi 15 butir.

---

# 🚀 DEPLOY 01Okt26 (08:04 UTC) — SECTION PENGANTAR LIVE

**Image:** `web-bayana:20261001_080418-sot` · container `web-bayana` port 3021 · backup `_arsip/pre-deploy-intro-20261001-0803/`
**Seed pengantar (Introduction.tsx) SUDAH LIVE di 4 domain:** bayana.id · www.bayana.id · pub.bikinaja.id · buku.bayana.id (semua 200).
**Isi:** sub-header emas · hook 2 baris · garis emas · paragraf "Fakta :" (Bitter) · tanda tangan RESMI · tagline. Link "PO PAK terbaru" → `target="_blank"` ke PDF Juknis KEPMEN 39/M/KEP/2026.
**Fakta penting:** ingress Cloudflare memakai `http://localhost:3021` (SEJAK 30Sep26) — IP container berubah TIDAK perlu ubah ingress. Langkah ingress di `jalankan.sh` gagal = HANYA jaringan; hasil akhir tetap benar. Cek: `/opt/data/.venv/bin/python3 _arsip/cek_ingress.py` (ID tunnel `8ae633d2-4726-47e1-aa5d-1d90fe13ffb1`).
**Uji ulang T1 (saklar dibaca SAAT BUILD):** `bash _arsip/uji_t1_build.sh` (salinan `.t1-uji` + ubah saklar + build) → start :3201 → `BASE=http://127.0.0.1:3201 bash _gerbang_template1.sh`. Hasil 15/0. HAPUS `.t1-uji` sesudahnya.
**Sisa kosmetik (menunggu Bos):** garis bawah link PO PAK agak mepet huruf.

# ✍️ TANDA TANGAN RESMI (01Okt26) — JANGAN DIUBAH LAGI

**Berkas tunggal:** `public/tanda-tangan-bayana.svg`
(tanda tangan asli Bos + bintang outline 16px di belakang ekor kanan-atas HAMPIR
menempel + miring 3°). Perintah Bos verbatim: *"jadikan file tandatangan resmi
bayana Publishing. Jangan di rubah rubah lagi dan hapus file lainnya agar tidak
salah pilih tandatangan"*.
14 berkas percobaan dipindah ke `_arsip/ttd-percobaan-01okt26/` (JANGAN dipakai).
Catatan pakai: `_sketsa/TANDA_TANGAN_RESMI.md`. Verifikasi MATA: LULUS (utuh,
bintang terlihat, tidak ada cacat). **Kalau butuh tanda tangan → pakai yang ini SAJA.**

---

# 🏁 FLAG BAYANA-WEB — TITIK HENTI 30Sep26 (perintah Bos: "cukup dulu project bayana Publishing")

> **Cara balik:** Bos bilang *"lanjut bayana"* / *"buka flag bayana"* → baca berkas ini
> berurutan → **konfirmasi posisi ke Bos sebelum menyentuh kode**.
> Sumber kebenaran tetap **KODE DI DISK**; kalau ragu dengan catatan ini → ukur ulang.
> Disimpan 30Sep2026 ~12:40 UTC. Pendukung: skill `bayana-publishing-web`
> (bagian 📵 nomor + status terbaru) + `references/revisi-15-butir-30sep2026.md`
> (§7 nomor, §8 email) + `fact_store` id 158.

---

## ✅ POSISI PRODUKSI (semua hijau saat dijeda)

- **Image** `web-bayana:20260930_122429-sot` (deploy 12:24 UTC, exit 0) — container
  `web-bayana` port `127.0.0.1:3021`, ingress **`localhost:3021`** (bukan IP mentah),
  18 host tunnel `VPS EXA Cloud` balas semua.
- **Saklar:** `src/lib/template-saklar.ts` = `"2"` (Template 2 dokumen) ·
  `src/lib/hero-saklar.ts` = `"formal"`.
- **Menu 5 item** · galeri 16 kartu tautan absolut `https://buku.bayana.id/buku/` (0 relatif) ·
  ISBN 0 bocor di Template 2 · section lama 0 render (berkas tetap utuh).
- **Nomor telp/WA = ANGKA 0 di HTML** — hanya tombol `wa.me/6285111555248`
  (kontak + footer + FAB). Pagar permanen: `_gerbang_revisi15.sh` **bagian 11**.
- **Email = `admin@bayana.id` + `support@bayana.id` SAJA** (gmail lama 0). Pagar:
  `_gerbang_revisi15.sh` **bagian 12**.
- **Cloudflare Email Routing bayana.id = AKTIF** (`enabled=true, status=ready`).
- **Uji terakhir:** gerbang lokal **55 LULUS / 0 GAGAL** · produksi
  `_arsip/cek_email_prod.sh` **7/7** · potret+MATA: kolom Email benar, nomor 0.
- **Backup hari ini:** `_arsip/pre-revisi15butir-30sep26/` · `_arsip/pre-nomorwa-30sep26/`
  · `_arsip/pre-emailadmin-30sep26/` · `_arsip/dns-bayana-pre-emailrouting-30sep26.json`
  · `_arsip/ingress-cadangan.json` (semua + MD5).

---

## 🔴 SISA — MENUNGGU PERINTAH/BAHAN DARI BOS (jangan dikerjakan tanpa izin)

1. **Verifikasi tujuan forward Cloudflare** — inbox Gmail `bayanapublishing@gmail.com`
   harus klik tautan konfirmasi dari Cloudflare (alamat sudah `unverified→daftar ulang`
   30Sep26). SETELAH itu baru bisa pasang 2 rule:
   `admin@bayana.id` & `support@bayana.id` → Gmail itu.
   API siap, jebakan tercatat di skill `cloudflare-email-routing`
   (aktifkan zona = `POST .../email/routing/dns`; rule pakai `value` tunggal;
   tujuan belum verified = error 2054). Cadangan tujuan sudah terverifikasi:
   `paculdigital01@gmail.com` / `wirastomo@gmail.com` (kalau Bos mau, tinggal bilang).
2. **App password Gmail untuk SMTP form** — kredensial lama kena `535-5.7.8`.
   Form tetap aman (pesan tersimpan di tabel `pesan_masuk`); respons jujur
   `email: "gagal"`. Lokasi ganti: `_arsip/.mail.env` (mode 600, JANGAN cetak isinya)
   → ubah = jalankan `bash jalankan.sh` (env-file dibaca saat container dibuat ulang).
3. 🟡 **Kicker emas `PAKET PENERBITAN BUKU` kontras 3,24** (ambang 4,5) — sudah
   dilaporkan, belum diputuskan Bos (jangan diubah diam-diam).
4. 🟡 **Dokumen footer kembar** ("SK AHU — SK. AHU-0074567...") = persis dokumen Bos;
   sudah dilaporkan, belum ada instruksi.
5. 🟡 **5 keputusan kecil lama** (tanya sekali, lalu kunci): label CTA (PDF "CTA" vs
   XLSX "CTA Promo" vs kode "Lihat Promo") · gambar hero (rak buku sekarang vs
   "mockup kantor" dokumen) · deskripsi paket placeholder · sub-headline ke-4 ·
   3 tombol WA di satu layar (MATA: berlebihan). Plus: tombol **"Beli Buku"** navbar
   ditarik saat revisi butir 4 (permintaan Bos 22Sep26) — Bos boleh minta kembali.

---

## ⛔ ATURAN KERAS PROYEK INI (pelanggaran = kembali ke titik rusak)

- **Nomor telepon/WA DILARANG tampil sebagai teks angka** (koreksi keras Bos 30Sep26
  verbatim, lihat skill bagian 📵). Hanya tombol/FAB `wa.me` sekali klik.
  Email & alamat kantor MASIH boleh tampil.
- **Email situs = `admin@bayana.id` + `support@bayana.id` saja** (permintaan Bos
  30Sep26) — jangan kembalikan alamat gmail ke tampilan (pagar bagian 12).
- **Palet gading `#faf7f0` + navy `#23272f`/`#1e3a5f` + emas** — "tidak ada
  background putih" (0 piksel putih murni, terukur).
- **`src/components/Hero.tsx` (hero lama) & `src/components/t1/*` JANGAN dihapus** —
  itulah isi Template 1 / saklar hero. Penutup hero *"...hingga terbit.."* = 2 titik,
  persis tulisan Bos.
- **Backup dulu sebelum ubah berkas:** `_arsip/pre-<topik>-<tgl>/` + `MD5.txt`.
- **Ingress:** jangan tulis IP container — `localhost:3021`; cadangan
  `_arsip/ingress-cadangan.json`. Uji SEMUA 18 host setiap deploy.
- **Kredensial** hanya di `_arsip/.mail.env` + `_arsip/.admin.env` (600) & vault
  `cloudflare.json` — dilarang dicetak ke kode/dokumen/chat.

---

## 🧰 PETA CEPAT

**Kode (src/):**
- `page.tsx` (cabang template) · `lib/template-saklar.ts` · `lib/hero-saklar.ts`
- `components/HeroFormal.tsx` (T2) · `components/Hero.tsx` (T1) · `components/t1/*` (T1 utuh)
- `components/Navbar.tsx` (menu 5) · `Footer.tsx` (4 kolom; Email admin/support;
  baris Telp diganti tombol WA) · `Contact.tsx` (teks dokumen + form) · `TombolWa.tsx` (FAB)
- `app/api/buku/kontak/route.ts` (POST → tabel `pesan_masuk` + nodemailer best-effort,
  default `MAIL_TO=admin@bayana.id`)
- `app/buku/[slug]/page.tsx` (ISBN conditional per template) · `data/buku.ts` (ISBN asli)

**Uji (urutan yang benar):**
1. Server uji: matikan dulu `ps aux | grep next-server` (jangan `pkill -f 'next start'`
   pola malah bunuh shell sendiri; `ss` bisa tak ada — pakai
   `(exec 3<>/dev/tcp/127.0.0.1/3200) 2>/dev/null && echo TERBUKA || echo BEBAS`),
   lalu `PORT=3200 BAYANA_DATA_DIR=/tmp/bayana-uji npx next start` (background).
2. `bash _gerbang_revisi15.sh` → wajib **55/55** (T2) · `bash _gerbang_template1.sh` →
   15/15 (T1; terakhir dijalankan sebelum koreksi email — T1 = arsip versi lama,
   gmail/nomor di T1 memang sengaja dibiarkan).
3. Produksi: `bash _arsip/cek_email_prod.sh` (7 asersi) · `_arsip/cek_nomor_prod.sh`
   · `_arsip/cek_prod.sh` · `_cek_menu_produksi.sh` (toko).
   ⚠️ Skrip `_uji_*.sh` lama = **arsip fase toko (22Sep26)** — jangan dipakai menilai
   versi sekarang tanpa baca isinya dulu.
4. MATA: `_arsip/potret_nomor_baru.py` (CDP `:9333`) → `/tmp/prod_*.png` →
   `vision_analyze` minta **MASALAH, jangan memuji** → verifikasi tiap temuan ke sumber.

**Deploy:** `bash jalankan.sh` (background + notify) → exit 0 → image
`web-bayana:<stamp>-sot` → jalankan uji produksi di atas. Ingress tak berubah lagi
(kuncinya sudah `localhost`).

**Dokumen sumber:** `/opt/data/cache/documents/doc_5247a3b03784_Revisi Web desain.pdf`
+ `doc_c02749f91c41_...xlsx` (15 butir; CTA Promo di XLSX) + `doc_5976a2ac51e2_Logo Bayana.docx`.

---

## 📜 RIWAYAT 30Sep2026 (3× deploy, semua exit 0)

| Waktu UTC | Isi | Image |
|---|---|---|
| 10:48 | 15 butir + saklar Template 1/2 + hero formal + galeri absolut + ingress `localhost` | `web-bayana:20260930_104859-sot` |
| 11:34 | HAPUS nomor telp/WA sebagai teks → tombol WA (pagar gerbang §11) | `web-bayana:20260930_113434-sot` |
| 12:24 | Email → `admin@bayana.id`/`support@bayana.id` saja (pagar gerbang §12) + `MAIL_TO` form | `web-bayana:20260930_122429-sot` |

Email Routing Cloudflare diaktifkan 12:16 UTC (jalur `POST .../email/routing/dns`);
2 rule forward BELUM dibuat — menunggu verifikasi tujuan (butir SISA #1).
