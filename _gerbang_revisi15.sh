#!/usr/bin/env bash
# =============================================================
# GERBANG REVISI 15 BUTIR — bayana.id (dokumen 30Sep2026)
# REVISI PERPUSNAS 20Oct26 (ACC Bos): menimpa sebagian asersi lama —
#   • hook hero tanpa janji ISBN
#   • menu "Paket Harga" → "Layanan"
#   • fitur "Ber-ISBN Perpusnas"/"Indexing Google Scholar" DIHAPUS
#   • section Tentang Kami + Alur Penerbitan DITAMBAHKAN
#   • nama diseragamkan "PT Bayana Hasana Duna", logo baru
#   • blok Media Sosial placeholder DITAMBAHKAN
# Jalankan dengan server uji hidup:
#   PORT=3200 BAYANA_DATA_DIR=/tmp/bayana-uji npx next start
#   bash _gerbang_revisi15.sh
# =============================================================
set -u
BASE="${BASE:-http://127.0.0.1:3200}"
L=0; G=0

cari_bersih () { # cari_bersih <pola> <judul> — buang penanda komentar React dulu
  local pola="$1" judul="$2"
  local n
  n=$(curl -s "$BASE/" | sed 's/<!-- -->//g' | grep -F -c "$pola" || true)
  if [ "${n:-0}" -ge 1 ]; then L=$((L+1)); printf 'LULUS  : %s\n' "$judul"
  else G=$((G+1)); printf 'GAGAL  : %s — ketemu %s, minimal 1\n' "$judul" "${n:-0}"; fi
}

cari () { # cari <pola> <judul> [jumlah minimal]
  local pola="$1" judul="$2" minimal="${3:-1}"
  local n; n=$(grep -o -- "$pola" /tmp/g15.html | wc -l)
  if [ "$n" -ge "$minimal" ]; then echo "LULUS  : $judul ($n)"; L=$((L+1));
  else echo "GAGAL  : $judul — ketemu $n, minimal $minimal"; G=$((G+1)); fi
}
hilang () { # pastikan TIDAK ada <pola> <judul>
  local pola="$1" judul="$2"
  if grep -q -- "$pola" /tmp/g15.html; then echo "GAGAL  : $judul — MASIH ADA"; G=$((G+1));
  else echo "LULUS  : $judul (tidak ada)"; L=$((L+1)); fi
}

echo "=== 1. HERO (butir 5 · teks direvisi 01Oct26; hook direvisi Perpusnas 20Oct26) ==="
curl -s "$BASE/" -o /tmp/g15.html
cari 'Kapan Buku Anda Terbit?' "hook hero (revisi Perpusnas 20Oct26)"
hilang 'Ber-ISBN' "janji ISBN dihapus dari hero (revisi Perpusnas 20Oct26)"
cari 'Dari Gagasan Terbitlah Buku Referensi, Buku Monograf, dan Buku Ajar' "baris kedua (revisi 01Oct26)"
cari 'Beritahu idenya, kami dampingi hingga terbit. BKD dan Jafung jadi aman' "kalimat penutup (revisi 01Oct26)"
hilang 'Kapan buku Anda, segera terbit?' "hook lama sudah tidak dipakai"
hilang 'Mulai dari gagasan, referensi' "baris kedua lama sudah tidak dipakai"
hilang 'ber-ISBN Perpusnas' "frasa ber-ISBN di pengantar dihapus (revisi Perpusnas 20Oct26)"
hilang 'terindeks Google Scholar' "klaim Scholar dihapus (revisi Perpusnas 20Oct26)"
cari 'Berbasis PO PAK Dosen dan Regulasi Terbaru' "eyebrow"
cari 'hero-rak-buku.png'                          "foto rak buku"
cari 'logo-bayana-hd.png'                         "logo resmi baru (revisi Perpusnas 20Oct26)"
hilang 'Bayana Publishing'                        "nama lama tidak tampil lagi (revisi Perpusnas 20Oct26)"
cari '<section id="beranda"'                      "hero tampil tepat 1x" 1

echo "=== 2. MENU (butir 4; label direvisi Perpusnas 20Oct26) ==="
cari '>Beranda<'   "menu Beranda"
cari '>Layanan<'   "menu Layanan (dulu 'Paket Harga')"
hilang '>Paket Harga<' "label lama Paket Harga dihapus"
cari '>Katalog<'   "menu Katalog"
cari '>Kontak<'    "menu Kontak"
cari 'Lihat Promo' "CTA Promo"
hilang '>Tentang<'  "menu Tentang tetap tidak ada"
hilang 'Beli Buku'  "tombol Beli Buku dihapus (sesuai 'hanya 5 menu')"
hilang 'Terbitkan Buku</a>' "CTA lama Terbitkan Buku dihapus dari navbar"

echo "=== 3. SECTION (butir 6-13; direvisi Perpusnas 20Oct26) ==="
cari 'id="tentang"' "section Tentang Kami tampil (revisi Perpusnas 20Oct26)"
cari 'menyebarluaskan ilmu pengetahuan' "pernyataan komitmen ilmu (revisi Perpusnas 20Oct26)"
cari 'id="alur"' "section Alur Penerbitan tampil (revisi Perpusnas 20Oct26)"
cari 'Administrasi Penerbitan' "langkah administrasi (bahasa netral, bukan janji ISBN)"
hilang 'id="layanan"' "Services/Layanan tidak dirender"
hilang 'id="faq"'     "FAQ tidak dirender"
hilang 'Kenapa Pilih Kami' "WhyUs/Mengapa Bayana tidak dirender"
hilang 'Testimoni'    "Testimoni tidak dirender"
hilang 'TrustBar'     "TrustBar (angka placeholder) tidak dirender"

echo "=== 4. PAKET (butir 8) ==="
cari '>Buku Referensi<' "nama paket Buku Referensi"
cari '>Monograf<'       "nama paket Monograf"
cari '>Buku Ajar<'      "nama paket Buku Ajar"
#  ⚠️ React memisah teks jadi node: "Rp " + <!-- --> + "500.000"
#  jadi uji harga = pola untuk ANGKA saja (tanpa 'Rp ')
cari '500.000' "harga Referensi (dokumen Paket Harga)"
cari '1.000.000' "harga Monograf (dokumen Paket Harga)"
cari '300.000' "harga Buku Ajar (dokumen Paket Harga)"
cari 'penawaran spesial' "catatan bawah (revisi 01Oct26)"
hilang 'Indexing Google Scholar' "janji indexing dihapus (revisi Perpusnas 20Oct26)"
hilang 'Schooler' "typo 'Schooler' sudah tidak ada"
cari 'KUM 40 poin' "KUM Referensi 40 poin"
cari 'KUM 20 poin' "KUM Monograf/Ajar 20 poin"
hilang 'Ber-ISBN Perpusnas' "janji ISBN dihapus dari fitur (revisi Perpusnas 20Oct26)"
cari 'Pendampingan administrasi penerbitan' "fitur pengganti (revisi Perpusnas 20Oct26)"
cari 'Berkas siap upload ke Sister' "fitur Berkas Sister"
cari 'Paling Populer' "label Paling Populer tampil"
cari 'Minimal 3 penulis' "min 3 penulis (Referensi)"
hilang 'Deskripsi paket sedang disiapkan' "deskripsi placeholder dihapus (harga asli dipakai)"
hilang '>Kolaborasi<'   "nama lama Kolaborasi dihapus"
hilang '>Eksklusif<'    "nama lama Eksklusif dihapus"

echo "=== 5. KONTAK (butir 14) ==="
cari 'Prosesnya tidak akan rumit'            "teks kontak dokumen"
cari 'Yuk, Kirim Pesan atau klik tombol WA'  "ajakan WA"
cari 'wa.me/6285111555248'                 "tombol WA 085111555248" 2
hilang '812-XXXX-XXXX'                       "WA placeholder lama dihapus"

echo "=== 5c. TAUTAN PO PAK — SALINAN LOKAL (02Okt26) ==="
# 20Oct26: surat terbuka (Introduction) DISEMBUNYIKAN dari beranda atas
# perintah Bos → tautan tidak dirender; periksa BERKASNYA, bukan HTML.
if grep -qF 'dokumen/KEPMEN-39-M-KEP-2026-Juknis-PAK-Dosen.pdf' src/components/Introduction.tsx; then
  echo "LULUS  : tautan PO PAK ke salinan LOKAL (di berkas Introduction)"; L=$((L+1))
else echo "GAGAL  : tautan PO PAK hilang dari src/components/Introduction.tsx"; G=$((G+1)); fi
hilang 'lldikti3.kemdiktisaintek.go.id' "tautan lldikti3 (sertifikat cacat) SUDAH dibuang"
hilang 'Naskah Anda Mengendap' "surat terbuka disembunyikan (saklar 20Oct26)"
echo "=== 5d. TOMBOL PAKET → WHATSAPP (02Okt26) ==="
cari 'https://wa.me/6285111555248?text=' "tombol paket mengarah ke WA (nomor + pesan)"
cari 'Hallo%20Kak%2C' "pesan WA diawali 'Hallo Kak,'"
# Tombol PAKET (Pricing.tsx) tidak boleh lagi ke #kontak — tapi #kontak tetap
# dipakai Navbar & Galeri, jadi periksa BERKASNYA, bukan seluruh halaman.
for _f in src/components/Pricing.tsx src/components/t1/Pricing.tsx; do
  if grep -qF 'href="#kontak"' "$_f" || grep -qF 'href={"#kontak"}' "$_f"; then
    echo "GAGAL  : $_f masih punya href=\"#kontak\""; G=$((G+1))
  else
    echo "LULUS  : $_f tombol paket sudah ke WA (bukan #kontak)"; L=$((L+1))
  fi
done
echo "=== 6. FOOTER (butir 15) ==="
# 01Oct26: HTML React menyisipkan <!-- --> antara label dan ":" -> pakai pola
# yang mengabaikan penanda itu (sed 's/<!-- -->//g' dulu), BUKAN pola mentah.
cari_bersih 'SK.AHU-0074567.AH.01.01.' "SK AHU tampil (label dihapus atas perintah Bos 02Okt26)"
hilang_bersih () { # pastikan TIDAK ada <pola> (tahan penanda React)
  local pola="$1" judul="$2"
  if curl -s "$BASE/" | sed 's/<!-- -->//g' | grep -F -q -- "$pola"; then
    echo "GAGAL  : $judul — MASIH ADA"; G=$((G+1))
  else echo "LULUS  : $judul (tidak ada)"; L=$((L+1)); fi
}
hilang_bersih 'SK AHU'                   "label 'SK AHU' TIDAK muncul lagi"
cari_bersih 'NIB:</span> 1709260023459'   "NIB bertitik dua"
cari_bersih 'NPWP:</span> 1000000011174122' "NPWP bertitik dua"
# 02Okt26: urutan Kontak Redaksi = Telepon -> Email -> Office
URUT=$(curl -s "$BASE/" | sed 's/<!-- -->//g' | grep -oE '>(Telepon|Email|Office)<' | head -3 | tr -d '><' | tr '\n' ' ')
if [ "$URUT" = "Telepon Email Office " ]; then
  echo "LULUS  : urutan Kontak Redaksi Telepon-Email-Office"; L=$((L+1))
else
  echo "GAGAL  : urutan Kontak Redaksi (dapat: ${URUT:-kosong})"; G=$((G+1))
fi
cari '1709260023459'             "NIB"
cari '1000000011174122'          "NPWP"
cari 'Jatiasih'                  "alamat kantor"
cari 'Shopee'                    "marketplace Shopee"
cari 'PT Bayana Hasana Duna'    "nama PT konsisten (revisi Perpusnas 20Oct26)"
# Media sosial placeholder (permintaan Bos 20Oct26) — URL asli menyusul
cari 'Media Sosial'             "blok Media Sosial tampil"
cari 'aria-label="Instagram"'   "ikon Instagram"
cari 'aria-label="Facebook"'    "ikon Facebook"
cari 'aria-label="YouTube"'     "ikon YouTube"
cari 'aria-label="LinkedIn"'    "ikon LinkedIn"
# ---- bagian 12 (DIREVISI 01Oct26): EMAIL = GMAIL (permintaan Bos)
#  Bos 01Oct26: "Email, admin@bayana.id di ganti aslinya saja" →
#  bayanahasanaduna@gmail.com + bayanapublishing@gmail.com
cari 'bayanahasanaduna@gmail.com' "email 1 (gmail asli)"
cari 'bayanapublishing@gmail.com' "email 2 (gmail asli)"
hilang 'admin@bayana.id'  "email admin@bayana.id tidak tampil lagi"
hilang 'support@bayana.id' "email support@bayana.id tidak tampil lagi"
# Media sosial: DITAMBAHKAN kembali sebagai placeholder (permintaan Bos 20Oct26)

echo "=== 7. TOMBOL WA MELAYANG (butir 1) ==="
cari 'wa.me/6285111555248' "total tautan WA (floating + tombol kontak)" 2

echo "=== 8. KATALOG — ISBN dihapus dari deskripsi (butir 11) ==="
curl -s "$BASE/buku/manajemen-strategi" -o /tmp/g15_buku.html
if grep -q '>ISBN<' /tmp/g15_buku.html; then echo "GAGAL  : baris ISBN masih ada di halaman buku"; G=$((G+1));
else echo "LULUS  : baris ISBN/e-ISBN hilang dari halaman buku"; L=$((L+1)); fi
if grep -q '978-634' /tmp/g15_buku.html; then echo "GAGAL  : angka ISBN asli masih bocor"; G=$((G+1));
else echo "LULUS  : angka ISBN asli tidak bocor"; L=$((L+1)); fi

echo "=== 9. FORM KONTAK TERSAMBUNG DB ==="
jawab=$(curl -s -X POST "$BASE/api/buku/kontak" -H 'Content-Type: application/json' \
  -d '{"nama":"Uji Gerbang","email":"uji@contoh.com","subjek":"Formulir bayana.id","pesan":"uji 15 butir"}')
case "$jawab" in
  *'"ok":true'*) echo "LULUS  : POST /api/buku/kontak tersimpan ($jawab)"; L=$((L+1));;
  *) echo "GAGAL  : POST /api/buku/kontak → $jawab"; G=$((G+1));;
esac

echo "=== 10. GALERI → buku.bayana.id (tabel penghubung wajib) ==="
n_abs=$(grep -o 'https://buku\.bayana\.id/buku/' /tmp/g15.html | wc -l)
n_rel=$(grep -o 'href="/buku/' /tmp/g15.html | wc -l)
if [ "$n_abs" -gt 10 ]; then echo "LULUS  : tautan absolut ke toko ($n_abs)"; L=$((L+1));
else echo "GAGAL  : tautan absolut ke toko cuma $n_abs (harus >10)"; G=$((G+1)); fi
if [ "$n_rel" -eq 0 ]; then echo "LULUS  : tidak ada tautan relatif /buku/ (0)"; L=$((L+1));
else echo "GAGAL  : ada $n_rel tautan relatif /buku/ (harus 0)"; G=$((G+1)); fi
n_kartu=$(grep -o 'group/kartu' /tmp/g15.html | wc -l)
if [ "$n_kartu" -ge 8 ]; then echo "LULUS  : kartu galeri tampil ($n_kartu)"; L=$((L+1));
else echo "GAGAL  : kartu galeri cuma $n_kartu"; G=$((G+1)); fi

echo "=== 11. NOMOR TELP TAMPIL + TOMBOL WA (revisi Bos 01Oct26) ==="
#  Bos 01Oct26 minta nomor telepon TERLIHAT sebelum tombol WA:
#  "Di footer, sebelum tombol wa tuliskan nomor telepon: 081317107179, 085111555246, (tombol wa)"
cari '081317107179'      "nomor telepon 1 tampil"
cari '085111555246'      "nomor telepon 2 tampil"
hilang '813 1710 7179'   "nomor tidak ditulis berspasi-aneh"
cari 'wa.me/6285111555248' "tombol WA sekali klik (FAB + kontak + footer)" 3

echo "=== 12. KOMPONEN CADANGAN BERSIH DARI JANJI ISBN (temuan AI 20Oct26) ==="
# Services/Faq/Process/Testimonials tidak dirender template 2 aktif,
# tapi tetap diperiksa di level sumber — kalau saklar template dibalik,
# janji ISBN tidak boleh muncul kembali.
for _f in src/components/Services.tsx src/components/Faq.tsx src/components/Process.tsx src/components/Testimonials.tsx; do
  if grep -qi "ber-ISBN" "$_f"; then
    echo "GAGAL  : $_f masih mengandung janji ber-ISBN"; G=$((G+1))
  else
    echo "LULUS  : $_f bebas janji ber-ISBN"; L=$((L+1))
  fi
done

echo
echo "HASIL: $L LULUS / $G GAGAL"
[ "$G" -eq 0 ] || exit 1
