"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bookmark } from "lucide-react";
import { getSafePlaceImageUrl } from "@/lib/image-url";
import { useSavedPlaces, savePlaceToStorage } from "@/lib/saved-places";
import type { Place } from "@/types/database";

type FeaturedPlacesSectionProps = {
    places: Place[];
};

export function FeaturedPlacesSection({ places }: FeaturedPlacesSectionProps) {
    const { isPlaceSaved } = useSavedPlaces();

    if (!places || places.length === 0) {
        return null;
    }

    // Limit to 4 cards to mirror the Stitch 4-column layout perfectly
    const displayPlaces = places.slice(0, 4);

    return (
        <section className="relative w-full" id="rekomendasi-populer">
            {/* Header matching Stitch Landing Page */}
            <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-end">
                <div>
                    <div className="mb-1.5 flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-[#FF5C35]">
                            POPULAR DESTINATIONS
                        </span>
                        <span>☕</span>
                    </div>

                    <h2 className="font-sans text-2xl font-extrabold tracking-tight text-[#19120D] sm:text-3xl">
                        Rekomendasi Terpopuler
                    </h2>
                    <p className="mt-1 text-xs text-[#756A63] sm:text-sm">
                        Handpicked coffee shops di Padang dengan suasana kondusif dan rasa teruji.
                    </p>
                </div>

                <Link
                    href="/places?category=coffee-shop"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5C35] transition-colors hover:text-[#D8431F] sm:text-sm"
                >
                    <span>Lihat Semua</span>
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            {/* 4 Tall Vertical Cards with Overlay Info */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {displayPlaces.map((place) => {
                    const imageUrl = getSafePlaceImageUrl(place.image_url);
                    const district = getDistrictName(place);
                    const subtitle = getVibeSubtitle(place);
                    const priceLabel = getDisplayPrice(place);
                    const isSaved = isPlaceSaved(place.slug);

                    return (
                        <article
                            key={place.id}
                            className="group relative flex h-96 flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#19120D] p-5 text-white shadow-md transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-[#FF5C35]/50 hover:shadow-2xl sm:h-[420px]"
                        >
                            {/* Background Image */}
                            <Image
                                src={imageUrl}
                                alt={place.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                            />

                            {/* Gradients */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#19120D] via-black/35 to-black/30" />

                            {/* Top Badges */}
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                                    <span className="h-2 w-2 animate-ping rounded-full bg-[#10B981]" />
                                    <span>{getOpeningStatus(place)}</span>
                                </div>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        savePlaceToStorage(place);
                                    }}
                                    aria-label={`Simpan ${place.name}`}
                                    className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/15 backdrop-blur-md transition-all active:scale-95 ${
                                        isSaved
                                            ? "bg-[#FF5C35] text-white"
                                            : "bg-black/40 text-white hover:bg-[#FF5C35]"
                                    }`}
                                >
                                    <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                                </button>
                            </div>

                            {/* Bottom Information Link */}
                            <Link
                                href={`/places/${place.slug}`}
                                className="relative z-10 block border-t border-white/15 pt-4 transition-colors"
                            >
                                <div className="flex items-end justify-between">
                                    <div className="min-w-0 flex-1 pr-3">
                                        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#FDBA74]">
                                            {district}
                                        </span>
                                        <h3 className="truncate font-sans text-base font-bold leading-snug text-white transition-colors group-hover:text-[#FDBA74]">
                                            {place.name}
                                        </h3>
                                        <span className="mt-0.5 block truncate text-[11px] text-white/80">
                                            {subtitle}
                                        </span>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        <span className="block text-[10px] font-medium uppercase text-white/70">
                                            Mulai
                                        </span>
                                        <span className="font-sans text-sm font-extrabold text-[#FDBA74]">
                                            {priceLabel}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

function getDistrictName(place: Place): string {
    if (place.area) {
        return place.area;
    }
    if (place.address) {
        const match = place.address.match(/Kec\.?\s*([a-zA-Z\s]+?)(?:,|$)/i);
        if (match?.[1]) {
            return match[1].trim();
        }
    }
    return "Padang Barat";
}

function getVibeSubtitle(place: Place): string {
    if (place.short_description) {
        return place.short_description.slice(0, 34);
    }
    return "Co-Working & WFC Santai";
}

function getOpeningStatus(place: Place): string {
    if (place.opening_hours) {
        if (place.opening_hours.toLowerCase().includes("24")) {
            return "24 Jam Nonstop";
        }
        return `Buka • ${place.opening_hours.slice(0, 15)}`;
    }
    return "Buka • Hingga 23:00";
}

function getDisplayPrice(place: Place): string {
    if (place.price_range) {
        if (place.price_range.includes("15k") || place.price_range.includes("18k")) {
            return "Rp 18k";
        }
        if (place.price_range.includes("20k") || place.price_range.includes("22k")) {
            return "Rp 22k";
        }
        if (place.price_range.includes("25k")) {
            return "Rp 25k";
        }
    }
    return "Rp 20k";
}
