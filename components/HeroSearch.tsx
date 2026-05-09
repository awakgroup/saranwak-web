"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const quickFilters = [
    {
        label: "Nugas",
        tag: "nugas",
    },
    {
        label: "Healing",
        tag: "healing",
    },
    {
        label: "First Date",
        tag: "first-date",
    },
    {
        label: "Budget Mahasiswa",
        tag: "budget-mahasiswa",
    },
    {
        label: "Outdoor",
        tag: "outdoor",
    },
];

export function HeroSearch() {
    const router = useRouter();
    const [keyword, setKeyword] = useState("");

    function handleSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const params = new URLSearchParams();
        params.set("category", "coffee-shop");

        if (keyword.trim()) {
            params.set("q", keyword.trim());
        }

        router.push(`/places?${params.toString()}`);
    }

    function handleFilter(tag: string) {
        const params = new URLSearchParams();
        params.set("category", "coffee-shop");
        params.set("tag", tag);

        router.push(`/places?${params.toString()}`);
    }

    return (
        <div className="mt-8">
            <form
                onSubmit={handleSearch}
                className="max-w-2xl rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-3 shadow-[0_20px_70px_rgba(32,24,19,0.08)]"
            >
                <div className="flex flex-col gap-3 md:flex-row">
                    <input
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="Cari coffee shop, area, atau mood..."
                        className="min-h-14 flex-1 rounded-2xl bg-[#F6F0E7] px-5 text-sm font-medium text-[#201813] outline-none placeholder:text-[#756A60]"
                    />

                    <button
                        type="submit"
                        className="flex min-h-14 items-center justify-center rounded-2xl bg-[#1F5A4A] px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#18483B]"
                    >
                        Mulai Cari
                    </button>
                </div>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
                {quickFilters.map((filter) => (
                    <button
                        key={filter.tag}
                        type="button"
                        onClick={() => handleFilter(filter.tag)}
                        className="rounded-full border border-[#E7D8C8] bg-[#FFFDF8] px-4 py-2 text-sm font-bold text-[#4B4038] transition hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white"
                    >
                        {filter.label}
                    </button>
                ))}

                <button
                    type="button"
                    onClick={() => router.push("/places?category=coffee-shop")}
                    className="rounded-full border border-[#E7D8C8] bg-[#FFFDF8] px-4 py-2 text-sm font-bold text-[#4B4038] transition hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white"
                >
                    Semua Coffee Shop
                </button>
            </div>
        </div>
    );
}