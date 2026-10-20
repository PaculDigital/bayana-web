"""UKURAN SENDIRI: apakah teks penulis di cover menempel pita SAMPLE?

PELAJARAN 22Sep26: pemeriksa gambar bisa keliru (bilang "hijau bagus"
padahal tenggelam; bilang "masih menempel" padahal belum tentu).
⇒ untuk hal yang bisa DIUKUR, UKUR — jangan berdebat dari gambar.

Cara: pakai getBBox() pada <text> penulis dan <rect> pita SAMPLE
di dalam SVG yang sama. Kalau pita.top - (penulis.top + penulis.height)
>= 3px → TIDAK menempel.
"""
from __future__ import annotations

import base64
import json
import socket
import struct
import sys
import time
import urllib.request

PORT = 9333
URL = 'http://127.0.0.1:3200/buku/manajemen-strategi'

JS = """(()=>{
  const svg = document.querySelector('.detail-cover svg');
  if(!svg) return JSON.stringify({galat:'svg tidak ada'});
  const teks = [...svg.querySelectorAll('text')];
  const penulis = teks.find(t => (t.textContent||'').includes('Ahmad')
                                || (t.textContent||'').includes('Fauzi'));
  const pita = svg.querySelector('#pita-sample-cover');
  if(!penulis) return JSON.stringify({galat:'teks penulis tidak ditemukan'});
  if(!pita)    return JSON.stringify({galat:'pita sample tidak ditemukan'});

  // ⚠️ PENTING: pita ada di dalam <g transform="translate(...)">.
  //    getBBox() = koordinat LOKAL (belum termasuk translate).
  //    WAJIB pakai getBoundingClientRect() lalu ubah ke koordinat SVG,
  //    atau tambahkan translate-nya. Di sini pakai rect + skala SVG.
  const rSvg = svg.getBoundingClientRect();
  const skala = 190 / rSvg.width;              // viewBox 190 → lebar nyata
  const keSvg = (el) => {
    const r = el.getBoundingClientRect();
    return {atas:(r.top - rSvg.top) * skala,
            bawah:(r.bottom - rSvg.top) * skala};
  };
  const a = keSvg(penulis);
  const b = keSvg(pita);
  const jarak = b.atas - a.bawah;
  return JSON.stringify({
    penulis:{atas:+a.atas.toFixed(1), bawah:+a.bawah.toFixed(1)},
    pita   :{atas:+b.atas.toFixed(1), bawah:+b.bawah.toFixed(1)},
    jarak  :+jarak.toFixed(1),
    menempel: jarak < 3
  });})()"""


class Tab:
    def __init__(self) -> None:
        req = urllib.request.Request(
            f'http://127.0.0.1:{PORT}/json/new?about:blank', method='PUT')
        with urllib.request.urlopen(req, timeout=15) as f:
            d = json.load(f)
        self.tab_id = d['id']
        ws = d['webSocketDebuggerUrl'].replace('ws://', '')
        host, sisa = ws.split(':', 1)
        p, path = sisa.split('/', 1)
        self.sock = socket.create_connection((host, int(p)), timeout=30)
        k = base64.b64encode(b'wulan-ukur-jarak-1').decode()
        self.sock.sendall((f'GET /{path} HTTP/1.1\r\nHost: {host}:{p}\r\n'
                           f'Upgrade: websocket\r\nConnection: Upgrade\r\n'
                           f'Sec-WebSocket-Key: {k}\r\n'
                           f'Sec-WebSocket-Version: 13\r\n\r\n').encode())
        buf = b''
        while b'\r\n\r\n' not in buf:
            buf += self.sock.recv(4096)
        self.n = 0

    def _kirim(self, teks: str) -> None:
        data = teks.encode()
        p = len(data)
        if p < 126:
            hdr = struct.pack('!BB', 0x81, 0x80 | p)
        elif p < 65536:
            hdr = struct.pack('!BBH', 0x81, 0x80 | 126, p)
        else:
            hdr = struct.pack('!BBQ', 0x81, 0x80 | 127, p)
        self.sock.sendall(hdr + b'\x00\x00\x00\x00' + data)

    def _baca(self) -> dict:
        while True:
            if not self.sock.recv(1):
                raise ConnectionError('tutup')
            p = self.sock.recv(1)[0] & 0x7F
            if p == 126:
                p = struct.unpack('!H', self.sock.recv(2))[0]
            elif p == 127:
                p = struct.unpack('!Q', self.sock.recv(8))[0]
            isi = b''
            while len(isi) < p:
                isi += self.sock.recv(p - len(isi))
            m = json.loads(isi.decode('utf-8', 'replace'))
            if 'id' in m:
                return m

    def perintah(self, metode: str, **kw) -> dict:
        self.n += 1
        self._kirim(json.dumps({'id': self.n, 'method': metode,
                                'params': kw or {}}))
        while True:
            m = self._baca()
            if m.get('id') == self.n:
                return m.get('result') or m.get('error') or {}

    def js(self, e: str):
        r = self.perintah('Runtime.evaluate', expression=e,
                          returnByValue=True)
        return (r.get('result') or {}).get('value')

    def tutup(self) -> None:
        try:
            self.sock.close()
        finally:
            try:
                urllib.request.urlopen(
                    f'http://127.0.0.1:{PORT}/json/close/{self.tab_id}',
                    timeout=10).read()
            except Exception:
                pass


def main() -> int:
    t = Tab()
    try:
        t.perintah('Page.enable')
        t.perintah('Runtime.enable')
        t.perintah('Page.navigate', url=URL)
        time.sleep(5)
        hasil = t.js(JS)
        d = json.loads(hasil)
        print('── UKUR JARAK (koordinat di dalam SVG) ──')
        if 'galat' in d:
            print('GAGAL UKUR:', d['galat'])
            return 1
        print('teks penulis :', d['penulis'])
        print('pita SAMPLE  :', d['pita'])
        print('JARAK        :', d['jarak'], 'px')
        if d['menempel']:
            print('❌ MASIH MENEMPEL (jarak < 3px)')
            return 1
        print('✅ TIDAK MENEMPEL — ada jarak', d['jarak'], 'px')
        return 0
    finally:
        t.tutup()


if __name__ == '__main__':
    sys.exit(main())
