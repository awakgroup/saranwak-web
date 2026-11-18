"use client";

import Link from "next/link";
import { Coffee, Navigation, ArrowRight } from "lucide-react";
import { useSavedPlaces } from "@/lib/saved-places";

const WHATSAPP_NUMBER = "6281932097214";

const promoPartnershipUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi SaranWak, saya tertarik bekerjasama untuk promosi coffee shop"
)}`;

const claimCafeUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi SaranWak, saya pemilik coffee shop di Padang dan ingin klaim / mendaftarkan tempat saya."
)}`;

const whatsappOfficialUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

export function Footer() {
    const { savedCount } = useSavedPlaces();

    return (
        <footer className="w-full border-t border-[#2A1D15] bg-[#140D08] text-[#F2F0ED]">
            <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
                <div className="grid grid-cols-1 gap-8 pb-12 md:grid-cols-12 lg:gap-12">
                    {/* About Column */}
                    <div className="flex flex-col gap-4 md:col-span-5">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5C35] text-white shadow-sm">
                                <Coffee className="h-5 w-5" />
                            </div>
                            <span className="font-sans text-xl font-extrabold tracking-tight text-white">
                                Saranwak
                            </span>
                        </Link>

                        <p className="max-w-sm text-sm leading-relaxed text-[#BDB2AB]">
                            Local guide first. Hype later. Kurasi independen kedai kopi, spot WFC kondusif, dan ruang temu kreatif di seluruh pelosok Kota Padang.
                        </p>

                        <div className="mt-1 flex items-center gap-2 text-xs font-bold text-[#FDBA74]">
                            <Navigation className="h-4 w-4 shrink-0 text-[#FF5C35]" />
                            <span>Khatib Sulaiman • Rimbo Kaluang • Pondok • Raden Saleh</span>
                        </div>
                    </div>

                    {/* Navigation Links Column */}
                    <div className="flex flex-col gap-3 md:col-span-3">
                        <span className="text-xs font-black uppercase tracking-wider text-white">
                            Navigasi Panduan
                        </span>
                        <nav className="flex flex-col gap-2.5 text-xs sm:text-sm">
                            <Link
                                href="/"
                                className="font-bold text-[#FDBA74] transition-colors hover:text-white"
                            >
                                Home
                            </Link>
                            <Link
                                href="/places?category=coffee-shop"
                                className="text-[#BDB2AB] transition-colors hover:text-white"
                            >
                                Explore Spot Kopi
                            </Link>
                            <Link
                                href="/places?view=map"
                                className="text-[#BDB2AB] transition-colors hover:text-white"
                            >
                                Peta &amp; Navigasi (Map)
                            </Link>
                            <Link
                                href="/about"
                                className="text-[#BDB2AB] transition-colors hover:text-white"
                            >
                                Tentang Saranwak
                            </Link>
                            <Link
                                href="/places?saved=1"
                                className="flex items-center gap-1.5 text-[#BDB2AB] transition-colors hover:text-white"
                            >
                                <span>Tempat Tersimpan</span>
                                <span className="rounded-full bg-[#FF5C35]/30 px-1.5 py-0.5 text-[10px] font-bold text-[#FDBA74]">
                                    {savedCount}
                                </span>
                            </Link>
                        </nav>
                    </div>

                    {/* Business Partners Column */}
                    <div className="flex flex-col gap-3 md:col-span-4">
                        <span className="text-xs font-black uppercase tracking-wider text-white">
                            Untuk Pemilik Kafe
                        </span>
                        <p className="text-xs leading-relaxed text-[#BDB2AB] sm:text-sm">
                            Punya coffee shop, workspace, atau program promosi di Kota Padang? Kurasi kedai Anda bersama Saranwak.
                        </p>

                        <div className="flex flex-col gap-2 pt-2">
                            <a
                                href={promoPartnershipUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 text-xs font-bold text-[#FF5C35] transition-colors hover:text-[#FDBA74] sm:text-sm"
                            >
                                <span>Kerja Sama &amp; Pasang Banner</span>
                                <ArrowRight className="h-4 w-4" />
                            </a>

                            <a
                                href={claimCafeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-[#BDB2AB] transition-colors hover:text-white sm:text-sm"
                            >
                                Klaim / Daftarkan Kafe Anda
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright Sub-Footer */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-[#80756F] sm:flex-row">
                    <p>© 2026 Saranwak. Built from Padang with passion. All rights reserved.</p>
                    <div className="flex flex-wrap items-center gap-6">
                        <Link href="/about" className="transition-colors hover:text-white">
                            Kebijakan Privasi
                        </Link>
                        <a
                            href="https://instagram.com/saranwak"
                            target="_blank"
                            rel="noreferrer"
                            className="transition-colors hover:text-white"
                        >
                            Instagram @saranwak
                        </a>
                        <a
                            href={whatsappOfficialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="transition-colors hover:text-white"
                        >
                            WhatsApp Official
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}