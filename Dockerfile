# ── BAYANA WEB — container produksi (Next.js 16) ───────────────────────────
# Pola: build di dalam image, lalu jalankan via `next start`.
# Tahan-restart: dijalankan dengan `--restart unless-stopped`.
#
# ⚠️ CATATAN better-sqlite3 (perbaikan 22Sep26, Opsi A disetujui Bos):
#    better-sqlite3 adalah modul ASLI (native) → WAJIB di-compile
#    dengan node-gyp, yang butuh python3 + make + g++.
#    TERUKUR (bukan dugaan): baik `node:22-alpine` maupun `node:22-slim`
#    TIDAK punya ketiganya — dua kali deploy gagal di `npm ci` karenanya.
#    Wulan keliru mengira "slim" sudah memuat alat build. Pelajaran:
#    JANGAN menebak isi image dari namanya — UKUR dengan `which`.
#
#    Opsi A: pakai node:22-slim + pasang alat build lewat apt-get,
#    lalu BUANG lagi alatnya setelah build selesai (satu RUN) supaya
#    gambar akhirnya tidak membengkak 180MB.

FROM node:22-slim

WORKDIR /app

# ── dependency dulu (layer cache) ──
COPY package.json package-lock.json ./

# Alat build dipasang, dipakai, lalu DIHAPUS dalam satu langkah agar
# tidak ikut tersimpan di lapisan image.
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
 && npm ci --no-audit --no-fund \
 && npm cache clean --force \
 && apt-get purge -y --auto-remove python3 make g++ \
 && rm -rf /var/lib/apt/lists/*

# ── sumber + build ──
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── produksi ──
ENV NODE_ENV=production
ENV PORT=3021
ENV HOSTNAME=0.0.0.0
# Database SQLite disimpan di /app/data (dipasang volume saat jalan)
ENV BAYANA_DATA_DIR=/app/data
RUN mkdir -p /app/data
EXPOSE 3021

CMD ["npm", "run", "start"]
