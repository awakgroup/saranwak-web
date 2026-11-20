"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, SlidersHorizontal, Check, RotateCcw } from "lucide-react";

export type FilterModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initialTags?: string[];
    initialOpenNow?: boolean;
    initialPrice?: string;
    initialQuery?: string;
    initialArea?: string;
};

type FilterItem = {
    id: string;
    label: string;
    type: "tag" | "status" | "price";
};

type FilterCategory = {
    title: string;
    items: FilterItem[];
};

// Seluruh tag disesuaikan 100% dengan seed database tags & places.json Saranwak
const FILTER_CATEGORIES: FilterCategory[] = [
    {
        title: "Status Operasional",
        items: [
            { id: "open-now", label: "Sedang Buka", type: "status" },
        ],
    },
    {
        title: "Aktivitas & Kebutuhan",
        items: [
            { id: "wfc", label: "WFC", type: "tag" },
            { id: "nugas", label: "Nugas", type: "tag" },
            { id: "nongkrong", label: "Nongkrong", type: "tag" },
            { id: "nge-date", label: "Nge-date", type: "tag" },
            { id: "me-time", label: "Me-time", type: "tag" },
            { id: "meeting", label: "Meeting", type: "tag" },
            { id: "live-musik", label: "Live Musik", type: "tag" },
        ],
    },
    {
        title: "Fasilitas Utama",
        items: [
            { id: "wifi", label: "WiFi", type: "tag" },
            { id: "colokan", label: "Colokan", type: "tag" },
            { id: "ac", label: "AC", type: "tag" },
            { id: "outdoor", label: "Outdoor", type: "tag" },
            { id: "indoor", label: "Indoor", type: "tag" },
            { id: "musholla", label: "Musholla", type: "tag" },
            { id: "smoking-area", label: "Smoking Area", type: "tag" },
            { id: "indoor-smoking", label: "Indoor Smoking", type: "tag" },
            { id: "toilet", label: "Toilet", type: "tag" },
            { id: "photobox", label: "Photobox", type: "tag" },
            { id: "board-game", label: "Board Game", type: "tag" },
        ],
    },
    {
        title: "Suasana & Vibes",
        items: [
            { id: "tenang", label: "Tenang", type: "tag" },
            { id: "rame", label: "Rame", type: "tag" },
        ],
    },
    {
        title: "Kisaran Budget",
        items: [
            { id: "under-20k", label: "< Rp 20.000", type: "price" },
            { id: "20k-40k", label: "Rp 20.000 – Rp 40.000", type: "price" },
            { id: "above-40k", label: "> Rp 40.000", type: "price" },
        ],
    },
];

export function FilterModal({
    isOpen,
    onClose,
    initialTags = [],
    initialOpenNow = false,
    initialPrice = "",
    initialQuery = "",
    initialArea = "",
}: FilterModalProps) {
    const router = useRouter();
    const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
    const [isOpenNowSelected, setIsOpenNowSelected] = useState<boolean>(initialOpenNow);
    const [selectedPrice, setSelectedPrice] = useState<string>(initialPrice);

    useEffect(() => {
        if (isOpen) {
            setSelectedTags(initialTags);
            setIsOpenNowSelected(initialOpenNow);
            setSelectedPrice(initialPrice || "");
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, initialTags, initialOpenNow, initialPrice]);

    if (!isOpen) return null;

    function handleToggleItem(item: FilterItem) {
        if (item.type === "status") {
            setIsOpenNowSelected((prev) => !prev);
        } else if (item.type === "price") {
            setSelectedPrice((prev) => (prev === item.id ? "" : item.id));
        } else {
            setSelectedTags((prev) =>
                prev.includes(item.id)
                    ? prev.filter((t) => t !== item.id)
                    : [...prev, item.id]
            );
        }
    }

    function resetFilters() {
        setSelectedTags([]);
        setIsOpenNowSelected(false);
        setSelectedPrice("");
    }

    function applyFilters() {
        const params = new URLSearchParams();
        params.set("category", "coffee-shop");

        if (initialQuery?.trim()) {
            params.set("q", initialQuery.trim());
        }

        if (initialArea) {
            params.set("area", initialArea);
        }

        if (isOpenNowSelected) {
            params.set("openNow", "true");
        }

        if (selectedPrice && selectedPrice !== "all") {
            params.set("price", selectedPrice);
        }

        if (selectedTags.length > 0) {
            params.set("tags", selectedTags.join(","));
        }

        onClose();
        router.push(`/places/?${params.toString()}`, { scroll: false });
    }

    const totalActive =
        selectedTags.length +
        (isOpenNowSelected ? 1 : 0) +
        (selectedPrice ? 1 : 0);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 lg:p-6"
        >
            {/* Backdrop Blur Overlay */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-[#19120D]/80 backdrop-blur-md transition-opacity duration-300"
            />

            {/* Modal Container Card */}
            <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-[#EBE5DC] bg-[#FAF7F2] shadow-2xl transition-all">
                {/* Modal Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-[#EBE5DC] bg-white px-6 py-4.5">
                    <div>
                        <div className="mb-1 flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFEAE5] text-[#FF5C35]">
                                <SlidersHorizontal className="h-4 w-4" />
                            </span>
                            <h2
                                id="filter-modal-title"
                                className="font-sans text-lg font-extrabold text-[#19120D] sm:text-xl"
                            >
                                Filter Kurasi Lengkap
                            </h2>
                            {totalActive > 0 && (
                                <span className="rounded-full bg-[#FF5C35] px-2.5 py-0.5 text-[11px] font-extrabold text-white shadow-xs">
                                    {totalActive} Aktif
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-[#756A63]">
                            Saring spot ngopi berdasarkan tag kurasi, fasilitas, suasana &amp; budget
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {totalActive > 0 && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#756A63] transition-colors hover:text-[#FF5C35]"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                <span>Reset</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Tutup Filter"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EBE5DC] bg-[#FAF7F2] text-[#19120D] transition-all duration-200 hover:bg-[#FFEAE5] hover:text-[#FF5C35] active:scale-95"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Modal Body (Scrollable with Official Tags & Categories) */}
                <div className="custom-scroll flex-1 divide-y divide-[#EBE5DC]/60 overflow-y-auto px-6 py-5 sm:px-7 space-y-5 text-[#19120D] overscroll-y-contain">
                    {FILTER_CATEGORIES.map((category) => (
                        <div key={category.title} className="pt-4 first:pt-0">
                            <span className="mb-2.5 block text-[11px] font-black uppercase tracking-wider text-[#756A63]">
                                {category.title}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {category.items.map((item) => {
                                    let isSelected = false;
                                    if (item.type === "status") {
                                        isSelected = isOpenNowSelected;
                                    } else if (item.type === "price") {
                                        isSelected = selectedPrice === item.id;
                                    } else {
                                        isSelected = selectedTags.includes(item.id);
                                    }

                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => handleToggleItem(item)}
                                            className={[
                                                "inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all duration-150 active:scale-95",
                                                isSelected
                                                    ? "border-[#19120D] bg-[#19120D] text-white shadow-sm"
                                                    : "border-[#EBE5DC] bg-white text-[#19120D] hover:border-[#FF5C35]/50 hover:bg-[#FFFDF8]",
                                            ].join(" ")}
                                        >
                                            {isSelected && <Check className="h-3.5 w-3.5 text-[#FF5C35]" />}
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal Footer */}
                <div className="flex shrink-0 items-center justify-between border-t border-[#EBE5DC] bg-white px-6 py-4">
                    <span className="text-xs font-semibold text-[#756A63]">
                        {totalActive > 0
                            ? `${totalActive} parameter filter dipilih`
                            : "Belum ada filter aktif"}
                    </span>
                    <button
                        type="button"
                        onClick={applyFilters}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#FF5C35] px-6 py-3 text-xs font-extrabold text-white shadow-md shadow-[#FF5C35]/25 transition duration-200 hover:scale-105 hover:bg-[#D8431F] active:scale-95 sm:text-sm"
                    >
                        <span>Terapkan Filter</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
