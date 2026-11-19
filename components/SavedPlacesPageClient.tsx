"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Bookmark,
    Compass,
    Share2,
    Trash2,
    MapPin,
    ExternalLink,
    Coffee,
    ArrowRight,
    Navigation,
    Sparkles,
} from "lucide-react";
import { useSavedPlaces, removeSavedPlace, clearAllSavedPlaces } from "@/lib/saved-places";
import { getSafePlaceImageUrl } from "@/lib/image-url";
import { OpenStatusBadge } from "@/components/OpenStatusBadge";

export function SavedPlacesPageClient() {
    const { savedPlaces, isLoaded, savedCount } = useSavedPlaces();
    const [activeFilter, setActiveFilter] = useState<"all" | "wfc" | "sunset">("all");

    // Filter places based on activeFilter
    const filteredPlaces = useMemo(() => {
        if (activeFilter === "all") return savedPlaces;
        if (activeFilter === "wfc") {
            return savedPlaces.filter(
                (p) =>
                    p.area?.toLowerCase().includes("timur") ||
                    p.name.toLowerCase().includes("hq") ||
                    p.name.toLowerCase().includes("endorphins")
            );
        }
        if (activeFilter === "sunset") {
            return savedPlaces.filter(
                (p) =>
                    p.area?.toLowerCase().includes("barat") ||
                    p.area?.toLowerCase().includes("selatan") ||
                    p.name.toLowerCase().includes("jiwani")
            );
        }
        return savedPlaces;
    }, [savedPlaces, activeFilter]);

    function handleShareWhatsApp() {
        if (savedPlaces.length === 0) return;
        const listText = savedPlaces
            .map((p, i) => `${i + 1}. *${p.name}* (${p.area || "Padang"}) - https://saranwak.com/places/${p.slug}`)
            .join("\n");
        const message = encodeURIComponent(
            `Halo! Ini daftar coffee shop favorit yang aku simpan di Saranwak Padang:\n\n${listText}\n\nYuk ngopi bareng!`
        );
        window.open(`https://wa.me/?text=${message}`, "_blank");
    }

    return (
        <main className="min-h-screen bg-[#FAF7F2] px-4 pb-28 pt-4 text-[#19120D] sm:px-6 sm:pb-20 sm:pt-6 lg:px-12 lg:pt-8">
            <div className="mx-auto max-w-7xl">
                {/* Header Section matching Stitch 5802802fb7f84fa2a44fec11c12b872b & 3e1e47bf28a6433fb552b27f81be35f5 */}
                <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#EBE5DC] pb-6 sm:mb-8 sm:flex-row sm:items-end">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffdbd1] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ac3311]">
                                <Bookmark className="h-3 w-3 fill-current" />
                                <span>KOLEKSI PRIBADI</span>
                            </span>
                            <span className="rounded-full bg-[#FAF0E6] px-2.5 py-0.5 text-xs font-bold text-[#8C6D53]">
                                {savedCount} Tempat
                            </span>
                        </div>

                        <h1 className="font-sans text-2xl font-extrabold tracking-tight text-[#19120D] sm:text-3xl lg:text-4xl">
                            Tempat Tersimpan
                        </h1>
                        <p className="mt-1 max-w-2xl text-xs text-[#756A63] sm:text-sm">
                            {savedCount} kedai kopi &amp; ruang kerja favorit kamu di Padang.
                        </p>
                    </div>

                    {savedPlaces.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2.5">
                            <button
                                type="button"
                                onClick={handleShareWhatsApp}
                                className="inline-flex items-center gap-2 rounded-full border border-[#EBE5DC] bg-white px-4 py-2 text-xs font-bold text-[#19120D] shadow-sm transition hover:border-[#FF5C35] hover:text-[#FF5C35] active:scale-95"
                            >
                                <Share2 className="h-3.5 w-3.5 text-[#FF5C35]" />
                                <span>Bagikan Daftar</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm("Kosongkan semua daftar tempat tersimpan?")) {
                                        clearAllSavedPlaces();
                                    }
                                }}
                                className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-2 text-xs font-bold text-[#9E3922] transition hover:bg-[#FFEAE5] active:scale-95"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Hapus Semua</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Filter Pills */}
                {savedPlaces.length > 0 && (
                    <div className="no-scrollbar mb-6 flex items-center gap-2 overflow-x-auto pb-1">
                        <button
                            type="button"
                            onClick={() => setActiveFilter("all")}
                            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                                activeFilter === "all"
                                    ? "bg-[#19120D] text-white shadow-sm"
                                    : "border border-[#EBE5DC] bg-white text-[#756A63] hover:text-[#19120D]"
                            }`}
                        >
                            Semua ({savedPlaces.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveFilter("wfc")}
                            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                                activeFilter === "wfc"
                                    ? "bg-[#19120D] text-white shadow-sm"
                                    : "border border-[#EBE5DC] bg-white text-[#756A63] hover:text-[#19120D]"
                            }`}
                        >
                            💻 Siap WFC
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveFilter("sunset")}
                            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                                activeFilter === "sunset"
                                    ? "bg-[#19120D] text-white shadow-sm"
                                    : "border border-[#EBE5DC] bg-white text-[#756A63] hover:text-[#19120D]"
                            }`}
                        >
                            🌅 Nongkrong & Sunset
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {!isLoaded && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((n) => (
                            <div
                                key={n}
                                className="h-72 animate-pulse rounded-3xl border border-[#EBE5DC] bg-[#EAE4DC]/50"
                            />
                        ))}
                    </div>
                )}

                {/* Empty State matching Stitch */}
                {isLoaded && savedPlaces.length === 0 && (
                    <div className="my-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#D9CEBF] bg-white/70 p-8 text-center sm:my-14 sm:p-14">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#FFEAE5] to-[#FFF5ED] text-[#FF5C35] shadow-inner sm:h-20 sm:w-20">
                            <Bookmark className="h-8 w-8 text-[#FF5C35]" strokeWidth={1.75} />
                        </div>
                        <h2 className="mt-5 font-sans text-xl font-extrabold text-[#19120D] sm:text-2xl">
                            Koleksi Masih Kosong
                        </h2>
                        <p className="mt-2 max-w-md text-xs text-[#756A63] sm:text-sm">
                            Belum ada kedai kopi yang kamu simpan. Tekan ikon penanda (*bookmark*) pada kartu kafe mana pun saat menjelajah untuk menyimpannya di sini.
                        </p>
                        <Link
                            href="/places?category=coffee-shop"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#19120D] px-6 py-3 text-xs font-bold text-white shadow-md transition duration-200 hover:bg-[#FF5C35] active:scale-95 sm:text-sm"
                        >
                            <Compass className="h-4 w-4" />
                            <span>Jelajahi Coffee Shop Sekarang</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                )}

                {/* Saved Places Grid */}
                {isLoaded && filteredPlaces.length > 0 && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredPlaces.map((place) => {
                            const imageUrl = getSafePlaceImageUrl(place.image_url);

                            return (
                                <article
                                    key={place.id}
                                    className="group relative flex h-80 sm:h-auto cursor-pointer flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-[#EBE5DC] bg-white sm:p-4 shadow-sm transition-all duration-300 hover:border-[#FF5C35]/40 hover:shadow-xl"
                                >
                                    {/* Mobile Full-Bleed Image / Desktop Header Photo */}
                                    <div className="relative h-full w-full overflow-hidden bg-[#0d0401] sm:h-52 sm:rounded-2xl">
                                        <Image
                                            src={imageUrl}
                                            alt={place.name}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent sm:from-black/70 sm:via-black/20" />

                                        {/* Top Badges */}
                                        <div className="absolute inset-x-3 top-3 z-10 flex items-center justify-between">
                                            <OpenStatusBadge openingHours={place.opening_hours} mode="compact" />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeSavedPlace(place.slug);
                                                }}
                                                title="Hapus dari tersimpan"
                                                aria-label={`Hapus ${place.name}`}
                                                className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/90 sm:bg-black/40 text-[#ac3311] sm:text-white backdrop-blur-md transition hover:bg-[#FF5C35] hover:text-white active:scale-90 shadow-sm"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Mobile Bottom Content Overlay (sm:hidden) */}
                                        <div className="absolute inset-x-4 bottom-4 z-10 block sm:hidden text-white">
                                            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#ffdbd1] mb-1">
                                                {place.area || "Padang"}
                                            </span>
                                            <Link href={`/places/${place.slug}`}>
                                                <h3 className="font-sans text-xl font-bold leading-tight text-white hover:text-[#ffddb8] transition-colors">
                                                    {place.name}
                                                </h3>
                                            </Link>
                                            <p className="mt-1 text-xs text-white/80 line-clamp-1">
                                                {place.opening_hours ? `🕒 ${place.opening_hours}` : "Tempat ngopi & ruang kerja santai"}
                                            </p>
                                            <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-2.5">
                                                <span className="text-xs font-bold text-[#ffddb8]">
                                                    {place.price_range || "Mulai Rp 20k"}
                                                </span>
                                                <Link
                                                    href={`/places/${place.slug}`}
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-white hover:underline"
                                                >
                                                    <span>Lihat Detail</span>
                                                    <ArrowRight className="h-3.5 w-3.5 text-[#ffddb8]" />
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Desktop Bottom Overlay Label (hidden sm:flex) */}
                                        <div className="hidden sm:flex absolute inset-x-3 bottom-3 items-end justify-between text-white">
                                            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md">
                                                {place.area || "Padang"}
                                            </span>
                                            {place.price_range && (
                                                <span className="text-xs font-black text-[#FDBA74]">
                                                    {place.price_range}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Desktop Place Info & Actions (hidden sm:flex) */}
                                    <div className="mt-4 hidden sm:flex flex-1 flex-col justify-between">
                                        <div>
                                            <Link href={`/places/${place.slug}`}>
                                                <h3 className="font-sans text-lg font-bold text-[#19120D] transition-colors hover:text-[#FF5C35]">
                                                    {place.name}
                                                </h3>
                                            </Link>
                                            {place.opening_hours && (
                                                <p className="mt-1 text-xs text-[#756A63]">
                                                    🕒 {place.opening_hours}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-4 flex items-center gap-2 border-t border-[#EBE5DC] pt-3">
                                            <Link
                                                href={`/places/${place.slug}`}
                                                className="flex-1 rounded-xl bg-[#FAF7F2] py-2 text-center text-xs font-bold text-[#19120D] transition hover:bg-[#FFECE5] hover:text-[#D8431F]"
                                            >
                                                Lihat Detail
                                            </Link>
                                            {place.google_maps_url ? (
                                                <a
                                                    href={place.google_maps_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 rounded-xl bg-[#19120D] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#FF5C35]"
                                                >
                                                    <Navigation className="h-3.5 w-3.5" />
                                                    <span>Rute</span>
                                                </a>
                                            ) : null}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
