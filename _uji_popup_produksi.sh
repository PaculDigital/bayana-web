#!/usr/bin/env bash
# Uji PRODUKSI + potret HP (teguran Bos 22Sep26: menu HP).
set -u
D=https://buku.bayana.id
CHROME=/opt/data/home/.cloakbrowser/chromium-151.0.7922.108.6-pro/chrome
LULUS=0; GAGAL=0
cek() { if [ "$2" -eq 0 ]; then LULUS=$((LULUS+1)); echo "  LULUS  $1";
        else GAGAL=$((GAGAL+1)); echo "  GAGAL  $1"; fi; }

echo "=============================================================="
echo " 1. MENU ATAS DI PRODUKSI"
echo "=============================================================="
curl -s --max-time 30 "$D/buku" -o /tmp/pp.html
cek "ADA tulisan 'Cek Pesanan'" "$(grep -q 'Cek Pesanan' /tmp/pp.html && echo 0 || echo 1)"
cek "ADA tautan 'Katalog'" "$(grep -q 'Katalog' /tmp/pp.html && echo 0 || echo 1)"
cek "ADA tautan 'Pesanan Saya'" "$(grep -q 'Pesanan Saya' /tmp/pp.html && echo 0 || echo 1)"
cek "tombol BUKAN link halaman penuh" \
    "$(grep -q 'toko-cek-pesanan[^>]*href=' /tmp/pp.html && echo 1 || echo 0)"

echo
echo "=============================================================="
echo " 2. CSS PRODUKSI — aturan perusak HARUS hilang"
echo "=============================================================="
CSSF=""
for c in $(grep -o 'href="/_next/static/[^"]*\.css"' /tmp/pp.html | sed 's/href="//;s/"//'); do
  curl -s --max-time 25 "$D$c" -o /tmp/pc.css
  if grep -q 'toko-cek-pesanan' /tmp/pc.css; then CSSF=/tmp/pc.css; break; fi
done
cek "CSS produksi ditemukan" "$([ -n "$CSSF" ] && echo 0 || echo 1)"
if [ -n "$CSSF" ]; then
  P=$(tr -d ' ' <"$CSSF")
  N=$(printf '%s' "$P" | grep -oE '\.toko-menu>a\.teks\{display:none' | wc -l)
  echo "         aturan sembunyikan menu teks: $N (harus 0)"
  cek "menu teks TIDAK disembunyikan" "$([ "$N" -eq 0 ] && echo 0 || echo 1)"
  N2=$(printf '%s' "$P" | grep -oE 'toko-cek-pesananspan\{position:absolute' | wc -l)
  echo "         aturan sembunyikan tulisan tombol: $N2 (harus 0)"
  cek "tulisan tombol TIDAK disembunyikan" "$([ "$N2" -eq 0 ] && echo 0 || echo 1)"
  cek "ADA aturan popup" "$(printf '%s' "$P" | grep -q 'popup-lapis' && echo 0 || echo 1)"
  cek "warna soft orange Opsi B" \
      "$(printf '%s' "$P" | grep -q 'oranye-lembut:#f5a95c' && echo 0 || echo 1)"
fi

echo
echo "=============================================================="
echo " 3. API POPUP DI PRODUKSI"
echo "=============================================================="
CJ=/tmp/prod-pop.txt; rm -f "$CJ"
curl -s -c "$CJ" --max-time 30 "$D/buku" -o /dev/null
curl -s -b "$CJ" -c "$CJ" --max-time 30 -X POST -H "Content-Type: application/json" \
  -d '{"aksi":"tambah","slug":"manajemen-strategi"}' "$D/api/buku/keranjang" -o /dev/null
curl -s -b "$CJ" -c "$CJ" --max-time 30 -X POST -H "Content-Type: application/json" \
  -d '{"nama_penerima":"Uji Popup","hp":"0812","alamat":"Jl. Uji","kelurahan":"Sukamaju","kecamatan":"Cilandak","kota":"Jakarta Selatan","provinsi":"DKI Jakarta","kode_pos":"12430","catatan":"","beli":["manajemen-strategi"]}' \
  "$D/api/buku/pesanan" -o /tmp/prod-pop.json
NO=$(python3 -c "import json;print(json.load(open('/tmp/prod-pop.json')).get('no_order',''))" 2>/dev/null)
echo "         nomor: [$NO]"
cek "pesanan dibuat di produksi" "$([ -n "$NO" ] && echo 0 || echo 1)"
curl -s --max-time 30 "$D/api/buku/pesanan/cek?no=$NO" -o /tmp/prod-cari.json
echo "         jawab: $(head -c 150 /tmp/prod-cari.json)"
cek "API popup menjawab ok:true" "$(grep -q '"ok":true' /tmp/prod-cari.json && echo 0 || echo 1)"
cek "API popup TIDAK bocorkan alamat" \
    "$(grep -q '"alamat"' /tmp/prod-cari.json && echo 1 || echo 0)"

echo
echo "=============================================================="
echo " 4. POTRET HP 390px DARI PRODUKSI (untuk dilihat mata)"
echo "=============================================================="
mkdir -p _potret
"$CHROME" --headless --no-sandbox --disable-gpu --hide-scrollbars \
  --window-size=390,880 --screenshot=_potret/prod_nav_hp.png "$D/buku" 2>/dev/null
if [ -s _potret/prod_nav_hp.png ]; then
  echo "         _potret/prod_nav_hp.png — $(wc -c <_potret/prod_nav_hp.png) byte"
  cek "potret HP jadi" "$(echo 0)"
else
  cek "potret HP jadi" "$(echo 1)"
fi

echo
echo "=============================================================="
echo " HASIL PRODUKSI: $LULUS LULUS / $GAGAL GAGAL"
echo "=============================================================="
[ "$GAGAL" -eq 0 ]
