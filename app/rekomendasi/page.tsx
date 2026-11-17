import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import { Sparkles, ArrowRight, ArrowUpRight, Compass } from "lucide-react";

import { PlaceCard } from "@/components/PlaceCard";
import {
    getFeaturedPlaces,
    type ApiPlace,
} from "@/lib/api/places";
import type { Place } from "@/types/database";

export const metadata: Metadata = {
    title: "Rekomendasi Coffee Shop Terbaik di Padang — Pilihan Terkurasi",
    description:
        "Koleksi coffee shop pilihan di Padang yang paling cocok untuk nugas laptopan, nongkrong santai bareng teman, meeting kasual, hingga first date.",
    alternates: {
        canonical: "https://saranwak.com/rekomendasi",
    },
    openGraph: {
        title: "Rekomendasi Coffee Shop Terbaik di Padang | Saranwak",
        description:
            "Koleksi coffee shop pilihan di Padang untuk nugas, nongkrong, meeting, dan first date.",
        url: "https://saranwak.com/rekomendasi",
        type: "website",
    },
};

async function getRecommendedPlaces(): Promise<Place[]> {
    try {
        const places = await getFeaturedPlaces(6);
        if (places && places.length > 0) {
            return places.map(mapApiPlaceToLegacyPlace);
        }
    } catch (error) {
        console.error("Recommended places D1 fetch error:", error);
    }

    try {
        const filePath = path.join(process.cwd(), "public", "data", "places.json");
        const fileContent = await fs.readFile(filePath, "utf8");
        const jsonPlaces = JSON.parse(fileContent) as Place[];
        return jsonPlaces.filter((p) => p.is_published).slice(0, 6);
    } catch (fallbackError) {
        console.error("Fallback places.json error in rekomendasi:", fallbackError);
        return [];
    }
}

function mapApiPlaceToLegacyPlace(place: ApiPlace): Place {
    return {
        ...place,
        maps_url: place.google_maps_url,
        is_published: Boolean(place.is_active),
        is_featured: Boolean(place.is_featured),
        tags: [],
        gallery: [],
    } as unknown as Place;
}

const quickFilters = [
    {
        emoji: "💻",
        label: "Nugas & WFC Produktif",
        description: "Wi-Fi kencang, stopkontak melimpah, dan meja kerja ergonomis.",
        tagBadge: "Work From Cafe",
        href: "/rekomendasi/nugas-wfc/",
    },
    {
        emoji: "🌿",
        label: "Outdoor & Senja Asri",
        description: "Area terbuka berangin sepoi, tanaman rindang, dan view sunset.",
        tagBadge: "Outdoor Vibe",
        href: "/rekomendasi/outdoor/",
    },
    {
        emoji: "💬",
        label: "Nongkrong & Ngobrol Santai",
        description: "Suasana akrab dan hidup buat ngobrol lama bareng teman sampai malam.",
        tagBadge: "Hangout Spot",
        href: "/rekomendasi/nongkrong/",
    },
    {
        emoji: "💕",
        label: "First Date & Intimate",
        description: "Pencahayaan temaram, musik latar tenang, dan suasana romantis.",
        tagBadge: "Aesthetic Date",
        href: "/rekomendasi/first-date/",
    },
    {
        emoji: "💰",
        label: "Hemat & Ramah Kantong",
        description: "Pilihan kopi dan camilan enak dengan harga terjangkau di bawah Rp25.000.",
        tagBadge: "Budget Friendly",
        href: "/rekomendasi/murah/",
    },
    {
        emoji: "🎲",
        label: "Board Game & Komunitas",
        description: "Bermain board game seru bareng teman sambil ngopi santai.",
        tagBadge: "Community & Play",
        href: "/rekomendasi/board-game/",
    },
];

const facilityFilters = [
    {
        label: "Outdoor Adem",
        href: "/rekomendasi/outdoor/",
    },
    {
        label: "Wi-Fi + Colokan",
        href: "/rekomendasi/nugas-wfc/",
    },
    {
        label: "Indoor AC Dingin",
        href: "/places/?category=coffee-shop&tags=ac",
    },
    {
        label: "Board Game",
        href: "/rekomendasi/board-game/",
    },
    {
        label: "Indoor Smoking",
        href: "/places/?category=coffee-shop&tags=indoor-smoking",
    },
    {
        label: "Photobox Booth",
        href: "/places/?category=coffee-shop&tags=photobox",
    },
];

const budgetFilters = [
    {
        label: "Di bawah 20k / Ramah Kantong",
        tag: "< 20k",
        href: "/rekomendasi/murah/",
    },
    {
        label: "20k – 40k / Standar Kafe",
        tag: "20k-40k",
        href: "/places/?category=coffee-shop&price=20k-40k",
    },
    {
        label: "Di atas 40k / Specialty Premium",
        tag: "> 40k",
        href: "/places/?category=coffee-shop&price=above-40k",
    },
];

const rekomendasiJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://saranwak.com/rekomendasi#webpage",
    "url": "https://saranwak.com/rekomendasi",
    "name": "Rekomendasi Coffee Shop Terbaik di Padang",
    "description":
        "Koleksi kurasi coffee shop di Padang berdasarkan mood nugas, hangout, first date, outdoor, dan budget.",
    "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Beranda",
                "item": "https://saranwak.com",
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Rekomendasi",
                "item": "https://saranwak.com/rekomendasi",
            },
        ],
    },
};

export default async function RekomendasiPage() {
    const places = await getRecommendedPlaces();

    return (
        <main className="min-h-screen bg-[#F4F1EA] px-3 pb-28 pt-3 text-[#201813] sm:px-6 sm:pb-20 sm:pt-6 lg:px-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(rekomendasiJsonLd),
                }}
            />
            <div className="mx-auto flex max-w-7xl flex-col gap-10 sm:gap-14">
                {/* 1. Editorial Hero Header */}
                <HeroSection />

                {/* 2. Main Content: Activity Collections + Quick Pick Sidebar */}
                <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
                    <ActivitySection />
                    <QuickPickSection />
                </section>

                {/* 3. Featured Spots Grid */}
                <FeaturedSection places={places} />
            </div>
        </main>
    );
}

function HeroSection() {
    return (
        <section className="relative min-h-[400px] overflow-hidden rounded-[32px] border border-[#E4DDD3] bg-[#1E1916] shadow-[0_20px_60px_rgba(32,24,19,0.12)] sm:min-h-[460px] sm:rounded-[44px]">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2000&q=85"
                    alt="Curated coffee recommendations in Padang"
                    fill
                    priority
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-cover object-center brightness-[0.72] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/35" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
            </div>

            <div className="relative z-10 flex min-h-[380px] flex-col justify-between p-6 sm:min-h-[440px] sm:p-10 md:p-14 lg:p-16">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white shadow-sm backdrop-blur-md">
                        <Sparkles className="h-3.5 w-3.5 text-[#F2C38B]" />
                        <span>Koleksi Pilihan Editor</span>
                    </div>

                    <div className="mt-6 max-w-3xl">
                        <h1 className="font-serif text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
                            Cari tempat ngopi
                            <span className="block font-serif italic text-[#F2C38B]">
                                sesuai rencana & mood kamu.
                            </span>
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-white/85 sm:text-base sm:leading-relaxed">
                            Pilih mood, fasilitas utama, atau budget. Biar nggak bingung scrolling
                            dan langsung tahu tempat yang paling pas buat harimu.
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link
                        href="/places?category=coffee-shop"
                        className="inline-flex items-center gap-2 rounded-full bg-[#C8784A] px-6 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#B5673B] active:scale-95 sm:text-sm"
                    >
                        <span>Explore Semua Tempat</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                        href="/places?category=coffee-shop&tags=wfc"
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20 sm:text-sm"
                    >
                        <span>Spot WFC Terpopuler</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

function ActivitySection() {
    return (
        <section className="rounded-[32px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 shadow-[0_16px_50px_rgba(47,35,25,0.05)] sm:p-8">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="mb-2 h-1 w-10 rounded-full bg-[#C8784A]" />
                    <h2 className="font-serif text-2xl font-bold tracking-tight text-[#201813] sm:text-3xl">
                        Mau Ngopi Buat Apa?
                    </h2>
                    <p className="mt-1 text-xs font-semibold text-[#756A60] sm:text-sm">
                        Pilih salah satu kebutuhan, langsung temukan spot yang paling cocok.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {quickFilters.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="group relative flex flex-col justify-between rounded-[24px] border border-[#E7D8C8] bg-[#FAF4ED]/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#1F5A4A]/40 hover:bg-white hover:shadow-[0_16px_36px_rgba(31,90,74,0.12)] active:scale-[0.99]"
                    >
                        <div>
                            <div className="flex items-center justify-between">
                                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-2xl shadow-xs transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-6deg]">
                                    {item.emoji}
                                </div>
                                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-[#1F5A4A] shadow-2xs border border-[#E7D8C8]">
                                    {item.tagBadge}
                                </span>
                            </div>

                            <h3 className="mt-4 font-serif text-lg font-bold text-[#201813] transition group-hover:text-[#1F5A4A]">
                                {item.label}
                            </h3>

                            <p className="mt-1.5 text-xs font-medium leading-relaxed text-[#756A60]">
                                {item.description}
                            </p>
                        </div>

                        <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#1F5A4A] group-hover:text-[#C8784A]">
                            <span>Cek Tempat Pilihan</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

function QuickPickSection() {
    return (
        <aside className="rounded-[32px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 shadow-[0_16px_50px_rgba(47,35,25,0.05)] lg:sticky lg:top-24 lg:self-start">
            <div className="mb-2 h-1 w-10 rounded-full bg-[#1F5A4A]" />

            <h2 className="font-serif text-2xl font-bold tracking-tight text-[#201813]">
                Filter Kilat
            </h2>

            <p className="mt-1 text-xs font-semibold leading-relaxed text-[#756A60]">
                Langsung lompat ke spot berdasarkan fasilitas atau perkiraan budget.
            </p>

            {/* Facility Pills */}
            <div className="mt-6">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8C827A]">
                    Fasilitas Favorit
                </p>

                <div className="flex flex-wrap gap-2">
                    {facilityFilters.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-full border border-[#E7D8C8] bg-[#FAF4ED] px-3.5 py-1.5 text-xs font-bold text-[#4B4038] shadow-2xs transition hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white active:scale-95"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Budget Range Section */}
            <div className="mt-6 border-t border-[#E7D8C8] pt-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8C827A]">
                    Range Budget
                </p>

                <div className="grid gap-2">
                    {budgetFilters.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group flex items-center justify-between rounded-2xl border border-[#E7D8C8] bg-[#FAF4ED] p-3 text-xs font-bold text-[#201813] transition hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white"
                        >
                            <span>{item.label}</span>
                            <ArrowUpRight className="h-4 w-4 text-[#8C827A] transition group-hover:text-white" />
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}

function FeaturedSection({ places }: { places: Place[] }) {
    return (
        <section className="rounded-[32px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 shadow-[0_16px_50px_rgba(47,35,25,0.05)] sm:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="mb-2 h-1 w-10 rounded-full bg-[#C8784A]" />
                    <h2 className="font-serif text-2xl font-bold tracking-tight text-[#201813] sm:text-3xl">
                        Rekomendasi Terfavorit
                    </h2>
                    <p className="mt-1 text-xs font-semibold text-[#756A60] sm:text-sm">
                        Deretan coffee shop pilihan dengan fasilitas lengkap dan ulasan terbaik di Padang.
                    </p>
                </div>

                <Link
                    href="/places/?category=coffee-shop"
                    className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-[#181818] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1F5A4A] active:scale-95"
                >
                    <span>Lihat Semua Tempat</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            {places.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-[#D7C5B2] bg-[#FAF4ED] p-8 text-center">
                    <p className="font-serif text-base font-bold text-[#201813]">
                        Belum ada rekomendasi featured.
                    </p>
                    <p className="mt-1.5 text-xs font-medium text-[#756A60]">
                        Pastikan data tempat aktif sudah tersimpan di database.
                    </p>
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {places.map((place, index) => (
                        <PlaceCard
                            key={place.id}
                            place={place}
                            source="places_list"
                            position={index + 1}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
