"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    MapPin,
    Sparkles,
    Wallet,
    Search,
    ArrowRight,
    Coffee,
    Laptop,
    Waves,
    Mountain,
    Flame,
    ChevronDown,
    SlidersHorizontal,
} from "lucide-react";

const AREA_OPTIONS = [
    { label: "Semua Area", value: "" },
    { label: "Padang Barat", value: "Padang Barat" },
    { label: "Padang Utara", value: "Padang Utara" },
    { label: "Padang Timur", value: "Padang Timur" },
    { label: "Padang Selatan", value: "Padang Selatan" },
    { label: "Koto Tangah", value: "Koto Tangah" },
];

const MOOD_OPTIONS = [
    { label: "Semua Suasana", value: "" },
    { label: "WFC & Nugas", value: "wfc" },
    { label: "Santai & Nongkrong", value: "nongkrong" },
    { label: "Aesthetic & Date", value: "nge-date" },
    { label: "Outdoor & Santai", value: "outdoor" },
    { label: "Tenang & Me-time", value: "tenang" },
];

const BUDGET_OPTIONS = [
    { label: "Semua Budget", value: "" },
    { label: "< 20k (Terjangkau)", value: "tier_1" },
    { label: "20k – 40k (Standar)", value: "tier_2" },
    { label: "> 40k (Premium)", value: "tier_3" },
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

const CATEGORY_EMBLEMS = [
    {
        label: "SPECIALTY COFFEE",
        sub: "Single Origin & Brew",
        icon: Coffee,
        href: "/places?category=coffee-shop",
    },
    {
        label: "WORK FROM CAFE",
        sub: "Wifi & Stopkontak",
        icon: Laptop,
        href: "/places?category=coffee-shop&tags=wfc",
    },
    {
        label: "RIVERSIDE & HERITAGE",
        sub: "Batang Arau & Muaro",
        icon: Waves,
        href: "/places?category=coffee-shop&q=Padang+Selatan",
    },
    {
        label: "ROOFTOP & VIEWS",
        sub: "Bukit Lampu & Sunset",
        icon: Mountain,
        href: "/places?category=coffee-shop&tags=outdoor",
    },
    {
        label: "LOCAL ROASTERY",
        sub: "Kebanggaan Padang",
        icon: Flame,
        href: "/places?category=coffee-shop",
    },
];

export function HomeHeroSection() {
    const router = useRouter();
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedMood, setSelectedMood] = useState("");
    const [selectedBudget, setSelectedBudget] = useState("");
    const [mobileSearchQuery, setMobileSearchQuery] = useState("");

    function handleDesktopSearch(e?: React.FormEvent) {
        if (e) e.preventDefault();
        const params = new URLSearchParams();
        params.set("category", "coffee-shop");

        if (selectedArea) {
            params.set("q", selectedArea);
        }
        if (selectedMood) {
            params.set("tags", selectedMood);
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
        <section className="relative px-3 pt-2 sm:px-6 sm:pt-4 md:pt-6 lg:px-8">
            {/* Top Atmospheric Ambient Glows */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -top-20 -z-10 flex justify-center overflow-hidden"
            >
                <div className="h-[480px] w-[900px] rounded-full bg-[#E5A86D]/20 blur-[130px]" />
                <div className="h-[440px] w-[500px] -translate-x-1/2 rounded-full bg-[#1F5A4A]/12 blur-[140px]" />
            </div>

            <div className="mx-auto max-w-7xl">
                {/* 1. Large Rounded Hero Canvas */}
                <div className="relative min-h-[380px] overflow-hidden rounded-[28px] border border-[#E4DDD3] bg-[#1E1916] shadow-[0_20px_60px_rgba(32,24,19,0.12)] sm:min-h-[500px] sm:rounded-[44px] md:min-h-[620px]">
                    {/* Background Hero Image */}
                    <div className="absolute inset-0">
                        <Image
                            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2000&q=85"
                            alt="Atmospheric coffee shop in Padang"
                            fill
                            priority
                            sizes="(max-width: 1280px) 100vw, 1280px"
                            className="object-cover object-center brightness-[0.78] contrast-[1.05]"
                        />

                        {/* Rich Multi-Layer Gradient Overlays for High Contrast Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/30" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
                        <div className="absolute inset-0 bg-[#201813]/25 mix-blend-multiply" />
                    </div>

                    {/* Subtle Topographic & Editorial Watermark */}
                    <div className="pointer-events-none absolute right-8 top-8 hidden select-none font-mono text-[11px] font-bold tracking-[0.28em] text-white/35 md:block">
                        PADANG, WEST SUMATRA • 0°57′S 100°21′E
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 flex min-h-[360px] flex-col justify-between p-5 sm:min-h-[460px] sm:p-10 md:min-h-[540px] md:p-14 lg:p-16">
                        {/* Top Badge */}
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-md sm:px-4 sm:py-1.5 sm:text-xs">
                            <span className="h-2 w-2 rounded-full bg-[#E5A86D]" />
                            <span>Kurasi Tempat Ngopi & WFC Kota Padang</span>
                        </div>

                        {/* Headline & Description & CTA */}
                        <div className="my-auto max-w-2xl pt-4 sm:pt-8">
                            <h1 className="font-serif text-[32px] font-bold leading-[1.06] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl">
                                Find Your Next
                                <span className="block font-serif italic text-[#F2C38B]">
                                    Coffee Spot.
                                </span>
                            </h1>

                            <p className="mt-2.5 max-w-xl text-xs font-medium leading-relaxed text-white/85 sm:mt-4 sm:text-lg sm:leading-relaxed">
                                Panduan kurasi puluhan coffee shop pilihan di Kota Padang untuk
                                WFC, nugas, meeting santai, hingga nongkrong sore bersama teman.
                            </p>

                            <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
                                <Link
                                    href="/places?category=coffee-shop"
                                    className="group inline-flex items-center gap-2 rounded-full bg-[#C8784A] px-5 py-2.5 text-xs font-bold text-white shadow-[0_12px_28px_rgba(200,120,74,0.35)] transition-all duration-300 hover:scale-[1.02] hover:bg-[#B5673B] active:scale-[0.98] sm:px-7 sm:py-3.5 sm:text-base"
                                >
                                    <span>Jelajahi Sekarang</span>
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 sm:h-4 sm:w-4" />
                                </Link>

                                <Link
                                    href="/rekomendasi"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 sm:px-6 sm:py-3.5 sm:text-base"
                                >
                                    <span>Rekomendasi Editor</span>
                                </Link>
                            </div>
                        </div>

                        {/* Bottom Spacer for overlapping capsule */}
                        <div className="h-6 sm:h-12 md:h-16" />
                    </div>
                </div>

                {/* 2. Floating Search Bar (Responsive App Style) */}
                <div className="relative z-20 -mt-7 px-2 sm:-mt-12 sm:px-6 md:-mt-14">
                    {/* Mobile App-Style Search Trigger & Quick Chips */}
                    <div className="block sm:hidden">
                        <div className="rounded-[24px] border border-[#E7D8C8] bg-[#FFFDF8] p-2.5 shadow-[0_16px_40px_rgba(32,24,19,0.14)] backdrop-blur-2xl">
                            {/* Mobile Input Field */}
                            <form
                                onSubmit={handleMobileSearch}
                                className="flex items-center gap-2 rounded-full border border-[#EADCCB] bg-[#F8F5EE] p-1.5 pl-3.5 transition-all focus-within:border-[#C8784A] focus-within:bg-white"
                            >
                                <Search className="h-4 w-4 shrink-0 text-[#8C827A]" />
                                <input
                                    type="text"
                                    value={mobileSearchQuery}
                                    onChange={(e) => setMobileSearchQuery(e.target.value)}
                                    placeholder="Cari cafe, area, atau mood..."
                                    className="w-full bg-transparent text-xs font-bold text-[#201813] placeholder-[#8C827A] outline-none"
                                />
                                <button
                                    type="submit"
                                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#1F5A4A] text-white shadow-sm transition active:scale-95"
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
                                        className="shrink-0 rounded-full border border-[#E7D8C8] bg-white px-3 py-1.5 text-[11px] font-bold text-[#4B4741] shadow-xs transition active:scale-95 hover:border-[#1F5A4A] hover:text-[#1F5A4A]"
                                    >
                                        {chip.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Desktop 3-Segment ROAMLY Capsule */}
                    <div className="hidden sm:block">
                        <form
                            onSubmit={handleDesktopSearch}
                            className="mx-auto max-w-4xl rounded-full border border-[#E7D8C8] bg-[#FFFDF8] p-2 pl-6 shadow-[0_20px_60px_rgba(32,24,19,0.14)] backdrop-blur-xl"
                        >
                            <div className="flex items-center">
                                {/* Segment 1: Area */}
                                <div className="relative flex flex-1 items-center gap-3 py-1">
                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FAF3EC] text-[#C8784A]">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <label
                                            htmlFor="hero-area-select"
                                            className="block text-[10px] font-black uppercase tracking-[0.16em] text-[#8C827A]"
                                        >
                                            Pilih Area
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="hero-area-select"
                                                value={selectedArea}
                                                onChange={(e) => setSelectedArea(e.target.value)}
                                                className="w-full appearance-none bg-transparent pr-6 text-sm font-bold text-[#201813] outline-none transition focus:text-[#C8784A] cursor-pointer"
                                            >
                                                {AREA_OPTIONS.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8C827A]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Divider 1 */}
                                <div className="h-9 w-px bg-[#E7D8C8]" />

                                {/* Segment 2: Mood */}
                                <div className="relative flex flex-1 items-center gap-3 py-1 pl-4">
                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EEF5F2] text-[#1F5A4A]">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <label
                                            htmlFor="hero-mood-select"
                                            className="block text-[10px] font-black uppercase tracking-[0.16em] text-[#8C827A]"
                                        >
                                            Suasana / Mood
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="hero-mood-select"
                                                value={selectedMood}
                                                onChange={(e) => setSelectedMood(e.target.value)}
                                                className="w-full appearance-none bg-transparent pr-6 text-sm font-bold text-[#201813] outline-none transition focus:text-[#1F5A4A] cursor-pointer"
                                            >
                                                {MOOD_OPTIONS.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8C827A]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Divider 2 */}
                                <div className="h-9 w-px bg-[#E7D8C8]" />

                                {/* Segment 3: Budget */}
                                <div className="relative flex flex-1 items-center gap-3 py-1 pl-4">
                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FAF3EC] text-[#756A60]">
                                        <Wallet className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <label
                                            htmlFor="hero-budget-select"
                                            className="block text-[10px] font-black uppercase tracking-[0.16em] text-[#8C827A]"
                                        >
                                            Range Budget
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="hero-budget-select"
                                                value={selectedBudget}
                                                onChange={(e) => setSelectedBudget(e.target.value)}
                                                className="w-full appearance-none bg-transparent pr-6 text-sm font-bold text-[#201813] outline-none transition focus:text-[#201813] cursor-pointer"
                                            >
                                                {BUDGET_OPTIONS.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8C827A]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Action Button */}
                                <div className="pl-2">
                                    <button
                                        type="submit"
                                        className="flex items-center justify-center gap-2 rounded-full bg-[#1F5A4A] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(31,90,74,0.25)] transition-all duration-300 hover:scale-[1.02] hover:bg-[#174639] active:scale-[0.98]"
                                    >
                                        <Search className="h-4 w-4" />
                                        <span>Cari Tempat</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* 3. Category Emblem Ticker (Beneath Search Bar) */}
                <div className="no-scrollbar mt-6 overflow-x-auto pb-2 sm:mt-12">
                    <div className="flex min-w-max items-center justify-start gap-4 px-2 sm:justify-center sm:gap-10 md:gap-14">
                        {CATEGORY_EMBLEMS.map((emblem) => {
                            const Icon = emblem.icon;
                            return (
                                <Link
                                    key={emblem.label}
                                    href={emblem.href}
                                    className="group flex items-center gap-2 text-[#756A60] transition-colors duration-200 hover:text-[#201813] active:scale-95"
                                >
                                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/80 text-[#756A60] shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1F5A4A] group-hover:text-white sm:h-9 sm:w-9 sm:shadow-sm">
                                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase tracking-[0.16em] transition-colors group-hover:text-[#201813] sm:text-[11px] sm:tracking-[0.18em]">
                                            {emblem.label}
                                        </p>
                                        <p className="hidden text-[10px] font-medium text-[#8C827A] sm:block">
                                            {emblem.sub}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
