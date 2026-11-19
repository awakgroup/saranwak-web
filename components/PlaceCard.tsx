"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bookmark, Star } from "lucide-react";
import type { Place } from "@/types/database";
import { getSafePlaceImageUrl } from "@/lib/image-url";
import { useSavedPlaces, savePlaceToStorage } from "@/lib/saved-places";
import { OpenStatusBadge } from "@/components/OpenStatusBadge";

type PlaceCardProps = {
    place: Place;
    source?: "homepage_featured" | "places_list" | "related_places" | "place_card";
    position?: number;
    userDistance?: string | null;
};

export function PlaceCard({ place, userDistance }: PlaceCardProps) {
    const router = useRouter();
    const { isPlaceSaved } = useSavedPlaces();
    const isSaved = isPlaceSaved(place.slug);
    const detailHref = `/places/${place.slug}`;
    const imageUrl = getSafePlaceImageUrl(place.image_url || place.main_image_url);
    const district = getPlaceArea(place);
    const subtitle = getPlaceSubtitle(place);
    const priceText = getDisplayPrice(place);

    return (
        <article
            onClick={() => router.push(detailHref)}
            className="group relative flex h-[195px] sm:h-[390px] cursor-pointer flex-col justify-between overflow-hidden rounded-xl sm:rounded-3xl border border-white/10 bg-[#0d0401] p-3 sm:p-5 text-white shadow-xs sm:shadow-bento transition-all duration-300 hover:-translate-y-1 hover:border-[#FF5C35]/50 hover:shadow-xl active:scale-[0.99]"
        >
            {/* Full Card Clickable Link */}
            <Link
                href={detailHref}
                prefetch={false}
                className="absolute inset-0 z-10"
                aria-label={`Buka detail ${place.name}`}
            />

            {/* Cover Photo */}
            <Image
                src={imageUrl}
                alt={place.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="pointer-events-none object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />

            {/* Gradient Overlays */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d0401] via-black/40 to-transparent" />

            {/* Top Badges */}
            <div className="pointer-events-none relative z-20 flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-1.5">
                    {userDistance ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FF5C35] px-2 py-0.5 text-[9.5px] sm:px-2.5 sm:py-1 sm:text-[11px] font-black uppercase text-white shadow-sm backdrop-blur">
                            <span>📍</span>
                            <span>{userDistance}</span>
                        </span>
                    ) : null}

                    <OpenStatusBadge openingHours={place.opening_hours} mode="compact" />

                    {place.is_featured ? (
                        <span
                            title="Tempat Pilihan"
                            className="grid h-4.5 w-4.5 place-items-center rounded-full bg-white shadow-sm sm:h-6 sm:w-6"
                        >
                            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-500 sm:h-3.5 sm:w-3.5" />
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
                    className={`pointer-events-auto flex h-6.5 w-6.5 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white/20 backdrop-blur-md transition-all active:scale-95 ${
                        isSaved
                            ? "bg-[#FF5C35] text-white"
                            : "bg-black/40 text-white hover:bg-[#FF5C35]"
                    }`}
                >
                    <Bookmark className={`h-3 w-3 sm:h-4 sm:w-4 ${isSaved ? "fill-current" : ""}`} />
                </button>
            </div>

            {/* Bottom Information */}
            <div className="pointer-events-none relative z-20 block border-t border-white/15 pt-2 sm:pt-4 transition-colors">
                <div className="flex items-end justify-between">
                    <div className="min-w-0 flex-1 pr-2 sm:pr-3">
                        <span className="block text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#ffdbd1] sm:text-[#FDBA74]">
                            {district}
                        </span>
                        <h3 className="truncate font-sans text-[14px] sm:text-lg font-bold leading-snug text-white transition-colors group-hover:text-[#FDBA74]">
                            {place.name}
                        </h3>
                        <span className="mt-0.5 block truncate text-[10px] sm:text-[11px] text-white/80">
                            {subtitle}
                        </span>
                    </div>

                    <div className="shrink-0 text-right">
                        <span className="block text-[8px] sm:text-[10px] font-medium uppercase text-white/70">
                            Mulai
                        </span>
                        <span className="font-sans text-[11.5px] sm:text-sm font-extrabold text-[#ffddb8] sm:text-[#FDBA74]">
                            {priceText}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
}

function getPlaceArea(place: Place): string {
    if (place.area) {
        return place.area;
    }
    if (place.address) {
        const match = place.address.match(/Kec\.?\s*([a-zA-Z\s]+?)(?:,|$)/i);
        if (match?.[1]) {
            return match[1].trim();
        }
    }
    return place.city || "Padang";
}

function getPlaceSubtitle(place: Place): string {
    if (place.short_description) {
        return place.short_description.slice(0, 38);
    }
    if (place.description) {
        return place.description.slice(0, 38);
    }
    return "Tempat ngopi & ruang kerja santai";
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
        if (place.price_range.includes("30k") || place.price_range.includes("35k")) {
            return "Rp 30k";
        }
    }
    if (place.price_min) {
        return `Rp ${Math.round(place.price_min / 1000)}k`;
    }
    return "Rp 20k";
}
