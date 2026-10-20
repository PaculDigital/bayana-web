#!/usr/bin/env bash
# Uji no 1 & 2 (permintaan Bos 22Sep26):
#   1. Tombol "Salin nomor" + nomor BESAR di halaman bayar
#   2. Tombol "Simpan bukti pesanan" (berkas dokumentasi)
#   + Warna SOFT ORANGE Opsi B (orange muda + tulisan coklat tua)
set -u
D=http://127.0.0.1:3200
CJ=/tmp/uji-bukti-cookie.txt
rm -f "$CJ"
LULUS=0; GAGAL=0
cek() { if [ "$2" -eq 0 ]; then LULUS=$((LULUS+1)); echo "  LULUS  $1";
        else GAGAL=$((GAGAL+1)); echo "  GAGAL  $1"; fi; }

echo "=============================================================="
echo " 0. SIAPKAN PESANAN SUNGGUHAN (masuk keranjang → buat pesanan)"
echo "=============================================================="
curl -s -c "$CJ" --max-time 25 -H "Host: buku.bayana.id" "$D/buku" -o /dev/null
curl -s -b "$CJ" -c "$CJ" --max-time 25 -X POST -H "Host: buku.bayana.id" \
  -H "Content-Type: application/json" \
  -d '{"aksi":"tambah","slug":"manajemen-strategi"}' \
  "$D/api/buku/keranjang" -o /tmp/k.json
echo "         keranjang: $(cat /tmp/k.json)"

curl -s -b "$CJ" -c "$CJ" --max-time 25 -X POST -H "Host: buku.bayana.id" \
  -H "Content-Type: application/json" \
  -d '{"nama_penerima":"Budi Santoso","hp":"081234567890","alamat":"Jl. Merdeka No. 10 RT 02 RW 03","kelurahan":"Sukamaju","kecamatan":"Cilandak","kota":"Jakarta Selatan","provinsi":"DKI Jakarta","kode_pos":"12430","catatan":"","beli":["manajemen-strategi"]}' \
  "$D/api/buku/pesanan" -o /tmp/p.json
echo "         pesanan: $(head -c 160 /tmp/p.json)"
NO=$(python3 -c "import json;print(json.load(open('/tmp/p.json')).get('no_order',''))" 2>/dev/null)
echo "         nomor pesanan: [$NO]"
cek "pesanan berhasil dibuat" "$([ -n "$NO" ] && echo 0 || echo 1)"

echo
echo "=============================================================="
echo " 1. HALAMAN BAYAR — nomor BESAR + tombol Salin & Simpan"
echo "=============================================================="
curl -s -b "$CJ" --max-time 25 -H "Host: buku.bayana.id" \
  "$D/buku/bayar/$NO" -o /tmp/bayar.html
cek "halaman bayar terbuka" "$([ -s /tmp/bayar.html ] && echo 0 || echo 1)"
cek "ADA kartu bukti"        "$(grep -q 'kartu-bukti' /tmp/bayar.html && echo 0 || echo 1)"
cek "ADA tulisan 'NOMOR PESANAN KAMU'" \
    "$(grep -q 'NOMOR PESANAN KAMU' /tmp/bayar.html && echo 0 || echo 1)"
cek "nomor pesanan tampil di kartu" "$(grep -q "$NO" /tmp/bayar.html && echo 0 || echo 1)"
cek "ADA tombol 'Salin nomor'" \
    "$(grep -q 'Salin nomor' /tmp/bayar.html && echo 0 || echo 1)"
cek "ADA tombol 'Simpan bukti pesanan'" \
    "$(grep -q 'Simpan bukti pesanan' /tmp/bayar.html && echo 0 || echo 1)"
cek "ADA petunjuk cara cek nanti (buku.bayana.id)" \
    "$(grep -q 'Cek Pesanan' /tmp/bayar.html && echo 0 || echo 1)"
cek "nomor TIDAK lagi dari gaya lama (fontSize 22 inline)" \
    "$(grep -q 'font-size:22px' /tmp/bayar.html && echo 1 || echo 0)"

echo
echo "=============================================================="
echo " 2. WARNA SOFT ORANGE OPSI B (yang benar-benar dikirim)"
echo "=============================================================="
CSSF=""
for c in $(grep -o 'href="/_next/static/[^"]*\.css"' /tmp/bayar.html | sed 's/href="//;s/"//'); do
  curl -s --max-time 25 -H "Host: buku.bayana.id" "$D$c" -o /tmp/b.css
  if grep -q 'oranye-lembut' /tmp/b.css; then CSSF=/tmp/b.css; break; fi
done
cek "CSS ditemukan" "$([ -n "$CSSF" ] && echo 0 || echo 1)"
if [ -n "$CSSF" ]; then
  echo "         $(tr -d ' ' <"$CSSF" | grep -oE '\-\-oranye-lembut:#[0-9a-f]{6}' | head -1)"
  cek "tombol Cek Pesanan pakai orange muda #f5a95c" \
      "$(tr -d ' ' <"$CSSF" | grep -q 'oranye-lembut:#f5a95c' && echo 0 || echo 1)"
  cek "tulisan tombol coklat tua (bukan putih)" \
      "$(tr -d ' ' <"$CSSF" | grep -oE 'toko-cek-pesanan\{[^}]*\}' | head -1 | grep -q 'oranye-tulisan' && echo 0 || echo 1)"
  cek "nomor pesanan pakai clamp (menyesuaikan layar)" \
      "$(tr -d ' ' <"$CSSF" | grep -q 'kartu-bukti-no{.*clamp(' && echo 0 || echo 1)"
  cek "ukuran nomor minimal 26px" \
      "$(tr -d ' ' <"$CSSF" | grep -qE 'kartu-bukti-no\{[^}]*clamp\(26px' && echo 0 || echo 1)"
fi

echo
echo "=============================================================="
echo " 3. HALAMAN LAIN TIDAK RUSAK"
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
