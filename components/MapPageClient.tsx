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
} from "lucide-react";
import type { Place } from "@/types/database";
import {
    calculateDistanceKm,
    getPlaceCoordinates,
} from "@/lib/place-coordinates";

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

export function MapPageClient({ places: initialPlaces }: MapPageClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedArea, setSelectedArea] = useState<string>("all");
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
                const combined = `${p.name} ${p.area || ""} ${p.address || ""} ${p.short_description || ""}`.toLowerCase();
                return combined.includes(q);
            });
        }

        if (selectedArea !== "all") {
            result = result.filter((p) => p.area === selectedArea);
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
    }, [initialPlaces, searchQuery, selectedArea, isNearbyActive, userCoords]);

    return (
        <main className="min-h-screen bg-[#FAF7F2] px-3.5 pb-24 pt-2 sm:px-6 sm:pb-16 sm:pt-6 lg:px-8 lg:pb-24">
            <div className="mx-auto max-w-7xl">
                {/* Mobile Top Controls - Sleek Mobile App Navigation & Filter Chips */}
                <div className="block sm:hidden w-full mb-2">
                    <div className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md pt-0.5 pb-1.5 flex flex-col gap-1.5">
                        {/* Search Pill */}
                        <div className="flex items-center gap-1.5">
                            <div className="flex-1 h-9 bg-white rounded-full shadow-[0_2px_10px_rgba(41,28,20,0.05)] border border-[#e4e2de]/70 flex items-center px-3 gap-2">
                                <Search className="h-3.5 w-3.5 text-[#FF5C35] shrink-0" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari spot ngopi, jalan, area di Padang..."
                                    className="w-full bg-transparent text-[#0d0401] placeholder-[#80756f]/70 text-[11.5px] font-medium outline-none"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="text-[#80756f] hover:text-[#0d0401]"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                            </div>

                            {/* GPS Button */}
                            <button
                                type="button"
                                onClick={handleLocateUser}
                                disabled={isLocating}
                                aria-label="Lokasi Terdekat"
                                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer shrink-0 ${
                                    isNearbyActive
                                        ? "bg-[#FF5C35] text-white"
                                        : "bg-white border border-[#e4e2de]/70 text-[#0d0401]"
                                }`}
                            >
                                <Navigation className={`h-3.5 w-3.5 ${isLocating ? "animate-spin" : ""}`} />
                            </button>
                        </div>

                        {/* Horizontal Filter Chips */}
                        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto py-0.5 overscroll-x-contain">
                            <button
                                type="button"
                                onClick={() => setSelectedArea("all")}
                                className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[10.5px] font-bold shadow-xs transition-all ${
                                    selectedArea === "all"
                                        ? "bg-[#ac3311] text-white"
                                        : "bg-white border border-[#e4e2de]/60 text-[#4e4540]"
                                }`}
                            >
                                Semua Spot ({initialPlaces.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedArea("Padang Timur")}
                                className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[10.5px] font-bold shadow-xs transition-all ${
                                    selectedArea === "Padang Timur"
                                        ? "bg-[#ac3311] text-white"
                                        : "bg-white border border-[#e4e2de]/60 text-[#4e4540]"
                                }`}
                            >
                                Padang Timur
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedArea("Padang Barat")}
                                className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[10.5px] font-bold shadow-xs transition-all ${
                                    selectedArea === "Padang Barat"
                                        ? "bg-[#ac3311] text-white"
                                        : "bg-white border border-[#e4e2de]/60 text-[#4e4540]"
                                }`}
                            >
                                Padang Barat
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedArea("Padang Selatan")}
                                className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[10.5px] font-bold shadow-xs transition-all ${
                                    selectedArea === "Padang Selatan"
                                        ? "bg-[#ac3311] text-white"
                                        : "bg-white border border-[#e4e2de]/60 text-[#4e4540]"
                                }`}
                            >
                                Padang Selatan
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedArea("Padang Utara")}
                                className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[10.5px] font-bold shadow-xs transition-all ${
                                    selectedArea === "Padang Utara"
                                        ? "bg-[#ac3311] text-white"
                                        : "bg-white border border-[#e4e2de]/60 text-[#4e4540]"
                                }`}
                            >
                                Padang Utara
                            </button>
                        </div>
                    </div>
                </div>

                {/* Desktop Breadcrumbs & Hero Header */}
                <div className="hidden sm:block">
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

                {/* Sub-toolbar: Results count & switch to grid */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#EBE5DC] bg-white p-4 shadow-sm">
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
