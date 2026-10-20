#!/usr/bin/env python3
"""Pasang bayana.id → web Bayana Publishing (pub.bikinaja.id).

Idempotent: aman dijalankan berulang.
Backup ingress dulu sebelum diubah (aturan wajib).
"""
import json, urllib.request, urllib.error, os

d = json.load(open('/opt/data/vault/cloudflare.json'))
TOK = d['api_token']; ACC = d['account_id']
Z   = '79485dee051ac71f3291442caa26f0ee'          # zone bayana.id
TUN = '8ae633d2-4726-47e1-aa5d-1d90fe13ffb1'      # tunnel "VPS EXA Cloud"
SVC = 'http://172.17.0.6:3021'                     # bayana-web (Next.js di container Hermes)
BASE = 'https://api.cloudflare.com/client/v4'


def api(m, p, b=None, tout=30):
    dd = json.dumps(b).encode() if b else None
    req = urllib.request.Request(BASE + p, data=dd, method=m,
        headers={'Authorization': f'Bearer {TOK}', 'Content-Type': 'application/json'})
    try:
        return True, json.load(urllib.request.urlopen(req, timeout=tout))
    except urllib.error.HTTPError as e:
        return False, json.loads(e.read().decode())
    except Exception as e:
        return False, {'err': str(e)[:140]}


# ── 0. BACKUP ingress dulu ────────────────────────────────────────────────
arsip = '/opt/data/services/bayana-web/_arsip'
os.makedirs(arsip, exist_ok=True)
ok, cfg0 = api('GET', f'/accounts/{ACC}/cfd_tunnel/{TUN}/configurations')
if not ok:
    print('GAGAL baca ingress:', json.dumps(cfg0)[:250]); raise SystemExit(1)
with open(f'{arsip}/ingress_pra-bayana.json', 'w') as f:
    json.dump(cfg0, f, indent=2)
print('backup ingress -> _arsip/ingress_pra-bayana.json')
ingress = cfg0['result']['config']['ingress'][:]
print('   jumlah route sebelum:', len(ingress))

# ── 1. DNS CNAME bayana.id + www → tunnel ────────────────────────────────
for nama in ('bayana.id', 'www.bayana.id'):
    ok, ex = api('GET', f'/zones/{Z}/dns_records?name={nama}')
    if ok and ex.get('result'):
        rid = ex['result'][0]['id']
        ok2, rr = api('PUT', f'/zones/{Z}/dns_records/{rid}',
                      {'type': 'CNAME', 'name': nama,
                       'content': f'{TUN}.cfargotunnel.com',
                       'proxied': True, 'ttl': 1})
        print(('  update ' if ok2 else '  GAGAL update ') + nama,
              '' if ok2 else json.dumps(rr)[:180])
    else:
        ok2, rr = api('POST', f'/zones/{Z}/dns_records',
                      {'type': 'CNAME', 'name': nama,
                       'content': f'{TUN}.cfargotunnel.com',
                       'proxied': True, 'ttl': 1})
        print(('  tambah ' if ok2 else '  GAGAL tambah ') + nama,
              '' if ok2 else json.dumps(rr)[:180])

# ── 2. Ingress: tambah/update tepat SEBELUM catch-all 404 ────────────────
sudah = {x.get('hostname') for x in ingress}
for h in ('bayana.id', 'www.bayana.id'):
    if h in sudah:
        for x in ingress:
            if x.get('hostname') == h:
                x['service'] = SVC
        print('  ingress update:', h, '->', SVC)
    else:
        ingress.insert(-1, {'hostname': h, 'service': SVC})
        print('  ingress tambah:', h, '->', SVC)

if ingress[-1].get('service') != 'http_status:404':
    print('  PERINGATAN catch-all hilang, dipasang ulang')
    ingress.append({'service': 'http_status:404'})

ok3, r3 = api('PUT', f'/accounts/{ACC}/cfd_tunnel/{TUN}/configurations',
              {'config': {'ingress': ingress, 'warp-routing': {'enabled': False}}})
print('PUT ingress:', 'BERHASIL' if ok3 else 'GAGAL ' + json.dumps(r3)[:250])

# ── 3. Setelan zona ──────────────────────────────────────────────────────
for s, v in (('ssl', 'full'), ('always_use_https', 'on'),
             ('automatic_https_rewrites', 'on')):
    oks, rs = api('PATCH', f'/zones/{Z}/settings/{s}', {'value': v})
    print(f'  setelan {s}={v}:', 'OK' if oks else json.dumps(rs)[:120])

print('\nSELESAI. Tunggu ~10 detik lalu uji https://bayana.id/')
