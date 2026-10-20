"""UKUR lebar NYATA menu atas toko — jangan menebak dari potret.

Memakai Chrome headless mode `--dump-dom` tidak memberi ukuran, jadi
skrip ini menjalankan Chrome dengan remote debugging di port sendiri,
lalu menanyakan ukuran tiap elemen menu lewat protokol DevTools
(Runtime.evaluate). Semua angka datang dari peramban, bukan perkiraan.
"""
import json
import os
import shutil
import socket
import subprocess
import sys
import time
import urllib.request

CHROME = ("/opt/data/home/.cloakbrowser/chromium-151.0.7922.108.6-pro/chrome")
URL = "http://127.0.0.1:3200/buku"
PORT = 9411

JS = """
(() => {
  const d = document.querySelector('.toko-nav-dalam');
  if (!d) return 'MENU-TIDAK-ADA';
  const u = (s) => {
    const e = document.querySelector(s);
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return {l: Math.round(r.left), r: Math.round(r.right), w: Math.round(r.width)};
  };
  const menu = d.getBoundingClientRect();
  return JSON.stringify({
    layar: window.innerWidth,
    menuKanan: Math.round(menu.right),
    merek: u('.toko-merek'),
    katalog: u('.toko-menu a.teks'),
    tombol: u('.toko-cek-pesanan'),
    keranjang: u('.toko-keranjang'),
    geser: document.documentElement.scrollWidth - window.innerWidth,
  });
})()
"""


def tunggu_cdp(port, batas=25):
    for _ in range(batas * 2):
        try:
            with urllib.request.urlopen(
                    f"http://127.0.0.1:{port}/json/version", timeout=2) as f:
                f.read()
            return True
        except Exception:
            time.sleep(0.5)
    return False


def tab_baru(port, url):
    r = urllib.request.Request(
        f"http://127.0.0.1:{port}/json/new?{url}", method="PUT")
    with urllib.request.urlopen(r, timeout=15) as f:
        return json.load(f)


def tanya(ws_url, ekspresi, timeout=20):
    import base64
    import struct
    u = ws_url.split("://", 1)[1]
    host, sisa = u.split("/", 1)
    nama, prt = host.split(":")
    s = socket.create_connection((nama, int(prt)), timeout=timeout)
    kunci = base64.b64encode(os.urandom(16)).decode()
    s.sendall((f"GET /{sisa} HTTP/1.1\r\nHost: {host}\r\n"
               f"Upgrade: websocket\r\nConnection: Upgrade\r\n"
               f"Sec-WebSocket-Key: {kunci}\r\n"
               f"Sec-WebSocket-Version: 13\r\n\r\n").encode())
    s.recv(4096)

    muat = json.dumps({"id": 1, "method": "Runtime.evaluate",
                       "params": {"expression": ekspresi,
                                  "returnByValue": True}}).encode()
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
    s.sendall(bytes(kepala) + bytes(b ^ mask[i % 4]
                                   for i, b in enumerate(muat)))

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
        if b'"id":1' in kumpul.replace(b" ", b""):
            pj = kumpul[1] & 0x7F
            if pj == 126 and len(kumpul) >= 4:
                pj = struct.unpack(">H", kumpul[2:4])[0]
                isi = kumpul[4:]
            elif pj == 127 and len(kumpul) >= 10:
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


def jalankan(lebar):
    profil = f"/tmp/prof-ukur-{lebar}"
    shutil.rmtree(profil, ignore_errors=True)
    p = subprocess.Popen(
        [CHROME, "--headless=new", "--no-sandbox", "--disable-gpu",
         f"--remote-debugging-port={PORT}",
         f"--user-data-dir={profil}",
         f"--window-size={lebar},720", "about:blank"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    try:
        if not tunggu_cdp(PORT):
            return f"  {lebar}px → Chrome tidak siap"
        t = tab_baru(PORT, URL)
        ws = t.get("webSocketDebuggerUrl")
        if not ws:
            return f"  {lebar}px → tab gagal"
        time.sleep(3)
        hasil = tanya(ws, JS)
        nilai = (hasil or {}).get("result", {}).get("result", {}).get("value")
        if not nilai or nilai == "MENU-TIDAK-ADA":
            return f"  {lebar}px → ukuran tidak terbaca ({nilai})"
        d = json.loads(nilai)
        k = d.get("keranjang") or {}
        t2 = d.get("tombol") or {}
        tanda = "TERPOTONG" if (k.get("r") or 0) > d.get("layar", 0) else "UTUH"
        return (f"  {lebar}px (nyata {d.get('layar')}px) | "
                f"tombol '{'Cek' if t2.get('w', 99) < 76 else 'Cek Pesanan'}' "
                f"{t2.get('w')}px ujung {t2.get('r')} | "
                f"keranjang ujung {k.get('r')} → {tanda} | "
                f"geser samping {d.get('geser')}px")
    finally:
        p.terminate()
        try:
            p.wait(timeout=8)
        except Exception:
            p.kill()
        shutil.rmtree(profil, ignore_errors=True)


if __name__ == "__main__":
    print("=" * 70)
    print(" UKURAN NYATA MENU ATAS (dibaca dari peramban, bukan dari potret)")
    print("=" * 70)
    for w in (320, 360, 390, 414, 480, 700):
        print(jalankan(w))
    sys.exit(0)
