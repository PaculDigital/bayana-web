#!/usr/bin/env bash
# Uji PRODUKSI (buku.bayana.id) — kartu bukti pesanan + warna Opsi B.
set -u
D=https://buku.bayana.id
CJ=/tmp/pr-cookie.txt
rm -f "$CJ"
LULUS=0; GAGAL=0
cek() { if [ "$2" -eq 0 ]; then LULUS=$((LULUS+1)); echo "  LULUS  $1";
        else GAGAL=$((GAGAL+1)); echo "  GAGAL  $1"; fi; }

echo "=============================================================="
echo " 0. BUAT PESANAN SUNGGUHAN DI PRODUKSI"
echo "=============================================================="
curl -s -c "$CJ" --max-time 30 "$D/buku" -o /dev/null
curl -s -b "$CJ" -c "$CJ" --max-time 30 -X POST -H "Content-Type: application/json" \
  -d '{"aksi":"tambah","slug":"manajemen-strategi"}' "$D/api/buku/keranjang" -o /tmp/pk.json
echo "         keranjang: $(head -c 120 /tmp/pk.json)"
curl -s -b "$CJ" -c "$CJ" --max-time 30 -X POST -H "Content-Type: application/json" \
  -d '{"nama_penerima":"Uji Wulan","hp":"08123456789","alamat":"Jl. Uji No. 1","kelurahan":"Sukamaju","kecamatan":"Cilandak","kota":"Jakarta Selatan","provinsi":"DKI Jakarta","kode_pos":"12430","catatan":"","beli":["manajemen-strategi"]}' \
  "$D/api/buku/pesanan" -o /tmp/pp.json
NO=$(python3 -c "import json;print(json.load(open('/tmp/pp.json')).get('no_order',''))" 2>/dev/null)
echo "         nomor pesanan: [$NO]"
cek "pesanan dibuat di produksi" "$([ -n "$NO" ] && echo 0 || echo 1)"

echo
echo "=============================================================="
echo " 1. HALAMAN BAYAR — nomor BESAR + Salin + Simpan bukti"
echo "=============================================================="
for i in 1 2 3; do
  curl -s -b "$CJ" --max-time 30 "$D/buku/bayar/$NO" -o /tmp/pb.html
  [ -s /tmp/pb.html ] && break
  sleep 2
done
cek "halaman bayar terbuka" "$([ -s /tmp/pb.html ] && echo 0 || echo 1)"
cek "ADA tulisan 'NOMOR PESANAN KAMU'" \
    "$(grep -q 'NOMOR PESANAN KAMU' /tmp/pb.html && echo 0 || echo 1)"
cek "nomor pesanan tampil BESAR" "$(grep -q "kartu-bukti-no" /tmp/pb.html && echo 0 || echo 1)"
cek "nomor pesanan benar ($NO)" "$(grep -q "$NO" /tmp/pb.html && echo 0 || echo 1)"
cek "ADA tombol 'Salin nomor'" \
    "$(grep -q 'Salin nomor' /tmp/pb.html && echo 0 || echo 1)"
cek "ADA tombol 'Simpan bukti pesanan'" \
    "$(grep -q 'Simpan bukti pesanan' /tmp/pb.html && echo 0 || echo 1)"

echo
echo "=============================================================="
echo " 2. WARNA SOFT ORANGE OPSI B di PRODUKSI"
echo "=============================================================="
CSSF=""
for c in $(grep -o 'href="/_next/static/[^"]*\.css"' /tmp/pb.html | sed 's/href="//;s/"//'); do
  curl -s --max-time 30 "$D$c" -o /tmp/pb.css
  if grep -q 'oranye-lembut' /tmp/pb.css; then CSSF=/tmp/pb.css; break; fi
done
cek "CSS produksi ditemukan" "$([ -n "$CSSF" ] && echo 0 || echo 1)"
if [ -n "$CSSF" ]; then
  W=$(tr -d ' ' <"$CSSF" | grep -oE '\-\-oranye-lembut:#[0-9a-f]{6}' | head -1)
  echo "         $W"
  cek "orange muda #f5a95c (Opsi B)" \
      "$(tr -d ' ' <"$CSSF" | grep -q 'oranye-lembut:#f5a95c' && echo 0 || echo 1)"
  cek "tulisan coklat tua (kontras 7:1)" \
      "$(tr -d ' ' <"$CSSF" | grep -q 'oranye-tulisan:#3a2a12' && echo 0 || echo 1)"
  N=$(tr -d ' ' <"$CSSF" | grep -oE 'kartu-bukti-no\{[^}]*font-size:clamp\([^)]*\)' | head -1)
  echo "         ukuran nomor: ${N:-tidak ditemukan}"
  cek "nomor pakai clamp(26px…40px)" \
      "$(tr -d ' ' <"$CSSF" | grep -qE 'kartu-bukti-no\{[^}]*clamp\(26px' && echo 0 || echo 1)"
fi

echo
echo "=============================================================="
echo " 3. TOMBOL 'CEK PESANAN' MASIH ADA + HALAMAN LAIN SEHAT"
echo "=============================================================="
curl -s --max-time 30 "$D/buku" -o /tmp/pn.html
cek "tombol 'Cek Pesanan' ada" "$(grep -q 'Cek Pesanan' /tmp/pn.html && echo 0 || echo 1)"
for p in /buku /buku/keranjang /buku/pesanan /buku/lacak; do
  K=""
  for i in 1 2 3; do
    K=$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 "$D$p")
    [ "$K" = "200" ] && break
    sleep 2
  done
  printf "  %-18s → HTTP %s\n" "$p" "$K"
  cek "halaman $p hidup" "$([ "$K" = "200" ] && echo 0 || echo 1)"
done

echo
echo "=============================================================="
echo " HASIL PRODUKSI: $LULUS LULUS / $GAGAL GAGAL"
echo "=============================================================="
[ "$GAGAL" -eq 0 ]
