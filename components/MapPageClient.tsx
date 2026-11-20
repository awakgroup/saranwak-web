"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
    ChevronRight,
    Compass,
    LayoutGrid,
    MapPin,
    Navigation,
    Search,
    SlidersHorizontal,
    X,
    Coffee,
    Laptop,
    Zap,
    Moon,
    Sun,
} from "lucide-react";
import type { Place } from "@/types/database";
import {
    calculateDistanceKm,
    getPlaceCoordinates,
} from "@/lib/place-coordinates";
import { getPlaceOpenStatus } from "@/lib/opening-hours";

const PlacesMapView = dynamic(
    () => import("@/components/PlacesMapView").then((mod) => mod.PlacesMapView),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-[520px] w-full items-center justify-center rounded-[32px] border border-[#EBE5DC] bg-[#FAF7F2] text-[#756A63]">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#FF5C35] border-t-transparent" />
                    <p className="text-sm font-bold text-[#19120D] animate-pulse">
                        Memuat peta interaktif spot ngopi Padang...
                    </p>
                </div>
            </div>
        ),
    }
);

interface MapPageClientProps {
    places: Place[];
}

function placeMatchesKeywords(place: Place, keywords: string[]): boolean {
    const normalized = keywords.map((k) => k.toLowerCase().trim());

    // 1. Cek dari place_tags relasi
    if (place.place_tags && Array.isArray(place.place_tags)) {
        for (const pt of place.place_tags) {
            const tagObj = (pt as any)?.tags;
            if (tagObj) {
                const slug = (tagObj.slug || "").toLowerCase();
                const name = (tagObj.name || "").toLowerCase();
                if (normalized.some((k) => slug === k || name === k || slug.includes(k) || name.includes(k))) {
                    return true;
                }
            }
        }
    }

    // 2. Cek dari nama, deskripsi, area, alamat, karakteristik
    const textBlob = `${place.name} ${place.short_description || ""} ${place.description || ""} ${place.vibe || ""} ${place.area || ""}`.toLowerCase();
    return normalized.some((k) => textBlob.includes(k));
}

export function MapPageClient({ places: initialPlaces }: MapPageClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedArea, setSelectedArea] = useState<string>("all");
    const [activeFilterChip, setActiveFilterChip] = useState<"all" | "wfc" | "open" | "plug" | "24h" | "sunset">("all");
    const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
    const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [isNearbyActive, setIsNearbyActive] = useState(false);

    const handleLocateUser = () => {
        if (isNearbyActive) {
            setIsNearbyActive(false);
            return;
        }

        if (typeof window === "undefined" || !("geolocation" in navigator)) {
            alert("Geolocation tidak didukung oleh browser ini.");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserCoords({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
                setIsNearbyActive(true);
                setIsLocating(false);
            },
            (err) => {
                console.error("Gagal mendapatkan lokasi:", err);
                alert("Gagal membaca lokasi. Pastikan izin lokasi (GPS) diaktifkan.");
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const filteredPlaces = useMemo(() => {
        let result = initialPlaces;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            result = result.filter((p) => {
                const combined = `${p.name} ${p.area || ""} ${p.address || ""} ${p.short_description || ""} ${p.description || ""}`.toLowerCase();
                return combined.includes(q) || placeMatchesKeywords(p, [q]);
            });
        }

        if (selectedArea !== "all") {
            const normalizedArea = selectedArea.toLowerCase().trim();
            result = result.filter((p) => {
                const combined = `${p.area || ""} ${p.address || ""} ${p.city || ""}`.toLowerCase();
                return combined.includes(normalizedArea);
            });
        }

        if (activeFilterChip === "wfc") {
            result = result.filter((p) =>
                placeMatchesKeywords(p, ["wfc", "nugas", "wifi", "colokan", "kerja", "laptop"])
            );
        } else if (activeFilterChip === "open") {
            result = result.filter((p) => {
                const status = getPlaceOpenStatus(p.opening_hours);
                return status.isOpen;
            });
        } else if (activeFilterChip === "plug") {
            result = result.filter((p) =>
                placeMatchesKeywords(p, ["colokan", "stopkontak", "listrik", "plug", "steker"])
            );
        } else if (activeFilterChip === "24h") {
            result = result.filter((p) => {
                const status = getPlaceOpenStatus(p.opening_hours);
                const s = `${p.opening_hours || ""} ${p.short_description || ""} ${p.description || ""}`.toLowerCase();
                return status.is24Hours || s.includes("24 jam") || s.includes("24/7");
            });
        } else if (activeFilterChip === "sunset") {
            result = result.filter(
                (p) =>
                    placeMatchesKeywords(p, ["outdoor", "sunset", "pantai", "senja", "taplau", "rooftop", "garden"]) ||
                    (p.area || "").toLowerCase().includes("barat")
            );
        }

        if (isNearbyActive && userCoords) {
            result = [...result].sort((a, b) => {
                const coordsA = getPlaceCoordinates(a);
                const coordsB = getPlaceCoordinates(b);
                const distA = calculateDistanceKm(userCoords.lat, userCoords.lng, coordsA.lat, coordsA.lng);
                const distB = calculateDistanceKm(userCoords.lat, userCoords.lng, coordsB.lat, coordsB.lng);
                return distA - distB;
            });
        }

        return result;
    }, [initialPlaces, searchQuery, selectedArea, activeFilterChip, isNearbyActive, userCoords]);

    return (
        <main className="min-h-screen bg-[#FAF7F2] px-0 pb-20 sm:px-6 sm:pb-16 sm:pt-6 lg:px-8 lg:pb-24">
            <div className="mx-auto max-w-7xl">
                {/* Top Floating Controls: Search & Horizontal Filter Bar - Aligned with Stitch 252863f1beb84271b57c384f171e43ac */}
                <div className="block lg:hidden w-full sticky top-0 z-30 px-3.5 pt-1.5 pb-2 bg-[#FAF7F2]/95 backdrop-blur-md">
                    {/* Floating Search & Filter Pill */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-12 bg-white rounded-full shadow-[0_4px_20px_-2px_rgba(41,28,20,0.08),0_1px_3px_0px_rgba(41,28,20,0.04)] border border-[#e4e2de]/60 flex items-center px-4 gap-2.5">
                            <Search className="h-5 w-5 text-[#ac3311] shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari spot ngopi, jalan, area di Padang..."
                                className="w-full bg-transparent text-[#0d0401] placeholder-[#4e4540]/60 text-[13px] font-medium outline-none"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="text-[#4e4540]/60 hover:text-[#0d0401] transition-colors p-1"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Quick Filter Action Trigger */}
                        <button
                            type="button"
                            aria-label="Filter Wilayah"
                            onClick={() => setIsAreaModalOpen(!isAreaModalOpen)}
                            className={`w-12 h-12 rounded-full shadow-[0_4px_20px_-2px_rgba(41,28,20,0.08)] flex items-center justify-center transition-transform active:scale-95 shrink-0 border ${
                                selectedArea !== "all"
                                    ? "bg-[#ac3311] text-white border-[#ac3311]"
                                    : "bg-white text-[#0d0401] border-[#e4e2de]/60"
                            }`}
                        >
                            <SlidersHorizontal className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Horizontal Scrolling Filter Chips */}
                    <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-0.5 -mx-3.5 px-3.5 overscroll-x-contain">
                        {/* Semua Spot */}
                        <button
                            type="button"
                            onClick={() => setActiveFilterChip("all")}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-semibold text-[12px] shrink-0 shadow-xs transition-all ${
                                activeFilterChip === "all"
                                    ? "bg-[#0d0401] text-white"
                                    : "bg-white text-[#1b1c1a] border border-[#e4e2de]/60 hover:bg-[#efeeea]"
                            }`}
                        >
                            <Coffee className={`h-4 w-4 ${activeFilterChip === "all" ? "text-white" : "text-[#ac3311]"}`} />
                            <span>Semua Spot</span>
                            {activeFilterChip === "all" && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6e48]"></span>
                            )}
                        </button>

                        {/* Prioritas WFC */}
                        <button
                            type="button"
                            onClick={() => setActiveFilterChip("wfc")}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-semibold text-[12px] shrink-0 shadow-xs transition-all ${
                                activeFilterChip === "wfc"
                                    ? "bg-[#0d0401] text-white"
                                    : "bg-white text-[#1b1c1a] border border-[#e4e2de]/60 hover:bg-[#efeeea]"
                            }`}
                        >
                            <Laptop className="h-4 w-4 text-[#ac3311]" />
                            <span>Prioritas WFC</span>
                            {activeFilterChip === "wfc" && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6e48]"></span>
                            )}
                        </button>

                        {/* Buka Sekarang */}
                        <button
                            type="button"
                            onClick={() => setActiveFilterChip("open")}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-semibold text-[12px] shrink-0 shadow-xs transition-all ${
                                activeFilterChip === "open"
                                    ? "bg-[#0d0401] text-white"
                                    : "bg-white text-[#1b1c1a] border border-[#e4e2de]/60 hover:bg-[#efeeea]"
                            }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Buka Sekarang</span>
                            {activeFilterChip === "open" && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6e48]"></span>
                            )}
                        </button>

                        {/* Colokan Melimpah */}
                        <button
                            type="button"
                            onClick={() => setActiveFilterChip("plug")}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-semibold text-[12px] shrink-0 shadow-xs transition-all ${
                                activeFilterChip === "plug"
                                    ? "bg-[#0d0401] text-white"
                                    : "bg-white text-[#1b1c1a] border border-[#e4e2de]/60 hover:bg-[#efeeea]"
                            }`}
                        >
                            <Zap className="h-4 w-4 text-[#ac3311]" />
                            <span>Colokan Melimpah</span>
                            {activeFilterChip === "plug" && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6e48]"></span>
                            )}
                        </button>

                        {/* 24 Jam */}
                        <button
                            type="button"
                            onClick={() => setActiveFilterChip("24h")}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-semibold text-[12px] shrink-0 shadow-xs transition-all ${
                                activeFilterChip === "24h"
                                    ? "bg-[#0d0401] text-white"
                                    : "bg-white text-[#1b1c1a] border border-[#e4e2de]/60 hover:bg-[#efeeea]"
                            }`}
                        >
                            <Moon className="h-4 w-4 text-amber-600" />
                            <span>24 Jam</span>
                            {activeFilterChip === "24h" && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6e48]"></span>
                            )}
                        </button>

                        {/* Outdoor & Sunset */}
                        <button
                            type="button"
                            onClick={() => setActiveFilterChip("sunset")}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-semibold text-[12px] shrink-0 shadow-xs transition-all ${
                                activeFilterChip === "sunset"
                                    ? "bg-[#0d0401] text-white"
                                    : "bg-white text-[#1b1c1a] border border-[#e4e2de]/60 hover:bg-[#efeeea]"
                            }`}
                        >
                            <Sun className="h-4 w-4 text-[#ac3311]" />
                            <span>Outdoor &amp; Sunset</span>
                            {activeFilterChip === "sunset" && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6e48]"></span>
                            )}
                        </button>
                    </div>

                    {/* Dropdown / Pills for Area Filter when tune is active or area !== 'all' */}
                    {isAreaModalOpen && (
                        <div className="mt-2 p-2.5 bg-white rounded-2xl border border-[#e4e2de] shadow-md flex flex-wrap gap-1.5 animate-fadeIn">
                            {["all", "Padang Barat", "Padang Timur", "Padang Selatan", "Padang Utara", "Nanggalo", "Koto Tangah"].map((areaKey) => (
                                <button
                                    key={areaKey}
                                    type="button"
                                    onClick={() => {
                                        setSelectedArea(areaKey);
                                        setIsAreaModalOpen(false);
                                    }}
                                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                                        selectedArea === areaKey
                                            ? "bg-[#ac3311] text-white"
                                            : "bg-[#efeeea] text-[#4e4540] hover:bg-[#e4e2de]"
                                    }`}
                                >
                                    {areaKey === "all" ? "Semua Wilayah" : areaKey}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop Breadcrumbs & Hero Header */}
                <div className="hidden lg:block">
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-[#756A63]"
                    >
                        <Link href="/" className="transition hover:text-[#19120D]">
                            Home
                        </Link>
                        <ChevronRight className="h-3.5 w-3.5 text-[#EBE5DC]" />
                        <span className="font-bold text-[#FF5C35]">
                            Peta Interaktif Padang
                        </span>
                    </nav>

                    <header className="relative mb-8 overflow-hidden rounded-[2.5rem] border border-[#EBE5DC] bg-gradient-to-br from-[#1C120B] via-[#2A180E] to-[#120B07] p-6 text-white shadow-xl sm:p-10 lg:p-12">
                        <div className="relative z-10 max-w-3xl">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#FF5C35]/40 bg-[#FF5C35]/15 px-3.5 py-1 text-xs font-bold text-[#FDBA74]">
                                <Compass className="h-3.5 w-3.5 text-[#FF5C35]" />
                                <span>PETA DIGITAL &amp; SPOT WFC PADANG 🗺️</span>
                            </div>

                            <h1 className="font-sans text-2xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                                Peta Interaktif, Jelajahi <br className="hidden sm:inline" />
                                <span className="font-serif font-normal italic bg-gradient-to-r from-[#FDBA74] via-[#FF8E68] to-[#FF5C35] bg-clip-text text-transparent">
                                    Spot Ngopi di Padang
                                </span>
                            </h1>

                            <p className="mt-3 text-xs leading-relaxed text-[#D6CECA] sm:text-sm lg:text-base">
                                Temukan posisi persis {initialPlaces.length}+ spot ngopi, ruang nugas, dan roastery artisanal di Kota Padang. Didukung OpenStreetMap untuk panduan rute akurat tanpa tersesat.
                            </p>
                        </div>

                        {/* Quick Filters in Hero Footer */}
                        <div className="relative z-10 mt-6 grid grid-cols-1 gap-3 sm:grid-cols-12">
                            {/* Search Input */}
                            <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3.5 py-2.5 backdrop-blur sm:col-span-6 lg:col-span-5">
                                <Search className="h-4 w-4 shrink-0 text-[#FDBA74]" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari nama kafe, jalan, vibes..."
                                    className="w-full border-none bg-transparent p-0 text-xs font-medium text-white placeholder:text-[#D6CECA]/60 focus:ring-0 sm:text-sm"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="text-white/60 hover:text-white"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* Area Selector */}
                            <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3.5 py-2.5 backdrop-blur sm:col-span-3 lg:col-span-4">
                                <MapPin className="h-4 w-4 shrink-0 text-[#FDBA74]" />
                                <select
                                    value={selectedArea}
                                    onChange={(e) => setSelectedArea(e.target.value)}
                                    className="w-full cursor-pointer appearance-none border-none bg-transparent p-0 pr-4 text-xs font-medium text-white focus:ring-0 sm:text-sm"
                                >
                                    <option value="all" className="bg-[#19120D] text-white">Semua Wilayah</option>
                                    <option value="Padang Barat" className="bg-[#19120D] text-white">Padang Barat</option>
                                    <option value="Padang Timur" className="bg-[#19120D] text-white">Padang Timur</option>
                                    <option value="Padang Selatan" className="bg-[#19120D] text-white">Padang Selatan</option>
                                    <option value="Padang Utara" className="bg-[#19120D] text-white">Padang Utara</option>
                                    <option value="Nanggalo" className="bg-[#19120D] text-white">Nanggalo / Siteba</option>
                                    <option value="Koto Tangah" className="bg-[#19120D] text-white">Koto Tangah / Kuranji</option>
                                </select>
                            </div>

                            {/* Toggle GPS Button */}
                            <div className="flex items-center sm:col-span-3 lg:col-span-3">
                                <button
                                    type="button"
                                    onClick={handleLocateUser}
                                    disabled={isLocating}
                                    className={`flex h-full w-full items-center justify-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-bold transition duration-200 active:scale-95 ${
                                        isNearbyActive
                                            ? "bg-[#FF5C35] text-white shadow-md"
                                            : "bg-white/15 text-white hover:bg-white/25"
                                    }`}
                                >
                                    <Navigation className={`h-3.5 w-3.5 ${isLocating ? "animate-spin" : ""}`} />
                                    <span>
                                        {isLocating
                                            ? "Mencari GPS..."
                                            : isNearbyActive
                                            ? "GPS Aktif"
                                            : "📍 Cari Terdekat"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </header>
                </div>

                {/* Sub-toolbar: Results count & switch to grid (Desktop) */}
                <div className="mb-6 hidden lg:flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#EBE5DC] bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-[#10B981] animate-pulse" />
                        <span className="font-sans text-sm font-bold text-[#19120D]">
                            Menampilkan {filteredPlaces.length} dari {initialPlaces.length} spot di peta
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/places"
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#EBE5DC] bg-[#FAF7F2] px-4 py-1.5 text-xs font-bold text-[#19120D] transition hover:bg-white hover:text-[#FF5C35]"
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                            <span>Lihat Tampilan Daftar</span>
                        </Link>
                    </div>
                </div>

                {/* Places Map View Component */}
                <PlacesMapView
                    places={filteredPlaces}
                    userCoords={userCoords}
                />
            </div>
        </main>
    );
}
