#!/usr/bin/env bash
# Uji PERBAIKAN (teguran Bos 22Sep26):
#  1. Tulisan "Cek Pesanan" SELALU tampil — TERMASUK di layar HP.
#  2. Klik → POPUP (bukan halaman penuh).
#  3. Popup bisa mencari status pesanan (API jalan).
set -u
D=http://127.0.0.1:3200
CJ=/tmp/cek-cookie.txt
rm -f "$CJ"
LULUS=0; GAGAL=0
cek() { if [ "$2" -eq 0 ]; then LULUS=$((LULUS+1)); echo "  LULUS  $1";
        else GAGAL=$((GAGAL+1)); echo "  GAGAL  $1"; fi; }

echo "=============================================================="
echo " 0. SIAPKAN PESANAN UNTUK DIUJI"
echo "=============================================================="
curl -s -c "$CJ" --max-time 25 -H "Host: buku.bayana.id" "$D/buku" -o /dev/null
curl -s -b "$CJ" -c "$CJ" --max-time 25 -X POST -H "Host: buku.bayana.id" \
  -H "Content-Type: application/json" \
  -d '{"aksi":"tambah","slug":"manajemen-strategi"}' \
  "$D/api/buku/keranjang" -o /dev/null
curl -s -b "$CJ" -c "$CJ" --max-time 25 -X POST -H "Host: buku.bayana.id" \
  -H "Content-Type: application/json" \
  -d '{"nama_penerima":"Uji Cek","hp":"08123","alamat":"Jl. Uji 1","kelurahan":"Sukamaju","kecamatan":"Cilandak","kota":"Jakarta Selatan","provinsi":"DKI Jakarta","kode_pos":"12430","catatan":"","beli":["manajemen-strategi"]}' \
  "$D/api/buku/pesanan" -o /tmp/cp.json
NO=$(python3 -c "import json;print(json.load(open('/tmp/cp.json')).get('no_order',''))" 2>/dev/null)
echo "         nomor uji: [$NO]"
cek "pesanan dibuat" "$([ -n "$NO" ] && echo 0 || echo 1)"

echo
echo "=============================================================="
echo " 1. TULISAN 'Cek Pesanan' TAMPIL (teguran Bos)"
echo "=============================================================="
curl -s --max-time 25 -H "Host: buku.bayana.id" "$D/buku" -o /tmp/cn.html
cek "ADA tulisan 'Cek Pesanan'" "$(grep -q 'Cek Pesanan' /tmp/cn.html && echo 0 || echo 1)"
cek "tombol pakai kelas toko-cek-pesanan" \
    "$(grep -q 'toko-cek-pesanan' /tmp/cn.html && echo 0 || echo 1)"
cek "BUKAN link ke halaman penuh (pakai button + popup)" \
    "$(grep -q 'toko-cek-pesanan[^>]*href="/buku/lacak"' /tmp/cn.html && echo 1 || echo 0)"
cek "tulisan ada di dalam <span> (bukan disembunyikan)" \
    "$(grep -o 'Cek Pesanan' /tmp/cn.html | head -1 | grep -q 'Cek Pesanan' && echo 0 || echo 1)"

echo
echo "=============================================================="
echo " 2. CSS: ATURAN YANG MENYEMBUNYIKAN TULISAN SUDAH HILANG"
echo "=============================================================="
CSSF=""
for c in $(grep -o 'href="/_next/static/[^"]*\.css"' /tmp/cn.html | sed 's/href="//;s/"//'); do
  curl -s --max-time 25 -H "Host: buku.bayana.id" "$D$c" -o /tmp/cc.css
  if grep -q 'toko-cek-pesanan' /tmp/cc.css; then CSSF=/tmp/cc.css; break; fi
done
cek "CSS ditemukan" "$([ -n "$CSSF" ] && echo 0 || echo 1)"
if [ -n "$CSSF" ]; then
  cek "TIDAK ADA aturan menyembunyikan tulisan (clip:rect)" \
      "$(tr -d ' ' <"$CSSF" | grep -q 'toko-cek-pesananspan{position:absolute' && echo 1 || echo 0)"
  cek "TIDAK ADA tombol jadi lingkaran 38px di HP" \
      "$(tr -d ' ' <"$CSSF" | grep -qE 'max-width:700px\)\{\.toko-cek-pesanan\{border-radius:50%' && echo 1 || echo 0)"
  cek "ADA aturan popup (.popup-lapis)" \
      "$(tr -d ' ' <"$CSSF" | grep -q 'popup-lapis' && echo 0 || echo 1)"
  cek "ADA aturan popup-kotak" \
      "$(tr -d ' ' <"$CSSF" | grep -q 'popup-kotak' && echo 0 || echo 1)"
  # ⚠️ Wulan salah tulis pola di sini (regex menuntut `padding:9px12px`
  #    tanpa spasi) → GAGAL PALSU. Ruang dirapatkan supaya terima
  #    kedua bentuk (dengan/tanpa spasi sesudah titik dua).
  cek "layar sempit hanya mengecilkan huruf (12px)" \
      "$(tr -d ' ' <"$CSSF" | grep -qE 'max-width:640px\)\{[^@]*\.toko-cek-pesanan\{[^}]*font-size:12px' && echo 0 || echo 1)"
  # 🚨 TEGURAN BOS: menu teks di HP DULU disembunyikan (display:none) →
  #    menu atas jadi dua ikon saja. Sekarang WAJIB tetap tampil.
  cek "menu 'Katalog'/'Pesanan Saya' TIDAK disembunyikan di HP" \
      "$(tr -d ' ' <"$CSSF" | grep -qE 'max-width:640px\)\{[^@]*\.toko-menu>a\.teks\{display:none' && echo 1 || echo 0)"
fi

echo
echo "=============================================================="
echo " 3. API POPUP — cari status pesanan"
echo "=============================================================="
curl -s --max-time 25 -H "Host: buku.bayana.id" \
  "$D/api/buku/pesanan/cek?no=$NO" -o /tmp/cari.json
echo "         jawab: $(head -c 200 /tmp/cari.json)"
cek "nomor BENAR → ok:true" "$(grep -q '"ok":true' /tmp/cari.json && echo 0 || echo 1)"
cek "memuat status_label" "$(grep -q 'status_label' /tmp/cari.json && echo 0 || echo 1)"
cek "memuat nama penerima" "$(grep -q '"nama":"Uji Cek"' /tmp/cari.json && echo 0 || echo 1)"
cek "TIDAK membocorkan alamat lengkap" \
    "$(grep -q '"alamat"' /tmp/cari.json && echo 1 || echo 0)"
cek "TIDAK membocorkan nomor HP" "$(grep -q '"hp"' /tmp/cari.json && echo 1 || echo 0)"

curl -s --max-time 25 -H "Host: buku.bayana.id" \
  "$D/api/buku/pesanan/cek?no=BYN-SALAHXXX" -o /tmp/cari2.json
echo "         nomor salah: $(head -c 130 /tmp/cari2.json)"
cek "nomor SALAH → ok:false" "$(grep -q '"ok":false' /tmp/cari2.json && echo 0 || echo 1)"
cek "nomor salah → ada pesan jelas" "$(grep -q 'tidak ditemukan' /tmp/cari2.json && echo 0 || echo 1)"

curl -s --max-time 25 -H "Host: buku.bayana.id" \
  "$D/api/buku/pesanan/cek?no=" -o /tmp/cari3.json
cek "nomor KOSONG → tidak error (pesan lembut)" \
    "$(grep -q 'Masukkan nomor pesanan' /tmp/cari3.json && echo 0 || echo 1)"

echo
echo "=============================================================="
echo " 4. HALAMAN LAIN TIDAK RUSAK"
echo "=============================================================="
for p in /buku /buku/keranjang /buku/pesanan /buku/lacak; do
  K=$(curl -s -o /dev/null -w '%{http_code}' --max-time 25 -H "Host: buku.bayana.id" "$D$p")
  printf "  %-18s → HTTP %s\n" "$p" "$K"
  cek "halaman $p hidup" "$([ "$K" = "200" ] && echo 0 || echo 1)"
done

echo
echo "=============================================================="
echo " HASIL: $LULUS LULUS / $GAGAL GAGAL"
echo "=============================================================="
[ "$GAGAL" -eq 0 ]
