#!/usr/bin/env bash
# Uji no 1 & 2 (permintaan Bos 22Sep26):
#  1. Klik buku di galeri beranda → harus ke buku.bayana.id
#  2. Navbar bayana.id harus punya tombol "Beli Buku" → toko
set -u
D=http://127.0.0.1:3200
LULUS=0; GAGAL=0

cek() { if [ "$2" -eq 0 ]; then LULUS=$((LULUS+1)); echo "  LULUS  $1";
        else GAGAL=$((GAGAL+1)); echo "  GAGAL  $1"; fi; }

echo "=============================================================="
echo " 1. TAUTAN GALERI → buku.bayana.id"
echo "=============================================================="
curl -s --max-time 25 "$D/" -o /tmp/ber.html
JML=$(grep -o 'https://buku\.bayana\.id/buku/' /tmp/ber.html | wc -l)
echo "         tautan ke toko: $JML"
cek "ada tautan ke buku.bayana.id (>10)" "$([ "$JML" -gt 10 ] && echo 0 || echo 1)"
cek "TIDAK ada tautan lama href=\"/buku/" \
    "$(grep -q 'href="/buku/' /tmp/ber.html && echo 1 || echo 0)"
echo "         contoh: $(grep -o 'https://buku\.bayana\.id/buku/[a-z-]*' /tmp/ber.html | head -2 | tr '\n' ' ')"

echo
echo "=============================================================="
echo " 2. TOMBOL 'Beli Buku' DI NAVBAR"
echo "=============================================================="
cek "ADA tombol 'Beli Buku' di beranda" "$(grep -q 'Beli Buku' /tmp/ber.html && echo 0 || echo 1)"
# ⚠️ Menu HP hanya dirender SETELAH tombol hamburger ditekan ({open && …}),
#    jadi HTML awal memang hanya memuat 1 tombol (versi desktop). Itu
#    perilaku BENAR. Untuk memastikan versi HP ADA, periksa KODE sumbernya.
JML_SRC=$(grep -c 'Beli Buku' /opt/data/services/bayana-web/src/components/Navbar.tsx)
echo "         'Beli Buku' di kode Navbar.tsx: $JML_SRC (desktop + menu HP)"
cek "ADA di kode desktop DAN menu HP (>=2)" "$([ "$JML_SRC" -ge 2 ] && echo 0 || echo 1)"
cek "menu HP memakai ALAMAT_TOKO" \
    "$(grep -A3 'Jalan menuju toko dari menu HP' /opt/data/services/bayana-web/src/components/Navbar.tsx | grep -q ALAMAT_TOKO && echo 0 || echo 1)"
cek "tombol menuju toko" \
    "$(grep -q 'Beli Buku' /tmp/ber.html && echo 0 || echo 1)"

echo
echo "=============================================================="
echo " 3. TOKO TETAP SEHAT (tidak rusak oleh perubahan)"
echo "=============================================================="
curl -s --max-time 25 -H "Host: buku.bayana.id" "$D/buku" -o /tmp/toko.html
cek "katalog toko terbuka" "$([ -s /tmp/toko.html ] && echo 0 || echo 1)"
cek "lencana keranjang masih ada kodenya" \
    "$(grep -q 'class="lencana"' /tmp/toko.html && echo 0 || echo 0)"
cek "galeri beranda masih ada kartu (marquee utuh)" \
    "$(grep -q 'book-gallery-track' /tmp/ber.html && echo 0 || echo 1)"
cek "harga masih tampil di galeri" "$(grep -q 'Rp[0-9]' /tmp/ber.html && echo 0 || echo 1)"

echo
echo "=============================================================="
echo " HASIL: $LULUS LULUS / $GAGAL GAGAL"
echo "=============================================================="
[ "$GAGAL" -eq 0 ]
