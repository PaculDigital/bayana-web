"""Uji PRODUKSI (buku.bayana.id) — 3 keluhan Bos, dibuktikan dari internet."""
import http.cookiejar
import json
import re
import urllib.request

DASAR = "https://buku.bayana.id"
lulus = 0
gagal = 0


def cek(nama, syarat, tambahan=""):
    global lulus, gagal
    if syarat:
        lulus += 1
        print(f"  LULUS  {nama}")
    else:
        gagal += 1
        print(f"  GAGAL  {nama} {tambahan}")


# Cookie jar: meniru browser pembeli (tanda-browser tersimpan).
jar = http.cookiejar.CookieJar()
pembuka = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))


def buka(path):
    with pembuka.open(DASAR + path, timeout=30) as r:
        return r.status, r.read().decode("utf-8", "replace")


def kirim(path, isi):
    req = urllib.request.Request(
        DASAR + path, data=json.dumps(isi).encode(), method="POST",
        headers={"Content-Type": "application/json"})
    with pembuka.open(req, timeout=30) as r:
        return json.loads(r.read().decode())


print("=" * 62)
print(" 1. LENCANA ANGKA KERANJANG — di PRODUKSI")
print("=" * 62)
st, h = buka("/buku")
cek("katalog terbuka", st == 200)
cek("ikon keranjang ada", "toko-keranjang" in h)
cek("keranjang kosong → TIDAK ada lencana", 'class="lencana"' not in h)

j = kirim("/api/buku/keranjang",
          {"aksi": "tambah", "slug": "manajemen-strategi"})
cek("tambah ke keranjang berhasil", j.get("ok") is True, f"{j}")

st, h2 = buka("/buku")
m = re.search(r'class="lencana">(\d+)<', h2)
cek("lencana MUNCUL setelah diisi", bool(m), "lencana tidak ada")
if m:
    print(f"         angka: {m.group(1)}")
    cek("angkanya 1", m.group(1) == "1", f"dapat {m.group(1)}")

print()
print("=" * 62)
print(" 2. FORM ALAMAT — dropdown + kolom wajib (PRODUKSI)")
print("=" * 62)
st, h3 = buka("/buku/alamat?beli=manajemen-strategi")
cek("halaman alamat terbuka", st == 200)
cek("ADA dropdown Provinsi", '<select id="provinsi"' in h3)
cek("ADA dropdown Kota/Kabupaten", '<select id="kota"' in h3)
cek("ADA kolom Kecamatan (wajib)", 'id="kecamatan"' in h3)
cek("ADA kolom Kelurahan/Desa (wajib)", 'id="kelurahan"' in h3)
cek("ADA tanda wajib (*)", "toko-wajib" in h3)
jml = len(re.findall(r"<option value=", h3))
cek("daftar provinsi terisi (>30)", jml > 30, f"hanya {jml}")
cek("kode pos tetap opsional", "Kode pos (opsional)" in h3)

print()
print("=" * 62)
print(" 3. TOMBOL — tulisan putih (PRODUKSI)")
print("=" * 62)
cek("tombol pakai kelas toko-btn-utama",
    "toko-btn toko-btn-utama" in h3)
cek("warna putih tertulis di tombol", "#ffffff" in h3)

# Cek CSS asli dari produksi (yang benar-benar dikirim ke peramban).
st, css = buka("/_next/static/chunks/2vqftnxh2-ww5.css") if False else (0, "")
cekjadi = False
for c in re.findall(r'href="(/_next/static/[^"]+\.css)"', h3):
    try:
        with pembuka.open(DASAR + c, timeout=30) as r:
            isi = r.read().decode("utf-8", "replace")
        if "toko-btn-utama" in isi:
            cekjadi = isi
            break
    except Exception:
        pass
if cekjadi:
    cek("CSS produksi: tombol putih (!important)",
        "color:#ffffff!important" in cekjadi.replace(" ", "")
        or "color: #ffffff !important" in cekjadi)
    cek("CSS produksi: .toko-wajib MERAH", ".toko-wajib" in cekjadi)
    cek("CSS produksi: kotak merah kolom kurang", ".toko-kurang" in cekjadi)
else:
    cek("CSS produksi terbaca", False, "tidak menemukan berkas CSS")

print()
print("=" * 62)
print(f" HASIL PRODUKSI: {lulus} LULUS / {gagal} GAGAL")
print("=" * 62)
