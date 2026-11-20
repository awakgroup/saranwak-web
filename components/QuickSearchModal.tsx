"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Search,
    X,
    MapPin,
    Clock,
    Sparkles,
    ArrowRight,
    CornerDownLeft,
    Coins,
} from "lucide-react";
import { getSafePlaceImageUrl } from "@/lib/image-url";
import { getPlaceOpenStatus } from "@/lib/opening-hours";

export type QuickSearchPlace = {
    id: string;
    name: string;
    slug: string;
    area: string | null;
    city: string | null;
    address: string | null;
    image_url: string | null;
    opening_hours: string | null;
    price_range: string | null;
    short_description?: string | null;
    tags?: Array<{ name: string; slug: string }> | null;
};

type QuickSearchModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const POPULAR_SEARCHES = [
    { label: "Buka Sekarang", query: "openNow:true", isFilter: true },
    { label: "WFC & Colokan", query: "wfc" },
    { label: "Outdoor Sejuk", query: "outdoor" },
    { label: "Suasana Tenang", query: "tenang" },
    { label: "Raden Saleh", query: "Raden Saleh" },
    { label: "Lolong & Pantai", query: "Lolong" },
];

let cachedPlaces: QuickSearchPlace[] | null = null;

export function QuickSearchModal({ isOpen, onClose }: QuickSearchModalProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [places, setPlaces] = useState<QuickSearchPlace[]>(cachedPlaces || []);
    const [isLoading, setIsLoading] = useState(!cachedPlaces);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Ambil data places dari public data saat modal pertama kali dibuka
    useEffect(() => {
        if (!isOpen) return;

        if (cachedPlaces) {
            setPlaces(cachedPlaces);
            setIsLoading(false);
            return;
        }

        let isMounted = true;
        setIsLoading(true);

        fetch("/data/places.json")
            .then((res) => res.json() as Promise<QuickSearchPlace[]>)
            .then((data) => {
                if (isMounted) {
                    cachedPlaces = data;
                    setPlaces(data);
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                console.error("Gagal memuat data pencarian:", err);
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [isOpen]);

    // Fokus input saat modal dibuka & reset state
    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setSelectedIndex(0);
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Kunci scroll body saat modal aktif
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = "";
            };
        }
    }, [isOpen]);

    // Filter hasil pencarian berdasarkan keyword
    const filteredPlaces = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];

        return places
            .filter((place) => {
                const nameMatch = place.name.toLowerCase().includes(q);
                const areaMatch = place.area?.toLowerCase().includes(q) ?? false;
                const addrMatch = place.address?.toLowerCase().includes(q) ?? false;
                const descMatch = place.short_description?.toLowerCase().includes(q) ?? false;
                const tagMatch =
                    place.tags?.some(
                        (t) =>
                            t.name.toLowerCase().includes(q) ||
                            t.slug.toLowerCase().includes(q)
                    ) ?? false;

                return nameMatch || areaMatch || addrMatch || descMatch || tagMatch;
            })
            .slice(0, 8); // Batasi 8 hasil teratas untuk responsivitas maksimal
    }, [places, query]);

    // Reset selected index saat hasil berubah
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    // Navigasi keyboard (Atas, Bawah, Enter, Esc)
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
                return;
            }

            if (filteredPlaces.length === 0) {
                if (e.key === "Enter" && query.trim()) {
                    onClose();
                    router.push(`/places?q=${encodeURIComponent(query.trim())}`);
                }
                return;
            }

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < filteredPlaces.length - 1 ? prev + 1 : 0
                );
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev > 0 ? prev - 1 : filteredPlaces.length - 1
                );
            } else if (e.key === "Enter") {
                e.preventDefault();
                const selected = filteredPlaces[selectedIndex];
                if (selected) {
                    onClose();
                    router.push(`/places/${selected.slug}`);
                }
            }
        },
        [filteredPlaces, selectedIndex, query, onClose, router]
    );

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center p-3 sm:p-6 sm:pt-20 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[#E7E0D5] bg-[#FAF7F2] shadow-2xl transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Bar Input */}
                <div className="relative flex items-center border-b border-[#E7E0D5] bg-white px-4 py-3.5 sm:px-6 sm:py-4">
                    <Search className="h-5 w-5 text-[#80756F] shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Cari nama kafe, area (Lolong, Raden Saleh), atau fasilitas..."
                        className="w-full bg-transparent px-3 text-sm sm:text-base font-medium text-[#19120D] placeholder:text-[#A0958E] focus:outline-none"
                    />
                    {query ? (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery("");
                                inputRef.current?.focus();
                            }}
                            className="rounded-full p-1 text-[#80756F] hover:bg-[#F4EFEB] hover:text-[#19120D]"
                            aria-label="Hapus kata kunci"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    ) : (
                        <kbd className="hidden sm:inline-block rounded-md bg-[#F4EFEB] px-2 py-0.5 text-[11px] font-semibold text-[#80756F]">
                            ESC
                        </kbd>
                    )}
                </div>

                {/* Body Content */}
                <div
                    ref={listRef}
                    className="max-h-[60vh] overflow-y-auto p-3 sm:p-4 scrollbar-thin scrollbar-thumb-[#E7E0D5]"
                >
                    {isLoading ? (
                        <div className="py-12 text-center text-xs text-[#80756F]">
                            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#FF5C35] border-t-transparent mb-2" />
                            <p>Menyiapkan direktori kafe Padang...</p>
                        </div>
                    ) : query.trim() ? (
                        filteredPlaces.length > 0 ? (
                            <div className="space-y-1.5">
                                <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#80756F]">
                                    Ditemukan ({filteredPlaces.length} Kafe)
                                </p>
                                {filteredPlaces.map((place, idx) => {
                                    const isSelected = idx === selectedIndex;
                                    const openStatus = getPlaceOpenStatus(place.opening_hours);
                                    const safeImage = getSafePlaceImageUrl(place.image_url);

                                    return (
                                        <Link
                                            key={place.id}
                                            href={`/places/${place.slug}`}
                                            onClick={onClose}
                                            onMouseEnter={() => setSelectedIndex(idx)}
                                            className={`group flex items-center gap-3.5 rounded-2xl p-2.5 transition-all ${
                                                isSelected
                                                    ? "bg-white shadow-sm ring-1 ring-[#FF5C35]/30"
                                                    : "hover:bg-white/70"
                                            }`}
                                        >
                                            {/* Thumbnail Foto */}
                                            <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-xl bg-[#F0EAE1]">
                                                <Image
                                                    src={safeImage}
                                                    alt={place.name}
                                                    fill
                                                    sizes="52px"
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                />
                                            </div>

                                            {/* Info Kafe */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="truncate text-sm font-bold text-[#19120D] group-hover:text-[#FF5C35]">
                                                        {place.name}
                                                    </h4>
                                                    <span
                                                        className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                                                            openStatus.isOpen
                                                                ? "bg-[#E6F4EA] text-[#137333]"
                                                                : "bg-[#FCE8E6] text-[#C5221F]"
                                                        }`}
                                                    >
                                                        {openStatus.isOpen ? "Buka" : "Tutup"}
                                                    </span>
                                                </div>

                                                <div className="mt-0.5 flex items-center gap-3 text-[11px] text-[#756A63]">
                                                    {place.area && (
                                                        <span className="flex items-center gap-1 truncate">
                                                            <MapPin className="h-3 w-3 shrink-0 text-[#FF5C35]" />
                                                            {place.area}
                                                        </span>
                                                    )}
                                                    {place.price_range && (
                                                        <span className="flex items-center gap-1 shrink-0">
                                                            <Coins className="h-3 w-3 shrink-0 text-[#80756F]" />
                                                            {place.price_range}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Panah Navigasi */}
                                            <div className="shrink-0 pr-1 text-[#C4B8AD] group-hover:text-[#FF5C35]">
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </Link>
                                    );
                                })}

                                {/* Link Lihat Semua di Explore */}
                                <div className="pt-2">
                                    <Link
                                        href={`/places?q=${encodeURIComponent(query.trim())}`}
                                        onClick={onClose}
                                        className="flex items-center justify-center gap-2 rounded-xl bg-[#EFE9DF] py-2.5 text-xs font-bold text-[#19120D] transition hover:bg-[#E4DDD3]"
                                    >
                                        <span>Lihat semua hasil untuk &ldquo;{query}&rdquo; di Explore</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="py-10 text-center">
                                <p className="text-sm font-semibold text-[#19120D]">
                                    Tidak ada kafe yang cocok dengan &ldquo;{query}&rdquo;
                                </p>
                                <p className="mt-1 text-xs text-[#80756F]">
                                    Coba gunakan kata kunci area (misal: Lolong) atau fasilitas (misal: WiFi).
                                </p>
                                <Link
                                    href={`/places?q=${encodeURIComponent(query.trim())}`}
                                    onClick={onClose}
                                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#19120D] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#FF5C35]"
                                >
                                    Cari di Halaman Explore
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        )
                    ) : (
                        /* Default / Rekomendasi Pencarian Populer */
                        <div className="space-y-4 py-2">
                            <div>
                                <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-[#80756F]">
                                    Pencarian Populer di Padang
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {POPULAR_SEARCHES.map((item) => (
                                        <button
                                            key={item.label}
                                            type="button"
                                            onClick={() => {
                                                if (item.isFilter) {
                                                    onClose();
                                                    router.push("/places?openNow=true");
                                                } else {
                                                    setQuery(item.query);
                                                }
                                            }}
                                            className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E0D5] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#19120D] shadow-2xs transition-all hover:border-[#FF5C35] hover:bg-[#FFECE5] hover:text-[#D8431F]"
                                        >
                                            <Sparkles className="h-3 w-3 text-[#FF5C35]" />
                                            <span>{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Rekomendasi Cepat / Kafe Terpilih */}
                            {places.length > 0 && (
                                <div className="pt-2 border-t border-[#E7E0D5]">
                                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#80756F]">
                                        Rekomendasi Favorit
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {places.slice(0, 4).map((p) => {
                                            const openStatus = getPlaceOpenStatus(p.opening_hours);
                                            return (
                                                <Link
                                                    key={p.id}
                                                    href={`/places/${p.slug}`}
                                                    onClick={onClose}
                                                    className="flex items-center gap-2.5 rounded-xl border border-[#E7E0D5]/70 bg-white p-2 transition hover:border-[#FF5C35]/50 hover:shadow-xs"
                                                >
                                                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[#F0EAE1]">
                                                        <Image
                                                            src={getSafePlaceImageUrl(p.image_url)}
                                                            alt={p.name}
                                                            fill
                                                            sizes="40px"
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-xs font-bold text-[#19120D]">
                                                            {p.name}
                                                        </p>
                                                        <p className="text-[10px] text-[#80756F] truncate">
                                                            {p.area || "Padang"} •{" "}
                                                            <span
                                                                className={
                                                                    openStatus.isOpen
                                                                        ? "text-[#137333] font-semibold"
                                                                        : "text-[#C5221F]"
                                                                }
                                                            >
                                                                {openStatus.isOpen ? "Buka" : "Tutup"}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Modal Info */}
                <div className="flex items-center justify-between border-t border-[#E7E0D5] bg-[#F4EFEB] px-4 py-2.5 text-[11px] text-[#80756F]">
                    <span className="inline-flex items-center gap-1">
                        <CornerDownLeft className="h-3 w-3" />
                        Pilih dengan Enter
                    </span>
                    <span>Gunakan panah ↑ ↓ untuk navigasi</span>
                </div>
            </div>
        </div>
    );
}
