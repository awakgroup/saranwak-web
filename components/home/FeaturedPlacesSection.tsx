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

            {/* 4 Tall Vertical Cards with Overlay Info - Aligned with Stitch dec9997f853d48fb839362e5da60ed89 */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                            className="group relative flex h-96 cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#19120D] p-5 text-white shadow-bento transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-[#FF5C35]/50 hover:shadow-2xl active:scale-[0.99]"
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
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="pointer-events-none object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                            />

                            {/* Gradients */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#19120D] via-black/35 to-black/30" />

                            {/* Top Badges */}
                            <div className="pointer-events-none relative z-20 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <OpenStatusBadge openingHours={place.opening_hours} mode="compact" />

                                    {place.is_featured ? (
                                        <span
                                            title="Tempat Pilihan"
                                            className="grid h-6 w-6 place-items-center rounded-full bg-white shadow-sm"
                                        >
                                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
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
                                    className={`pointer-events-auto relative z-30 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 backdrop-blur-md transition-all active:scale-95 ${
                                        isSaved
                                            ? "bg-[#FF5C35] text-white"
                                            : "bg-black/40 text-white hover:bg-[#FF5C35]"
                                    }`}
                                >
                                    <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                                </button>
                            </div>

                            {/* Bottom Information Link */}
                            <div className="pointer-events-none relative z-20 block border-t border-white/15 pt-4 transition-colors">
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
                            </div>
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
