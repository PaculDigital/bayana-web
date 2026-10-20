#!/usr/bin/env bash
# =============================================================
# GERBANG REVISI 15 BUTIR — bayana.id (dokumen 30Sep2026)
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

echo "=== 1. HERO (butir 5 · teks direvisi 01Oct26) ==="
curl -s "$BASE/" -o /tmp/g15.html
cari 'Kapan Buku Ber-ISBN Anda Terbit ?' "hook hero (revisi 01Oct26)"
cari 'Dari Gagasan Terbitlah Buku Referensi, Buku Monograf, dan Buku Ajar' "baris kedua (revisi 01Oct26)"
cari 'Beritahu idenya, kami dampingi hingga terbit. BKD dan Jafung jadi aman' "kalimat penutup (revisi 01Oct26)"
hilang 'Kapan buku Anda, segera terbit?' "hook lama sudah tidak dipakai"
hilang 'Mulai dari gagasan, referensi' "baris kedua lama sudah tidak dipakai"
cari 'Berbasis PO PAK Dosen dan Regulasi Terbaru' "eyebrow"
cari 'hero-rak-buku.png'                          "foto rak buku"
cari 'logo-bayana.png'                            "logo gambar"
cari '<section id="beranda"'                      "hero tampil tepat 1x" 1

echo "=== 2. MENU (butir 4) ==="
cari '>Beranda<'   "menu Beranda"
cari '>Paket Harga<' "menu Paket Harga"
cari '>Katalog<'   "menu Katalog"
cari '>Kontak<'    "menu Kontak"
cari 'Lihat Promo' "CTA Promo"
hilang '>Tentang<'  "menu Tentang dihapus"
hilang '>Layanan<'  "menu Layanan dihapus"
hilang 'Beli Buku'  "tombol Beli Buku dihapus (sesuai 'hanya 5 menu')"
hilang 'Terbitkan Buku</a>' "CTA lama Terbitkan Buku dihapus dari navbar"

echo "=== 3. SECTION DIHAPUS (butir 6-13) ==="
hilang 'id="tentang"' "VisiMisi/Tentang tidak dirender"
hilang 'id="layanan"' "Services/Layanan tidak dirender"
hilang 'id="proses"'  "Process/Alur tidak dirender"
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
cari 'Indexing Google Scholar' "fitur Google Scholar (typo 'Schooler' diperbaiki 01Oct26)"
hilang 'Schooler' "typo 'Schooler' sudah tidak ada"
cari 'KUM 40 poin' "KUM Referensi 40 poin"
cari 'KUM 20 poin' "KUM Monograf/Ajar 20 poin"
cari 'Ber-ISBN Perpusnas' "fitur Ber-ISBN Perpusnas"
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
cari 'dokumen/KEPMEN-39-M-KEP-2026-Juknis-PAK-Dosen.pdf' "tautan PO PAK ke salinan LOKAL"
hilang 'lldikti3.kemdiktisaintek.go.id' "tautan lldikti3 (sertifikat cacat) SUDAH dibuang"
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
cari 'PT. Bayana Hasana Duna'    "nama PT"
# ---- bagian 12 (DIREVISI 01Oct26): EMAIL = GMAIL (permintaan Bos)
#  Bos 01Oct26: "Email, admin@bayana.id di ganti aslinya saja" →
#  bayanahasanaduna@gmail.com + bayanapublishing@gmail.com
cari 'bayanahasanaduna@gmail.com' "email 1 (gmail asli)"
cari 'bayanapublishing@gmail.com' "email 2 (gmail asli)"
hilang 'admin@bayana.id'  "email admin@bayana.id tidak tampil lagi"
hilang 'support@bayana.id' "email support@bayana.id tidak tampil lagi"
# Media sosial dihapus (permintaan Bos 01Oct26)
hilang 'Media Sosial'      "label Media Sosial dihapus"
hilang 'Instagram, YouTube, LinkedIn' "daftar media sosial dihapus"

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

echo
echo "HASIL: $L LULUS / $G GAGAL"
[ "$G" -eq 0 ] || exit 1
