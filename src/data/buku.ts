// buku.json — Katalog buku Bayana.
//
// CARA NAMBAH BUKU: salin satu blok di bawah, ubah isinya. Tidak perlu
// menyentuh kode apa pun.
//
// ⚠️ CATATAN PENTING:
//   • `harga` dalam RUPIAH penuh (78000 = Rp78.000) — bukan sen.
//   • `slug` = alamat halaman (buku.bayana.id/<slug>). Pakai huruf kecil
//     dan tanda hubung. JANGAN diubah setelah dibagikan ke orang.
//   • `warna` = 3 warna cover: [gelap, terang, pekat]. Warna bebas —
//     cover digambar otomatis oleh kode, tidak perlu berkas gambar.
//   • `stok` = kosongkan teksnya kalau tidak mau ditampilkan.
//
// Buku-buku di bawah ini SAMPLE (belum terbit) — sudah diberi pita "SAMPLE"
// di covernya supaya tidak tertukar dengan buku sungguhan.

export interface Buku {
  slug: string;
  judul: string;
  subjudul?: string;
  penulis: string;
  afiliasi?: string;
  genre: string;
  kdt?: string;
  harga: number;
  warna: [string, string, string];
  detail: {
    isbn: string;
    e_isbn?: string;
    halaman: string;
    ukuran: string;
    tahun: string;
    editor: string;
    layout: string;
    kertas: string;
    berat: string;
    cetakan: string;
  };
  sinopsis: string[];
  daftar_isi: string[];
  rating: number;
  jumlah_ulasan: number;
  /** true = buku karangan/contoh, covernya diberi pita SAMPLE */
  sample?: boolean;
}

export const ONGKIR_FLAT = 15000;

/** Rating & ulasan contoh — ditandai supaya jelas belum nyata. */
export const ULASAN_CONTOH = [
  {
    buku: "manajemen-strategi",
    bintang: 5,
    isi: "Bukunya sangat membantu untuk mata kuliah saya. Penjelasannya runtut dan contohnya dekat dengan kasus nyata.",
    nama: "Andi P.",
  },
  {
    buku: "manajemen-strategi",
    bintang: 5,
    isi: "Kertasnya tebal, jilidnya rapi. Pengiriman juga cepat sampai Malang.",
    nama: "Rizki P.",
  },
  {
    buku: "manajemen-strategi",
    bintang: 4,
    isi: "Isinya bagus, hanya saja bab terakhir terasa agak singkat.",
    nama: "Sari D.",
  },
  {
    buku: "hukum-bisnis-indonesia",
    bintang: 5,
    isi: "Pembahasan kasusnya jelas, cocok untuk mahasiswa yang baru belajar hukum bisnis.",
    nama: "Damar W.",
  },
  {
    buku: "asuhan-keperawatan",
    bintang: 5,
    isi: "Langkah asuhannya runtut dan mudah diikuti saat praktik lapangan.",
    nama: "Nurul H.",
  },
];

export const buku: Buku[] = [
  {
    slug: "manajemen-strategi",
    judul: "Manajemen Strategi",
    subjudul: "Teori dan Aplikasi di Era Digital",
    penulis: "Dr. Ahmad Fauzi, M.M.",
    afiliasi: "Universitas Negeri Malang",
    genre: "Ekonomi & Bisnis",
    kdt: "KDT MANAJEMEN",
    harga: 78000,
    warna: ["#2f5d50", "#5f9e88", "#153029"],
    detail: {
      isbn: "978-634-7070-01-2",
      e_isbn: "978-634-7070-02-9 (PDF)",
      halaman: "xvi + 214 Hlm",
      ukuran: "UNESCO (15,5 x 23 cm)",
      tahun: "2026",
      editor: "Rina Kusumawardani",
      layout: "TIM Bayana",
      kertas: "HVS 80gr",
      berat: "248 gr",
      cetakan: "Pertama",
    },
    sinopsis: [
      "Buku ini menyusun ulang cara berpikir manajemen strategi untuk organisasi yang hidup di tengah perubahan cepat. Pembaca diajak melihat strategi bukan sebagai dokumen tahunan, melainkan sebagai keputusan harian yang diuji pasar.",
      "Setiap bab dibuka dengan kasus nyata dari perusahaan di Indonesia, lalu ditutup dengan alat analisis yang bisa langsung dipakai — mulai dari analisis lingkungan, perumusan visi, sampai pengukuran kinerja.",
      "Ditujukan untuk mahasiswa manajemen, praktisi, dan pemilik usaha yang ingin menyusun strategi berbasis bukti, bukan sekadar meniru pesaing.",
    ],
    daftar_isi: [
      "Perumusan Visi, Misi, dan Tujuan Strategis",
      "Analisis Lingkungan Internal dan Eksternal",
      "Keunggulan Bersaing di Pasar Digital",
      "Strategi Tingkat Korporasi dan Unit Bisnis",
      "Keputusan Investasi dan Alokasi Sumber Daya",
      "Manajemen Perubahan Organisasi",
      "Pengukuran Kinerja dan Peta Strategi",
      "Risiko, Ketidakpastian, dan Skenario",
      "Kepemimpinan Strategis",
      "Studi Kasus Perusahaan Indonesia",
    ],
    rating: 4.8,
    jumlah_ulasan: 12,
    sample: true,
  },
  {
    slug: "hukum-bisnis-indonesia",
    judul: "Hukum Bisnis Indonesia",
    subjudul: "Kontrak, Perseroan, dan Penyelesaian Sengketa",
    penulis: "Dr. Siti Nurhaliza, S.H., M.H.",
    afiliasi: "Universitas Airlangga",
    genre: "Hukum",
    kdt: "KDT HUKUM",
    harga: 95000,
    warna: ["#1e3a5f", "#4a8fd4", "#0d1b2a"],
    detail: {
      isbn: "978-634-7070-03-6",
      e_isbn: "978-634-7070-04-3 (PDF)",
      halaman: "xviii + 268 Hlm",
      ukuran: "UNESCO (15,5 x 23 cm)",
      tahun: "2026",
      editor: "Bambang Setiawan",
      layout: "TIM Bayana",
      kertas: "Book Paper 70gr",
      berat: "312 gr",
      cetakan: "Pertama",
    },
    sinopsis: [
      "Buku ini menjelaskan hukum bisnis Indonesia dengan bahasa yang bisa diikuti mahasiswa maupun pelaku usaha. Fokusnya pada hal yang paling sering ditemui: membuat kontrak yang tidak merugikan, mendirikan badan usaha, dan menyelesaikan sengketa tanpa harus ke pengadilan.",
      "Setiap pembahasan disertai rujukan pasal dan putusan mahkamah yang relevan, sehingga pembaca bisa menelusuri dasarnya sendiri.",
    ],
    daftar_isi: [
      "Pengantar Hukum Bisnis dan Sumber Hukumnya",
      "Badan Usaha dan Perseroan Terbatas",
      "Hukum Kontrak dan Perancangan Klausul",
      "Perjanjian Jual Beli dan Distribusi",
      "Kekayaan Intelektual dalam Praktik Bisnis",
      "Hukum Ketenagakerjaan dan Hubungan Industrial",
      "Perlindungan Konsumen",
      "Kepailitan dan Penundaan Kewajiban Pembayaran Utang",
      "Arbitrase dan Mediasi",
      "Penyelesaian Sengketa di Pengadilan Niaga",
    ],
    rating: 4.6,
    jumlah_ulasan: 8,
    sample: true,
  },
  {
    slug: "asuhan-keperawatan",
    judul: "Asuhan Keperawatan",
    subjudul: "Pendekatan Proses Keperawatan pada Pasien Dewasa",
    penulis: "Ns. Dewi Anggraini, S.Kep., M.Kep.",
    afiliasi: "Politeknik Kesehatan Kemenkes Malang",
    genre: "Kesehatan",
    kdt: "KDT KEDOKTERAN DAN KESEHATAN",
    harga: 89000,
    warna: ["#1f5f4a", "#3fbf95", "#0c2a20"],
    detail: {
      isbn: "978-634-7070-05-0",
      e_isbn: "978-634-7070-06-7 (PDF)",
      halaman: "xii + 196 Hlm",
      ukuran: "UNESCO (15,5 x 23 cm)",
      tahun: "2026",
      editor: "Ayu Lestari",
      layout: "TIM Bayana",
      kertas: "HVS 80gr",
      berat: "226 gr",
      cetakan: "Pertama",
    },
    sinopsis: [
      "Buku ini menuntun mahasiswa keperawatan menjalankan proses keperawatan secara utuh — dari pengkajian, penegakan diagnosis, perencanaan, tindakan, sampai evaluasi.",
      "Dilengkapi lembar asuhan yang bisa disalin dan dipakai langsung saat praktik, serta contoh kasus pasien dewasa dengan berbagai kondisi umum.",
    ],
    daftar_isi: [
      "Konsep Proses Keperawatan",
      "Pengkajian dan Pengumpulan Data",
      "Penegakan Diagnosis Keperawatan",
      "Penyusunan Rencana Asuhan",
      "Implementasi dan Dokumentasi",
      "Evaluasi Hasil Asuhan",
      "Asuhan pada Gangguan Kardiovaskular",
      "Asuhan pada Gangguan Pernapasan",
      "Asuhan pada Gangguan Pencernaan",
      "Komunikasi Terapeutik dan Etika",
    ],
    rating: 4.9,
    jumlah_ulasan: 21,
    sample: true,
  },
  {
    slug: "kecerdasan-artifisial",
    judul: "Kecerdasan Artifisial",
    subjudul: "Dasar, Algoritma, dan Penerapannya",
    penulis: "Ir. Budi Hartono, M.T.",
    afiliasi: "Institut Teknologi Sepuluh Nopember",
    genre: "Komputer & AI",
    kdt: "KDT KOMPUTER",
    harga: 99000,
    warna: ["#155e63", "#3fa8b0", "#0a2b2e"],
    detail: {
      isbn: "978-634-7070-07-4",
      e_isbn: "978-634-7070-08-1 (PDF)",
      halaman: "xx + 302 Hlm",
      ukuran: "UNESCO (15,5 x 23 cm)",
      tahun: "2026",
      editor: "Fajar Nugroho",
      layout: "TIM Bayana",
      kertas: "Book Paper 70gr",
      berat: "356 gr",
      cetakan: "Pertama",
    },
    sinopsis: [
      "Buku ini membuka cara kerja kecerdasan artifisial dari dasarnya: bagaimana mesin belajar dari data, mengapa sebuah model bisa salah, dan kapan sebaiknya tidak dipakai.",
      "Ditulis untuk pembaca yang ingin memahami, bukan sekadar memakai — setiap algoritma dijelaskan dengan contoh perhitungan kecil yang bisa dikerjakan tangan.",
    ],
    daftar_isi: [
      "Pengantar Kecerdasan Artifisial",
      "Data, Fitur, dan Kualitas Data",
      "Regresi dan Klasifikasi",
      "Pohon Keputusan dan Ansambel",
      "Jaringan Saraf Tiruan",
      "Pembelajaran Mendalam",
      "Pengolahan Bahasa Manusia",
      "Penglihatan Komputer",
      "Etika dan Keterbatasan Model",
      "Studi Kasus Penerapan di Industri",
    ],
    rating: 4.7,
    jumlah_ulasan: 15,
    sample: true,
  },
  {
    slug: "psikologi-pendidikan",
    judul: "Psikologi Pendidikan",
    subjudul: "Memahami Peserta Didik dan Proses Belajar",
    penulis: "Dr. Maya Sari, M.Psi.",
    afiliasi: "Universitas Pendidikan Indonesia",
    genre: "Pendidikan",
    kdt: "KDT PENDIDIKAN",
    harga: 82000,
    warna: ["#4a3b7a", "#8d7ad4", "#221a3a"],
    detail: {
      isbn: "978-634-7070-09-8",
      e_isbn: "978-634-7070-10-4 (PDF)",
      halaman: "xiv + 232 Hlm",
      ukuran: "UNESCO (15,5 x 23 cm)",
      tahun: "2026",
      editor: "Rina Kusumawardani",
      layout: "TIM Bayana",
      kertas: "HVS 80gr",
      berat: "264 gr",
      cetakan: "Pertama",
    },
    sinopsis: [
      "Buku ini menghubungkan teori psikologi dengan ruang kelas sehari-hari: bagaimana peserta didik memusatkan perhatian, menyimpan ingatan, dan membangun pemahaman.",
      "Cocok untuk calon guru dan pendidik yang ingin mengajar sesuai tahap perkembangan peserta didiknya, bukan sekadar menyampaikan materi.",
    ],
    daftar_isi: [
      "Pengantar Psikologi Pendidikan",
      "Perkembangan Peserta Didik",
      "Perhatian, Persepsi, dan Ingatan",
      "Teori Belajar Behavioristik",
      "Teori Belajar Kognitif",
      "Teori Belajar Konstruktivistik",
      "Motivasi Belajar",
      "Perbedaan Individu dan Gaya Belajar",
      "Penilaian Berbasis Kelas",
      "Lingkungan Belajar yang Aman",
    ],
    rating: 4.5,
    jumlah_ulasan: 9,
    sample: true,
  },
  {
    slug: "ekonomi-pembangunan",
    judul: "Ekonomi Pembangunan",
    subjudul: "Perspektif Indonesia Kontemporer",
    penulis: "Dr. Rangga Pratama, S.E., M.E.",
    afiliasi: "Universitas Brawijaya",
    genre: "Ekonomi & Bisnis",
    kdt: "KDT MANAJEMEN",
    harga: 92000,
    warna: ["#7a5a1f", "#d4af37", "#33240a"],
    detail: {
      isbn: "978-634-7070-11-1",
      e_isbn: "978-634-7070-12-8 (PDF)",
      halaman: "xviii + 254 Hlm",
      ukuran: "UNESCO (15,5 x 23 cm)",
      tahun: "2026",
      editor: "Bambang Setiawan",
      layout: "TIM Bayana",
      kertas: "Book Paper 70gr",
      berat: "298 gr",
      cetakan: "Pertama",
    },
    sinopsis: [
      "Buku ini membahas pertumbuhan, pemerataan, dan perubahan struktur ekonomi Indonesia dengan data terkini dan bahasa yang terjangkau.",
      "Setiap bab diakhiri latihan membaca data resmi, supaya pembaca terbiasa mengambil kesimpulan dari angka, bukan dari kesan.",
    ],
    daftar_isi: [
      "Konsep dan Ukuran Pembangunan",
      "Pertumbuhan Ekonomi dan Sumbernya",
      "Kemiskinan dan Ketimpangan",
      "Kependudukan dan Tenaga Kerja",
      "Industrialisasi dan Perubahan Struktur",
      "Pembangunan Daerah dan Keuangan Publik",
      "Perdagangan Internasional",
      "Pembangunan Berkelanjutan",
      "Kebijakan Fiskal dan Moneter",
      "Studi Kasus Daerah Tertinggal",
    ],
    rating: 4.4,
    jumlah_ulasan: 6,
    sample: true,
  },
  {
    slug: "agama-dan-etika",
    judul: "Agama dan Etika Profesi",
    subjudul: "Membangun Integritas di Dunia Kerja",
    penulis: "Dr. KH. Ibrahim Malik, M.A.",
    afiliasi: "Universitas Islam Negeri Maulana Malik Ibrahim",
    genre: "Agama Islam",
    kdt: "KDT AGAMA",
    harga: 76000,
    warna: ["#2d5a3d", "#6fae82", "#132a1c"],
    detail: {
      isbn: "978-634-7070-13-5",
      e_isbn: "978-634-7070-14-2 (PDF)",
      halaman: "xii + 188 Hlm",
      ukuran: "UNESCO (15,5 x 23 cm)",
      tahun: "2026",
      editor: "Ayu Lestari",
      layout: "TIM Bayana",
      kertas: "HVS 80gr",
      berat: "218 gr",
      cetakan: "Pertama",
    },
    sinopsis: [
      "Buku ini menempatkan ajaran agama sebagai tuntunan praktis dalam menjalani pekerjaan: kejujuran, tanggung jawab, dan amanah.",
      "Ditulis dengan bahasa yang tenang dan contoh keseharian, cocok untuk mahasiswa maupun pekerja yang ingin menjaga integritas.",
    ],
    daftar_isi: [
      "Manusia, Kerja, dan Ibadah",
      "Nilai Kejujuran dalam Berusaha",
      "Amanah dan Tanggung Jawab Profesi",
      "Keadilan dalam Transaksi",
      "Etika Bermitra dan Berbagi Hasil",
      "Menghindari Riba dan Kecurangan",
      "Adab Berbicara dan Menulis",
      "Keseimbangan Kerja dan Keluarga",
      "Etika Pemimpin dan Bawahan",
      "Renungan Kasus Kontemporer",
    ],
    rating: 4.8,
    jumlah_ulasan: 11,
    sample: true,
  },
  {
    slug: "teknologi-pangan",
    judul: "Teknologi Pangan",
    subjudul: "Pengolahan, Pengawetan, dan Mutu Produk",
    penulis: "Ir. Sri Wahyuni, M.P.",
    afiliasi: "Universitas Gadjah Mada",
    genre: "Industri",
    kdt: "KDT INDUSTRI",
    harga: 94000,
    warna: ["#5f3a1e", "#c58f52", "#2a1708"],
    detail: {
      isbn: "978-634-7070-15-9",
      e_isbn: "978-634-7070-16-6 (PDF)",
      halaman: "xvi + 288 Hlm",
      ukuran: "UNESCO (15,5 x 23 cm)",
      tahun: "2026",
      editor: "Fajar Nugroho",
      layout: "TIM Bayana",
      kertas: "Book Paper 70gr",
      berat: "334 gr",
      cetakan: "Pertama",
    },
    sinopsis: [
      "Buku ini merangkum cara mengubah bahan mentah menjadi produk pangan yang aman, tahan lama, dan bernilai jual.",
      "Materi disusun mengikuti alur kerja industri: penerimaan bahan, pengolahan, pengemasan, sampai pengendalian mutu dan penyimpanan.",
    ],
    daftar_isi: [
      "Pengantar Teknologi Pangan",
      "Sifat Bahan dan Perubahannya",
      "Pengolahan Panas dan Pendinginan",
      "Pengeringan dan Pengawetan",
      "Fermentasi Pangan",
      "Pengemasan dan Umur Simpan",
      "Pengendalian Mutu dan HACCP",
      "Sanitasi dan Keamanan Pangan",
      "Pengelolaan Limbah Industri",
      "Studi Kasus UMKM Pangan",
    ],
    rating: 4.6,
    jumlah_ulasan: 7,
    sample: true,
  },
];

/** Ambil satu buku dari slug. Mengembalikan undefined kalau tidak ada. */
export function ambilBuku(slug: string): Buku | undefined {
  return buku.find((b) => b.slug === slug);
}

/** Ulasan contoh untuk satu buku. */
export function ulasanBuku(slug: string) {
  return ULASAN_CONTOH.filter((u) => u.buku === slug);
}
