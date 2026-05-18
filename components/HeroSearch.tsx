"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    placeFilterGroups,
    placeFilterOptions,
    priceFilterOptions,
    type PriceFilterValue,
} from "@/lib/place-filters";

export function HeroSearch() {
    const router = useRouter();

    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<PriceFilterValue>("all");

    const activeFilterCount =
        selectedTags.length + (selectedPrice !== "all" ? 1 : 0);

    const hasActiveFilter = activeFilterCount > 0;

    function toggleTag(tag: string) {
        setSelectedTags((prev) => {
            const isSelected = prev.includes(tag);

            if (isSelected) {
                return prev.filter((item) => item !== tag);
            }

            return [...prev, tag];
        });
    }

    function handleFilterSearch() {
        const params = new URLSearchParams();
        params.set("category", "coffee-shop");

        if (selectedTags.length > 0) {
            params.set("tags", selectedTags.join(","));
        }

        if (selectedPrice !== "all") {
            params.set("price", selectedPrice);
        }

        router.push(`/places?${params.toString()}`);
    }

    function clearFilters() {
        setSelectedTags([]);
        setSelectedPrice("all");
    }

    function getSelectedLabel(tag: string) {
        return placeFilterOptions.find((item) => item.tag === tag)?.label || tag;
    }

    function getSelectedPriceLabel(price: PriceFilterValue) {
        return priceFilterOptions.find((item) => item.value === price)?.label;
    }

    const selectedLabels = [
        ...selectedTags.map((tag) => getSelectedLabel(tag)),
        selectedPrice !== "all" ? getSelectedPriceLabel(selectedPrice) : null,
    ].filter(Boolean);

    return (
        <section className="mt-8 w-full">
            <div className="relative max-w-3xl overflow-hidden rounded-[32px] border border-[#EADCCB] bg-[#FFFDF8]/90 p-4 shadow-[0_24px_80px_rgba(45,33,24,0.10)] backdrop-blur md:p-5">
                <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#F3C48E]/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-[#1F5A4A]/10 blur-3xl" />

                <div className="relative">
                    <div className="mb-5 flex flex-col gap-4 border-b border-[#EADCCB] pb-5 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#EADCCB] bg-white/70 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-[#C8784A]">
                                <span className="h-2 w-2 rounded-full bg-[#1F5A4A]" />
                                Filter Cepat
                            </div>

                            <h2 className="text-xl font-black tracking-[-0.04em] text-[#201813] md:text-2xl">
                                Cari tempat sesuai kebutuhan kamu.
                            </h2>

                            <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-[#756A60]">
                                Pilih budget, aktivitas, fasilitas, dan vibes. Saranwak bantu
                                munculin tempat yang paling nyambung buat rencana kamu hari ini.
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            <div className="rounded-2xl border border-[#EADCCB] bg-white/80 px-4 py-3 text-center shadow-sm">
                                <p className="text-2xl font-black leading-none text-[#1F5A4A]">
                                    {activeFilterCount}
                                </p>
                                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#756A60]">
                                    Dipilih
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#C8784A]">
                                    Harga
                                </p>

                                <p className="hidden text-xs font-bold text-[#9B8B7E] sm:block">
                                    Sesuaikan dengan budget nongkrong kamu.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {priceFilterOptions.map((option) => {
                                    const active = selectedPrice === option.value;

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setSelectedPrice(option.value)}
                                            className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-black transition duration-200 ${active
                                                    ? "border-[#1F5A4A] bg-[#1F5A4A] text-white shadow-[0_10px_24px_rgba(31,90,74,0.22)]"
                                                    : "border-[#EADCCB] bg-white/80 text-[#4B4038] hover:-translate-y-0.5 hover:border-[#1F5A4A] hover:text-[#1F5A4A] hover:shadow-sm"
                                                }`}
                                        >
                                            <span
                                                className={`grid h-5 w-5 place-items-center rounded-full text-[11px] ${active
                                                        ? "bg-white text-[#1F5A4A]"
                                                        : "bg-[#F6F0E7] text-[#8B7766] group-hover:bg-[#1F5A4A] group-hover:text-white"
                                                    }`}
                                            >
                                                {active ? "✓" : "+"}
                                            </span>
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {placeFilterGroups.map((group) => (
                            <div key={group.title}>
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#C8784A]">
                                        {group.title}
                                    </p>

                                    <div className="hidden h-px flex-1 bg-[#EADCCB] sm:block" />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {group.options.map((option) => {
                                        const active = selectedTags.includes(option.tag);

                                        return (
                                            <button
                                                key={option.tag}
                                                type="button"
                                                onClick={() => toggleTag(option.tag)}
                                                className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-black transition duration-200 ${active
                                                        ? "border-[#1F5A4A] bg-[#1F5A4A] text-white shadow-[0_10px_24px_rgba(31,90,74,0.22)]"
                                                        : "border-[#EADCCB] bg-white/80 text-[#4B4038] hover:-translate-y-0.5 hover:border-[#1F5A4A] hover:text-[#1F5A4A] hover:shadow-sm"
                                                    }`}
                                            >
                                                <span
                                                    className={`grid h-5 w-5 place-items-center rounded-full text-[11px] ${active
                                                            ? "bg-white text-[#1F5A4A]"
                                                            : "bg-[#F6F0E7] text-[#8B7766] group-hover:bg-[#1F5A4A] group-hover:text-white"
                                                        }`}
                                                >
                                                    {active ? "✓" : "+"}
                                                </span>
                                                {option.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {hasActiveFilter ? (
                        <div className="mt-5 rounded-[22px] border border-[#EADCCB] bg-[#F6F0E7]/80 px-4 py-3">
                            <p className="text-xs font-bold leading-6 text-[#756A60]">
                                Kamu memilih:{" "}
                                <span className="font-black text-[#201813]">
                                    {selectedLabels.join(", ")}
                                </span>
                            </p>
                        </div>
                    ) : (
                        <div className="mt-5 rounded-[22px] border border-dashed border-[#D7C5B2] bg-white/55 px-4 py-3">
                            <p className="text-xs font-bold leading-6 text-[#756A60]">
                                Belum pilih filter. Kamu bisa langsung lihat semua tempat, atau
                                pilih beberapa filter biar rekomendasinya lebih pas.
                            </p>
                        </div>
                    )}

                    <div className="mt-5 grid gap-2 sm:flex sm:flex-wrap">
                        <button
                            type="button"
                            onClick={handleFilterSearch}
                            disabled={!hasActiveFilter}
                            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#181818] px-5 py-3 text-sm font-black text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#2A2A2A] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Terapkan Filter
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push("/places?category=coffee-shop")}
                            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#EADCCB] bg-white/80 px-5 py-3 text-sm font-black text-[#4B4038] transition duration-200 hover:-translate-y-0.5 hover:bg-[#181818] hover:text-white"
                        >
                            Lihat Semua
                        </button>

                        {hasActiveFilter ? (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#EADCCB] bg-transparent px-5 py-3 text-sm font-black text-[#756A60] transition duration-200 hover:bg-white hover:text-[#201813]"
                            >
                                Reset
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}