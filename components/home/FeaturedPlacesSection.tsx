"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { getSafePlaceImageUrl } from "@/lib/image-url";
import type { Place } from "@/types/database";

type FeaturedPlacesSectionProps = {
    places: Place[];
};

export function FeaturedPlacesSection({ places }: FeaturedPlacesSectionProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    function scroll(direction: "left" | "right") {
        if (!scrollContainerRef.current) return;
        const scrollAmount = 360;
        scrollContainerRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    }

    if (!places || places.length === 0) {
        return null;
    }

    return (
        <section className="relative">
            {/* Header matching ROAMLY mockup */}
            <div className="mb-6 flex flex-col gap-6 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    {/* Terracotta Accent Line */}
                    <div className="mb-3 h-1.5 w-14 rounded-full bg-[#C8784A]" />

                    <h2 className="font-serif text-3xl font-bold tracking-[-0.03em] text-[#201813] sm:text-4xl md:text-5xl">
                        Top Places
                    </h2>

                    <p className="mt-2 text-sm font-semibold text-[#756A60] sm:text-base">
                        Handpicked coffee shops di Padang untuk melengkapi harimu.
                    </p>
                </div>

                {/* Slider Navigation Arrow Buttons & "Lihat Semua" Link */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/places?category=coffee-shop"
                        className="hidden text-xs font-bold uppercase tracking-wider text-[#1F5A4A] transition hover:text-[#C8784A] sm:inline-block sm:mr-3"
                    >
                        Lihat Semua →
                    </Link>

                    {/* Prev Circle Button (Outline) */}
                    <button
                        type="button"
                        onClick={() => scroll("left")}
                        aria-label="Previous places"
                        className="grid h-11 w-11 place-items-center rounded-full border border-[#D8C9B7] bg-[#FFFDF8] text-[#201813] shadow-sm transition duration-200 hover:border-[#201813] hover:bg-white active:scale-95"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>

                    {/* Next Circle Button (Dark Green Filled) */}
                    <button
                        type="button"
                        onClick={() => scroll("right")}
                        aria-label="Next places"
                        className="grid h-11 w-11 place-items-center rounded-full bg-[#1F5A4A] text-white shadow-md shadow-[#1F5A4A]/25 transition duration-200 hover:bg-[#174639] hover:scale-105 active:scale-95"
                    >
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Horizontal Scrollable Carousel Container */}
            <div
                ref={scrollContainerRef}
                className="no-scrollbar -mx-4 flex gap-5 overflow-x-auto px-4 pb-4 pt-1 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
                style={{ scrollSnapType: "x mandatory" }}
            >
                {places.map((place) => {
                    const imageUrl = getSafePlaceImageUrl(place.image_url);
                    const locationSubtitle = getPlaceSubtitle(place);

                    return (
                        <div
                            key={place.id}
                            className="w-[280px] shrink-0 sm:w-[320px] md:w-[360px]"
                            style={{ scrollSnapAlign: "start" }}
                        >
                            <Link
                                href={`/places/${place.slug}`}
                                className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[28px] border border-[#E7D8C8]/60 bg-[#1A1614] shadow-[0_12px_36px_rgba(32,24,19,0.12)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(32,24,19,0.22)]"
                            >
                                {/* Cover Photo */}
                                <Image
                                    src={imageUrl}
                                    alt={place.name}
                                    fill
                                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 360px"
                                    className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108"
                                />

                                {/* Multi-layer gradient overlays for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />

                                {/* Top-Right Floating Circle Badge with Diagonal Arrow */}
                                <div className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/30 text-white backdrop-blur-md shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:bg-[#C8784A] group-hover:border-[#C8784A] group-hover:shadow-lg">
                                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </div>

                                {/* Bottom Place Info */}
                                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                                    <h3 className="font-serif text-xl font-bold tracking-tight text-white transition-colors duration-200 group-hover:text-[#F2C38B] sm:text-2xl">
                                        {place.name}
                                    </h3>

                                    <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-white/80 sm:text-sm">
                                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#E5A86D]" />
                                        <span className="truncate">{locationSubtitle}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* Mobile View All button */}
            <div className="mt-4 sm:hidden">
                <Link
                    href="/places?category=coffee-shop"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-[#E7D8C8] bg-[#FFFDF8] py-3 text-xs font-bold text-[#201813] shadow-sm transition active:scale-98"
                >
                    <span>Lihat Semua Coffee Shop</span>
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </section>
    );
}

function getPlaceSubtitle(place: Place): string {
    if (place.area) {
        return `${place.area} • Spot Pilihan`;
    }
    if (place.address) {
        const match = place.address.match(/Kec\.?\s*([a-zA-Z\s]+?)(?:,|$)/i);
        if (match?.[1]) {
            return `${match[1].trim()} • Spot Pilihan`;
        }
    }
    return "Kota Padang • Coffee & Lifestyle";
}
