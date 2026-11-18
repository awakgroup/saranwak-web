"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, SlidersHorizontal, Check, RotateCcw } from "lucide-react";

export type FilterModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initialTags?: string[];
};

type TagCategory = {
    title: string;
    description?: string;
    items: {
        id: string;
        label: string;
        paramType: "tag" | "status" | "menu";
    }[];
};

const FILTER_CATEGORIES: TagCategory[] = [
    {
        title: "Status Operasional",
        items: [
            { id: "buka", label: "Sedang Buka", paramType: "status" },
            { id: "24-jam", label: "24 Jam Nonstop", paramType: "tag" },
        ],
    },
    {
        title: "Suasana & Vibe",
        items: [
            { id: "wfc", label: "WFC & Nugas", paramType: "tag" },
            { id: "tenang", label: "Tenang / Me-time", paramType: "tag" },
            { id: "nongkrong", label: "Nongkrong Santai", paramType: "tag" },
            { id: "nge-date", label: "Aesthetic & Date", paramType: "tag" },
            { id: "sunset", label: "Sunset View", paramType: "tag" },
            { id: "heritage", label: "Riverside & Heritage", paramType: "tag" },
            { id: "rooftop", label: "Rooftop & Views", paramType: "tag" },
        ],
    },
    {
        title: "Fasilitas Utama",
        items: [
            { id: "colokan", label: "Stopkontak Banyak", paramType: "tag" },
            { id: "wifi", label: "Wi-Fi Kencang (>30Mbps)", paramType: "tag" },
            { id: "ac", label: "Ruang Ber-AC (Indoor)", paramType: "tag" },
            { id: "outdoor", label: "Area Outdoor Luas", paramType: "tag" },
            { id: "musholla", label: "Musholla Bersih", paramType: "tag" },
            { id: "meeting-room", label: "Private/Meeting Room", paramType: "tag" },
            { id: "parkir-mobil", label: "Parkir Mobil Mudah", paramType: "tag" },
        ],
    },
    {
        title: "Pilihan Menu & Kopi",
        items: [
            { id: "specialty", label: "Specialty Manual Brew", paramType: "tag" },
            { id: "espresso", label: "Espresso Based", paramType: "tag" },
            { id: "makanan-berat", label: "Makanan Berat / Rice Bowl", paramType: "tag" },
            { id: "pastry", label: "Pastry & Croissant", paramType: "tag" },
            { id: "non-coffee", label: "Mocktail / Non-Coffee", paramType: "tag" },
        ],
    },
];

export function FilterModal({ isOpen, onClose, initialTags = [] }: FilterModalProps) {
    const router = useRouter();
    const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    function toggleTag(id: string) {
        setSelectedTags((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        );
    }

    function resetFilters() {
        setSelectedTags([]);
    }

    function applyFilters() {
        const params = new URLSearchParams();
        params.set("category", "coffee-shop");

        if (selectedTags.length > 0) {
            params.set("tags", selectedTags.join(","));
        }

        onClose();
        router.push(`/places?${params.toString()}`);
    }

    const totalActive = selectedTags.length;

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
            <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-[#EBE5DC] bg-[#FAF7F2] shadow-2xl transition-all">
                {/* Modal Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-[#EBE5DC] bg-white px-6 py-5">
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
                            Saring kedai kopi di Padang berdasarkan 24 parameter spesifik
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {totalActive > 0 && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-[#756A63] transition-colors hover:text-[#FF5C35]"
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

                {/* Modal Body (Scrollable with 24 Tags & Categories) */}
                <div className="no-scrollbar flex-1 divide-y divide-[#EBE5DC]/60 overflow-y-auto px-6 py-5 sm:px-7 space-y-6 text-[#19120D]">
                    {FILTER_CATEGORIES.map((category) => (
                        <div key={category.title} className="pt-4 first:pt-0">
                            <span className="mb-3 block text-[11px] font-black uppercase tracking-wider text-[#756A63]">
                                {category.title}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {category.items.map((item) => {
                                    const isSelected = selectedTags.includes(item.id);
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => toggleTag(item.id)}
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
