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
            {/* Mobile Bento Banner - Exact match to Stitch Screen 3f54a1c6760d4badb78d709f20d14900 */}
            <div className="block sm:hidden w-full px-4 mt-5">
                <div className="relative rounded-2xl overflow-hidden bg-[#291c14] p-4 text-white shadow-md border border-white/10 flex flex-col justify-between group">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay group-hover:scale-105 transition-transform duration-500"
                        style={{
                            backgroundImage: `url("https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80")`,
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0d0401] via-[#0d0401]/85 to-[#0d0401]/40" />
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#ff6e48]/20 blur-2xl pointer-events-none" />
                    <div className="absolute top-2 right-16 text-[#ffdbd1]/30 select-none pointer-events-none font-bold text-[18px]">✦</div>
                    <div className="absolute bottom-8 right-24 text-[#ffddb8]/30 select-none pointer-events-none font-bold text-[12px]">✦</div>

                    <div className="relative z-10 flex items-start justify-between gap-2.5 mb-2">
                        <div className="flex flex-col items-start flex-1 min-w-0">
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ac3311]/30 backdrop-blur-sm border border-[#ffdbd1]/30 text-[#ffddb8] text-[9.5px] font-bold tracking-wider uppercase mb-1.5">
                                <Sparkles className="h-2.5 w-2.5 text-[#ffddb8]" />
                                <span>SLOT PROMOSI • MITRA KEDAI</span>
                            </div>
                            <h3 className="text-[15px] font-extrabold text-white tracking-tight leading-snug">
                                Punya Promo atau Agenda Event? <span className="text-[13px]">✨</span>
                            </h3>
                            <p className="text-[11.5px] text-white/90 mt-0.5 leading-snug max-w-[220px]">
                                Tampilkan diskon nugas, workshop, atau cupping session kedaimu di etalase Saranwak.
                            </p>
                        </div>

                        <div className="shrink-0 relative flex flex-col items-center justify-center">
                            <div className="w-14 h-14 rounded-xl bg-[#ac3311]/25 backdrop-blur-md border border-dashed border-[#ffdbd1]/60 flex flex-col items-center justify-center p-1 text-center shadow-inner group-hover:scale-105 transition-transform">
                                <Flame className="h-3.5 w-3.5 text-[#ffdbd1] mb-0.5" />
                                <span className="text-[7.5px] font-extrabold uppercase text-[#ffdbd1] tracking-wider leading-none">
                                    DIBUKA
                                </span>
                                <span className="text-[7.5px] text-[#ffddb8] leading-none mt-0.5">Mulai 50rb</span>
                            </div>
                            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#ffdbd1] flex items-center justify-center text-[#3c0800] text-[8px] font-bold shadow-xs">
                                ★
                            </span>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-2 pt-2.5 mt-1 border-t border-white/10">
                        <a
                            href={eventWaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#ac3311] hover:bg-[#881f00] text-white text-[12px] font-bold shadow-xs transition-all active:scale-[0.98] group/btn"
                        >
                            <span className="truncate">Daftarkan Event / Promo</span>
                            <ArrowRight className="h-3.5 w-3.5 text-white font-bold transition-transform group-hover/btn:translate-x-0.5" />
                        </a>
                        <a
                            href={spotlightWaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-semibold transition-all active:scale-[0.98] backdrop-blur-sm shrink-0"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ffdbd1] animate-pulse shrink-0" />
                            <span className="truncate">Hubungi Admin</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Desktop 2-Column Bento Grid */}
            <div className="hidden sm:block">
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
            </div>
        </section>
    );
}
