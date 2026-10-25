"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Dices,
    X,
    Sparkles,
    RotateCcw,
    ArrowRight,
    Clock,
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

const moodOptions = [
    { label: "Bebas / Semua Mood", value: "all" },
    { label: "💻 Buat Nugas / WFC", value: "nugas" },
    { label: "☕ Nongkrong Santai", value: "nongkrong" },
    { label: "✨ Aesthetic / Nge-date", value: "nge-date" },
    { label: "🌿 Me-Time / Tenang", value: "me-time" },
];

const areaOptions = [
    { label: "Semua Area Padang", value: "all" },
    { label: "Padang Barat", value: "Padang Barat" },
    { label: "Padang Utara", value: "Padang Utara" },
    { label: "Padang Timur", value: "Padang Timur" },
    { label: "Koto Tangah", value: "Koto Tangah" },
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
    // Inisialisasi langsung dengan staticPlaces agar tidak pernah kosong sedetik pun!
    const [allPlaces, setAllPlaces] = useState<Place[]>(() => {
        if (placesData && placesData.length > 0) return placesData;
        return staticPlaces as unknown as Place[];
    });

    const [selectedMood, setSelectedMood] = useState("all");
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
                // Tetap gunakan staticPlaces jika API gagal
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

        // 2. Filter Mood / Aktivitas
        if (selectedMood !== "all") {
            const byMood = filtered.filter((place) => {
                const tagSlugs = extractPlaceTagSlugs(place);
                const matchesTag = tagSlugs.some((s) => s.includes(selectedMood));

                const searchableText = `${place.name} ${place.description || ""} ${place.short_description || ""}`.toLowerCase();
                const matchesText = searchableText.includes(selectedMood);

                return matchesTag || matchesText;
            });

            if (byMood.length > 0) {
                filtered = byMood;
            }
        }

        // 3. Filter Buka Sekarang (jika dicentang)
        if (onlyOpenNow) {
            const byOpenNow = filtered.filter((place) => {
                return getPlaceOpenStatus(place.opening_hours).isOpen;
            });

            // Jika ada yang buka, gunakan. Jika tidak ada yang buka sama sekali (misal jam 4 pagi), gunakan filtered
            if (byOpenNow.length > 0) {
                filtered = byOpenNow;
            }
        }

        const finalCandidates = filtered.length > 0 ? filtered : sourcePool;

        setIsShuffling(true);
        setHasPicked(false);
        setPickedPlace(null);

        // Animasi kocok slot machine selama ~1.1 detik
        let count = 0;
        const maxCount = 14;
        const interval = setInterval(() => {
            const randomSample = finalCandidates[Math.floor(Math.random() * finalCandidates.length)];
            setShufflingName(randomSample?.name || "Mencari cafe terbaik...");
            count += 1;

            if (count >= maxCount) {
                clearInterval(interval);
                const finalWinner = finalCandidates[Math.floor(Math.random() * finalCandidates.length)];
                setPickedPlace(finalWinner);
                setIsShuffling(false);
                setHasPicked(true);
            }
        }, 80);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <div
                className="absolute inset-0 bg-black/65 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[32px] border border-[#E7D8C8] bg-[#FFFDF8] p-5 shadow-2xl sm:p-7">
                {/* Header Modal */}
                <div className="flex items-center justify-between border-b border-[#E7D8C8] pb-4">
                    <div className="flex items-center gap-2.5">
                        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#C8784A] text-lg text-white shadow-md">
                            🎲
                        </span>
                        <div>
                            <h3 className="font-serif text-lg font-bold text-[#201813] sm:text-xl">
                                Bingung Mau Ngopi Di Mana?
                            </h3>
                            <p className="text-xs text-[#756A60]">
                                Biar Saranwak yang pilihin tempat paling pas buat kamu.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="grid h-9 w-9 place-items-center rounded-full bg-[#F4F1EA] text-[#756A60] transition hover:bg-[#E7D8C8] hover:text-[#201813]"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Konten Pemilihan atau Hasil */}
                {!hasPicked ? (
                    <div className="mt-5 space-y-4">
                        {/* Selector Mood */}
                        <div>
                            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-[#C8784A]">
                                1. Mau Suasana Kayak Gimana?
                            </label>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {moodOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setSelectedMood(opt.value)}
                                        className={[
                                            "rounded-2xl border px-3.5 py-2.5 text-left text-xs font-bold transition",
                                            selectedMood === opt.value
                                                ? "border-[#1F5A4A] bg-[#1F5A4A] text-white shadow-sm"
                                                : "border-[#E7D8C8] bg-white text-[#4B4038] hover:bg-[#F8F1E8]",
                                        ].join(" ")}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Selector Area */}
                        <div>
                            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-[#C8784A]">
                                2. Area Mana di Padang?
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {areaOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setSelectedArea(opt.value)}
                                        className={[
                                            "rounded-full border px-3.5 py-2 text-xs font-bold transition",
                                            selectedArea === opt.value
                                                ? "border-[#C8784A] bg-[#C8784A] text-white shadow-sm"
                                                : "border-[#E7D8C8] bg-white text-[#4B4038] hover:bg-[#F8F1E8]",
                                        ].join(" ")}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Checkbox Buka Sekarang */}
                        <div className="rounded-2xl border border-[#E7D8C8] bg-[#F8F1E8]/70 p-3.5">
                            <label className="flex cursor-pointer items-center justify-between gap-3">
                                <span className="flex items-center gap-2 text-xs font-bold text-[#201813]">
                                    <Clock className="h-4 w-4 text-[#1F5A4A]" />
                                    <span>Hanya pilih tempat yang buka sekarang</span>
                                </span>
                                <input
                                    type="checkbox"
                                    checked={onlyOpenNow}
                                    onChange={(e) => setOnlyOpenNow(e.target.checked)}
                                    className="h-4 w-4 accent-[#1F5A4A]"
                                />
                            </label>
                        </div>

                        {/* Shuffle Visual State (Saat Mengocok) */}
                        {isShuffling ? (
                            <div className="my-5 rounded-2xl border border-dashed border-[#C8784A] bg-[#FFF8EF] p-5 text-center">
                                <p className="animate-spin text-3xl">🎲</p>
                                <p className="mt-2 text-xs font-black uppercase tracking-widest text-[#C8784A]">
                                    Sedang mengocok pilihan...
                                </p>
                                <p className="mt-1 font-serif text-xl font-bold text-[#201813]">
                                    {shufflingName}
                                </p>
                            </div>
                        ) : null}

                        {/* Tombol Kocok */}
                        <button
                            type="button"
                            onClick={handlePickRandom}
                            disabled={isShuffling}
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#181818] py-4 text-sm font-black text-white shadow-lg transition hover:bg-[#2A2A2A] active:scale-[0.99] disabled:opacity-50"
                        >
                            <Dices className={`h-5 w-5 text-[#F3C48E] ${isShuffling ? "animate-spin" : ""}`} />
                            <span>{isShuffling ? "Sedang Mengocok..." : "Kocok & Cariin Sekarang!"}</span>
                        </button>
                    </div>
                ) : (
                    /* Hasil Pilihan */
                    pickedPlace && (
                        <div className="mt-5 space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-800">
                                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                                <span>Rekomendasi Terpilih Buat Kamu! 🎉</span>
                            </div>

                            {/* Card Hasil */}
                            <div className="overflow-hidden rounded-[26px] border border-[#E7D8C8] bg-white shadow-md">
                                <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
                                    <img
                                        src={getSafePlaceImageUrl(pickedPlace.image_url)}
                                        alt={pickedPlace.name}
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                                    <div className="absolute left-3 top-3">
                                        <OpenStatusBadge openingHours={pickedPlace.opening_hours} mode="compact" />
                                    </div>
                                    <div className="absolute bottom-3 left-3 right-3 text-white">
                                        <span className="text-[11px] font-bold text-white/80">
                                            {pickedPlace.area || "Padang"}
                                        </span>
                                        <h4 className="font-serif text-xl font-bold leading-tight">
                                            {pickedPlace.name}
                                        </h4>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <p className="line-clamp-2 text-xs leading-relaxed text-[#756A60]">
                                        {pickedPlace.short_description ||
                                            pickedPlace.description ||
                                            "Tempat ngopi pilihan asik buat nongkrong dan santai di Padang."}
                                    </p>

                                    <div className="mt-3 flex items-center justify-between border-t border-[#F4F1EA] pt-3 text-xs font-bold text-[#201813]">
                                        <span className="text-[#C8784A]">
                                            {pickedPlace.price_range || "Harga terjangkau"}
                                        </span>
                                        <span className="text-[#756A60]">
                                            {pickedPlace.opening_hours || "-"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="grid gap-2 sm:grid-cols-2">
                                <Link
                                    href={`/places/${pickedPlace.slug}`}
                                    onClick={onClose}
                                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#1F5A4A] py-3.5 text-xs font-black text-white shadow-md transition hover:bg-[#164337]"
                                >
                                    <span>Buka Detail Tempat</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>

                                <button
                                    type="button"
                                    onClick={handlePickRandom}
                                    className="flex items-center justify-center gap-2 rounded-2xl border border-[#E7D8C8] bg-white py-3.5 text-xs font-bold text-[#201813] transition hover:bg-[#F8F1E8]"
                                >
                                    <RotateCcw className="h-4 w-4 text-[#C8784A]" />
                                    <span>Kocok Ulang 🎲</span>
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => setHasPicked(false)}
                                className="w-full text-center text-xs font-bold text-[#756A60] hover:underline"
                            >
                                ← Ganti Kriteria Filter
                            </button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
