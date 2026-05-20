import Link from "next/link";
import { HeroSearch } from "@/components/HeroSearch";
import { homeCategories } from "@/constant/home";


export function HomeHeroSection() {
    return (
        <section className="relative overflow-hidden px-4 pb-10 pt-4 sm:px-5 sm:pt-5 md:pb-14 md:pt-6 lg:pb-16 lg:pt-7">
            <HeroBackground />

            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
                <div className="min-w-0">
                    <HeroBadge />

                    <h1 className="max-w-3xl text-[40px] font-black leading-[0.96] tracking-[-0.06em] text-[#201813] sm:text-6xl md:text-7xl">
                        Cari Coffee Shop di Padang
                        <span className="block text-[#1F5A4A]">sesuai mood kamu.</span>
                    </h1>

                    <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-[#756A60] sm:text-lg sm:leading-8">
                        Saranwak bantu kamu menemukan coffee shop di Padang berdasarkan
                        budget, aktivitas, fasilitas, dan vibes. Cocok buat nugas,
                        nongkrong, first date, meeting santai, sampai ngopi sendirian.
                    </p>

                    <HeroSearch />
                </div>

                <HeroVisualCard />
            </div>
        </section>
    );
}

function HeroBackground() {
    return (
        <>
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,#C8784A22,transparent_34%),radial-gradient(circle_at_88%_18%,#1F5A4A1F,transparent_30%)]" />
            <div className="absolute left-0 top-0 -z-10 h-full w-full bg-[linear-gradient(180deg,#FFF8EF00,#F4F1EA_88%)]" />
        </>
    );
}

function HeroBadge() {
    return (
        <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-[#E7D8C8] bg-[#FFFDF8]/90 px-3 py-2 text-xs font-black text-[#1F5A4A] shadow-sm backdrop-blur sm:px-4 sm:text-sm">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#C8784A]" />
            <span className="truncate">Local coffee shop guide dari Padang</span>
        </div>
    );
}

function HeroVisualCard() {
    return (
        <div className="relative hidden lg:block lg:pl-2">
            <div className="absolute -right-10 top-10 h-44 w-44 rounded-full bg-[#1F5A4A]/20 blur-3xl sm:h-56 sm:w-56" />
            <div className="absolute -bottom-8 left-8 h-40 w-40 rounded-full bg-[#C8784A]/20 blur-3xl sm:h-48 sm:w-48" />

            <div className="relative z-10 overflow-hidden rounded-[40px] border border-[#E7D8C8] bg-[#FFFDF8] p-4 shadow-[0_26px_80px_rgba(32,24,19,0.14)]">
                <div className="overflow-hidden rounded-[30px] bg-[#181818]">
                    <div className="relative min-h-[360px] p-6 text-white">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,#C8784A66,transparent_28%),radial-gradient(circle_at_80%_24%,#1F5A4A70,transparent_30%),linear-gradient(135deg,#181818,#2A241F)]" />
                        <div className="absolute -right-16 top-20 h-44 w-44 rounded-full border border-white/10" />
                        <div className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full border border-white/10" />

                        <div className="relative z-10 flex items-center justify-between gap-4">
                            <span className="rounded-full bg-[#FFFDF8] px-4 py-2 text-xs font-black text-[#201813]">
                                Padang Guide
                            </span>

                            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-2xl backdrop-blur">
                                ☕
                            </span>
                        </div>

                        <div className="relative z-10 mt-10">
                            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/50">
                                Mood Finder
                            </p>

                            <h2 className="mt-3 max-w-sm text-5xl font-black leading-[0.92] tracking-[-0.06em] text-white">
                                Ngopi,
                                <span className="block text-[#F2C38B]">nugas,</span>
                                nongkrong.
                            </h2>

                            <p className="mt-5 max-w-sm text-sm font-semibold leading-7 text-white/66">
                                Pilih kebutuhan kamu, lalu Saranwak bantu munculin tempat yang
                                paling cocok. Tanpa drama “di mana ya enaknya?”.
                            </p>
                        </div>

                        <div className="relative z-10 mt-7 grid gap-3">
                            {homeCategories.map((category) => (
                                <Link
                                    key={category.label}
                                    href={category.href}
                                    className="group rounded-[22px] border border-white/10 bg-white/[0.08] p-4 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/[0.13]"
                                >
                                    <div className="flex gap-4">
                                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#FFFDF8] text-2xl transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
                                            {category.emoji}
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="font-black text-white">
                                                {category.label}
                                            </h3>

                                            <p className="mt-1 text-sm font-medium leading-6 text-white/64">
                                                {category.desc}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <HeroStats />
                    </div>
                </div>
            </div>

            <div className="absolute -bottom-4 left-1/2 z-20 w-fit -translate-x-1/2 rotate-[-2deg] whitespace-nowrap rounded-2xl bg-[#C8784A] px-5 py-3 text-xs font-black text-white shadow-xl">
                Mulai dari Padang dulu
            </div>
        </div>
    );
}

function HeroStats() {
    const stats = [
        {
            value: "32+",
            label: "Places",
        },
        {
            value: "4",
            label: "Filter",
        },
        {
            value: "1",
            label: "Kota",
        },
    ];

    return (
        <div className="relative z-10 mt-4 grid grid-cols-3 gap-2">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.08] p-3"
                >
                    <p className="text-2xl font-black text-[#F2C38B]">{stat.value}</p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
                        {stat.label}
                    </p>
                </div>
            ))}
        </div>
    );
}