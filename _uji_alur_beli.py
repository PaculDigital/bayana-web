"""UJI ALUR BELI UTUH — dari katalog sampai ulasan.

Bukan sekadar "halaman HTTP 200". Yang diuji: apakah murid bisa
SUNGGUHAN membeli dan pesanannya tercatat.

Jalur yang ditembus:
  1. tambah 2 buku ke keranjang (API)
  2. buka keranjang       → 2 butir tampil
  3. buat pesanan (alamat) → dapat nomor BYN-xxxxxxxx
  4. buka halaman bayar   → nomor + QR muncul
  5. "Saya sudah bayar"   → tercatat di database
  6. lacak dengan nomor   → 4 langkah status tampil
  7. admin ubah status    → dikemas → dikirim
  8. lacak lagi           → status ikut naik
  9. tulis ulasan         → tersimpan
 10. nomor ngawur         → DITOLAK (pagar uji)
"""
from __future__ import annotations

import http.cookiejar
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

DASAR = 'http://127.0.0.1:3200'
PW_ADMIN = 'uji-admin-12345'

lulus = 0
gagal = 0


def cek(nama: str, syarat: bool, bukti: str = '') -> None:
    global lulus, gagal
    if syarat:
        lulus += 1
        print(f'  ✅ {nama}' + (f' — {bukti}' if bukti else ''))
    else:
        gagal += 1
        print(f'  ❌ {nama}' + (f' — {bukti}' if bukti else ''))


def buat_pembuka() -> urllib.request.OpenerDirector:
    cj = http.cookiejar.CookieJar()
    return urllib.request.build_opener(
        urllib.request.HTTPCookieProcessor(cj),
        urllib.request.HTTPRedirectHandler())


def ambil(op, url: str):
    try:
        with op.open(url, timeout=25) as r:
            return r.status, r.read().decode('utf-8', 'replace')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8', 'replace')


def pos(op, url: str, isi: dict):
    data = json.dumps(isi).encode()
    req = urllib.request.Request(
        url, data=data, method='POST',
        headers={'Content-Type': 'application/json'})
    try:
        with op.open(req, timeout=25) as r:
            return r.status, json.loads(r.read().decode('utf-8', 'replace'))
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode('utf-8', 'replace'))
        except Exception:
            return e.code, {'ok': False, 'pesan': 'badan tidak terbaca'}


def main() -> int:
    op = buat_pembuka()

    print('\n1. KATALOG & HALAMAN BUKU')
    st, html = ambil(op, f'{DASAR}/buku')
    cek('katalog terbuka', st == 200, f'HTTP {st}')
    n_kartu = html.count('class="kartu-buku"')
    cek('katalog menampilkan 8 buku', n_kartu == 8, f'{n_kartu} kartu')
    cek('katalog punya harga', 'Rp78.000' in html)
    cek('katalog punya rating', 'kartu-buku-rating' in html)

    st, html = ambil(op, f'{DASAR}/buku/manajemen-strategi')
    cek('halaman buku terbuka', st == 200, f'HTTP {st}')
    cek('ada tabel identitas', 'tabel-identitas' in html)
    cek('ada daftar isi', 'toko-daun' in html)
    cek('ada ulasan contoh', 'contoh ulasan' in html)
    cek('ada tombol Beli Sekarang', 'Beli Sekarang' in html)

    print('\n2. KERANJANG (tambah 2 buku)')
    st, j = pos(op, f'{DASAR}/api/buku/keranjang',
                {'aksi': 'tambah', 'slug': 'manajemen-strategi'})
    cek('tambah buku 1', st == 200 and j.get('ok'), str(j.get('pesan'))[:60])
    st, j = pos(op, f'{DASAR}/api/buku/keranjang',
                {'aksi': 'tambah', 'slug': 'hukum-bisnis-indonesia'})
    cek('tambah buku 2', st == 200 and j.get('ok'), f"jumlah={j.get('jumlah')}")
    cek('lencana keranjang = 2', j.get('jumlah') == 2)

    st, j = pos(op, f'{DASAR}/api/buku/keranjang',
                {'aksi': 'tambah', 'slug': 'buku-tidak-ada'})
    cek('PAGAR: buku palsu DITOLAK', st == 400 and not j.get('ok'),
        str(j.get('pesan'))[:50])

    st, html = ambil(op, f'{DASAR}/buku/keranjang')
    cek('halaman keranjang terbuka', st == 200, f'HTTP {st}')
    cek('keranjang menampilkan 2 butir',
        html.count('butir-keranjang') == 2,
        f"{html.count('butir-keranjang')} butir")
    cek('ada kotak centang', 'class="centang"' in html)
    cek('ada Pilih semua', 'Pilih semua' in html)

    print('\n3. BUAT PESANAN (alamat)')
    st, j = pos(op, f'{DASAR}/api/buku/pesanan', {
        'nama_penerima': 'Budi Santoso',
        'hp': '081234567890',
        'alamat': 'Jl. Soekarno Hatta No. 9, RT 3 RW 4',
        'kota': 'Malang',
        'provinsi': 'Jawa Timur',
        'kode_pos': '65141',
        'beli': ['manajemen-strategi', 'hukum-bisnis-indonesia'],
    })
    cek('pesanan dibuat', st == 200 and j.get('ok'), str(j.get('pesan'))[:60])
    no = j.get('no_order', '')
    cek('nomor pesanan berformat BYN- + 8', bool(re.fullmatch(r'BYN-[A-Z2-9]{8}', no)), no)
    cek('total = 78.000 + 95.000 + 15.000 = 188.000',
        j.get('total') == 188000, str(j.get('total')))

    st, j2 = pos(op, f'{DASAR}/api/buku/pesanan', {
        'nama_penerima': '', 'hp': '', 'alamat': '', 'kota': '',
        'provinsi': '', 'beli': ['manajemen-strategi'],
    })
    cek('PAGAR: alamat kosong DITOLAK', st == 400 and not j2.get('ok'))

    print('\n4. HALAMAN BAYAR (QRIS)')
    st, html = ambil(op, f'{DASAR}/buku/bayar/{no}')
    cek('halaman bayar terbuka', st == 200, f'HTTP {st}')
    cek('nomor pesanan tampil di halaman', no in html)
    cek('kode QR tampil', '<svg' in html and 'QRIS' in html)
    cek('ada tombol Saya sudah bayar', 'Saya sudah bayar' in html)
    cek('ada rincian buku', 'Manajemen Strategi' in html)

    print('\n5. "SAYA SUDAH BAYAR"')
    st, j = pos(op, f'{DASAR}/api/buku/bayar',
                {'no_order': no, 'nama': 'Budi Santoso'})
    cek('konfirmasi bayar diterima', st == 200 and j.get('ok'))
    cek('status MASIH belum_bayar (admin yang menaikkan)',
        j.get('status') == 'belum_bayar', str(j.get('status')))

    st, j = pos(op, f'{DASAR}/api/buku/bayar',
                {'no_order': 'BYN-NGAWUR12'})
    cek('PAGAR: nomor ngawur DITOLAK', st == 404 and not j.get('ok'))

    print('\n6. LACAK PESANAN')
    st, html = ambil(op, f'{DASAR}/buku/lacak?no={no}')
    cek('halaman lacak terbuka', st == 200)
    cek('4 langkah status tampil', html.count('class="langkah') == 4,
        f"{html.count('class=\"langkah')} langkah")
    cek('langkah ada: Belum Bayar/Dikemas/Dikirim/Penilaian',
        all(x in html for x in
            ['Belum Bayar', 'Dikemas', 'Dikirim', 'Beri Penilaian']))
    cek('riwayat perjalanan tampil', 'Perjalanan pesanan' in html)
    cek('alamat kirim tampil', 'Jl. Soekarno Hatta' in html)
    cek('tanpa login: tidak ada form masuk', 'password' not in html.lower())

    st, html = ambil(op, f'{DASAR}/buku/lacak?no=BYN-SALAHXXX')
    cek('nomor salah → pesan gagal MERAH',
        'toko-pesan-gagal' in html)

    print('\n7. ADMIN (ubah status)')
    st, j = pos(op, f'{DASAR}/api/buku/admin/status',
                {'no_order': no, 'status': 'dikemas'})
    cek('PAGAR: tanpa password DITOLAK', st == 401 and not j.get('ok'),
        str(j.get('pesan'))[:50])

    opA = buat_pembuka()
    st, j = pos(opA, f'{DASAR}/api/buku/admin', {'password': 'salah-sekali'})
    cek('PAGAR: password salah DITOLAK', st == 401 and not j.get('ok'))

    st, j = pos(opA, f'{DASAR}/api/buku/admin', {'password': PW_ADMIN})
    if st != 200 or not j.get('ok'):
        print(f'  ⚠ password admin .env belum cocok (HTTP {st}) — '
              f'lewati uji admin')
    else:
        cek('admin masuk', True)
        for s, label in [('dikemas', 'Dikemas'), ('dikirim', 'Dikirim'),
                         ('selesai', 'Beri Penilaian')]:
            st, j = pos(opA, f'{DASAR}/api/buku/admin/status',
                        {'no_order': no, 'status': s,
                         'resi': 'JNE123456' if s == 'dikirim' else ''})
            cek(f'admin ubah status → {label}', st == 200 and j.get('ok'))

        st, html = ambil(op, f'{DASAR}/buku/lacak?no={no}')
        cek('pembeli melihat status terbaru', 'Beri Penilaian' in html)
        cek('resi tampil ke pembeli', 'JNE123456' in html)

    print('\n8. ULASAN')
    st, j = pos(op, f'{DASAR}/api/buku/nilai', {
        'no_order': no, 'slug_buku': 'manajemen-strategi',
        'bintang': 5, 'komentar': 'Bukunya bagus, pengiriman cepat.',
    })
    cek('ulasan tersimpan', st == 200 and j.get('ok'), str(j.get('pesan'))[:50])

    st, j = pos(op, f'{DASAR}/api/buku/nilai', {
        'no_order': no, 'slug_buku': 'kecerdasan-artifisial', 'bintang': 5,
    })
    cek('PAGAR: buku yang TIDAK dibeli tidak bisa diulas',
        st == 403 and not j.get('ok'), str(j.get('pesan'))[:60])

    st, j = pos(op, f'{DASAR}/api/buku/nilai', {
        'no_order': no, 'slug_buku': 'manajemen-strategi', 'bintang': 9,
    })
    cek('PAGAR: bintang 9 DITOLAK', st == 400 and not j.get('ok'))

    print('\n9. HUBUNGI PENERBIT')
    st, html = ambil(op, f'{DASAR}/buku/kontak')
    cek('halaman kontak terbuka', st == 200)
    cek('email penerbit tampil', 'buku@bayana.id' in html)
    st, j = pos(op, f'{DASAR}/api/buku/kontak', {
        'nama': 'Sari', 'email': 'sari@contoh.com',
        'subjek': 'Tanya pesanan', 'pesan': 'Kapan buku saya dikirim?',
    })
    cek('pesan terkirim', st == 200 and j.get('ok'))
    st, j = pos(op, f'{DASAR}/api/buku/kontak', {
        'nama': 'Sari', 'email': 'bukan-email', 'pesan': 'tes',
    })
    cek('PAGAR: email salah bentuk DITOLAK', st == 400 and not j.get('ok'))

    print('\n10. PESANAN SAYA')
    st, html = ambil(op, f'{DASAR}/buku/pesanan')
    cek('halaman Pesanan Saya terbuka', st == 200)
    cek('4 ikon kategori tampil',
        all(x in html for x in
            ['Belum Bayar', 'Dikemas', 'Dikirim', 'Beri Penilaian']))
    cek('ada lencana angka', 'lencana-angka' in html)
    cek('pesanan pembeli MUNCUL di Pesanan Saya', no in html,
        f'pesanan {no} muncul')
    cek('total pesanan tampil', '188.000' in html)

    # PAGAR: browser LAIN tidak boleh melihat pesanan orang lain
    opLain = buat_pembuka()
    st, html = ambil(opLain, f'{DASAR}/buku/pesanan')
    cek('PAGAR: browser lain TIDAK melihat pesanan ini', no not in html,
        'pesanan orang lain tidak bocor')

    print('\n11. TOMBOL BELI DI HALAMAN BUKU')
    st, html = ambil(opLain, f'{DASAR}/buku/kecerdasan-artifisial')
    cek('halaman buku terbuka', st == 200)
    cek('ada tombol Beli Sekarang', 'Beli Sekarang' in html)
    cek('ada tombol Masukkan keranjang', 'Masukkan keranjang' in html)
    cek('tombol TIDAK lagi berupa tautan mati ?tambah=',
        '?tambah=' not in html, 'tautan mati sudah dibuang')
    st, j = pos(opLain, f'{DASAR}/api/buku/keranjang',
                {'aksi': 'tambah', 'slug': 'kecerdasan-artifisial', 'jumlah': 1})
    cek('tombol beli benar-benar mengisi keranjang',
        st == 200 and j.get('ok') and j.get('jumlah') == 1,
        f"jumlah={j.get('jumlah')}")

    print(f'\n{"=" * 52}')
    print(f'HASIL: {lulus} LULUS · {gagal} GAGAL')
    print('=' * 52)
    return 0 if gagal == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
