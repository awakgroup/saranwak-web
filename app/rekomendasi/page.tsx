import Link from "next/link";

import { PlaceCard } from "@/components/PlaceCard";
import {
    getFeaturedPlaces,
    type ApiPlace,
} from "@/lib/api/places";
import type { Place } from "@/types/database";

async function getRecommendedPlaces(): Promise<Place[]> {
    try {
        const places = await getFeaturedPlaces(6);

        return places.map(mapApiPlaceToLegacyPlace);
    } catch (error) {
        console.error("Recommended places D1 fetch error:", error);
        return [];
    }
}

function mapApiPlaceToLegacyPlace(place: ApiPlace): Place {
    return {
        ...place,

        /**
         * Adapter field lama.
         * Komponen PlaceCard masih memakai format Place lama.
         */
        maps_url: place.google_maps_url,
        is_published: Boolean(place.is_active),
        is_featured: Boolean(place.is_featured),

        /**
         * Fallback supaya komponen lama tidak crash.
         */
        tags: [],
        gallery: [],
    } as unknown as Place;
}

const quickFilters = [
    {
        emoji: "💻",
        label: "Buat Nugas",
        description: "Fokus, laptopan, dan kerja tugas.",
        href: "/places/?category=coffee-shop&tags=nugas,wifi,colokan",
    },
    {
        emoji: "💬",
        label: "Nongkrong",
        description: "Ngobrol lama bareng teman.",
        href: "/places/?category=coffee-shop&tags=nongkrong,rame",
    },
    {
        emoji: "🌿",
        label: "Me-time",
        description: "Tenang buat recharge sendiri.",
        href: "/places/?category=coffee-shop&tags=me-time,tenang",
    },
    {
        emoji: "💕",
        label: "First Date",
        description: "Nyaman buat ngobrol santai.",
        href: "/places/?category=coffee-shop&tags=nge-date,tenang",
    },
    {
        emoji: "⚡",
        label: "WFC",
        description: "WiFi, colokan, dan suasana nyaman.",
        href: "/places/?category=coffee-shop&tags=wfc,wifi,colokan",
    },
    {
        emoji: "🎵",
        label: "Live Musik",
        description: "Vibe rame dan hiburan musik.",
        href: "/places/?category=coffee-shop&tags=live-musik,rame",
    },
];

const facilityFilters = [
    {
        label: "WiFi + Colokan",
        href: "/places/?category=coffee-shop&tags=wifi,colokan",
    },
    {
        label: "Outdoor",
        href: "/places/?category=coffee-shop&tags=outdoor",
    },
    {
        label: "Indoor Smoking",
        href: "/places/?category=coffee-shop&tags=indoor-smoking",
    },
    {
        label: "Photobox",
        href: "/places/?category=coffee-shop&tags=photobox",
    },
    {
        label: "Board Game",
        href: "/places/?category=coffee-shop&tags=board-game",
    },
];

const budgetFilters = [
    {
        label: "Di bawah 20k",
        href: "/places/?category=coffee-shop&price=under-20k",
    },
    {
        label: "20k - 40k",
        href: "/places/?category=coffee-shop&price=20k-40k",
    },
    {
        label: "Di atas 40k",
        href: "/places/?category=coffee-shop&price=above-40k",
    },
];

export default async function RekomendasiPage() {
    const places = await getRecommendedPlaces();

    return (
        <main className="min-h-screen bg-[#F4F1EA] px-4 py-8 text-[#201813] sm:px-6 lg:px-8 lg:py-10">
            <div className="mx-auto max-w-7xl">
                <HeroSection />

                <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_340px]">
                    <ActivitySection />
                    <QuickPickSection />
                </section>

                <FeaturedSection places={places} />
            </div>
        </main>
    );
}

function HeroSection() {
    return (
        <section className="relative overflow-hidden rounded-[34px] border border-[#E7D8C8] bg-[#191614] p-6 text-white shadow-[0_24px_80px_rgba(32,24,19,0.18)] sm:p-8 lg:p-10">
            <HeroDecor />

            <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#F2C38B] backdrop-blur sm:text-xs">
                        <span className="h-2 w-2 rounded-full bg-[#F2C38B]" />
                        Kurasi Rekomendasi
                    </div>

                    <h1 className="mt-4 font-serif text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Cari tempat ngopi
                        <span className="block italic text-[#F2C38B]">sesuai kebutuhan kamu.</span>
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-white/70 sm:text-base">
                        Pilih mood, fasilitas, atau budget. Biar nggak asal scroll sampai
                        kopi keburu dingin.
                    </p>
                </div>

                <Link
                    href="/places/?category=coffee-shop"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#F2C38B] px-6 py-3 text-sm font-bold text-[#201813] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
                >
                    Explore Semua Tempat →
                </Link>
            </div>
        </section>
    );
}

function HeroDecor() {
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute right-[-90px] top-[-90px] h-72 w-72 rounded-full bg-[#C8784A]/25 blur-3xl" />
            <div className="absolute bottom-[-120px] left-[-120px] h-80 w-80 rounded-full bg-[#1F5A4A]/25 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_45%)]" />
        </div>
    );
}

function ActivitySection() {
    return (
        <section className="rounded-[32px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 shadow-[0_16px_50px_rgba(47,35,25,0.05)] sm:p-7">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                        Aktivitas
                    </p>

                    <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#201813] sm:text-3xl">
                        Mau ngopi buat apa?
                    </h2>
                </div>

                <p className="max-w-sm text-xs font-semibold text-[#756A60] sm:text-sm">
                    Pilih salah satu kebutuhan, langsung temukan tempat yang relevan.
                </p>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
                {quickFilters.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="group rounded-2xl border border-[#E7D8C8] bg-[#F8F1E8]/70 p-4.5 transition duration-300 hover:-translate-y-1 hover:border-[#1F5A4A]/35 hover:bg-[#1F5A4A] hover:shadow-[0_18px_45px_rgba(31,90,74,0.14)]"
                    >
                        <div className="flex items-start gap-3.5">
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-xl shadow-sm transition duration-300 group-hover:rotate-[-6deg] group-hover:scale-105">
                                {item.emoji}
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="font-serif text-base font-bold text-[#201813] transition group-hover:text-white">
                                    {item.label}
                                </h3>

                                <p className="mt-1 text-xs font-medium leading-5 text-[#756A60] transition group-hover:text-white/75">
                                    {item.description}
                                </p>

                                <p className="mt-3 text-xs font-bold text-[#1F5A4A] transition group-hover:text-white">
                                    Cek rekomendasi →
                                </p>
                            </div>
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
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                Quick Pick
            </p>

            <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#201813]">
                Filter Cepat
            </h2>

            <p className="mt-2 text-xs font-semibold leading-5 text-[#756A60]">
                Cari langsung berdasarkan fasilitas favorit atau perkiraan budget.
            </p>

            <div className="mt-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9B8C7C]">
                    Fasilitas
                </p>

                <div className="flex flex-wrap gap-2">
                    {facilityFilters.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-full border border-[#E7D8C8] bg-[#F8F1E8]/70 px-3.5 py-1.5 text-xs font-bold text-[#4B4038] shadow-sm transition hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mt-6 border-t border-[#E7D8C8]/60 pt-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9B8C7C]">
                    Budget / Range Harga
                </p>

                <div className="grid gap-2">
                    {budgetFilters.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-2xl border border-[#E7D8C8] bg-[#F8F1E8]/70 px-4 py-2.5 text-xs font-bold text-[#201813] transition hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}

function FeaturedSection({ places }: { places: Place[] }) {
    return (
        <section className="mt-8 rounded-[32px] border border-[#E7D8C8] bg-[#FFFDF8] p-6 shadow-[0_16px_50px_rgba(47,35,25,0.05)] sm:p-7">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C8784A]">
                        Featured Spots
                    </p>

                    <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#201813] sm:text-3xl">
                        Rekomendasi Pilihan
                    </h2>

                    <p className="mt-1.5 text-xs font-semibold text-[#756A60] sm:text-sm">
                        Koleksi coffee shop pilihan dengan suasana dan fasilitas terbaik di Padang.
                    </p>
                </div>

                <Link
                    href="/places/?category=coffee-shop"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#201813] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1F5A4A]"
                >
                    Lihat Semua Tempat →
                </Link>
            </div>

            {places.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-[#D7C5B2] bg-[#F8F1E8] p-8 text-center">
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