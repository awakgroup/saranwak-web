"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Search,
    X,
    SlidersHorizontal,
    RotateCcw,
    Check,
    Coffee,
    Compass,
    Dices,
    LayoutGrid,
    Map as MapIcon,
    Navigation,
    MapPin,
    Wallet,
    ChevronDown,
    Lightbulb,
} from "lucide-react";
import { PlaceCard } from "@/components/PlaceCard";
import { RandomPlaceModal } from "@/components/RandomPlaceModal";
import { HomeFeaturePillars } from "@/components/home/HomeFeaturePillars";
import { FilterModal } from "@/components/home/FilterModal";

const PlacesMapView = dynamic(
    () => import("@/components/PlacesMapView").then((mod) => mod.PlacesMapView),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-[520px] w-full items-center justify-center rounded-[32px] border border-[#E7D8C8] bg-[#F8F1E8] text-[#756A60]">
                <p className="text-sm font-bold animate-pulse">Memuat peta spot Padang...</p>
            </div>
        ),
    }
);
import {
    calculateDistanceKm,
    formatDistance,
    getPlaceCoordinates,
} from "@/lib/place-coordinates";
import {
    placeFilterGroups,
    priceFilterOptions,
    type PriceFilterValue,
} from "@/lib/place-filters";
import { mapApiPlaceToLegacyPlace, type ApiPlace } from "@/lib/api/places";
import { getPlaceOpenStatus } from "@/lib/opening-hours";
import type { Place } from "@/types/database";

type PlacesClientPageProps = {
    placesData: Place[];
};

type PageParams = {
    q?: string;
    tag?: string;
    tags?: string;
    area?: string;
    category?: string;
    price?: string;
    openNow?: string;
};

type TagItem = {
    id?: string | null;
    name?: string | null;
    slug?: string | null;
    type?: string | null;
};

type PlaceTagItem = {
    tag_id?: string | null;
    tag?: TagItem | TagItem[] | null;
    tags?: TagItem | TagItem[] | null;
};

type PlaceWithFlexibleTags = Place & {
    tags?: TagItem[] | string[] | null;
    place_tags?: PlaceTagItem[] | null;
    categories?:
    | {
        id?: string | null;
        name?: string | null;
        slug?: string | null;
    }
    | string
    | null;
    category_id?: string | null;
    category_name?: string | null;
    category_slug?: string | null;
};

const QUICK_FILTER_CHIPS: Array<{
    label: string;
    tag?: string;
    isOpenNow?: boolean;
}> = [
    { label: "Buka Sekarang", isOpenNow: true },
    { label: "WFC", tag: "wfc" },
    { label: "Nugas", tag: "nugas" },
    { label: "Nongkrong", tag: "nongkrong" },
    { label: "Nge-date", tag: "nge-date" },
    { label: "Tenang", tag: "tenang" },
    { label: "Outdoor", tag: "outdoor" },
    { label: "Indoor", tag: "indoor" },
    { label: "AC", tag: "ac" },
    { label: "WiFi", tag: "wifi" },
    { label: "Colokan", tag: "colokan" },
    { label: "Musholla", tag: "musholla" },
    { label: "Smoking Area", tag: "smoking-area" },
    { label: "Aesthetic", tag: "aesthetic" },
    { label: "Cozy", tag: "cozy" },
    { label: "Meeting", tag: "meeting" },
    { label: "Live Musik", tag: "live-musik" },
    { label: "Indoor Smoking", tag: "indoor-smoking" },
    { label: "Photobox", tag: "photobox" },
    { label: "Minimalis", tag: "minimalis" },
    { label: "Industrial", tag: "industrial" },
    { label: "Healing", tag: "healing" },
];

export function PlacesClientPage({ placesData }: PlacesClientPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const params: PageParams = useMemo(
        () => ({
            q: searchParams.get("q") || undefined,
            tag: searchParams.get("tag") || undefined,
            tags: searchParams.get("tags") || undefined,
            area: searchParams.get("area") || undefined,
            category: searchParams.get("category") || undefined,
            price: searchParams.get("price") || undefined,
            openNow: searchParams.get("openNow") || undefined,
        }),
        [searchParams]
    );

    const [searchQuery, setSearchQuery] = useState(params.q || "");
    const [livePlacesData, setLivePlacesData] = useState<Place[]>(placesData);
    const [isRandomOpen, setIsRandomOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(8);
    const [viewMode, setViewMode] = useState<"grid" | "map">(
        searchParams?.get("view") === "map" ? "map" : "grid"
    );

    // Sync viewMode if searchParams.get("view") changes
    useEffect(() => {
        const view = searchParams?.get("view");
        if (view === "map") {
            setViewMode("map");
        } else if (view === "grid") {
            setViewMode("grid");
        }
    }, [searchParams]);

    const handleSetViewMode = (mode: "grid" | "map") => {
        setViewMode(mode);
        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            if (mode === "map") {
                url.searchParams.set("view", "map");
            } else {
                url.searchParams.delete("view");
            }
            window.history.replaceState(null, "", url.toString());
        }
    };

    // Geolocation state untuk fitur "📍 Terdekat"
    const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [isNearbyActive, setIsNearbyActive] = useState(false);

    const handleToggleNearby = () => {
        if (isNearbyActive) {
            setIsNearbyActive(false);
            return;
        }

        if (userCoords) {
            setIsNearbyActive(true);
            return;
        }

        if (typeof window === "undefined" || !navigator.geolocation) {
            alert("Browser kamu tidak mendukung fitur deteksi lokasi (geolocation).");
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
                setIsLocating(false);
                if (err.code === 1) {
                    alert("Akses lokasi ditolak. Silakan aktifkan izin lokasi di browser kamu untuk melihat cafe terdekat.");
                } else {
                    alert("Gagal mendeteksi lokasi saat ini. Silakan coba beberapa saat lagi.");
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            }
        );
    };

    useEffect(() => {
        let isMounted = true;
        fetch("/api/places?limit=150")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch fresh places");
                return res.json() as Promise<{ data?: ApiPlace[] }>;
            })
            .then((json) => {
                if (isMounted && Array.isArray(json?.data) && json.data.length > 0) {
                    const apiPlaces = json.data.map(mapApiPlaceToLegacyPlace);
                    // Merge agar data baru dan koordinat dari build/JSON tidak tertimpa D1 lama
                    const map = new Map<string, Place>();
                    placesData.forEach((p) => map.set(p.slug, p));
                    apiPlaces.forEach((p) => {
                        const existing = map.get(p.slug);
                        map.set(p.slug, {
                            ...p,
                            latitude: p.latitude ?? existing?.latitude,
                            longitude: p.longitude ?? existing?.longitude,
                        });
                    });
                    setLivePlacesData(Array.from(map.values()));
                }
            })
            .catch(() => {
                // Silently fallback to build-time static placesData
            });

        return () => {
            isMounted = false;
        };
    }, [placesData]);

    // Sinkronkan searchQuery jika params.q dari URL berubah
    useEffect(() => {
        setSearchQuery(params.q || "");
    }, [params.q]);

    const currentQ = searchQuery.trim();

    const effectiveParams = useMemo<PageParams>(
        () => ({
            ...params,
            q: currentQ || undefined,
        }),
        [params, currentQ]
    );

    // Sinkronisasi URL query string (debounced 250ms) saat user mengetik tanpa reload
    useEffect(() => {
        const timer = setTimeout(() => {
            if (typeof window !== "undefined") {
                const targetHref = buildFilterHref(params, {
                    q: currentQ || undefined,
                });
                const currentFull =
                    window.location.pathname + window.location.search;
                if (currentFull !== targetHref) {
                    window.history.replaceState(null, "", targetHref);
                }
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [currentQ, params]);

    const selectedTags = getSelectedTags(effectiveParams);
    const selectedPrice = getSelectedPrice(effectiveParams.price);
    const selectedTagsKey = selectedTags.join(",");

    // Reset pagination ketika filter atau query berubah
    useEffect(() => {
        setVisibleCount(8);
    }, [currentQ, effectiveParams.area, effectiveParams.category, effectiveParams.openNow, selectedPrice, selectedTagsKey]);

    const places = useMemo(() => {
        const filtered = livePlacesData
            .filter((place) => matchKeyword(place, currentQ))
            .filter((place) => matchArea(place, effectiveParams.area))
            .filter((place) => matchCategory(place, effectiveParams.category))
            .filter((place) => matchAllSelectedTags(place, selectedTags))
            .filter((place) => matchPrice(place, selectedPrice))
            .filter((place) => {
                if (effectiveParams.openNow === "true") {
                    return getPlaceOpenStatus(place.opening_hours).isOpen;
                }
                return true;
            });

        if (isNearbyActive && userCoords) {
            return [...filtered].sort((a, b) => {
                const coordsA = getPlaceCoordinates(a);
                const coordsB = getPlaceCoordinates(b);
                const distA = calculateDistanceKm(
                    userCoords.lat,
                    userCoords.lng,
                    coordsA.lat,
                    coordsA.lng
                );
                const distB = calculateDistanceKm(
                    userCoords.lat,
                    userCoords.lng,
                    coordsB.lat,
                    coordsB.lng
                );
                return distA - distB;
            });
        }

        return filtered.sort((a, b) => {
            return (
                new Date(b.created_at ?? 0).getTime() -
                new Date(a.created_at ?? 0).getTime()
            );
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        livePlacesData,
        currentQ,
        effectiveParams.area,
        effectiveParams.category,
        effectiveParams.openNow,
        selectedPrice,
        selectedTagsKey,
        isNearbyActive,
        userCoords,
    ]);

    // Map jarak per place untuk badge di kartu
    const distanceMap = useMemo(() => {
        if (!userCoords) return {} as Record<string, string>;
        const map: Record<string, string> = {};
        livePlacesData.forEach((place) => {
            const coords = getPlaceCoordinates(place);
            const distKm = calculateDistanceKm(
                userCoords.lat,
                userCoords.lng,
                coords.lat,
                coords.lng
            );
            map[place.slug] = formatDistance(distKm);
        });
        return map;
    }, [livePlacesData, userCoords]);

    const hasFilter = Boolean(
        currentQ ||
        effectiveParams.area ||
        effectiveParams.category ||
        selectedTags.length > 0 ||
        selectedPrice !== "all" ||
        effectiveParams.openNow === "true"
    );

    const activeFilterCount =
        Number(Boolean(currentQ)) +
        Number(Boolean(effectiveParams.area)) +
        Number(Boolean(effectiveParams.category)) +
        selectedTags.length +
        Number(selectedPrice !== "all") +
        Number(effectiveParams.openNow === "true");

    function handleSearchSubmit(e: FormEvent) {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (typeof window !== "undefined") {
            const targetHref = buildFilterHref(params, {
                q: trimmed || undefined,
            });
            window.history.replaceState(null, "", targetHref);
        }
    }

    function handleClearSearch() {
        setSearchQuery("");
        if (typeof window !== "undefined") {
            const targetHref = buildFilterHref(params, {
                q: undefined,
            });
            window.history.replaceState(null, "", targetHref);
        }
    }

    const { prefix: titlePrefix, suffix: titleSuffix } = makeTitleParts(effectiveParams);

    return (
        <main className="min-h-screen bg-[#F4F1EA] px-0 pb-28 text-[#201813] sm:px-6 sm:pb-16 sm:pt-6 lg:px-8 lg:pb-20 lg:pt-8">
            <section className="mx-auto max-w-7xl">
                {/* Mobile Page Header - Stitch cc723c2f64fa4f15a1e83985ce597c47 */}
                <div className="block sm:hidden w-full">
                    {/* Page Intro */}
                    <section className="px-5 pt-4 pb-2">
                        <p
                            className="text-[#ac3311] text-[20px] leading-tight font-bold tracking-wide"
                            style={{ fontFamily: "var(--font-caveat), 'Caveat', cursive" }}
                        >
                            Jelajahi Kota Padang
                        </p>
                        <h1 className="text-[#0d0401] text-[28px] leading-[34px] font-extrabold tracking-tight mt-0.5 mb-1.5">
                            Spot Kopi &amp; Ruang WFC Pilihan
                        </h1>
                        <p className="text-[#4e4540] text-[13px] leading-relaxed max-w-sm">
                            Temukan tempat kerja kondusif, kopi berkualitas, dan suasana senja santai di seantero Padang.
                        </p>
                    </section>

                    {/* Sticky Mobile Search & Filter Chips Bar */}
                    <div className="sticky top-14 z-30 bg-[#F4F1EA]/95 backdrop-blur-md pt-2 pb-3 px-5 shadow-[0_4px_16px_rgba(41,28,20,0.03)] flex flex-col gap-3">
                        {/* Search Bar Pill */}
                        <form
                            onSubmit={handleSearchSubmit}
                            className="w-full bg-white shadow-[0_4px_20px_rgba(41,28,20,0.08)] border border-[#e4e2de]/40 rounded-full p-1.5 pl-4 flex items-center justify-between transition-all focus-within:ring-2 focus-within:ring-[#ac3311]/30"
                        >
                            <div className="flex items-center gap-2.5 flex-1 min-w-0 mr-2">
                                <Search className="h-5 w-5 text-[#80756f] shrink-0" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari spot ngopi, area, vibe..."
                                    className="w-full bg-transparent text-[#0d0401] placeholder-[#80756f]/70 text-[13px] font-medium outline-none"
                                />
                            </div>
                            {searchQuery ? (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="mr-1 text-[#80756f] hover:text-[#0d0401]"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            ) : null}
                            <button
                                type="submit"
                                aria-label="Cari"
                                className="w-10 h-10 rounded-full bg-[#ac3311] hover:bg-[#881f00] text-white flex items-center justify-center shadow-sm active:scale-95 shrink-0 cursor-pointer"
                            >
                                <Search className="h-4.5 w-4.5" />
                            </button>
                        </form>

                        {/* Horizontal Filter Chips */}
                        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-1 overscroll-x-contain">
                            <Link
                                href="/places/?category=coffee-shop"
                                className={`chip-filter shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] transition-all font-semibold shadow-xs ${
                                    selectedTags.length === 0 &&
                                    !effectiveParams.area &&
                                    !effectiveParams.price &&
                                    effectiveParams.openNow !== "true"
                                        ? "bg-[#ac3311] text-white shadow-sm"
                                        : "bg-white border border-[#e4e2de]/60 text-[#4e4540] hover:text-[#0d0401]"
                                }`}
                            >
                                Semua ({livePlacesData.length})
                            </Link>
                            {QUICK_FILTER_CHIPS.map((chip) => {
                                if (chip.isOpenNow) {
                                    const active = effectiveParams.openNow === "true";
                                    return (
                                        <Link
                                            key="chip-open-now"
                                            href={buildFilterHref(effectiveParams, {
                                                openNow: active ? undefined : "true",
                                            })}
                                            className={`chip-filter shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-[12px] transition-all font-semibold shadow-xs inline-flex items-center gap-1.5 ${
                                                active
                                                    ? "bg-[#ac3311] text-white shadow-sm"
                                                    : "bg-white border border-[#e4e2de]/60 text-[#4e4540] hover:text-[#0d0401]"
                                            }`}
                                        >
                                            <span className={`h-2 w-2 rounded-full ${active ? "bg-white" : "bg-[#10B981]"}`} />
                                            <span>{chip.label}</span>
                                            {active && <Check className="h-3 w-3 shrink-0" />}
                                        </Link>
                                    );
                                }

                                if (!chip.tag) return null;
                                const active = selectedTags.includes(chip.tag);

                                return (
                                    <Link
                                        key={chip.tag}
                                        href={buildTagHref(effectiveParams, chip.tag)}
                                        className={`chip-filter shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-[12px] transition-all font-semibold shadow-xs inline-flex items-center gap-1.5 ${
                                            active
                                                ? "bg-[#ac3311] text-white shadow-sm"
                                                : "bg-white border border-[#e4e2de]/60 text-[#4e4540] hover:text-[#0d0401]"
                                        }`}
                                    >
                                        {active && <Check className="h-3 w-3 shrink-0" />}
                                        <span>{chip.label}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Count & Action summary */}
                        <div className="flex items-center justify-between pt-0.5 px-0.5">
                            <div className="flex items-center gap-1.5 text-[#4e4540]">
                                <Compass className="h-4 w-4 text-[#ac3311]" />
                                <span className="text-[12px] font-medium text-[#0d0401]">
                                    Menampilkan <strong className="font-bold">{places.length} Tempat Kopi</strong>
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsFilterModalOpen(true)}
                                className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#eae8e4] text-[#0d0401] hover:bg-[#e4e2de] transition-colors active:scale-95 text-[11px] font-semibold cursor-pointer"
                            >
                                <SlidersHorizontal className="h-3.5 w-3.5 text-[#0d0401]" />
                                <span>Filter</span>
                                {activeFilterCount > 0 && (
                                    <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#ac3311] text-[9px] font-extrabold text-white">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 1. EDITORIAL HERO SECTION WITH CURVED WARM BACKDROP & EMBEDDED FILTER BAR (DESKTOP) */}
                <div className="hidden sm:flex relative mb-8 min-h-[440px] flex-col justify-between overflow-hidden rounded-[2.5rem] border border-[#2A1D15] bg-[#19120D] text-white shadow-2xl lg:min-h-[480px]">
                    {/* Background Cover Image with Atmospheric Soft Overlay */}
                    <div className="pointer-events-none absolute inset-0">
                        <Image
                            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=2000&q=85"
                            alt="Explore coffee shops in Padang"
                            fill
                            priority
                            sizes="(max-width: 1280px) 100vw, 1280px"
                            className="object-cover object-center brightness-[0.65] contrast-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/30" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#19120D]/95 via-[#19120D]/50 to-transparent" />
                    </div>

                    {/* Ambient Glow */}
                    <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gradient-to-br from-[#FF5C35]/30 to-[#FDBA74]/20 blur-3xl" />

                    {/* Hero Content Header */}
                    <div className="relative z-10 max-w-3xl px-6 pb-4 pt-10 sm:px-12 sm:pt-14 lg:px-16">
                        {viewMode === "map" ? (
                            <>
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FF5C35]/30 bg-[#FFECE5] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#D8431F] backdrop-blur-md">
                                    <span className="h-2 w-2 animate-ping rounded-full bg-[#FF5C35]" />
                                    <span>PETA DIGITAL &amp; SPOT WFC PADANG</span>
                                </div>

                                <h1 className="font-sans text-3xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl">
                                    Peta Interaktif, <br />
                                    <span className="font-serif font-normal italic bg-gradient-to-r from-[#FDBA74] via-[#FF8E68] to-[#FF5C35] bg-clip-text text-transparent">
                                        Jelajahi Spot Ngopi di Padang
                                    </span>
                                </h1>

                                <p className="mt-3.5 max-w-2xl text-xs font-normal leading-relaxed text-[#D6CECA] sm:text-sm lg:text-base">
                                    Temukan kedai kopi artisanal, tempat nugas nyaman, dan suasana terbaik di setiap sudut Kota Padang langsung di peta interaktif.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FDBA74] backdrop-blur-md">
                                    <span className="h-2 w-2 animate-ping rounded-full bg-[#FF5C35]" />
                                    <span>DIREKTORI &amp; EXPLORE KOTA PADANG</span>
                                </div>

                                <h1 className="font-sans text-3xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl">
                                    Temukan Sanctuary Ngopi &amp; Nugas di Kota Padang <br />
                                    <span className="font-serif font-normal italic bg-gradient-to-r from-[#FDBA74] via-[#FF8E68] to-[#FF5C35] bg-clip-text text-transparent">
                                        Ngopi Enak, Nugas Tenang
                                    </span>
                                </h1>

                                <p className="mt-3.5 max-w-2xl text-xs font-normal leading-relaxed text-[#D6CECA] sm:text-sm lg:text-base">
                                    Jelajahi {livePlacesData.length}+ coffee shop &amp; ruang kerja terkurasi di penjuru Kota Padang. Temukan atmosfer kondusif, stopkontak terverifikasi, dan racikan kopi berkualitas tanpa zonk.
                                </p>
                            </>
                        )}
                    </div>

                    {/* Floating Multi-Criteria Search & Filter Bar in Hero Footer */}
                    <div className="relative z-10 px-5 pb-8 pt-2 sm:px-10 lg:px-14">
                        <div className="w-full rounded-3xl border border-white/40 bg-white/95 p-3 text-[#19120D] shadow-2xl backdrop-blur-2xl sm:p-4">
                            <form
                                onSubmit={handleSearchSubmit}
                                className="grid grid-cols-1 items-center gap-3 sm:grid-cols-2 lg:grid-cols-12"
                            >
                                {/* 1. Search Input */}
                                <div className="flex items-center gap-2.5 rounded-2xl border border-[#EBE5DC] bg-[#F8F5F0] p-3 transition-all hover:border-[#FF5C35]/40 lg:col-span-3">
                                    <Search className="h-5 w-5 shrink-0 text-[#FF5C35]" />
                                    <div className="flex w-full flex-col">
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#756A63]">
                                            Pencarian
                                        </span>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Cari kafe, jalan, vibes..."
                                            className="w-full border-none bg-transparent p-0 text-xs font-bold text-[#19120D] outline-none placeholder:text-[#756A63]/60 focus:ring-0 sm:text-sm"
                                        />
                                    </div>
                                    {searchQuery ? (
                                        <button
                                            type="button"
                                            onClick={handleClearSearch}
                                            className="text-[#756A63] hover:text-[#19120D]"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    ) : null}
                                </div>

                                {/* 2. Area / Lokasi Dropdown */}
                                <div className="flex items-center gap-2.5 rounded-2xl border border-[#EBE5DC] bg-[#F8F5F0] p-3 transition-all hover:border-[#FF5C35]/40 lg:col-span-3">
                                    <MapPin className="h-5 w-5 shrink-0 text-[#FF5C35]" />
                                    <div className="flex w-full flex-col">
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#756A63]">
                                            Area / Lokasi
                                        </span>
                                        <div className="relative">
                                            <select
                                                value={effectiveParams.area || ""}
                                                onChange={(e) => {
                                                    const newHref = buildFilterHref(effectiveParams, {
                                                        area: e.target.value || undefined,
                                                    });
                                                    router.push(newHref);
                                                }}
                                                className="w-full cursor-pointer appearance-none border-none bg-transparent p-0 pr-5 text-xs font-bold text-[#19120D] outline-none focus:ring-0 sm:text-sm"
                                            >
                                                <option value="">Semua Wilayah</option>
                                                <option value="Padang Barat">Padang Barat</option>
                                                <option value="Padang Timur">Padang Timur</option>
                                                <option value="Padang Selatan">Padang Selatan</option>
                                                <option value="Padang Utara">Padang Utara</option>
                                                <option value="Koto Tangah">Koto Tangah / Kuranji</option>
                                                <option value="Nanggalo">Nanggalo</option>
                                                <option value="Lubuk Begalung">Lubuk Begalung</option>
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#756A63]" />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Suasana / Vibe Dropdown */}
                                <div className="flex items-center gap-2.5 rounded-2xl border border-[#EBE5DC] bg-[#F8F5F0] p-3 transition-all hover:border-[#FF5C35]/40 lg:col-span-2">
                                    <SlidersHorizontal className="h-5 w-5 shrink-0 text-[#FF5C35]" />
                                    <div className="flex w-full flex-col">
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#756A63]">
                                            Kebutuhan &amp; Vibe
                                        </span>
                                        <div className="relative">
                                            <select
                                                value={selectedTags[0] || ""}
                                                onChange={(e) => {
                                                    const tagVal = e.target.value;
                                                    const newHref = buildFilterHref(effectiveParams, {
                                                        tags: tagVal || undefined,
                                                        tag: undefined,
                                                    });
                                                    router.push(newHref);
                                                }}
                                                className="w-full cursor-pointer appearance-none border-none bg-transparent p-0 pr-5 text-xs font-bold text-[#19120D] outline-none focus:ring-0 sm:text-sm"
                                            >
                                                <option value="">Semua Vibe &amp; Tag</option>
                                                <optgroup label="Aktivitas">
                                                    <option value="wfc">WFC (Work from Cafe)</option>
                                                    <option value="nugas">Nugas</option>
                                                    <option value="nongkrong">Nongkrong Santai</option>
                                                    <option value="nge-date">Nge-date</option>
                                                    <option value="me-time">Me-time</option>
                                                    <option value="meeting">Meeting Room</option>
                                                    <option value="live-musik">Live Musik</option>
                                                </optgroup>
                                                <optgroup label="Suasana &amp; Vibes">
                                                    <option value="tenang">Tenang</option>
                                                    <option value="cozy">Cozy</option>
                                                    <option value="aesthetic">Aesthetic</option>
                                                    <option value="minimalis">Minimalis</option>
                                                    <option value="industrial">Industrial</option>
                                                    <option value="rame">Rame / Hidup</option>
                                                    <option value="healing">Healing</option>
                                                </optgroup>
                                                <optgroup label="Fasilitas Populer">
                                                    <option value="outdoor">Outdoor Asri</option>
                                                    <option value="indoor">Indoor</option>
                                                    <option value="ac">Ruang Ber-AC</option>
                                                    <option value="wifi">WiFi Cepat</option>
                                                    <option value="colokan">Banyak Colokan</option>
                                                    <option value="musholla">Musholla</option>
                                                    <option value="smoking-area">Smoking Area</option>
                                                    <option value="indoor-smoking">Indoor Smoking</option>
                                                    <option value="photobox">Photobox</option>
                                                    <option value="board-game">Board Game</option>
                                                </optgroup>
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#756A63]" />
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Budget Dropdown */}
                                <div className="flex items-center gap-2.5 rounded-2xl border border-[#EBE5DC] bg-[#F8F5F0] p-3 transition-all hover:border-[#FF5C35]/40 lg:col-span-2">
                                    <Wallet className="h-5 w-5 shrink-0 text-[#FF5C35]" />
                                    <div className="flex w-full flex-col">
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#756A63]">
                                            Budget
                                        </span>
                                        <div className="relative">
                                            <select
                                                value={selectedPrice}
                                                onChange={(e) => {
                                                    const priceVal = e.target.value as PriceFilterValue;
                                                    const newHref = buildFilterHref(effectiveParams, {
                                                        price: priceVal,
                                                    });
                                                    router.push(newHref);
                                                }}
                                                className="w-full cursor-pointer appearance-none border-none bg-transparent p-0 pr-5 text-xs font-bold text-[#19120D] outline-none focus:ring-0 sm:text-sm"
                                            >
                                                <option value="all">Semua Harga</option>
                                                <option value="under-20k">&lt; Rp 20k (Hemat)</option>
                                                <option value="20k-40k">Rp 20k – 40k (Mid)</option>
                                                <option value="above-40k">&gt; Rp 40k (Specialty)</option>
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#756A63]" />
                                        </div>
                                    </div>
                                </div>

                                {/* 5. Action Button */}
                                <div className="flex h-full items-center lg:col-span-2">
                                    <button
                                        type="submit"
                                        className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#19120D] text-xs font-bold text-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#FF5C35] hover:shadow-lg active:scale-95 sm:h-12 sm:text-sm"
                                    >
                                        <Search className="h-4 w-4" />
                                        <span>Cari Spot</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* 2. Feature Highlights Bar (Desktop) */}
                <div className="hidden sm:block mb-10">
                    <HomeFeaturePillars />
                </div>

                {/* Top View Controls & Toolbar (Desktop) */}
                <div className="hidden sm:flex mb-6 flex-col gap-3 rounded-2xl border border-[#EBE5DC] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h2 className="font-sans text-lg font-extrabold tracking-tight text-[#19120D] sm:text-xl">
                                {viewMode === "map"
                                    ? "Peta Interaktif Spot Ngopi Padang"
                                    : "Daftar Tempat Kopi Terkurasi"}
                            </h2>
                            <span className="rounded-full bg-[#FFECE5] px-2.5 py-0.5 text-xs font-bold text-[#D8431F]">
                                {places.length} Ditampilkan
                            </span>
                        </div>
                        <p className="mt-0.5 text-xs text-[#756A63]">
                            Menampilkan {places.length} dari {livePlacesData.length} Spot Terkurasi di Kota Padang
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Toggle Terdekat Button */}
                        <button
                            type="button"
                            onClick={handleToggleNearby}
                            disabled={isLocating}
                            title={
                                isNearbyActive
                                    ? "Matikan urutan terdekat"
                                    : "Urutkan cafe terdekat dari lokasimu"
                            }
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold shadow-sm transition active:scale-95 ${
                                isNearbyActive
                                    ? "border-[#19120D] bg-[#19120D] text-white hover:bg-[#FF5C35]"
                                    : "border-[#EBE5DC] bg-white text-[#19120D] hover:border-[#FF5C35] hover:text-[#FF5C35]"
                            }`}
                        >
                            <Navigation
                                className={`h-3.5 w-3.5 ${
                                    isLocating
                                        ? "animate-spin"
                                        : isNearbyActive
                                        ? "text-[#FDBA74]"
                                        : "text-[#FF5C35]"
                                }`}
                            />
                            <span>
                                {isLocating
                                    ? "Mencari Lokasi..."
                                    : isNearbyActive
                                    ? "Terdekat Aktif"
                                    : "📍 Terdekat (GPS)"}
                            </span>
                        </button>

                        {/* Toggle View Mode */}
                        <div className="inline-flex rounded-full border border-[#EBE5DC] bg-[#FAF7F2] p-1 shadow-xs">
                            <button
                                type="button"
                                onClick={() => setViewMode("grid")}
                                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition duration-200 ${
                                    viewMode === "grid"
                                        ? "bg-[#19120D] text-white shadow-sm"
                                        : "text-[#756A63] hover:text-[#19120D] hover:bg-white"
                                }`}
                            >
                                <LayoutGrid className="h-3.5 w-3.5" />
                                <span>Daftar</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("map")}
                                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition duration-200 ${
                                    viewMode === "map"
                                        ? "bg-[#19120D] text-white shadow-sm"
                                        : "text-[#756A63] hover:text-[#19120D] hover:bg-white"
                                }`}
                            >
                                <MapIcon className="h-3.5 w-3.5" />
                                <span>Peta</span>
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsRandomOpen(true)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5C35]/30 bg-[#FFF8EF] px-3.5 py-1.5 text-xs font-bold text-[#FF5C35] shadow-xs transition hover:bg-[#FF5C35] hover:text-white active:scale-95"
                        >
                            <Dices className="h-3.5 w-3.5" />
                            <span>Pilihin Acak 🎲</span>
                        </button>
                    </div>
                </div>

                {/* Indikator Urutan Terdekat Aktif */}
                {isNearbyActive && userCoords && (
                    <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-[#1F5A4A]/25 bg-[#F0F8F5] px-4 py-2.5 text-xs font-bold text-[#1F5A4A] shadow-xs">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1F5A4A] opacity-75"></span>
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#1F5A4A]"></span>
                            </span>
                            <span>Menampilkan urutan dari cafe paling dekat dengan posisimu</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsNearbyActive(false)}
                            className="text-[11px] font-black underline hover:text-[#184639]"
                        >
                            Reset Urutan
                        </button>
                    </div>
                )}

                {/* Conditional View: Full-width Map View vs Sidebar + Places Grid */}
                {viewMode === "map" ? (
                    <div className="w-full">
                        <PlacesMapView places={places} userCoords={userCoords} />
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start xl:grid-cols-[320px_1fr]">
                        <aside className="lg:sticky lg:top-24">
                            {/* Mobile Collapsible Filter Drawer */}
                            <details className="group rounded-[26px] border border-[#E7D8C8] bg-[#FFFDF8] p-4 shadow-[0_14px_45px_rgba(47,35,25,0.06)] lg:hidden">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#F4F1EA] text-[#1F5A4A]">
                                            <SlidersHorizontal className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#201813]">
                                                Filter Pilihan
                                            </p>
                                            <p className="text-xs font-medium text-[#756A60]">
                                                {activeFilterCount > 0
                                                    ? `${activeFilterCount} filter aktif`
                                                    : "Pilih budget, fasilitas, & suasana"}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="rounded-full bg-[#201813] px-3.5 py-1.5 text-xs font-bold text-white transition group-open:bg-[#1F5A4A]">
                                        Pilih Filter
                                    </span>
                                </summary>

                                <div className="mt-4 border-t border-[#E7D8C8] pt-4">
                                    <FilterContent
                                        params={effectiveParams}
                                        selectedTags={selectedTags}
                                        selectedPrice={selectedPrice}
                                        hasFilter={hasFilter}
                                    />
                                </div>
                            </details>

                            {/* Desktop Sticky Filter Card */}
                            <div className="hidden rounded-3xl border border-[#EBE5DC] bg-white p-6 shadow-bento lg:block">
                                <div className="mb-5 flex items-center justify-between border-b border-[#EBE5DC] pb-4">
                                    <div className="flex items-center gap-2">
                                        <SlidersHorizontal className="h-4 w-4 text-[#FF5C35]" />
                                        <h2 className="font-sans text-base font-extrabold text-[#19120D]">
                                            Filter Kurasi
                                        </h2>
                                        {activeFilterCount > 0 && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFECE5] text-[11px] font-extrabold text-[#D8431F]">
                                                {activeFilterCount}
                                            </span>
                                        )}
                                    </div>

                                    {hasFilter ? (
                                        <Link
                                            href="/places/?category=coffee-shop"
                                            onClick={handleClearSearch}
                                            className="text-xs font-bold text-[#FF5C35] transition hover:text-[#D8431F]"
                                        >
                                            Reset Semua
                                        </Link>
                                    ) : null}
                                </div>

                                <FilterContent
                                    params={effectiveParams}
                                    selectedTags={selectedTags}
                                    selectedPrice={selectedPrice}
                                    hasFilter={hasFilter}
                                />
                            </div>
                        </aside>

                        <section className="min-w-0">
                            {/* Interactive Active Filters Bar */}
                            {hasFilter ? (
                                <ActiveFilters
                                    params={effectiveParams}
                                    selectedTags={selectedTags}
                                    selectedPrice={selectedPrice}
                                    onClearSearch={handleClearSearch}
                                />
                            ) : null}

                            {/* Places Grid or Empty State */}
                            {places.length === 0 ? (
                                <div className="px-5 sm:px-0">
                                    <EmptyPlacesState
                                        params={effectiveParams}
                                        onClearSearch={handleClearSearch}
                                    />
                                </div>
                            ) : (
                                <div className="px-5 sm:px-0">
                                    <div className="flex flex-col gap-5 sm:grid sm:gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                        {places.map((place, index) => (
                                            <div
                                                key={place.id}
                                                className={index >= visibleCount ? "hidden sm:block" : ""}
                                            >
                                                <PlaceCard
                                                    place={place}
                                                    source="places_list"
                                                    position={index + 1}
                                                    userDistance={userCoords ? distanceMap[place.slug] : undefined}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Load More Button / All Loaded State on Mobile */}
                                    {places.length > 8 && (
                                        <div className="pt-6 pb-2 flex flex-col items-center sm:hidden">
                                            {visibleCount < places.length ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setVisibleCount((prev) => prev + 8)}
                                                    className="w-full h-12 rounded-full bg-[#efeeea] text-[#0d0401] text-[13px] font-bold hover:bg-[#eae8e4] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-[#e4e2de]/60 shadow-xs cursor-pointer"
                                                >
                                                    <ChevronDown className="h-4.5 w-4.5 text-[#ac3311]" />
                                                    <span>Muat Lebih Banyak Kafe ({Math.min(8, places.length - visibleCount)} Lagi)</span>
                                                </button>
                                            ) : (
                                                <div className="w-full h-11 rounded-full bg-[#efeeea]/80 text-[#80756f] text-[12px] font-semibold flex items-center justify-center gap-2 border border-[#e4e2de]/40">
                                                    <Check className="h-4 w-4 text-emerald-600" />
                                                    <span>Semua Kafe Ditampilkan</span>
                                                </div>
                                            )}
                                            <p className="text-[11px] text-[#80756f] mt-2 text-center">
                                                Menampilkan {Math.min(visibleCount, places.length)} dari {places.length} tempat kopi terkurasi di Padang
                                            </p>
                                        </div>
                                    )}

                                    {/* Curated Map Banner on Mobile */}
                                    <div className="pt-4 pb-2 sm:hidden">
                                        <div
                                            onClick={() => handleSetViewMode("map")}
                                            className="relative overflow-hidden rounded-2xl bg-[#291c14] p-5 text-white shadow-[0_12px_32px_-4px_rgba(41,28,20,0.2)] border border-[#e4e2de]/20 flex items-center justify-between cursor-pointer group active:scale-[0.99] transition-transform"
                                        >
                                            <div className="flex flex-col gap-1 z-10 max-w-[210px]">
                                                <span className="text-[10px] uppercase tracking-wider text-[#ffdbd1] opacity-90 font-bold">
                                                    Mode Peta WFC
                                                </span>
                                                <h3 className="text-[16px] font-bold text-white group-hover:text-[#ffdbd1] transition-colors">
                                                    Cari Kafe di Sekitarmu?
                                                </h3>
                                                <p className="text-[12px] text-[#e4e2de]/90 leading-snug">
                                                    Lihat persebaran spot nugas dengan colokan terdekat di Padang.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                aria-label="Buka Peta"
                                                className="w-12 h-12 rounded-2xl bg-[#ac3311] text-white flex items-center justify-center shrink-0 z-10 shadow-md group-hover:scale-105 active:scale-95 transition-transform"
                                            >
                                                <Navigation className="h-6 w-6" />
                                            </button>
                                            <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-[#ff6e48]/20 blur-xl pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Mobile Editorial Footer (SCREEN_10 style) */}
                                    <div className="mt-8 pt-6 pb-6 border-t border-[#e4e2de]/60 flex flex-col items-center text-center sm:hidden">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <div className="relative w-6 h-6 rounded-md overflow-hidden shrink-0 shadow-xs">
                                                <Image
                                                    src="/icon-192.png"
                                                    alt="Saranwak Logo"
                                                    fill
                                                    sizes="24px"
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
                            )}
                        </section>
                    </div>
                )}
            </section>

            <RandomPlaceModal
                isOpen={isRandomOpen}
                onClose={() => setIsRandomOpen(false)}
                placesData={livePlacesData}
            />

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                initialTags={selectedTags}
                initialOpenNow={effectiveParams.openNow === "true"}
                initialPrice={effectiveParams.price}
                initialQuery={effectiveParams.q}
                initialArea={effectiveParams.area}
            />
        </main>
    );
}
function FilterContent({
    params,
    selectedTags,
    selectedPrice,
    hasFilter,
}: {
    params: PageParams;
    selectedTags: string[];
    selectedPrice: PriceFilterValue;
    hasFilter: boolean;
}) {
    const isOpenNow = params.openNow === "true";

    return (
        <div className="space-y-6">
            {/* Status Jam Buka Section */}
            <div>
                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-[#FF5C35]">
                    Status Operasional
                </p>

                <div className="flex flex-wrap gap-2">
                    <Link
                        href={buildFilterHref(params, {
                            openNow: undefined,
                        })}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition duration-150 ${
                            !isOpenNow
                                ? "bg-[#19120D] text-white shadow-xs"
                                : "border border-[#EBE5DC] bg-[#FAF7F2] text-[#19120D] hover:border-[#FF5C35]"
                        }`}
                    >
                        Semua
                    </Link>

                    <Link
                        href={buildFilterHref(params, {
                            openNow: isOpenNow ? undefined : "true",
                        })}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition duration-150 ${
                            isOpenNow
                                ? "border border-[#FF5C35] bg-[#FFEAE5] text-[#FF5C35] shadow-xs"
                                : "border border-[#EBE5DC] bg-[#FAF7F2] text-[#19120D] hover:border-[#FF5C35]"
                        }`}
                    >
                        <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                        <span>Buka Sekarang</span>
                        {isOpenNow && <Check className="h-3 w-3 shrink-0 text-[#FF5C35]" />}
                    </Link>
                </div>
            </div>

            {/* Budget Section */}
            <div className="border-t border-[#EBE5DC]/80 pt-5">
                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-[#FF5C35]">
                    Range Budget
                </p>

                <div className="grid gap-2">
                    {priceFilterOptions.map((option) => {
                        const active = selectedPrice === option.value;

                        return (
                            <Link
                                key={option.value}
                                href={buildFilterHref(params, {
                                    price: option.value,
                                })}
                                className={`flex items-center justify-between rounded-2xl border px-3.5 py-2.5 text-xs font-bold transition duration-200 ${
                                    active
                                        ? "border-[#19120D] bg-[#19120D] text-white shadow-sm"
                                        : "border-[#EBE5DC] bg-white text-[#19120D] hover:border-[#FF5C35]/50 hover:bg-[#FAF7F2]"
                                }`}
                            >
                                <span>{option.label}</span>
                                {active ? (
                                    <Check className="h-3.5 w-3.5 shrink-0 text-[#FF5C35]" />
                                ) : null}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Filter Groups (Aktivitas, Fasilitas, Vibes) */}
            {placeFilterGroups.map((group) => (
                <div key={group.title} className="border-t border-[#EBE5DC]/80 pt-5">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF5C35]">
                            {group.title}
                        </p>
                        <span className="text-[10px] font-bold text-[#756A63]">
                            {group.options.length} Tag
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {group.options.map((option) => {
                            const active = selectedTags.includes(option.tag);

                            return (
                                <Link
                                    key={option.tag}
                                    href={buildTagHref(params, option.tag)}
                                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition duration-150 ${
                                        active
                                            ? "border-[#FF5C35] bg-[#FFEAE5] text-[#FF5C35] shadow-xs"
                                            : "border-[#EBE5DC] bg-[#FAF7F2] text-[#19120D] hover:border-[#FF5C35] hover:bg-white"
                                    }`}
                                >
                                    {active ? (
                                        <Check className="h-3 w-3 shrink-0 text-[#FF5C35]" />
                                    ) : null}
                                    <span>{option.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Curator Note Card */}
            <div className="mt-4 rounded-2xl border border-[#EBE5DC] bg-[#F4EFEA] p-3.5 text-xs text-[#756A63]">
                <div className="mb-1 flex items-center gap-1.5 font-bold text-[#19120D]">
                    <Lightbulb className="h-4 w-4 text-[#FF5C35]" />
                    <span>Catatan Kurator Saranwak</span>
                </div>
                <p className="leading-relaxed">
                    Kafe bertanda verifikasi Saranwak telah diuji langsung ketersediaan stopkontak per meja, kestabilan WiFi, dan kenyamanan kursinya.
                </p>
            </div>

            {hasFilter ? (
                <div className="pt-2">
                    <Link
                        href="/places/?category=coffee-shop"
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#19120D] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#FF5C35]"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset Semua Filter
                    </Link>
                </div>
            ) : null}
        </div>
    );
}

type ActiveFilterChip = {
    id: string;
    label: string;
    removeHref: string;
};

function ActiveFilters({
    params,
    selectedTags,
    selectedPrice,
    onClearSearch,
}: {
    params: PageParams;
    selectedTags: string[];
    selectedPrice: PriceFilterValue;
    onClearSearch?: () => void;
}) {
    const chips: ActiveFilterChip[] = [];

    if (params.q) {
        chips.push({
            id: `q-${params.q}`,
            label: `Pencarian: "${params.q}"`,
            removeHref: buildFilterHref(params, { q: undefined }),
        });
    }

    if (params.area) {
        chips.push({
            id: `area-${params.area}`,
            label: `Area: ${params.area}`,
            removeHref: buildFilterHref(params, { area: undefined }),
        });
    }

    if (params.category && params.category !== "coffee-shop") {
        chips.push({
            id: `cat-${params.category}`,
            label: `Kategori: ${params.category}`,
            removeHref: buildFilterHref(params, { category: undefined }),
        });
    }

    if (params.openNow === "true") {
        chips.push({
            id: "open-now",
            label: "🟢 Buka Sekarang Saja",
            removeHref: buildFilterHref(params, { openNow: undefined }),
        });
    }

    if (selectedPrice !== "all") {
        const priceLabel =
            priceFilterOptions.find((opt) => opt.value === selectedPrice)?.label ||
            selectedPrice;
        chips.push({
            id: `price-${selectedPrice}`,
            label: priceLabel,
            removeHref: buildFilterHref(params, { price: "all" }),
        });
    }

    selectedTags.forEach((tag) => {
        chips.push({
            id: `tag-${tag}`,
            label: getTagLabel(tag),
            removeHref: buildTagHref(params, tag),
        });
    });

    if (chips.length === 0) return null;

    return (
        <div className="mb-6 rounded-[24px] border border-[#EBE5DC] bg-white p-4 shadow-bento">
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#FF5C35]" />
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#FF5C35]">
                        Filter Aktif ({chips.length})
                    </p>
                </div>

                <Link
                    href="/places/?category=coffee-shop"
                    onClick={() => {
                        if (onClearSearch) onClearSearch();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5C35] transition hover:text-[#D8431F]"
                >
                    <RotateCcw className="h-3 w-3" />
                    Reset Semua
                </Link>
            </div>

            <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                    <Link
                        key={chip.id}
                        href={chip.removeHref}
                        onClick={() => {
                            if (chip.id.startsWith("q-") && onClearSearch) {
                                onClearSearch();
                            }
                        }}
                        title={`Hapus filter ${chip.label}`}
                        className="group inline-flex items-center gap-1.5 rounded-full border border-[#EBE5DC] bg-[#FAF7F2] px-3.5 py-1.5 text-xs font-semibold text-[#19120D] shadow-xs transition hover:border-[#FF5C35] hover:bg-white"
                    >
                        <span>{chip.label}</span>
                        <X className="h-3.5 w-3.5 text-[#756A63] transition group-hover:text-[#FF5C35]" />
                    </Link>
                ))}
            </div>
        </div>
    );
}

function EmptyPlacesState({
    params,
    onClearSearch,
}: {
    params: PageParams;
    onClearSearch?: () => void;
}) {
    const popularTags = [
        { label: "WFC & Nugas", tag: "wfc" },
        { label: "Nongkrong", tag: "nongkrong" },
        { label: "Budget < 20rb", price: "under-20k" },
        { label: "Outdoor", tag: "outdoor" },
    ];

    return (
        <div className="relative overflow-hidden rounded-[32px] border border-dashed border-[#D7C5B2] bg-[#FFFDF8] px-6 py-14 text-center shadow-[0_16px_50px_rgba(47,35,25,0.04)] sm:px-10 sm:py-16">
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[#F2C38B]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-[#1F5A4A]/10 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-md">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#F8F1E8] text-3xl shadow-sm">
                    ☕
                </div>

                <h3 className="mt-5 font-serif text-2xl font-bold tracking-tight text-[#201813] sm:text-3xl">
                    Belum Ada Tempat yang Cocok
                </h3>

                <p className="mt-3 text-sm font-medium leading-7 text-[#756A60]">
                    Kombinasi filter yang kamu pilih belum menemukan hasil. Coba hapus beberapa kriteria atau coba rekomendasi filter populer di bawah.
                </p>

                {/* Popular Tags Quick Shortcuts */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {popularTags.map((item) => (
                        <Link
                            key={item.label}
                            href={
                                item.tag
                                    ? buildTagHref(params, item.tag)
                                    : buildFilterHref(params, { price: item.price as PriceFilterValue })
                            }
                            className="rounded-full border border-[#E7D8C8] bg-white px-3.5 py-1.5 text-xs font-bold text-[#201813] shadow-sm transition hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white"
                        >
                            + {item.label}
                        </Link>
                    ))}
                </div>

                <div className="mt-7 flex justify-center">
                    <Link
                        href="/places/?category=coffee-shop"
                        onClick={() => {
                            if (onClearSearch) onClearSearch();
                        }}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#201813] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#3A2D25]"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Tampilkan Semua Coffee Shop
                    </Link>
                </div>
            </div>
        </div>
    );
}

function makeTitleParts(params: PageParams): { prefix: string; suffix: string } {
    const selectedTags = getSelectedTags(params);

    if (params.q) {
        return {
            prefix: "Hasil pencarian",
            suffix: `"${params.q}"`,
        };
    }

    if (selectedTags.length > 0) {
        return {
            prefix: "Rekomendasi spot",
            suffix: `${getTagLabel(selectedTags[0])} di Padang.`,
        };
    }

    if (params.area) {
        return {
            prefix: "Coffee shop di area",
            suffix: `${params.area}, Padang.`,
        };
    }

    return {
        prefix: "Explore Coffee Shop",
        suffix: "di Padang.",
    };
}

function getSelectedTags(params: PageParams) {
    const tags = [
        ...(params.tags ? params.tags.split(",") : []),
        ...(params.tag ? [params.tag] : []),
    ];

    return Array.from(
        new Set(tags.map((item) => normalizeSlug(item)).filter(Boolean))
    );
}

function getSelectedPrice(price?: string): PriceFilterValue {
    const allowedValues = priceFilterOptions.map((option) => option.value);

    if (price && allowedValues.includes(price as PriceFilterValue)) {
        return price as PriceFilterValue;
    }

    return "all";
}

function matchKeyword(place: Place, keyword?: string) {
    if (!keyword || !keyword.trim()) return true;

    const rawTerms = normalizeSearchText(keyword).split(" ").filter(Boolean);
    if (rawTerms.length === 0) return true;

    let charsText = "";
    if (Array.isArray(place.characteristics)) {
        charsText = place.characteristics
            .map((c) => (typeof c === "string" ? c : `${c.title} ${c.description}`))
            .join(" ");
    } else if (typeof place.characteristics === "string") {
        charsText = place.characteristics;
    }

    const tagsText = getPlaceTags(place)
        .flatMap((tag) => [tag.name, tag.slug, tag.type])
        .filter(Boolean)
        .join(" ");

    const searchableText = normalizeSearchText(
        [
            place.name,
            place.slug,
            place.short_description,
            place.description,
            place.address,
            place.area,
            place.city,
            getCategorySlug(place),
            getCategoryName(place),
            tagsText,
            charsText,
        ]
            .filter(Boolean)
            .join(" ")
    );

    return rawTerms.every((term) => searchableText.includes(term));
}

function matchArea(place: Place, area?: string) {
    if (!area) return true;

    const normalizedArea = normalizeSearchText(area);

    return [place.area, place.city, place.address]
        .filter(Boolean)
        .some((item) => normalizeSearchText(String(item)).includes(normalizedArea));
}

function matchCategory(place: Place, category?: string) {
    if (!category) return true;

    const normalizedCategory = normalizeSlug(category);

    return [getCategorySlug(place), getCategoryName(place)]
        .filter(Boolean)
        .some((item) => normalizeSlug(String(item)).includes(normalizedCategory));
}

function matchAllSelectedTags(place: Place, selectedTags: string[]) {
    if (selectedTags.length === 0) return true;

    const placeTagKeys = getPlaceTagKeys(place);

    return selectedTags.every((selectedTag) =>
        placeTagKeys.includes(normalizeSlug(selectedTag))
    );
}

function getPlaceTagKeys(place: Place) {
    const placeTags = getPlaceTags(place);

    return placeTags.flatMap((tag) => {
        const keys = [tag.id, tag.slug, tag.name, tag.type];

        return keys.filter(Boolean).map((item) => normalizeSlug(String(item)));
    });
}

function matchPrice(place: Place, selectedPrice: PriceFilterValue) {
    if (selectedPrice === "all") return true;

    const min = Number(place.price_min ?? 0);
    const max = Number(place.price_max ?? place.price_min ?? 0);

    if (!min && !max) return false;

    const placeMin = min || max;
    const placeMax = max || min;

    if (selectedPrice === "under-20k") {
        return rangeOverlaps(placeMin, placeMax, 0, 20000);
    }

    if (selectedPrice === "20k-40k") {
        return rangeOverlaps(placeMin, placeMax, 20000, 40000);
    }

    if (selectedPrice === "above-40k") {
        return placeMax > 40000;
    }

    return true;
}

function rangeOverlaps(
    placeMin: number,
    placeMax: number,
    filterMin: number,
    filterMax: number
) {
    return placeMin <= filterMax && placeMax >= filterMin;
}

function getPlaceTags(place: Place): TagItem[] {
    const flexiblePlace = place as PlaceWithFlexibleTags;
    const result: TagItem[] = [];

    const directTags = flexiblePlace.tags ?? [];

    for (const tag of directTags) {
        if (typeof tag === "string") {
            result.push({
                id: tag,
                name: tag,
                slug: tag,
            });
        } else if (tag) {
            result.push(tag);
        }
    }

    const relationalTags = flexiblePlace.place_tags ?? [];

    for (const relation of relationalTags) {
        const maybeTags = relation.tags ?? relation.tag;

        if (Array.isArray(maybeTags)) {
            maybeTags.forEach((tag) => {
                if (tag) result.push(tag);
            });
        } else if (maybeTags) {
            result.push(maybeTags);
        }

        if (relation.tag_id) {
            result.push({
                id: relation.tag_id,
                slug: relation.tag_id,
                name: relation.tag_id,
            });
        }
    }

    return dedupeTags(result);
}

function dedupeTags(tags: TagItem[]) {
    const map = new Map<string, TagItem>();

    for (const tag of tags) {
        const key = normalizeSlug(
            String(tag.slug || tag.id || tag.name || Math.random())
        );

        if (!map.has(key)) {
            map.set(key, tag);
        }
    }

    return Array.from(map.values());
}

function getCategorySlug(place: Place) {
    const flexiblePlace = place as PlaceWithFlexibleTags;

    if (typeof flexiblePlace.categories === "string") {
        return flexiblePlace.categories;
    }

    return (
        flexiblePlace.categories?.slug ||
        flexiblePlace.category_slug ||
        flexiblePlace.category_id ||
        ""
    );
}

function getCategoryName(place: Place) {
    const flexiblePlace = place as PlaceWithFlexibleTags;

    if (typeof flexiblePlace.categories === "string") {
        return flexiblePlace.categories;
    }

    return flexiblePlace.categories?.name || flexiblePlace.category_name || "";
}

function buildTagHref(params: PageParams, tag: string) {
    const selectedTags = getSelectedTags(params);
    const normalizedTag = normalizeSlug(tag);

    const nextTags = selectedTags.includes(normalizedTag)
        ? selectedTags.filter((item) => item !== normalizedTag)
        : [...selectedTags, normalizedTag];

    return buildFilterHref(params, {
        tags: nextTags.length > 0 ? nextTags.join(",") : undefined,
        tag: undefined,
    });
}

function buildFilterHref(params: PageParams, updates: Partial<PageParams>) {
    const searchParams = new URLSearchParams();

    const nextParams: PageParams = {
        ...params,
        ...updates,
    };

    const category = nextParams.category || "coffee-shop";
    searchParams.set("category", category);

    if (nextParams.q) searchParams.set("q", nextParams.q);
    if (nextParams.area) searchParams.set("area", nextParams.area);

    if ("tags" in updates) {
        if (updates.tags) {
            searchParams.set("tags", updates.tags);
        }
    } else if (nextParams.tags) {
        searchParams.set("tags", nextParams.tags);
    } else if (nextParams.tag) {
        searchParams.set("tags", nextParams.tag);
    }

    if (nextParams.price && nextParams.price !== "all") {
        searchParams.set("price", nextParams.price);
    }

    if (nextParams.openNow === "true") {
        searchParams.set("openNow", "true");
    }

    const queryString = searchParams.toString();

    return `/places/${queryString ? `?${queryString}` : ""}`;
}

function getTagLabel(tag: string) {
    const normalizedTag = normalizeSlug(tag);

    for (const group of placeFilterGroups) {
        const option = group.options.find(
            (item) => normalizeSlug(item.tag) === normalizedTag
        );

        if (option) {
            return option.label;
        }
    }

    return tag
        .split("-")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function makeDescription(params: PageParams) {
    const selectedTags = getSelectedTags(params);

    if (params.q) {
        return "Temukan coffee shop yang paling cocok dari hasil pencarian kamu.";
    }

    if (selectedTags.length > 0) {
        return "Rekomendasi tempat berdasarkan aktivitas, fasilitas, vibes, dan kebutuhan kamu.";
    }

    if (params.area) {
        return "Cari tempat ngopi berdasarkan area favorit kamu di Padang.";
    }

    return "Jelajahi coffee shop di Padang berdasarkan kebutuhan, budget, dan suasana.";
}

function normalizeSearchText(value?: string | null): string {
    return String(value ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function normalizeText(value?: string | null) {
    return normalizeSearchText(value);
}

function normalizeSlug(value?: string | null) {
    return String(value ?? "")
        .toLowerCase()
        .trim()
        .replace(/_/g, "-")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}