#!/usr/bin/env bash
# Uji PRODUKSI (buku.bayana.id) memakai curl — skrip Python diblokir
# Cloudflare (HTTP 403), curl lolos. Uji 3 keluhan Bos.
set -u
D=https://buku.bayana.id
CJ=/tmp/uji-cookie.txt
rm -f "$CJ"
LULUS=0; GAGAL=0

cek() {   # cek "nama" "syarat(0=ya)"
  if [ "$2" -eq 0 ]; then LULUS=$((LULUS+1)); echo "  LULUS  $1"
  else GAGAL=$((GAGAL+1)); echo "  GAGAL  $1"; fi
}

echo "=============================================================="
echo " 1. LENCANA ANGKA KERANJANG — PRODUKSI"
echo "=============================================================="
curl -s -c "$CJ" --max-time 25 "$D/buku" -o /tmp/p1.html
cek "katalog terbuka (ada isi)" "$([ -s /tmp/p1.html ] && echo 0 || echo 1)"
cek "ikon keranjang ada" "$(grep -q 'toko-keranjang' /tmp/p1.html && echo 0 || echo 1)"
cek "keranjang kosong TIDAK ada lencana" "$(grep -q 'class="lencana"' /tmp/p1.html && echo 1 || echo 0)"

curl -s -b "$CJ" -c "$CJ" --max-time 25 -X POST "$D/api/buku/keranjang" \
  -H "Content-Type: application/json" \
  -d '{"aksi":"tambah","slug":"manajemen-strategi"}' -o /tmp/p2.json
echo "         jawab API: $(cat /tmp/p2.json)"
cek "tambah ke keranjang berhasil" "$(grep -q '"ok":true' /tmp/p2.json && echo 0 || echo 1)"

curl -s -b "$CJ" --max-time 25 "$D/buku" -o /tmp/p3.html
LENCANA=$(grep -o 'class="lencana">[0-9]*<' /tmp/p3.html | head -1)
echo "         lencana: ${LENCANA:-TIDAK ADA}"
cek "lencana MUNCUL setelah diisi" "$(echo "$LENCANA" | grep -q 'lencana' && echo 0 || echo 1)"
cek "angkanya 1" "$(echo "$LENCANA" | grep -q '>1<' && echo 0 || echo 1)"

echo
echo "=============================================================="
echo " 2. FORM ALAMAT — dropdown + kolom wajib (PRODUKSI)"
echo "=============================================================="
curl -s -b "$CJ" --max-time 25 "$D/buku/alamat?beli=manajemen-strategi" -o /tmp/p4.html
cek "ADA dropdown Provinsi"   "$(grep -q 'select id="provinsi"' /tmp/p4.html && echo 0 || echo 1)"
cek "ADA dropdown Kota"        "$(grep -q 'select id="kota"' /tmp/p4.html && echo 0 || echo 1)"
cek "ADA kolom Kecamatan"      "$(grep -q 'id="kecamatan"' /tmp/p4.html && echo 0 || echo 1)"
cek "ADA kolom Kelurahan"      "$(grep -q 'id="kelurahan"' /tmp/p4.html && echo 0 || echo 1)"
cek "ADA tanda wajib (*)"      "$(grep -q 'toko-wajib' /tmp/p4.html && echo 0 || echo 1)"
JML=$(grep -o '<option value=' /tmp/p4.html | wc -l)
echo "         jumlah pilihan dropdown: $JML"
cek "daftar provinsi terisi (>30)" "$([ "$JML" -gt 30 ] && echo 0 || echo 1)"
cek "kode pos tetap opsional" "$(grep -q 'Kode pos (opsional)' /tmp/p4.html && echo 0 || echo 1)"

echo
echo "=============================================================="
echo " 3. TOMBOL — tulisan putih (PRODUKSI)"
echo "=============================================================="
cek "tombol kelas toko-btn-utama" "$(grep -q 'toko-btn toko-btn-utama' /tmp/p4.html && echo 0 || echo 1)"
cek "warna putih di tombol"       "$(grep -q '#ffffff' /tmp/p4.html && echo 0 || echo 1)"

# CSS asli dari produksi — cari di SEMUA berkas CSS yang dirujuk halaman,
# bukan berhenti di berkas pertama yang memuat 'toko-btn-utama'.
DITEMUKAN=1
for CSSPATH in $(grep -o 'href="/_next/static/[^"]*\.css"' /tmp/p4.html | sed 's/href="//;s/"//'); do
  curl -s --max-time 25 "$D$CSSPATH" -o /tmp/pc.css
  if grep -q 'toko-btn-utama' /tmp/pc.css; then DITEMUKAN=0; fi
  if grep -q 'toko-wajib' /tmp/pc.css; then WAJIB=$(tr -d ' ' </tmp/pc.css | grep -oE '\.toko-wajib\{[^}]*\}'); fi
  if grep -q 'toko-kurang' /tmp/pc.css; then KURANG=$(tr -d ' ' </tmp/pc.css | grep -oE 'toko-kurang[^}]*\}'); fi
  if grep -q 'color:#fff!important' /tmp/pc.css || grep -q 'color: #fff !important' /tmp/pc.css; then
    PUTIH=$(tr -d ' ' </tmp/pc.css | grep -oE '\.toko-btn-utama[^{]*\{color:#fff!important\}')
  fi
done
cek "CSS produksi: tombol putih (!important)" "$([ -n "${PUTIH:-}" ] && echo 0 || echo 1)"
cek "CSS produksi: .toko-wajib MERAH"        "$([ -n "${WAJIB:-}" ] && echo 0 || echo 1)"
cek "CSS produksi: kotak merah kolom kurang" "$([ -n "${KURANG:-}" ] && echo 0 || echo 1)"
echo "         bukti CSS: ${PUTIH:-tidak ada}"
echo "         bukti CSS: ${WAJIB:-tidak ada}"

echo
echo "=============================================================="
echo " HASIL PRODUKSI: $LULUS LULUS / $GAGAL GAGAL"
echo "=============================================================="
[ "$GAGAL" -eq 0 ]
