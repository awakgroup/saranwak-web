"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    MapPin,
    Wallet,
    Search,
    ArrowRight,
    SlidersHorizontal,
    ChevronDown,
} from "lucide-react";
import { FilterModal } from "@/components/home/FilterModal";

const AREA_OPTIONS = [
    { label: "Semua Area Kota", value: "" },
    { label: "Padang Barat (Pantai/Pusat)", value: "Padang Barat" },
    { label: "Padang Timur (Jati)", value: "Padang Timur" },
    { label: "Padang Utara (Khatib/UNP)", value: "Padang Utara" },
    { label: "Padang Selatan (Batang Arau)", value: "Padang Selatan" },
    { label: "Koto Tangah / Kuranji", value: "Koto Tangah" },
];

const BUDGET_OPTIONS = [
    { label: "Semua Range Harga", value: "" },
    { label: "< Rp 20.000 (Hemat)", value: "tier_1" },
    { label: "Rp 20.000 – Rp 35.000 (Reguler)", value: "tier_2" },
    { label: "> Rp 35.000 (Specialty)", value: "tier_3" },
];

const MOBILE_QUICK_CHIPS = [
    { label: "💻 WFC & Nugas", param: "tags=wfc" },
    { label: "☕ Specialty", param: "category=coffee-shop" },
    { label: "🌿 Outdoor", param: "tags=outdoor" },
    { label: "✨ Date & Aesthetic", param: "tags=nge-date" },
    { label: "📍 Padang Barat", param: "q=Padang+Barat" },
    { label: "📍 Padang Selatan", param: "q=Padang+Selatan" },
    { label: "💰 < 20rb", param: "price=tier_1" },
];

export function HomeHeroSection() {
    const router = useRouter();
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedBudget, setSelectedBudget] = useState("");
    const [mobileSearchQuery, setMobileSearchQuery] = useState("");
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    function handleDesktopSearch(e?: React.FormEvent) {
        if (e) e.preventDefault();
        const params = new URLSearchParams();
        params.set("category", "coffee-shop");

        if (selectedArea) {
            params.set("q", selectedArea);
        }
        if (selectedBudget) {
            params.set("price", selectedBudget);
        }

        router.push(`/places?${params.toString()}`);
    }

    function handleMobileSearch(e?: React.FormEvent) {
        if (e) e.preventDefault();
        const params = new URLSearchParams();
        params.set("category", "coffee-shop");

        if (mobileSearchQuery.trim()) {
            params.set("q", mobileSearchQuery.trim());
        }

        router.push(`/places?${params.toString()}`);
    }

    return (
        <>
            <section className="relative px-4 pt-2 sm:px-8 sm:pt-4 md:pt-6 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    {/* 1. Curved Organic Hero Canvas */}
                    <div className="relative flex min-h-[480px] flex-col justify-between overflow-hidden rounded-[2.5rem] border border-[#2A1D15] bg-[#19120D] text-white shadow-2xl lg:min-h-[540px]">
                        {/* Background Hero Image with Atmospheric Soft Overlay */}
                        <div className="pointer-events-none absolute inset-0">
                            <Image
                                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2000&q=85"
                                alt="Atmospheric Coffee Sanctuary Padang"
                                fill
                                priority
                                sizes="(max-width: 1280px) 100vw, 1280px"
                                className="object-cover object-center brightness-[0.72] contrast-105"
                            />
                            {/* Gradients matching Stitch */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#19120D]/90 via-[#19120D]/40 to-transparent" />
                        </div>

                        {/* Ambient Soft Glow */}
                        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gradient-to-br from-[#FF5C35]/30 to-[#FDBA74]/20 blur-3xl" />

                        {/* Hero Content */}
                        <div className="relative z-10 max-w-3xl px-6 pb-6 pt-10 sm:px-12 sm:pt-14 lg:px-16">
                            {/* Top Badge */}
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FDBA74] backdrop-blur-md">
                                <span className="h-2 w-2 animate-ping rounded-full bg-[#FF5C35]" />
                                <span>EXPLORE KOTA PADANG</span>
                            </div>

                            {/* Headline */}
                            <h1 className="font-sans text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                                Ngopi Enak, <br />
                                <span className="font-serif font-normal italic bg-gradient-to-r from-[#FDBA74] via-[#FF8E68] to-[#FF5C35] bg-clip-text text-transparent">
                                    Nugas Tenang di Kota Padang
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="mt-4 max-w-xl text-sm font-normal leading-relaxed text-[#D6CECA] sm:text-base lg:text-lg">
                                Temukan tempat ngopi &amp; WFC terbaik di Padang. Panduan terkurasi puluhan
                                kedai kopi pilihan untuk kerja nyaman dan nongkrong senja tanpa zonk.
                            </p>

                            {/* Action Buttons */}
                            <div className="mt-7 flex flex-wrap items-center gap-3.5">
                                <Link
                                    href="/places?category=coffee-shop"
                                    className="inline-flex items-center gap-2.5 rounded-2xl bg-[#FF5C35] px-7 py-3.5 text-xs font-bold text-white shadow-[0_12px_32px_-4px_rgba(255,92,53,0.35)] transition-all duration-300 hover:scale-105 hover:bg-[#D8431F] hover:shadow-2xl active:scale-95 sm:text-sm"
                                >
                                    <span>Mulai Eksplor</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>

                                <Link
                                    href="/rekomendasi"
                                    className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-xs font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 sm:text-sm"
                                >
                                    <span>Rekomendasi Editor</span>
                                </Link>
                            </div>
                        </div>

                        {/* Floating Travel Search Bar in Hero Footer */}
                        <div className="relative z-10 px-4 pb-8 pt-4 sm:px-10 lg:px-14">
                            {/* Desktop 4-Column Search Capsule */}
                            <div className="hidden rounded-3xl border border-white/40 bg-white/95 p-3 text-[#19120D] shadow-2xl backdrop-blur-2xl sm:block sm:p-4">
                                <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-2 lg:grid-cols-12">
                                    {/* Segment 1: Area / Lokasi */}
                                    <div className="flex items-center gap-3 rounded-2xl border border-[#EBE5DC] bg-[#F8F5F0] p-3 transition-all hover:border-[#FF5C35]/40 lg:col-span-3">
                                        <MapPin className="h-5 w-5 shrink-0 text-[#FF5C35]" />
                                        <div className="flex w-full flex-col">
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#756A63]">
                                                Area / Lokasi
                                            </span>
                                            <div className="relative">
                                                <select
                                                    value={selectedArea}
                                                    onChange={(e) => setSelectedArea(e.target.value)}
                                                    className="w-full cursor-pointer appearance-none border-none bg-transparent p-0 pr-5 text-xs font-bold text-[#19120D] outline-none focus:ring-0 sm:text-sm"
                                                >
                                                    {AREA_OPTIONS.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#756A63]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Segment 2: Vibe & Kebutuhan (Interactive Pop-up Filter Trigger) */}
                                    <button
                                        type="button"
                                        onClick={() => setIsFilterModalOpen(true)}
                                        className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-[#EBE5DC] bg-[#F8F5F0] p-3 text-left transition-all hover:border-[#FF5C35] lg:col-span-4"
                                    >
                                        <SlidersHorizontal className="h-5 w-5 shrink-0 text-[#FF5C35] transition-transform duration-300 group-hover:rotate-45" />
                                        <div className="flex w-full flex-col">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#756A63]">
                                                    Vibe &amp; Kebutuhan
                                                </span>
                                                <span className="rounded-full bg-[#FFEAE5] px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-[#FF5C35]">
                                                    24 Tag
                                                </span>
                                            </div>
                                            <div className="mt-0.5 flex items-center justify-between">
                                                <span className="truncate text-xs font-bold text-[#19120D] transition-colors group-hover:text-[#FF5C35] sm:text-sm">
                                                    Pilih Suasana &amp; Fasilitas
                                                </span>
                                                <ChevronDown className="h-3.5 w-3.5 text-[#756A63] transition-colors group-hover:text-[#FF5C35]" />
                                            </div>
                                        </div>
                                    </button>

                                    {/* Segment 3: Kisaran Budget */}
                                    <div className="flex items-center gap-3 rounded-2xl border border-[#EBE5DC] bg-[#F8F5F0] p-3 transition-all hover:border-[#FF5C35]/40 lg:col-span-3">
                                        <Wallet className="h-5 w-5 shrink-0 text-[#FF5C35]" />
                                        <div className="flex w-full flex-col">
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#756A63]">
                                                Kisaran Budget
                                            </span>
                                            <div className="relative">
                                                <select
                                                    value={selectedBudget}
                                                    onChange={(e) => setSelectedBudget(e.target.value)}
                                                    className="w-full cursor-pointer appearance-none border-none bg-transparent p-0 pr-5 text-xs font-bold text-[#19120D] outline-none focus:ring-0 sm:text-sm"
                                                >
                                                    {BUDGET_OPTIONS.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#756A63]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Segment 4: Action Search Button */}
                                    <div className="flex h-full items-center lg:col-span-2">
                                        <button
                                            type="button"
                                            onClick={handleDesktopSearch}
                                            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#19120D] text-xs font-bold text-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-[#FF5C35] hover:shadow-lg active:scale-95 sm:h-12 sm:text-sm"
                                        >
                                            <Search className="h-4 w-4" />
                                            <span>Cari Spot</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile App-Style Search Trigger & Quick Chips */}
                            <div className="block sm:hidden">
                                <div className="rounded-3xl border border-white/40 bg-white/95 p-3 text-[#19120D] shadow-2xl backdrop-blur-2xl">
                                    <form
                                        onSubmit={handleMobileSearch}
                                        className="flex items-center gap-2 rounded-2xl border border-[#EBE5DC] bg-[#F8F5F0] p-1.5 pl-3 transition-all focus-within:border-[#FF5C35] focus-within:bg-white"
                                    >
                                        <Search className="h-4 w-4 shrink-0 text-[#756A63]" />
                                        <input
                                            type="text"
                                            value={mobileSearchQuery}
                                            onChange={(e) => setMobileSearchQuery(e.target.value)}
                                            placeholder="Cari cafe, area, atau nugas..."
                                            className="w-full bg-transparent text-xs font-bold text-[#19120D] placeholder-[#756A63] outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setIsFilterModalOpen(true)}
                                            aria-label="Filter"
                                            className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#FFEAE5] text-[#FF5C35]"
                                        >
                                            <SlidersHorizontal className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="submit"
                                            className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#FF5C35] text-white shadow-sm transition active:scale-95"
                                            aria-label="Cari"
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </form>

                                    {/* Mobile Quick Tap Chips */}
                                    <div className="no-scrollbar mt-2.5 flex items-center gap-2 overflow-x-auto pb-0.5">
                                        {MOBILE_QUICK_CHIPS.map((chip) => (
                                            <Link
                                                key={chip.label}
                                                href={`/places?${chip.param}`}
                                                className="shrink-0 rounded-full border border-[#EBE5DC] bg-white px-3 py-1.5 text-[11px] font-bold text-[#756A63] shadow-xs transition hover:border-[#FF5C35] hover:text-[#FF5C35] active:scale-95"
                                            >
                                                {chip.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comprehensive 24-Tag Filter Modal */}
            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
            />
        </>
    );
}
