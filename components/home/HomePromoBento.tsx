"use client";

import { Flame, ArrowRight, Calendar, Sparkles } from "lucide-react";

const WHATSAPP_NUMBER = "6281932097214";

const spotlightWaUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Halo Saranwak, saya tertarik booking Slot Promo Spotlight di etalase utama Saranwak."
)}`;

const eventWaUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Halo Saranwak, saya mau mendaftarkan event/workshop coffee shop saya di Saranwak."
)}`;

export function HomePromoBento() {
    return (
        <section className="relative w-full">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#FF5C35]">
                        PROMO &amp; PENAWARAN SPESIAL
                    </span>
                    <span>✨</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Slot 1: Promo Spotlight */}
                <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#FF5C35]/40 bg-gradient-to-br from-[#2A180E] via-[#1E130B] to-[#140D08] p-6 text-white shadow-md transition-all duration-300 hover:border-[#FF5C35] hover:shadow-xl sm:p-7">
                    {/* Ambient glow */}
                    <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br from-[#FF5C35]/20 to-[#FDBA74]/10 blur-2xl" />

                    <div className="relative z-10 mb-4 flex items-start justify-between gap-4">
                        <span className="flex items-center gap-1.5 rounded-full border border-[#FF5C35]/40 bg-[#FF5C35]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FDBA74]">
                            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#FDBA74]" />
                            <span>SLOT PROMO • SPOTLIGHT</span>
                        </span>
                        <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-semibold text-white/70">
                            Slot #01
                        </span>
                    </div>

                    <div className="relative z-10 mb-6">
                        <h3 className="font-sans text-xl font-extrabold leading-tight text-white transition-colors group-hover:text-[#FDBA74] sm:text-2xl">
                            Pasang Promo atau Event Kafe Kamu di Sini
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-[#D4C9C3] sm:text-sm">
                            Jangkau ribuan penikmat kopi &amp; pekerja WFC di Kota Padang setiap hari. Tampilkan
                            diskon spesial, launch menu baru, atau program loyalitas kedaimu.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-[#FDBA74]">
                            <Flame className="h-4 w-4 text-[#FF5C35]" />
                            <span>Mulai Rp 50rb / Pekan</span>
                        </span>

                        <a
                            href={spotlightWaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF5C35] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#D8431F] hover:shadow-lg active:scale-95"
                        >
                            <span>Pasang Banner Promo</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                    </div>
                </div>

                {/* Slot 2: Event & Workshop Kedai */}
                <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#2A180E] via-[#1E130B] to-[#140D08] p-6 text-white shadow-md transition-all duration-300 hover:border-[#FDBA74]/50 hover:shadow-xl sm:p-7">
                    {/* Ambient glow */}
                    <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br from-[#FDBA74]/20 to-[#FF5C35]/10 blur-2xl" />

                    <div className="relative z-10 mb-4 flex items-start justify-between gap-4">
                        <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#D4C9C3]">
                            <Calendar className="h-3.5 w-3.5 text-[#FDBA74]" />
                            <span>SLOT EVENT KEDAI • UPCOMING</span>
                        </span>
                        <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-semibold text-white/70">
                            Slot #02
                        </span>
                    </div>

                    <div className="relative z-10 mb-6">
                        <h3 className="font-sans text-xl font-extrabold leading-tight text-white transition-colors group-hover:text-[#FDBA74] sm:text-2xl">
                            Punya Event, Cupping Session, atau Workshop?
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-[#D4C9C3] sm:text-sm">
                            Publikasikan agenda event, kompetisi latte art, kelas seduh manual, atau live
                            acoustic showcase kafe kamu langsung di etalase utama Saranwak.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-[#D6CECA]">
                            <Sparkles className="h-4 w-4 text-[#FF5C35]" />
                            <span>Kurasi Komunitas Padang</span>
                        </span>

                        <a
                            href={eventWaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-md active:scale-95"
                        >
                            <span>Daftarkan Event</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
