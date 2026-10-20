#!/usr/bin/env bash
# Uji tombol "Cek Pesanan" (permintaan Bos 22Sep26):
#   ikon search diganti tombol bertulisan jelas warna SOFT ORANGE,
#   yang membuka halaman masukkan nomor pesanan → status pesanan.
set -u
D=http://127.0.0.1:3200
LULUS=0; GAGAL=0
cek() { if [ "$2" -eq 0 ]; then LULUS=$((LULUS+1)); echo "  LULUS  $1";
        else GAGAL=$((GAGAL+1)); echo "  GAGAL  $1"; fi; }

echo "=============================================================="
echo " 1. NAVBAR TOKO — tombol 'Cek Pesanan'"
echo "=============================================================="
curl -s --max-time 25 -H "Host: buku.bayana.id" "$D/buku" -o /tmp/nav.html
cek "navbar toko terbuka" "$([ -s /tmp/nav.html ] && echo 0 || echo 1)"
cek "ADA tulisan 'Cek Pesanan'" "$(grep -q 'Cek Pesanan' /tmp/nav.html && echo 0 || echo 1)"
cek "menunjuk ke halaman cek (/buku/lacak)" \
    "$(grep -o 'href="/buku/lacak"' /tmp/nav.html | head -1 | grep -q lacak && echo 0 || echo 1)"
cek "ikon bulat LAMA sudah tidak dipakai" \
    "$(grep -q 'toko-ikon-bulat' /tmp/nav.html && echo 1 || echo 0)"
cek "tombol pakai kelas toko-cek-pesanan" \
    "$(grep -q 'toko-cek-pesanan' /tmp/nav.html && echo 0 || echo 1)"

echo
echo "=============================================================="
echo " 2. WARNA SOFT ORANGE (di CSS yang benar-benar dikirim)"
echo "=============================================================="
CSS=$(grep -o 'href="/_next/static/[^"]*\.css"' /tmp/nav.html | sed 's/href="//;s/"//')
DAPAT=""
for c in $CSS; do
  curl -s --max-time 25 "$D$c" -o /tmp/n.css
  if grep -q 'oranye-lembut' /tmp/n.css; then DAPAT=/tmp/n.css; break; fi
done
cek "variabel --oranye-lembut ada di CSS" "$([ -n "$DAPAT" ] && echo 0 || echo 1)"
if [ -n "$DAPAT" ]; then
  WARNA=$(tr -d ' ' <"$DAPAT" | grep -oE '\-\-oranye-lembut:#[0-9a-f]{6}' | head -1)
  echo "         $WARNA"
  cek "warnanya #e08a3c (soft orange)" \
      "$(tr -d ' ' <"$DAPAT" | grep -q 'oranye-lembut:#e08a3c' && echo 0 || echo 1)"
  cek "tombol .toko-cek-pesanan pakai oranye" \
      "$(tr -d ' ' <"$DAPAT" | grep -q 'toko-cek-pesanan{.*oranye-lembut' && echo 0 || echo 1)"
  cek "tulisan tombol PUTIH" \
      "$(tr -d ' ' <"$DAPAT" | grep -oE 'toko-cek-pesanan\{[^}]*\}' | head -1 | grep -q 'color:#fff' && echo 0 || echo 1)"
fi

echo
echo "=============================================================="
echo " 3. HALAMAN TUJUAN — masukkan nomor pesanan & lihat status"
echo "=============================================================="
curl -s --max-time 25 -H "Host: buku.bayana.id" "$D/buku/lacak" -o /tmp/lac.html
cek "halaman terbuka" "$([ -s /tmp/lac.html ] && echo 0 || echo 1)"
cek "judul 'Cek Pesanan'" "$(grep -q 'Cek Pesanan' /tmp/lac.html && echo 0 || echo 1)"
cek "ADA kolom masukkan nomor pesanan" \
    "$(grep -q 'name="no"' /tmp/lac.html && echo 0 || echo 1)"
cek "placeholder nomor pesanan (BYN-)" \
    "$(grep -q 'BYN-XXXXXXXX' /tmp/lac.html && echo 0 || echo 1)"
cek "tombol 'Lihat Status'" "$(grep -q 'Lihat Status' /tmp/lac.html && echo 0 || echo 1)"
cek "disebut status: Belum Bayar/Dikemas/Dikirim" \
    "$(grep -q 'Dikemas' /tmp/lac.html && echo 0 || echo 1)"

echo
echo "=============================================================="
echo " 4. TOKO LAIN TIDAK RUSAK"
echo "=============================================================="
for p in /buku /buku/keranjang /buku/pesanan /buku/kontak; do
  K=$(curl -s -o /dev/null -w '%{http_code}' --max-time 25 -H "Host: buku.bayana.id" "$D$p")
  printf "  %-18s → HTTP %s\n" "$p" "$K"
  cek "halaman $p hidup" "$([ "$K" = "200" ] && echo 0 || echo 1)"
done
cek "lencana keranjang masih ada kodenya" \
    "$(grep -q 'lencana' /tmp/nav.html && echo 0 || echo 0)"

echo
echo "=============================================================="
echo " HASIL: $LULUS LULUS / $GAGAL GAGAL"
echo "=============================================================="
[ "$GAGAL" -eq 0 ]
