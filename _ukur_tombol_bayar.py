"""UKUR posisi tombol 'Saya sudah bayar' di HP.

PELAJARAN 22Sep26: pemeriksa mata bilang tombol TERPOTONG. Wulan tidak
mau menebak — ukur sendiri: berapa tinggi halaman vs batas potret.
"""
from __future__ import annotations
import base64, glob, json, os, socket, sqlite3, struct, time
import urllib.request
from urllib.parse import urlparse

PORT = 9333


def tab():
    try:
        with urllib.request.urlopen(f'http://127.0.0.1:{PORT}/json/list',
                                    timeout=10) as r:
            for t in json.loads(r.read().decode()):
                if t.get('type') == 'page' and t.get('webSocketDebuggerUrl'):
                    return t
    except Exception:
        pass
    req = urllib.request.Request(
        f'http://127.0.0.1:{PORT}/json/new?about:blank', method='PUT')
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read().decode())


def ws(t):
    u = urlparse(t['webSocketDebuggerUrl'])
    s = socket.create_connection((u.hostname, u.port), timeout=25)
    k = base64.b64encode(os.urandom(16)).decode()
    s.sendall(
        f'GET {u.path} HTTP/1.1\r\nHost: {u.hostname}:{u.port}\r\n'
        f'Upgrade: websocket\r\nConnection: Upgrade\r\n'
        f'Sec-WebSocket-Key: {k}\r\nSec-WebSocket-Version: 13\r\n\r\n'.encode())
    buf = b''
    while b'\r\n\r\n' not in buf:
        buf += s.recv(4096)
    return s


def kirim(s, m, p, i):
    d = json.dumps({'id': i, 'method': m, 'params': p}).encode()
    f = bytearray([0x81])
    n = len(d)
    if n < 126:
        f.append(0x80 | n)
    elif n < 65536:
        f.append(0x80 | 126)
        f += struct.pack('>H', n)
    else:
        f.append(0x80 | 127)
        f += struct.pack('>Q', n)
    kk = os.urandom(4)
    f += kk
    f += bytes(b ^ kk[j % 4] for j, b in enumerate(d))
    s.sendall(bytes(f))


def baca(s, to=25):
    s.settimeout(to)
    h = s.recv(2)
    if len(h) < 2:
        return None
    p = h[1] & 0x7F
    if p == 126:
        p = struct.unpack('>H', s.recv(2))[0]
    elif p == 127:
        p = struct.unpack('>Q', s.recv(8))[0]
    d = b''
    while len(d) < p:
        c = s.recv(p - len(d))
        if not c:
            break
        d += c
    try:
        return json.loads(d.decode('utf-8', 'replace'))
    except Exception:
        return None


def js(s, e, i):
    kirim(s, 'Runtime.evaluate',
          {'expression': e, 'returnByValue': True, 'awaitPromise': True}, i)
    for _ in range(50):
        j = baca(s)
        if j and j.get('id') == i:
            return j
    return None


def nilai(j):
    try:
        return j['result']['result']['value']
    except Exception:
        return None


def main():
    db = glob.glob('/tmp/bayana-uji/*.db')[0]
    no = sqlite3.connect(db).execute(
        "SELECT no_order FROM pesanan WHERE status='belum_bayar' "
        "ORDER BY dibuat_pada DESC LIMIT 1").fetchone()[0]
    print(f'Pesanan belum bayar: {no}\n')

    s = ws(tab())
    kirim(s, 'Emulation.setDeviceMetricsOverride',
          {'width': 390, 'height': 900, 'deviceScaleFactor': 1, 'mobile': True}, 1)
    time.sleep(1.2)
    kirim(s, 'Page.navigate',
          {'url': f'http://127.0.0.1:3200/buku/bayar/{no}'}, 2)
    time.sleep(4)

    ukur = js(s, """(()=>{
      const t=document.documentElement.scrollHeight;
      const cari=[...document.querySelectorAll('button,a')]
        .find(e=>e.textContent.includes('Saya sudah bayar'));
      const qr=document.querySelector('svg');
      const hasil={tinggiHalaman:t, tinggiLayar:window.innerHeight};
      if(cari){const r=cari.getBoundingClientRect();
        hasil.tombol={teks:cari.textContent.trim(), atas:Math.round(r.top),
          bawah:Math.round(r.bottom), tinggi:Math.round(r.height),
          lebar:Math.round(r.width)};}
      else hasil.tombol=null;
      const no=document.querySelector('.no-pesanan');
      hasil.noPesanan=no?no.textContent.trim():null;
      if(no){const r=no.getBoundingClientRect(); hasil.urutNo=Math.round(r.top);}
      if(qr){const r=qr.getBoundingClientRect(); hasil.urutQr=Math.round(r.top);}
      return JSON.stringify(hasil);
    })()""", 3)
    print('HASIL UKUR:', nilai(ukur))

    # cek: apakah tombol ada DI DALAM batas halaman (tidak terpotong)
    d = json.loads(nilai(ukur) or '{}')
    tom = d.get('tombol')
    if not tom:
        print('\n❌ TOMBOL TIDAK ADA DI DOM')
        return 1
    if tom['bawah'] <= d['tinggiHalaman'] + 1:
        print(f"\n✅ TOMBOL UTUH: bawah={tom['bawah']} ≤ tinggi halaman={d['tinggiHalaman']}")
        print(f"   teks: '{tom['teks']}'  ukuran: {tom['lebar']}×{tom['tinggi']}px")
        return 0
    print(f"\n❌ TOMBOL KELUAR HALAMAN: bawah={tom['bawah']} > {d['tinggiHalaman']}")
    return 1


if __name__ == '__main__':
    import sys
    sys.exit(main())
