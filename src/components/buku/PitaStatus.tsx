// PitaStatus.tsx — 4 langkah status pesanan.
//
// Urutan tetap (putusan Bos, mengikuti gambar "Pesanan Saya"):
//   Belum Bayar → Dikemas → Dikirim → Beri Penilaian

import { STATUS, LABEL_STATUS, type Status } from "@/lib/db";

export default function PitaStatus({ status }: { status: Status }) {
  const kini = STATUS.indexOf(status);

  return (
    <div className="pita-langkah" role="list"
      aria-label={`Status pesanan: ${LABEL_STATUS[status]}`}>
      {STATUS.map((s, i) => {
        const lewat = i < kini;
        const sekarang = i === kini;
        const kelas = [
          "langkah",
          lewat ? "lewat" : "",
          sekarang ? "kini" : "",
        ].join(" ").trim();
        return (
          <div className={kelas} key={s} role="listitem">
            <div className="titik">{lewat ? "✓" : i + 1}</div>
            <p>{LABEL_STATUS[s]}</p>
          </div>
        );
      })}
    </div>
  );
}
