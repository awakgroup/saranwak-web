import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import { PlaceCard } from "@/components/PlaceCard";
import type { Place } from "@/types/database";

async function getRecommendedPlaces() {
    try {
        const filePath = path.join(
            process.cwd(),
            "public",
            "data",
            "places.json"
        );

        const fileContent = await fs.readFile(filePath, "utf8");
        const places = JSON.parse(fileContent) as Place[];

        if (!Array.isArray(places)) {
            return [];
        }

        return places
            .filter((place) => place.is_published && place.is_featured)
            .sort((a, b) => {
                const dateA = new Date(a.created_at ?? 0).getTime();
                const dateB = new Date(b.created_at ?? 0).getTime();

                return dateB - dateA;
            })
            .slice(0, 6);
    } catch (error) {
        console.error("Recommended static places JSON read error:", error);
        return [];
    }
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
        <section className="relative overflow-hidden rounded-[34px] border border-[#E3DED4] bg-[#201813] p-5 text-white shadow-[0_22px_70px_rgba(32,24,19,0.13)] sm:p-7 lg:p-8">
            <HeroDecor />

            <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="max-w-4xl">
                    <div className="inline-flex rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#F2C38B] sm:text-xs">
                        Rekomendasi Saranwak
                    </div>

                    <h1 className="mt-4 max-w-4xl text-[40px] font-black leading-[0.95] tracking-[-0.065em] text-white sm:text-6xl lg:text-[72px]">
                        Cari tempat berdasarkan kebutuhan.
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-white/68 sm:text-base">
                        Pilih mood, fasilitas, atau budget. Biar nggak asal scroll sampai
                        kopi keburu dingin.
                    </p>
                </div>

                <Link
                    href="/places/?category=coffee-shop"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#F2C38B] px-6 py-3 text-sm font-black text-[#201813] transition hover:-translate-y-0.5 hover:bg-white"
                >
                    Explore semua →
                </Link>
            </div>
        </section>
    );
}

function HeroDecor() {
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute right-[-90px] top-[-90px] h-72 w-72 rounded-full bg-[#F2C38B]/20 blur-3xl" />
            <div className="absolute bottom-[-120px] left-[-120px] h-80 w-80 rounded-full bg-[#1F5A4A]/35 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_38%)]" />
        </div>
    );
}

function ActivitySection() {
    return (
        <section className="rounded-[30px] border border-[#E3DED4] bg-[#FFFDF8]/85 p-5 shadow-[0_18px_55px_rgba(47,35,25,0.05)] sm:p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                        Aktivitas
                    </p>

                    <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#201813] sm:text-3xl">
                        Mau ngopi buat apa?
                    </h2>
                </div>

                <p className="max-w-sm text-sm font-semibold leading-6 text-[#756A60]">
                    Pilih salah satu kebutuhan, nanti langsung masuk ke halaman explore.
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {quickFilters.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="group rounded-[22px] border border-[#E3DED4] bg-[#F8F1E8] p-4 transition hover:-translate-y-1 hover:border-[#1F5A4A]/35 hover:bg-[#1F5A4A] hover:shadow-[0_18px_45px_rgba(31,90,74,0.12)]"
                    >
                        <div className="flex items-start gap-3">
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#FFFDF8] text-xl transition group-hover:rotate-[-8deg] group-hover:scale-105">
                                {item.emoji}
                            </div>

                            <div className="min-w-0">
                                <h3 className="text-base font-black tracking-[-0.02em] text-[#201813] transition group-hover:text-white">
                                    {item.label}
                                </h3>

                                <p className="mt-1 text-xs font-semibold leading-5 text-[#756A60] transition group-hover:text-white/70">
                                    {item.description}
                                </p>

                                <p className="mt-3 text-xs font-black text-[#1F5A4A] transition group-hover:text-white">
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
        <aside className="rounded-[30px] border border-[#E3DED4] bg-[#FFFDF8]/85 p-5 shadow-[0_18px_55px_rgba(47,35,25,0.05)] sm:p-6 lg:sticky lg:top-24 lg:self-start">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                Quick Pick
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#201813]">
                Filter cepat
            </h2>

            <p className="mt-2 text-sm font-semibold leading-6 text-[#756A60]">
                Cari langsung berdasarkan fasilitas atau budget.
            </p>

            <div className="mt-5">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#9B8C7C]">
                    Fasilitas
                </p>

                <div className="flex flex-wrap gap-2">
                    {facilityFilters.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-full border border-[#E3DED4] bg-[#F8F1E8] px-3 py-2 text-xs font-black text-[#4B4038] transition hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#9B8C7C]">
                    Budget
                </p>

                <div className="grid gap-2">
                    {budgetFilters.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-2xl border border-[#E3DED4] bg-[#F8F1E8] px-4 py-3 text-sm font-black text-[#201813] transition hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:text-white"
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
        <section className="mt-6 rounded-[30px] border border-[#E3DED4] bg-[#FFFDF8]/85 p-5 shadow-[0_18px_55px_rgba(47,35,25,0.05)] sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                        Featured
                    </p>

                    <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#201813] sm:text-3xl">
                        Rekomendasi pilihan
                    </h2>

                    <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-[#756A60]">
                        Tempat pilihan dari data Saranwak yang sudah disiapkan untuk mode
                        static.
                    </p>
                </div>

                <Link
                    href="/places/?category=coffee-shop"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#E3DED4] bg-[#201813] px-5 py-3 text-sm font-black text-white transition hover:bg-[#1F5A4A]"
                >
                    Lihat semua
                </Link>
            </div>

            {places.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-[#D7C5B2] bg-[#F8F1E8] p-6 text-center">
                    <p className="text-sm font-black text-[#201813]">
                        Belum ada rekomendasi featured.
                    </p>

                    <p className="mt-2 text-sm font-semibold leading-6 text-[#756A60]">
                        Pastikan ada data dengan `is_featured: true` di
                        `public/data/places.json`.
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