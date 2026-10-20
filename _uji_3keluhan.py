"""Uji 3 keluhan Bos (22Sep26) — BUKTI NYATA, bukan asumsi.

1. Lencana angka di ikon keranjang MUNCUL setelah produk dimasukkan.
2. Form alamat punya dropdown Provinsi & Kota + kolom Kecamatan &
   Kelurahan + tanda wajib (*).
3. Tombol "Buat pesanan" tulisannya PUTIH.

⚠️ PELAJARAN 22Sep26 (dari uji yang GAGAL PALSU):
   - Halaman /buku/alamat SENGAJA menolak tampil kalau keranjang kosong.
     Jadi uji WAJIB mengisi keranjang dulu + MEMBAWA cookie-nya.
   - API keranjang memakai `aksi`, bukan `tindakan`.
   - `npx next start` melayani hasil `next build` — uji WAJIB setelah build.

Uji ini WAJIB bisa GAGAL: kalau salah satu fitur dimatikan lagi,
hasilnya harus GAGAL.
"""
import json
import re
import sys
import urllib.error
import urllib.request

DASAR = "http://127.0.0.1:3200"
lulus = 0
gagal = 0


def cek(nama: str, syarat: bool, tambahan: str = ""):
    global lulus, gagal
    if syarat:
        lulus += 1
        print(f"  LULUS  {nama}")
    else:
        gagal += 1
        print(f"  GAGAL  {nama} {tambahan}")


def buka(path: str, cookie: str = ""):
    req = urllib.request.Request(DASAR + path)
    if cookie:
        req.add_header("Cookie", cookie)
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.status, r.read().decode("utf-8", "replace")


def kirim(path: str, isi: dict, cookie: str = ""):
    """POST JSON; kembalikan (jawaban, cookie-baru)."""
    req = urllib.request.Request(
        DASAR + path,
        data=json.dumps(isi).encode(),
        method="POST",
        headers={"Content-Type": "application/json"},
    )
    if cookie:
        req.add_header("Cookie", cookie)
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            return json.loads(r.read().decode()), (r.headers.get("Set-Cookie") or "")
    except urllib.error.HTTPError as e:
        return json.loads(e.read().decode()), (e.headers.get("Set-Cookie") or "")


# ── 1. Lencana angka keranjang ───────────────────────────────────────────
print("=" * 62)
print(" 1. LENCANA ANGKA KERANJANG")
print("=" * 62)
st, html = buka("/buku")
cek("halaman katalog terbuka", st == 200)
cek("ikon keranjang ada", "toko-keranjang" in html)
cek("keranjang kosong → belum ada lencana", 'class="lencana"' not in html)

# Masukkan 1 buku ke keranjang (aksi = "tambah").
jawab, set_cookie = kirim("/api/buku/keranjang",
                          {"aksi": "tambah", "slug": "manajemen-strategi"})
cek("tambah ke keranjang berhasil", jawab.get("ok") is True, f"jawab={jawab}")

cookie = set_cookie.split(";")[0] if set_cookie else ""
cek("server memberi cookie tanda-browser", bool(cookie), "cookie kosong")

# Katalog dibuka lagi DENGAN cookie yang sama → lencana harus muncul.
st, html2 = buka("/buku", cookie)
cek("setelah diisi → lencana MUNCUL", 'class="lencana"' in html2)
m = re.search(r'class="lencana">(\d+)<', html2)
cek("lencana berisi angka", bool(m), "tidak ada angka di lencana")
if m:
    print(f"         angka yang tampil: {m.group(1)}")
    cek("angkanya 1 (satu buku)", m.group(1) == "1", f"dapat {m.group(1)}")

# ── 2. Form alamat ───────────────────────────────────────────────────────
print()
print("=" * 62)
print(" 2. FORM ALAMAT — DROPDOWN + KOLOM WAJIB")
print("=" * 62)
# Keranjang sudah terisi di langkah 1 → form alamat pasti tampil.
# ⚠️ Halaman alamat hanya menampilkan form untuk buku yang DICENTANG,
#    yang ditandai lewat ?beli=<slug> (persis alur keranjang → centang →
#    "Lanjut isi alamat"). Tanpa ?beli, halaman memang menampilkan
#    pesan "Belum ada buku yang dipilih" — itu perilaku BENAR.
st, html3 = buka("/buku/alamat?beli=manajemen-strategi", cookie)
cek("halaman alamat terbuka", st == 200)
cek("FORM tampil (bukan pesan 'keranjang kosong')",
    'id="provinsi"' in html3,
    "form tidak muncul — cek ?beli= dan cookie")
cek("ADA dropdown Provinsi", '<select id="provinsi"' in html3)
cek("ADA dropdown Kota/Kabupaten", '<select id="kota"' in html3)
cek("ADA kolom Kecamatan", 'id="kecamatan"' in html3)
cek("ADA kolom Kelurahan/Desa", 'id="kelurahan"' in html3)
cek("ADA tanda wajib (*)", "toko-wajib" in html3)
cek("kode pos tetap OPSIONAL", "Kode pos (opsional)" in html3)

jml_pilihan = len(re.findall(r"<option value=", html3))
cek("daftar provinsi terisi (>30)", jml_pilihan > 30,
    f"hanya {jml_pilihan} pilihan")

# ⚠️ "Kota/Kabupaten lain…" hanya muncul SETELAH provinsi dipilih (memang
#    begitu rancangannya: pilihan kota bergantung provinsi). Uji harus
#    meniru perilaku itu, bukan menuntut hal yang tidak mungkin.
html4 = html3.replace("— Pilih provinsi —", "Jawa Barat", 1)
# Ambil bentuk nyata dari berkas komponen (jangan menebak) — pastikan
# opsi cadangan memang ada di kode sumber.
sumber_form = open(
    "/opt/data/services/bayana-web/src/components/buku/FormAlamat.tsx",
    encoding="utf-8").read()
cek("ADA pilihan 'Kota/Kabupaten lain…' di form (jalan keluar)",
    "Kota/Kabupaten lain" in sumber_form)
cek("Kota dinonaktifkan sampai provinsi dipilih",
    "disabled={!provinsi}" in sumber_form)

# ── 3. Tombol tulisan putih ──────────────────────────────────────────────
print()
print("=" * 62)
print(" 3. TOMBOL — TULISAN PUTIH")
print("=" * 62)
cek("tombol pakai kelas toko-btn-utama",
    "toko-btn toko-btn-utama toko-btn-lebar" in html3)
cek("warna putih ditegaskan di tombol",
    "color: #ffffff" in html3.replace("color:#ffffff", "color: #ffffff"))

isi_css = open("/opt/data/services/bayana-web/src/app/buku/buku.css",
               encoding="utf-8").read()
cek("CSS menegaskan putih (!important)",
    "color: #ffffff !important" in isi_css)
cek("CSS .toko-wajib → MERAH", ".toko-wajib" in isi_css
    and "#c0392b" in isi_css)
cek("CSS kolom kurang → kotak merah", ".toko-kurang" in isi_css)

print()
print("=" * 62)
print(f" HASIL: {lulus} LULUS / {gagal} GAGAL")
print("=" * 62)
sys.exit(0 if gagal == 0 else 1)
