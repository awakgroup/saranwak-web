"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Dices,
    X,
    RotateCcw,
    ArrowRight,
    MapPin,
    Zap,
    Wifi,
    Sun,
    Coffee,
    Sparkles,
} from "lucide-react";
import type { Place } from "@/types/database";
import { getSafePlaceImageUrl } from "@/lib/image-url";
import { getPlaceOpenStatus } from "@/lib/opening-hours";
import { OpenStatusBadge } from "@/components/OpenStatusBadge";
import staticPlaces from "@/public/data/places.json";

type RandomPlaceModalProps = {
    isOpen: boolean;
    onClose: () => void;
    placesData?: Place[];
};

const categoryOptions = [
    { label: "Semua Kategori", value: "all" },
    { label: "WFC & Nugas", value: "wfc" },
    { label: "Nongkrong", value: "nongkrong" },
    { label: "Nge-date", value: "nge-date" },
    { label: "Tenang", value: "tenang" },
];

const areaOptions = [
    { label: "Semua Wilayah", value: "all" },
    { label: "Padang Barat", value: "Padang Barat" },
    { label: "Padang Timur", value: "Padang Timur" },
    { label: "Padang Utara", value: "Padang Utara" },
    { label: "Padang Selatan", value: "Padang Selatan" },
    { label: "Koto Tangah", value: "Koto Tangah" },
    { label: "Nanggalo", value: "Nanggalo" },
];

function extractPlaceTagSlugs(place: Place): string[] {
    const list: string[] = [];

    // Cek format place.tags (dari API)
    const flexiblePlace = place as unknown as { tags?: Array<{ slug?: string; name?: string } | string> };
    if (Array.isArray(flexiblePlace.tags)) {
        for (const t of flexiblePlace.tags) {
            if (typeof t === "string") {
                list.push(t.toLowerCase());
            } else if (t?.slug) {
                list.push(t.slug.toLowerCase());
            } else if (t?.name) {
                list.push(t.name.toLowerCase());
            }
        }
    }

    // Cek format place.place_tags (dari DB / JSON lokal)
    if (Array.isArray(place.place_tags)) {
        for (const item of place.place_tags) {
            const rawTag = Array.isArray(item.tags)
                ? item.tags[0]
                : (item.tags || (item as unknown as { tag?: { slug?: string; name?: string } }).tag);

            if (rawTag?.slug) {
                list.push(rawTag.slug.toLowerCase());
            } else if (rawTag?.name) {
                list.push(rawTag.name.toLowerCase());
            }
        }
    }

    return list;
}

export function RandomPlaceModal({
    isOpen,
    onClose,
    placesData = [],
}: RandomPlaceModalProps) {
    const [allPlaces, setAllPlaces] = useState<Place[]>(() => {
        if (placesData && placesData.length > 0) return placesData;
        return staticPlaces as unknown as Place[];
    });

    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedArea, setSelectedArea] = useState("all");
    const [onlyOpenNow, setOnlyOpenNow] = useState(true);

    const [isShuffling, setIsShuffling] = useState(false);
    const [shufflingName, setShufflingName] = useState("");
    const [pickedPlace, setPickedPlace] = useState<Place | null>(null);
    const [hasPicked, setHasPicked] = useState(false);

    // Sync jika prop placesData berubah atau fetch update dari API
    useEffect(() => {
        if (placesData && placesData.length > 0) {
            setAllPlaces(placesData);
            return;
        }

        fetch("/api/places?limit=150")
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json() as Promise<{ data?: Place[] }>;
            })
            .then((json) => {
                if (Array.isArray(json?.data) && json.data.length > 0) {
                    setAllPlaces(json.data);
                }
            })
            .catch(() => {
                // Fallback staticPlaces
            });
    }, [placesData]);

    if (!isOpen) return null;

    function handlePickRandom() {
        const sourcePool = allPlaces.length > 0 ? allPlaces : (staticPlaces as unknown as Place[]);

        // 1. Filter Area
        let filtered = sourcePool;
        if (selectedArea !== "all") {
            const targetArea = selectedArea.toLowerCase();
            const byArea = filtered.filter((place) =>
                (place.area || "").toLowerCase().includes(targetArea)
            );
            if (byArea.length > 0) {
                filtered = byArea;
            }
        }

        // 2. Filter Kategori / Tag
        if (selectedCategory !== "all") {
            const byCat = filtered.filter((place) => {
                const tagSlugs = extractPlaceTagSlugs(place);
                const matchesTag = tagSlugs.some((s) => s.includes(selectedCategory));

                const searchableText = `${place.name} ${place.description || ""} ${place.short_description || ""}`.toLowerCase();
                const matchesText = searchableText.includes(selectedCategory);

                return matchesTag || matchesText;
            });

            if (byCat.length > 0) {
                filtered = byCat;
            }
        }

        // 3. Filter Buka Sekarang
        if (onlyOpenNow) {
            const byOpenNow = filtered.filter((place) => {
                return getPlaceOpenStatus(place.opening_hours).isOpen;
            });

            if (byOpenNow.length > 0) {
                filtered = byOpenNow;
            }
        }

        const finalCandidates = filtered.length > 0 ? filtered : sourcePool;

        setIsShuffling(true);
        setHasPicked(false);
        setPickedPlace(null);

        // Animasi acak nama spot
        let count = 0;
        const maxCount = 14;
        const interval = setInterval(() => {
            const randomSample = finalCandidates[Math.floor(Math.random() * finalCandidates.length)];
            setShufflingName(randomSample?.name || "Mencari spot terbaik...");
            count += 1;

            if (count >= maxCount) {
                clearInterval(interval);
                const finalWinner = finalCandidates[Math.floor(Math.random() * finalCandidates.length)];
                setPickedPlace(finalWinner);
                setIsShuffling(false);
                setHasPicked(true);
            }
        }, 75);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <div
                className="absolute inset-0 bg-[#19120D]/80 backdrop-blur-md transition-opacity duration-200"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="custom-scroll relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[32px] border border-[#EBE5DC] bg-white p-5 shadow-2xl overscroll-y-contain sm:p-7 transition-all">
                {/* Header Modal */}
                <div className="flex items-center justify-between border-b border-[#EBE5DC] pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFECE5] text-[#D8431F]">
                            <Dices className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-sans text-base font-extrabold text-[#19120D] sm:text-lg">
                                Pilihan Acak Tempat Ngopi
                            </h3>
                            <p className="text-xs text-[#756A63]">
                                Temukan spot ngopi terkurasi di Padang secara acak.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FAF7F2] text-[#756A63] transition hover:bg-[#EBE5DC] hover:text-[#19120D]"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Konten Pemilihan atau Hasil */}
                {!hasPicked ? (
                    <div className="mt-5 space-y-4">
                        {/* Selector Kategori / Aktivitas */}
                        <div>
                            <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-[#FF5C35]">
                                1. Kebutuhan / Suasana
                            </label>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {categoryOptions.map((opt) => {
                                    const active = selectedCategory === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setSelectedCategory(opt.value)}
                                            className={`rounded-2xl border px-3 py-2.5 text-center text-xs font-bold transition active:scale-[0.98] ${
                                                active
                                                    ? "border-[#19120D] bg-[#19120D] text-white shadow-sm"
                                                    : "border-[#EBE5DC] bg-[#FAF7F2] text-[#19120D] hover:border-[#FF5C35]/50 hover:bg-white"
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Selector Area */}
                        <div>
                            <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-[#FF5C35]">
                                2. Wilayah di Padang
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {areaOptions.map((opt) => {
                                    const active = selectedArea === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setSelectedArea(opt.value)}
                                            className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition active:scale-[0.98] ${
                                                active
                                                    ? "border-[#FF5C35] bg-[#FFECE5] text-[#D8431F] shadow-xs"
                                                    : "border-[#EBE5DC] bg-[#FAF7F2] text-[#19120D] hover:border-[#FF5C35] hover:bg-white"
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Checkbox Buka Sekarang */}
                        <div className="rounded-2xl border border-[#EBE5DC] bg-[#FAF7F2] p-3.5">
                            <label className="flex cursor-pointer items-center justify-between gap-3">
                                <span className="flex items-center gap-2 text-xs font-bold text-[#19120D]">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
                                    </span>
                                    <span>Hanya pilih tempat yang buka sekarang</span>
                                </span>
                                <input
                                    type="checkbox"
                                    checked={onlyOpenNow}
                                    onChange={(e) => setOnlyOpenNow(e.target.checked)}
                                    className="h-4 w-4 accent-[#FF5C35]"
                                />
                            </label>
                        </div>

                        {/* Shuffle Visual State (Saat Mengacak) */}
                        {isShuffling ? (
                            <div className="my-4 rounded-2xl border border-dashed border-[#FF5C35]/50 bg-[#FFF8EF] p-5 text-center">
                                <Dices className="mx-auto h-7 w-7 text-[#FF5C35] animate-spin" />
                                <p className="mt-2 text-[11px] font-black uppercase tracking-wider text-[#FF5C35]">
                                    Sedang mengacak pilihan...
                                </p>
                                <p className="mt-1 font-sans text-base font-extrabold text-[#19120D]">
                                    {shufflingName}
                                </p>
                            </div>
                        ) : null}

                        {/* Tombol Acak */}
                        <button
                            type="button"
                            onClick={handlePickRandom}
                            disabled={isShuffling}
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#19120D] py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#FF5C35] active:scale-[0.99] disabled:opacity-50"
                        >
                            <Dices className={`h-4 w-4 ${isShuffling ? "animate-spin" : ""}`} />
                            <span>{isShuffling ? "Sedang Mengacak..." : "Pilih Tempat Sekarang"}</span>
                        </button>
                    </div>
                ) : (
                    /* Hasil Pilihan */
                    pickedPlace && (
                        <div className="mt-5 space-y-4">
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5C35]/30 bg-[#FFECE5] px-3.5 py-1 text-xs font-bold text-[#D8431F]">
                                <Sparkles className="h-3.5 w-3.5 text-[#FF5C35]" />
                                <span>Rekomendasi Terpilih</span>
                            </div>

                            {/* Card Hasil */}
                            <div className="overflow-hidden rounded-2xl border border-[#EBE5DC] bg-white shadow-sm">
                                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#19120D]">
                                    <Image
                                        src={getSafePlaceImageUrl(pickedPlace.image_url || pickedPlace.main_image_url)}
                                        alt={pickedPlace.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, 500px"
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                                    <div className="absolute left-3 top-3">
                                        <OpenStatusBadge openingHours={pickedPlace.opening_hours} mode="compact" />
                                    </div>
                                    <div className="absolute bottom-3 left-3 right-3 text-white">
                                        <div className="flex items-center gap-1 text-[11px] font-bold text-[#FFDBCE]">
                                            <MapPin className="h-3 w-3 text-[#FF5C35]" />
                                            <span>{pickedPlace.area || "Padang"}</span>
                                        </div>
                                        <h4 className="font-sans text-lg font-extrabold leading-tight text-white sm:text-xl">
                                            {pickedPlace.name}
                                        </h4>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <p className="line-clamp-2 text-xs leading-relaxed text-[#756A63]">
                                        {pickedPlace.short_description ||
                                            pickedPlace.description ||
                                            "Tempat ngopi terkurasi di Kota Padang."}
                                    </p>

                                    <div className="mt-3 flex items-center justify-between border-t border-[#EBE5DC] pt-3 text-xs font-bold text-[#19120D]">
                                        <span className="text-[#FF5C35]">
                                            {pickedPlace.price_range || "Mulai Rp 15k"}
                                        </span>
                                        <span className="text-[#756A63]">
                                            {pickedPlace.opening_hours || "Buka setiap hari"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="grid gap-2 sm:grid-cols-2">
                                <Link
                                    href={`/places/${pickedPlace.slug}`}
                                    onClick={onClose}
                                    className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#19120D] text-xs font-bold text-white shadow-sm transition hover:bg-[#FF5C35] active:scale-95"
                                >
                                    <span>Buka Detail Tempat</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>

                                <button
                                    type="button"
                                    onClick={handlePickRandom}
                                    className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#EBE5DC] bg-white text-xs font-bold text-[#19120D] transition hover:border-[#FF5C35] hover:text-[#FF5C35] active:scale-95"
                                >
                                    <RotateCcw className="h-4 w-4 text-[#FF5C35]" />
                                    <span>Pilih Ulang</span>
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => setHasPicked(false)}
                                className="w-full text-center text-xs font-bold text-[#756A63] hover:text-[#19120D] hover:underline"
                            >
                                ← Ubah Kriteria Pencarian
                            </button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
