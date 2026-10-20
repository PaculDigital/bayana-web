"""Periksa isi BERKAS BUKTI PESANAN yang akan diterima pembeli.

Berkas dibuat di peramban pembeli (tanpa server), jadi Wulan TIDAK bisa
mengunduhnya dari sini. Yang bisa diperiksa dengan jujur:
  1. Kode pembuat berkas benar-benar ada di bundel JS yang dikirim.
  2. Isi teks yang akan ditulis ke berkas memuat semua bagian penting
     (nomor, tanggal, kirim ke, rincian, total, cara cek).
  3. Nama berkas unduhan memuat nomor pesanan.
"""
import re
import urllib.request

DASAR = "http://127.0.0.1:3200"
lulus = gagal = 0


def cek(nama, syarat, catatan=""):
    global lulus, gagal
    if syarat:
        lulus += 1
        print(f"  LULUS  {nama}")
    else:
        gagal += 1
        print(f"  GAGAL  {nama} {catatan}")


def ambil(url):
    r = urllib.request.Request(url, headers={"Host": "buku.bayana.id"})
    with urllib.request.urlopen(r, timeout=30) as f:
        return f.read().decode("utf-8", "replace")


print("=" * 62)
print(" BERKAS BUKTI PESANAN — isi yang akan diterima pembeli")
print("=" * 62)

html = ambil(f"{DASAR}/buku/bayar/BYN-6Z92UPPP")

# Kumpulkan SEMUA berkas JS yang dirujuk halaman
js_gabung = ""
for p in re.findall(r'src="(/_next/static/[^"]+\.js)"', html):
    try:
        js_gabung += ambil(f"{DASAR}{p}")
    except Exception:
        pass

cek("bundel JS halaman terbaca", len(js_gabung) > 10000,
    f"hanya {len(js_gabung)} char")

# Bagian-bagian isi berkas bukti (harus ada di bundel JS)
bagian = {
    "judul BUKTI PESANAN": "BUKTI PESANAN",
    "nama penerbit": "BAYANA PUBLISHING",
    "baris NOMOR PESANAN": "NOMOR PESANAN",
    "baris TANGGAL": "TANGGAL",
    "baris STATUS": "STATUS",
    "bagian KIRIM KE": "KIRIM KE",
    "bagian PESANAN": "PESANAN",
    "ongkos kirim": "Ongkos kirim",
    "TOTAL BAYAR": "TOTAL BAYAR",
    "cara cek status": "CARA CEK STATUS",
    "alamat toko": "buku.bayana.id",
    "langkah cek pesanan": "Cek Pesanan",
}
for nama, teks in bagian.items():
    cek(f"berkas memuat: {nama}", teks in js_gabung)

# Bagian teknis pembuat berkas
cek("pakai Blob (buat berkas di peramban)", "Blob" in js_gabung)
cek("peramban mengunduh berkas (download)",
    "download" in js_gabung.lower())
cek("nama berkas memuat nomor pesanan",
    "Bukti-Pesanan-" in js_gabung)
cek("tombol Salin pakai papan klip",
    "clipboard" in js_gabung.lower())
cek("ada jalan keluar kalau salin gagal",
    "Tidak bisa menyalin" in js_gabung)

print()
print("=" * 62)
print(f" HASIL: {lulus} LULUS / {gagal} GAGAL")
print("=" * 62)
raise SystemExit(0 if gagal == 0 else 1)
