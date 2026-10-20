#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# BAYANA WEB — deploy produksi (container Docker, tahan restart)
#
# KENAPA: sebelumnya web jalan DI DALAM container Hermes (port 3021) →
#         mati setiap Hermes restart → bayana.id jadi 502.
#         Dengan container sendiri + `--restart unless-stopped`,
#         web hidup lagi otomatis setelah VPS/Docker restart.
#
# PENTING: container WAJIB di jaringan bridge DEFAULT (bukan custom) —
#          cloudflared jalan di HOST, dan host hanya punya rute ke bridge
#          default (172.17.0.0/16). Lihat skill cloudflare-api pitfall.
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

NAMA=web-bayana
PORT=3021
DIR="/opt/data/services/bayana-web"
STAMP=$(date +%Y%m%d_%H%M%S)
# ⚠️ Database SQLite ditaruh DI LUAR container (perbaikan 22Sep26).
#    Di VPS ini /opt/data adalah titik pasang yang SAMA untuk Hermes dan
#    Docker, dan subfolder ini sudah pernah terbukti tembus (dipakai
#    _arsip/ dan image deploy). Nama subfolder SENGAJA tidak diawali
#    garis bawah supaya tidak dibersihkan oleh pembersih _arsip.
DATA_HOST="/opt/data/services/bayana-web/data-db"
IMAGE="web-bayana:${STAMP}-sot"

cd "$DIR"

echo "════════════════════════════════════════════════════════════════"
echo " BAYANA WEB — DEPLOY  ($STAMP)"
echo "════════════════════════════════════════════════════════════════"

# ── 1. Periksa sumber ada ────────────────────────────────────────────────
for f in package.json Dockerfile src/app/page.tsx; do
  [ -e "$f" ] || { echo "❌ sumber hilang: $f"; exit 1; }
done
echo "✅ sumber lengkap"

# ── 2. Backup .env kalau ada ─────────────────────────────────────────────
mkdir -p _arsip
if [ -f .env ]; then
  cp .env "_arsip/.env.${STAMP}.bak"
  echo "✅ backup .env"
fi

# ── 3. Simpan image lama sebagai titik mundur ────────────────────────────
if docker image inspect "$NAMA:cadangan-pra-sot" >/dev/null 2>&1; then
  echo "   (titik mundur lama sudah ada, ditimpa)"
fi
if docker ps -a --format '{{.Names}}' | grep -qx "$NAMA"; then
  docker commit "$NAMA" "$NAMA:cadangan-pra-sot" >/dev/null 2>&1 && \
    echo "✅ titik mundur: $NAMA:cadangan-pra-sot" || echo "⚠️  gagal commit titik mundur"
fi

# ── 4. Build ─────────────────────────────────────────────────────────────
echo "── build image ────────────────────────────────────────────────"
docker build -t "$IMAGE" . 2>&1 | tail -12

# ── 5. Verifikasi isi image (bukan asumsi) ───────────────────────────────
echo "── verifikasi isi image ───────────────────────────────────────"
docker run --rm --entrypoint sh "$IMAGE" -c \
  'test -f /app/src/app/page.tsx && echo "  ✅ sumber ada di image"' || {
    echo "  ❌ image tidak memuat sumber — BATAL"; exit 1; }
docker run --rm --entrypoint sh "$IMAGE" -c \
  'test -d /app/.next && echo "  ✅ hasil build ada di image"' || {
    echo "  ❌ image tanpa hasil build — BATAL"; exit 1; }

# ── 6. Ganti container ───────────────────────────────────────────────────
echo "── ganti container ────────────────────────────────────────────"

# ⚠️ DATABASE WAJIB DIPASANG DI VOLUME (perbaikan 22Sep26).
#    Tanpa ini, seluruh pesanan HILANG setiap kali deploy — karena
#    container lama dihapus (baris `docker rm -f` di bawah).
mkdir -p "$DATA_HOST"
echo "✅ folder database: $DATA_HOST → dipasang ke /app/data"

# ⚠️ Password admin TIDAK ditulis di kode (aturan Bos). Diambil dari
#    berkas _arsip/.admin.env yang TIDAK ikut masuk git.
ADMIN_ENV="$DIR/_arsip/.admin.env"
if [ -f "$ADMIN_ENV" ]; then
  echo "✅ password admin: dibaca dari _arsip/.admin.env"
  ENV_ADMIN="--env-file $ADMIN_ENV"
else
  echo "⚠️  _arsip/.admin.env TIDAK ADA → halaman admin TIDAK akan bisa dibuka."
  echo "    Buat dengan isi:  BAYANA_ADMIN_PASSWORD=password-pilihanmu"
  ENV_ADMIN=""
fi

# ⚠️ Kredensial SMTP untuk kirim email formulir kontak → _arsip/.mail.env
#    (mode 600, TIDAK ikut git, nilai TIDAK pernah ditulis di kode).
#    Tanpa berkas ini: pesan TETAP tersimpan di DB, hanya emailnya yang
#    belum terkirim — jadi deploy tetap aman.
MAIL_ENV="$DIR/_arsip/.mail.env"
if [ -f "$MAIL_ENV" ]; then
  echo "✅ SMTP email: dibaca dari _arsip/.mail.env"
  ENV_MAIL="--env-file $MAIL_ENV"
else
  echo "⚠️  _arsip/.mail.env TIDAK ADA → formulir kontak tersimpan di DB, email belum terkirim."
  ENV_MAIL=""
fi

docker rm -f "$NAMA" >/dev/null 2>&1 || true
docker run -d --name "$NAMA" \
  --restart unless-stopped \
  -p "127.0.0.1:${PORT}:${PORT}" \
  -v "${DATA_HOST}:/app/data" \
  $ENV_ADMIN \
  $ENV_MAIL \
  -e NODE_ENV=production \
  -e PORT="$PORT" \
  -e HOSTNAME=0.0.0.0 \
  -e BAYANA_DATA_DIR=/app/data \
  "$IMAGE" >/dev/null
echo "✅ container jalan: $NAMA (port $PORT, restart=unless-stopped, DB di volume)"

# ── 7. Cek sehat ─────────────────────────────────────────────────────────
echo "── cek sehat ──────────────────────────────────────────────────"
IP=$(docker inspect "$NAMA" --format '{{range .NetworkSettings.Networks}}{{.IPAddress}} {{end}}' | awk '{print $1}')
echo "   IP container: $IP"
SEHAT=0
for i in $(seq 1 20); do
  KODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "http://${IP}:${PORT}/" || echo 000)
  if [ "$KODE" = "200" ]; then SEHAT=1; break; fi
  sleep 2
done
if [ "$SEHAT" = "1" ]; then
  echo "   ✅ app balas HTTP 200 (setelah ${i}x cek)"
else
  echo "   ❌ app TIDAK balas 200 — periksa: docker logs $NAMA"
  docker logs "$NAMA" --tail 20
  exit 1
fi

# ── 8. Perbarui ingress Cloudflare ke IP container BARU ──────────────────
echo "── perbarui ingress Cloudflare ────────────────────────────────"
python3 - "$IP" "$PORT" <<'PYEOF'
import json, sys, urllib.request, urllib.error
IP, PORT = sys.argv[1], sys.argv[2]
# 30Sep26: localhost, BUKAN IP container — IP berubah tiap deploy dulu pernah bikin 502
# (semua layanan ingress lain juga sudah localhost). Cadangan: _arsip/ingress-cadangan.json
SVC = f'http://localhost:{PORT}'
d = json.load(open('/opt/data/vault/cloudflare.json'))
TOK = d['api_token']; ACC = d['account_id']
TUN = '8ae633d2-4726-47e1-aa5d-1d90fe13ffb1'
HOSTS = ('bayana.id', 'www.bayana.id', 'pub.bikinaja.id', 'buku.bayana.id')

def api(m, p, b=None, tout=30):
    dd = json.dumps(b).encode() if b else None
    req = urllib.request.Request(f'https://api.cloudflare.com/client/v4{p}', data=dd, method=m,
        headers={'Authorization': f'Bearer {TOK}', 'Content-Type': 'application/json'})
    try: return True, json.load(urllib.request.urlopen(req, timeout=tout))
    except urllib.error.HTTPError as e: return False, json.loads(e.read().decode())
    except Exception as e: return False, {'err': str(e)[:140]}

ok, cfg = api('GET', f'/accounts/{ACC}/cfd_tunnel/{TUN}/configurations')
if not ok:
    print('  ❌ gagal baca ingress:', json.dumps(cfg)[:200]); sys.exit(1)
ingress = cfg['result']['config']['ingress'][:]
ubah = []
for x in ingress:
    if x.get('hostname') in HOSTS and x.get('service') != SVC:
        x['service'] = SVC; ubah.append(x['hostname'])
if ubah:
    ok2, r2 = api('PUT', f'/accounts/{ACC}/cfd_tunnel/{TUN}/configurations',
                  {'config': {'ingress': ingress, 'warp-routing': {'enabled': False}}})
    print(('  ✅ ingress diperbarui: ' + ', '.join(ubah)) if ok2
          else ('  ❌ PUT gagal: ' + json.dumps(r2)[:200]))
else:
    print('  (ingress sudah menunjuk IP it,u tidak berubah)'.replace('it,u','itu'))
PYEOF

echo
echo "════════════════════════════════════════════════════════════════"
echo " SELESAI — image: $IMAGE"
echo " Uji publik:"
echo "   curl -s -o /dev/null -w '%{http_code}\\n' https://bayana.id/"
echo "════════════════════════════════════════════════════════════════"
