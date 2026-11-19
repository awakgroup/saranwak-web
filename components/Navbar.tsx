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

    useEffect(() => {
        if (typeof window !== "undefined") {
            const checkMap = () => {
                const params = new URLSearchParams(window.location.search);
                setIsViewMapParam(params.get("view") === "map");
            };
            checkMap();
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
            {/* Top Header Navbar - Aligned with Stitch Landing Page dec9997f853d48fb839362e5da60ed89 */}
            <header className="sticky top-0 z-50 w-full border-b border-[#EBE5DC] bg-[#FAF7F2]/85 backdrop-blur-xl transition-all duration-300">
                <div className="mx-auto flex h-14 sm:h-20 max-w-7xl items-center justify-between gap-3 sm:gap-4 px-4 sm:px-8 lg:px-12">
                    {/* Brand & Location Pill */}
                    <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                        <Link href="/" className="group flex items-center gap-2.5 sm:gap-3">
                            <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#D8431F] via-[#FF5C35] to-[#FF7E5F] text-white shadow-md shadow-[#FF5C35]/25 transition-transform group-hover:scale-105 group-hover:rotate-3">
                                <Coffee className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <span className="font-sans text-lg sm:text-xl font-extrabold tracking-tight text-[#19120D]">
                                        Saranwak
                                    </span>
                                    <span className="rounded-full bg-[#FFECE5] px-2 py-0.5 text-[10px] sm:text-[11px] font-bold tracking-wide uppercase text-[#D8431F]">
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
                            className="group relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#EBE5DC] bg-white text-[#19120D] shadow-sm transition-all hover:border-[#FF5C35]/50 hover:bg-[#FAF4EE] hover:text-[#FF5C35] active:scale-95"
                        >
                            <Bookmark className={`h-4 w-4 sm:h-5 sm:w-5 text-[#FF5C35] transition-transform group-hover:scale-110 ${savedCount > 0 ? "fill-current" : ""}`} />
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full border-2 border-white bg-[#FF5C35] text-[9px] sm:text-[10px] font-black text-white shadow-sm">
                                {savedCount}
                            </span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Floating Navigation Dock - Exact match to Stitch layout: Home, Explore, Floating Map Center, Tersimpan, Tentang */}
            {!isPlaceDetailPage && (
                <nav
                    aria-label="Mobile Navigation"
                    className="pointer-events-none fixed inset-x-0 bottom-0 z-50 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] md:hidden"
                >
                    <div className="pointer-events-auto mx-auto flex max-w-md items-center justify-between border-t border-[#EBE5DC] bg-white/95 px-3 py-1.5 shadow-[0_-8px_30px_rgba(25,18,13,0.12)] backdrop-blur-2xl rounded-t-[28px]">
                        {/* 1. Home */}
                        <Link
                            href="/"
                            className={`flex min-w-[56px] flex-col items-center justify-center py-1 transition-all active:scale-90 ${
                                isHome ? "text-[#D8431F] font-extrabold" : "text-[#756A63] hover:text-[#19120D]"
                            }`}
                        >
                            <div className="flex h-7 w-8 items-center justify-center rounded-full">
                                <Home className="h-5 w-5" strokeWidth={isHome ? 2.5 : 2} />
                            </div>
                            <span className="mt-0.5 text-[10px] font-bold tracking-tight">Home</span>
                        </Link>

                        {/* 2. Explore */}
                        <Link
                            href="/places?category=coffee-shop"
                            className={`flex min-w-[56px] flex-col items-center justify-center py-1 transition-all active:scale-90 ${
                                isExploreView ? "text-[#D8431F] font-extrabold" : "text-[#756A63] hover:text-[#19120D]"
                            }`}
                        >
                            <div className="flex h-7 w-8 items-center justify-center rounded-full">
                                <Compass className="h-5 w-5" strokeWidth={isExploreView ? 2.5 : 2} />
                            </div>
                            <span className="mt-0.5 text-[10px] font-bold tracking-tight">Explore</span>
                        </Link>

                        {/* 3. Center Elevated Floating MAP Button matching Stitch */}
                        <Link
                            href="/map"
                            aria-label="Peta Spot Ngopi Padang"
                            className="relative -top-4 px-1 group transition-transform active:scale-90"
                        >
                            <div className={`flex h-14 w-14 items-center justify-center rounded-full shadow-[0_8px_24px_rgba(216,67,31,0.38)] ring-4 ring-[#FAF7F2] transition-all group-hover:scale-105 ${
                                isMapView
                                    ? "bg-[#19120D] text-white"
                                    : "bg-gradient-to-tr from-[#D8431F] via-[#FF5C35] to-[#FF7E5F] text-white"
                            }`}>
                                <MapPin className="h-6 w-6" strokeWidth={2.5} />
                            </div>
                        </Link>

                        {/* 4. Tersimpan */}
                        <Link
                            href="/saved"
                            className={`relative flex min-w-[56px] flex-col items-center justify-center py-1 transition-all active:scale-90 ${
                                isSavedView ? "text-[#D8431F] font-extrabold" : "text-[#756A63] hover:text-[#19120D]"
                            }`}
                        >
                            <div className="relative flex h-7 w-8 items-center justify-center rounded-full">
                                <Bookmark
                                    className={`h-5 w-5 ${savedCount > 0 ? "fill-current text-[#FF5C35]" : ""}`}
                                    strokeWidth={isSavedView ? 2.5 : 2}
                                />
                                {savedCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF5C35] px-1 text-[9px] font-black text-white shadow-sm">
                                        {savedCount}
                                    </span>
                                )}
                            </div>
                            <span className="mt-0.5 text-[10px] font-bold tracking-tight">Tersimpan</span>
                        </Link>

                        {/* 5. Tentang */}
                        <Link
                            href="/about"
                            className={`flex min-w-[56px] flex-col items-center justify-center py-1 transition-all active:scale-90 ${
                                isAbout ? "text-[#D8431F] font-extrabold" : "text-[#756A63] hover:text-[#19120D]"
                            }`}
                        >
                            <div className="flex h-7 w-8 items-center justify-center rounded-full">
                                <Info className="h-5 w-5" strokeWidth={isAbout ? 2.5 : 2} />
                            </div>
                            <span className="mt-0.5 text-[10px] font-bold tracking-tight">Tentang</span>
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
