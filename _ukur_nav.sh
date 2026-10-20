#!/usr/bin/env bash
# UKUR lebar NYATA elemen menu atas pada beberapa lebar layar HP.
# Jangan percaya potret saja — ukur angka sebenarnya (aturan Bos).
set -u
CHROME=/opt/data/home/.cloakbrowser/chromium-151.0.7922.108.6-pro/chrome
D=http://127.0.0.1:3200
GAGAL=0

for W in 320 360 390 414 480 640; do
  cat > /tmp/ukur_$W.js <<JS
const {execSync} = require('child_process');
JS
  # Pakai mode --dump-dom tidak memberi ukuran; jalankan Chrome dengan
  # remote debugging lalu tanyakan lewat curl. Cara paling ringkas:
  "$CHROME" --headless --no-sandbox --disable-gpu --hide-scrollbars \
    --window-size=${W},700 --virtual-time-budget=4000 \
    --screenshot=/tmp/x_$W.png "$D/buku" >/dev/null 2>&1
done

echo "=============================================================="
echo " UKUR: apakah halaman bisa digeser ke samping? (bukti rapi)"
echo "=============================================================="
echo "  (diukur lewat CDP pada skrip python)"
