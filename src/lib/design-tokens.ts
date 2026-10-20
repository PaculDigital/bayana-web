// design-tokens.ts — Bayana Publishing
// Warna brand + data cerita overlay yang sinkron dengan 150 frame video hero.
// Konten "beats" di bawah bisa langsung diedit Bos tanpa menyentuh komponen.

export const brand = {
  name: "BAYANA",
  legal: "PT Bayana Hasana Duna",
  tagline: "Dari Naskah Menjadi Karya Abadi",
};

// ---------------------------------------------------------------------------
// FONT AK SEN SCRIPT (aksen tulisan tangan)
// Bos pilih: Caveat & Dancing Script untuk kata aksen DI DALAM tulisan utama.
// Font utama bersih (Poppins/Inter), hanya kata tertentu yang pakai script
// supaya terasa seperti tulisan manusia — persis cara Bramble meng-italic "wild."
// ---------------------------------------------------------------------------

// tipe satu segmen baris. script = pakai font tulisan tangan.
export type Seg = { t: string; script?: "caveat" | "dancing" };

export interface OverlayBeat {
  id: number;
  startFrame: number;
  endFrame: number;
  kicker?: string;                 // label kecil atas (uppercase, spasi lebar)
  // tiap baris = kumpulan segmen (normal + script aksen)
  lines: Seg[][];
  align?: "left" | "center" | "right";
  pos?: { x: number; y: number };  // persen dari viewport
  size?: "sm" | "md" | "lg" | "xl";
}

export const overlayStory: OverlayBeat[] = [
  {
    id: 1,
    startFrame: 1,
    endFrame: 60,
    kicker: "PERJALANAN ILMU",
    lines: [
      [{ t: "Setiap " }, { t: "karya", script: "dancing" }, { t: " berawal" }],
      [{ t: "dari satu halaman." }],
    ],
    align: "left",
    pos: { x: 7, y: 20 },
    size: "xl",
  },
  {
    id: 2,
    startFrame: 55,
    endFrame: 105,
    kicker: "KAMI RAWAT DENGAN TELITI",
    lines: [
      [{ t: "Terbit sebagai " }, { t: "buku", script: "dancing" }, { t: " abadi." }],
    ],
    align: "left",
    pos: { x: 7, y: 30 },
    size: "lg",
  },
  {
    id: 3,
    startFrame: 100,
    endFrame: 150,
    kicker: "INSPIRASI NYATA KARYA ABADI",
    lines: [
      [{ t: "Bayana", script: "dancing" }],
      [{ t: "Publishing" }],
    ],
    align: "left",
    pos: { x: 6, y: 26 },
    size: "xl",
  },
];
