#!/usr/bin/env bash
# =============================================================
# GERBANG TEMPLATE 1 (versi live produksi lama) — jalankan saat
# TEMPLATE_AKTIF = "1" di src/lib/template-saklar.ts
#   PORT=3200 BAYANA_DATA_DIR=/tmp/bayana-uji npx next start
#   bash _gerbang_template1.sh
# =============================================================
set -u
BASE="${BASE:-http://127.0.0.1:3200}"
L=0; G=0

cari () { local pola="$1" judul="$2" minimal="${3:-1}"; local n
  n=$(grep -o -- "$pola" /tmp/gt1.html | wc -l)
  if [ "$n" -ge "$minimal" ]; then echo "LULUS  : $judul ($n)"; L=$((L+1));
  else echo "GAGAL  : $judul — ketemu $n, minimal $minimal"; G=$((G+1)); fi; }
hilang () { local pola="$1" judul="$2"
  if grep -q -- "$pola" /tmp/gt1.html; then echo "GAGAL  : $judul — MASIH ADA"; G=$((G+1));
  else echo "LULUS  : $judul (tidak ada)"; L=$((L+1)); fi; }

echo "=== T1: MENU LAMA ==="
curl -s "$BASE/" -o /tmp/gt1.html
cari '>Tentang<'    "menu Tentang"
cari '>Layanan<'    "menu Layanan"
cari 'Beli Buku'    "tombol Beli Buku"
cari 'Terbitkan Buku</a>' "CTA lama Terbitkan Buku"

echo "=== T1: SECTION LAMA KEMBALI ==="
cari 'id="tentang"' "VisiMisi tampil"
cari 'id="layanan"' "Services tampil"
cari 'id="proses"'  "Process tampil"
cari 'id="faq"'     "FAQ tampil"
cari "Mengapa Bayana" "WhyUs tampil"
cari 'Kolaborasi'   "paket lama Kolaborasi"

echo "=== T1: VERSI BARU TIDAK IKUT TAMPIL ==="
hilang 'Kapan buku Anda, segera terbit?' "hero formal T2 tidak tampil"
hilang 'SK.AHU-0074567' "footer 4 kolom T2 tidak tampil"
hilang '>Buku Referensi<' "nama paket T2 tidak tampil"

echo "=== T1: TOMBOL WA TETAP ADA (fitur baru, dua template) ==="
cari 'wa.me/6285111555248' "tombol WA melayang" 1

echo "=== T1: ISBN TAMPIL (versi live lama) ==="
curl -s "$BASE/buku/manajemen-strategi" -o /tmp/gt1_buku.html
if grep -q '>ISBN<' /tmp/gt1_buku.html && grep -q '978-634-7070-01-2' /tmp/gt1_buku.html; then
  echo "LULUS  : ISBN tampil persis produksi lama"; L=$((L+1))
else echo "GAGAL  : ISBN tidak tampil di template 1"; G=$((G+1)); fi

echo
echo "HASIL T1: $L LULUS / $G GAGAL"
[ "$G" -eq 0 ] || exit 1
