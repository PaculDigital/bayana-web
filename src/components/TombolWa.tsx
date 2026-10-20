// =============================================================
// TOMBOL WA MELAYANG (floating) — Bayana Publishing
// Dokumen revisi butir 1: tombol WA selalu standby, posisi tidak
// berubah meski halaman digeser, diarahkan ke 085111555248.
// =============================================================

const NOMOR = "6285111555248"; // 085111555248 → format internasional

export default function TombolWa() {
  return (
    <a
      href={`https://wa.me/${NOMOR}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp Bayana Publishing"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#128C4A] shadow-[0_8px_24px_rgba(18,140,74,0.4)] transition-transform duration-200 hover:scale-105"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 text-white" fill="currentColor" aria-hidden>
        <path d="M16.04 3C9.4 3 4 8.4 4 15.03c0 2.12.56 4.19 1.62 6.02L4 29l8.13-1.58a12.1 12.1 0 0 03.9.64h.01c6.64 0 12.04-5.4 12.04-12.03C28.08 8.4 22.68 3 16.04 3zm0 21.98h-.01a10 10 0 0 1-3.6-.68l-.26-.1-4.82.94.95-4.7-.17-.28a9.9 9.9 0 0 1-1.53-5.34c0-5.5 4.48-9.97 10-9.97 2.66 0 5.17 1.04 7.05 2.92a9.9 9.9 0 0 1 2.94 7.06c0 5.5-4.48 9.98-9.95 9.98zm5.47-7.46c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.09 3.2 5.07 4.48.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
      </svg>
    </a>
  );
}
