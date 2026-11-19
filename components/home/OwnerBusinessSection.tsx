import { Megaphone, ArrowRight } from "lucide-react";

const WHATSAPP_NUMBER = "6281932097214";
const registerCafeUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi SaranWak, saya pemilik coffee shop di Padang dan tertarik mendaftarkan tempat saya di direktori Saranwak."
)}`;

export function OwnerBusinessSection() {
    return (
        <section id="owner-business" className="relative w-full">
            <div className="relative flex flex-col items-center justify-between gap-5 overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-[#FF5C35]/30 bg-gradient-to-r from-[#1E130B] via-[#2A180E] to-[#140D08] p-4.5 text-white shadow-xl md:flex-row sm:p-12">
                {/* Background Ambient Glows */}
                <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[#FF5C35]/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 -right-20 h-64 w-64 rounded-full bg-[#FDBA74]/15 blur-3xl" />

                <div className="relative z-10 max-w-xl text-center md:text-left">
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#FF5C35]/40 bg-[#FF5C35]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FDBA74] sm:text-xs">
                        <Megaphone className="h-3 w-3 text-[#FF5C35]" />
                        <span>KHUSUS PEMILIK KAFE</span>
                    </div>

                    <h2 className="font-sans text-base sm:text-3xl font-extrabold leading-tight text-white">
                        Punya Coffee Shop di Padang? Daftarkan Spot Kamu.
                    </h2>

                    <p className="mt-1 text-[11px] leading-relaxed text-[#D4C9C3] sm:mt-2 sm:text-sm">
                        Jangkau ribuan mahasiswa, pegiat remote work, dan penikmat kopi di Sumatera Barat.
                        Publikasikan menu unggulan, fasilitas, dan suasana kedai Anda bersama direktori Saranwak.
                    </p>
                </div>

                <div className="relative z-10 shrink-0 w-full md:w-auto">
                    <a
                        href={registerCafeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full md:w-auto justify-center items-center gap-2 rounded-xl sm:rounded-2xl bg-[#FF5C35] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#D8431F] active:scale-95 sm:px-7 sm:py-3.5 sm:text-sm"
                    >
                        <span>Daftarkan Sekarang</span>
                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}
