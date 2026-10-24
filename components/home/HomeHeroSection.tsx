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

                    <h1 className="max-w-3xl font-serif text-[42px] font-bold leading-[1.02] tracking-[-0.03em] text-[#201813] sm:text-6xl md:text-7xl">
                        Cari Coffee Shop di Padang
                        <span className="block italic text-[#1F5A4A]">sesuai mood kamu.</span>
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
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            {/* Ambient Warm Coffee & Forest Gradients */}
            <div className="absolute -left-24 -top-24 h-[560px] w-[560px] rounded-full bg-[#E59B63]/25 blur-[120px]" />
            <div className="absolute right-[-100px] top-4 h-[520px] w-[520px] rounded-full bg-[#1F5A4A]/15 blur-[130px]" />
            <div className="absolute left-1/3 top-1/4 h-[400px] w-[400px] rounded-full bg-[#FCE8D3]/35 blur-[100px]" />

            {/* Subtle Contour & Topographic Lines */}
            <svg
                className="absolute inset-0 h-full w-full opacity-[0.065]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
            >
                <path
                    d="M-100 130 C 200 50, 520 250, 920 110 C 1220 10, 1520 190, 1850 90"
                    stroke="#201813"
                    strokeWidth="1.5"
                />
                <path
                    d="M-100 230 C 220 150, 500 350, 940 210 C 1240 110, 1500 290, 1850 190"
                    stroke="#201813"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                />
                <path
                    d="M-100 330 C 180 250, 540 450, 900 310 C 1200 210, 1540 390, 1850 290"
                    stroke="#201813"
                    strokeWidth="1.5"
                />
                <circle cx="82%" cy="32%" r="190" stroke="#201813" strokeWidth="1" strokeDasharray="4 8" />
                <circle cx="82%" cy="32%" r="260" stroke="#201813" strokeWidth="0.75" />
            </svg>

            {/* Fine Paper Noise Grain Overlay */}
            <div
                className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Subtle Editorial Coordinates stamp */}
            <div className="absolute right-8 top-6 hidden font-mono text-[10px] font-bold tracking-[0.28em] text-[#201813]/25 sm:block">
                PADANG, WEST SUMATRA • 0°57′S 100°21′E
            </div>

            {/* Seamless Bottom Gradient Fade into #F4F1EA */}
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent via-[#F4F1EA]/40 to-[#F4F1EA]" />
        </div>
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

                            <h2 className="mt-3 max-w-sm font-serif text-5xl font-bold leading-[0.98] tracking-[-0.03em] text-white">
                                Ngopi,
                                <span className="block italic text-[#F2C38B]">nugas,</span>
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