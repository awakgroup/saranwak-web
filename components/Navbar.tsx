"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Compass,
    MapPin,
    Info,
    Bookmark,
    Megaphone,
    Coffee,
    Download,
} from "lucide-react";
import { useSavedPlaces } from "@/lib/saved-places";
import { SavedPlacesModal } from "@/components/SavedPlacesModal";

const WHATSAPP_NUMBER = "6281932097214";
const whatsappPromoMessage = encodeURIComponent(
    "Hi SaranWak, saya tertarik bekerjasama untuk promosi coffee shop"
);
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappPromoMessage}`;

export function Navbar() {
    const pathname = usePathname();
    const [isViewMapParam, setIsViewMapParam] = useState(false);
    const { savedCount } = useSavedPlaces();
    const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const checkMap = () => {
                const params = new URLSearchParams(window.location.search);
                setIsViewMapParam(params.get("view") === "map");
            };
            checkMap();

            const standalone =
                window.matchMedia("(display-mode: standalone)").matches ||
                (window.navigator as unknown as { standalone?: boolean }).standalone === true;
            setIsStandalone(Boolean(standalone));

            window.addEventListener("popstate", checkMap);
            return () => window.removeEventListener("popstate", checkMap);
        }
    }, [pathname]);

    // Sembunyikan navbar publik di area admin
    if (pathname.startsWith("/admin")) {
        return null;
    }

    // Normalisasi pathname agar kompatibel dengan trailingSlash: true
    const cleanPathname = (pathname ? pathname.replace(/\/+$/, "") : "") || "/";
    const pathSegments = cleanPathname.split("/").filter(Boolean);
    const isPlaceDetailPage = pathSegments.length === 2 && pathSegments[0] === "places";

    const isMapView = cleanPathname === "/map" || (cleanPathname === "/places" && isViewMapParam);
    const isExploreView = cleanPathname === "/places" && !isViewMapParam;
    const isHome = cleanPathname === "/";
    const isAbout = cleanPathname === "/about" || cleanPathname.startsWith("/about/");
    const isSavedView = cleanPathname === "/saved" || cleanPathname === "/tersimpan";

    const mobileBottomNavItems = [
        {
            label: "Home",
            href: "/",
            icon: Home,
            isActive: isHome,
        },
        {
            label: "Explore",
            href: "/places?category=coffee-shop",
            icon: Compass,
            isActive: isExploreView,
        },
        {
            label: "Map",
            href: "/map",
            icon: MapPin,
            isActive: isMapView,
        },
        {
            label: "Tentang",
            href: "/about",
            icon: Info,
            isActive: isAbout,
        },
    ];

    return (
        <>
            {/* Top Header Navbar - Aligned with Stitch Landing Page & Mobile 3f54a1c6760d4badb78d709f20d14900 */}
            <header className="sticky top-0 z-50 w-full border-b border-[#EBE5DC] bg-[#FAF7F2]/90 backdrop-blur-xl transition-all duration-300">
                <div className="mx-auto flex h-14 sm:h-20 max-w-7xl items-center justify-between gap-3 sm:gap-4 px-4 sm:px-8 lg:px-12">
                    {/* Brand & Location Pill */}
                    <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                        <Link href="/" className="group flex items-center gap-2.5 sm:gap-3">
                            <div className="flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-full sm:rounded-2xl bg-[#ac3311] sm:bg-gradient-to-tr sm:from-[#D8431F] sm:via-[#FF5C35] sm:to-[#FF7E5F] text-white shadow-sm sm:shadow-md transition-transform group-hover:scale-105">
                                <Coffee className="h-4.5 w-4.5 sm:h-6 sm:w-6" />
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="font-sans text-[18px] sm:text-xl font-bold sm:font-black tracking-tight text-[#0d0401] sm:text-[#19120D]">
                                        Saranwak
                                    </span>
                                    <span className="rounded-full bg-[#ffdbd1] sm:bg-[#FFECE5] px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[#3c0800] sm:text-[#D8431F]">
                                        Padang
                                    </span>
                                </div>
                                <span className="hidden text-xs font-medium text-[#756A63] sm:inline">
                                    Curated Coffee &amp; WFC Guide
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Tabs - Exact match to Stitch Pill Bar */}
                    <nav className="hidden items-center gap-1 rounded-full bg-[#EAE4DC] px-3 py-2 md:flex">
                        {/* 1. Home */}
                        <Link
                            href="/"
                            className={[
                                "rounded-full text-xs lg:text-sm transition-all",
                                isHome
                                    ? "bg-white text-[#19120D] shadow-sm font-bold px-6 py-2"
                                    : "px-5 py-2 font-semibold text-[#756A63] hover:text-[#19120D]",
                            ].join(" ")}
                        >
                            Home
                        </Link>

                        {/* 2. Explore */}
                        <Link
                            href="/places?category=coffee-shop"
                            className={[
                                "rounded-full text-xs lg:text-sm transition-all",
                                isExploreView
                                    ? "bg-white text-[#19120D] shadow-sm font-bold px-6 py-2"
                                    : "px-5 py-2 font-semibold text-[#756A63] hover:text-[#19120D]",
                            ].join(" ")}
                        >
                            Explore
                        </Link>

                        {/* 3. Map */}
                        <Link
                            href="/map"
                            className={[
                                "rounded-full text-xs lg:text-sm transition-all",
                                isMapView
                                    ? "bg-white text-[#19120D] shadow-sm font-bold px-6 py-2"
                                    : "px-5 py-2 font-semibold text-[#756A63] hover:text-[#19120D]",
                            ].join(" ")}
                        >
                            Map
                        </Link>

                        {/* 4. Tentang */}
                        <Link
                            href="/about"
                            className={[
                                "rounded-full text-xs lg:text-sm transition-all",
                                isAbout
                                    ? "bg-white text-[#19120D] shadow-sm font-bold px-6 py-2"
                                    : "px-5 py-2 font-semibold text-[#756A63] hover:text-[#19120D]",
                            ].join(" ")}
                        >
                            Tentang
                        </Link>

                        {/* 5. Tersimpan Pill */}
                        <Link
                            href="/saved"
                            className={[
                                "rounded-full text-xs lg:text-sm transition-all inline-flex items-center gap-1.5",
                                isSavedView
                                    ? "bg-white text-[#19120D] shadow-sm font-bold px-5 py-2"
                                    : "px-4 py-2 font-semibold text-[#756A63] hover:text-[#19120D]",
                            ].join(" ")}
                        >
                            <Bookmark className="h-4 w-4 text-[#FF5C35] transition-transform group-hover:scale-110" />
                            <span>Tersimpan</span>
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5C35] text-[10px] font-extrabold text-white shadow-sm">
                                {savedCount}
                            </span>
                        </Link>
                    </nav>

                    {/* Right Action CTA */}
                    <div className="flex items-center gap-3">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hidden cursor-pointer items-center gap-2 rounded-full bg-[#19120D] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:bg-[#FF5C35] hover:shadow-lg active:scale-95 sm:inline-flex lg:text-sm"
                        >
                            <Megaphone className="h-4 w-4 text-[#FDBA74]" />
                            <span>Pasang Promo</span>
                        </a>

                        <Link
                            href="/saved"
                            aria-label={`Lihat ${savedCount} tempat tersimpan`}
                            title={`${savedCount} Tempat Tersimpan`}
                            className="group relative flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#EBE5DC] bg-white text-[#19120D] shadow-xs transition-all hover:border-[#FF5C35]/50 hover:bg-[#FAF4EE] hover:text-[#FF5C35] active:scale-95"
                        >
                            <Bookmark className={`h-4 w-4 sm:h-5 sm:w-5 text-[#FF5C35] transition-transform group-hover:scale-110 ${savedCount > 0 ? "fill-current" : ""}`} />
                            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 sm:h-5 sm:w-5 items-center justify-center rounded-full border border-white sm:border-2 bg-[#FF5C35] text-[8px] sm:text-[10px] font-black text-white shadow-xs">
                                {savedCount}
                            </span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Floating Install App Pill */}
            {!isPlaceDetailPage && !isStandalone && (
                <div
                    className="fixed right-3.5 z-40 block md:hidden transition-all duration-300"
                    style={{ bottom: "calc(4.25rem + env(safe-area-inset-bottom, 0px))" }}
                >
                    <button
                        type="button"
                        onClick={() => {
                            if (typeof window !== "undefined") {
                                window.dispatchEvent(new CustomEvent("saranwak:install-pwa"));
                            }
                        }}
                        aria-label="Pasang Aplikasi Saranwak"
                        className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#291c14] hover:bg-[#0d0401] text-[#ffdbd1] shadow-[0_8px_20px_rgba(41,28,20,0.25)] border border-[#ffdbd1]/30 transition-all duration-200 active:scale-95 group cursor-pointer backdrop-blur-md"
                    >
                        <Download className="h-3.5 w-3.5 text-[#ffdbd1] group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-semibold text-[#ffdbd1] tracking-wide whitespace-nowrap">
                            Install App
                        </span>
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#ac3311] border-2 border-[#FAF7F2] animate-pulse" />
                    </button>
                </div>
            )}

            {/* Mobile Bottom Fixed Navigation Dock - Grounded firmly to bottom */}
            {!isPlaceDetailPage && (
                <nav
                    aria-label="Mobile Navigation"
                    className="fixed bottom-0 inset-x-0 z-50 bg-[#FAF7F2]/98 backdrop-blur-xl border-t border-[#E5DFD5] pb-[env(safe-area-inset-bottom,0px)] md:hidden shadow-[0_-1px_3px_rgba(0,0,0,0.03)]"
                >
                    <div className="mx-auto flex h-14 max-w-md items-center justify-around px-2">
                        {/* 1. Home */}
                        <Link
                            href="/"
                            className={`flex min-w-[50px] flex-col items-center justify-center py-1 transition-colors active:scale-95 ${
                                isHome ? "text-[#ac3311] font-bold" : "text-[#756A63] hover:text-[#19120D]"
                            }`}
                        >
                            <Home className="h-5 w-5" strokeWidth={isHome ? 2.5 : 2} />
                            <span className="text-[10px] mt-0.5 font-semibold">Home</span>
                        </Link>

                        {/* 2. Explore */}
                        <Link
                            href="/places?category=coffee-shop"
                            className={`flex min-w-[50px] flex-col items-center justify-center py-1 transition-colors active:scale-95 ${
                                isExploreView ? "text-[#ac3311] font-bold" : "text-[#756A63] hover:text-[#19120D]"
                            }`}
                        >
                            <Compass className="h-5 w-5" strokeWidth={isExploreView ? 2.5 : 2} />
                            <span className="text-[10px] mt-0.5 font-semibold">Explore</span>
                        </Link>

                        {/* 3. Center Elevated Floating MAP Button */}
                        <Link
                            href="/map"
                            aria-label="Peta Spot Ngopi Padang"
                            className="relative -top-2.5 px-1 group transition-transform active:scale-95 flex items-center justify-center"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ac3311] text-white ring-4 ring-[#FAF7F2] shadow-md transition-all group-hover:scale-105">
                                <MapPin className="h-5 w-5 text-white" strokeWidth={2.5} />
                            </div>
                        </Link>

                        {/* 4. Tersimpan */}
                        <Link
                            href="/saved"
                            className={`relative flex min-w-[50px] flex-col items-center justify-center py-1 transition-colors active:scale-95 ${
                                isSavedView ? "text-[#ac3311] font-bold" : "text-[#756A63] hover:text-[#19120D]"
                            }`}
                        >
                            <div className="relative flex items-center justify-center">
                                <Bookmark
                                    className={`h-5 w-5 ${savedCount > 0 ? "fill-current text-[#ac3311]" : ""}`}
                                    strokeWidth={isSavedView ? 2.5 : 2}
                                />
                                {savedCount > 0 && (
                                    <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ac3311] text-[8px] font-bold text-white shadow-xs">
                                        {savedCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] mt-0.5 font-semibold">Tersimpan</span>
                        </Link>

                        {/* 5. Tentang */}
                        <Link
                            href="/about"
                            className={`flex min-w-[50px] flex-col items-center justify-center py-1 transition-colors active:scale-95 ${
                                isAbout ? "text-[#ac3311] font-bold" : "text-[#756A63] hover:text-[#19120D]"
                            }`}
                        >
                            <Info className="h-5 w-5" strokeWidth={isAbout ? 2.5 : 2} />
                            <span className="text-[10px] mt-0.5 font-semibold">Tentang</span>
                        </Link>
                    </div>
                </nav>
            )}

            {/* Saved Places Modal (For Quick Pop-up if triggered anywhere) */}
            <SavedPlacesModal
                isOpen={isSavedModalOpen}
                onClose={() => setIsSavedModalOpen(false)}
            />
        </>
    );
}
