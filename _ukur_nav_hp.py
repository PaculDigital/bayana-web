"""UKUR lebar NYATA menu atas pada beberapa lebar layar HP.

Alasan: potret bisa menipu (dan Wulan tidak boleh percaya potret saja).
Yang diukur di sini:
  * lebar tiap elemen menu (merek, katalog, pesanan saya, tombol, keranjang)
  * apakah TOTAL-nya melebihi lebar layar (kalau ya → ADA yang terpotong)
  * apakah halaman bisa digeser ke samping (bukti aturan lama tidak rusak)
"""
import json
import subprocess
import time
import urllib.request

CDP = "http://127.0.0.1:9333"
DASAR = "http://127.0.0.1:3200/buku"

# Ukur lebar elemen lewat JavaScript di dalam halaman.
JS = """
(() => {
  const nav = document.querySelector('.toko-nav-dalam');
  if (!nav) return JSON.stringify({galat: 'menu tidak ditemukan'});
  const ambil = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {kiri: Math.round(r.left), kanan: Math.round(r.right),
            lebar: Math.round(r.width)};
  };
  const isi = nav.getBoundingClientRect();
  const hasil = {
    layar: window.innerWidth,
    menuKiri: Math.round(isi.left),
    menuKanan: Math.round(isi.right),
    merek: ambil('.toko-merek'),
    katalog: ambil('.toko-menu a.teks'),
    tombolCek: ambil('.toko-cek-pesanan'),
    tulisan: (document.querySelector('.toko-cek-pesanan span') || {}).textContent,
    keranjang: ambil('.toko-keranjang'),
    geserSamping: document.documentElement.scrollWidth - window.innerWidth,
  };
  return JSON.stringify(hasil);
})()
"""


def tab_baru(url):
    r = urllib.request.Request(
        f"{CDP}/json/new?{url}", method="PUT")
    with urllib.request.urlopen(r, timeout=20) as f:
        return json.load(f)


def kirim(ws_url, ekspresi, timeout=25):
    """Kirim Runtime.evaluate lewat websocket sederhana (tanpa pustaka luar)."""
    import base64
    import hashlib
    import os
    import socket
    import struct

    u = ws_url.split("://", 1)[1]
    host, sisa = u.split("/", 1)
    nama_host, port = host.split(":")
    s = socket.create_connection((nama_host, int(port)), timeout=timeout)
    kunci = base64.b64encode(os.urandom(16)).decode()
    s.sendall((
        f"GET /{sisa} HTTP/1.1\r\nHost: {host}\r\nUpgrade: websocket\r\n"
        f"Connection: Upgrade\r\nSec-WebSocket-Key: {kunci}\r\n"
        f"Sec-WebSocket-Version: 13\r\n\r\n"
    ).encode())
    s.recv(4096)  # abaikan jabat tangan

    def bingkai(data):
        muat = data.encode()
        mask = os.urandom(4)
        kepala = bytearray([0x81])
        n = len(muat)
        if n < 126:
            kepala.append(0x80 | n)
        elif n < 65536:
            kepala.append(0x80 | 126)
            kepala += struct.pack(">H", n)
        else:
            kepala.append(0x80 | 127)
            kepala += struct.pack(">Q", n)
        kepala += mask
        return bytes(kepala) + bytes(b ^ mask[i % 4] for i, b in enumerate(muat))

    pesan = json.dumps({
        "id": 1, "method": "Runtime.evaluate",
        "params": {"expression": ekspresi, "returnByValue": True},
    })
    s.sendall(bingkai(pesan))

    kumpul = b""
    akhir = time.time() + timeout
    while time.time() < akhir:
        try:
            potong = s.recv(65536)
        except Exception:
            break
        if not potong:
            break
        kumpul += potong
        if b'"id":1' in kumpul or b'"id": 1' in kumpul:
            # baca panjangnya dulu
            if len(kumpul) > 2:
                pj = kumpul[1] & 0x7F
                if pj == 126:
                    if len(kumpul) < 4:
                        continue
                    pj = struct.unpack(">H", kumpul[2:4])[0]
                    isi = kumpul[4:]
                elif pj == 127:
                    if len(kumpul) < 10:
                        continue
                    pj = struct.unpack(">Q", kumpul[2:10])[0]
                    isi = kumpul[10:]
                else:
                    isi = kumpul[2:]
                if len(isi) >= pj:
                    break
    s.close()
    mula = kumpul.find(b"{")
    if mula < 0:
        return None
    try:
        return json.loads(kumpul[mula:].decode("utf-8", "replace"))
    except Exception:
        return None


def main():
    print("=" * 62)
    print(" UKUR LEBAR MENU ATAS — beberapa lebar layar HP")
    print("=" * 62)

    for lebar in (320, 360, 390, 414, 480, 640):
        # Setel lebar viewport lewat CDP
        t = tab_baru(DASAR)
        ws = t.get("webSocketDebuggerUrl")
        if not ws:
            print(f"  {lebar}px → gagal buka tab")
            continue
        try:
            kirim(ws, "1")  # pancing
            kirim(ws, f"window.resizeTo({lebar}, 700)")
            hasil = kirim(ws, JS)
            nilai = (hasil or {}).get("result", {}).get("result", {}).get("value")
            if nilai:
                d = json.loads(nilai)
                tc = d.get("tombolCek") or {}
                kr = d.get("keranjang") or {}
                print(f"\n  ── layar {lebar}px (nyata {d.get('layar')}px) ──")
                print(f"     tombol 'Cek Pesanan': lebar {tc.get('lebar')}px, "
                      f"ujung kanan {tc.get('kanan')}px, tulisan: {d.get('tulisan')!r}")
                print(f"     keranjang: ujung kanan {kr.get('kanan')}px")
                print(f"     geser samping: {d.get('geserSamping')}px (harus 0)")
            else:
                print(f"  {lebar}px → tidak terbaca")
        except Exception as e:
            print(f"  {lebar}px → galat: {e}")


if __name__ == "__main__":
    main()
