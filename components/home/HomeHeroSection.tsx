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
    Laptop,
    Coffee,
    Moon,
    Trees,
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
            {/* Mobile Hero - Exact Match to Stitch Screen 3f54a1c6760d4badb78d709f20d14900 */}
            <div className="block sm:hidden w-full">
                <div className="px-4 pt-2 pb-1 flex flex-col relative">
                    {/* Floating Coffee Cup Illustration with Steam & Beans */}
                    <div className="absolute right-1 -top-1 pointer-events-none select-none z-10 w-28 h-28 flex items-center justify-center animate-coffee-float">
                        <div className="absolute w-20 h-20 rounded-full bg-[#ffdbd1]/50 blur-xl -top-1 -right-1" />
                        <div className="absolute w-16 h-16 rounded-full bg-[#ffddb8]/40 blur-lg bottom-1 left-2" />
                        <svg className="relative w-24 h-24 drop-shadow-[0_8px_16px_rgba(172,51,17,0.18)]" fill="none" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
                            <g className="animate-steam" opacity="0.75">
                                <path d="M68 44C66 36 71 31 70 23" opacity="0.6" stroke="#ac3311" strokeDasharray="2 4" strokeLinecap="round" strokeWidth="2" />
                                <path d="M84 40C88 32 83 25 87 18" opacity="0.7" stroke="#ff6e48" strokeLinecap="round" strokeWidth="2.5" />
                                <path d="M98 43C96 37 101 32 99 26" opacity="0.5" stroke="#bc7700" strokeDasharray="1 3" strokeLinecap="round" strokeWidth="1.8" />
                            </g>
                            <ellipse cx="84" cy="124" fill="#d9c2b5" opacity="0.5" rx="46" ry="13" />
                            <ellipse cx="84" cy="122" fill="#f5f3ef" rx="44" ry="11" stroke="#e4e2de" strokeWidth="1.5" />
                            <ellipse cx="84" cy="121" fill="#eae8e4" rx="34" ry="8" />
                            <path d="M112 82C122 82 129 88 127 98C125 107 116 111 106 108" stroke="#291c14" strokeLinecap="round" strokeWidth="6" />
                            <path d="M112 82C121 82 127 88 125 97C123 105 116 109 107 107" stroke="#d9c2b5" strokeLinecap="round" strokeWidth="3" />
                            <path d="M52 74C52 74 54 112 84 112C114 112 116 74 116 74H52Z" fill="#291c14" />
                            <path d="M54 74C54 74 56 110 84 110C112 110 114 74 114 74H54Z" fill="#fbf9f5" />
                            <ellipse cx="84" cy="74" fill="#e4e2de" rx="30" ry="13" />
                            <ellipse cx="84" cy="74" fill="#4e4540" rx="28" ry="11.5" />
                            <ellipse cx="84" cy="74.5" fill="#651400" rx="26.5" ry="10" />
                            <ellipse cx="84" cy="75" fill="#881f00" rx="25" ry="9" />
                            <g transform="translate(84, 75)">
                                <path d="M0 -5C-7 -3 -11 0 -10 3C-9 6 -3 7 0 7C3 7 9 6 10 3C11 0 7 -3 0 -5Z" fill="#ffdbd1" opacity="0.9" />
                                <path d="M0 -4C-4 -2 -6 0 -5 2C-4 4 -2 5 0 5C2 5 4 4 5 2C6 0 4 -2 0 -4Z" fill="#fbf9f5" />
                                <path d="M0 -6C-2 -4 -4 -1 -3 1C-1 3 0 4 0 5C0 4 1 3 3 1C4 -1 2 -4 0 -6Z" fill="#d9c2b5" />
                                <circle cx="0" cy="2" fill="#bc7700" r="1.5" />
                            </g>
                            <g transform="translate(126, 42) rotate(24)">
                                <ellipse cx="6" cy="4" fill="#291c14" rx="6" ry="4" />
                                <path d="M3 4C6 2 6 6 9 4" stroke="#ffdbd1" strokeLinecap="round" strokeWidth="0.8" />
                            </g>
                            <g transform="translate(34, 102) rotate(-32)">
                                <ellipse cx="5" cy="3.5" fill="#ac3311" opacity="0.85" rx="5" ry="3.5" />
                                <path d="M2 3.5C5 2 5 5 8 3.5" stroke="#f6ded0" strokeLinecap="round" strokeWidth="0.7" />
                            </g>
                            <path d="M132 26L133.5 30L137.5 31.5L133.5 33L132 37L130.5 33L126.5 31.5L130.5 30L132 26Z" fill="#ffb95f" />
                            <path d="M48 48L49 51L52 52L49 53L48 56L47 53L44 52L47 51L48 48Z" fill="#ff6e48" opacity="0.8" />
                            <circle cx="138" cy="64" fill="#ffddb8" r="1.5" />
                            <circle cx="42" cy="78" fill="#ffb4a1" r="1" />
                        </svg>
                    </div>

                    {/* Script Cursive Eyebrow */}
                    <p
                        className="text-[#ac3311] text-[18px] leading-tight font-bold tracking-wide"
                        style={{ fontFamily: "var(--font-caveat), 'Caveat', cursive" }}
                    >
                        Jelajahi Kota Padang
                    </p>

                    {/* Bold Punchy Headline */}
                    <h1 className="text-[#0d0401] text-[28px] leading-[32px] font-extrabold tracking-tight mt-0.5 mb-1.5">
                        Jelajahi.<br />
                        Ngopi.<br />
                        <span className="text-[#ac3311]">Produktif.</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-[#4e4540] text-[12px] leading-relaxed max-w-[260px] mb-3.5">
                        Kurasi ruang ngopi &amp; spot WFC terbaik di Ranah Minang, dibuat khusus untuk fokus dan santai tanpa zonk.
                    </p>

                    {/* Search Bar Capsule */}
                    <form
                        onSubmit={handleMobileSearch}
                        className="w-full bg-white shadow-[0_4px_16px_rgba(41,28,20,0.06)] border border-[#e4e2de]/60 rounded-full p-1 pl-3.5 flex items-center justify-between transition-all focus-within:ring-2 focus-within:ring-[#ac3311]/30"
                    >
                        <div className="flex items-center gap-2 flex-1 min-w-0 mr-1.5">
                            <Search className="h-4 w-4 text-[#80756f] shrink-0" />
                            <input
                                type="text"
                                value={mobileSearchQuery}
                                onChange={(e) => setMobileSearchQuery(e.target.value)}
                                placeholder="Cari spot ngopi, area, vibe..."
                                className="w-full bg-transparent text-[#0d0401] placeholder-[#80756f]/70 text-[12px] font-medium outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            aria-label="Cari"
                            className="w-9 h-9 rounded-full bg-[#ac3311] hover:bg-[#881f00] text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 shrink-0 cursor-pointer"
                        >
                            <Search className="h-3.5 w-3.5" />
                        </button>
                    </form>
                </div>

                {/* 4 Circular Category Quick Icons matching Stitch 3f54a1c6760d4badb78d709f20d14900 */}
                <div className="px-4 mt-3 mb-1">
                    <div className="grid grid-cols-4 gap-2 text-center">
                        <Link href="/places?tags=wfc" className="flex flex-col items-center group">
                            <div className="w-12 h-12 rounded-full bg-[#ff6e48]/20 group-hover:bg-[#ff6e48]/30 flex items-center justify-center text-[#ac3311] transition-all group-active:scale-95 shadow-xs mb-1">
                                <Laptop className="h-5 w-5" />
                            </div>
                            <span className="text-[11px] font-semibold text-[#0d0401]">WFC &amp; Nugas</span>
                        </Link>
                        <Link href="/places?category=coffee-shop" className="flex flex-col items-center group">
                            <div className="w-12 h-12 rounded-full bg-[#ffddb8] group-hover:bg-[#ffb95f] flex items-center justify-center text-[#653e00] transition-all group-active:scale-95 shadow-xs mb-1">
                                <Coffee className="h-5 w-5" />
                            </div>
                            <span className="text-[11px] font-semibold text-[#0d0401]">Specialty</span>
                        </Link>
                        <Link href="/places?tags=24-jam" className="flex flex-col items-center group">
                            <div className="w-12 h-12 rounded-full bg-[#291c14] group-hover:bg-[#4e4540] flex items-center justify-center text-[#ffdbd1] transition-all group-active:scale-95 shadow-xs mb-1">
                                <Moon className="h-5 w-5" />
                            </div>
                            <span className="text-[11px] font-semibold text-[#0d0401]">24 Jam</span>
                        </Link>
                        <Link href="/places?tags=outdoor" className="flex flex-col items-center group">
                            <div className="w-12 h-12 rounded-full bg-[#ffdbd1] group-hover:bg-[#ffb4a1] flex items-center justify-center text-[#ac3311] transition-all group-active:scale-95 shadow-xs mb-1">
                                <Trees className="h-5 w-5" />
                            </div>
                            <span className="text-[11px] font-semibold text-[#0d0401]">Outdoor</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Desktop Hero - Curved Organic Hero Canvas */}
            <section className="hidden sm:block relative px-4 pt-2 sm:px-8 sm:pt-4 md:pt-6 lg:px-12">
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
                                                    3 Aktif
                                                </span>
                                            </div>
                                            <div className="mt-0.5 flex items-center justify-between">
                                                <span className="truncate text-xs font-bold text-[#19120D] transition-colors group-hover:text-[#FF5C35] sm:text-sm">
                                                    24 Tag Kurasi (WFC, Nugas, ...)
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

                                    {/* Mobile 4 Circular Quick Categories matching Stitch 3f54a1c6760d4badb78d709f20d14900 */}
                                    <div className="mt-3.5 grid grid-cols-4 gap-2 text-center border-t border-[#EBE5DC]/60 pt-3">
                                        <Link href="/places?tags=wfc" className="flex flex-col items-center group">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFEAE5] text-[#D8431F] shadow-xs transition-transform active:scale-90 group-hover:scale-105">
                                                <Laptop className="h-5 w-5" />
                                            </div>
                                            <span className="mt-1 text-[11px] font-bold text-[#19120D]">WFC &amp; Nugas</span>
                                        </Link>
                                        <Link href="/places?category=coffee-shop" className="flex flex-col items-center group">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3EDE2] text-[#8C6D53] shadow-xs transition-transform active:scale-90 group-hover:scale-105">
                                                <Coffee className="h-5 w-5" />
                                            </div>
                                            <span className="mt-1 text-[11px] font-bold text-[#19120D]">Specialty</span>
                                        </Link>
                                        <Link href="/places?tags=24-jam" className="flex flex-col items-center group">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDE8FC] text-[#6B46C1] shadow-xs transition-transform active:scale-90 group-hover:scale-105">
                                                <Moon className="h-5 w-5" />
                                            </div>
                                            <span className="mt-1 text-[11px] font-bold text-[#19120D]">24 Jam</span>
                                        </Link>
                                        <Link href="/places?tags=outdoor" className="flex flex-col items-center group">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6F4EA] text-[#1E7E34] shadow-xs transition-transform active:scale-90 group-hover:scale-105">
                                                <Trees className="h-5 w-5" />
                                            </div>
                                            <span className="mt-1 text-[11px] font-bold text-[#19120D]">Outdoor</span>
                                        </Link>
                                    </div>

                                    {/* Mobile Quick Tap Chips */}
                                    <div className="no-scrollbar mt-3 flex items-center gap-2 overflow-x-auto pb-0.5 border-t border-[#EBE5DC]/40 pt-2.5">
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
