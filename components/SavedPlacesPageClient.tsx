"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Bookmark,
    BookmarkPlus,
    Share2,
    Trash2,
    MapPin,
    Coffee,
    ArrowRight,
    Wifi,
    Zap,
    VolumeX,
    Sun,
    Waves,
    Clock,
    Compass,
} from "lucide-react";
import {
    useSavedPlaces,
    removeSavedPlace,
    clearAllSavedPlaces,
    type SavedPlaceItem,
} from "@/lib/saved-places";
import { getSafePlaceImageUrl } from "@/lib/image-url";
import { OpenStatusBadge } from "@/components/OpenStatusBadge";

export function SavedPlacesPageClient() {
    const router = useRouter();
    const { savedPlaces, isLoaded, savedCount } = useSavedPlaces();
    const [activeFilter, setActiveFilter] = useState<"all" | "wfc" | "sunset">("all");

    // Filter categories
    const wfcPlaces = useMemo(
        () =>
            savedPlaces.filter((p) => {
                const text = `${p.name} ${p.area || ""}`.toLowerCase();
                return (
                    text.includes("wfc") ||
                    text.includes("nugas") ||
                    text.includes("timur") ||
                    text.includes("tenang") ||
                    text.includes("colokan") ||
                    text.includes("endorphins") ||
                    text.includes("hq")
                );
            }),
        [savedPlaces]
    );

    const sunsetPlaces = useMemo(
        () =>
            savedPlaces.filter((p) => {
                const text = `${p.name} ${p.area || ""}`.toLowerCase();
                return (
                    text.includes("barat") ||
                    text.includes("selatan") ||
                    text.includes("sunset") ||
                    text.includes("senja") ||
                    text.includes("outdoor") ||
                    text.includes("laut") ||
                    text.includes("pantai") ||
                    text.includes("jiwani")
                );
            }),
        [savedPlaces]
    );

    const filteredPlaces = useMemo(() => {
        if (activeFilter === "wfc") return wfcPlaces;
        if (activeFilter === "sunset") return sunsetPlaces;
        return savedPlaces;
    }, [activeFilter, wfcPlaces, sunsetPlaces, savedPlaces]);

    function handleShareWhatsApp() {
        if (savedPlaces.length === 0) return;
        const listText = savedPlaces
            .map(
                (p, i) =>
                    `${i + 1}. *${p.name}* (${p.area || "Padang"}) - https://saranwak.com/places/${p.slug}`
            )
            .join("\n");
        const message = encodeURIComponent(
            `Halo! Ini daftar coffee shop favorit yang aku simpan di Saranwak Padang:\n\n${listText}\n\nYuk ngopi bareng!`
        );
        window.open(`https://wa.me/?text=${message}`, "_blank");
    }

    return (
        <main className="min-h-screen bg-[#fbf9f5] px-4 pb-28 pt-4 text-[#1b1c1a] sm:px-6 sm:pb-20 sm:pt-6 lg:px-12 lg:pt-8 font-sans">
            <div className="mx-auto max-w-7xl">
                {/* 1. TITLE & EYEBROW SECTION (Stitch 3e1e47bf28a6433fb552b27f81be35f5) */}
                <div className="mb-4 flex flex-col justify-between gap-3 border-b border-[#e4e2de]/60 pb-4 sm:mb-8 sm:flex-row sm:items-end sm:pb-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-0.5 rounded-full bg-[#ffdbd1] text-[#3c0800] text-[10px] font-bold tracking-wider uppercase mb-2">
                            <Bookmark className="h-3.5 w-3.5 text-[#ac3311] fill-current" />
                            <span>KOLEKSI PRIBADI</span>
                        </div>

                        <h1 className="text-[28px] sm:text-3xl lg:text-4xl leading-[34px] font-extrabold tracking-tight text-[#0d0401] mb-1">
                            Tempat Tersimpan
                        </h1>
                        <p className="text-[13px] text-[#4e4540] max-w-sm sm:max-w-xl leading-relaxed">
                            {savedCount} kedai kopi &amp; ruang kerja favorit kamu di Padang.
                        </p>
                    </div>

                    {savedPlaces.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={handleShareWhatsApp}
                                className="inline-flex items-center gap-1.5 rounded-full border border-[#e4e2de] bg-white px-3.5 py-1.5 text-[11px] font-bold text-[#0d0401] shadow-xs transition hover:border-[#ac3311] hover:text-[#ac3311] active:scale-95 sm:px-4 sm:py-2 sm:text-xs cursor-pointer"
                            >
                                <Share2 className="h-3.5 w-3.5 text-[#ac3311]" />
                                <span>Bagikan Daftar</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm("Kosongkan semua daftar tempat tersimpan?")) {
                                        clearAllSavedPlaces();
                                    }
                                }}
                                className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1.5 text-[11px] font-bold text-[#881f00] transition hover:bg-[#ffdbd1]/50 active:scale-95 sm:px-3 sm:py-2 sm:text-xs cursor-pointer"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Hapus Semua</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* 2. QUICK TABS / FILTER PILLS (Stitch 3e1e47bf28a6433fb552b27f81be35f5) */}
                {savedPlaces.length > 0 && (
                    <div className="mb-4 sm:mb-6 overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-2 pb-1">
                            <button
                                type="button"
                                onClick={() => setActiveFilter("all")}
                                className={`shrink-0 px-4 py-2 rounded-full text-[12px] transition-all active:scale-95 cursor-pointer ${
                                    activeFilter === "all"
                                        ? "bg-[#0d0401] text-white font-semibold shadow-xs"
                                        : "bg-[#eae8e4] text-[#4e4540] hover:text-[#0d0401] font-medium"
                                }`}
                            >
                                Semua ({savedPlaces.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveFilter("wfc")}
                                className={`shrink-0 px-4 py-2 rounded-full text-[12px] transition-all active:scale-95 cursor-pointer ${
                                    activeFilter === "wfc"
                                        ? "bg-[#0d0401] text-white font-semibold shadow-xs"
                                        : "bg-[#eae8e4] text-[#4e4540] hover:text-[#0d0401] font-medium"
                                }`}
                            >
                                Siap WFC ({wfcPlaces.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveFilter("sunset")}
                                className={`shrink-0 px-4 py-2 rounded-full text-[12px] transition-all active:scale-95 cursor-pointer ${
                                    activeFilter === "sunset"
                                        ? "bg-[#0d0401] text-white font-semibold shadow-xs"
                                        : "bg-[#eae8e4] text-[#4e4540] hover:text-[#0d0401] font-medium"
                                }`}
                            >
                                Nongkrong Senja ({sunsetPlaces.length})
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading Skeleton */}
                {!isLoaded && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((n) => (
                            <div
                                key={n}
                                className="h-80 animate-pulse rounded-2xl border border-[#e4e2de] bg-[#eae8e4]/60"
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {isLoaded && savedPlaces.length === 0 && (
                    <div className="my-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#e4e2de] bg-white p-8 text-center sm:my-14 sm:p-14 shadow-xs">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#ffdbd1] to-[#ffddb8] text-[#ac3311] shadow-inner sm:h-20 sm:w-20">
                            <Bookmark className="h-8 w-8 text-[#ac3311]" strokeWidth={1.75} />
                        </div>
                        <h2 className="mt-5 text-xl sm:text-2xl font-extrabold text-[#0d0401]">
                            Koleksi Masih Kosong
                        </h2>
                        <p className="mt-2 max-w-md text-xs sm:text-sm text-[#4e4540]">
                            Belum ada kedai kopi yang kamu simpan. Tekan ikon penanda (*bookmark*) pada kartu kafe mana pun saat menjelajah untuk menyimpannya di sini.
                        </p>
                        <Link
                            href="/places?category=coffee-shop"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0d0401] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md transition duration-200 hover:bg-[#ac3311] active:scale-95"
                        >
                            <Compass className="h-4 w-4" />
                            <span>Jelajahi Coffee Shop Sekarang</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                )}

                {/* 3. DAFTAR KARTU KAFE TERSIMPAN (Stitch 3e1e47bf28a6433fb552b27f81be35f5) */}
                {isLoaded && filteredPlaces.length > 0 && (
                    <div className="flex flex-col gap-4 sm:grid sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredPlaces.map((place) => {
                            const imageUrl = getSafePlaceImageUrl(place.image_url);
                            const displayPrice = place.price_range || "Rp 20k";
                            const tags = getSavedPlaceTags(place);

                            return (
                                <article
                                    key={place.id}
                                    onClick={() => router.push(`/places/${place.slug}`)}
                                    className="relative w-full h-80 rounded-2xl overflow-hidden shadow-md group cursor-pointer transition-transform active:scale-[0.99] border border-white/10"
                                >
                                    {/* Cover Image */}
                                    <Image
                                        src={imageUrl}
                                        alt={place.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

                                    {/* Top Badges */}
                                    <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                                        <OpenStatusBadge openingHours={place.opening_hours} mode="compact" />

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeSavedPlace(place.slug);
                                            }}
                                            aria-label={`Hapus ${place.name} dari tersimpan`}
                                            title="Hapus dari tersimpan"
                                            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#ac3311] shadow-xs transition-transform active:scale-75 hover:bg-white"
                                        >
                                            <Bookmark className="h-5 w-5 fill-current text-[#ac3311]" />
                                        </button>
                                    </div>

                                    {/* Bottom Content */}
                                    <div className="absolute bottom-0 inset-x-0 p-5 text-white z-10 flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold tracking-wider uppercase text-[#ff6e48]">
                                                {place.area || "Padang"}
                                            </span>
                                            <span className="text-[12px] font-bold text-[#ffddb8] bg-black/50 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
                                                MULAI {displayPrice}
                                            </span>
                                        </div>

                                        <h2 className="text-xl font-bold text-white tracking-tight leading-tight group-hover:text-[#ffddb8] transition-colors">
                                            {place.name}
                                        </h2>

                                        {/* Tags Row */}
                                        <div className="flex flex-wrap items-center gap-1.5 py-0.5">
                                            {tags.map((t, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-[10px] font-medium text-white/90"
                                                >
                                                    {t.icon}
                                                    <span>{t.label}</span>
                                                </span>
                                            ))}
                                        </div>

                                        {/* Bottom Action Row */}
                                        <div className="flex items-center justify-between pt-1 border-t border-white/10">
                                            <div className="flex items-center gap-1 text-[12px] text-white/80">
                                                <MapPin className="h-3.5 w-3.5 text-[#ff6e48]" />
                                                <span>{place.area ? `${place.area}, Padang` : "Kota Padang"}</span>
                                            </div>

                                            <Link
                                                href={`/places/${place.slug}`}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#ac3311] hover:bg-[#881f00] text-white text-[12px] font-semibold transition-colors shadow-xs active:scale-95"
                                            >
                                                <span>Detail</span>
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                {/* 4. DELIGHT TIPS BOX (Stitch 3e1e47bf28a6433fb552b27f81be35f5) */}
                <section className="mt-6 p-5 rounded-2xl bg-[#f5f3ef] border border-[#e4e2de]/60 flex flex-col items-center text-center relative overflow-hidden shadow-xs">
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#ffdbd1]/30 pointer-events-none" />
                    <div className="absolute -left-4 -top-4 w-16 h-16 rounded-full bg-[#ffddb8]/30 pointer-events-none" />

                    <div className="w-11 h-11 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[#ac3311] mb-2.5 relative z-10 border border-[#e4e2de]/50">
                        <BookmarkPlus className="h-6 w-6" />
                    </div>

                    <h3 className="text-[16px] font-bold text-[#0d0401] mb-1 relative z-10">
                        Punya Rekomendasi Lain?
                    </h3>
                    <p className="text-[12px] text-[#4e4540] max-w-xs leading-relaxed relative z-10">
                        Menemukan spot baru saat jalan-jalan di Padang? Tekan ikon bookmark pada kartu mana pun untuk menyimpannya di sini!
                    </p>
                    <Link
                        href="/map"
                        className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0d0401] hover:bg-[#291c14] text-white text-[12px] font-semibold transition-all active:scale-95 relative z-10 shadow-xs"
                    >
                        <span>Jelajahi Peta WFC</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </section>

                {/* 5. FOOTER BRANDING (Stitch 3e1e47bf28a6433fb552b27f81be35f5) */}
                <div className="mt-8 pt-5 border-t border-[#e4e2de]/60 flex flex-col items-center text-center relative sm:hidden">
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="relative w-5 h-5 rounded-md overflow-hidden shrink-0 shadow-xs">
                            <Image
                                src="/icon-192.png"
                                alt="Saranwak Logo"
                                fill
                                sizes="20px"
                                className="object-cover"
                            />
                        </div>
                        <span className="text-[14px] text-[#0d0401] font-bold">Saranwak</span>
                    </div>
                    <p className="text-[11px] text-[#4e4540] max-w-xs mb-2 leading-relaxed">
                        Kurasi independen kopi &amp; spot WFC Kota Padang. Dibuat dengan kecintaan pada seduhan jujur.
                    </p>
                    <span className="text-[10px] text-[#80756f] leading-tight">
                        © 2025 Saranwak Padang. Seluruh hak cipta dilindungi.
                    </span>
                </div>
            </div>
        </main>
    );
}

function getSavedPlaceTags(place: SavedPlaceItem) {
    const text = [
        place.name,
        place.area || "",
        place.price_range || "",
    ]
        .join(" ")
        .toLowerCase();

    const pills: Array<{ label: string; icon: React.ReactNode }> = [];

    if (text.includes("wifi") || text.includes("internet") || text.includes("wfc") || text.includes("endorphins")) {
        pills.push({
            label: "Wi-Fi",
            icon: <Wifi className="h-3.5 w-3.5 text-emerald-400" />,
        });
    }
    if (text.includes("colokan") || text.includes("stopkontak") || text.includes("wfc") || text.includes("endorphins") || text.includes("hq")) {
        pills.push({
            label: "Stopkontak Meja",
            icon: <Zap className="h-3.5 w-3.5 text-amber-400" />,
        });
    }
    if (text.includes("tenang") || text.includes("fokus") || text.includes("nugas") || text.includes("endorphins")) {
        pills.push({
            label: "Tenang",
            icon: <VolumeX className="h-3.5 w-3.5 text-[#ffddb8]" />,
        });
    }
    if (text.includes("sunset") || text.includes("senja") || text.includes("jiwani") || text.includes("barat")) {
        pills.push({
            label: "Sunset Point",
            icon: <Sun className="h-3.5 w-3.5 text-amber-400" />,
        });
    }
    if (text.includes("outdoor") || text.includes("taman") || text.includes("jiwani") || text.includes("rooftop")) {
        pills.push({
            label: "Outdoor Seating",
            icon: <Sun className="h-3.5 w-3.5 text-[#ffddb8]" />,
        });
    }
    if (text.includes("laut") || text.includes("pantai") || text.includes("jiwani") || text.includes("batang arau") || text.includes("selatan")) {
        pills.push({
            label: "Tepi Laut",
            icon: <Waves className="h-3.5 w-3.5 text-teal-300" />,
        });
    }
    if (text.includes("24 jam") || text.includes("batang arau") || (place.opening_hours && place.opening_hours.toLowerCase().includes("24 jam"))) {
        pills.push({
            label: "24 Jam",
            icon: <Clock className="h-3.5 w-3.5 text-amber-400" />,
        });
    }

    if (pills.length === 0) {
        pills.push({
            label: "Wi-Fi",
            icon: <Wifi className="h-3.5 w-3.5 text-emerald-400" />,
        });
        pills.push({
            label: "Spot Nyaman",
            icon: <Coffee className="h-3.5 w-3.5 text-[#ffddb8]" />,
        });
    }

    return pills.slice(0, 3);
}
