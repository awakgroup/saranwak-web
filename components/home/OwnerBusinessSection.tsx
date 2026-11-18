import { Megaphone, ArrowRight } from "lucide-react";

const WHATSAPP_NUMBER = "6281932097214";
const registerCafeUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi SaranWak, saya pemilik coffee shop di Padang dan tertarik mendaftarkan tempat saya di direktori Saranwak."
)}`;

export function OwnerBusinessSection() {
    return (
        <section id="owner-business" className="relative w-full">
            <div className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-[2.5rem] border border-[#FF5C35]/30 bg-gradient-to-r from-[#1E130B] via-[#2A180E] to-[#140D08] p-8 text-white shadow-2xl md:flex-row sm:p-12">
                {/* Background Ambient Glows */}
                <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[#FF5C35]/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 -right-20 h-64 w-64 rounded-full bg-[#FDBA74]/15 blur-3xl" />

                <div className="relative z-10 max-w-xl">
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#FF5C35]/40 bg-[#FF5C35]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FDBA74]">
                        <Megaphone className="h-3.5 w-3.5 text-[#FF5C35]" />
                        <span>KHUSUS PEMILIK KAFE</span>
                    </div>

                    <h2 className="font-sans text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                        Punya Coffee Shop di Padang? Daftarkan Spot Kamu.
                    </h2>

                    <p className="mt-2 text-xs leading-relaxed text-[#D4C9C3] sm:text-sm">
                        Jangkau ribuan mahasiswa, pegiat remote work, dan penikmat kopi di Sumatera Barat.
                        Publikasikan menu unggulan, fasilitas, dan suasana kedai Anda bersama direktori Saranwak.
                    </p>
                </div>

                <div className="relative z-10 shrink-0">
                    <a
                        href={registerCafeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#FF5C35] px-7 py-3.5 text-xs font-bold text-white shadow-[0_12px_32px_-4px_rgba(255,92,53,0.35)] transition-all duration-300 hover:scale-105 hover:bg-[#D8431F] hover:shadow-2xl active:scale-95 sm:text-sm"
                    >
                        <span>Daftarkan Sekarang</span>
                        <ArrowRight className="h-4 w-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}
