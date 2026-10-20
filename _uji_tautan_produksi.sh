#!/usr/bin/env bash
# Uji PRODUKSI no 1 & 2 (permintaan Bos 22Sep26).
set -u
LULUS=0; GAGAL=0
cek() { if [ "$2" -eq 0 ]; then LULUS=$((LULUS+1)); echo "  LULUS  $1";
        else GAGAL=$((GAGAL+1)); echo "  GAGAL  $1"; fi; }

echo "=============================================================="
echo " 1. GALERI bayana.id → klik ke buku.bayana.id"
echo "=============================================================="
curl -s --max-time 30 https://bayana.id/ -o /tmp/pr1.html
JML=$(grep -o 'https://buku\.bayana\.id/buku/' /tmp/pr1.html | wc -l)
echo "         tautan ke toko: $JML"
cek "ADA tautan ke buku.bayana.id" "$([ "$JML" -gt 10 ] && echo 0 || echo 1)"
cek "TIDAK ada tautan lama href=\"/buku/" \
    "$(grep -q 'href="/buku/' /tmp/pr1.html && echo 1 || echo 0)"
echo "         contoh: $(grep -o 'https://buku\.bayana\.id/buku/[a-z-]*' /tmp/pr1.html | head -2 | tr '\n' ' ')"
cek "galeri marquee masih utuh" "$(grep -q 'book-gallery-track' /tmp/pr1.html && echo 0 || echo 1)"
cek "harga masih tampil" "$(grep -q 'Rp[0-9]' /tmp/pr1.html && echo 0 || echo 1)"

echo
echo "=============================================================="
echo " 2. TOMBOL 'Beli Buku' di navbar bayana.id"
echo "=============================================================="
cek "ADA tombol 'Beli Buku'" "$(grep -q 'Beli Buku' /tmp/pr1.html && echo 0 || echo 1)"
cek "tombol menunjuk ke toko" \
    "$(grep -o 'href="https://buku\.bayana\.id"' /tmp/pr1.html | head -1 | grep -q buku.bayana.id && echo 0 || echo 1)"
cek "tombol 'Terbitkan Buku' TIDAK hilang" \
    "$(grep -q 'Terbitkan Buku' /tmp/pr1.html && echo 0 || echo 1)"
echo "         jumlah tautan ke toko di beranda: $(grep -o 'https://buku\.bayana\.id' /tmp/pr1.html | wc -l)"

echo
echo "=============================================================="
echo " 3. TOKO masih sehat (tidak rusak)"
echo "=============================================================="
curl -s -o /dev/null -w "  toko /buku → HTTP %{http_code}\n" --max-time 30 https://buku.bayana.id/buku
# ⚠️ Permintaan jaringan sesaat bisa mengembalikan jawaban KOSONG (bukan
#    berarti app rusak). Karena itu dicoba beberapa kali sebelum dinilai —
#    supaya uji tidak GAGAL PALSU karena gangguan sementara.
KODE_TOKO=""
for coba in 1 2 3; do
  KODE_TOKO=$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 https://buku.bayana.id/buku)
  [ "$KODE_TOKO" = "200" ] && break
  sleep 2
done
echo "  kode akhir toko: $KODE_TOKO (setelah $coba percobaan)"
cek "katalog toko 200" "$([ "$KODE_TOKO" = "200" ] && echo 0 || echo 1)"

KODE_HOME=""
for coba in 1 2 3; do
  KODE_HOME=$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 https://bayana.id/)
  [ "$KODE_HOME" = "200" ] && break
  sleep 2
done
cek "beranda penerbit 200" "$([ "$KODE_HOME" = "200" ] && echo 0 || echo 1)"

echo
echo "=============================================================="
echo " HASIL PRODUKSI: $LULUS LULUS / $GAGAL GAGAL"
echo "=============================================================="
[ "$GAGAL" -eq 0 ]
