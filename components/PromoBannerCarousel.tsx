"use client";

import { useState } from "react";

type PromoBanner = {
    id: number;
    title: string;
    subtitle: string;
    badge: string;
    href: string;
    ctaLabel: string;
    businessName: string;
    theme: "brown" | "green" | "orange";
};

const promoBanners: PromoBanner[] = [
    {
        id: 1,
        title: "Promo bisnis kamu bisa tampil di sini",
        subtitle:
            "Jangkau user yang sedang cari coffee shop, resto, dan spot lokal di Padang.",
        badge: "PROMO SPACE",
        href: "https://wa.me/6281932097214?text=Halo%20Saranwak%2C%20saya%20tertarik%20pasang%20promo%20banner",
        ctaLabel: "Pasang Promo",
        businessName: "Saranwak Ads",
        theme: "brown",
    },
    {
        id: 2,
        title: "Weekend deal, menu baru, event? Gas tampilkan.",
        subtitle:
            "Cocok untuk campaign cafe, resto, studio, event, dan bisnis lokal.",
        badge: "FEATURED PROMO",
        href: "https://wa.me/6281932097214?text=Halo%20Saranwak%2C%20saya%20ingin%20tanya%20paket%20promo%20banner",
        ctaLabel: "Tanya Paket",
        businessName: "Promo Lokal",
        theme: "green",
    },
    {
        id: 3,
        title: "Bikin tempat kamu lebih gampang ditemukan",
        subtitle:
            "Promo tampil di area strategis Saranwak untuk bantu tarik calon customer.",
        badge: "LOCAL BOOST",
        href: "https://wa.me/6281932097214?text=Halo%20Saranwak%2C%20saya%20mau%20bisnis%20saya%20tampil%20di%20banner",
        ctaLabel: "Mulai Kerja Sama",
        businessName: "Owner Bisnis",
        theme: "orange",
    },
];

export default function PromoBannerCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);

    const activeBanner = promoBanners[activeIndex];

    const goPrev = () => {
        setActiveIndex((prev) =>
            prev === 0 ? promoBanners.length - 1 : prev - 1
        );
    };

    const goNext = () => {
        setActiveIndex((prev) =>
            prev === promoBanners.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <section className="relative overflow-hidden bg-[#F4F1EA] px-4 pb-3 pt-5 sm:px-5 sm:pb-4 sm:pt-7 md:pb-5 md:pt-8 lg:pt-10">
            <div className="mx-auto max-w-7xl">
                <div className="relative">
                    {/* Side preview desktop */}
                    <div className="pointer-events-none absolute left-0 top-1/2 hidden h-[260px] w-[24%] -translate-x-[62%] -translate-y-1/2 overflow-hidden rounded-[26px] opacity-65 lg:block xl:h-[300px]">
                        <SideBanner index={getPrevIndex(activeIndex)} />
                    </div>

                    <div className="pointer-events-none absolute right-0 top-1/2 hidden h-[260px] w-[24%] translate-x-[62%] -translate-y-1/2 overflow-hidden rounded-[26px] opacity-65 lg:block xl:h-[300px]">
                        <SideBanner index={getNextIndex(activeIndex)} />
                    </div>

                    {/* Main banner */}
                    <a
                        href={activeBanner.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative mx-auto block overflow-hidden rounded-[26px] border border-[#E7D8C8] bg-[#181818] shadow-[0_22px_60px_rgba(32,24,19,0.15)] transition duration-500 hover:-translate-y-1 sm:rounded-[32px] md:rounded-[36px] lg:max-w-5xl"
                    >
                        <div className="relative min-h-[340px] sm:min-h-[350px] md:min-h-[370px] lg:min-h-[360px] xl:min-h-[380px]">
                            <BannerBackground theme={activeBanner.theme} />

                            <div className="relative z-10 flex min-h-[340px] flex-col justify-between p-5 sm:min-h-[350px] sm:p-7 md:min-h-[370px] md:p-9 lg:min-h-[360px] lg:p-10 xl:min-h-[380px]">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="inline-flex max-w-[190px] items-center rounded-full bg-[#FFFDF8] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-[#201813] shadow-sm sm:max-w-none sm:px-4 sm:py-2 sm:text-xs">
                                        {activeBanner.badge}
                                    </div>

                                    <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-right backdrop-blur sm:px-4">
                                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/50 sm:text-[10px]">
                                            By
                                        </p>
                                        <p className="max-w-[92px] truncate text-xs font-black text-white sm:max-w-none sm:text-sm">
                                            {activeBanner.businessName}
                                        </p>
                                    </div>
                                </div>

                                <div className="max-w-[680px] pb-2">
                                    <h3 className="max-w-[13ch] text-[36px] font-black leading-[0.92] tracking-[-0.065em] text-white sm:max-w-[15ch] sm:text-5xl md:text-6xl lg:max-w-[16ch]">
                                        {activeBanner.title}
                                    </h3>

                                    <p className="mt-4 max-w-[520px] text-sm font-semibold leading-6 text-white/76 sm:text-base sm:leading-7">
                                        {activeBanner.subtitle}
                                    </p>

                                    <div className="mt-5 inline-flex items-center justify-center rounded-full bg-[#F2C38B] px-5 py-3 text-sm font-black text-[#201813] shadow-[0_14px_36px_rgba(0,0,0,0.18)] transition duration-300 group-hover:bg-white sm:mt-6 sm:px-6">
                                        {activeBanner.ctaLabel}
                                        <span className="ml-2 transition duration-300 group-hover:translate-x-1">
                                            →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>

                    {/* Desktop arrows - overlay */}
                    <button
                        type="button"
                        onClick={goPrev}
                        aria-label="Promo sebelumnya"
                        className="absolute left-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-[#FFFDF8] text-2xl font-black text-[#1F5A4A] shadow-[0_14px_35px_rgba(32,24,19,0.2)] transition duration-300 hover:-translate-x-1 hover:bg-[#1F5A4A] hover:text-white md:grid lg:left-[5%]"
                    >
                        ←
                    </button>

                    <button
                        type="button"
                        onClick={goNext}
                        aria-label="Promo berikutnya"
                        className="absolute right-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-[#FFFDF8] text-2xl font-black text-[#1F5A4A] shadow-[0_14px_35px_rgba(32,24,19,0.2)] transition duration-300 hover:translate-x-1 hover:bg-[#1F5A4A] hover:text-white md:grid lg:right-[5%]"
                    >
                        →
                    </button>
                </div>

                {/* Mobile controls + dots */}
                <div className="mt-4 flex items-center justify-center gap-4 md:hidden">
                    <button
                        type="button"
                        onClick={goPrev}
                        aria-label="Promo sebelumnya"
                        className="grid h-10 w-10 place-items-center rounded-full bg-[#FFFDF8] text-xl font-black text-[#1F5A4A] shadow-[0_10px_24px_rgba(32,24,19,0.14)] transition duration-300 active:scale-95"
                    >
                        ←
                    </button>

                    <div className="flex items-center justify-center gap-2">
                        {promoBanners.map((banner, index) => (
                            <button
                                key={banner.id}
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                aria-label={`Lihat banner ${index + 1}`}
                                className={`h-2.5 rounded-full transition-all duration-300 ${activeIndex === index
                                        ? "w-8 bg-[#C8784A]"
                                        : "w-2.5 bg-[#D8C9B7]"
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={goNext}
                        aria-label="Promo berikutnya"
                        className="grid h-10 w-10 place-items-center rounded-full bg-[#FFFDF8] text-xl font-black text-[#1F5A4A] shadow-[0_10px_24px_rgba(32,24,19,0.14)] transition duration-300 active:scale-95"
                    >
                        →
                    </button>
                </div>

                {/* Desktop dots */}
                <div className="mt-4 hidden justify-center gap-2 md:flex">
                    {promoBanners.map((banner, index) => (
                        <button
                            key={banner.id}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Lihat banner ${index + 1}`}
                            className={`h-2.5 rounded-full transition-all duration-300 ${activeIndex === index
                                    ? "w-9 bg-[#C8784A]"
                                    : "w-2.5 bg-[#D8C9B7] hover:bg-[#1F5A4A]"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function SideBanner({ index }: { index: number }) {
    const banner = promoBanners[index];

    return (
        <div className="relative h-full w-full overflow-hidden rounded-[26px] bg-[#181818]">
            <BannerBackground theme={banner.theme} compact />

            <div className="absolute inset-0 bg-[#201813]/38" />

            <div className="absolute bottom-5 left-5 right-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                    {banner.badge}
                </p>

                <h4 className="mt-2 line-clamp-2 text-2xl font-black leading-tight tracking-[-0.04em] text-white">
                    {banner.title}
                </h4>
            </div>
        </div>
    );
}

function BannerBackground({
    theme,
    compact = false,
}: {
    theme: PromoBanner["theme"];
    compact?: boolean;
}) {
    const gradient =
        theme === "green"
            ? "from-[#1C1611] via-[#1F5A4A] to-[#102D27]"
            : theme === "orange"
                ? "from-[#201813] via-[#9B542D] to-[#C8784A]"
                : "from-[#201813] via-[#3B2B20] to-[#122B25]";

    return (
        <>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(242,195,139,0.36),transparent_30%),radial-gradient(circle_at_85%_75%,rgba(31,90,74,0.38),transparent_34%)]" />

            <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:38px_38px] sm:[background-size:42px_42px]" />

            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/10 sm:h-64 sm:w-64" />
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-white/10 sm:h-72 sm:w-72" />

            {!compact && (
                <>
                    <div className="absolute -right-10 bottom-8 h-28 w-28 rounded-[28px] border border-white/15 bg-white/10 backdrop-blur sm:right-10 sm:top-1/2 sm:h-36 sm:w-36 sm:-translate-y-1/2 sm:rounded-[32px]" />
                    <div className="absolute right-14 bottom-20 h-20 w-20 rounded-[24px] border border-white/15 bg-[#F2C38B]/20 backdrop-blur sm:right-24 sm:top-[58%] sm:h-24 sm:w-24 sm:-translate-y-1/2 sm:rounded-[26px]" />
                    <div className="hidden sm:absolute sm:right-36 sm:top-[38%] sm:block sm:h-16 sm:w-16 sm:rounded-2xl sm:border sm:border-white/15 sm:bg-white/10 sm:backdrop-blur" />
                </>
            )}
        </>
    );
}

function getPrevIndex(activeIndex: number) {
    return activeIndex === 0 ? promoBanners.length - 1 : activeIndex - 1;
}

function getNextIndex(activeIndex: number) {
    return activeIndex === promoBanners.length - 1 ? 0 : activeIndex + 1;
}