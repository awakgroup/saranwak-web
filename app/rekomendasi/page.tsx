import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PlaceCard } from "@/components/PlaceCard";
import type { Place } from "@/types/database";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getRecommendedPlaces() {
    const { data, error } = await supabase
        .from("places")
        .select(
            `
            *,
            categories (
                id,
                name,
                slug,
                icon
            ),
            place_tags (
                id,
                tag_id,
                tags (
                    id,
                    name,
                    slug,
                    type
                )
            )
        `
        )
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(6);

    if (error) {
        console.error("Recommended places error:", error.message);
        return [];
    }

    return data as unknown as Place[];
}

const quickFilters = [
    {
        label: "Buat Nugas",
        description: "Cari coffee shop yang cocok buat fokus, laptopan, dan kerja tugas.",
        href: "/places?category=coffee-shop&tags=nugas,wifi,colokan",
    },
    {
        label: "Nge-date",
        description: "Tempat yang nyaman buat ngobrol santai dan nggak awkward.",
        href: "/places?category=coffee-shop&tags=nge-date,tenang",
    },
    {
        label: "Nongkrong",
        description: "Buat kumpul, ngobrol lama, dan chill bareng teman.",
        href: "/places?category=coffee-shop&tags=nongkrong,rame",
    },
    {
        label: "Me-time",
        description: "Cari tempat yang lebih tenang buat sendiri atau recharge.",
        href: "/places?category=coffee-shop&tags=me-time,tenang",
    },
    {
        label: "WFC",
        description: "Work from cafe dengan WiFi, colokan, dan suasana nyaman.",
        href: "/places?category=coffee-shop&tags=wfc,wifi,colokan",
    },
    {
        label: "Live Musik",
        description: "Cari tempat yang punya vibe rame dan hiburan musik.",
        href: "/places?category=coffee-shop&tags=live-musik,rame",
    },
];

const facilityFilters = [
    {
        label: "WiFi + Colokan",
        href: "/places?category=coffee-shop&tags=wifi,colokan",
    },
    {
        label: "Outdoor",
        href: "/places?category=coffee-shop&tags=outdoor",
    },
    {
        label: "Indoor Smoking",
        href: "/places?category=coffee-shop&tags=indoor-smoking",
    },
    {
        label: "Photobox",
        href: "/places?category=coffee-shop&tags=photobox",
    },
    {
        label: "Board Game",
        href: "/places?category=coffee-shop&tags=board-game",
    },
];

const budgetFilters = [
    {
        label: "Di bawah 20k",
        href: "/places?category=coffee-shop&price=under-20k",
    },
    {
        label: "20k - 40k",
        href: "/places?category=coffee-shop&price=20k-40k",
    },
    {
        label: "Di atas 40k",
        href: "/places?category=coffee-shop&price=above-40k",
    },
];

export default async function RekomendasiPage() {
    const places = await getRecommendedPlaces();

    return (
        <main className="min-h-screen bg-[#F6F0E7] px-5 py-12 text-[#201813]">
            <section className="mx-auto max-w-6xl">
                <div className="overflow-hidden rounded-[36px] border border-[#E7D8C8] bg-[#FFFDF8]">
                    <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="p-8 md:p-12">
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C8784A]">
                                Rekomendasi Saranwak
                            </p>

                            <h1 className="mt-3 max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
                                Mau cari coffee shop buat aktivitas apa?
                            </h1>

                            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#756A60]">
                                Pilih rekomendasi berdasarkan aktivitas, fasilitas,
                                vibes, dan budget. Biar nggak asal scroll sampai
                                kopi keburu dingin.
                            </p>

                            <div className="mt-8">
                                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#C8784A]">
                                    Aktivitas
                                </p>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    {quickFilters.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="group rounded-[24px] border border-[#E7D8C8] bg-[#F6F0E7]/60 p-5 transition hover:-translate-y-1 hover:border-[#1F5A4A] hover:bg-[#1F5A4A] hover:shadow-[0_20px_60px_rgba(31,90,74,0.14)]"
                                        >
                                            <h2 className="text-lg font-black text-[#201813] transition group-hover:text-white">
                                                {item.label}
                                            </h2>

                                            <p className="mt-2 text-sm leading-6 text-[#756A60] transition group-hover:text-white/75">
                                                {item.description}
                                            </p>

                                            <p className="mt-4 text-sm font-black text-[#1F5A4A] transition group-hover:text-white">
                                                Cek rekomendasi →
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-[#E7D8C8] bg-[#201813] p-8 text-white lg:border-l lg:border-t-0 md:p-12">
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C8784A]">
                                Quick Pick
                            </p>

                            <h2 className="mt-3 text-4xl font-black leading-tight">
                                Filter cepat buat cari yang pas.
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-white/60">
                                Kamu juga bisa langsung cari berdasarkan fasilitas
                                atau budget. Simple, no ribet-ribet club.
                            </p>

                            <div className="mt-8">
                                <p className="text-xs font-black uppercase tracking-[0.24em] text-white/40">
                                    Fasilitas
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {facilityFilters.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-bold text-white transition hover:bg-white hover:text-[#201813]"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8">
                                <p className="text-xs font-black uppercase tracking-[0.24em] text-white/40">
                                    Budget
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {budgetFilters.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-bold text-white transition hover:bg-white hover:text-[#201813]"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-10 rounded-[26px] border border-white/10 bg-white/[0.06] p-5">
                                <p className="text-xs font-black uppercase tracking-[0.24em] text-white/40">
                                    Semua Tempat
                                </p>

                                <h3 className="mt-2 text-xl font-black">
                                    Mau eksplor sendiri?
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-white/60">
                                    Buka semua coffee shop dan pakai multi filter
                                    lengkap dari halaman Explore.
                                </p>

                                <Link
                                    href="/places?category=coffee-shop"
                                    className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-[#201813] transition hover:bg-[#F6F0E7]"
                                >
                                    Lihat Semua Coffee Shop
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C8784A]">
                                Featured
                            </p>

                            <h2 className="mt-2 text-3xl font-black">
                                Pilihan dari Saranwak
                            </h2>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-[#756A60]">
                                Tempat pilihan yang sedang di-highlight. Cocok
                                buat kamu yang mau langsung cek tanpa pilih
                                filter dulu.
                            </p>
                        </div>

                        <Link
                            href="/places?category=coffee-shop"
                            className="w-fit rounded-full border border-[#E7D8C8] bg-[#FFFDF8] px-5 py-3 text-sm font-black text-[#1F5A4A] transition hover:bg-[#1F5A4A] hover:text-white"
                        >
                            Lihat semua
                        </Link>
                    </div>

                    {places.length === 0 ? (
                        <div className="rounded-[32px] border border-[#E7D8C8] bg-[#FFFDF8] p-10 text-center">
                            <p className="text-lg font-black">
                                Belum ada rekomendasi.
                            </p>

                            <p className="mt-2 text-[#756A60]">
                                Pastikan ada data tempat dengan status published
                                dan featured.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-3">
                            {places.map((place) => (
                                <PlaceCard
                                    key={place.id}
                                    place={place}
                                    source="related_places"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}