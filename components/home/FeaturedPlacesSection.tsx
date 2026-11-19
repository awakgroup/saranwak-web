"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Bookmark, Star } from "lucide-react";
import { getSafePlaceImageUrl } from "@/lib/image-url";
import { useSavedPlaces, savePlaceToStorage } from "@/lib/saved-places";
import { OpenStatusBadge } from "@/components/OpenStatusBadge";
import type { Place } from "@/types/database";

type FeaturedPlacesSectionProps = {
    places: Place[];
};

export function FeaturedPlacesSection({ places }: FeaturedPlacesSectionProps) {
    const router = useRouter();
    const { isPlaceSaved } = useSavedPlaces();

    if (!places || places.length === 0) {
        return null;
    }

    // Limit to 4 cards to mirror the Stitch 4-column layout perfectly
    const displayPlaces = places.slice(0, 4);

    return (
        <section className="relative w-full" id="rekomendasi-populer">
            {/* Header matching Stitch Landing Page */}
            <div className="mb-3.5 flex items-end justify-between sm:mb-8">
                <div>
                    <div className="mb-1 flex items-center gap-1.5 sm:gap-2">
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#FF5C35]">
                            POPULAR DESTINATIONS
                        </span>
                        <span className="text-xs">☕</span>
                    </div>

                    <h2 className="font-sans text-xl sm:text-3xl font-extrabold tracking-tight text-[#19120D]">
                        Rekomendasi
                    </h2>
                    <p className="mt-0.5 hidden sm:block text-xs text-[#756A63] sm:text-sm">
                        Handpicked coffee shops di Padang dengan suasana kondusif dan rasa teruji.
                    </p>
                </div>

                <Link
                    href="/places?category=coffee-shop"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5C35] transition-colors hover:text-[#D8431F] sm:text-sm shrink-0"
                >
                    <span>Lihat Semua</span>
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>
            </div>

            {/* 4 Cards: Mobile Horizontal Snap Carousel (155x215), Desktop 4-Column Grid */}
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1.5 snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
                {displayPlaces.map((place) => {
                    const imageUrl = getSafePlaceImageUrl(place.image_url || place.main_image_url);
                    const district = getDistrictName(place);
                    const subtitle = getVibeSubtitle(place);
                    const priceLabel = getDisplayPrice(place);
                    const isSaved = isPlaceSaved(place.slug);

                    return (
                        <article
                            key={place.id}
                            onClick={() => router.push(`/places/${place.slug}`)}
                            className="group relative flex h-[215px] w-[155px] shrink-0 snap-start cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0d0401] p-3 text-white shadow-xs transition-all duration-300 hover:border-[#FF5C35]/50 active:scale-[0.98] sm:h-96 sm:w-auto sm:rounded-3xl sm:p-5 sm:shadow-bento"
                        >
                            {/* Accessible Link overlay for crawlers & keyboard navigation */}
                            <Link
                                href={`/places/${place.slug}`}
                                className="absolute inset-0 z-10"
                                aria-label={`Buka detail ${place.name}`}
                            />

                            {/* Background Image */}
                            <Image
                                src={imageUrl}
                                alt={place.name}
                                fill
                                sizes="(max-width: 640px) 160px, (max-width: 1024px) 50vw, 25vw"
                                className="pointer-events-none object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                            />

                            {/* Gradients */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d0401] via-black/40 to-transparent" />

                            {/* Top Badges */}
                            <div className="pointer-events-none relative z-20 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <OpenStatusBadge openingHours={place.opening_hours} mode="compact" />

                                    {place.is_featured ? (
                                        <span
                                            title="Tempat Pilihan"
                                            className="grid h-5 w-5 place-items-center rounded-full bg-white shadow-sm sm:h-6 sm:w-6"
                                        >
                                            <Star className="h-3 w-3 fill-amber-400 text-amber-500 sm:h-3.5 sm:w-3.5" />
                                        </span>
                                    ) : null}
                                </div>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        savePlaceToStorage(place);
                                    }}
                                    aria-label={`Simpan ${place.name}`}
                                    className={`pointer-events-auto relative z-30 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 backdrop-blur-md transition-all active:scale-95 sm:h-8 sm:w-8 ${
                                        isSaved
                                            ? "bg-[#FF5C35] text-white"
                                            : "bg-black/40 text-white hover:bg-[#FF5C35]"
                                    }`}
                                >
                                    <Bookmark className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isSaved ? "fill-current" : ""}`} />
                                </button>
                            </div>

                            {/* Bottom Information */}
                            <div className="pointer-events-none relative z-20 block border-t border-white/15 pt-2 sm:pt-4 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                                    <div className="min-w-0 flex-1 sm:pr-3">
                                        <span className="block text-[9px] font-bold uppercase tracking-wider text-[#ffdbd1] sm:text-[11px] sm:text-[#FDBA74]">
                                            {district}
                                        </span>
                                        <h3 className="truncate font-sans text-sm font-bold leading-tight text-white transition-colors group-hover:text-[#FDBA74] sm:text-base">
                                            {place.name}
                                        </h3>
                                        <span className="mt-0.5 hidden truncate text-[11px] text-white/80 sm:block">
                                            {subtitle}
                                        </span>
                                    </div>

                                    <div className="mt-1 shrink-0 text-left sm:mt-0 sm:text-right">
                                        <span className="hidden text-[10px] font-medium uppercase text-white/70 sm:block">
                                            Mulai
                                        </span>
                                        <span className="font-sans text-xs font-extrabold text-[#ffddb8] sm:text-sm sm:text-[#FDBA74]">
                                            {priceLabel}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* Mobile Carousel Indicator Dots matching Stitch 3f54a1c6760d4badb78d709f20d14900 */}
            <div className="flex items-center justify-center gap-1.5 mt-3 mb-2 sm:hidden">
                <span className="w-5 h-1.5 rounded-full bg-[#ac3311] transition-all" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#e4e2de] transition-all" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#e4e2de] transition-all" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#e4e2de] transition-all" />
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
        return place.short_description.slice(0, 36);
    }
    if (place.description) {
        return place.description.slice(0, 36);
    }
    return "Co-Working & WFC Tenang";
}

function getDisplayPrice(place: Place): string {
    if (place.price_range) {
        const match = place.price_range.match(/Rp?\s*(\d+)k/i);
        if (match && match[1]) {
            return `Rp ${match[1]}k`;
        }
        return place.price_range.split("-")[0].trim();
    }
    if (place.price_min) {
        return `Rp ${Math.round(place.price_min / 1000)}k`;
    }
    return "Rp 20k";
}
