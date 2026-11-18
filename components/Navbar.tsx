"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Compass,
    Sparkles,
    Info,
    Bookmark,
    Search,
    MessageCircle,
    Coffee,
} from "lucide-react";
import { useSavedPlaces } from "@/lib/saved-places";
import { SavedPlacesModal } from "@/components/SavedPlacesModal";

const desktopNavItems = [
    {
        label: "Explore",
        href: "/places?category=coffee-shop",
        match: "/places",
    },
    {
        label: "Rekomendasi",
        href: "/rekomendasi",
        match: "/rekomendasi",
    },
    {
        label: "Tentang",
        href: "/about",
        match: "/about",
    },
];

const mobileBottomNavItems = [
    {
        label: "Home",
        href: "/",
        icon: Home,
        isActive: (pathname: string) => pathname === "/",
    },
    {
        label: "Explore",
        href: "/places?category=coffee-shop",
        icon: Compass,
        isActive: (pathname: string) =>
            pathname === "/places" ||
            (pathname.startsWith("/places") && !pathname.match(/^\/places\/[^/]+$/)),
    },
    {
        label: "Rekomendasi",
        href: "/rekomendasi",
        icon: Sparkles,
        isActive: (pathname: string) => pathname.startsWith("/rekomendasi"),
    },
    {
        label: "Tentang",
        href: "/about",
        icon: Info,
        isActive: (pathname: string) => pathname.startsWith("/about"),
    },
];

const WHATSAPP_NUMBER = "6281932097214";

const whatsappMessage = encodeURIComponent(
    "Saya ingin bekerjasama dengan saranwak.com"
);

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

export function Navbar() {
    const pathname = usePathname();
    const { savedCount } = useSavedPlaces();
    const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

    // Sembunyikan navbar publik di area admin
    if (pathname.startsWith("/admin")) {
        return null;
    }

    // Cek apakah sedang berada di halaman detail tempat (/places/[slug])
    // Di halaman ini, bottom dock disembunyikan agar MobileStickyActions (arah maps & detail) bekerja maksimal
    const isPlaceDetailPage =
        pathname.startsWith("/places/") && pathname.split("/").filter(Boolean).length === 2;

    return (
        <>
            {/* Top Header Navbar */}
            <header className="sticky top-0 z-40 border-b border-[#E3DED4] bg-[#F4F1EA]/92 backdrop-blur-2xl">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-5">
                    {/* Mobile App Bar Layout */}
                    <div className="flex h-full w-full items-center justify-between md:hidden">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#D8431F] via-[#FF5C35] to-[#FF7E5F] text-white shadow-md shadow-[#FF5C35]/25 transition active:scale-95">
                                <Coffee className="h-5 w-5" />
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-sans text-lg font-extrabold tracking-tight text-[#19120D]">
                                        Saranwak
                                    </span>
                                    <span className="rounded-full bg-[#FFECE5] px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase text-[#D8431F]">
                                        Padang
                                    </span>
                                </div>
                                <span className="text-[10px] font-medium text-[#756A63]">
                                    Curated Coffee Guide
                                </span>
                            </div>
                        </Link>

                        <div className="flex items-center gap-1.5">
                            <Link
                                href="/places?category=coffee-shop"
                                aria-label="Cari Coffee Shop"
                                className="grid h-9 w-9 place-items-center rounded-full border border-[#EBE5DC] bg-white text-[#19120D] shadow-sm transition duration-150 active:scale-90 hover:text-[#FF5C35]"
                            >
                                <Search className="h-4 w-4" />
                            </Link>

                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Hubungi Saranwak via WhatsApp"
                                className="grid h-9 w-9 place-items-center rounded-full bg-[#19120D] text-white shadow-sm transition duration-150 active:scale-90 hover:bg-[#FF5C35]"
                            >
                                <MessageCircle className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Desktop Brand Logo */}
                    <Link
                        href="/"
                        className="group hidden min-w-0 items-center gap-3 md:flex"
                    >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#D8431F] via-[#FF5C35] to-[#FF7E5F] text-white shadow-md shadow-[#FF5C35]/25 transition duration-300 group-hover:scale-105 group-hover:rotate-3">
                            <Coffee className="h-6 w-6" />
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="font-sans text-xl font-extrabold tracking-tight text-[#19120D]">
                                    Saranwak
                                </span>
                                <span className="rounded-full bg-[#FFECE5] px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase text-[#D8431F]">
                                    Padang
                                </span>
                            </div>
                            <span className="text-xs font-medium text-[#756A63]">
                                Curated Coffee &amp; WFC Guide
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Center Pill Navigation */}
                    <nav className="hidden items-center gap-1 rounded-full bg-[#EAE4DC] px-3 py-1.5 text-xs font-bold shadow-sm md:flex lg:text-sm">
                        <Link
                            href="/"
                            className={[
                                "rounded-full px-5 py-2 transition-all duration-200",
                                pathname === "/"
                                    ? "bg-white text-[#19120D] shadow-sm font-bold"
                                    : "text-[#756A63] hover:text-[#19120D]",
                            ].join(" ")}
                        >
                            Home
                        </Link>
                        {desktopNavItems.map((item) => {
                            const isActive = pathname.startsWith(item.match);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={[
                                        "rounded-full px-5 py-2 transition-all duration-200",
                                        isActive
                                            ? "bg-white text-[#19120D] shadow-sm font-bold"
                                            : "text-[#756A63] hover:text-[#19120D]",
                                    ].join(" ")}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}

                        {/* Tersimpan Pill inside Navigation */}
                        <button
                            type="button"
                            onClick={() => setIsSavedModalOpen(true)}
                            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-semibold text-[#756A63] transition-all hover:text-[#19120D]"
                        >
                            <Bookmark className="h-4 w-4 text-[#FF5C35] transition-transform hover:scale-110" />
                            <span>Tersimpan</span>
                            {savedCount > 0 && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5C35] text-[10px] font-extrabold text-white shadow-sm">
                                    {savedCount}
                                </span>
                            )}
                        </button>
                    </nav>

                    {/* Desktop Right Action: Pasang Promo & Bookmark Icon */}
                    <div className="hidden items-center gap-3 md:flex">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-[#19120D] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#FF5C35] hover:shadow-lg active:scale-95 lg:text-sm"
                        >
                            <Sparkles className="h-4 w-4 text-[#FDBA74]" />
                            <span>Pasang Promo</span>
                        </a>

                        <button
                            type="button"
                            onClick={() => setIsSavedModalOpen(true)}
                            aria-label={`Lihat ${savedCount} cafe tersimpan`}
                            className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-[#EBE5DC] bg-white text-[#19120D] shadow-sm transition-all hover:border-[#FF5C35]/50 hover:bg-[#FAF4EE] hover:text-[#FF5C35] active:scale-95"
                        >
                            <Bookmark className="h-5 w-5 text-[#FF5C35] transition-transform group-hover:scale-110" />
                            {savedCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#FF5C35] text-[10px] font-black text-white shadow-sm">
                                    {savedCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Floating Navigation Dock (App-Style) */}
            {!isPlaceDetailPage && (
                <nav
                    aria-label="Mobile Navigation"
                    className="pointer-events-none fixed inset-x-0 bottom-3 z-50 px-3 pb-[env(safe-area-inset-bottom,0px)] md:hidden"
                >
                    <div className="pointer-events-auto mx-auto flex max-w-[390px] items-center justify-around gap-1 rounded-full border border-[#EBE5DC] bg-white/95 p-1.5 shadow-[0_16px_40px_rgba(25,18,13,0.18)] backdrop-blur-2xl">
                        {mobileBottomNavItems.map((item) => {
                            const active = item.isActive(pathname);
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={[
                                        "flex flex-1 flex-col items-center justify-center rounded-full py-1.5 transition-all duration-150 active:scale-90",
                                        active
                                            ? "bg-[#19120D] text-white shadow-sm"
                                            : "text-[#756A63] hover:bg-[#FAF7F2] hover:text-[#19120D]",
                                    ].join(" ")}
                                >
                                    <Icon
                                        className={[
                                            "h-4 w-4 transition-transform duration-200",
                                            active ? "scale-110 text-[#FF5C35]" : "text-[#756A63]",
                                        ].join(" ")}
                                        strokeWidth={active ? 2.5 : 2}
                                    />
                                    <span className="mt-0.5 text-[10px] font-bold tracking-tight">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}

                        {/* Bookmark in Mobile Dock */}
                        <button
                            type="button"
                            onClick={() => setIsSavedModalOpen(true)}
                            className="relative flex flex-1 flex-col items-center justify-center rounded-full py-1.5 text-[#756A63] transition-all duration-150 hover:bg-[#FAF7F2] hover:text-[#19120D] active:scale-90"
                        >
                            <Bookmark
                                className={`h-4 w-4 transition-transform duration-200 ${
                                    savedCount > 0 ? "fill-current text-[#FF5C35]" : "text-[#756A63]"
                                }`}
                                strokeWidth={savedCount > 0 ? 2.5 : 2}
                            />
                            <span className="mt-0.5 text-[10px] font-bold tracking-tight">
                                Tersimpan
                            </span>
                            {savedCount > 0 && (
                                <span className="absolute -top-1 right-2 grid h-4 min-w-4 place-items-center rounded-full bg-[#FF5C35] px-1 text-[9px] font-black text-white shadow-sm">
                                    {savedCount}
                                </span>
                            )}
                        </button>
                    </div>
                </nav>
            )}

            {/* Saved Places Modal */}
            <SavedPlacesModal
                isOpen={isSavedModalOpen}
                onClose={() => setIsSavedModalOpen(false)}
            />
        </>
    );
}
