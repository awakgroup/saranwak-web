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
        emoji: "💻",
        label: "Buat Nugas",
        description: "Fokus, laptopan, dan kerja tugas.",
        href: "/places?category=coffee-shop&tags=nugas,wifi,colokan",
    },
    {
        emoji: "💬",
        label: "Nongkrong",
        description: "Ngobrol lama bareng teman.",
        href: "/places?category=coffee-shop&tags=nongkrong,rame",
    },
    {
        emoji: "🌿",
        label: "Me-time",
        description: "Tenang buat recharge sendiri.",
        href: "/places?category=coffee-shop&tags=me-time,tenang",
    },
    {
        emoji: "💕",
        label: "First Date",
        description: "Nyaman buat ngobrol santai.",
        href: "/places?category=coffee-shop&tags=nge-date,tenang",
    },
    {
        emoji: "⚡",
        label: "WFC",
        description: "WiFi, colokan, dan suasana nyaman.",
        href: "/places?category=coffee-shop&tags=wfc,wifi,colokan",
    },
    {
        emoji: "🎵",
        label: "Live Musik",
        description: "Vibe rame dan hiburan musik.",
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
                    href="/places?category=coffee-shop"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#F2C38B] px-6 py-3 text-sm font-black text-[#201813] transition hover:-translate-y-0.5 hover:bg-white"
                >
                    Explore semua →
                </Link>
            </div>
        </section>
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
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9B8C7C]">
                    Fasilitas
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                    {facilityFilters.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-full border border-[#E3DED4] bg-[#F8F1E8] px-3.5 py-2 text-xs font-black text-[#4B4038] transition hover:bg-[#1F5A4A] hover:text-white"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mt-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9B8C7C]">
                    Budget
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                    {budgetFilters.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-full border border-[#E3DED4] bg-[#F8F1E8] px-3.5 py-2 text-xs font-black text-[#4B4038] transition hover:bg-[#1F5A4A] hover:text-white"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mt-6 rounded-[22px] bg-[#201813] p-4 text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F2C38B]">
                    Explore manual
                </p>

                <h3 className="mt-2 text-lg font-black">Mau pilih sendiri?</h3>

                <p className="mt-2 text-xs font-semibold leading-5 text-white/60">
                    Buka semua coffee shop dan pakai filter lengkap.
                </p>

                <Link
                    href="/places?category=coffee-shop"
                    className="mt-4 inline-flex w-full min-h-10 items-center justify-center rounded-full bg-[#F2C38B] px-4 py-2 text-xs font-black text-[#201813] transition hover:bg-white"
                >
                    Lihat semua
                </Link>
            </div>
        </aside>
    );
}

function FeaturedSection({ places }: { places: Place[] }) {
    return (
        <section className="mt-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C8784A]">
                        Featured
                    </p>

                    <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] text-[#201813] sm:text-3xl">
                        Pilihan dari Saranwak
                    </h2>

                    <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-[#756A60]">
                        Tempat yang sedang di-highlight buat kamu yang mau langsung cek.
                    </p>
                </div>

                <Link
                    href="/places?category=coffee-shop"
                    className="hidden rounded-full border border-[#E3DED4] bg-[#FFFDF8] px-5 py-3 text-sm font-black text-[#1F5A4A] transition hover:bg-[#1F5A4A] hover:text-white sm:inline-flex"
                >
                    Lihat semua
                </Link>
            </div>

            {places.length === 0 ? (
                <div className="rounded-[28px] border border-[#E3DED4] bg-[#FFFDF8] p-7 text-center shadow-[0_16px_50px_rgba(47,35,25,0.04)]">
                    <p className="text-lg font-black">Belum ada rekomendasi.</p>

                    <p className="mt-2 text-sm font-semibold text-[#756A60]">
                        Pastikan ada data tempat dengan status published dan featured.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {places.map((place, index) => (
                            <PlaceCard
                                key={place.id}
                                place={place}
                                source="place_card"
                                position={index + 1}
                            />
                        ))}
                    </div>

                    <Link
                        href="/places?category=coffee-shop"
                        className="mt-5 inline-flex w-full min-h-12 items-center justify-center rounded-full bg-[#201813] px-5 py-3 text-sm font-black text-white sm:hidden"
                    >
                        Lihat semua coffee shop →
                    </Link>
                </>
            )}
        </section>
    );
}

function HeroDecor() {
    return (
        <>
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#F2C38B]/18 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-[#1F5A4A]/38 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:44px_44px]" />
        </>
    );
}