"use client";

import { useEffect, useMemo, useState } from "react";

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

const AUTO_SCROLL_DELAY = 4500;

export default function PromoBannerCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const total = promoBanners.length;

    const activeBanner = useMemo(() => {
        return promoBanners[activeIndex];
    }, [activeIndex]);

    const goPrev = () => {
        setActiveIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    };

    const goNext = () => {
        setActiveIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
    };

    useEffect(() => {
        if (isPaused || total <= 1) return;

        const interval = window.setInterval(() => {
            setActiveIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
        }, AUTO_SCROLL_DELAY);

        return () => window.clearInterval(interval);
    }, [isPaused, total]);

    return (
        <section className="relative bg-transparent px-0 py-0">
            <div
                className="relative mx-auto w-full max-w-6xl"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <a
                    href={activeBanner.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative block overflow-hidden rounded-[28px] border border-[#E6D8C7] bg-[#181818] shadow-[0_20px_60px_rgba(32,24,19,0.13)] transition duration-500 hover:-translate-y-0.5 sm:rounded-[34px]"
                >
                    <div className="relative min-h-[300px] sm:min-h-[330px] lg:min-h-[350px]">
                        <BannerBackground theme={activeBanner.theme} />

                        <div className="relative z-10 grid min-h-[300px] gap-6 p-5 sm:min-h-[330px] sm:p-7 md:grid-cols-[1fr_220px] md:items-center lg:min-h-[350px] lg:grid-cols-[1fr_280px] lg:p-10">
                            <div className="max-w-3xl">
                                <div className="inline-flex items-center rounded-full bg-[#FFFDF8] px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#201813] shadow-sm sm:text-xs">
                                    {activeBanner.badge}
                                </div>

                                <h3 className="mt-5 max-w-[16ch] text-[34px] font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-5xl lg:max-w-[18ch] lg:text-[62px]">
                                    {activeBanner.title}
                                </h3>

                                <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-white/75 sm:text-base sm:leading-7">
                                    {activeBanner.subtitle}
                                </p>

                                <div className="mt-6 inline-flex items-center justify-center rounded-full bg-[#FFFDF8] px-5 py-3 text-sm font-black text-[#201813] shadow-[0_14px_36px_rgba(0,0,0,0.18)] transition duration-300 group-hover:bg-[#F2C38B] sm:px-6">
                                    {activeBanner.ctaLabel}
                                    <span className="ml-2 transition duration-300 group-hover:translate-x-1">
                                        →
                                    </span>
                                </div>
                            </div>

                            <div className="relative hidden min-h-[220px] md:block">
                                <div className="absolute right-0 top-0 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-right backdrop-blur">
                                    <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/50">
                                        By
                                    </p>
                                    <p className="mt-1 max-w-[150px] truncate text-sm font-black text-white">
                                        {activeBanner.businessName}
                                    </p>
                                </div>

                                <div className="absolute bottom-4 right-5 h-36 w-36 rounded-[34px] border border-white/15 bg-white/10 backdrop-blur-md lg:h-40 lg:w-40" />
                                <div className="absolute bottom-0 right-28 h-24 w-24 rounded-[28px] border border-white/15 bg-[#F2C38B]/20 backdrop-blur-md" />
                                <div className="absolute right-36 top-16 h-16 w-16 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md" />
                            </div>
                        </div>
                    </div>
                </a>

                {total > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={goPrev}
                            aria-label="Promo sebelumnya"
                            className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#E7D8C8] bg-[#FFFDF8]/95 text-xl font-black text-[#1F5A4A] shadow-[0_14px_35px_rgba(32,24,19,0.18)] transition duration-300 hover:-translate-x-0.5 hover:bg-[#1F5A4A] hover:text-white md:grid"
                        >
                            ←
                        </button>

                        <button
                            type="button"
                            onClick={goNext}
                            aria-label="Promo berikutnya"
                            className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#E7D8C8] bg-[#FFFDF8]/95 text-xl font-black text-[#1F5A4A] shadow-[0_14px_35px_rgba(32,24,19,0.18)] transition duration-300 hover:translate-x-0.5 hover:bg-[#1F5A4A] hover:text-white md:grid"
                        >
                            →
                        </button>
                    </>
                )}

                {total > 1 && (
                    <div className="mt-4 flex items-center justify-center gap-2">
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
                )}
            </div>
        </section>
    );
}

function BannerBackground({ theme }: { theme: PromoBanner["theme"] }) {
    const gradient =
        theme === "green"
            ? "from-[#1C1611] via-[#1F5A4A] to-[#102D27]"
            : theme === "orange"
                ? "from-[#201813] via-[#9B542D] to-[#C8784A]"
                : "from-[#201813] via-[#3B2B20] to-[#122B25]";

    return (
        <>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(242,195,139,0.34),transparent_30%),radial-gradient(circle_at_88%_76%,rgba(31,90,74,0.4),transparent_35%)]" />

            <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:42px_42px]" />

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border border-white/10" />

            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/5" />
        </>
    );
}