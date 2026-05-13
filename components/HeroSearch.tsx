"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
    placeFilterGroups,
    placeFilterOptions,
    priceFilterOptions,
    type PriceFilterValue,
} from "@/lib/place-filters";

export function HeroSearch() {
    const router = useRouter();

    const [keyword, setKeyword] = useState("");
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

    function handleKeywordSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const params = new URLSearchParams();
        params.set("category", "coffee-shop");

        if (keyword.trim()) {
            params.set("q", keyword.trim());
        }

        router.push(`/places?${params.toString()}`);
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

    return (
        <div className="mt-8">
            <form
                onSubmit={handleKeywordSearch}
                className="max-w-2xl rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-3 shadow-[0_20px_70px_rgba(32,24,19,0.08)]"
            >
                <div className="flex flex-col gap-3 md:flex-row">
                    <input
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="Cari cafe, area, atau tempat nongkrong..."
                        className="min-h-14 flex-1 rounded-2xl bg-[#F6F0E7] px-5 text-sm font-bold text-[#201813] outline-none placeholder:text-[#756A60]"
                    />

                    <button
                        type="submit"
                        className="flex min-h-14 items-center justify-center rounded-2xl bg-[#1F5A4A] px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#18483B]"
                    >
                        Mulai Cari
                    </button>
                </div>
            </form>

            <div className="mt-5 max-w-2xl rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8]/75 p-4 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-black text-[#201813]">
                            Cari sesuai kebutuhan
                        </p>

                        <p className="mt-1 text-xs font-semibold text-[#756A60]">
                            Pilih budget, aktivitas, fasilitas, dan vibes yang kamu butuhkan.
                        </p>
                    </div>

                    <span className="rounded-full bg-[#1F5A4A] px-3 py-2 text-xs font-black text-white">
                        {activeFilterCount} dipilih
                    </span>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#C8784A]">
                            Harga
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {priceFilterOptions.map((option) => {
                                const active = selectedPrice === option.value;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setSelectedPrice(option.value)}
                                        className={`rounded-full border px-4 py-2 text-sm font-black transition ${active
                                                ? "border-[#1F5A4A] bg-[#1F5A4A] text-white shadow-sm"
                                                : "border-[#E7D8C8] bg-[#FFFDF8] text-[#4B4038] hover:border-[#1F5A4A] hover:text-[#1F5A4A]"
                                            }`}
                                    >
                                        <span className="mr-2">{active ? "✓" : "+"}</span>
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {placeFilterGroups.map((group) => (
                        <div key={group.title}>
                            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#C8784A]">
                                {group.title}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {group.options.map((option) => {
                                    const active = selectedTags.includes(option.tag);

                                    return (
                                        <button
                                            key={option.tag}
                                            type="button"
                                            onClick={() => toggleTag(option.tag)}
                                            className={`rounded-full border px-4 py-2 text-sm font-black transition ${active
                                                    ? "border-[#1F5A4A] bg-[#1F5A4A] text-white shadow-sm"
                                                    : "border-[#E7D8C8] bg-[#FFFDF8] text-[#4B4038] hover:border-[#1F5A4A] hover:text-[#1F5A4A]"
                                                }`}
                                        >
                                            <span className="mr-2">{active ? "✓" : "+"}</span>
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {hasActiveFilter ? (
                    <div className="mt-4 rounded-2xl bg-[#F6F0E7] px-4 py-3">
                        <p className="text-xs font-bold text-[#756A60]">
                            Dipilih:{" "}
                            <span className="text-[#201813]">
                                {[
                                    ...selectedTags.map((tag) => getSelectedLabel(tag)),
                                    selectedPrice !== "all"
                                        ? getSelectedPriceLabel(selectedPrice)
                                        : null,
                                ]
                                    .filter(Boolean)
                                    .join(", ")}
                            </span>
                        </p>
                    </div>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={handleFilterSearch}
                        disabled={!hasActiveFilter}
                        className="rounded-2xl bg-[#181818] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#2A2A2A] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Terapkan Filter
                    </button>

                    {hasActiveFilter ? (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded-2xl border border-[#E7D8C8] bg-[#FFFDF8] px-5 py-3 text-sm font-black text-[#4B4038] transition hover:bg-[#181818] hover:text-white"
                        >
                            Reset Filter
                        </button>
                    ) : null}

                    <button
                        type="button"
                        onClick={() => router.push("/places?category=coffee-shop")}
                        className="rounded-2xl border border-[#E7D8C8] bg-[#FFFDF8] px-5 py-3 text-sm font-black text-[#4B4038] transition hover:bg-[#181818] hover:text-white"
                    >
                        Lihat Semua
                    </button>
                </div>
            </div>
        </div>
    );
}